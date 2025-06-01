import { createVariantNames } from '../createVariantNames';

describe('createVariantNames', () => {
  it('should create variant names for a list of yields', () => {
    const yields = [{ yields: 2 }, { yields: 4 }, { yields: 6 }];
    expect(createVariantNames(yields)).toEqual([
      '2 People',
      '4 People',
      '6 People',
    ]);
  });

  it('should handle an empty array', () => {
    expect(createVariantNames([])).toEqual([]);
  });

  it('should handle a single yield', () => {
    expect(createVariantNames([{ yields: 1 }])).toEqual(['1 People']);
  });

  it('should handle zero yields', () => {
    expect(createVariantNames([{ yields: 0 }])).toEqual(['0 People']);
  });
});
