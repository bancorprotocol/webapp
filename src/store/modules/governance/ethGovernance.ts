import { createModule, action, mutation } from "vuex-class-component";
import { web3, EthNetworks } from "@/api/helpers";
import { ABIBancorGovernance, ABISmartToken } from "@/api/eth/ethAbis";
import { EthAddress } from "@/types/bancor";
import { shrinkToken } from "@/api/eth/helpers";

export const governanceContractAddress =
  "0x05AA3da21D2706681837a896433E62deEeEaB1f1";
export const etherscanUrl = "https://ropsten.etherscan.io/";
const ipfsUrl = "https://ipfs.io/ipfs/";

// block time in seconds
export const blockTime = 15;

const VuexModule = createModule({
  strict: false
});

export interface Proposal {
  id: number;
  // block number
  start: number;
  // timestamp
  startDate: number;
  // block number
  end: number;
  // timestamp
  endDate: number;
  name: string;
  executor: EthAddress;
  hash: string;
  open: boolean;
  proposer: EthAddress;
  quorum: string;
  quorumRequired: string;
  totalVotesAgainst: number;
  totalVotesFor: number;
  totalVotes: number;
  totalVotesAvailable: number;
  votes: {
    for: number;
    against: number;
  };
}

export class EthereumGovernance extends VuexModule.With({
  namespaced: "ethGovernance/"
}) {
  governanceContract: any = undefined;
  tokenContract: any = undefined;

  isLoaded: boolean = false;

  @mutation
  setContracts({ governance, token }: { governance: any; token: any }) {
    this.tokenContract = token;
    this.governanceContract = governance;
    this.isLoaded = true;
    console.log(
      "contracts set",
      Date.now(),
      this.tokenContract,
      this.governanceContract
    );
  }

  @action
  async getTokenAddress(): Promise<EthAddress> {
    return this.tokenContract.options.address;
  }

  @action
  async init() {
    const governanceContract = new web3.eth.Contract(
      ABIBancorGovernance,
      governanceContractAddress
    );
    const tokenAddress = await governanceContract.methods.govToken().call();
    console.log("vote token address", tokenAddress);

    await this.setContracts({
      governance: governanceContract,
      token: new web3.eth.Contract(ABISmartToken, tokenAddress)
    });
  }

  @action
  async getSymbol(): Promise<string> {
    return await this.tokenContract.methods.symbol().call();
  }

  @action
  async getVotes({ voter }: { voter: EthAddress }): Promise<string> {
    if (!voter) throw new Error("Cannot get votes without voter address");

    console.log("getting votes");
    const [decimals, weiVotes] = await Promise.all([
      Number(await this.tokenContract.methods.decimals().call()),
      this.governanceContract.methods.votesOf(voter).call()
    ]);
    return shrinkToken(weiVotes, decimals);
  }

  @action
  async getBalance({ account }: { account: EthAddress }): Promise<string> {
    if (!account) throw new Error("Cannot get balance without address");

    console.log("getting balance");
    const [decimals, weiBalance] = await Promise.all([
      this.tokenContract.methods.decimals().call() as string,
      this.tokenContract.methods.balanceOf(account).call() as string
    ]);
    return shrinkToken(weiBalance, Number(decimals));
  }

  @action
  async getLock({
    account
  }: {
    account: EthAddress;
  }): Promise<{ now: number; till: number; for: number }> {
    if (!account) throw new Error("Cannot get lock without address");

    const till = Number(
      await this.governanceContract.methods.voteLocks(account).call()
    );
    const now = await web3.eth.getBlockNumber();
    // for
    const f = till - now;

    const lock = {
      now,
      till,
      for: f > 0 ? f : 0
    };

    console.log(lock);
    return lock;
  }

  @action
  async stake({
    account,
    amount
  }: {
    account: EthAddress;
    amount: string;
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
    amount: string;
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
    proposalId: string;
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
    proposalId: string;
  }): Promise<boolean> {
    if (!account || !proposalId)
      throw new Error("Cannot vote against without address or proposal id");

    await this.governanceContract.methods
      .voteAgainst(proposalId.toString())
      .send({
        from: account
      });

    return true;
  }

  @action
  async getProposals({ voter }: { voter?: string }): Promise<Proposal[]> {
    console.log(
      "getting proposals",
      Date.now(),
      this.isLoaded,
      this.governanceContract,
      this.tokenContract
    );
    const proposalCount = await this.governanceContract.methods
      .proposalCount()
      .call();

    const decimals = Number(await this.tokenContract.methods.decimals().call());
    const proposals: Proposal[] = [];
    const currentBlock = await web3.eth.getBlock("latest");

    for (let i = 0; i <= proposalCount; i++) {
      const proposal = await this.governanceContract.methods
        .proposals(i)
        .call();

      if (Number(proposal.end) === 0) {
        continue;
      }

      const totalVotesFor = parseFloat(
        shrinkToken(proposal.totalVotesFor, decimals)
      );
      const totalVotesAgainst = parseFloat(
        shrinkToken(proposal.totalVotesAgainst, decimals)
      );
      const totalVotesAvailable = parseFloat(
        shrinkToken(proposal.totalVotesAvailable, decimals)
      );

      let name;

      try {
        const metadata = await this.getFromIPFS({
          hash: proposal.hash,
          timeoutInSeconds: 5
        });
        console.log(metadata);

        name = (metadata && metadata.payload && metadata.payload.name) || null;
      } catch (err) {
        console.log("Getting metadata failed!", err);
      }

      proposals.push({
        id: Number(proposal.id),
        start: Number(proposal.start),
        startDate:
          Number((await web3.eth.getBlock(proposal.start)).timestamp) * 1000,
        end: Number(proposal.end),
        endDate:
          Date.now() +
          (Number(proposal.end) - currentBlock.number) * blockTime * 1000,
        executor: proposal.executor,
        hash: proposal.hash,
        open: proposal.open,
        name,
        proposer: proposal.proposer,
        quorum: proposal.quorum,
        quorumRequired: proposal.quorumRequired,
        totalVotesAgainst,
        totalVotesFor,
        totalVotesAvailable,
        totalVotes: totalVotesFor + totalVotesAgainst,
        votes: {
          for: voter
            ? parseFloat(
                shrinkToken(
                  await this.governanceContract.methods
                    .votesForOf(voter, proposal.id)
                    .call(),
                  decimals
                )
              )
            : 0,
          against: voter
            ? parseFloat(
                shrinkToken(
                  await this.governanceContract.methods
                    .votesAgainstOf(voter, proposal.id)
                    .call(),
                  decimals
                )
              )
            : 0
        }
      });
    }

    console.log("proposals", proposals);

    return proposals.reverse();
  }

  @action
  getFromIPFS({
    hash,
    timeoutInSeconds
  }: {
    hash: string;
    timeoutInSeconds: number;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        return reject("timeout");
      }, timeoutInSeconds * 1000);

      fetch(`${ipfsUrl}${hash}`, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          clearTimeout(t);
          console.log(data);
          return resolve(data);
        })
        .catch(reject);
    });
  }
}
