import { createModule, action } from "vuex-class-component";
import { web3, EthNetworks } from "@/api/helpers";
import { ABIBancorGovernance, ABISmartToken } from "@/api/eth/ethAbis";
import { EthAddress } from "@/types/bancor";
import { shrinkToken } from "@/api/eth/helpers";
import BigNumber from "bignumber.js"

export const governanceContractAddress = "0xf648d3920188f79d045e35007ad1c3158d47732b";
// block time in seconds
export const blockTime = 15

const VuexModule = createModule({
  strict: false
});

export interface Proposal {
  id: number
  // block number
  start: number
  // timestamp
  startDate: number
  // block number
  end: number
  // timestamp
  endDate: number
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
    const [decimals, weiVotes] = await Promise.all([
      Number(await this.tokenContract.methods.decimals().call()),
      this.governanceContract.methods.votesOf(voter).call()
    ])
    return shrinkToken(weiVotes, decimals);
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
  async getLock({ account }: { account: EthAddress }): Promise<{ now: number, till: number, for: number }> {
    if (!account) throw new Error("Cannot get lock without address");

    const till = Number(await this.governanceContract.methods.voteLocks(account).call());
    const now = await web3.eth.getBlockNumber()
    const f = till - now

    const lock = {
      now,
      till,
      for: f > 0 ? f : 0
    }

    console.log(lock)
    return lock;
  }

  @action
  async stake({
                account,
                amount
              }: {
    account: EthAddress;
    amount: number | BigNumber | string;
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
    amount: number | BigNumber | string;
  }): Promise<boolean> {
    if (!account || !amount)
      throw new Error("Cannot unstake without address or amount");

    await this.governanceContract.methods.unstake(amount.toString()).send({
      from: account
    });

    return true;
  }

  @action
  async voteFor({
                  account,
                  proposalId
                }: {
    account: EthAddress;
    proposalId: number | BigNumber | string;
  }): Promise<boolean> {
    if (!account || !proposalId)
      throw new Error("Cannot vote for without address or proposal id");

    await this.governanceContract.methods.voteFor(proposalId.toString()).send({
      from: account
    });

    return true;
  }

  @action
  async voteAgainst({
                      account,
                      proposalId
                    }: {
    account: EthAddress;
    proposalId: number | BigNumber | string;
  }): Promise<boolean> {
    if (!account || !proposalId)
      throw new Error("Cannot vote against without address or proposal id");

    await this.governanceContract.methods.voteAgainst(proposalId.toString()).send({
      from: account
    });

    return true;
  }

  @action
  async getProposals(): Promise<Proposal[]> {
    console.log("getting proposals");
    const proposalCount = await this.governanceContract.methods.proposalCount().call();

    const decimals = Number(await this.tokenContract.methods.decimals().call())

      const proposals: Proposal[] = []
    const currentBlock = await web3.eth.getBlock("latest")

    for (let i = 0; i <= proposalCount; i++) {
      const proposal = await this.governanceContract.methods.proposals(i).call();
      proposals.push({
        id: Number(proposal.id),
        start: Number(proposal.start),
        startDate: Number((await web3.eth.getBlock(proposal.start)).timestamp) * 1000,
        end: Number(proposal.end),
        endDate: Date.now() + ((Number(proposal.end) - currentBlock.number) * blockTime * 1000),
        executor: proposal.executor,
        hash: proposal.hash,
        open: proposal.open,
        proposer: proposal.proposer,
        quorum: proposal.quorum,
        quorumRequired: proposal.quorumRequired,
        totalAgainstVotes: shrinkToken(proposal.totalAgainstVotes, decimals),
        totalForVotes: shrinkToken(proposal.totalForVotes, decimals),
        totalVotesAvailable: shrinkToken(proposal.totalVotesAvailable, decimals)
      });
    }

    console.log("proposals", proposals);

    return proposals;
  }
}
