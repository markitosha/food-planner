export const createVariantNames = (yields: { yields: number }[]): string[] => {
  return yields.map((variant) => `${variant.yields} People`);
};
