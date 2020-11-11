import { getNetworkVariables } from "@/store/config";
import { EthNetworks } from "@/api/helpers";
import Web3 from "web3";

const buildAlchemyUrl = (
  network: string,
  projectId: string,
  wss: boolean = true
) =>
  `${wss ? "wss" : "https"}://eth-${network}${
    wss ? ".ws" : ""
  }.alchemyapi.io/v2/${projectId}`;

export const getAlchemyUrl = (network: EthNetworks, wss: boolean = true) => {
  if (network == EthNetworks.Mainnet) {
    return buildAlchemyUrl(
      "mainnet",
      getNetworkVariables(network).alchemyKey,
      wss
    );
  } else if (network == EthNetworks.Ropsten) {
    return buildAlchemyUrl(
      "ropsten",
      getNetworkVariables(network).alchemyKey,
      wss
    );
  }
  throw new Error("alchemy address for network not supported ");
};

export enum Provider {
  Alchemy
}

const providerCache: {
  [key: string]: any;
} = {};

export const getWeb3 = (
  network: EthNetworks,
  provider: Provider = Provider.Alchemy
): Web3 => {
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
