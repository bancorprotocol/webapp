import { DryRelay } from "@/api/eos/eosBancorCalc";
import { compareString } from "@/api/helpers";
import { staticToConverterAndAnchor } from "@/api/pureHelpers";
import { ConverterAndAnchor } from "@/types/bancor";
import { Sym } from "eos-common";
import { StaticRelay } from "./ethBancor";

const bntToken = {
  contract: "bntbntbntbnt",
  symbol: "10,BNT"
};

export const v2Pools = [
  "0xa88Fd7560efc654d86cF3728785f94a8Bc48BDAe",
  "0xC42a9e06cEBF12AE96b11f8BAE9aCC3d6b016237"
];

const oldRelays = [
  {
    contract: "bnt2eoscnvrt",
    smartToken: {
      contract: "bnt2eosrelay",
      symbol: "10,BNTEOS"
    },
    reserves: [
      {
        contract: "eosio.token",
        symbol: "4,EOS"
      },
      bntToken
    ]
  },
  {
    contract: "bancorc11111",
    smartToken: {
      contract: "bancorr11111",
      symbol: "10,BNTBLK"
    },
    reserves: [
      bntToken,
      {
        contract: "eosblackteam",
        symbol: "4,BLACK"
      }
    ]
  },
  {
    contract: "bancorc11121",
    smartToken: {
      contract: "bancorr11121",
      symbol: "10,BNTHRUS"
    },
    reserves: [
      bntToken,
      {
        contract: "horustokenio",
        symbol: "4,HORUS"
      }
    ]
  },
  {
    contract: "bancorc11122",
    smartToken: {
      contract: "bancorr11122",
      symbol: "10,BNTMEET"
    },
    reserves: [
      bntToken,
      {
        contract: "eosiomeetone",
        symbol: "4,MEETONE"
      }
    ]
  },
  {
    contract: "bancorc11123",
    smartToken: {
      contract: "bancorr11123",
      symbol: "10,BNTIQ"
    },
    reserves: [
      {
        contract: "everipediaiq",
        symbol: "3,IQ"
      },
      bntToken
    ]
  },
  {
    contract: "bancorc11124",
    smartToken: {
      contract: "bancorr11124",
      symbol: "10,BNTEPRA"
    },
    reserves: [
      bntToken,
      {
        contract: "epraofficial",
        symbol: "4,EPRA"
      }
    ]
  },
  {
    contract: "bancorc11125",
    smartToken: {
      contract: "bancorr11125",
      symbol: "10,BNTDICE"
    },
    reserves: [
      bntToken,
      {
        contract: "betdicetoken",
        symbol: "4,DICE"
      }
    ]
  },
  {
    contract: "bancorc11131",
    smartToken: {
      contract: "bancorr11131",
      symbol: "10,BNTHVT"
    },
    reserves: [
      bntToken,
      {
        contract: "hirevibeshvt",
        symbol: "4,HVT"
      }
    ]
  },
  {
    contract: "bancorc11132",
    smartToken: {
      contract: "bancorr11132",
      symbol: "10,BNTOCT"
    },
    reserves: [
      {
        contract: "octtothemoon",
        symbol: "4,OCT"
      },
      bntToken
    ]
  },
  {
    contract: "bancorc11134",
    smartToken: {
      contract: "bancorr11134",
      symbol: "10,BNTMEV"
    },
    reserves: [
      bntToken,
      {
        contract: "eosvegascoin",
        symbol: "4,MEV"
      }
    ]
  },
  {
    contract: "bancorc11145",
    smartToken: {
      contract: "bancorr11145",
      symbol: "10,BNTTAEL"
    },
    reserves: [
      bntToken,
      {
        contract: "realgoldtael",
        symbol: "6,TAEL"
      }
    ]
  },
  {
    contract: "bancorc11152",
    smartToken: {
      contract: "bancorr11152",
      symbol: "10,BNTEQA"
    },
    reserves: [
      bntToken,
      {
        contract: "equacasheos1",
        symbol: "8,EQUA"
      }
    ]
  },
  {
    contract: "bancorc11153",
    smartToken: {
      contract: "bancorr11153",
      symbol: "10,BNTPEOS"
    },
    reserves: [
      bntToken,
      {
        contract: "thepeostoken",
        symbol: "4,PEOS"
      }
    ]
  },
  {
    contract: "bancorc11154",
    smartToken: {
      contract: "bancorr11154",
      symbol: "10,BNTDAPP"
    },
    reserves: [
      bntToken,
      {
        contract: "dappservices",
        symbol: "4,DAPP"
      }
    ]
  },
  {
    contract: "bancorc11155",
    smartToken: {
      contract: "bancorr11155",
      symbol: "10,BNTCHEX"
    },
    reserves: [
      bntToken,
      {
        contract: "chexchexchex",
        symbol: "8,CHEX"
      }
    ]
  },
  {
    contract: "bancorc11211",
    smartToken: {
      contract: "bancorr11211",
      symbol: "10,BNTFINX"
    },
    reserves: [
      bntToken,
      {
        contract: "finxtokenvci",
        symbol: "8,FINX"
      }
    ]
  },
  {
    contract: "bancorc11213",
    smartToken: {
      contract: "bancorr11213",
      symbol: "10,BNTEMT"
    },
    reserves: [
      {
        contract: "emanateoneos",
        symbol: "4,EMT"
      },
      bntToken
    ]
  },
  {
    contract: "bancorc11214",
    smartToken: {
      contract: "bancorr11214",
      symbol: "10,BNTPIXE"
    },
    reserves: [
      bntToken,
      {
        contract: "pixeos1token",
        symbol: "4,PIXEOS"
      }
    ]
  },
  {
    contract: "bancorc11215",
    smartToken: {
      contract: "bancorr11215",
      symbol: "10,BNTNUT"
    },
    reserves: [
      bntToken,
      {
        contract: "eosdtnutoken",
        symbol: "9,NUT"
      }
    ]
  },
  {
    contract: "bancorc11222",
    smartToken: {
      contract: "bancorr11222",
      symbol: "10,BNTESDT"
    },
    reserves: [
      bntToken,
      {
        contract: "eosdtsttoken",
        symbol: "9,EOSDT"
      }
    ]
  },
  {
    contract: "bancorc11225",
    smartToken: {
      contract: "bancorr11225",
      symbol: "10,BNTLUME"
    },
    reserves: [
      bntToken,
      {
        contract: "lumetokenctr",
        symbol: "3,LUME"
      }
    ]
  },
  {
    contract: "bancorc11231",
    smartToken: {
      contract: "bancorr11231",
      symbol: "10,BNTSENS"
    },
    reserves: [
      bntToken,
      {
        contract: "sensegenesis",
        symbol: "4,SENSE"
      }
    ]
  },
  {
    contract: "bancorc11232",
    smartToken: {
      contract: "bancorr11232",
      symbol: "10,BNTUSDT"
    },
    reserves: [
      bntToken,
      {
        contract: "tethertether",
        symbol: "4,USDT"
      }
    ]
  }
];

export const getHardCodedRelays = (): DryRelay[] =>
  oldRelays.map(relay => ({
    ...relay,
    isMultiContract: false,
    smartToken: {
      contract: relay.smartToken.contract,
      symbol: new Sym(relay.smartToken.symbol)
    },
    reserves: relay.reserves.map(reserve => ({
      ...reserve,
      symbol: new Sym(reserve.symbol)
    }))
  }));

export const priorityEthPools = [
  "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
  "0xf3aD2cBc4276eb4B0fb627Af0059CfcE094E20a1",
  "0x131da075a2832549128e93AcC2b54174045232Cf",
  "0xE5Df055773Bf9710053923599504831c7DBdD697",
  "0x248AFFf1aa83cF860198ddeE14b5b3E8eDb46d47",
  "0x38838B895cbf02048455Fb7f649D97C564fC18a8",
  "0xf7b9fa01098f22527Db205Ff9BB6FdF7C7D9F1C5",
  "0xd7eB9DB184DA9f099B84e2F86b1da1Fe6b305B3d",
  "0x4827e558e642861Cd7a1C8f011b2B4661F8d51fa",
  "0xE6b31fB3f29fbde1b92794B0867A315Ff605A324",
  "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
  "0xd1BB51fECC950c7b1e4197D8d13A1d2A60795D2C",
  "0x0c485BffD5df019F66927B2C32360159884D4409",
  "0xB9fe4BD869a132137B668054ea48C897c0654ee4",
  "0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340",
  "0xFC0e04Eae452c163883AAAd4Ac1AE091Cc87FEf3",
  "0x79d83B390cF0EDF86B9EFbE47B556Cc6e20926aC",
  "0x168D7Bbf38E17941173a352f1352DF91a7771dF3",
  "0x497Ec0D6Ba2080f0ed7ecf7a79a2A907401b3239",
  "0x0F2318565f1996CB1eD2F88e172135791BC1FcBf",
  "0x2948BD241243Bb6924A0b2f368233DDa525AAB05",
  "0xccB5E3Ba5356D57001976092795626ac3b87Ad4e",
  "0xc4938292EA2d3085fFFc11C46B87CA068a83BE01",
  "0x014186b1a2d675fc1e303A3d62B574C3270A38e0",
  "0xbAb15d72731Ea7031B10324806E7AaD8448896D5",
  "0x11223Ed5D5846603C4EfC7c451FD8EB596d592cF",
  "0x4319f9130848544afB97e92cb3Ea9fdb4b0A0B2a",
  "0xdD8a17169aa94E548602096EB9C9d44216cE8a37",
  "0xb3b2861a093B7FB19352bD62CD8EFC314e0641a7",
  "0xaB5ae72d95d3A02796c87F8079b1E180507dF54f",
  "0x60Be88DD72f03C91FB22EEF7Af24C2e99Db58530",
  "0xa3b3c5a8b22C044D5f2d372f628245E2106D310D",
  "0xE9ADced9da076D9dADA35F5b99970fDd58B1440D",
  "0x8DA321aB610cD24fB2bcCe191F423Dae7c327ca9",
  "0x564c07255AFe5050D82c8816F78dA13f2B17ac6D",
  "0x4B51AcC819591c885DbA0F06d98A07b432E6D6B4",
  "0x5039f60594Ffa3f1a5ACbe85E1eBe12Dc8Da7c5c",
  "0x2d5aDD875442023eC83718Bb03D866c9F4C6E8cE",
  "0xd6A6c879Ad8c01D0C8d5bF1C85829814b954DBBF",
  "0xEEF7551e59b34F431D71C7593249F61D5c52ce65"
];

export const knownV2Anchors = [
  "0xa88Fd7560efc654d86cF3728785f94a8Bc48BDAe",
  "0xC42a9e06cEBF12AE96b11f8BAE9aCC3d6b016237"
];

export interface PreviousPoolFee {
  oldDecFee: number;
  blockNumber: number;
  id: string;
}

export const compareStaticRelay = (a: StaticRelay, b: StaticRelay) =>
  compareString(a.converterAddress, b.converterAddress) &&
  compareString(a.poolToken.contract, b.poolToken.contract);

export const moreStaticRelays: StaticRelay[] = [
  {
    converterAddress: "0x60c8FD9B56f602246081Ce7CD74aC1b6F46d4C14",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xA15C7Ebe1f07CaF6bFF097D8a589fb8AC49Ae5B3",
        decimals: "18",
        symbol: "NPXS"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "NPXSBNT",
      decimals: "18",
      contract: "0x5a4deB5704C1891dF3575d3EecF9471DA7F61Fa4"
    },
    version: 44
  },
  {
    converterAddress: "0xd3D6a957b09587F07eBd6449210fe2038076Ee83",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xdB25f211AB05b1c97D595516F45794528a807ad8",
        decimals: "2",
        symbol: "EURS"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "EURSBNT",
      decimals: "18",
      contract: "0xFC0e04Eae452c163883AAAd4Ac1AE091Cc87FEf3"
    },
    version: 44
  },
  {
    converterAddress: "0xD4f0154af767495C7913B59350902EFE58b8410D",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44",
        decimals: "18",
        symbol: "KP3R"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "KP3R",
      decimals: "18",
      contract: "0x9a88524DBc8C0F1CB67c6F6a695098d5BFCA4476"
    },
    version: 44
  },
  {
    converterAddress: "0x934b49574d8daC9753054F8FE57feFBD5D9c968b",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        decimals: "8",
        symbol: "WBTC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "WBTC",
      decimals: "18",
      contract: "0xFEE7EeaA0c2f3F7C7e6301751a8dE55cE4D059Ec"
    },
    version: 44
  },
  {
    converterAddress: "0xdF6753B614196aa8b5476fc37BDF1FDd840Ef87b",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0d438F3b5175Bebc262bF23753C1E53d03432bDE",
        decimals: "18",
        symbol: "wNXM"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "wNXMBNT",
      decimals: "18",
      contract: "0x75aB5e15129BBBEcB5C5Fdb71d1ff7D5dA97d56c"
    },
    version: 44
  },
  {
    converterAddress: "0xe22B3FF36024F4AcfE6aC1a2480EE139433eF4c1",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5",
        decimals: "18",
        symbol: "TRB"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "TRBBNT",
      decimals: "18",
      contract: "0x58239b5529198E0ad76975Bab0842367A4Cc7D5b"
    },
    version: 44
  },
  {
    converterAddress: "0x225A6313E0d13d0f8C87A661ddC6923B53D0509a",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: "6",
        symbol: "USDT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDTBNT",
      decimals: "18",
      contract: "0x5365B5BC56493F08A38E5Eb08E36cBbe6fcC8306"
    },
    version: 44
  },
  {
    converterAddress: "0x56312147A6297BeAb6DE7Ed316886A124b699197",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xba100000625a3754423978a60c9317c58a424e3D",
        decimals: "18",
        symbol: "BAL"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BALBNT",
      decimals: "18",
      contract: "0x3E22d87977dA52Accef2Af9Eb50f76bd31b7b6B1"
    },
    version: 44
  },
  {
    converterAddress: "0x088c23d3C655204C9935ea0911e2Ac2807BB1710",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
        decimals: "18",
        symbol: "BUSD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BUSDBNT",
      decimals: "18",
      contract: "0x7b86306D72103Ccd5405DF9dBFf4B794C46EBbC9"
    },
    version: 44
  },
  {
    converterAddress: "0x56c118A37D06E32a4C9DAd23b4F26F01D6A3e19f",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d",
        decimals: "4",
        symbol: "CEL"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CELBNT",
      decimals: "18",
      contract: "0xA31BF9E52B92ABF37D1d126ad2D9a6d0Ce9637f0"
    },
    version: 44
  },
  {
    converterAddress: "0x29b2470E39952B76A4852F8cA83B719658b73E10",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x4eCB692B0fEDeCD7B486b4c99044392784877E8C",
        decimals: "4",
        symbol: "CHERRY"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CHERRYBNT",
      decimals: "18",
      contract: "0xED8562cf805936AFdd2A405e7ACe80f78efc4Ed5"
    },
    version: 44
  },
  {
    converterAddress: "0xd3D6C4154A9A7a288aBEef956a34b52685a69E86",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
        decimals: "18",
        symbol: "COMP"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "COMPBNT",
      decimals: "18",
      contract: "0xB4c5BC0d1d41F3440c580A0F52B6641E4A913Df4"
    },
    version: 44
  },
  {
    converterAddress: "0x286198D27244011E6095E2c55342c0914192B62c",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b",
        decimals: "8",
        symbol: "CRO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CROBNT",
      decimals: "18",
      contract: "0x8e7970eca4be7F186A5D7acdc8dcF778EA26Ee9b"
    },
    version: 44
  },
  {
    converterAddress: "0xadFB1D3F50aC92aB67dF58040DfBDe6B2F411ABa",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xD533a949740bb3306d119CC777fa900bA034cd52",
        decimals: "18",
        symbol: "CRV"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CRVBNT",
      decimals: "18",
      contract: "0xe783E81cf1b5bf475aDB76e41a2AB996c6e2ae50"
    },
    version: 44
  },
  {
    converterAddress: "0x610548295d1A53A48A00B5232d1b7F1Aa748ac8A",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xa1d65E8fB6e87b60FECCBc582F7f97804B725521",
        decimals: "18",
        symbol: "DXD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "DXDBNT",
      decimals: "18",
      contract: "0xB3aF30c0c1a9673E14c9B0C56eCd4cBBeB0F6c48"
    },
    version: 44
  },
  {
    converterAddress: "0x34a9661072c2db1c9E7256A45320626981F72aD5",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x178c820f862B14f316509ec36b13123DA19A6054",
        decimals: "18",
        symbol: "EWTB"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "EWTBBNT",
      decimals: "18",
      contract: "0x66948fEFCcc464c714574a884c0458981Cbd944C"
    },
    version: 44
  },
  {
    converterAddress: "0x6C870E8E5979d277B163CaD8F8bFee215f99dB24",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
        decimals: "18",
        symbol: "ZRX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ZRXBNT",
      decimals: "18",
      contract: "0xa09B58ECeFA3a5d3736Ba9E2E002ca566Adf08eb"
    },
    version: 44
  },
  {
    converterAddress: "0x038cd9e60dADe4FE7E4eC8905EE71BaB9Bd78778",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
        decimals: "2",
        symbol: "GUSD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "GUSDBNT",
      decimals: "18",
      contract: "0x5A576922849dF442f1Dc0c3bA7b3c345EdB2bd44"
    },
    version: 44
  },
  {
    converterAddress: "0x0A92DF821509DB21BccbA4d53867E573DB7fb1B8",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x4a220E6096B25EADb88358cb44068A3248254675",
        decimals: "18",
        symbol: "QNT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "QNTBNT",
      decimals: "18",
      contract: "0xD6bF84B5D6F4d1288C39f2486688e949B1423E62"
    },
    version: 44
  },
  {
    converterAddress: "0x2C1f93e8d6fD6c0dE9537ca5523945c034F747cD",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
        decimals: "18",
        symbol: "LRC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "LRCBNT",
      decimals: "18",
      contract: "0xF5A203E16ab9B850b27f1F00C37352b6b7A28339"
    },
    version: 44
  },
  {
    converterAddress: "0x587D316479c669eBaFdc19FE61bD815Bee5A9115",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
        decimals: "18",
        symbol: "MLN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MLNBNT",
      decimals: "18",
      contract: "0xff2CCF332A2d6CD645f93c19690104B99943b13D"
    },
    version: 44
  },
  {
    converterAddress: "0x9B3b449257DDF33C96f4C4072FF707F06112f190",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2",
        decimals: "18",
        symbol: "MTA"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MTABNT",
      decimals: "18",
      contract: "0x3035529E7aE11A3660134c9C875F4faa6514d042"
    },
    version: 44
  },
  {
    converterAddress: "0x1d9d70233427EcB3167a302D67Ba0Ae3435Cc87a",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x967da4048cD07aB37855c090aAF366e4ce1b9F48",
        decimals: "18",
        symbol: "OCEAN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "OCEANBNT",
      decimals: "18",
      contract: "0xCDfF066eDf8a770E9b6A7aE12F7CFD3DbA0011B5"
    },
    version: 44
  },
  {
    converterAddress: "0xEDC0612754bE676ac568fD2215175a2b5E5462D9",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF",
        decimals: "18",
        symbol: "RARI"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "RARIBNT",
      decimals: "18",
      contract: "0xb5faf55A4bD812a918c68F629A00d8F9750a2C4d"
    },
    version: 44
  },
  {
    converterAddress: "0xc035d88e6ee710027801422c300c4990Da29dB36",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x8762db106B2c2A0bccB3A80d1Ed41273552616E8",
        decimals: "18",
        symbol: "RSR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "RSRBNT",
      decimals: "18",
      contract: "0x7d402c5CF587D4dEC6761C51E0aA903956495851"
    },
    version: 44
  },
  {
    converterAddress: "0xD2797888d86421B2847579bc219AdcBa90cBba3c",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6",
        decimals: "18",
        symbol: "sBTC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "sBTCBNT",
      decimals: "18",
      contract: "0x63bc130401dc9f7F70203B01D1875d0D2779dc96"
    },
    version: 44
  },
  {
    converterAddress: "0x83a06A518Acc8cc841B0D7833f9c2f85Fc2D2D2a",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
        decimals: "18",
        symbol: "SNX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SNXBNT",
      decimals: "18",
      contract: "0xAdAA88CA9913f2d6F8Caa0616Ff01eE8D4223fde"
    },
    version: 44
  },
  {
    converterAddress: "0xab56B87B9288a9a236EF38e762Eb324Dbe5E49f8",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0Ae055097C6d159879521C384F1D2123D1f195e6",
        decimals: "18",
        symbol: "STAKE"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "STAKEBNT",
      decimals: "18",
      contract: "0x5062743A788D271FA247C3dA7Cd5af73Fd687BA8"
    },
    version: 44
  },
  {
    converterAddress: "0xEb73deA31126eC00201858B26d35f5E40902fc5c",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
        decimals: "18",
        symbol: "SUSHI"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SUSHIBNT",
      decimals: "18",
      contract: "0xB2145C7f9249d79197fe3cB87333187eB4FC1Eec"
    },
    version: 44
  },
  {
    converterAddress: "0x5A38C32e62E9688d402f2f73b86188bB765CB19B",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9",
        decimals: "18",
        symbol: "SXP"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SXPBNT",
      decimals: "18",
      contract: "0xa301Ad444e72F11590e3712bBb7aD0aC959b90C2"
    },
    version: 44
  },
  {
    converterAddress: "0xDC9DF032dEFCC9F072526594537a8C8596980bf4",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
        decimals: "18",
        symbol: "UMA"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "UMABNT",
      decimals: "18",
      contract: "0x9Ca631b980DeC1eEba001BBfaC8da5A9e7d744fF"
    },
    version: 44
  },
  {
    converterAddress: "0xDcebe37807A82A3b6443Ef2fFC112a6676FABbF7",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa",
        decimals: "18",
        symbol: "TOMOE"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "TOMOEBNT",
      decimals: "18",
      contract: "0x0dc75ECCcF5B784b793686e614C2E9dCdda63738"
    },
    version: 44
  },
  {
    converterAddress: "0xc1956f06ffA45A47423aCF4A3422Dc2203645Ba4",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        decimals: "18",
        symbol: "UNI"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "UNIBNT",
      decimals: "18",
      contract: "0x8b3082e273E4B923830c637a203c1C1D963cA307"
    },
    version: 44
  },
  {
    converterAddress: "0x9C4Ea0BF80C4768314c4F631AC84E274B32385FE",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
        decimals: "18",
        symbol: "YFI"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "YFIBNT",
      decimals: "18",
      contract: "0xAeB3a1AeD77b5D6e3feBA0055d79176532e5cEb8"
    },
    version: 44
  },
  {
    converterAddress: "0x8cDF3D2355c2E725952b8A46f047a61496a12185",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xc944E90C64B2c07662A292be6244BDf05Cda44a7",
        decimals: "18",
        symbol: "GRT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BNTGRT",
      decimals: "18",
      contract: "0x7F6D555de5baa78946fF2985fdE2dd0535F0f9cB"
    },
    version: 44
  },
  {
    converterAddress: "0x44360fB15A2f17715E5052cF5994b23978081d9e",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: "6",
        symbol: "USDC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDCBNT",
      decimals: "18",
      contract: "0x874d8dE5b26c9D9f6aA8d7bab283F9A9c6f777f4"
    },
    version: 44
  },
  {
    converterAddress: "0x5bEdB6E03fA9aA4A5a35152dab8336bC57376b90",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
        decimals: "18",
        symbol: "AAVE"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "AAVEBNT",
      decimals: "18",
      contract: "0x6c84F4ccC916ACf792538f1293b286b540906A2a"
    },
    version: 44
  },
  {
    converterAddress: "0x99bb376E227ac410e0386915d738f8088E43F0E2",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xb0DBa4BD6b6C4fC9A1263D8C19A57A6BdD740A52",
        decimals: "18",
        symbol: "EILN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BNTEILN",
      decimals: "18",
      contract: "0x570d60550580D07B3D9C88afFd7eC2AacDb14EA2"
    },
    version: 44
  },
  {
    converterAddress: "0xa54a53c9215096Ac2C566Fa9a2C71b6dcE69f3d5",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
        decimals: "18",
        symbol: "ENJ"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ENJBNT",
      decimals: "18",
      contract: "0xf3aD2cBc4276eb4B0fb627Af0059CfcE094E20a1"
    },
    version: 44
  },
  {
    converterAddress: "0xb0b4e2936852e2621b51507263FC14b94386FAC8",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
        decimals: "18",
        symbol: "OMG"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "OMGBNT",
      decimals: "18",
      contract: "0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340"
    },
    version: 44
  },
  {
    converterAddress: "0xb72C2Fd2A73aceB1b61CCbb8d4Ff993ba4b34F55",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
        decimals: "18",
        symbol: "BAT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BATBNT",
      decimals: "18",
      contract: "0x131da075a2832549128e93AcC2b54174045232Cf"
    },
    version: 44
  },
  {
    converterAddress: "0xf31E0a6675698e4fD2CCE6Fd42EF827b1F4b6696",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        decimals: "18",
        symbol: "BNB"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BNBBNT",
      decimals: "18",
      contract: "0xE6b31fB3f29fbde1b92794B0867A315Ff605A324"
    },
    version: 44
  },
  {
    converterAddress: "0x1F69A42399fD55e27d20B9Dad0079463277Bc783",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x419c4dB4B9e25d6Db2AD9691ccb832C8D9fDA05E",
        decimals: "18",
        symbol: "DRGN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "DRGNBNT",
      decimals: "18",
      contract: "0xa7774F9386E1653645E1A08fb7Aae525B4DeDb24"
    },
    version: 44
  },
  {
    converterAddress: "0x0063B112Cbc6803FBD143078512b643b0EC81801",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x1234567461d3f8Db7496581774Bd869C83D51c93",
        decimals: "18",
        symbol: "CAT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CATBNT",
      decimals: "18",
      contract: "0xB3c55930368D71F643C3775869aFC73f6c5237b2"
    },
    version: 44
  },
  {
    converterAddress: "0xbF860D22e60219B8f71BCf0c185092134ABFDf78",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x08711D3B02C8758F2FB3ab4e80228418a7F8e39c",
        decimals: "0",
        symbol: "EDG"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "EDGBNT",
      decimals: "18",
      contract: "0xf95dd0Fc6DF64b2F149aFA9219579e0f850BCD4D"
    },
    version: 44
  },
  {
    converterAddress: "0x336227540bd23aC3b46272D0D5153414b496E95C",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xbf2179859fc6D5BEE9Bf9158632Dc51678a4100e",
        decimals: "18",
        symbol: "ELF"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ELFBNT",
      decimals: "18",
      contract: "0x0F2318565f1996CB1eD2F88e172135791BC1FcBf"
    },
    version: 44
  },
  {
    converterAddress: "0xbD5d2C97C3c36aaeb69cE3B61c2c18ae1a115c1A",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xC5bBaE50781Be1669306b9e001EFF57a2957b09d",
        decimals: "5",
        symbol: "GTO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "GTOBNT",
      decimals: "18",
      contract: "0xc4938292EA2d3085fFFc11C46B87CA068a83BE01"
    },
    version: 44
  },
  {
    converterAddress: "0x6b3f2E4f335b6401b98Ef49B136Ac0ea96CF5FbE",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x8f8221aFbB33998d8584A2B05749bA73c37a938a",
        decimals: "18",
        symbol: "REQ"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "REQBNT",
      decimals: "18",
      contract: "0xccB5E3Ba5356D57001976092795626ac3b87Ad4e"
    },
    version: 44
  },
  {
    converterAddress: "0xCb516DeEfe9d2d189C6a14931F47cdb1fE2ccC45",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x607F4C5BB672230e8672085532f7e901544a7375",
        decimals: "9",
        symbol: "RLC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "RLCBNT",
      decimals: "18",
      contract: "0x9003411Ac4073C2D9f37af71d00E373B72Cbe9E2"
    },
    version: 44
  },
  {
    converterAddress: "0x7036e90c7cdFBA7eD90Fc12a7f7BC6e8AEe5292C",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B",
        decimals: "6",
        symbol: "TRST"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "TRSTBNT",
      decimals: "18",
      contract: "0x064432E84F05094E3eD746A35ab9B7aB865fDa5C"
    },
    version: 44
  },
  {
    converterAddress: "0xea6Ffb102D8044714153c6F970F3E93c89Ec2492",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x667088b212ce3d06a1b553a7221E1fD19000d9aF",
        decimals: "18",
        symbol: "WINGS"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "WINGSBNT",
      decimals: "18",
      contract: "0xA6Ab3c8aE51962f4582db841dE6b0A092041461e"
    },
    version: 44
  },
  {
    converterAddress: "0x292325dAA482fcb960c641865eb0cc36a78E6941",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xe8A1Df958bE379045E2B46a31A98B93A2eCDfDeD",
        decimals: "18",
        symbol: "ESZ"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ESZBNT",
      decimals: "18",
      contract: "0xA2020e324C365D05e87cf25552E6e6734260b089"
    },
    version: 44
  },
  {
    converterAddress: "0x18ae6C5514F3fF713C6fD5D4a76c1eCC4211E0ce",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x4AaC461C86aBfA71e9d00d9a2cde8d74E4E1aeEa",
        decimals: "18",
        symbol: "ZINC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CVTBNT",
      decimals: "18",
      contract: "0x737Ac585809C0F64Ee09d7B8050d195d14f14c55"
    },
    version: 44
  },
  {
    converterAddress: "0xC376C06477c6B05E7BFAF31A29b1727CB30473a1",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
        decimals: "18",
        symbol: "KNC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "KNCBNT",
      decimals: "18",
      contract: "0x248AFFf1aa83cF860198ddeE14b5b3E8eDb46d47"
    },
    version: 44
  },
  {
    converterAddress: "0x7Be209C15664c98c2481c1C06a5E38E350e16b62",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x5102791cA02FC3595398400BFE0e33d7B6C82267",
        decimals: "18",
        symbol: "LDC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "LDCBNT",
      decimals: "18",
      contract: "0xB79C3a1a2d50CC99459F3a21D709bCEC86656e97"
    },
    version: 44
  },
  {
    converterAddress: "0x98A244F4A4f9b4430cF0349E9D76c8e69D246715",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x814e0908b12A99FeCf5BC101bB5d0b8B5cDf7d26",
        decimals: "18",
        symbol: "MDT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MDTBNT",
      decimals: "18",
      contract: "0xbAb15d72731Ea7031B10324806E7AaD8448896D5"
    },
    version: 44
  },
  {
    converterAddress: "0xb3F73c13F8Ea7C58eC3AdaAEE6E539EbeD2459D1",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x595832F8FC6BF59c85C527fEC3740A1b7a361269",
        decimals: "6",
        symbol: "POWR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "POWRBNT",
      decimals: "18",
      contract: "0x168D7Bbf38E17941173a352f1352DF91a7771dF3"
    },
    version: 44
  },
  {
    converterAddress: "0xa5620Fd71b2F2324ee60b148AD75807a91eBe496",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6",
        decimals: "18",
        symbol: "RCN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "RCNBNT",
      decimals: "18",
      contract: "0xf7b9fa01098f22527Db205Ff9BB6FdF7C7D9F1C5"
    },
    version: 44
  },
  {
    converterAddress: "0xA30CF5eDa1126A7De9944b3443631C837aB13667",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x6810e776880C02933D47DB1b9fc05908e5386b96",
        decimals: "18",
        symbol: "GNO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "GNOBNT",
      decimals: "18",
      contract: "0xd7eB9DB184DA9f099B84e2F86b1da1Fe6b305B3d"
    },
    version: 44
  },
  {
    converterAddress: "0x07d309C210D61b808a2102DCD1EB12C677Fa797a",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5",
        decimals: "18",
        symbol: "KIN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "KINBNT",
      decimals: "18",
      contract: "0x26b5748F9253363f95e37767e9ed7986877A4B1b"
    },
    version: 44
  },
  {
    converterAddress: "0xb94dd69cCEec6f7331DBD89724A6462b950C444b",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x6Ba460AB75Cd2c56343b3517ffeBA60748654D26",
        decimals: "8",
        symbol: "UP"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "UPBNT",
      decimals: "18",
      contract: "0xd4c810fdcA379831078267f3402845E5205Aa0e1"
    },
    version: 44
  },
  {
    converterAddress: "0xFF07C3A687e0A10DC1d5034d01c3a255687F9849",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0b38210ea11411557c13457D4dA7dC6ea731B88a",
        decimals: "18",
        symbol: "API3"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "API3BNT",
      decimals: "18",
      contract: "0x70f416734C92c3ADE6Fdc9D065A1E8756d1d98E7"
    },
    version: 42
  },
  {
    converterAddress: "0xbE51cA01db71a3cA569983b7492aFA5D7e45d672",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xb056c38f6b7Dc4064367403E26424CD2c60655e1",
        decimals: "18",
        symbol: "CEEK"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CEEKBNT",
      decimals: "18",
      contract: "0x2F2ad6954d99Ea14fA145B9AB0fb6BA5Ac32c0Ee"
    },
    version: 44
  },
  {
    converterAddress: "0x4639e2b6fB2E44D920C81A6b1248f7e125C93243",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x6758B7d441a9739b98552B373703d8d3d14f9e62",
        decimals: "18",
        symbol: "POA20"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "POABNT",
      decimals: "18",
      contract: "0x564c07255AFe5050D82c8816F78dA13f2B17ac6D"
    },
    version: 44
  },
  {
    converterAddress: "0xA09e6eD8447e21f4385F990693C20E8f786Dd16F",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x744d70FDBE2Ba4CF95131626614a1763DF805B9E",
        decimals: "18",
        symbol: "SNT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SNTBNT",
      decimals: "18",
      contract: "0xa3b3c5a8b22C044D5f2d372f628245E2106D310D"
    },
    version: 44
  },
  {
    converterAddress: "0xbCd7340d8bfB161e0a125D9ea63902412d8dDe37",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xb0280743b44bF7db4B6bE482b2Ba7b75E5dA096C",
        decimals: "18",
        symbol: "TNS"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "TNSBNT",
      decimals: "18",
      contract: "0x5cf2f6387c4F551316e1E422aCf1025a539825c3"
    },
    version: 44
  },
  {
    converterAddress: "0x90C048f8ef5a135b77BCE450fc36B7CB593e519B",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xEDD7c94FD7B4971b916d15067Bc454b9E1bAD980",
        decimals: "18",
        symbol: "ZIPT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ZIPTBNT",
      decimals: "18",
      contract: "0xC4a01182ab1e502a1C1d17024e4924573CE001CC"
    },
    version: 44
  },
  {
    converterAddress: "0xEDb499944efBC9f3A12F457969b18CCB34CC5153",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xBB1fA4FdEB3459733bF67EbC6f893003fA976a82",
        decimals: "18",
        symbol: "PAT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "XPATBNT",
      decimals: "18",
      contract: "0xEe769CE6B4E2C2A079c5f67081225Af7C89F874C"
    },
    version: 44
  },
  {
    converterAddress: "0xadBc5B723bc60B912ca34b850f4a3F9f93f1E335",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xefBd6D7deF37ffae990503EcdB1291B2f7E38788",
        decimals: "18",
        symbol: "EVO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "EVOBNT",
      decimals: "18",
      contract: "0xBB8436eaf49888641Df27e4E1DfFbd4851788209"
    },
    version: 44
  },
  {
    converterAddress: "0xEC6B9c4afB07531478DBF00a03Ea7796b4599F64",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xDF2C7238198Ad8B389666574f2d8bc411A4b7428",
        decimals: "18",
        symbol: "MFT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MFTBNT",
      decimals: "18",
      contract: "0x4319f9130848544afB97e92cb3Ea9fdb4b0A0B2a"
    },
    version: 44
  },
  {
    converterAddress: "0x7D28E85FdF3243B6781a6eC9F5d94cd008AE82A7",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9",
        decimals: "18",
        symbol: "FTX Token"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "FTTBNT",
      decimals: "18",
      contract: "0x140d47AeA2f10FfF26de4150971e600A2e010A81"
    },
    version: 44
  },
  {
    converterAddress: "0xe24C8bbDBA150aa3Cb13C785d3A19D012dDC1e86",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: "18",
        symbol: "ETH"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ETHBNT",
      decimals: "18",
      contract: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533"
    },
    version: 44
  },
  {
    converterAddress: "0x9fE07515E2e9f4B1F1227753579EaAC4AE5855bC",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x27702a26126e0B3702af63Ee09aC4d1A084EF628",
        decimals: "18",
        symbol: "ALEPH"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ALEPHBNT",
      decimals: "18",
      contract: "0x3b8c8147325C378cfe10f7b8c3aB1683D300dF27"
    },
    version: 44
  },
  {
    converterAddress: "0x5ca92211Cc1527A720691A807d0626D1b89A88DF",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55",
        decimals: "18",
        symbol: "BAND"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BANDBNT",
      decimals: "18",
      contract: "0x44Fa59B2F044367f9F027b7694fD3BacbF22c3d5"
    },
    version: 44
  },
  {
    converterAddress: "0x857f7EF18C0ba56b710Bd4E1F7E7E73BBDF97A52",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x56d811088235F11C8920698a204A5010a788f4b3",
        decimals: "18",
        symbol: "BZRX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BZRXBNT",
      decimals: "18",
      contract: "0xE39c4Ae17C0d44e923B784794B3Ea419c04F02FA"
    },
    version: 44
  },
  {
    converterAddress: "0xDA1117E28F79606637b88fd976150907d7AF1AAf",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        decimals: "18",
        symbol: "LINK"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "LINKBNT",
      decimals: "18",
      contract: "0x04D0231162b4784b706908c787CE32bD075db9b7"
    },
    version: 44
  },
  {
    converterAddress: "0x7619d3991f38f29689200a59444116E48e06AC01",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
        decimals: "18",
        symbol: "MATIC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MATICBNT",
      decimals: "18",
      contract: "0x8151E0Fbbc10Af5b0F16B413dB0747169e9687d9"
    },
    version: 44
  },
  {
    converterAddress: "0x68867aaDbb5007900DA6D938f34207BD1BaFdee3",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x408e41876cCCDC0F92210600ef50372656052a38",
        decimals: "18",
        symbol: "REN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "RENBNT",
      decimals: "18",
      contract: "0x6b181C478b315bE3f9E99c57CE926436c32e17a7"
    },
    version: 44
  },
  {
    converterAddress: "0xb3F0D58dcd8Be52cA7f629832E62948C3863828d",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
        decimals: "8",
        symbol: "renBTC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "renBTCBNT",
      decimals: "18",
      contract: "0xb479b102bF135bdC666d6916172422CbaD9E977f"
    },
    version: 44
  },
  {
    converterAddress: "0xf0aBa58a0f88f62C70637c3F0e8714074be3674a",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2",
        decimals: "8",
        symbol: "renZEC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "renZECBNT",
      decimals: "18",
      contract: "0x986D522a4f9fd0b4158A88657a06A552f83C3e27"
    },
    version: 44
  },
  {
    converterAddress: "0x5d0bB7610dfC890bb68D9dd6a2703432129622BA",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x476c5E26a75bd202a9683ffD34359C0CC15be0fF",
        decimals: "6",
        symbol: "SRM"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SRMBNT",
      decimals: "18",
      contract: "0x6cfd8b295D64d84178ad7447a5Bb4488bC846005"
    },
    version: 44
  },
  {
    converterAddress: "0xa5E95362031116259773116d0b16C8eA33d1dF9c",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xA2085073878152aC3090eA13D1e41bD69e60Dc99",
        decimals: "18",
        symbol: "ELG"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ELG",
      decimals: "18",
      contract: "0xff0Fec27454A35578c6f73CfDdFaf9318E099328"
    },
    version: 42
  },
  {
    converterAddress: "0x112fA1C7759c8f3cb8ae8ef5AC2eee31Fb78947b",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x9c794f933b4DD8B49031A79b0f924D68BEF43992",
        decimals: "18",
        symbol: "XTRD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "XTRD",
      decimals: "18",
      contract: "0x295F136eB8c8D1429a77A2B5E0851AA035c8297C"
    },
    version: 42
  },
  {
    converterAddress: "0xc45aB6f39D6a87347aB4A46e2501dc5c78Aa5cd7",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x6b4389Afb3e243A65668B7311fA9Ef092A8a3B64",
        decimals: "18",
        symbol: "REAL"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "REAL",
      decimals: "18",
      contract: "0xdbcaE67ECBA9DAAC61B1167cc8108B63BF8d59A2"
    },
    version: 42
  },
  {
    converterAddress: "0x76ec8350FDB0061E15760D743b11FD183480D5A5",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x4FbB350052Bca5417566f188eB2EBCE5b19BC964",
        decimals: "18",
        symbol: "GRG"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BNTGRG",
      decimals: "18",
      contract: "0x0Dc4320ba50b7E05FC73b4531C59aCB46c5A7dD6"
    },
    version: 42
  },
  {
    converterAddress: "0x1bC0300e8943dFC2622A254652Aa40d8659DB24e",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x9CEc686ba6f07D6135B2091140c795166Ef5b761",
        decimals: "18",
        symbol: "SVCS"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SVCS",
      decimals: "18",
      contract: "0xd7a4f41626fF2a52f58de1eB5Df6F79F05E5977F"
    },
    version: 42
  },
  {
    converterAddress: "0xcb6f564824402DDc8B988811f5cfd9704d659631",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94",
        decimals: "18",
        symbol: "vBNT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "vBNT/BNT",
      decimals: "18",
      contract: "0x3D9E2dA44Af9386484d0D35C29eB62122e4F4742"
    },
    version: 42
  },
  {
    converterAddress: "0x497e6967C0CdF711A881f4294bab9d05b33dbaC9",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x36F3FD68E7325a35EB768F1AedaAe9EA0689d723",
        decimals: "18",
        symbol: "ESD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BNT-ESD",
      decimals: "18",
      contract: "0xDf078cfe8646469F544750e9A48FcdA25B45B529"
    },
    version: 42
  },
  {
    converterAddress: "0x1d42C56eD2C194081dD70a1f19a1ac5dA77d0ca4",
    reserves: [
      {
        contract: "0xB0BFB1E2F72511cF8b4D004852E2054d7b9a76e1",
        decimals: "18",
        symbol: "MIXS"
      },
      {
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: "6",
        symbol: "USDT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MIXSUSDT",
      decimals: "18",
      contract: "0xF8dBE0b7cc9478a0D5F2D06DD619Cdc4e42c0847"
    },
    version: 42
  },
  {
    converterAddress: "0x947fe1e19048f4D1213dd5107eeB77D7748Eea10",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x5c872500c00565505F3624AB435c222E558E9ff8",
        decimals: "18",
        symbol: "COT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "COTBNT",
      decimals: "18",
      contract: "0x19dB077A54dEa3fD4CBCd9d31D4dB297562CbD94"
    },
    version: 42
  },
  {
    converterAddress: "0x7f913E9DeeF8eFE8d09A2e67d18cEd9BE4Ad1dc7",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
        decimals: "9",
        symbol: "AMPL"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "AMPLBNT",
      decimals: "18",
      contract: "0x0e2145A23f7810431Ba0f2e19676530b3F1Fb0EC"
    },
    version: 14
  },
  {
    converterAddress: "0x235d4FD0D13784c848712c30f2Da03925496FBd4",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
        decimals: "18",
        symbol: "BUSD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BUSDUSDB",
      decimals: "18",
      contract: "0xE94C892f90ABea59F3dd1D7d8c34aC9d7312F18A"
    },
    version: 20
  },
  {
    converterAddress: "0x1e9653f8A3F1D5ACEC0d334e6433b9677acCe7fF",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x86A49f08Ab6531A3E0e814c75F36de661B986Ca1",
        decimals: "18",
        symbol: "SYB7"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SYB7BNT",
      decimals: "18",
      contract: "0xDC610F8eecE47E9F91209C77C8674C40d2d8E17F"
    },
    version: 23
  },
  {
    converterAddress: "0xDB3eC1d6A089F6be97B8fc00bEB43b34c7BeEB23",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x595832F8FC6BF59c85C527fEC3740A1b7a361269",
        decimals: "6",
        symbol: "POWR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "POWRUSDB",
      decimals: "6",
      contract: "0x8bb91B280A39A9e9D8505B9a5BC792CCb3B9779E"
    },
    version: 22
  },
  {
    converterAddress: "0xB018AF916Ed0116404537D1238b18988D652733a",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xf8e386EDa857484f5a12e4B5DAa9984E06E73705",
        decimals: "18",
        symbol: "IND"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "INDBNT",
      decimals: "18",
      contract: "0x32423158e8FBD2839E085626F8a98D86b2766De8"
    },
    version: 5
  },
  {
    converterAddress: "0xb85E52268CBF57b97Ae15136Aa65D4F567B8107c",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x37E8789bB9996CaC9156cD5F5Fd32599E6b91289",
        decimals: "18",
        symbol: "AID"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "AIDBNT",
      decimals: "18",
      contract: "0xe3BF775Ec5f4F4dFCbb21194B22be1217b815b1d"
    },
    version: 6
  },
  {
    converterAddress: "0xb8a6920962655c97F0E3Eab40E5706Ed934907Cc",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x1063ce524265d5a3A624f4914acd573dD89ce988",
        decimals: "18",
        symbol: "AIX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "AIXBNT",
      decimals: "18",
      contract: "0xA415cD56C694bd7402d14560D18Bb19A28F77617"
    },
    version: 1
  },
  {
    converterAddress: "0xa00655976c5c9A1eD58b3707b190867069bAbEe5",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x2dAEE1AA61D60A252DC80564499A69802853583A",
        decimals: "4",
        symbol: "ATS"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ATSBNT",
      decimals: "18",
      contract: "0x1D75ebc72f4805e9C9918B36A8969b2e3847c9FB"
    },
    version: 1
  },
  {
    converterAddress: "0x27f8fd3ac4eAa50068B8F221bFa0b496F180813e",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x98Bde3a768401260E7025FaF9947ef1b81295519",
        decimals: "18",
        symbol: "BCS"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BCSBNT",
      decimals: "18",
      contract: "0xD3aD4c39A12B48164068Fef8F86eF5836A9eF303"
    },
    version: 13
  },
  {
    converterAddress: "0xB8A38Ca13bEE727092adB375FE64F6c23DeCC738",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x1234567461d3f8Db7496581774Bd869C83D51c93",
        decimals: "18",
        symbol: "CAT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDB/CAT",
      decimals: "18",
      contract: "0xc9CEadb2d3bCeB198C1361c6a60892E95B1ABf60"
    },
    version: 42
  },
  {
    converterAddress: "0x9b10206f236669F4f40E8e9806De9ab1813d3f65",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x9AF4f26941677C706cfEcf6D3379FF01bB85D5Ab",
        decimals: "8",
        symbol: "DRT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "DRTBNT",
      decimals: "18",
      contract: "0x904c7051D12aCE7d0107ada8702C0C759cad1672"
    },
    version: 6
  },
  {
    converterAddress: "0x16706f5561B88F4c80Ce9B35b2C02dFb0E22DD87",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
        decimals: "18",
        symbol: "MANA"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MANABNT",
      decimals: "18",
      contract: "0x79d83B390cF0EDF86B9EFbE47B556Cc6e20926aC"
    },
    version: 42
  },
  {
    converterAddress: "0x0160AE697A3538668CDb4698d3B89C7F36AD990d",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x83cee9e086A77e492eE0bB93C2B0437aD6fdECCc",
        decimals: "18",
        symbol: "MNTP"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MNTPBNT",
      decimals: "18",
      contract: "0x8DA321aB610cD24fB2bcCe191F423Dae7c327ca9"
    },
    version: 1
  },
  {
    converterAddress: "0x247AC58CD31541c65B3AAa47E047745107D13873",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x68d57c9a1C35f63E2c83eE8e49A64e9d70528D25",
        decimals: "18",
        symbol: "SRN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SRNBNT",
      decimals: "18",
      contract: "0xd2Deb679ed81238CaeF8E0c32257092cEcc8888b"
    },
    version: 20
  },
  {
    converterAddress: "0xdD7DE51c4F6FAF10Afce495f1Ef02E5Baa91379c",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xD0a4b8946Cb52f0661273bfbC6fD0E0C75Fc6433",
        decimals: "18",
        symbol: "STORM"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "STORMBNT",
      decimals: "18",
      contract: "0xCad4da66E00FDeCaBeC137a24E12Af8eDF303a1d"
    },
    version: 0
  },
  {
    converterAddress: "0xb7289a9Bbfb5C28598C0b825214b2e1dc51c72Ee",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xE7775A6e9Bcf904eb39DA2b68c5efb4F9360e08C",
        decimals: "6",
        symbol: "TAAS"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "TAASBNT",
      decimals: "18",
      contract: "0xAE201360282C885bf3F2616A3145D1344a1e43c0"
    },
    version: 23
  },
  {
    converterAddress: "0xe18b18B6F5c07feF86cF0f1C9d0de7fD94869c24",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x3A92bD396aEf82af98EbC0Aa9030D25a23B11C6b",
        decimals: "18",
        symbol: "TBX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "TBXBNT",
      decimals: "18",
      contract: "0xE844E4EF529CB1A507D47206bEeF65a921B07287"
    },
    version: 30
  },
  {
    converterAddress: "0xC04B5a4556d00Bca8eac5F5accA31981a6597409",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a",
        decimals: "8",
        symbol: "TKN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "TKNBNT",
      decimals: "18",
      contract: "0x497Ec0D6Ba2080f0ed7ecf7a79a2A907401b3239"
    },
    version: 32
  },
  {
    converterAddress: "0x3B42239a8bc2f07bb16b17578fE44fF2422C16F6",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x340D2bdE5Eb28c1eed91B2f790723E3B160613B7",
        decimals: "18",
        symbol: "VEE"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "VEEBNT",
      decimals: "18",
      contract: "0xc9c3A465380bFaaC486C89ff7d5F60CC275D4E08"
    },
    version: 9
  },
  {
    converterAddress: "0x4F88DFc8e1D7bA696Db158656457797cfBDfB844",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x27f610BF36ecA0939093343ac28b1534a721DBB4",
        decimals: "18",
        symbol: "WAND"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "WANDBNT",
      decimals: "18",
      contract: "0x6a46f6DC570A1304a23f771c26b1802DFfcDAB0D"
    },
    version: 9
  },
  {
    converterAddress: "0xc11CcE040583640001f5a7E945DFd82f662cC0aE",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xF6B55acBBC49f4524Aa48D19281A9A77c54DE10f",
        decimals: "18",
        symbol: "WLK"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "WLKBNT",
      decimals: "18",
      contract: "0xd387CDAF85429b455f0F716D51Be33db2FC00463"
    },
    version: 6
  },
  {
    converterAddress: "0x5A9f1cD844cE91AAADAA03059677EeBCf3CF00df",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x9a794Dc1939F1d78fa48613b89B8f9d0A20dA00E",
        decimals: "18",
        symbol: "ABX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ABXBNT",
      decimals: "18",
      contract: "0x275a1a2Dad3075bEb96AF4f7fD93ade99bB0151f"
    },
    version: 1
  },
  {
    converterAddress: "0xdd9B82c59aa260B2A834Ec67C472f43b40a2E6f1",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466",
        decimals: "8",
        symbol: "AION"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "AIONBNT",
      decimals: "18",
      contract: "0x73fa2B855be96AB3C73f375B8Ec777226eFA3845"
    },
    version: 7
  },
  {
    converterAddress: "0x5caa37CBa585C216D39e3a02D8C0DFd4843cA5f9",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x737F98AC8cA59f2C68aD658E3C3d8C8963E40a4c",
        decimals: "18",
        symbol: "AMN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "AMNBNT",
      decimals: "18",
      contract: "0x0f9Be347378a37CED33A13AE061175AF07CC9868"
    },
    version: 23
  },
  {
    converterAddress: "0x7E4b0AbAd3407b87a381c1C05aF78d7ad42975E7",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xc72fe8e3Dd5BeF0F9f31f259399F301272eF2a2D",
        decimals: "18",
        symbol: "INSTAR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "INSTAR",
      decimals: "18",
      contract: "0xC803B2B2c3BA24C0C934AEB3Ba508A4dD6853F1b"
    },
    version: 7
  },
  {
    converterAddress: "0xf42305EA9d1527211EdA8Fb333FBf2668BFfd9E1",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4",
        decimals: "8",
        symbol: "J8T"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "J8TBNT",
      decimals: "18",
      contract: "0x8E00BacD7d8265d8F3f9d5B4fbd7F6B0B0c46f36"
    },
    version: 20
  },
  {
    converterAddress: "0xFbbAf86D76ef7C86f1Aea216242EF8e203A8Be7E",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x6710c63432A2De02954fc0f851db07146a6c0312",
        decimals: "18",
        symbol: "MFG"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MFGBNT",
      decimals: "18",
      contract: "0xb3b2861a093B7FB19352bD62CD8EFC314e0641a7"
    },
    version: 25
  },
  {
    converterAddress: "0x4D6DE557092f9742606e226860d6718281C9D241",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xd341d1680Eeee3255b8C4c75bCCE7EB57f144dAe",
        decimals: "18",
        symbol: "ONG"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ONGBNT",
      decimals: "18",
      contract: "0x8104E7ce81FaB39c42e34Cd9d8B654135261Fae8"
    },
    version: 31
  },
  {
    converterAddress: "0xc964DE24878B04AFDF6A7df5E7956deCC665D4bE",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xe3818504c1B32bF1557b16C238B2E01Fd3149C17",
        decimals: "18",
        symbol: "PLR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "PLRBNT",
      decimals: "18",
      contract: "0x2843F6c3b14e698e3D7562584959C61274F93328"
    },
    version: 30
  },
  {
    converterAddress: "0x635C9C9940D512bF5CB455706a28F9C7174d307f",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x3d1BA9be9f66B8ee101911bC36D3fB562eaC2244",
        decimals: "18",
        symbol: "RVT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "RVTBNT",
      decimals: "18",
      contract: "0x5039f60594Ffa3f1a5ACbe85E1eBe12Dc8Da7c5c"
    },
    version: 9
  },
  {
    converterAddress: "0x73f73391e5F56Ce371A61fC3e18200A73d44Cf6f",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x9a005c9a89BD72a4Bd27721E7a09A3c11D2b03C4",
        decimals: "18",
        symbol: "STAC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "STACBNT",
      decimals: "18",
      contract: "0x258D1210e9E242FDc0Ecfa3b039A51a945CD0D0a"
    },
    version: 9
  },
  {
    converterAddress: "0x6d1CEB4Fd5595c9773EB7FC79B0c090a380514DA",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x9a0242b7a33DAcbe40eDb927834F96eB39f8fBCB",
        decimals: "18",
        symbol: "BAX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BAXBNT",
      decimals: "18",
      contract: "0xA9DE5935aE3eae8a7F943C9329940EDA160267f4"
    },
    version: 13
  },
  {
    converterAddress: "0x8bB76C5AE6b7D6bd1678510edD06444AcDf8F72B",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x763186eB8d4856D536eD4478302971214FEbc6A9",
        decimals: "18",
        symbol: "BETR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BETRBNT",
      decimals: "18",
      contract: "0x679F601F0deb53c2dB0C8C26369FDcba5fD753CF"
    },
    version: 7
  },
  {
    converterAddress: "0xbE1DAF05Bf9e054b3e28b7E9C318819eF5dAcb58",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x2C974B2d0BA1716E644c1FC59982a89DDD2fF724",
        decimals: "18",
        symbol: "VIB"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "VIBBNT",
      decimals: "18",
      contract: "0x2948BD241243Bb6924A0b2f368233DDa525AAB05"
    },
    version: 32
  },
  {
    converterAddress: "0xf66EFba4dCDAB29d864b3134970C28bFcF653f3f",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x41AB1b6fcbB2fA9DCEd81aCbdeC13Ea6315F2Bf2",
        decimals: "18",
        symbol: "XDCE"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "XDCEBNT",
      decimals: "18",
      contract: "0xd1BB51fECC950c7b1e4197D8d13A1d2A60795D2C"
    },
    version: 30
  },
  {
    converterAddress: "0x3B0116363e435D9E4EF24ecA6282a21b7CC662df",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xc12d099be31567add4e4e4d0D45691C3F58f5663",
        decimals: "18",
        symbol: "AUC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "AUCBNT",
      decimals: "18",
      contract: "0x164A1229F4826C9dd70Ee3D9f4f3d7B68a172153"
    },
    version: 9
  },
  {
    converterAddress: "0x3167cc146d228C6977dCbadA380dF926b39865b1",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x780116D91E5592E58a3b3c76A351571b39abCEc6",
        decimals: "15",
        symbol: "BOXX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BOXXBNT",
      decimals: "18",
      contract: "0x849D49911cEF804bdB1FEC58150B8EabAB119796"
    },
    version: 9
  },
  {
    converterAddress: "0x64846ff24B1AF06075efc44d7Fe9f1d5969f3275",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x4162178B78D6985480A308B2190EE5517460406D",
        decimals: "18",
        symbol: "CLN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CLNBNT",
      decimals: "18",
      contract: "0xEB027349398De19D925DefC15c4302fE92FC69f9"
    },
    version: 41
  },
  {
    converterAddress: "0x20d23C7A4b2Ea38f9Dc885bd25b1BC8c2601D44d",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x9B70740e708a083C6fF38Df52297020f5DfAa5EE",
        decimals: "10",
        symbol: "DAN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "DANBNT",
      decimals: "18",
      contract: "0xa06cFAB8B584c91Df1aBee6e8503486AB4e23F40"
    },
    version: 9
  },
  {
    converterAddress: "0x8658863984d116d4B3A0A5af45979eceAC8a62f1",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0Cf0Ee63788A0849fE5297F3407f701E122cC023",
        decimals: "18",
        symbol: "DATA"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "DATABNT",
      decimals: "18",
      contract: "0xdD8a17169aa94E548602096EB9C9d44216cE8a37"
    },
    version: 32
  },
  {
    converterAddress: "0x71168843b49E305E4d53dE158683903eF261B37f",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xc20464e0C373486d2B3335576e83a218b1618A5E",
        decimals: "18",
        symbol: "DTRC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "DTRCBNT",
      decimals: "18",
      contract: "0x1F593cDC35D7f0B0495dA16B631d28DE5AE25a07"
    },
    version: 9
  },
  {
    converterAddress: "0xac4CcEB8Bb7bF4d9Ff6493cDf3F87fE349Ab1beC",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x009e864923b49263c7F10D19B7f8Ab7a9A5AAd33",
        decimals: "18",
        symbol: "FKX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "FKXBNT",
      decimals: "18",
      contract: "0x80c222E38fb57F0710aF21128535096D90503285"
    },
    version: 25
  },
  {
    converterAddress: "0x810C99C5De0A673E4bc86090f9bFE96a6D1B49a7",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xd559f20296FF4895da39b5bd9ADd54b442596a61",
        decimals: "18",
        symbol: "FTX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "FTXBNT",
      decimals: "18",
      contract: "0x4d849DaD08A4061bE102DBCA2CE2718A9a0b635a"
    },
    version: 9
  },
  {
    converterAddress: "0x32d4fb837f41955b81556F74DAdB2C5b8a0D0989",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xFB1e5F5e984C28Ad7E228CDaA1F8A0919BB6a09B",
        decimals: "18",
        symbol: "GES"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "GESBNT",
      decimals: "18",
      contract: "0x5972CED550248B17c9F674639D33E5446b6ad95A"
    },
    version: 9
  },
  {
    converterAddress: "0x2BeA21613B6c2C129d3F714c702008cDD3dD995B",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x9AF839687F6C94542ac5ece2e317dAAE355493A1",
        decimals: "18",
        symbol: "HOT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "HOTBNT",
      decimals: "18",
      contract: "0x0Ac0e122D09cC4DA4A96Cc2731D2b7cc1f8b025a"
    },
    version: 19
  },
  {
    converterAddress: "0xACC03E1fD72CddC66C736cCe84626fbc63dd953B",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x5B09A0371C1DA44A8E24D36Bf5DEb1141a84d875",
        decimals: "18",
        symbol: "MAD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MADBNT",
      decimals: "18",
      contract: "0x014186b1a2d675fc1e303A3d62B574C3270A38e0"
    },
    version: 20
  },
  {
    converterAddress: "0x952EB7dC904F6f8b6b0Bc6c5c99d45143E743Cd7",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x2Ef27BF41236bD859a95209e17a43Fbd26851f92",
        decimals: "4",
        symbol: "MORPH"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MORPHBNT",
      decimals: "18",
      contract: "0xB2Ea67533290fAd84e3fe2E1Fb68D21Ca062d7fc"
    },
    version: 32
  },
  {
    converterAddress: "0xE65c7e27C1c086f26CE0Daa986C3d9c24Ef3c2D8",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xcbee6459728019CB1f2bB971dDe2eE3271BC7617",
        decimals: "18",
        symbol: "MRG"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MRGBNT",
      decimals: "18",
      contract: "0x25Bf8913D6296a69C7B43BC781614992cb218935"
    },
    version: 9
  },
  {
    converterAddress: "0x9dB89726aE2683d21A71fF1417638E72e6D8C0d9",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x5d60d8d7eF6d37E16EBABc324de3bE57f135e0BC",
        decimals: "18",
        symbol: "MYB"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MYBBNT",
      decimals: "18",
      contract: "0xf22FB05aC032fcAf3273f50aF8db2753888Bdd48"
    },
    version: 0
  },
  {
    converterAddress: "0x32131848eDc60E032aBf0369241D34ec969EBf90",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xFc2C4D8f95002C14eD0a7aA65102Cac9e5953b5E",
        decimals: "18",
        symbol: "RBLX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "RBLXBNT",
      decimals: "18",
      contract: "0x78AcF38ec85A9E4B2B88961b9D4BffbA04FdbA59"
    },
    version: 9
  },
  {
    converterAddress: "0xe27cf7324E6377bdDc48DB6BAC642839ffa9Bb36",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x4D305c2334c02E44aC592BbEA681bA4cC1576DE3",
        decimals: "18",
        symbol: "REPUX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "REPUXBNT",
      decimals: "18",
      contract: "0x28291d74Bca9dE7cb6948A8E699651ed93832c50"
    },
    version: 9
  },
  {
    converterAddress: "0xd361339550CD8B3e9446Bbb12AEA337785A7aea4",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xd7631787B4dCc87b1254cfd1e5cE48e96823dEe8",
        decimals: "8",
        symbol: "SCL"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SCLBNT",
      decimals: "18",
      contract: "0xFcEb45cF070B277fedE520c5539ae204Bc1D493E"
    },
    version: 9
  },
  {
    converterAddress: "0x150A46613a16B4256AcD227d00463BAa78B547Ec",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x6888a16eA9792c15A4DCF2f6C623D055c8eDe792",
        decimals: "18",
        symbol: "SIG"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SIGBNT",
      decimals: "18",
      contract: "0x09953e3e5C6Be303D8D83Ccb672d241abc9BEe29"
    },
    version: 20
  },
  {
    converterAddress: "0x8C73126b85f59d85Aa61391579B4C2710DD70f96",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x910Dfc18D6EA3D6a7124A6F8B5458F281060fa4c",
        decimals: "18",
        symbol: "X8X"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "X8XBNT",
      decimals: "18",
      contract: "0xAe0ceCc84bC1DDefe13C6e5B2E9D311927e45eD8"
    },
    version: 9
  },
  {
    converterAddress: "0xBA2BE1Cd1F00470c21385B7cbED6211aeFAc0172",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x28dee01D53FED0Edf5f6E310BF8Ef9311513Ae40",
        decimals: "18",
        symbol: "XBP"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "XBPBNT",
      decimals: "18",
      contract: "0xbb83a9Fe991BAA72F412F39af254EEbbfdc910BA"
    },
    version: 9
  },
  {
    converterAddress: "0x4f138e1CEeC7b33dfA4f3051594Ec016a08c7513",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xBC86727E770de68B1060C91f6BB6945c73e10388",
        decimals: "18",
        symbol: "XNK"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "XNKBNT",
      decimals: "18",
      contract: "0x1B4D8c62DdF6947616a5FCda4Ca40A8715d2a4cb"
    },
    version: 9
  },
  {
    converterAddress: "0x99F357f722EC3e456Af0eB530c1C14a3251305Ad",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x84F7c44B6Fed1080f647E354D552595be2Cc602F",
        decimals: "18",
        symbol: "BBO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BBOBNT",
      decimals: "18",
      contract: "0x980B4118dAb781829DF80D7912d70B059a280DAd"
    },
    version: 9
  },
  {
    converterAddress: "0x0f1C029C5D7f626f6820bfe0F6a7B2Ac48746dDF",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xEF2463099360a085f1f10b076Ed72Ef625497a06",
        decimals: "18",
        symbol: "SHP"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SHPBNT",
      decimals: "18",
      contract: "0x6e0E0B9aB5f8e5F5F2DE4D34FfE46668FFB37476"
    },
    version: 6
  },
  {
    converterAddress: "0x7BAc8115f3789F4d7a3BFE241EB1bCb4D7F71665",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x39Bb259F66E1C59d5ABEF88375979b4D20D98022",
        decimals: "8",
        symbol: "WAX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "WAXBNT",
      decimals: "18",
      contract: "0x67563E7A0F13642068F6F999e48c690107A4571F"
    },
    version: 6
  },
  {
    converterAddress: "0x604989E3cb3f4e77c29C220182d75A99531aCF3A",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xf04a8ac553FceDB5BA99A64799155826C136b0Be",
        decimals: "18",
        symbol: "FLIXX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "FLIXXBNT",
      decimals: "18",
      contract: "0x2d5aDD875442023eC83718Bb03D866c9F4C6E8cE"
    },
    version: 39
  },
  {
    converterAddress: "0xE0569fd1C3f0affD7E08131A16C06f3381C9355a",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xF433089366899D83a9f26A773D59ec7eCF30355e",
        decimals: "8",
        symbol: "MTL"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MTLBNT",
      decimals: "18",
      contract: "0x60Be88DD72f03C91FB22EEF7Af24C2e99Db58530"
    },
    version: 9
  },
  {
    converterAddress: "0xb2841c6e6a9ef1D6fEAa25cCaA6c61CBd58CAa76",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x47bc01597798DCD7506DCCA36ac4302fc93a8cFb",
        decimals: "8",
        symbol: "CMCT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CMCTBNT",
      decimals: "18",
      contract: "0xb5b0E0642d35D7Cab64CDa6EcF87Fd842cB5c58d"
    },
    version: 25
  },
  {
    converterAddress: "0x7B00EFba58CC6fdaB1c162a9C9528B935F5F1af7",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xa704fCe7b309Ec09DF16e2F5Ab8cAf6Fe8A4BAA9",
        decimals: "18",
        symbol: "AGRI"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "AGRIBNT",
      decimals: "18",
      contract: "0xEab935f35693c3218b927436E63564018E92034f"
    },
    version: 32
  },
  {
    converterAddress: "0x248b13d6d10C4102f72e79C04f87228aCe67fd3D",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x5e3346444010135322268a4630d2ED5F8D09446c",
        decimals: "18",
        symbol: "LOC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "LOCBNT",
      decimals: "18",
      contract: "0x38838B895cbf02048455Fb7f649D97C564fC18a8"
    },
    version: 39
  },
  {
    converterAddress: "0xdc59242010E2d29617Bfeec57E62c7C00a5ACb52",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x9c23D67AEA7B95D80942e3836BCDF7E708A747C2",
        decimals: "18",
        symbol: "LOCI"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "LOCIBNT",
      decimals: "18",
      contract: "0x6feb9Be6c40A12276cFa6DAFbD119ea62532daaB"
    },
    version: 1
  },
  {
    converterAddress: "0xc0b6d74940601Af8a8E720a9974E95DdA88B41b8",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xa485bD50228440797Abb4d4595161d7546811160",
        decimals: "18",
        symbol: "PEG:USD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BNT-USD",
      decimals: "18",
      contract: "0x607108c46bCE4cF6f86698E9B46E3270A734FeFe"
    },
    version: 25
  },
  {
    converterAddress: "0x1229e2a0711660BE162521f5626C68E85Ec99c7f",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x9214eC02CB71CbA0ADA6896b8dA260736a67ab10",
        decimals: "18",
        symbol: "REAL"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "REALBNT",
      decimals: "18",
      contract: "0xE9ADced9da076D9dADA35F5b99970fDd58B1440D"
    },
    version: 32
  },
  {
    converterAddress: "0x5039D9B575bD5722d310AF6D2fC11e053c6D03DA",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x1dEa979ae76f26071870F824088dA78979eb91C8",
        decimals: "18",
        symbol: "SPD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SPDBNT",
      decimals: "18",
      contract: "0xb2F40825d32b658d39e4F73bB34D33BA628e8B76"
    },
    version: 1
  },
  {
    converterAddress: "0x79a373401BA7C9557475dA0Ec73368AD0B86fae4",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x960b236A07cf122663c4303350609A66A7B288C0",
        decimals: "18",
        symbol: "ANT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ANTBNT",
      decimals: "18",
      contract: "0x0c485BffD5df019F66927B2C32360159884D4409"
    },
    version: 41
  },
  {
    converterAddress: "0x2A432989CFbAE00e807Bd8Cb414B657F1B74E5c7",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x47Ec6AF8E27C98e41d1Df7fb8219408541463022",
        decimals: "18",
        symbol: "EFOOD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "EFOODBNT",
      decimals: "18",
      contract: "0xf34484286be88613ad8399fe40f93506125be139"
    },
    version: 0
  },
  {
    converterAddress: "0x92a497f0bcDEaa5345f6aA4a3357EE3cbe2E7226",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x9A07fD8a116b7E3Be9e6185861496AF7a2041460",
        decimals: "18",
        symbol: "EMCO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "EMCOBNT",
      decimals: "18",
      contract: "0x2E8d4EF4Cce1a5235311307b45EBEcF31eE7CA88"
    },
    version: 0
  },
  {
    converterAddress: "0x6C96693580Caa51515FC7FE9AE7A088ccB8451a5",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x7B0C06043468469967DBA22d1AF33d77d44056c8",
        decimals: "4",
        symbol: "MRPH"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MRPHBNT",
      decimals: "18",
      contract: "0x4B51AcC819591c885DbA0F06d98A07b432E6D6B4"
    },
    version: 40
  },
  {
    converterAddress: "0xB7246144F53Ec44E0f845Fd0DEea85208acFC2C9",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6",
        decimals: "18",
        symbol: "RDN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "RDNBNT",
      decimals: "18",
      contract: "0x11223Ed5D5846603C4EfC7c451FD8EB596d592cF"
    },
    version: 0
  },
  {
    converterAddress: "0x4E2C46b4E86A17aD942B2Cd6F84302AeE4196A60",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x89303500a7Abfb178B274FD89F2469C264951e1f",
        decimals: "8",
        symbol: "REF"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "REFBNT",
      decimals: "18",
      contract: "0xB67FA7330154878cF1Fd8F4b20bf1C19F68a3926"
    },
    version: 0
  },
  {
    converterAddress: "0x90aDD3Bbfc664C0A07572F4F3Ef94f64200832e1",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x83984d6142934bb535793A82ADB0a46EF0F66B6d",
        decimals: "4",
        symbol: "REM"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "REMBNT",
      decimals: "18",
      contract: "0xaB5ae72d95d3A02796c87F8079b1E180507dF54f"
    },
    version: 31
  },
  {
    converterAddress: "0xBAC94DC2411F494c438cA667A4836e3DCCAA4920",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098",
        decimals: "18",
        symbol: "SAN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SANBNT",
      decimals: "18",
      contract: "0xd6A6c879Ad8c01D0C8d5bF1C85829814b954DBBF"
    },
    version: 0
  },
  {
    converterAddress: "0x5C03354cbaB446CA3Cb426513f11f684724636f7",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x222eFe83d8cC48e422419d65Cf82D410A276499B",
        decimals: "4",
        symbol: "SXL"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SXLBNT",
      decimals: "18",
      contract: "0x3364ccAedE016F4C433B326d96bE1A2eafA60bdD"
    },
    version: 0
  },
  {
    converterAddress: "0xb61b3FE730Fb58936f06239feA2FEEd5B3256F50",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x86D17e2eF332293391303F188F6a467dc0D1fd0d",
        decimals: "18",
        symbol: "RST100"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "RSTBNT",
      decimals: "18",
      contract: "0x43d3a0712eD544b26d85c9eaf841008369bAB5d1"
    },
    version: 0
  },
  {
    converterAddress: "0x6b2c2db78Fc5F1f0A7a7a6d91d26922850A9C693",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x4a57E687b9126435a9B19E4A802113e266AdeBde",
        decimals: "18",
        symbol: "FXC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "FXCBNT",
      decimals: "18",
      contract: "0xb93Cc8642f5e8644423Aa7305da96FFF75708228"
    },
    version: 0
  },
  {
    converterAddress: "0x8bd7448162C296A5bB3F0B9cCDEe383f5b899C93",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xF01d7939441a3b1B108C70A28DcD99c6A98aD4b4",
        decimals: "18",
        symbol: "PRTL"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "PRTLBNT",
      decimals: "18",
      contract: "0x2788C2dB0fBdbaee39Fa010D325d55e7e4527e0d"
    },
    version: 0
  },
  {
    converterAddress: "0xbDC7310289dCd30D16E284d6F207a8E2F76A37aD",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x3166C570935a7D8554c8f4eA792ff965D2EFe1f2",
        decimals: "18",
        symbol: "QDAO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "QDAOBNT",
      decimals: "18",
      contract: "0x19683E94943E6b348D8AFB98C128B9b549B400DF"
    },
    version: 0
  },
  {
    converterAddress: "0x1e45Ff6C529DD038E75767779D12b7981311B8Df",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x6c37Bf4f042712C978A73e3fd56D1F5738dD7C43",
        decimals: "18",
        symbol: "ELET"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ELETBNT",
      decimals: "18",
      contract: "0x334C36Be5b1EaF0C4b61dDEa202c9f6Dc2640FE5"
    },
    version: 31
  },
  {
    converterAddress: "0xE03374cAcf4600F56BDDbDC82c07b375f318fc5C",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDB / BNT",
      decimals: "18",
      contract: "0xd1146B08e8104EeDBa44a73B7bda1d102c6ceDC9"
    },
    version: 14
  },
  {
    converterAddress: "0x70e6f05ae2F61562FAb7115DdD387b83B28564de",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x4954Db6391F4feB5468b6B943D4935353596aEC9",
        decimals: "18",
        symbol: "USDQ"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDQBNT",
      decimals: "18",
      contract: "0x9921f8F53EE185a6BFD5d9D8935107934D0B07DA"
    },
    version: 0
  },
  {
    converterAddress: "0x0dA9706F366C915D3769F7Ae9737Ef77c7741715",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x02F2D4a04E6E01aCE88bD2Cd632875543b2eF577",
        decimals: "18",
        symbol: "PKG"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "PKGBNT",
      decimals: "18",
      contract: "0xE729024679C29c2660E05727ECAfd3D8792b8111"
    },
    version: 20
  },
  {
    converterAddress: "0x6aD9C98E25D8E8292514ef108043278eeC34a27b",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0cB20b77AdBe5cD58fCeCc4F4069D04b327862e5",
        decimals: "8",
        symbol: "MGT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MGTBNT",
      decimals: "18",
      contract: "0x6F60D44A0d6fB95E037A099F8642f949c959a363"
    },
    version: 20
  },
  {
    converterAddress: "0x868229B43a8BCBDFfb244DDE874f52Ade0B1c132",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: "6",
        symbol: "USDC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDCUSDB",
      decimals: "18",
      contract: "0x71c414DaCe65ABff9351E215d25f17F675241c0A"
    },
    version: 20
  },
  {
    converterAddress: "0x7d9B4031290FDD0D48468CefD54a1E34090dC36C",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xB8BAa0e4287890a5F79863aB62b7F175ceCbD433",
        decimals: "18",
        symbol: "SWRV"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BNTSWRV",
      decimals: "18",
      contract: "0x07009A1F62dd238c7167e4D9BC3C5b28B6Fe5a96"
    },
    version: 31
  },
  {
    converterAddress: "0xF4736618F2782b662304b7340084a6Bc6DDb5C2c",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
        decimals: "18",
        symbol: "ZRX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ZRXUSDB",
      decimals: "18",
      contract: "0x1a3c6768e200482F5f47D1BE77B7255aBCAe4Fe2"
    },
    version: 20
  },
  {
    converterAddress: "0xc89bC9cBB8237C58587b5F907ed6B3163BFDD1B9",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
        decimals: "18",
        symbol: "sUSD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "sUSDUSDB",
      decimals: "18",
      contract: "0x9B6678c766003aD69A15f795f433C0F62c10D4d5"
    },
    version: 20
  },
  {
    converterAddress: "0xe037d37898E6f6fFE8AcE3Eb93cD0F78FF107A8e",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
        decimals: "18",
        symbol: "REP"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "REPUSDB",
      decimals: "18",
      contract: "0xAb0C9850BaACF24eFA368b57C2822Ce73b60794c"
    },
    version: 20
  },
  {
    converterAddress: "0x3a8CC07F17Eb10E628c74B1a442c7ADC2BfD854D",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x0000000000085d4780B73119b644AE5ecd22b376",
        decimals: "18",
        symbol: "TUSD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "TUSDUSDB",
      decimals: "18",
      contract: "0x06cd5923593a359111cDec66E74c62E831C8aEab"
    },
    version: 20
  },
  {
    converterAddress: "0xE04c8aecb58BC3C918aeDAc958224a632529926e",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x26E75307Fc0C021472fEb8F727839531F112f317",
        decimals: "18",
        symbol: "C20"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "C20BNT",
      decimals: "18",
      contract: "0x1EF9e0ac29b3813528FbfdAdf5118AB63e4be015"
    },
    version: 13
  },
  {
    converterAddress: "0x06f7Bf937Dec0C413a2E0464Bb300C4d464bb891",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        decimals: "18",
        symbol: "DAI"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "DAIUSDB",
      decimals: "18",
      contract: "0xcb913ED43e43cc7Cec1D77243bA381615101E7E4"
    },
    version: 20
  },
  {
    converterAddress: "0xF02182DA935b810CDD3B5c92F324C16FC0413c3B",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
        decimals: "18",
        symbol: "ENJ"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ENJUSDB",
      decimals: "18",
      contract: "0x42529f410f0a72599Fff2c67DD2a63CFfBcc3f91"
    },
    version: 20
  },
  {
    converterAddress: "0x8F4789889CAe9227114fF4891Dc77a75379773C0",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x5aaEFe84E0fB3DD1f0fCfF6fA7468124986B91bd",
        decimals: "18",
        symbol: "EVED"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "EVEDBNT",
      decimals: "18",
      contract: "0x5E761d4529ae69996cb42E09707f9D1D29F047d6"
    },
    version: 27
  },
  {
    converterAddress: "0x2B4f0AD32a8aC2075648A054D6082727e21eD053",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x607F4C5BB672230e8672085532f7e901544a7375",
        decimals: "9",
        symbol: "RLC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "RLCUSDB",
      decimals: "18",
      contract: "0x6534d2A69c2C7774DF42A55A1678bD008984B324"
    },
    version: 20
  },
  {
    converterAddress: "0x6C69454b0ED9196Fa71cB514e7C3b49aC149eC4B",
    reserves: [
      {
        contract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        decimals: "18",
        symbol: "WETH"
      },
      {
        contract: "0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26",
        decimals: "18",
        symbol: "OGN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "WETHOGN",
      decimals: "18",
      contract: "0xcaB1F46A73Aa6096707f5EF6Edc4C1dfE991f981"
    },
    version: 30
  },
  {
    converterAddress: "0x96772082615Fb019E91877653503EB6Ef1E65Aea",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
        decimals: "18",
        symbol: "KNC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "KNCUSDB",
      decimals: "18",
      contract: "0xD69AE1D715d7451646107D43777139B0a42d7c63"
    },
    version: 20
  },
  {
    converterAddress: "0x97Cf22539646d5a264Fb3FBb68bb0642D8AD2a66",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206",
        decimals: "18",
        symbol: "NEXO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "NEXOUSDB",
      decimals: "18",
      contract: "0x515d562496C43487eb2DDce1a2A7721148D44E36"
    },
    version: 20
  },
  {
    converterAddress: "0xc3b1928A01aC03F8353d05196AfcA778ab9970f7",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671",
        decimals: "18",
        symbol: "NMR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "NMRUSDB",
      decimals: "18",
      contract: "0xEfec901ff0a33d0eF4f8068CDd8b28Fdc40aa556"
    },
    version: 20
  },
  {
    converterAddress: "0x604F88101146b397c31dc4051C5F290f48a5862f",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A",
        decimals: "18",
        symbol: "JRT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "JRTBNT",
      decimals: "18",
      contract: "0x069D653038DB2F9d84e9620Be140B3D404a40258"
    },
    version: 41
  },
  {
    converterAddress: "0xE638A52dDAd3fa31233152C17422E3312A3f6643",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
        decimals: "18",
        symbol: "OMG"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "OMGUSDB",
      decimals: "18",
      contract: "0xAeBfeA5ce20af9fA2c65fb62863b31A90b7e056b"
    },
    version: 20
  },
  {
    converterAddress: "0x81708ECf0ABB950100cd482d2843E1146fa778A4",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0",
        decimals: "18",
        symbol: "LOOM"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "LOOMUSDB",
      decimals: "18",
      contract: "0xc32BF4a12542E897BADbFf2B61e56c82eAe73d69"
    },
    version: 20
  },
  {
    converterAddress: "0xD6DD7d29EcAB65D092942d42c4F360Fde41693Dc",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
        decimals: "18",
        symbol: "BAT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BATUSDB",
      decimals: "18",
      contract: "0x7FfE011B93e06FA14CE5A6E00320937652664366"
    },
    version: 20
  },
  {
    converterAddress: "0xabD0dDC9143972E4eA9A816821bfba8204122E6E",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xA207Ef81C35848A60A732005A42fAe0BA89A9bE2",
        decimals: "4",
        symbol: "MGT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MGTBNT",
      decimals: "18",
      contract: "0x0bA204702F102aD3B0156164754e8af18C24C49C"
    },
    version: 20
  },
  {
    converterAddress: "0x6bA3e97Dee101Edacc3b58ED59273693aCB4c79e",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e",
        decimals: "18",
        symbol: "MET"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "METUSDB",
      decimals: "18",
      contract: "0x7F8c53072d9B809A108b1A9D677Bcc3B7B3F844e"
    },
    version: 20
  },
  {
    converterAddress: "0x29f6Ae0f0c85b472Dc792CeF36e5690E1d3f7255",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xEa6d4D7B36C00B3611dE0B0e1982B12E9e736c66",
        decimals: "18",
        symbol: "ACD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ACDBNT",
      decimals: "18",
      contract: "0x075561230DB23aa3B86ABE8AFE8bbc4eCDdf1C5A"
    },
    version: 20
  },
  {
    converterAddress: "0x296089F31af0648C1B0eFE1234527F85CDbC071C",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F",
        decimals: "18",
        symbol: "SNX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SNXUSDB",
      decimals: "18",
      contract: "0xdf4971E3F52f5828C72A0512d560F54bFB2B2692"
    },
    version: 20
  },
  {
    converterAddress: "0x73B9081946021Dc6B9cE3E335A11A6A5BB2879fE",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
        decimals: "18",
        symbol: "SNX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SNXUSDB",
      decimals: "18",
      contract: "0x28271853E950bE371B050F3f93aA0146225bF374"
    },
    version: 20
  },
  {
    converterAddress: "0x27004767B074C36092e98886c8D4781a14c3CF3b",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xCf8f9555D55CE45a3A33a81D6eF99a2a2E71Dee2",
        decimals: "18",
        symbol: "CBIX7"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CBIX7USDB",
      decimals: "18",
      contract: "0xE35a57AC913144AEf6a4b179634D343466DE3Cc3"
    },
    version: 20
  },
  {
    converterAddress: "0x53106713B160C41634D78A9D5E15D252CCf03d0C",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
        decimals: "6",
        symbol: "DZAR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "DZARUSDB",
      decimals: "18",
      contract: "0x7484867773Bc6f3110f710577d36A3605DBa59DF"
    },
    version: 20
  },
  {
    converterAddress: "0x24844e100ab6cB505C4a195b4a9B610B02518fD4",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xA3AC41Fde5f3a569fa79E81fFe6734ee8097Ce9d",
        decimals: "8",
        symbol: "4XB"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "4XBBNT",
      decimals: "8",
      contract: "0xd8aB826b6D69f5E4Fa1325A5236491a309FBFF4f"
    },
    version: 13
  },
  {
    converterAddress: "0x66540A3fcD929774a8dab59d56fE7A2D3538450F",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A",
        decimals: "18",
        symbol: "JRT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "JRTUSDB",
      decimals: "18",
      contract: "0x4827e558e642861Cd7a1C8f011b2B4661F8d51fa"
    },
    version: 20
  },
  {
    converterAddress: "0x29e44d82303c4F9417B3A6E2e0f61314eAE84375",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704",
        decimals: "18",
        symbol: "XIO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "XIOUSDB",
      decimals: "18",
      contract: "0x18D8001D1Da44fE96f442f5980e08D2Ab4e19594"
    },
    version: 22
  },
  {
    converterAddress: "0xE2AE92c64bfEFeC1Ef884071a7E7857d285c18D7",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xb056c38f6b7Dc4064367403E26424CD2c60655e1",
        decimals: "18",
        symbol: "CEEK"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CEEKUSDB",
      decimals: "18",
      contract: "0x27b099CF19227Ef7488D60a441d7eA2CC7FDDb25"
    },
    version: 22
  },
  {
    converterAddress: "0xe8cA7bbcAA9513638b0943664c99AEE16c1B290F",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xbe5b336eF62D1626940363Cf34bE079e0AB89F20",
        decimals: "18",
        symbol: "BNC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BNCBNT",
      decimals: "18",
      contract: "0xEc7558322f0DF8719c805b39583b6Fd5ca6c9E30"
    },
    version: 29
  },
  {
    converterAddress: "0xF9da2Fa63295bb991b56D38514D9E69B3C21699b",
    reserves: [
      {
        contract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        decimals: "18",
        symbol: "WETH"
      },
      {
        contract: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        decimals: "8",
        symbol: "WBTC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "WETHWBTCDAISNX",
      decimals: "18",
      contract: "0xca186FacC9e927e0c2ddBbd31b16eE41057edDB2"
    },
    version: 26
  },
  {
    converterAddress: "0x99B4C9Eeae0b5D868Fc3B5e833A59Fef3e8FDab1",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671",
        decimals: "18",
        symbol: "NMR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "NMRBNT",
      decimals: "18",
      contract: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44"
    },
    version: 41
  },
  {
    converterAddress: "0xdcdc214997bb0E069057D8F7590BA9f1E7390498",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x43044f861ec040DB59A7e324c40507adDb673142",
        decimals: "18",
        symbol: "CAP"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BNTCAP",
      decimals: "18",
      contract: "0x5afD005056d4b47EBFE31f4B4d33FD8C9Abf1817"
    },
    version: 42
  },
  {
    converterAddress: "0xCdde64592624Ed922e895f172CDaAaBa78891937",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x618E75Ac90b12c6049Ba3b27f5d5F8651b0037F6",
        decimals: "6",
        symbol: "QASH"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BNTQASH",
      decimals: "18",
      contract: "0xbC5fe988433B97cDB1a578531c5380e8EC3242b1"
    },
    version: 31
  },
  {
    converterAddress: "0xa6Bc8b07507bbEB13e21B82067a07802da8aEFBF",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x627974847450C45b60B3Fe3598f4e6E4cf945B9a",
        decimals: "18",
        symbol: "TBC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "TBCUSDB",
      decimals: "18",
      contract: "0x323e4d8097B0A58aB8210AC6efCC4a89285cFc6B"
    },
    version: 20
  },
  {
    converterAddress: "0xe1087bf96bE2336a2b6B09F6e33636df0d4CF680",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
        decimals: "18",
        symbol: "MLN"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MLNUSDB",
      decimals: "18",
      contract: "0x0D6777BFc95b284eA9246c889E99903641129D72"
    },
    version: 20
  },
  {
    converterAddress: "0x0216E9D74BD5BdA4C415778d854464A8d4a0efaB",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x627974847450C45b60B3Fe3598f4e6E4cf945B9a",
        decimals: "18",
        symbol: "TBC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "TBCBNT",
      decimals: "18",
      contract: "0x536545f6B120C2fD099370334097b35bB2403BC3"
    },
    version: 23
  },
  {
    converterAddress: "0xE2ac1898e44a3Be16F823d2b1203E6e3B1407B37",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x29a99c126596c0Dc96b02A88a9EAab44EcCf511e",
        decimals: "18",
        symbol: "CBLT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CBLTBNT",
      decimals: "18",
      contract: "0x7694298e99aedC4E37F855A8661B47d505Ce1b37"
    },
    version: 40
  },
  {
    converterAddress: "0xAc0763a04Ce3b9F00839288E9705076209E9E067",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xd758b77BCC792AFD58857E1d5C610aE649FDEE6b",
        decimals: "18",
        symbol: "PEG:USD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDB:PEGUSD",
      decimals: "18",
      contract: "0x846f7a6dE1eFbd7617760eBe1B89aa8CA2094025"
    },
    version: 14
  },
  {
    converterAddress: "0x4848b295326d49De8F83bD6663B8Cb091a730B06",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xc7DeB5543CfA97b0Af2841418f53B8E554Ff566A",
        decimals: "18",
        symbol: "COMM"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "COMMBNT",
      decimals: "18",
      contract: "0xb83546551C9d4F6D7873804a7352FA930404260d"
    },
    version: 23
  },
  {
    converterAddress: "0x999053a876e4080c682Cfb86a1b2382d8DfCA517",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x3506424F91fD33084466F402d5D97f05F8e3b4AF",
        decimals: "18",
        symbol: "CHZ"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CHZBNT",
      decimals: "18",
      contract: "0x34902D61c3f8D8809A8a2481C36DC514BEBA5cE8"
    },
    version: 23
  },
  {
    converterAddress: "0x86A43a57Cc762472B01d50009C4ED7C1cCD77C28",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x5C406D99E04B8494dc253FCc52943Ef82bcA7D75",
        decimals: "6",
        symbol: "cUSD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "cUSDBNT",
      decimals: "18",
      contract: "0xF0F9bbd5eBc79d7cAD9d35564Ef45aDcD802611e"
    },
    version: 23
  },
  {
    converterAddress: "0x753B73e51c7414F1ff1A10EC5f55aafD1787Ce50",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0Ed55F31EE2F9875A738C6496842b0E6519D7833",
        decimals: "4",
        symbol: "AUTO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "AUTOBNT",
      decimals: "18",
      contract: "0x0B21617eD9b15fd901e0b36b8eDF9d68aDc11Ad5"
    },
    version: 23
  },
  {
    converterAddress: "0xFF116e5b56a8FEb357fDb63c9Fe9b3d67Ba14B7F",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xB414F8Ec2D14c64f37B1559CBE43746284514596",
        decimals: "18",
        symbol: "FTH"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "FTHBNT",
      decimals: "18",
      contract: "0x3A946bb329f78CCBc75d836136De3a472Bdf5499"
    },
    version: 23
  },
  {
    converterAddress: "0x1F60750F009745Bf0e139813C3786D10e744b50D",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b",
        decimals: "18",
        symbol: "pBTC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "pBTCUSDB",
      decimals: "18",
      contract: "0x6B09B01c19E4bD573eae4e235ee47CBD51dF3B6E"
    },
    version: 27
  },
  {
    converterAddress: "0x43C552eB8669D60929CE3D41f4632FE3b6CB79F2",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b",
        decimals: "18",
        symbol: "pBTC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "pBTCBNT",
      decimals: "18",
      contract: "0xEEF7551e59b34F431D71C7593249F61D5c52ce65"
    },
    version: 27
  },
  {
    converterAddress: "0xDA1e8397d4ABBAd40de926e24c7BaFd851386D0a",
    reserves: [
      {
        contract: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
        decimals: "18",
        symbol: "sUSD"
      },
      {
        contract: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        decimals: "18",
        symbol: "DAI"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SUSDDAI",
      decimals: "18",
      contract: "0xb2D679F6D676f173fAF3670a074B2C3A6D7Ebe28"
    },
    version: 25
  },
  {
    converterAddress: "0x55baD7CDDe403872E1A4EAB787F67177A41aA716",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0Efc2390C79C47452898a234a27F2b9C39A7a725",
        decimals: "18",
        symbol: "EST"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ESTBNT",
      decimals: "18",
      contract: "0xd16a3A892695ec9a47EFFdD5247980a8d2be3fF2"
    },
    version: 23
  },
  {
    converterAddress: "0xc4bf6Dc46537AA77428CD87cFe57D817e76285A2",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x8400D94A5cb0fa0D041a3788e395285d61c9ee5e",
        decimals: "8",
        symbol: "UBT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "UBTBNT",
      decimals: "18",
      contract: "0x290bd3a8F785a8dB30a0F6Baf9B88863b831747F"
    },
    version: 23
  },
  {
    converterAddress: "0xcFd79b484f33c8098E2fd279729BEcC1c53a362f",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x4CC19356f2D37338b9802aa8E8fc58B0373296E7",
        decimals: "18",
        symbol: "KEY"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "KEYBNT",
      decimals: "18",
      contract: "0xa7e21e7584fc6fDf6Fa978a5d4981352B0260954"
    },
    version: 23
  },
  {
    converterAddress: "0xd79Bd02053287a2a635B09b63136806D174d51a5",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xCFABaFF3bb057ba878f43ce027c9266D2F900561",
        decimals: "18",
        symbol: "BFZ"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BFZBNT",
      decimals: "18",
      contract: "0x6f8BeaDF9eCd851be239b616149aF3E69D49ce11"
    },
    version: 23
  },
  {
    converterAddress: "0xE1437F404451A00A9C555000b6f3cBA2480291c8",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x3C45B24359fB0E107a4eAA56Bd0F2cE66C99A0E5",
        decimals: "18",
        symbol: "ANK"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ANKBNT",
      decimals: "18",
      contract: "0x437F7d93540094Da58F337644ba7D6E5Ad823564"
    },
    version: 20
  },
  {
    converterAddress: "0x615FED2B7A84537E729D3dd32dE150bF0253fF10",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        decimals: "18",
        symbol: "DAI"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "DAIBNT",
      decimals: "18",
      contract: "0xE5Df055773Bf9710053923599504831c7DBdD697"
    },
    version: 41
  },
  {
    converterAddress: "0x62aeE73B82Cc64dd3c65ac220838210556C5c897",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xf8A2ED21fEa517665b35aC824387bf9b41c71919",
        decimals: "18",
        symbol: "HOTEL"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "HOTELBNT",
      decimals: "18",
      contract: "0x1344381f0e93a2A1Ab0BFd2fE209a9BD01343933"
    },
    version: 23
  },
  {
    converterAddress: "0xfDC38F68177634317146431E834F0838D4d0DFD3",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x618aCb9601cb54244F5780F09536DB07d2C7aCf4",
        decimals: "2",
        symbol: "GRIG"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "GRIGUSDB",
      decimals: "18",
      contract: "0x1F6e51ce0533A075fDd602FbD6159763aCaB579b"
    },
    version: 23
  },
  {
    converterAddress: "0xe8b06d938a863bb2c82644125d7714844b8A98a4",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xcf33Eb02227255c45F595727Dbb24cE16afc36A2",
        decimals: "18",
        symbol: "YHTS"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "YHTSBNT",
      decimals: "18",
      contract: "0x04A3030c94Fb2dBE2b898d8cBf6Fd1c656FA69dd"
    },
    version: 23
  },
  {
    converterAddress: "0x3cd2ea665e45310d4a7baf0b8a378793691d49AA",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xf8aD7dFe656188A23e89da09506Adf7ad9290D5d",
        decimals: "18",
        symbol: "BLY"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BLYBNT",
      decimals: "18",
      contract: "0x782E07B7Bbf908135D083c4f65459f8F1549a415"
    },
    version: 31
  },
  {
    converterAddress: "0x66437A8E8D98ee27B5F5B99aB7835b6A887d191b",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x825a64810e3EE35bD64c940140eA91a609608ABE",
        decimals: "18",
        symbol: "CRTS"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CRTSBNT",
      decimals: "18",
      contract: "0x0F92330EAaBa84CB54b068F4331Cc40Dd2A98236"
    },
    version: 23
  },
  {
    converterAddress: "0x8e11504d39dfc576a78cAC7FF835Bf9dcBb2453F",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
        decimals: "18",
        symbol: "LRC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "LRCASTBNT",
      decimals: "18",
      contract: "0xE355dcF475ff7569B8b74d5165a532ABa87c25bf"
    },
    version: 26
  },
  {
    converterAddress: "0x850e6fDc53816Fb32d6A1B45aFD95e9e6420F9d7",
    reserves: [
      {
        contract: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        decimals: "8",
        symbol: "WBTC"
      },
      {
        contract: "0x3212b29E33587A00FB1C83346f5dBFA69A458923",
        decimals: "8",
        symbol: "imBTC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BTCDEFI",
      decimals: "18",
      contract: "0x534DF0Ec6D65cD6fE1b05D3b8c935c97Eb844190"
    },
    version: 27
  },
  {
    converterAddress: "0xbB98e2d06B2AcD3E2E4694088B8B5A0014e222cD",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x80640db285Cc63496bdd8c1980A7f4526A4D477F",
        decimals: "6",
        symbol: "BTZC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BTZCUSDB",
      decimals: "18",
      contract: "0x488E99fbCF49BFfC94cCae3B8eaCDd2Bd9aC981C"
    },
    version: 30
  },
  {
    converterAddress: "0x7D86d4d01DD72Db066655D38C1de0006c5B2224f",
    reserves: [
      {
        contract: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b",
        decimals: "18",
        symbol: "pBTC"
      },
      {
        contract: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        decimals: "8",
        symbol: "WBTC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "WBTCpBTC",
      decimals: "18",
      contract: "0xFA3Bba432c0499c091F821aEB22FC36c4F8c78e3"
    },
    version: 26
  },
  {
    converterAddress: "0x92826145C76D7808BA6a5eA1f8f5D491dfE440b5",
    reserves: [
      {
        contract: "0x5D4d57cd06Fa7fe99e26fdc481b468f77f05073C",
        decimals: "18",
        symbol: "NTK"
      },
      {
        contract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        decimals: "18",
        symbol: "WETH"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "NTKWETH",
      decimals: "18",
      contract: "0x16EAcd526799C244CcBD8501422F542aAB07aAD4"
    },
    version: 31
  },
  {
    converterAddress: "0x4b536A64f25f2070B5ACe6d79f6CeFf0D9Be4DC1",
    reserves: [
      {
        contract: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
        decimals: "6",
        symbol: "DZAR"
      },
      {
        contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: "6",
        symbol: "USDC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDC-DZAR",
      decimals: "18",
      contract: "0x4EB61146e9Ad2a9D395956eF410EBaF7459f4622"
    },
    version: 26
  },
  {
    converterAddress: "0xa4FfBDc5B0F5e61537c0F43FAD28Cf45E94BdE43",
    reserves: [
      {
        contract: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3",
        decimals: "18",
        symbol: "sUSD"
      },
      {
        contract: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
        decimals: "6",
        symbol: "DZAR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "sUSD-DZAR",
      decimals: "18",
      contract: "0x368B3D50E51e8bf62E6C73fc389e4102B9aEB8e2"
    },
    version: 26
  },
  {
    converterAddress: "0xC9A722be71Ac8B1Faa00c995e6d47835C933DAd6",
    reserves: [
      {
        contract: "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F",
        decimals: "18",
        symbol: "SNX"
      },
      {
        contract: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
        decimals: "6",
        symbol: "DZAR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SNX-DZAR",
      decimals: "18",
      contract: "0x91AFdd8EF36DEf4fa2B9d7A05420f9D0E4F775d1"
    },
    version: 26
  },
  {
    converterAddress: "0x4C10E60953C77d20dCC69E2462D794f14718adE6",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x9b53E429B0baDd98ef7F01F03702986c516a5715",
        decimals: "18",
        symbol: "HY"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "HYBNT",
      decimals: "18",
      contract: "0x31633C7c4f3FD374d187da5c19BBdb41DBdDdc86"
    },
    version: 31
  },
  {
    converterAddress: "0x2727Da5FB75aA61876aD90Ec09c031C01919176B",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD",
        decimals: "12",
        symbol: "GRID"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "GRIDBNT",
      decimals: "18",
      contract: "0xDdde5DBa82B92DAF339fBB4cF1ec4d1CEC503075"
    },
    version: 23
  },
  {
    converterAddress: "0xa239EA1E43fCeAb1246eD819c88AC714B3c466aE",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x67Abf1C62D8Acd07aDa35908d38Cd67bE7DfEB36",
        decimals: "8",
        symbol: "UPT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "UPTBNT",
      decimals: "18",
      contract: "0x5a602561342F74D161E64796613D7528Dd0993C1"
    },
    version: 26
  },
  {
    converterAddress: "0x971E89e5202e2E4d4cB16Bc89F742D151931559d",
    reserves: [
      {
        contract: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        decimals: "18",
        symbol: "DAI"
      },
      {
        contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: "6",
        symbol: "USDC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDRAY1",
      decimals: "18",
      contract: "0xFD556AB5010A4076fee1A232117E4ef549A84032"
    },
    version: 26
  },
  {
    converterAddress: "0xD4e88E23399b8cFCaF89CE5BEeD029D13513e6A5",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x4cbdaea41E4C864477E1430a896d9E3Bac11f593",
        decimals: "0",
        symbol: "FCO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "FCOUSDB",
      decimals: "18",
      contract: "0x94A2aAA374A8F2D52dad24330C8a0Ec2934700ae"
    },
    version: 23
  },
  {
    converterAddress: "0xF8e14A1189ddFa7c1d2F3a4DE905935d420e9e70",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x7db5454F3500f28171d1f9c7a38527C9cF94e6b2",
        decimals: "4",
        symbol: "AGS"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "AGSBNT",
      decimals: "18",
      contract: "0x653F1FFC243D7B6F4ca65Df9520A80D0113dA3d6"
    },
    version: 27
  },
  {
    converterAddress: "0x6769c5309967Ccf6b5E5eB340089fBE7957397d1",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        decimals: "18",
        symbol: "WETH"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "PARETOWETHUSDCBNT",
      decimals: "18",
      contract: "0x2f4EF142cd9983B1f86dF21BEd3cE12E06856dCb"
    },
    version: 26
  },
  {
    converterAddress: "0x18d76D2d0a624AB973F1C98e8916aa45253b115c",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xb5f278Ee11811eFEC0692EC61b1e9f9984f2de11",
        decimals: "3",
        symbol: "EMIT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "EMIT1USDB",
      decimals: "18",
      contract: "0x37Be876EF051eB8EDdD0745107c5222D8CA8EC60"
    },
    version: 26
  },
  {
    converterAddress: "0xA64906C4434211ce9f3Ac2702D5f60b21EB02E74",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0eCDd783dc7bF820614044B51862ED29714d2BA5",
        decimals: "18",
        symbol: "MDZA"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MDZAUSDB",
      decimals: "18",
      contract: "0x7651021390129c9c2672f47292C31b33f63EE5Cc"
    },
    version: 26
  },
  {
    converterAddress: "0x274b4b35eE47622016d94b7eD14460de00AA504A",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
        decimals: "8",
        symbol: "HEX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "TSTST",
      decimals: "18",
      contract: "0x10ef8f03cd0F3D7Bc14A04ba2C173414aA8C5E7E"
    },
    version: 25
  },
  {
    converterAddress: "0xf462769d8C7f31A07d1636D9d492c0E592D804f4",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xB4EFd85c19999D84251304bDA99E90B92300Bd93",
        decimals: "18",
        symbol: "RPL"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "RPLBNT",
      decimals: "18",
      contract: "0xB9fe4BD869a132137B668054ea48C897c0654ee4"
    },
    version: 41
  },
  {
    converterAddress: "0xB485A5F793B1DEadA32783F99Fdccce9f28aB9a2",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xF5238462E7235c7B62811567E63Dd17d12C2EAA0",
        decimals: "8",
        symbol: "CGT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CGTBNT",
      decimals: "18",
      contract: "0x9ceE7038Fc154D92d009c2Dd8ac083b557495713"
    },
    version: 23
  },
  {
    converterAddress: "0x121A7b80D7E73dbe928f783d4009074063bF659D",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0E22734e078d6e399BCeE40a549DB591C4EA46cB",
        decimals: "18",
        symbol: "STM"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "STMBNT",
      decimals: "18",
      contract: "0x452821f74Ab9d38EDD3145C59280aC1bCBCe9B81"
    },
    version: 23
  },
  {
    converterAddress: "0xd6562db5451534f9422c0b582bE48D2E0A37A919",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x7dE91B204C1C737bcEe6F000AAA6569Cf7061cb7",
        decimals: "9",
        symbol: "XRT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "XRTBNT",
      decimals: "18",
      contract: "0x111252C5A7fb75d541071753bd1fAAf367d0321F"
    },
    version: 27
  },
  {
    converterAddress: "0x444Bd9a308Bd2137208ABBcc3efF679A90d7A553",
    reserves: [
      {
        contract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        decimals: "18",
        symbol: "WETH"
      },
      {
        contract: "0xa7DE087329BFcda5639247F96140f9DAbe3DeED1",
        decimals: "18",
        symbol: "STA"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "STAWETH",
      decimals: "18",
      contract: "0xbaD59113679717e0a9D5324d289DA6c5Fa8862E2"
    },
    version: 27
  },
  {
    converterAddress: "0x5C8c7Ef16DaC7596C280E70C6905432F7470965E",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: "18",
        symbol: "ETH"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ETHUSDB",
      decimals: "18",
      contract: "0x482c31355F4f7966fFcD38eC5c9635ACAe5F4D4F"
    },
    version: 29
  },
  {
    converterAddress: "0x05e770141538e82C04a374bc11DA9B54fB50d28F",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x4485561Db76614Ff727f8E0a3Ea95690b8b16022",
        decimals: "18",
        symbol: "INVOX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "INVOXBNT",
      decimals: "18",
      contract: "0xD86f489a495426B1847dBd4b5D85f4832E6D7225"
    },
    version: 29
  },
  {
    converterAddress: "0x0429e43f488D2D24BB608EFbb0Ee3e646D61dE71",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x48f07301E9E29c3C38a80ae8d9ae771F224f1054",
        decimals: "18",
        symbol: "XZAR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "XZARBNT",
      decimals: "18",
      contract: "0xdB7B2616210Bd0068D914eEB7E31aFD2Da517444"
    },
    version: 29
  },
  {
    converterAddress: "0x7FF01DB7ae23b97B15Bc06f49C45d6e3d84df46f",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xb60Fde5D798236fBF1e2697B2A0645380921FccF",
        decimals: "18",
        symbol: "STONK"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "STONKBNT",
      decimals: "18",
      contract: "0xc570Bae3772b618a981c4A5AaD51bc3e222E7A3B"
    },
    version: 29
  },
  {
    converterAddress: "0x16ff969cC3A4AE925D9C0A2851e2386d61E75954",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0e511Aa1a137AaD267dfe3a6bFCa0b856C1a3682",
        decimals: "18",
        symbol: "BPT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "STADIFX",
      decimals: "18",
      contract: "0xC1a01Cc1F147A1a7e35E8caBFDe80706E76522dE"
    },
    version: 29
  },
  {
    converterAddress: "0xcAf6Eb14c3A20B157439904a88F00a8bE929c887",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x840fe75ABfaDc0F2d54037829571B2782e919ce4",
        decimals: "18",
        symbol: "WEB"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "WEBBNT",
      decimals: "18",
      contract: "0x5094841D5eE018a5E29E23055aFC263093f95a3E"
    },
    version: 30
  },
  {
    converterAddress: "0x1a7eC550f463138f283C542D755cc28c5b6E26C3",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x8Ae56a6850a7cbeaC3c3Ab2cB311e7620167eAC8",
        decimals: "18",
        symbol: "PEG"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "PEGUSDB",
      decimals: "18",
      contract: "0xE421EA0DB7A0B5bebB4b9b258D864a68546c0881"
    },
    version: 30
  },
  {
    converterAddress: "0xdf6b463F27bE26110c20C1e3BDE480bD5Fc057d9",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x2d71983E810B9e95258966B9c164C4d61a829bA9",
        decimals: "6",
        symbol: "ICT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ICTBNT",
      decimals: "18",
      contract: "0xb381D21c09BaC7278b6802193167A2a01127b976"
    },
    version: 30
  },
  {
    converterAddress: "0x5C1E2F8320Bfe3a5558B4eB529c823c3bB468C18",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x199c3DdedB0e91dB3897039AF27c23286269F088",
        decimals: "8",
        symbol: "DCX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "DCXUSDB",
      decimals: "18",
      contract: "0x50eA977Abd2e622241d5074fa15B97eB823B3ED5"
    },
    version: 30
  },
  {
    converterAddress: "0x63CBbfB48B5cC9ea4B87b1B6A3a6abD70DD8A9eC",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x7cE0641D19095ed3226fC5222836901bcE41585D",
        decimals: "18",
        symbol: "SFGB"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "SFGBEMITUSDB",
      decimals: "18",
      contract: "0x325732Fd6d9b98f60acFb6215eDe90B9F9bAD38a"
    },
    version: 30
  },
  {
    converterAddress: "0x53E9c0Ee79Ab9Ccb46939685E1E62245Adf90Cba",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xb8B7791b1A445FB1e202683a0a329504772e0E52",
        decimals: "2",
        symbol: "STC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "STCUSDB",
      decimals: "18",
      contract: "0x9DB9CcFC66e5caCdEf842c2F04fCD7d31C3fA137"
    },
    version: 30
  },
  {
    converterAddress: "0x6e7646C7c4D4cf22d24FBAf990Cdc2C62aA1A7F5",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xF2BA4AFcBE22F0e626d67D8f31E96428706282e9",
        decimals: "18",
        symbol: "GLDR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "GLDRBNT",
      decimals: "18",
      contract: "0xb2aFA773c749F988B82CAb56284d0F1b01c7E2dC"
    },
    version: 30
  },
  {
    converterAddress: "0x7aA2b23eA10c4E8C778F60a93D1c25780DB14075",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xfC4A2Cd574bdcC385173f03A6a52cC3B853BB9d4",
        decimals: "18",
        symbol: "LKSC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "LKSCBNT",
      decimals: "18",
      contract: "0x500f3e107A6d62bb15394892a22495ACF71D007F"
    },
    version: 30
  },
  {
    converterAddress: "0x1168d7C63ffa5baa167004f2b81b7f7104b4101C",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x4730fB1463A6F1F44AEB45F6c5c422427f37F4D0",
        decimals: "18",
        symbol: "FOUR"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "FOURUSDB",
      decimals: "18",
      contract: "0x23736A2c9728C309039831c245754E19cEd07546"
    },
    version: 31
  },
  {
    converterAddress: "0x8863fE594289c281Aa385029904EE4575c775587",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xCB0aD5f479812edD6e2cED1cfE621bF39D7E9158",
        decimals: "18",
        symbol: "ONTO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ONTOBNT",
      decimals: "18",
      contract: "0x992EcEA6bEf983168Fcb264C8b2C9A15E274e02F"
    },
    version: 31
  },
  {
    converterAddress: "0x05840ca15Bef62b48FD2248CB688860C8A69aDff",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xE58E751abA3B9406367B5F3CbC39c2Fa9B519789",
        decimals: "18",
        symbol: "EXO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "EXOBNT",
      decimals: "18",
      contract: "0xa8E7117ac5d76fC147B71524780327AA218B5612"
    },
    version: 31
  },
  {
    converterAddress: "0x39e5AAE547752c1239b4738e75cDF705c25adeA6",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: "6",
        symbol: "USDT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDTUSDB",
      decimals: "18",
      contract: "0xF2ff22976B973d6bcC17a7dC93B719162ADA2045"
    },
    version: 20
  },
  {
    converterAddress: "0xEF8c6c64926A9548210adDC22e8ed6034E39b0Da",
    reserves: [
      {
        contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: "6",
        symbol: "USDC"
      },
      {
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: "6",
        symbol: "USDT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDARY",
      decimals: "18",
      contract: "0x1F5350558F1E3e8Bf370d4d552F3ebC785bf2979"
    },
    version: 26
  },
  {
    converterAddress: "0x7fF10d4AdD8c9c2F5E47798cD60544Ad91c1F4eC",
    reserves: [
      {
        contract: "0xD5bF66fF3Dab4c74Ac6014fd2181Bd3aD1bBaF32",
        decimals: "8",
        symbol: "ECC"
      },
      {
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: "6",
        symbol: "USDT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ECCUSDT",
      decimals: "18",
      contract: "0xc83300a16de6518Dd0Be5ad656F3d6f197A30692"
    },
    version: 31
  },
  {
    converterAddress: "0x99e8e0e3D4cd50f856f675567FeC8eb732CfE2d7",
    reserves: [
      {
        contract: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
        decimals: "6",
        symbol: "DZAR"
      },
      {
        contract: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3",
        decimals: "18",
        symbol: "sUSD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDZAR",
      decimals: "18",
      contract: "0x09C5188d9fE33d218Cc186baE8F985907b25eBEe"
    },
    version: 26
  },
  {
    converterAddress: "0x6DAE0133395AeC73B122fF010Ce85b78209310C2",
    reserves: [
      {
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: "6",
        symbol: "USDT"
      },
      {
        contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: "6",
        symbol: "USDC"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "USDZAR 7030",
      decimals: "18",
      contract: "0xf001bC665ffac52c6a969305c3BDaaf88DE4bBC8"
    },
    version: 26
  },
  {
    converterAddress: "0x81b4bd459f3f73433222D7E5439E3640A4BF4B5B",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x2cC1bE643e0882fB096f7f96d2b6Ca079ad5270c",
        decimals: "8",
        symbol: "MPT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MPTBNT",
      decimals: "18",
      contract: "0xb47Bd84C954Fa597B40fe41D4e116fb0eF2468bb"
    },
    version: 31
  },
  {
    converterAddress: "0x86412aef21A2BB0BE5ac7bd98C7375d655e30420",
    reserves: [
      {
        contract: "0x00a8b738E453fFd858a7edf03bcCfe20412f0Eb0",
        decimals: "18",
        symbol: "ALBT"
      },
      {
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: "6",
        symbol: "USDT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ALBTUSDT",
      decimals: "18",
      contract: "0x01697e379E6B2dA6A6D052BAa09F98488433e167"
    },
    version: 31
  },
  {
    converterAddress: "0x7fC1f8F9D20f8940BAE62A594ed5f4B3A4568f1C",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x1368452Bfb5Cd127971C8DE22C58fBE89D35A6BF",
        decimals: "18",
        symbol: "JNTR/e"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "JNTR/e",
      decimals: "18",
      contract: "0x2f005Cc29267f3B57E643B01575ec81789947142"
    },
    version: 41
  },
  {
    converterAddress: "0x1393D065DF58ddb7874c280bb2D11a5e1e9eE96f",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xa665FED1b0C9dA00e91ca582f77dF36E325048c5",
        decimals: "18",
        symbol: "YFM"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "YFMBNT",
      decimals: "18",
      contract: "0x7a553617592d5b67Ef4D8B9aa67aa2A539463900"
    },
    version: 39
  },
  {
    converterAddress: "0x29FE708D175C2Bc416139bA0272ADf975fE6d418",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0xcAd2d4C4469fF09aB24d02A63BCeDfCD44bE0645",
        decimals: "18",
        symbol: "ACPT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "ACPTBNT",
      decimals: "18",
      contract: "0x9E7749E446572842C7c0E1B76b673e9D1332db11"
    },
    version: 39
  },
  {
    converterAddress: "0x9f860A2C3786074e37fA2ab03B245A97E0e1F43E",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x4a527d8fc13C5203AB24BA0944F4Cb14658D1Db6",
        decimals: "18",
        symbol: "MITx"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "MITxUSDB",
      decimals: "18",
      contract: "0x7482326Eb7E44Aec1269C052B9B1aF26606b0B90"
    },
    version: 40
  },
  {
    converterAddress: "0xa60B057673809956ae3cA9A0E0bc246efD4F8339",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
        decimals: "18",
        symbol: "sUSD"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "sUSDBNT",
      decimals: "18",
      contract: "0xd2C9F2A62f9a1e80cD76392c02491212a2230cF4"
    },
    version: 41
  },
  {
    converterAddress: "0xD10591e2b47667AD9E543f780d5105E54Cc7C9D9",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03",
        decimals: "18",
        symbol: "LEND"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "LENDBNT",
      decimals: "18",
      contract: "0x020F8aCf2Dea7Ad1CF8413431e427F684181C6BA"
    },
    version: 41
  },
  {
    converterAddress: "0x112C5405d005F5e9C32eDB9A6B59E255B044126C",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x0B244e01B1B0C9a959b3b0Bc19E3852395319876",
        decimals: "4",
        symbol: "BUFFGATE"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BUFFGATEBNT",
      decimals: "18",
      contract: "0x2d35087923194400d329EE74b45CBc77b7d573Ff"
    },
    version: 41
  },
  {
    converterAddress: "0xc11C56aa3cCb9c5065B2Be46Bbb50A83C5dC5012",
    reserves: [
      {
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        decimals: "18",
        symbol: "USDB"
      },
      {
        contract: "0x0B244e01B1B0C9a959b3b0Bc19E3852395319876",
        decimals: "4",
        symbol: "BUFFGATE"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BUFFGATEUSDB",
      decimals: "18",
      contract: "0x37382ca45EFc45bd1A53649Ab98D3Fa337e56A2F"
    },
    version: 41
  },
  {
    converterAddress: "0xB20814d5cc0D723fefaad3BB9d74a2d90B3165D3",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x2AEC18c5500f21359CE1BEA5Dc1777344dF4C0Dc",
        decimals: "18",
        symbol: "FTT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BNTFTT",
      decimals: "18",
      contract: "0xD9c195c9E1C49e86C7A0F0E29627CB8F8523A7fb"
    },
    version: 41
  },
  {
    converterAddress: "0x25F98800cd9d3FeEF2031d1C0b3FD1f7Cb83E4FF",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A",
        decimals: "18",
        symbol: "JRT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "JRT90BNT10",
      decimals: "18",
      contract: "0xE274C0cCf7B0bC1eF29FFf9AD5eC98E9B5c45e84"
    },
    version: 41
  },
  {
    converterAddress: "0x8c3FBcfCB0f63eDdeD00b87C93B824DB86aa1D59",
    reserves: [
      {
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        decimals: "18",
        symbol: "BNT"
      },
      {
        contract: "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94",
        decimals: "18",
        symbol: "vBNT"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "BNTvBNT",
      decimals: "18",
      contract: "0xBA04e539da9e7a6491A6c6ae38D9750226a3D36b"
    },
    version: 42
  },
  {
    converterAddress: "0x6cba561bB35919597531d9cF6720A48867fdA8c9",
    reserves: [
      {
        contract: "0x261EfCdD24CeA98652B9700800a13DfBca4103fF",
        decimals: "18",
        symbol: "sXAU"
      },
      {
        contract: "0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF",
        decimals: "9",
        symbol: "DGX"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "AURELIO",
      decimals: "18",
      contract: "0x0aacA86e54Fe70eDd7c86cBF3cFb470caA49FAeF"
    },
    version: 26
  },
  {
    converterAddress: "0x554A544F2A21e5E13E42de5BCdDca6962ec2a478",
    reserves: [
      {
        contract: "0x37Be876EF051eB8EDdD0745107c5222D8CA8EC60",
        decimals: "18",
        symbol: "EMIT1USDB"
      },
      {
        contract: "0xEE4dC4C5Ca843B83035d8E5159AC1bd1b4EbdfF5",
        decimals: "18",
        symbol: "FCO"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "EMIT1USDB2FCO",
      decimals: "18",
      contract: "0x2a3a6596B35735EfaC3577dC36bF750bfe5888e8"
    },
    version: 27
  },
  {
    converterAddress: "0x8f22D68c4F39d750A53fD51F4D8A03d8A2F25b03",
    reserves: [
      {
        contract: "0x79A91cCaaa6069A571f0a3FA6eD257796Ddd0eB4",
        decimals: "18",
        symbol: "CAPC"
      },
      {
        contract: "0x107721d9aA07d9DE8f2CC9545e0C9346A9Bb503b",
        decimals: "18",
        symbol: "CAPg"
      }
    ],
    converterType: 1,
    poolToken: {
      symbol: "CAPCCAPg",
      decimals: "18",
      contract: "0x1f3fb50488124EB0d5Cf0d2b22CA7c8ed00e2344"
    },
    version: 31
  }
];

export const knownPools: ConverterAndAnchor[] = moreStaticRelays.map(
  staticToConverterAndAnchor
);

export const previousPoolFees: PreviousPoolFee[] = [];

export const findPreviousPoolFee = (
  previousPoolFees: PreviousPoolFee[],
  blockNumber: number,
  relayId: string
) => {
  const previousFee = previousPoolFees.find(
    poolFee =>
      compareString(relayId, poolFee.id) && blockNumber < poolFee.blockNumber
  );
  const res = previousFee && previousFee.oldDecFee;
  return res;
};
