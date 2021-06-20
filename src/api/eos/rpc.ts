import { JsonRpc } from "eosjs";
import { createDfuseClient } from "@dfuse/client";

export const rpc = new JsonRpc("https://eos.greymass.com");

export const dfuseClient = createDfuseClient({
  network: "eos.dfuse.eosnation.io",
  apiKey: "d43c24a5e6c303337364c382d3eb51e9"
  // authentication: false
});
