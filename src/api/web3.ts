import { getNetworkVariables } from "@/api/config";
import Web3 from "web3";

export enum EthNetworks {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5
}

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
    wssProvider = new Web3.providers.WebsocketProvider(web3Url, {
      timeout: 100 * 1000,
      clientConfig: {
        keepalive: true,
        keepaliveInterval: 60000
      },
      reconnect: {
        auto: true,
        delay: 15000,
        onTimeout: true
      }
    });
    providerCache[web3Url] = wssProvider;
  }

  return new Web3(wssProvider);
};

const projectId = "da059c364a2f4e6eb89bfd89600bce07";

const buildInfuraAddress = (
  subdomain: string,
  projectId: string,
  wss: boolean = false
) =>
  `${wss ? "wss" : "https"}://${subdomain}.infura.io/${
    wss ? "ws/" : ""
  }v3/${projectId}`;

export const getInfuraAddress = (
  network: EthNetworks,
  wss: boolean = false
) => {
  if (network == EthNetworks.Mainnet) {
    return buildInfuraAddress("mainnet", projectId, wss);
  } else if (network == EthNetworks.Ropsten) {
    return buildInfuraAddress("ropsten", projectId, wss);
  }
  throw new Error("Infura address for network not supported ");
};

export const alchemyAddress = getAlchemyUrl(EthNetworks.Mainnet);

export const provider = Web3.givenProvider || alchemyAddress;

export const web3 = new Web3(provider);

web3.eth.transactionBlockTimeout = 100;
