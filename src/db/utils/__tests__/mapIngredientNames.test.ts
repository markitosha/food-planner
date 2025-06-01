import { mapIngredientNames } from '../mapIngredientNames';

describe('mapIngredientNames', () => {
  it('should map ingredient ids to shortened names and comments', () => {
    const ingredients = [
      { id: '1', name: 'Salt til kartofler' },
      { id: '2', name: 'Pepper (sort)' },
      { id: '3', name: 'Sugar' },
    ];
    expect(mapIngredientNames(ingredients)).toEqual({
      '1': { name: 'Salt', comment: 'Salt til kartofler' },
      '2': { name: 'Pepper', comment: 'Pepper (sort)' },
      '3': { name: 'Sugar' },
    });
  });

  it('should handle empty array', () => {
    expect(mapIngredientNames([])).toEqual({});
  });

  it('should handle names that do not need shortening', () => {
    const ingredients = [
      { id: '1', name: 'Salt' },
    ];
    expect(mapIngredientNames(ingredients)).toEqual({
      '1': { name: 'Salt' },
    });
  });
}); 