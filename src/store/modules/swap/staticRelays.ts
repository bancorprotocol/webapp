import { DryRelay } from "@/api/eos/eosBancorCalc";
import { compareString } from "@/api/helpers";
import { Sym } from "eos-common";
import moment from "moment";

const bntToken = {
  contract: "bntbntbntbnt",
  symbol: "10,BNT"
};

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

export interface PreviousPoolFee {
  oldDecFee: number;
  blockNumber: number;
  id: string;
}

export const previousPoolFees: PreviousPoolFee[] = [];

export const liquidityMiningEndTime = moment(
  "2021-02-08 20:15 +0000",
  "YYYY-MM-DD HH:mm Z"
).unix();

export const secondRoundLiquidityMiningEndTime = moment(
  "2021-02-25 18:05 +0000",
  "YYYY-MM-DD HH:mm Z"
).unix();

export const highCapPools = [
  "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
  "0xFEE7EeaA0c2f3F7C7e6301751a8dE55cE4D059Ec",
  "0x5365B5BC56493F08A38E5Eb08E36cBbe6fcC8306",
  "0x874d8dE5b26c9D9f6aA8d7bab283F9A9c6f777f4",
  "0xE5Df055773Bf9710053923599504831c7DBdD697",
  "0x04D0231162b4784b706908c787CE32bD075db9b7"
];

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
