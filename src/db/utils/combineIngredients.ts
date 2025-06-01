import { IngredientRaw, ShoppingIngredient } from '@/db/types';

export const combineIngredients = (rawData: IngredientRaw[]): Partial<ShoppingIngredient>[] => {
  return rawData.reduce((acc, ingredient, currentIndex) => {
    const prevItem = acc.at(-1);

    if (currentIndex === 0 || prevItem?.product_id !== ingredient.product_id) {
      acc.push({
        product_id: ingredient.product_id,
        name: ingredient.name,
        amount: `${parseFloat(ingredient.amount)} ${ingredient.unit}`,
        checked: ingredient.checked,
        deleted: false,
      });

      return acc;
    }

    const prevAmount = prevItem.amount;
    prevItem.amount = `${prevAmount} + ${parseFloat(ingredient.amount)} ${ingredient.unit}`;

    return acc;
  }, [] as Partial<ShoppingIngredient>[]);
}; 