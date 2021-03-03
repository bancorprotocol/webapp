import { RfqOrder, SignatureType } from "@0x/protocol-utils";
import { web3 } from "./web3";

const order = new RfqOrder({
  chainId: 1
});

// @ts-ignore
const signature = await order.getSignatureWithProviderAsync(
  web3.currentProvider,
  SignatureType.EIP712
);
