export const collectUniqueUnits = (
  yields: { ingredients: { unit?: string }[] }[],
) => {
  return yields.reduce((acc, item) => {
    item.ingredients.forEach((i) => {
      acc.add(i.unit || 'stk');
    });
    return acc;
  }, new Set<string>());
};
