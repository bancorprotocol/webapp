import { EthNetworks } from "../helpers";

class Infura {
  constructor(chainId: EthNetworks) {
    // this.address = get;
  }

  async blockNumber() {}

  async getLogs({
    address,
    fromBlock,
    toBlock,
    topics
  }: {
    address: string;
    fromBlock: string;
    toBlock: string;
    topics: string[];
  }) {}
}
