export const getName = (name: string) => {
  const splittedName = name.replace('*', '').split(/ til | \(/);

  return splittedName.at(0) || name;
}; 