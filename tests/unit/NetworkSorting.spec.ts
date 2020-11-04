import { compareString } from "@/api/helpers";

describe("sorting by network symbols", () => {
  test("traditional relays", async () => {
    const tested = compareString("hello", "HELLO");

    expect(tested).toBe(true);
    expect(true).toBe(true);
  });
});
