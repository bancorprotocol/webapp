import { createModule, action, mutation } from "vuex-class-component";
import { ContractMethods, EthAddress } from "@/types/bancor";
import { shrinkToken } from "@/api/eth/helpers";
import {
  buildGovernanceContract,
  buildTokenContract
} from "@/api/eth/contractTypes";
import { CallReturn } from "eth-multicall";
import { ContractSendMethod } from "web3-eth-contract";
// @ts-ignore
import ipfsHttpClient from "ipfs-http-client/dist/index.min.js";

export const governanceContractAddress =
  "0xdEC39088ee1A837090a7647Be0039b2E8B3a8349";
export const etherscanUrl = "https://ropsten.etherscan.io/";
export const ipfsViewUrl = "https://ipfs.io/ipfs/";
const ipfsUrl = "https://ipfs.infura.io:5001";

const VuexModule = createModule({
  strict: false
});

export interface ProposalMetaData {
  payload: {
    body: string;
    metadata: {
      github: string;
      discourse: string;
    };
    name: string;
  };
  timestamp: number;
  revision: string;
}

export interface Proposal {
  id: number;
  // timestamp
  start: number;
  // timestamp
  end: number;
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
    voted: undefined | "for" | "against";
    for: number;
    against: number;
  };
  metadata?: ProposalMetaData;
}

interface Token
  extends ContractMethods<{
    symbol: () => CallReturn<string>;
    decimals: () => CallReturn<string>;
    totalSupply: () => CallReturn<string>;
    allowance: (owner: string, spender: string) => CallReturn<string>;
    balanceOf: (owner: string) => CallReturn<string>;
    transferOwnership: (converterAddress: string) => ContractSendMethod;
    issue: (address: string, wei: string) => ContractSendMethod;
    transfer: (to: string, weiAmount: string) => ContractSendMethod;
    approve: (
      approvedAddress: string,
      approvedAmount: string
    ) => ContractSendMethod;
  }> {}

interface Governance
  extends ContractMethods<{
    propose: (executor: string, hash: string) => ContractSendMethod;
    voteFor: (proposalId: string) => ContractSendMethod;
    voteAgainst: (proposalId: string) => ContractSendMethod;
    stake: (amount: string) => ContractSendMethod;
    unstake: (amount: string) => ContractSendMethod;
    decimals: () => CallReturn<string>;
    proposalCount: () => CallReturn<number>;
    proposals: (proposalI: number) => CallReturn<Proposal>;
    votesOf: (voter: string) => CallReturn<string>;
    votesForOf: (voter: string, proposalId: number) => CallReturn<string>;
    votesAgainstOf: (voter: string, proposalId: number) => CallReturn<string>;
    voteLocks: (voter: string) => CallReturn<string>;
    govToken: () => CallReturn<string>;
  }> {}

export class EthereumGovernance extends VuexModule.With({
  namespaced: "ethGovernance/"
}) {
  governanceContract: Governance = {} as Governance;
  tokenContract: Token = {} as Token;

  isLoaded: boolean = false;
  symbol?: string;

  @mutation
  setContracts({
    governance,
    token
  }: {
    governance: Governance;
    token: Token;
  }) {
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

  @mutation
  setSymbol(symbol: string) {
    this.symbol = symbol;
  }

  @action
  async getTokenAddress(): Promise<EthAddress> {
    return this.tokenContract.options.address;
  }

  @action
  async init() {
    const governanceContract: Governance = buildGovernanceContract(
      governanceContractAddress
    );

    const tokenAddress = await governanceContract.methods.govToken().call();
    console.log("vote token address", tokenAddress);

    await this.setContracts({
      governance: governanceContract,
      token: buildTokenContract(tokenAddress)
    });
  }

  @action
  async getSymbol(): Promise<string> {
    if (!this.symbol) {
      const symbol = await this.tokenContract.methods.symbol().call();
      this.setSymbol(symbol);
      return symbol;
    } else {
      return this.symbol;
    }
  }

  @action
  async getVotes({ voter }: { voter: EthAddress }): Promise<number> {
    if (!voter) throw new Error("Cannot get votes without voter address");

    console.log("getting votes");
    const [decimals, weiVotes] = await Promise.all([
      Number(await this.tokenContract.methods.decimals().call()),
      this.governanceContract.methods.votesOf(voter).call()
    ]);
    return parseFloat(shrinkToken(weiVotes, decimals));
  }

  @action
  async getBalance({ account }: { account: EthAddress }): Promise<number> {
    if (!account) throw new Error("Cannot get balance without address");

    console.log("getting balance");
    const [decimals, weiBalance] = await Promise.all([
      this.tokenContract.methods.decimals().call(),
      this.tokenContract.methods.balanceOf(account).call()
    ]);
    return parseFloat(shrinkToken(weiBalance, Number(decimals)));
  }

  @action
  async getLock({
    account
  }: {
    account: EthAddress;
  }): Promise<{ till: number; for: number }> {
    if (!account) throw new Error("Cannot get lock without address");

    const till =
      Number(await this.governanceContract.methods.voteLocks(account).call()) *
      1000;
    // for
    const lockedFor = till - Date.now();

    const lock = {
      till,
      for: lockedFor > 0 ? lockedFor : 0
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
  async propose({
    account,
    executor,
    hash
  }: {
    account: EthAddress;
    executor: EthAddress;
    hash: string;
  }): Promise<boolean> {
    if (!executor || !hash || !account)
      throw new Error("Cannot propose without execturo and hash");

    await this.governanceContract.methods.propose(executor, hash).send({
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

    for (let i = 0; i < proposalCount; i++) {
      const proposal = await this.governanceContract.methods
        .proposals(i)
        .call();

      const totalVotesFor = parseFloat(
        shrinkToken(proposal.totalVotesFor, decimals)
      );
      const totalVotesAgainst = parseFloat(
        shrinkToken(proposal.totalVotesAgainst, decimals)
      );
      const totalVotesAvailable = parseFloat(
        shrinkToken(proposal.totalVotesAvailable, decimals)
      );

      let metadata;

      try {
        metadata = await this.getFromIPFS({
          hash: proposal.hash,
          timeoutInSeconds: 5
        });
      } catch (err) {
        console.log("Getting metadata failed!", err);
      }

      const prop = {
        id: Number(proposal.id),
        start: Number(proposal.start) * 1000,
        end: Number(proposal.end) * 1000,
        executor: proposal.executor,
        hash: proposal.hash,
        open: proposal.open,
        name: (metadata && metadata.payload && metadata.payload.name) || "",
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
        } as any,
        metadata: metadata
      };
      const { for: vFor, against: vAgainst } = prop.votes;
      prop.votes.voted =
        vFor === vAgainst ? undefined : vFor > vAgainst ? "for" : "against";
      proposals.push(prop);
    }

    console.log("proposals", proposals);

    return proposals.reverse();
  }

  @action
  async getFromIPFS({
    hash,
    timeoutInSeconds
  }: {
    hash: string;
    timeoutInSeconds: number;
  }): Promise<ProposalMetaData> {
    const ipfs = ipfsHttpClient(ipfsUrl);

    let metadata;

    for await (const file of ipfs.get(hash, {
      timeout: timeoutInSeconds * 1000
    })) {
      if (!file.content) continue;

      for await (const chunk of file.content) {
        metadata = JSON.parse(chunk.toString("utf8"));
        break;
      }

      break;
    }

    return metadata;
  }

  @action async storeInIPFS({
    proposalMetaData
  }: {
    proposalMetaData: ProposalMetaData;
  }): Promise<string> {
    const ipfs = ipfsHttpClient(ipfsUrl);

    const { path } = await ipfs.add(
      Buffer.from(JSON.stringify(proposalMetaData, null, 2))
    );
    return path;
  }
}
