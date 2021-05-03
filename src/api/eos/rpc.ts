import { JsonRpc } from "eosjs";
import { createDfuseClient } from "@dfuse/client";

export const rpc = new JsonRpc("https://eos.greymass.com");

export const dfuseClient = createDfuseClient({
  network: "eos.dfuse.eosnation.io",
  authentication: false
});
