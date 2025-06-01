import { getName } from '@/db/utils';

export function mapIngredientNames(
  ingredients: { name: string; id: string }[],
): Record<string, { name: string; comment?: string }> {
  return ingredients.reduce((acc, item) => {
    const shortenName = getName(item.name);
    acc[item.id] = {
      name: shortenName,
      comment: shortenName === item.name ? undefined : item.name,
    };
    return acc;
  }, {} as Record<string, { name: string; comment?: string }>);
} 