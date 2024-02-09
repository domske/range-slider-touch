import { newE2EPage } from '@stencil/core/testing';

describe('range-slider-touch', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<range-slider-touch></range-slider-touch>');
    const element = await page.find('range-slider-touch');
    expect(element).toHaveClass('hydrated');
  });
});
