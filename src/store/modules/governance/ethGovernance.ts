import { createModule, action } from "vuex-class-component";
import { web3, compareString, EthNetworks } from "@/api/helpers";
import { ABIBancorGovernance, ABISmartToken } from "@/api/eth/ethAbis";
import { EthAddress } from "@/types/bancor";
import { shrinkToken } from "@/api/eth/helpers";

export const governanceContractAddress = "0xf648d3920188f79d045e35007ad1c3158d47732b";

const VuexModule = createModule({
  strict: false
});

export interface Proposal {
  id: number
  // block number
  start: number
  // block number
  end: number
  executor: EthAddress
  hash: string
  open: boolean
  proposer: EthAddress
  quorum: string
  quorumRequired: string
  totalAgainstVotes: string
  totalForVotes: string
  totalVotesAvailable: string
}

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
  async getSymbol(): Promise<string> {
    return await this.tokenContract.methods.symbol().call();
  }

  @action
  async getVotes({ voter }: { voter: EthAddress }): Promise<string> {
    if (!voter) throw new Error("Cannot get votes without voter address");

    console.log("getting votes")

    const votes = await this.governanceContract.methods.votesOf(voter).call();
    return shrinkToken(votes, Number(await this.tokenContract.methods.decimals().call()));
  }


  @action
  async getBalance({ account }: { account: EthAddress }): Promise<string> {
    if (!account) throw new Error("Cannot get balance without address");

    console.log("getting balance")
    const [decimals, weiBalance] = await Promise.all([
      this.tokenContract.methods.decimals().call() as string,
      this.tokenContract.methods.balanceOf(account).call() as string
    ]);
    return shrinkToken(weiBalance, Number(decimals));
  }

  @action
  async getLock({ account }: { account: EthAddress }): Promise<number> {
    if (!account) throw new Error("Cannot get lock without address");

    console.log("getting lock")
    const lockedTill = Number(await this.governanceContract.methods.voteLocks(account).call());

    console.log(
      lockedTill,
      await web3.eth.getBlockNumber(),
      // how many blocks left?
      lockedTill - await web3.eth.getBlockNumber()
    )
    return lockedTill
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

  @action
  async unstake({
                  account,
                  amount
                }: {
    account: EthAddress;
    amount: number;
  }): Promise<boolean> {
    if (!account || !amount)
      throw new Error("Cannot unstake without address or amount");

    await this.governanceContract.methods.unstake(amount.toString()).send({
      from: account
    });

    return true;
  }

  @action
  async getProposals(): Promise<Proposal[]> {
    console.log("getting proposals");
    const proposalCount = await this.governanceContract.methods.proposalCount().call();

    const proposals: Proposal[] = []

    for (let i = 0; i <= proposalCount; i++) {
      const proposal = await this.governanceContract.methods.proposals(i).call();
      proposals.push({
        id: Number(proposal.id),
        start: Number(proposal.start),
        end: Number(proposal.end),
        executor: proposal.executor,
        hash: proposal.hash,
        open: proposal.open,
        proposer: proposal.proposer,
        quorum: proposal.quorum,
        quorumRequired: proposal.quorumRequired,
        totalAgainstVotes: proposal.totalAgainstVotes,
        totalForVotes: proposal.totalForVotes,
        totalVotesAvailable: proposal.totalVotesAvailable
      })
    }

    console.log("proposals", proposals);

    return proposals
  }
}
