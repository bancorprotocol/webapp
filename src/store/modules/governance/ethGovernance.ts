import { createModule, action } from "vuex-class-component";
import { web3, compareString, EthNetworks } from "@/api/helpers";
import {
  ABIBancorGovernance,
  ABISmartToken,
  ethReserveAddress
} from "@/api/eth/ethAbis";
import { EthAddress } from "@/types/bancor";
import { shrinkToken } from "@/api/eth/helpers";

const governanceContractAddress = "0xf648d3920188f79d045e35007ad1c3158d47732b";
const tokenContractAddress = "0x0a180A76e4466bF68A7F86fB029BEd3cCcFaAac5";

const VuexModule = createModule({
  strict: false
});

export class EthereumGovernance extends VuexModule.With({
  namespaced: "ethGovernance/"
}) {
  loggedInAccount: string = "";
  currentNetwork: EthNetworks = EthNetworks.Mainnet;

  @action
  async getVotes({ voter }: { voter: EthAddress }): Promise<string> {
    if (!voter) throw new Error("Cannot get votes without voter address");

    const governanceContract = new web3.eth.Contract(
      ABIBancorGovernance,
      governanceContractAddress
    );

    const votes = await governanceContract.methods.votesOf(voter).call();
    return shrinkToken(votes, 18);
  }

  @action
  async getBalance({ account }: { account: EthAddress }): Promise<string> {
    if (!account)
      throw new Error("Cannot get balance without address");

    const tokenContract = new web3.eth.Contract(
      ABISmartToken,
      tokenContractAddress
    );

    // console.log('accs', await web3.eth.getAccounts())

    const [decimals, weiBalance] = await Promise.all([
      tokenContract.methods.decimals().call() as string,
      tokenContract.methods.balanceOf(account).call() as string
    ]);
    return shrinkToken(weiBalance, Number(decimals));
  }
}
