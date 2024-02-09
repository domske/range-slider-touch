import { Component, Element, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { clamp } from '../../utils/utils';

export interface RangeSliderChangeEvent {
  value: number;
}

@Component({
  tag: 'range-slider-touch',
  styleUrl: 'range-slider-touch.scss',
  shadow: true,
})
export class RangeSliderTouchComponent {
  @Prop({ mutable: true }) value = 50;

  @Prop() min = 0;
  @Prop() max = 100;

  /** Specifies the value granularity. */
  @Prop() step = 1;

  /** Long press time in milliseconds. */
  @Prop() time = 300;

  @Prop() disabled?: boolean;

  @Watch('min')
  @Watch('max')
  protected rangeChanged(): void {
    this.clampValue();
  }

  /** Emits value on move, press and release. */
  @Event() input!: EventEmitter<RangeSliderChangeEvent>;
  /** Emits value only on release and changed. */
  @Event() change!: EventEmitter<RangeSliderChangeEvent>;

  @Element() el: HTMLElement;

  @State() percent = 0;
  @State() active = false;
  @State() touch = false;

  /** Used for change detection. */
  private _value?: number;
  private _valueInput?: number;

  elSlider!: HTMLElement;

  connectedCallback() {
    this.clampValue();
    this.toPercent();
  }

  toPercent() {
    this.percent = ((this.value - this.min) / (this.max - this.min)) * 100;
    this.percent = clamp(this.percent, 0, 100);
  }

  clampValue() {
    this.value = clamp(this.value, this.min, this.max);
  }

  sliderMove(rect: DOMRect, event: MouseEvent | TouchEvent, released = false) {
    // Firefox quirk: TouchEvent is not defined globally. We cannot use instanceof.
    const input = 'changedTouches' in event ? event.changedTouches[0] : event;

    this.percent = ((input.clientX - rect.x) * 100) / rect.width;
    this.percent = clamp(this.percent, 0, 100);

    this.value = this.min + (this.percent / 100) * (this.max - this.min);

    if (this.step) {
      const snap = this.percent < 25 ? Math.floor : this.percent > 75 ? Math.ceil : Math.round;
      this.value = snap((this.value - this.min) / this.step) * this.step + this.min;
    }

    this.clampValue();
    this.toPercent();

    if (this.value !== this._valueInput) {
      this.input.emit({ value: this.value });
      this._valueInput = this.value;
    }

    if (released) {
      if (this.value !== this._value) {
        this.change.emit({ value: this.value });
        this._value = this.value;
      }
    }
  }

  @Listen('mousedown')
  onMouseDown(event: MouseEvent) {
    if (this.disabled) {
      return;
    }

    this.touch = false;
    const rect = this.elSlider.getBoundingClientRect();
    const moveFn = (event: MouseEvent) => {
      this.active = true;
      this.sliderMove(rect, event);
    };

    this.sliderMove(rect, event);
    window.addEventListener('mousemove', moveFn);

    const onMouseUp = (event: MouseEvent) => {
      window.removeEventListener('mousemove', moveFn);
      this.sliderMove(rect, event, true);
      this.active = false;
    };

    window.addEventListener('mouseup', onMouseUp, { once: true });
  }

  @Listen('touchstart')
  onTouchStart(event: TouchEvent) {
    if (this.disabled) {
      return;
    }

    this.touch = true;
    let moved = false;
    const rect = this.elSlider.getBoundingClientRect();
    const moveFn = this.sliderMove.bind(this, rect);

    const timer = setTimeout(() => {
      this.sliderMove(rect, event);
      window.addEventListener('touchmove', moveFn);

      const onTouchEnd = (event: TouchEvent) => {
        window.removeEventListener('touchmove', moveFn);
        this.sliderMove(rect, event, true);
        this.active = false;
      };

      window.addEventListener('touchend', onTouchEnd, { once: true });
      this.active = true;
    }, this.time);

    window.addEventListener(
      'touchend',
      (event) => {
        clearTimeout(timer);
        if (!moved) {
          this.sliderMove(rect, event, true);
        }
      },
      { once: true },
    );
    window.addEventListener(
      'touchmove',
      () => {
        clearTimeout(timer);
        moved = true;
      },
      { once: true },
    );
  }

  render() {
    const scaleY = this.touch && this.active ? 1 : 0.2;
    const thumbScale = this.touch && this.active ? 0 : 1;
    const pos = this.percent - 100;

    return (
      <Host class={{ active: this.active, touch: this.touch, disabled: this.disabled }}>
        <div class='slider' ref={(el) => (this.elSlider = el as HTMLInputElement)}>
          <div class='range'>
            <div class='track' style={{ transform: `scaleY(${scaleY})` }}>
              <div class='back'></div>
              <div class='fore' style={{ transform: `translateX(${pos}%)` }}></div>
            </div>
          </div>

          <div class='thumb' style={{ transform: `translateX(${pos}%)` }}>
            <div class='handle' part='thumb' style={{ transform: `scale(${thumbScale})` }}></div>
          </div>
        </div>
      </Host>
    );
  }
}
