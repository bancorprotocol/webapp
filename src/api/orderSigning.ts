import { RfqOrder } from "@0x/protocol-utils";
import BigNumber from "bignumber.js";

export const createOrder = ({
  fromAddress,
  toAddress,
  fromAmountWei,
  toAmountWei,
  currentUser,
  expiry,
  salt,
  txOrigin,
  pool
}: {
  fromAddress: string;
  toAddress: string;
  fromAmountWei: BigNumber;
  toAmountWei: BigNumber;
  currentUser: string;
  expiry: BigNumber;
  salt: BigNumber;
  txOrigin: string;
  pool: string;
}): RfqOrder =>
  new RfqOrder({
    chainId: 1,
    expiry,
    salt,
    maker: currentUser,
    makerToken: fromAddress,
    makerAmount: fromAmountWei,
    takerAmount: toAmountWei,
    takerToken: toAddress,
    txOrigin,
    pool
  });
