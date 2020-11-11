import { calculatePositionFees } from "@/api/pureHelpers";

describe("can calculate position fees", () => {
  test.skip("test one", async () => {
    const {
      originalPoolTokenAmount,
      currentPoolTokenSupply,
      depositedAmount,
      depositedReserveCurrentBalance,
      opposingDepositedReserveCurrentBalance,
      reserveRate
    } = {
      originalPoolTokenAmount: "1370909146698872748",
      currentPoolTokenSupply: "11338379267323634752139485",
      depositedAmount: "3874264344838181",
      depositedReserveCurrentBalance: "10932903826342227802656",
      opposingDepositedReserveCurrentBalance: "6847120160277936759163837",
      reserveRate: "290.61911993101308091657"
    };

    // current result is -552144045218744

    const res = calculatePositionFees(
      originalPoolTokenAmount,
      currentPoolTokenSupply,
      depositedAmount,
      depositedReserveCurrentBalance,
      opposingDepositedReserveCurrentBalance,
      reserveRate
    );
    expect(res).toBe("?");
  });

  test("test two", async () => {
    const {
      originalPoolTokenAmount,
      currentPoolTokenSupply,
      depositedAmount,
      depositedReserveCurrentBalance,
      opposingDepositedReserveCurrentBalance,
      reserveRate
    } = {
      originalPoolTokenAmount: "1370909146698872747",
      currentPoolTokenSupply: "11338379267323634752139485",
      depositedAmount: "1124989041279995704",
      depositedReserveCurrentBalance: "6847120160277936759163837",
      opposingDepositedReserveCurrentBalance: "10932903826342227802656",
      reserveRate: "0.00344092983365092823"
    };

    // current result is -467584274913337187

    const res = calculatePositionFees(
      originalPoolTokenAmount,
      currentPoolTokenSupply,
      depositedAmount,
      depositedReserveCurrentBalance,
      opposingDepositedReserveCurrentBalance,
      reserveRate
    );
    expect(res).toBe("?");
  });
});
