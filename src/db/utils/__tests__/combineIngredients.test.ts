import { combineIngredients } from '../combineIngredients';
import { IngredientRaw } from '@/db/types';

describe('combineIngredients', () => {
  it('should combine ingredients with the same product_id', () => {
    const rawData: IngredientRaw[] = [
      {
        product_id: 1,
        name: 'Salt',
        amount: '2',
        unit: 'g',
        checked: false,
      },
      {
        product_id: 1,
        name: 'Salt',
        amount: '3',
        unit: 'g',
        checked: false,
      },
      {
        product_id: 2,
        name: 'Pepper',
        amount: '1',
        unit: 'tsp',
        checked: true,
      },
    ];

    const result = combineIngredients(rawData);

    expect(result).toEqual([
      {
        product_id: 1,
        name: 'Salt',
        amount: '2 g + 3 g',
        checked: false,
        deleted: false,
      },
      {
        product_id: 2,
        name: 'Pepper',
        amount: '1 tsp',
        checked: true,
        deleted: false,
      },
    ]);
  });

  it('should handle empty input array', () => {
    const rawData: IngredientRaw[] = [];
    const result = combineIngredients(rawData);
    expect(result).toEqual([]);
  });

  it('should handle single ingredient', () => {
    const rawData: IngredientRaw[] = [
      {
        product_id: 1,
        name: 'Salt',
        amount: '2',
        unit: 'g',
        checked: false,
      },
    ];

    const result = combineIngredients(rawData);

    expect(result).toEqual([
      {
        product_id: 1,
        name: 'Salt',
        amount: '2 g',
        checked: false,
        deleted: false,
      },
    ]);
  });

  it('should handle ingredients with different units', () => {
    const rawData: IngredientRaw[] = [
      {
        product_id: 1,
        name: 'Water',
        amount: '500',
        unit: 'ml',
        checked: false,
      },
      {
        product_id: 1,
        name: 'Water',
        amount: '1',
        unit: 'l',
        checked: false,
      },
    ];

    const result = combineIngredients(rawData);

    expect(result).toEqual([
      {
        product_id: 1,
        name: 'Water',
        amount: '500 ml + 1 l',
        checked: false,
        deleted: false,
      },
    ]);
  });

  it('should handle ingredients with decimal amounts', () => {
    const rawData: IngredientRaw[] = [
      {
        product_id: 1,
        name: 'Sugar',
        amount: '1.5',
        unit: 'tbsp',
        checked: false,
      },
      {
        product_id: 1,
        name: 'Sugar',
        amount: '2.5',
        unit: 'tbsp',
        checked: false,
      },
    ];

    const result = combineIngredients(rawData);

    expect(result).toEqual([
      {
        product_id: 1,
        name: 'Sugar',
        amount: '1.5 tbsp + 2.5 tbsp',
        checked: false,
        deleted: false,
      },
    ]);
  });
}); 