import { action, createModule, mutation } from "vuex-class-component";
import { ContractMethods, EthAddress } from "@/types/bancor";
import { shrinkToken } from "@/api/eth/helpers";
import {
  buildGovernanceContract,
  buildTokenContract
} from "@/api/eth/contractTypes";
import { CallReturn } from "eth-multicall";
import { ContractSendMethod } from "web3-eth-contract";
import IpfsHttpClient from "ipfs-http-client";
import axios from "axios";
import BigNumber from "bignumber.js";
import { EthNetworks, getWeb3, web3 } from "@/api/web3";
import { getNetworkVariables } from "@/api/config";
import { buildRange } from "@/api/helpers";

export const ipfsViewUrl = "https://ipfs.io/ipfs/";
const ipfsUrl = "https://ipfs.infura.io:5001/";
const discourseUrl = "https://gov.bancor.network/";

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

export interface Votes {
  voted: undefined | "for" | "against";
  for: string;
  against: string;
}

export interface Voter {
  votes: Votes;
  account: string;
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
  totalAvailableVotes: number;
  // votes of currently logged in user
  votes: Votes;
  metadata?: ProposalMetaData;
  voters: Voter[];
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
    voteDuration: () => CallReturn<string>;
    voteLockDuration: () => CallReturn<string>;
    voteLockFraction: () => CallReturn<string>;
    newProposalMinimum: () => CallReturn<string>;
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
  lastTransaction: number = 0;

  symbol?: string;
  decimals?: number;

  metaDataCache: { [id: string]: ProposalMetaData } = {};

  @mutation setContracts({
    governance,
    token
  }: {
    governance: Governance;
    token: Token;
  }) {
    this.tokenContract = token;
    this.governanceContract = governance;
    this.isLoaded = true;
  }

  @mutation setLastTransaction(time: number) {
    this.lastTransaction = time;
  }

  @mutation setSymbol(symbol: string) {
    this.symbol = symbol;
  }

  @mutation setDecimals(decimals: number) {
    this.decimals = decimals;
  }

  @action async getTokenAddress(): Promise<EthAddress> {
    return this.tokenContract.options.address;
  }

  @action async getNetwork(): Promise<EthNetworks> {
    const currentNetwork: EthNetworks = await web3.eth.getChainId();
    return currentNetwork;
  }

  @action async getGovernanceContractAddress() {
    const networkVariables = getNetworkVariables(await this.getNetwork());
    return networkVariables.governanceContractAddress;
  }

  @action async getEtherscanUrl() {
    const networkVariables = getNetworkVariables(await this.getNetwork());
    return networkVariables.etherscanUrl;
  }

  @action async init() {
    const w3 = getWeb3(await this.getNetwork());
    const governanceContract: Governance = buildGovernanceContract(
      await this.getGovernanceContractAddress(),
      w3
    );

    const tokenAddress = await governanceContract.methods.govToken().call();

    this.setContracts({
      governance: governanceContract,
      token: buildTokenContract(tokenAddress, w3)
    });
  }

  @action async getSymbol(): Promise<string> {
    if (!this.symbol) {
      const symbol = await this.tokenContract.methods.symbol().call();
      this.setSymbol(symbol);
      return symbol;
    } else {
      return this.symbol;
    }
  }

  @action async getDecimals(): Promise<number> {
    if (!this.decimals) {
      const decimals = Number(
        await this.tokenContract.methods.decimals().call()
      );
      this.setDecimals(decimals);
      return decimals;
    } else {
      return this.decimals;
    }
  }

  @action async getVoteLockDuration(): Promise<number> {
    return Number(
      await this.governanceContract.methods.voteLockDuration().call()
    );
  }

  @action async getVoteDuration(): Promise<number> {
    return Number(await this.governanceContract.methods.voteDuration().call());
  }

  @action async getVoteLockFraction(): Promise<number> {
    return Number(
      await this.governanceContract.methods.voteLockFraction().call()
    );
  }

  @action async getNewProposalMinimum(): Promise<number> {
    const [min, decimals] = await Promise.all([
      this.governanceContract.methods.newProposalMinimum().call(),
      this.getDecimals()
    ]);
    return Number(shrinkToken(min, decimals));
  }

  @action async getVotes({ voter }: { voter: EthAddress }): Promise<BigNumber> {
    if (!voter) throw new Error("Cannot get votes without voter address");

    const [decimals, weiVotes] = await Promise.all([
      this.getDecimals(),
      this.governanceContract.methods.votesOf(voter).call()
    ]);

    return new BigNumber(weiVotes).dividedBy(new BigNumber(10).pow(decimals));
  }

  @action async getBalance({
    account
  }: {
    account: EthAddress;
  }): Promise<BigNumber> {
    if (!account) throw new Error("Cannot get balance without address");

    const [decimals, weiBalance] = await Promise.all([
      this.getDecimals(),
      this.tokenContract.methods.balanceOf(account).call()
    ]);

    return new BigNumber(weiBalance).dividedBy(new BigNumber(10).pow(decimals));
  }

  @action async getLock({
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

    return lock;
  }

  @action async stake({
    account,
    amount
  }: {
    account: EthAddress;
    amount: string;
  }): Promise<boolean> {
    if (!account || !amount)
      throw new Error("Cannot stake without address or amount");

    const allowance = await this.tokenContract.methods
      .allowance(account, await this.getGovernanceContractAddress())
      .call();

    const txContract = buildGovernanceContract(
      await this.getGovernanceContractAddress()
    );

    if (Number(allowance) < Number(amount)) {
      const tokenAddress = await txContract.methods.govToken().call();
      const tokenContract = buildTokenContract(tokenAddress);
      await tokenContract.methods
        .approve(await this.getGovernanceContractAddress(), amount.toString())
        .send({
          from: account
        });

      this.setLastTransaction(Date.now());
    }

    await txContract.methods.stake(amount.toString()).send({
      from: account
    });

    this.setLastTransaction(Date.now());

    return true;
  }

  @action async unstake({
    account,
    amount
  }: {
    account: EthAddress;
    amount: string;
  }): Promise<boolean> {
    if (!account || !amount)
      throw new Error("Cannot unstake without address or amount");

    const txContract = buildGovernanceContract(
      await this.getGovernanceContractAddress()
    );
    await txContract.methods.unstake(amount.toString()).send({
      from: account
    });

    this.setLastTransaction(Date.now());

    return true;
  }

  @action async propose({
    account,
    executor,
    hash
  }: {
    account: EthAddress;
    executor: EthAddress;
    hash: string;
  }): Promise<string> {
    if (!executor || !hash || !account)
      throw new Error("Cannot propose without executor and hash");

    const txContract = buildGovernanceContract(
      await this.getGovernanceContractAddress()
    );

    return new Promise((resolve, reject) => {
      let txHash: string;
      txContract.methods
        .propose(executor, hash)
        .send({
          from: account
        })
        .on("transactionHash", (hash: string) => {
          txHash = hash;
          this.setLastTransaction(Date.now());
          resolve(txHash);
        })
        .on("error", (error: any) => reject(error));
    });
  }

  @action async voteFor({
    account,
    proposalId
  }: {
    account: EthAddress;
    proposalId: string;
  }): Promise<boolean> {
    if (!account || !proposalId)
      throw new Error("Cannot vote for without address or proposal id");

    const txContract = buildGovernanceContract(
      await this.getGovernanceContractAddress()
    );
    await txContract.methods.voteFor(proposalId.toString()).send({
      from: account
    });

    this.setLastTransaction(Date.now());

    return true;
  }

  @action async voteAgainst({
    account,
    proposalId
  }: {
    account: EthAddress;
    proposalId: string;
  }): Promise<boolean> {
    if (!account || !proposalId)
      throw new Error("Cannot vote against without address or proposal id");

    const txContract = buildGovernanceContract(
      await this.getGovernanceContractAddress()
    );
    await txContract.methods.voteAgainst(proposalId.toString()).send({
      from: account
    });

    this.setLastTransaction(Date.now());

    return true;
  }

  @action async getProposal({
    proposalId,
    voter
  }: {
    proposalId: number;
    voter?: string;
  }): Promise<Proposal> {
    const decimals = await this.getDecimals();

    const proposal: Proposal = await this.governanceContract.methods
      .proposals(proposalId)
      .call();

    const totalVotesFor = parseFloat(
      shrinkToken(proposal.totalVotesFor, decimals)
    );
    const totalVotesAgainst = parseFloat(
      shrinkToken(proposal.totalVotesAgainst, decimals)
    );
    const totalAvailableVotes = parseFloat(
      shrinkToken(proposal.totalAvailableVotes, decimals)
    );

    let metadata;

    try {
      metadata = await this.getFromIPFS({
        hash: proposal.hash,
        timeoutInSeconds: 5
      });
    } catch (err) {
      console.error("Getting metadata failed!", err, proposal.hash);
    }

    const prop: Proposal = {
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
      totalAvailableVotes,
      totalVotes: totalVotesFor + totalVotesAgainst,
      votes: <Votes>{
        for: voter
          ? await this.governanceContract.methods
              .votesForOf(voter, proposal.id)
              .call()
          : "0",
        against: voter
          ? await this.governanceContract.methods
              .votesAgainstOf(voter, proposal.id)
              .call()
          : "0"
      },
      metadata: metadata,
      voters: await this.getVoters({ proposal })
    };

    const { for: vFor, against: vAgainst } = prop.votes;
    prop.votes.voted =
      vFor === vAgainst ? undefined : vFor > vAgainst ? "for" : "against";

    return prop;
  }

  @action async getVoters({
    proposal
  }: {
    proposal: Proposal;
  }): Promise<{ votes: Votes; account: string }[]> {
    const voteEvents = await this.governanceContract.getPastEvents("Vote", {
      filter: { _id: proposal.id.toString() },
      fromBlock: 0,
      toBlock: "latest"
    });

    return voteEvents.map(event => {
      return {
        account: event.returnValues["_voter"],
        votes: {
          voted: event.returnValues["_vote"] ? "for" : "against",
          for: event.returnValues["_vote"]
            ? event.returnValues["_weight"]
            : "0",
          against: event.returnValues["_vote"]
            ? "0"
            : event.returnValues["_weight"]
        }
      };
    });
  }

  @action async getProposals({
    voter
  }: {
    voter?: string;
  }): Promise<Proposal[]> {
    const proposalCount = Number(
      await this.governanceContract.methods.proposalCount().call()
    );

    const proposalIds = buildRange(proposalCount);
    const proposals = await Promise.all(
      proposalIds.map(proposalId => this.getProposal({ proposalId, voter }))
    );

    return proposals.reverse();
  }

  @action async getFromIPFS({
    hash,
    timeoutInSeconds
  }: {
    hash: string;
    timeoutInSeconds: number;
  }): Promise<ProposalMetaData> {
    if (this.metaDataCache[hash]) {
      return this.metaDataCache[hash];
    }

    const ipfs = IpfsHttpClient({ url: ipfsUrl });

    let metadata;

    for await (const file of ipfs.get(hash, {
      timeout: timeoutInSeconds * 1000
    })) {
      if (file.type == "file") {
        if (!file.content) continue;

        let content = "";

        for await (const chunk of file.content) {
          content += new TextDecoder("utf-8").decode(chunk);
        }

        metadata = JSON.parse(content);
        const newCache = this.metaDataCache;

        newCache[hash] = metadata;
        this.setMetaDataCache(newCache);

        break;
      }
    }

    return metadata;
  }

  @mutation setMetaDataCache(metaDataCache: {
    [id: string]: ProposalMetaData;
  }) {
    this.metaDataCache = metaDataCache;
  }

  @action async storeInIPFS({
    proposalMetaData
  }: {
    proposalMetaData: ProposalMetaData;
  }): Promise<string> {
    const ipfs = IpfsHttpClient({ url: ipfsUrl });

    const { path } = await ipfs.add(
      Buffer.from(JSON.stringify(proposalMetaData, null, 2))
    );
    return path;
  }

  @action async getPostFromDiscourse({
    postId
  }: {
    postId: string;
  }): Promise<{ description: string }> {
    const post = await axios
      .get(`${discourseUrl}posts/${postId}.json`)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response.data;
        } else {
          throw new Error(response.statusText);
        }
      });

    const description = post.raw;
    return {
      description
    };
  }

  @action async getTopicFromDiscourse({
    topicId
  }: {
    topicId: string;
  }): Promise<{ title: string; description: string }> {
    const topic = await axios
      .get(`${discourseUrl}t/${topicId}.json`)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response.data;
        } else {
          throw new Error(response.statusText);
        }
      });

    const postId = topic.post_stream.posts[0].id;
    const { description } = await this.getPostFromDiscourse({
      postId
    });
    return {
      title: topic.title,
      description
    };
  }
}
