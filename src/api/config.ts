import { EthNetworks } from "@/api/web3";

interface EthNetworkVariables {
  contractRegistry: string;
  bntToken: string;
  ethToken: string;
  vBntToken: string;
  multiCall: string;
  liquidityProtectionToken: string;
  converterContractForMaths: string;
  governanceContractAddress: string;
  etherscanUrl: string;
  alchemyKey: string;
  govToken: string;
}

export const getNetworkVariables = (
  ethNetwork: EthNetworks
): EthNetworkVariables => {
  const ethToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  switch (ethNetwork) {
    case EthNetworks.Mainnet:
      return {
        contractRegistry: "0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4",
        bntToken: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        govToken: "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94",
        ethToken,
        vBntToken: "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94",
        liquidityProtectionToken: ethToken,
        multiCall: "0x5Eb3fa2DFECdDe21C950813C665E9364fa609bD2",
        converterContractForMaths: "0xe870d00176b2c71afd4c43cea550228e22be4abd",
        governanceContractAddress: "0x892f481bd6e9d7d26ae365211d9b45175d5d00e4",
        etherscanUrl: "https://etherscan.io/",
        alchemyKey: process.env.VUE_APP_ALCHEMY_MAINNET || ""
      };
    case EthNetworks.Ropsten:
      return {
        contractRegistry: "0xA6DB4B0963C37Bc959CbC0a874B5bDDf2250f26F",
        bntToken: "0xF35cCfbcE1228014F66809EDaFCDB836BFE388f5",
        govToken: "0x83ec8129b1f54ba5b0f47bd902a79c803e20a249",
        ethToken,
        vBntToken: "0x83ec8129b1f54ba5b0f47bd902a79c803e20a249",
        liquidityProtectionToken: ethToken,
        multiCall: "0xf3ad7e31b052ff96566eedd218a823430e74b406",
        converterContractForMaths: "0x9a36b31ca768a860dab246cf080e7f042d1b7c0f",
        governanceContractAddress: "0x161f28A417361961E946Ae03EF0A425008b7F01B",
        etherscanUrl: "https://ropsten.etherscan.io/",
        alchemyKey: process.env.VUE_APP_ALCHEMY_ROPSTEN || ""
      };
    default:
      throw new Error("Information not stored");
  }
};
