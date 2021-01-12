export const prettifyNumber = (): string => {
  return "";
};

export const compareString = (stringOne: string, stringTwo: string) => {
  const strings = [stringOne, stringTwo];
  if (!strings.every(str => typeof str == "string"))
    throw new Error(
      `String one: ${stringOne} String two: ${stringTwo} one of them are falsy or not a string`
    );
  return stringOne.toLowerCase() == stringTwo.toLowerCase();
};