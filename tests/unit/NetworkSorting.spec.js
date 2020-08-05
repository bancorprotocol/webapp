import { sortByNetworkTokens } from "@/api/sortByNetworkTokens";

const buildMockRelay = reserveSymbols =>
  reserveSymbols.map(symbol => ({ symbol, amount: 5 }));

const networkTokens = ["BNT", "USDB"];

const toSymbol = reserve => reserve.symbol;

const sorter = reserveSymbols =>
  sortByNetworkTokens(buildMockRelay(reserveSymbols), toSymbol, networkTokens);

const testSort = (originalOrder, newOrder) => {
  const sorted = sorter(["BNT", "ANT"]);

  expect(sorted).toStrictEqual(buildMockRelay(["BNT", "ANT"]));
};

describe("sorting by network symbols", () => {
  test("traditional relays", async () => {
    testSort(["BNT", "ANT"], ["BNT", "ANT"]);
    testSort(["ANT", "BNT"], ["BNT", "ANT"]);
    testSort(["CAT", "BNT"], ["BNT", "CAT"]);
  });

  test("BNT vs USDB", () => {
    testSort(["BNT", "USDB"], ["BNT", "USDB"]);
    testSort(["USDB", "BNT"], ["BNT", "USDB"]);
  });

  test("3 reserve relay", () => {
    testSort(["BNT", "CAT", "USDB"], ["BNT", "USDB", "CAT"]);
    testSort(["USDB", "BNT", "CAT"], ["BNT", "USDB", "CAT"]);
    testSort(["BNT", "USDB", "CAT"], ["BNT", "USDB", "CAT"]);
  });

  test("sort with no network tokens included throws", () => {
    expect(() =>
      sortByNetworkTokens(
        buildMockRelay(["CAT", "DOG"]),
        toSymbol,
        networkTokens
      )
    ).toThrow();
  });
});
