import { AbiItem } from "web3-utils";

export const ethErc20WrapperContract =
  "0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315";

export const ethReserveAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const ABIContractRegistry: AbiItem[] = [
  {
    constant: true,
    inputs: [],
    name: "BANCOR_CONVERTER_UPGRADER",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "BNT_TOKEN",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_contractName", type: "bytes32" }],
    name: "getAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "CONTRACT_REGISTRY",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_contractName", type: "bytes32" }],
    name: "unregisterAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "contractNames",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "BANCOR_CONVERTER_FACTORY",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "BNT_CONVERTER",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_contractName", type: "bytes32" },
      { name: "_contractAddress", type: "address" }
    ],
    name: "registerAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "itemCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "BANCOR_FORMULA",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "CONTRACT_FEATURES",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "BANCOR_NETWORK",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "BANCOR_GAS_PRICE_LIMIT",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_contractName", type: "bytes32" }],
    name: "addressOf",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "BANCOR_X",
    outputs: [{ name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_contractName", type: "bytes32" },
      { indexed: false, name: "_contractAddress", type: "address" }
    ],
    name: "AddressUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_prevOwner", type: "address" },
      { indexed: true, name: "_newOwner", type: "address" }
    ],
    name: "OwnerUpdate",
    type: "event"
  }
];

export const ABIBancorGasPriceLimit: AbiItem[] = [
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "gasPrice",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "_gasPrice", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_prevOwner", type: "address" },
      { indexed: true, name: "_newOwner", type: "address" }
    ],
    name: "OwnerUpdate",
    type: "event"
  },
  {
    constant: false,
    inputs: [{ name: "_gasPrice", type: "uint256" }],
    name: "setGasPrice",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_gasPrice", type: "uint256" }],
    name: "validateGasPrice",
    outputs: [],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

export const ABIMultiCallContract: AbiItem[] = [
  {
    constant: false,
    inputs: [
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" }
        ],
        internalType: "struct Multicall.Call[]",
        name: "calls",
        type: "tuple[]"
      },
      { internalType: "bool", name: "strict", type: "bool" }
    ],
    name: "aggregate",
    outputs: [
      { internalType: "uint256", name: "blockNumber", type: "uint256" },
      {
        components: [
          { internalType: "bool", name: "success", type: "bool" },
          { internalType: "bytes", name: "data", type: "bytes" }
        ],
        internalType: "struct Multicall.Return[]",
        name: "returnData",
        type: "tuple[]"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

export const ABIContainerContract: AbiItem[] = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "withdrawTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "_name", type: "string" },
      { name: "_symbol", type: "string" },
      { name: "_decimals", type: "uint8" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_prevOwner", type: "address" },
      { indexed: true, name: "_newOwner", type: "address" }
    ],
    name: "OwnerUpdate",
    type: "event"
  },
  {
    constant: true,
    inputs: [],
    name: "poolTokens",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "createToken",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_from", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

export const ABISmartToken: AbiItem[] = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_disable", type: "bool" }],
    name: "disableTransfers",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "version",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "withdrawTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "issue",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "destroy",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "transfersEnabled",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }, { name: "", type: "address" }],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "_name", type: "string" },
      { name: "_symbol", type: "string" },
      { name: "_decimals", type: "uint8" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "_token", type: "address" }],
    name: "NewSmartToken",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "_amount", type: "uint256" }],
    name: "Issuance",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "_amount", type: "uint256" }],
    name: "Destruction",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_from", type: "address" },
      { indexed: true, name: "_to", type: "address" },
      { indexed: false, name: "_value", type: "uint256" }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_owner", type: "address" },
      { indexed: true, name: "_spender", type: "address" },
      { indexed: false, name: "_value", type: "uint256" }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_prevOwner", type: "address" },
      { indexed: true, name: "_newOwner", type: "address" }
    ],
    name: "OwnerUpdate",
    type: "event"
  }
];

export const ABIConverterRegistry: AbiItem[] = [
  {
    constant: false,
    inputs: [{ name: "_onlyOwnerCanUpdateRegistry", type: "bool" }],
    name: "restrictRegistryUpdate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getSmartTokens",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_convertibleToken", type: "address" }],
    name: "getConvertibleTokenAnchors",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_type", type: "uint16" },
      { name: "_reserveTokens", type: "address[]" },
      { name: "_reserveWeights", type: "uint32[]" }
    ],
    name: "getLiquidityPoolByConfig",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_smartTokens", type: "address[]" }],
    name: "getConvertersBySmartTokens",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "onlyOwnerCanUpdateRegistry",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_value", type: "address" }],
    name: "isConvertibleToken",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_value", type: "address" }],
    name: "isSmartToken",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_convertibleToken", type: "address" }],
    name: "getConvertibleTokenAnchorCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "updateRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_index", type: "uint256" }],
    name: "getAnchor",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_type", type: "uint16" },
      { name: "_name", type: "string" },
      { name: "_symbol", type: "string" },
      { name: "_decimals", type: "uint8" },
      { name: "_maxConversionFee", type: "uint32" },
      { name: "_reserveTokens", type: "address[]" },
      { name: "_reserveWeights", type: "uint32[]" }
    ],
    name: "newConverter",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getConvertibleTokens",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_convertibleToken", type: "address" },
      { name: "_index", type: "uint256" }
    ],
    name: "getConvertibleTokenAnchor",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_anchors", type: "address[]" }],
    name: "getConvertersByAnchors",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "prevRegistry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getConvertibleTokenCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_converter", type: "address" }],
    name: "addConverter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_convertibleToken", type: "address" },
      { name: "_value", type: "address" }
    ],
    name: "isConvertibleTokenSmartToken",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getLiquidityPoolCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "registry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getLiquidityPools",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_index", type: "uint256" }],
    name: "getConvertibleToken",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_converter", type: "address" }],
    name: "isSimilarLiquidityPoolRegistered",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_converter", type: "address" }],
    name: "isConverterValid",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_converter", type: "address" }],
    name: "removeConverter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_index", type: "uint256" }],
    name: "getSmartToken",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_convertibleToken", type: "address" }],
    name: "getConvertibleTokenSmartTokenCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_index", type: "uint256" }],
    name: "getLiquidityPool",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "restoreRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_convertibleToken", type: "address" },
      { name: "_value", type: "address" }
    ],
    name: "isConvertibleTokenAnchor",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_reserveTokens", type: "address[]" },
      { name: "_reserveWeights", type: "uint32[]" }
    ],
    name: "getLiquidityPoolByReserveConfig",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "safeTransfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getAnchorCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_convertibleToken", type: "address" },
      { name: "_index", type: "uint256" }
    ],
    name: "getConvertibleTokenSmartToken",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_value", type: "address" }],
    name: "isAnchor",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "safeTransferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getSmartTokenCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_value", type: "address" }],
    name: "isLiquidityPool",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "safeApprove",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getAnchors",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_convertibleToken", type: "address" }],
    name: "getConvertibleTokenSmartTokens",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "_registry", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "_anchor", type: "address" }],
    name: "ConverterAnchorAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "_anchor", type: "address" }],
    name: "ConverterAnchorRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "_liquidityPool", type: "address" }],
    name: "LiquidityPoolAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "_liquidityPool", type: "address" }],
    name: "LiquidityPoolRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_convertibleToken", type: "address" },
      { indexed: true, name: "_smartToken", type: "address" }
    ],
    name: "ConvertibleTokenAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_convertibleToken", type: "address" },
      { indexed: true, name: "_smartToken", type: "address" }
    ],
    name: "ConvertibleTokenRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "_smartToken", type: "address" }],
    name: "SmartTokenAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "_smartToken", type: "address" }],
    name: "SmartTokenRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_prevOwner", type: "address" },
      { indexed: true, name: "_newOwner", type: "address" }
    ],
    name: "OwnerUpdate",
    type: "event"
  }
];

export const V2PoolsTokenContainer: AbiItem[] = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "withdrawTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "_name", type: "string" },
      { name: "_symbol", type: "string" },
      { name: "_decimals", type: "uint8" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_prevOwner", type: "address" },
      { indexed: true, name: "_newOwner", type: "address" }
    ],
    name: "OwnerUpdate",
    type: "event"
  },
  {
    constant: true,
    inputs: [],
    name: "poolTokens",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "createToken",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_from", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

export const ABIConverterV28: AbiItem[] = [
  {
    constant: false,
    inputs: [{ name: "_onlyOwnerCanUpdateRegistry", type: "bool" }],
    name: "restrictRegistryUpdate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "reserveRatio",
    outputs: [{ name: "", type: "uint32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_address", type: "address" }],
    name: "connectors",
    outputs: [
      { name: "", type: "uint256" },
      { name: "", type: "uint32" },
      { name: "", type: "bool" },
      { name: "", type: "bool" },
      { name: "", type: "bool" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "hasETHReserve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_index", type: "uint256" }],
    name: "connectorTokens",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_reserveToken", type: "address" }],
    name: "reserveWeight",
    outputs: [{ name: "", type: "uint32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_sourceToken", type: "address" },
      { name: "_targetToken", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "getReturn",
    outputs: [{ name: "", type: "uint256" }, { name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferTokenOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isActive",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "onlyOwnerCanUpdateRegistry",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptTokenOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "withdrawFromAnchor",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "converterType",
    outputs: [{ name: "", type: "uint16" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_amount", type: "uint256" }],
    name: "liquidate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "updateRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_whitelist", type: "address" }],
    name: "setConversionWhitelist",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "version",
    outputs: [{ name: "", type: "uint16" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "conversionFee",
    outputs: [{ name: "", type: "uint32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "withdrawTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "prevRegistry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferAnchorOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_to", type: "address" }],
    name: "withdrawETH",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_weight", type: "uint32" }
    ],
    name: "addReserve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_x", type: "uint256" }],
    name: "decimalLength",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "connectorTokenCount",
    outputs: [{ name: "", type: "uint16" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "registry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_reserveTokens", type: "address[]" },
      { name: "_reserveAmounts", type: "uint256[]" },
      { name: "_minReturn", type: "uint256" }
    ],
    name: "addLiquidity",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "maxConversionFee",
    outputs: [{ name: "", type: "uint32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "reserveTokenCount",
    outputs: [{ name: "", type: "uint16" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_values", type: "uint256[]" }],
    name: "geometricMean",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_sourceToken", type: "address" },
      { name: "_targetToken", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "targetAmountAndFee",
    outputs: [{ name: "", type: "uint256" }, { name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_amount", type: "uint256" },
      { name: "_reserveTokens", type: "address[]" },
      { name: "_reserveMinReturnAmounts", type: "uint256[]" }
    ],
    name: "removeLiquidity",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "restoreRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_n", type: "uint256" }, { name: "_d", type: "uint256" }],
    name: "roundDiv",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "conversionsEnabled",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "conversionWhitelist",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_amount", type: "uint256" }],
    name: "fund",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptAnchorOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "reserveTokens",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isV28OrHigher",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "anchor",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "upgrade",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "reserves",
    outputs: [
      { name: "balance", type: "uint256" },
      { name: "weight", type: "uint32" },
      { name: "deprecated1", type: "bool" },
      { name: "deprecated2", type: "bool" },
      { name: "isSet", type: "bool" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_connectorToken", type: "address" }],
    name: "getConnectorBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_reserveToken", type: "address" }],
    name: "reserveBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_sourceToken", type: "address" },
      { name: "_targetToken", type: "address" },
      { name: "_amount", type: "uint256" },
      { name: "_trader", type: "address" },
      { name: "_beneficiary", type: "address" }
    ],
    name: "convert",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_conversionFee", type: "uint32" }],
    name: "setConversionFee",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "token",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "_token", type: "address" },
      { name: "_registry", type: "address" },
      { name: "_maxConversionFee", type: "uint32" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_connectorToken", type: "address" },
      { indexed: false, name: "_tokenSupply", type: "uint256" },
      { indexed: false, name: "_connectorBalance", type: "uint256" },
      { indexed: false, name: "_connectorWeight", type: "uint32" }
    ],
    name: "PriceDataUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_provider", type: "address" },
      { indexed: true, name: "_reserveToken", type: "address" },
      { indexed: false, name: "_amount", type: "uint256" },
      { indexed: false, name: "_newBalance", type: "uint256" },
      { indexed: false, name: "_newSupply", type: "uint256" }
    ],
    name: "LiquidityAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_provider", type: "address" },
      { indexed: true, name: "_reserveToken", type: "address" },
      { indexed: false, name: "_amount", type: "uint256" },
      { indexed: false, name: "_newBalance", type: "uint256" },
      { indexed: false, name: "_newSupply", type: "uint256" }
    ],
    name: "LiquidityRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "_anchor", type: "address" },
      { indexed: false, name: "_activated", type: "bool" }
    ],
    name: "Activation",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_fromToken", type: "address" },
      { indexed: true, name: "_toToken", type: "address" },
      { indexed: true, name: "_trader", type: "address" },
      { indexed: false, name: "_amount", type: "uint256" },
      { indexed: false, name: "_return", type: "uint256" },
      { indexed: false, name: "_conversionFee", type: "int256" }
    ],
    name: "Conversion",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_token1", type: "address" },
      { indexed: true, name: "_token2", type: "address" },
      { indexed: false, name: "_rateN", type: "uint256" },
      { indexed: false, name: "_rateD", type: "uint256" }
    ],
    name: "TokenRateUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "_prevFee", type: "uint32" },
      { indexed: false, name: "_newFee", type: "uint32" }
    ],
    name: "ConversionFeeUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_prevOwner", type: "address" },
      { indexed: true, name: "_newOwner", type: "address" }
    ],
    name: "OwnerUpdate",
    type: "event"
  }
];

export const ABIConverter: AbiItem[] = [
  {
    constant: false,
    inputs: [{ name: "_onlyOwnerCanUpdateRegistry", type: "bool" }],
    name: "restrictRegistryUpdate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "reserveRatio",
    outputs: [{ name: "", type: "uint32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_address", type: "address" }],
    name: "connectors",
    outputs: [
      { name: "", type: "uint256" },
      { name: "", type: "uint32" },
      { name: "", type: "bool" },
      { name: "", type: "bool" },
      { name: "", type: "bool" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "hasETHReserve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_index", type: "uint256" }],
    name: "connectorTokens",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_reserveToken", type: "address" }],
    name: "reserveWeight",
    outputs: [{ name: "", type: "uint32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_sourceToken", type: "address" },
      { name: "_targetToken", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "getReturn",
    outputs: [{ name: "", type: "uint256" }, { name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferTokenOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isActive",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "onlyOwnerCanUpdateRegistry",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptTokenOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "withdrawFromAnchor",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "converterType",
    outputs: [{ name: "", type: "uint16" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_amount", type: "uint256" }],
    name: "liquidate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_sourceToken", type: "address" },
      { name: "_targetToken", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "rateAndFee",
    outputs: [{ name: "", type: "uint256" }, { name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "updateRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_whitelist", type: "address" }],
    name: "setConversionWhitelist",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "version",
    outputs: [{ name: "", type: "uint16" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "conversionFee",
    outputs: [{ name: "", type: "uint32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "withdrawTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "prevRegistry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferAnchorOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_to", type: "address" }],
    name: "withdrawETH",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_weight", type: "uint32" }
    ],
    name: "addReserve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_x", type: "uint256" }],
    name: "decimalLength",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "connectorTokenCount",
    outputs: [{ name: "", type: "uint16" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "registry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_reserveTokens", type: "address[]" },
      { name: "_reserveAmounts", type: "uint256[]" },
      { name: "_minReturn", type: "uint256" }
    ],
    name: "addLiquidity",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "maxConversionFee",
    outputs: [{ name: "", type: "uint32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "reserveTokenCount",
    outputs: [{ name: "", type: "uint16" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_values", type: "uint256[]" }],
    name: "geometricMean",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_amount", type: "uint256" },
      { name: "_reserveTokens", type: "address[]" },
      { name: "_reserveMinReturnAmounts", type: "uint256[]" }
    ],
    name: "removeLiquidity",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "restoreRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_n", type: "uint256" }, { name: "_d", type: "uint256" }],
    name: "roundDiv",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "conversionsEnabled",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "conversionWhitelist",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_amount", type: "uint256" }],
    name: "fund",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptAnchorOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "reserveTokens",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "safeTransfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isV28OrHigher",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "anchor",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "upgrade",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "reserves",
    outputs: [
      { name: "balance", type: "uint256" },
      { name: "weight", type: "uint32" },
      { name: "deprecated1", type: "bool" },
      { name: "deprecated2", type: "bool" },
      { name: "isSet", type: "bool" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_connectorToken", type: "address" }],
    name: "getConnectorBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "safeTransferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_reserveToken", type: "address" }],
    name: "reserveBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_sourceToken", type: "address" },
      { name: "_targetToken", type: "address" },
      { name: "_amount", type: "uint256" },
      { name: "_trader", type: "address" },
      { name: "_beneficiary", type: "address" }
    ],
    name: "convert",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "safeApprove",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_conversionFee", type: "uint32" }],
    name: "setConversionFee",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "token",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "_token", type: "address" },
      { name: "_registry", type: "address" },
      { name: "_maxConversionFee", type: "uint32" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_connectorToken", type: "address" },
      { indexed: false, name: "_tokenSupply", type: "uint256" },
      { indexed: false, name: "_connectorBalance", type: "uint256" },
      { indexed: false, name: "_connectorWeight", type: "uint32" }
    ],
    name: "PriceDataUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_provider", type: "address" },
      { indexed: true, name: "_reserveToken", type: "address" },
      { indexed: false, name: "_amount", type: "uint256" },
      { indexed: false, name: "_newBalance", type: "uint256" },
      { indexed: false, name: "_newSupply", type: "uint256" }
    ],
    name: "LiquidityAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_provider", type: "address" },
      { indexed: true, name: "_reserveToken", type: "address" },
      { indexed: false, name: "_amount", type: "uint256" },
      { indexed: false, name: "_newBalance", type: "uint256" },
      { indexed: false, name: "_newSupply", type: "uint256" }
    ],
    name: "LiquidityRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "_anchor", type: "address" },
      { indexed: false, name: "_activated", type: "bool" }
    ],
    name: "Activation",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_fromToken", type: "address" },
      { indexed: true, name: "_toToken", type: "address" },
      { indexed: true, name: "_trader", type: "address" },
      { indexed: false, name: "_amount", type: "uint256" },
      { indexed: false, name: "_return", type: "uint256" },
      { indexed: false, name: "_conversionFee", type: "int256" }
    ],
    name: "Conversion",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_token1", type: "address" },
      { indexed: true, name: "_token2", type: "address" },
      { indexed: false, name: "_rateN", type: "uint256" },
      { indexed: false, name: "_rateD", type: "uint256" }
    ],
    name: "TokenRateUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "_prevFee", type: "uint32" },
      { indexed: false, name: "_newFee", type: "uint32" }
    ],
    name: "ConversionFeeUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_prevOwner", type: "address" },
      { indexed: true, name: "_newOwner", type: "address" }
    ],
    name: "OwnerUpdate",
    type: "event"
  }
];

export const ABINetworkPathFinder: AbiItem[] = [
  {
    constant: false,
    inputs: [{ name: "_adminOnly", type: "bool" }],
    name: "restrictRegistryUpdate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_anchorToken", type: "address" }],
    name: "setAnchorToken",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "updateRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "prevRegistry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_sourceToken", type: "address" },
      { name: "_targetToken", type: "address" }
    ],
    name: "generatePath",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "registry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "restoreRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "adminOnly",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "anchorToken",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "_registry", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_prevOwner", type: "address" },
      { indexed: true, name: "_newOwner", type: "address" }
    ],
    name: "OwnerUpdate",
    type: "event"
  }
];

export const ABINetworkContract: AbiItem[] = [
  {
    constant: false,
    inputs: [{ name: "_onlyOwnerCanUpdateRegistry", type: "bool" }],
    name: "restrictRegistryUpdate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_register", type: "bool" }
    ],
    name: "registerEtherToken",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" }
    ],
    name: "getReturnByPath",
    outputs: [{ name: "", type: "uint256" }, { name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" },
      { name: "_beneficiary", type: "address" },
      { name: "_affiliateAccount", type: "address" },
      { name: "_affiliateFee", type: "uint256" }
    ],
    name: "claimAndConvertFor2",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "onlyOwnerCanUpdateRegistry",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "updateRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" },
      { name: "_affiliateAccount", type: "address" },
      { name: "_affiliateFee", type: "uint256" }
    ],
    name: "convert2",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "maxAffiliateFee",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "withdrawTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "prevRegistry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "registry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" }
    ],
    name: "rateByPath",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "etherTokens",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_bancorX", type: "address" },
      { name: "_conversionId", type: "uint256" },
      { name: "_minReturn", type: "uint256" },
      { name: "_beneficiary", type: "address" }
    ],
    name: "completeXConversion",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" },
      { name: "_beneficiary", type: "address" },
      { name: "_affiliateAccount", type: "address" },
      { name: "_affiliateFee", type: "uint256" }
    ],
    name: "convertFor2",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" },
      { name: "_beneficiary", type: "address" }
    ],
    name: "claimAndConvertFor",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "restoreRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" },
      { name: "_beneficiary", type: "address" },
      { name: "_affiliateAccount", type: "address" },
      { name: "_affiliateFee", type: "uint256" }
    ],
    name: "convertByPath",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" },
      { name: "_targetBlockchain", type: "bytes32" },
      { name: "_targetAccount", type: "bytes32" },
      { name: "_conversionId", type: "uint256" }
    ],
    name: "xConvert",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" }
    ],
    name: "claimAndConvert",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" },
      { name: "_beneficiary", type: "address" }
    ],
    name: "convertFor",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" },
      { name: "_targetBlockchain", type: "bytes32" },
      { name: "_targetAccount", type: "bytes32" },
      { name: "_conversionId", type: "uint256" },
      { name: "_affiliateAccount", type: "address" },
      { name: "_affiliateFee", type: "uint256" }
    ],
    name: "xConvert2",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "safeTransfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_sourceToken", type: "address" },
      { name: "_targetToken", type: "address" }
    ],
    name: "conversionPath",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "safeTransferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" },
      { name: "_affiliateAccount", type: "address" },
      { name: "_affiliateFee", type: "uint256" }
    ],
    name: "claimAndConvert2",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "safeApprove",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_path", type: "address[]" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" }
    ],
    name: "convert",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_maxAffiliateFee", type: "uint256" }],
    name: "setMaxAffiliateFee",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "_registry", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_smartToken", type: "address" },
      { indexed: true, name: "_fromToken", type: "address" },
      { indexed: true, name: "_toToken", type: "address" },
      { indexed: false, name: "_fromAmount", type: "uint256" },
      { indexed: false, name: "_toAmount", type: "uint256" },
      { indexed: false, name: "_trader", type: "address" }
    ],
    name: "Conversion",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_prevOwner", type: "address" },
      { indexed: true, name: "_newOwner", type: "address" }
    ],
    name: "OwnerUpdate",
    type: "event"
  }
];

export const ABIV2Converter: AbiItem[] = [
  {
    constant: true,
    inputs: [{ name: "_reserveToken", type: "address" }],
    name: "reserveStakedBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_onlyOwnerCanUpdateRegistry", type: "bool" }],
    name: "restrictRegistryUpdate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "primaryReserveToken",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "maxStakedBalanceEnabled",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "reserveRatio",
    outputs: [{ name: "", type: "uint32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_address", type: "address" }],
    name: "connectors",
    outputs: [
      { name: "", type: "uint256" },
      { name: "", type: "uint32" },
      { name: "", type: "bool" },
      { name: "", type: "bool" },
      { name: "", type: "bool" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_primaryReserveToken", type: "address" },
      { name: "_primaryReserveOracle", type: "address" },
      { name: "_secondaryReserveOracle", type: "address" }
    ],
    name: "activate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "hasETHReserve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "disableMaxStakedBalances",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_index", type: "uint256" }],
    name: "connectorTokens",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_reserveToken", type: "address" }],
    name: "reserveWeight",
    outputs: [{ name: "", type: "uint32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_sourceToken", type: "address" },
      { name: "_targetToken", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "getReturn",
    outputs: [{ name: "", type: "uint256" }, { name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferTokenOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isActive",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "priceOracle",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_reserveToken", type: "address" }],
    name: "reserveAmplifiedBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_poolToken", type: "address" }],
    name: "liquidationLimit",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "onlyOwnerCanUpdateRegistry",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptTokenOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "withdrawFromAnchor",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "converterType",
    outputs: [{ name: "", type: "uint16" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_reserve1MaxStakedBalance", type: "uint256" },
      { name: "_reserve2MaxStakedBalance", type: "uint256" }
    ],
    name: "setMaxStakedBalances",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "updateRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_whitelist", type: "address" }],
    name: "setConversionWhitelist",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "version",
    outputs: [{ name: "", type: "uint16" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_reserveToken", type: "address" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" }
    ],
    name: "addLiquidity",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_reserveToken", type: "address" }],
    name: "poolToken",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "conversionFee",
    outputs: [{ name: "", type: "uint32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_to", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "withdrawTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "prevRegistry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferAnchorOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_poolToken", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "removeLiquidityReturnAndFee",
    outputs: [{ name: "", type: "uint256" }, { name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_to", type: "address" }],
    name: "withdrawETH",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_token", type: "address" },
      { name: "_weight", type: "uint32" }
    ],
    name: "addReserve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "connectorTokenCount",
    outputs: [{ name: "", type: "uint16" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "registry",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "maxConversionFee",
    outputs: [{ name: "", type: "uint32" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "maxStakedBalances",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "reserveTokenCount",
    outputs: [{ name: "", type: "uint16" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "referenceRate",
    outputs: [{ name: "n", type: "uint256" }, { name: "d", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_sourceToken", type: "address" },
      { name: "_targetToken", type: "address" },
      { name: "_amount", type: "uint256" }
    ],
    name: "targetAmountAndFee",
    outputs: [{ name: "", type: "uint256" }, { name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "restoreRegistry",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "conversionsEnabled",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_reserveToken", type: "address" },
      { name: "_balance", type: "uint256" }
    ],
    name: "setReserveStakedBalance",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "referenceRateUpdateTime",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "conversionWhitelist",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "acceptAnchorOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "reserveTokens",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isV28OrHigher",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "anchor",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "upgrade",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "amplificationFactor",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "reserves",
    outputs: [
      { name: "balance", type: "uint256" },
      { name: "weight", type: "uint32" },
      { name: "deprecated1", type: "bool" },
      { name: "deprecated2", type: "bool" },
      { name: "isSet", type: "bool" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_connectorToken", type: "address" }],
    name: "getConnectorBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "effectiveTokensRate",
    outputs: [{ name: "", type: "uint256" }, { name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "secondaryReserveToken",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "_reserveToken", type: "address" }],
    name: "reserveBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_poolToken", type: "address" },
      { name: "_amount", type: "uint256" },
      { name: "_minReturn", type: "uint256" }
    ],
    name: "removeLiquidity",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_sourceToken", type: "address" },
      { name: "_targetToken", type: "address" },
      { name: "_amount", type: "uint256" },
      { name: "_trader", type: "address" },
      { name: "_beneficiary", type: "address" }
    ],
    name: "convert",
    outputs: [{ name: "", type: "uint256" }],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "effectiveReserveWeights",
    outputs: [{ name: "", type: "uint256" }, { name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_conversionFee", type: "uint32" }],
    name: "setConversionFee",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "lastConversionRate",
    outputs: [{ name: "n", type: "uint256" }, { name: "d", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "token",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "_poolTokensContainer", type: "address" },
      { name: "_registry", type: "address" },
      { name: "_maxConversionFee", type: "uint32" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_provider", type: "address" },
      { indexed: true, name: "_reserveToken", type: "address" },
      { indexed: false, name: "_amount", type: "uint256" },
      { indexed: false, name: "_newBalance", type: "uint256" },
      { indexed: false, name: "_newSupply", type: "uint256" }
    ],
    name: "LiquidityAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_provider", type: "address" },
      { indexed: true, name: "_reserveToken", type: "address" },
      { indexed: false, name: "_amount", type: "uint256" },
      { indexed: false, name: "_newBalance", type: "uint256" },
      { indexed: false, name: "_newSupply", type: "uint256" }
    ],
    name: "LiquidityRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_type", type: "uint16" },
      { indexed: true, name: "_anchor", type: "address" },
      { indexed: true, name: "_activated", type: "bool" }
    ],
    name: "Activation",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_fromToken", type: "address" },
      { indexed: true, name: "_toToken", type: "address" },
      { indexed: true, name: "_trader", type: "address" },
      { indexed: false, name: "_amount", type: "uint256" },
      { indexed: false, name: "_return", type: "uint256" },
      { indexed: false, name: "_conversionFee", type: "int256" }
    ],
    name: "Conversion",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_token1", type: "address" },
      { indexed: true, name: "_token2", type: "address" },
      { indexed: false, name: "_rateN", type: "uint256" },
      { indexed: false, name: "_rateD", type: "uint256" }
    ],
    name: "TokenRateUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "_prevFee", type: "uint32" },
      { indexed: false, name: "_newFee", type: "uint32" }
    ],
    name: "ConversionFeeUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "_prevOwner", type: "address" },
      { indexed: true, name: "_newOwner", type: "address" }
    ],
    name: "OwnerUpdate",
    type: "event"
  }
];

export const ABIBancorGovernance: AbiItem[] = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_govToken",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_start",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_duration",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "_proposer",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "_executor",
        type: "address"
      }
    ],
    name: "NewProposal",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_prevOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_newOwner",
        type: "address"
      }
    ],
    name: "OwnerUpdate",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_executor",
        type: "address"
      }
    ],
    name: "ProposalExecuted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_for",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_against",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_quorumReached",
        type: "bool"
      }
    ],
    name: "ProposalFinished",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_quorum",
        type: "uint256"
      }
    ],
    name: "QuorumUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "Staked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "Unstaked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "_voter",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_vote",
        type: "bool"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_weight",
        type: "uint256"
      }
    ],
    name: "Vote",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_voteDuration",
        type: "uint256"
      }
    ],
    name: "VoteDurationUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_duration",
        type: "uint256"
      }
    ],
    name: "VoteLockDurationUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_voteMinimum",
        type: "uint256"
      }
    ],
    name: "VoteMinimumUpdated",
    type: "event"
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "govToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "newOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "proposalCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "proposals",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "totalVotesFor",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "totalVotesAgainst",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "start",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "end",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "totalAvailableVotes",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "quorum",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "quorumRequired",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "open",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "executed",
        type: "bool"
      },
      {
        internalType: "address",
        name: "proposer",
        type: "address"
      },
      {
        internalType: "address",
        name: "executor",
        type: "address"
      },
      {
        internalType: "string",
        name: "hash",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "quorum",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "totalVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "voteDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "voteLockDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "voteLockFraction",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "voteLocks",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "voteMinimum",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "voters",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "exit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "proposalStats",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address"
      }
    ],
    name: "votesOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "votesAgainstOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "votesForOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_quorum",
        type: "uint256"
      }
    ],
    name: "setQuorum",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_voteMinimum",
        type: "uint256"
      }
    ],
    name: "setVoteMinimum",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_voteDuration",
        type: "uint256"
      }
    ],
    name: "setVoteDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256"
      }
    ],
    name: "setVoteLockDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_executor",
        type: "address"
      },
      {
        internalType: "string",
        name: "_hash",
        type: "string"
      }
    ],
    name: "propose",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "tallyVotes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "voteFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256"
      }
    ],
    name: "voteAgainst",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
