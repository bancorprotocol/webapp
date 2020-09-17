import { createModule, action } from "vuex-class-component";
import { web3, compareString, EthNetworks } from "@/api/helpers";
import { ABIBancorGovernance, ABISmartToken } from "@/api/eth/ethAbis";
import { EthAddress } from "@/types/bancor";
import { shrinkToken } from "@/api/eth/helpers";

const governanceContractAddress = "0xf648d3920188f79d045e35007ad1c3158d47732b";

const VuexModule = createModule({
  strict: false
});

export class EthereumGovernance extends VuexModule.With({
  namespaced: "ethGovernance/"
}) {
  loggedInAccount: string = "";
  currentNetwork: EthNetworks = EthNetworks.Mainnet;

  governanceContract = new web3.eth.Contract(
    ABIBancorGovernance,
    governanceContractAddress
  );

  tokenContract: any;

  @action
  async init() {
    const tokenAddress = await this.governanceContract.methods
      .voteToken()
      .call();
    console.log("vote token address", tokenAddress);

    this.tokenContract = new web3.eth.Contract(ABISmartToken, tokenAddress);
  }

  @action
  async getVotes({ voter }: { voter: EthAddress }): Promise<string> {
    if (!voter) throw new Error("Cannot get votes without voter address");

    const votes = await this.governanceContract.methods.votesOf(voter).call();
    return shrinkToken(votes, 18);
  }

  @action
  async getBalance({ account }: { account: EthAddress }): Promise<string> {
    if (!account) throw new Error("Cannot get balance without address");

    const [decimals, weiBalance] = await Promise.all([
      this.tokenContract.methods.decimals().call() as string,
      this.tokenContract.methods.balanceOf(account).call() as string
    ]);
    return shrinkToken(weiBalance, Number(decimals));
  }

  @action
  async stake({
    account,
    amount
  }: {
    account: EthAddress;
    amount: number;
  }): Promise<boolean> {
    if (!account || !amount)
      throw new Error("Cannot stake without address or amount");

    await this.tokenContract.methods
      .approve(governanceContractAddress, amount.toString())
      .send({
        from: account
      });

    await this.governanceContract.methods.stake(amount.toString()).send({
      from: account
    });

    return true;
  }
}
