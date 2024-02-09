import { clamp } from '../utils';

describe('clamp', () => {
  it('some clamps', () => {
    expect(clamp(50, 12, 123)).toEqual(50);
    expect(clamp(1, 12, 123)).toEqual(12);
    expect(clamp(1111, 12, 123)).toEqual(123);
  });
});
