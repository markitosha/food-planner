import { collectUniqueUnits } from '../collectUniqueUnits';

describe('collectUniqueUnits', () => {
  it('should collect unique units from yields', () => {
    const yields = [
      {
        ingredients: [
          { unit: 'g' },
          { unit: 'ml' },
          { unit: 'g' }, // duplicate
        ],
      },
      {
        ingredients: [
          { unit: 'ml' }, // duplicate
          { unit: 'tbsp' },
        ],
      },
    ];

    const result = collectUniqueUnits(yields);
    expect(result).toEqual(new Set(['g', 'ml', 'tbsp']));
  });

  it('should use "stk" as default unit when unit is undefined', () => {
    const yields = [
      {
        ingredients: [
          { unit: undefined },
          { unit: 'g' },
        ],
      },
    ];

    const result = collectUniqueUnits(yields);
    expect(result).toEqual(new Set(['stk', 'g']));
  });

  it('should handle empty yields array', () => {
    const yields: { ingredients: { unit?: string }[] }[] = [];
    const result = collectUniqueUnits(yields);
    expect(result).toEqual(new Set());
  });

  it('should handle yields with empty ingredients array', () => {
    const yields = [
      {
        ingredients: [],
      },
    ];
    const result = collectUniqueUnits(yields);
    expect(result).toEqual(new Set());
  });

  it('should handle mixed cases of defined and undefined units', () => {
    const yields = [
      {
        ingredients: [
          { unit: 'g' },
          { unit: undefined },
          { unit: 'ml' },
          { unit: undefined },
        ],
      },
    ];

    const result = collectUniqueUnits(yields);
    expect(result).toEqual(new Set(['g', 'stk', 'ml']));
  });
}); 