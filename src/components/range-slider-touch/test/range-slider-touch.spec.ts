import { newSpecPage } from '@stencil/core/testing';
import { RangeSliderTouchComponent } from '../range-slider-touch';

describe('range-slider-touch', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [RangeSliderTouchComponent],
      html: '<range-slider-touch></range-slider-touch>',
    });
    expect(root).toEqualHtml(`
      <range-slider-touch>
        <mock:shadow-root>
          <div class="slider">
            <div class="range">
              <div class="track" style="transform: scaleY(0.2)">
                <div class="back"></div>
                <div class="fore" style="transform: translateX(-50%)"></div>
              </div>
            </div>
            <div class="thumb" style="transform: translateX(-50%)">
              <div class="handle" part="thumb" style="transform: scale(1)"></div>
            </div>
          </div>
        </mock:shadow-root>
      </range-slider-touch>
    `);
  });

  it('renders with value', async () => {
    const { root } = await newSpecPage({
      components: [RangeSliderTouchComponent],
      html: '<range-slider-touch value="75"></range-slider-touch>',
    });
    expect(root).toEqualHtml(`
      <range-slider-touch value="75">
        <mock:shadow-root>
          <div class="slider">
            <div class="range">
              <div class="track" style="transform: scaleY(0.2)">
                <div class="back"></div>
                <div class="fore" style="transform: translateX(-25%)"></div>
              </div>
            </div>
            <div class="thumb" style="transform: translateX(-25%)">
              <div class="handle" part="thumb" style="transform: scale(1)"></div>
            </div>
          </div>
        </mock:shadow-root>
      </range-slider-touch>
    `);
  });
});
