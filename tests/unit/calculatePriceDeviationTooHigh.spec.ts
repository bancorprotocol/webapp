import { calculatePriceDeviationTooHigh, decToPpm } from "@/api/pureHelpers";
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

  test("should return true when price deviation is too high because of spot rate", () => {
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

  test("should return error for high deviation", () => {
    expect(
      calculatePriceDeviationTooHigh(
        // avg rate
        new BigNumber("667846830199023568299961991561").dividedBy(
          "332153169800976431700038008439"
        ),
        // primary
        new BigNumber("1372226728883507693672"),
        // secondary
        new BigNumber("2853115261857163894625"),
        new BigNumber(decToPpm(0.5))
      )
    ).toBe(true);
  });

  test("should return no error because within the threshold", () => {
    expect(
      calculatePriceDeviationTooHigh(
        // avg rate
        new BigNumber("1852751787227484151863").dividedBy(
          "2102158801567418598785"
        ),
        // primary
        new BigNumber("2102158801567418598785"),
        // secondary
        new BigNumber("1852751787227484151863"),
        new BigNumber(decToPpm(0.5))
      )
    ).toBe(false);
  });
});
