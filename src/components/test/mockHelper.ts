
import BigNumber from "bignumber.js";

export const compareString = (stringOne: string, stringTwo: string) => {
  const strings = [stringOne, stringTwo];
  if (!strings.every(str => typeof str == "string"))
    throw new Error(
    `String one: ${stringOne} String two: ${stringTwo} one of them are falsy or not a string`
    );
  return stringOne.toLowerCase() == stringTwo.toLowerCase();
};

export const formatPercent = (decNumber: number | string) =>
numeral(decNumber).format("0.00%");

const replaceLastChar = (str: string, char: string) => {
  return str.slice(0, str.length - 1) + char;
};

export const formatNumber = (num: number | string, size: number = 4) => {
  const bigNum = new BigNumber(num);
  if (bigNum.eq(0)) return "0";
  const reduced = bigNum.toFixed(size);
  const isZero = Number(reduced) == 0;
  if (isZero) {
    return `< ${replaceLastChar(reduced, "1")}`;
  }
return reduced;
};