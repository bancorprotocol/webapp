import { getNetworkVariables } from "@/store/config";
import { EthNetworks } from "@/api/helpers";
import Web3 from "web3";

const buildAlchemyUrl = (network: string, projectId: string) =>
  `wss://eth-${network}.ws.alchemyapi.io/v2/${projectId}`;

export const getAlchemyUrl = (network: EthNetworks) => {
  if (network == EthNetworks.Mainnet) {
    return buildAlchemyUrl("mainnet", getNetworkVariables(network).alchemyKey);
  } else if (network == EthNetworks.Ropsten) {
    return buildAlchemyUrl("ropsten", getNetworkVariables(network).alchemyKey);
  }
  throw new Error("alchemy address for network not supported ");
};

export enum Provider {
  Alchemy
}

const providerCache: {
  [key: string]: any;
} = {};

export const getWeb3 = (network: EthNetworks, provider: Provider): Web3 => {
  let web3Url;
  switch (provider) {
    case Provider.Alchemy:
      web3Url = getAlchemyUrl(network);
      break;
  }

  let wssProvider = providerCache[web3Url];

  if (!wssProvider) {
    wssProvider = new Web3.providers.WebsocketProvider(web3Url);
    providerCache[web3Url] = wssProvider;
  }

  return new Web3(wssProvider);
};
