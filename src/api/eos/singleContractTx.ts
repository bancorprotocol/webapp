import { Asset } from "eos-common";
import { composeMemo } from "./eosBancorCalc";

export const liquidateAction = (
  smartTokenAmount: Asset,
  smartTokenContract: string,
  expectedReserve: Asset,
  relayContract: string,
  userAccount: string
) => ({
  account: smartTokenContract,
  name: "transfer",
  data: {
    from: userAccount,
    to: process.env.VUE_APP_NETWORKCONTRACT,
    quantity: smartTokenAmount.to_string(),
    memo: composeMemo(
      [
        {
          account: relayContract,
          symbol: expectedReserve.symbol.code().to_string()
        }
      ],
      expectedReserve.to_string().split(" ")[0],
      userAccount
    )
  }
});
