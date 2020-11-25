import {calculatePriceDeviationTooHigh, decToPpm} from "@/api/pureHelpers";
import BigNumber from "bignumber.js";

describe("calculatePriceDeviationTooHigh", () => {
  test("should return false in normal cases", () => {
    expect(
      calculatePriceDeviationTooHigh(
        // avg rate
        new BigNumber("1.1346143698574729"),
        // primary
        new BigNumber("1000"),
        // secondary
        new BigNumber("1000"),
        new BigNumber(decToPpm(0.5))
      )
    ).toBe(false);
  });

  test("should return true when price deviation is too high because of avg rate", () => {
    expect(
      calculatePriceDeviationTooHigh(
        // avg rate
        new BigNumber("0.0000000098574729"),
        // primary
        new BigNumber("1"),
        // secondary
        new BigNumber("1000"),
        new BigNumber(decToPpm(0.5))
      )
    ).toBe(true);
  });

  test("should return true when price deviation is too high because if spot rate", () => {
    expect(
      calculatePriceDeviationTooHigh(
        // avg rate
        new BigNumber("1.1346143698574729"),
        // primary
        new BigNumber("1000"),
        // secondary
        new BigNumber("1"),
        new BigNumber(decToPpm(0.5))
      )
    ).toBe(true);
  });
});
