import { DryRelay } from "@/api/eos/eosBancorCalc";
import { compareString } from "@/api/helpers";
import { Sym } from "eos-common";
import moment from "moment";
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

export const knownPools = [
  {
    anchorAddress: "0x0e2145A23f7810431Ba0f2e19676530b3F1Fb0EC",
    converterAddress: "0x7f913E9DeeF8eFE8d09A2e67d18cEd9BE4Ad1dc7"
  },
  {
    anchorAddress: "0xE94C892f90ABea59F3dd1D7d8c34aC9d7312F18A",
    converterAddress: "0x235d4FD0D13784c848712c30f2Da03925496FBd4"
  },
  {
    anchorAddress: "0xDC610F8eecE47E9F91209C77C8674C40d2d8E17F",
    converterAddress: "0x1e9653f8A3F1D5ACEC0d334e6433b9677acCe7fF"
  },
  {
    anchorAddress: "0x8bb91B280A39A9e9D8505B9a5BC792CCb3B9779E",
    converterAddress: "0xDB3eC1d6A089F6be97B8fc00bEB43b34c7BeEB23"
  },
  {
    anchorAddress: "0x32423158e8FBD2839E085626F8a98D86b2766De8",
    converterAddress: "0xB018AF916Ed0116404537D1238b18988D652733a"
  },
  {
    anchorAddress: "0xf3aD2cBc4276eb4B0fb627Af0059CfcE094E20a1",
    converterAddress: "0xCbb50B9A3C587FF59B61702A9Bb93b6Ff0220ba9"
  },
  {
    anchorAddress: "0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340",
    converterAddress: "0xD2195468D42C607f6B62d3144a5d2f7f2BC09443"
  },
  {
    anchorAddress: "0x1C9Df905571B22214Fa5FB10ad99ebe327f199C5",
    converterAddress: "0x38a3Fc625DF834dD34e8EDE60E10Cd3024a6650E"
  },
  {
    anchorAddress: "0xe3BF775Ec5f4F4dFCbb21194B22be1217b815b1d",
    converterAddress: "0xb85E52268CBF57b97Ae15136Aa65D4F567B8107c"
  },
  {
    anchorAddress: "0xA415cD56C694bd7402d14560D18Bb19A28F77617",
    converterAddress: "0xb8a6920962655c97F0E3Eab40E5706Ed934907Cc"
  },
  {
    anchorAddress: "0x1D75ebc72f4805e9C9918B36A8969b2e3847c9FB",
    converterAddress: "0xa00655976c5c9A1eD58b3707b190867069bAbEe5"
  },
  {
    anchorAddress: "0x131da075a2832549128e93AcC2b54174045232Cf",
    converterAddress: "0x1317BD40c86461dFEE8E7bEE8B2Fb697b958cb7e"
  },
  {
    anchorAddress: "0xD3aD4c39A12B48164068Fef8F86eF5836A9eF303",
    converterAddress: "0x27f8fd3ac4eAa50068B8F221bFa0b496F180813e"
  },
  {
    anchorAddress: "0xE6b31fB3f29fbde1b92794B0867A315Ff605A324",
    converterAddress: "0x0Da9F5b929B316D90F27F3510D7d9be6D8eA7706"
  },
  {
    anchorAddress: "0xc9CEadb2d3bCeB198C1361c6a60892E95B1ABf60",
    converterAddress: "0xB8A38Ca13bEE727092adB375FE64F6c23DeCC738"
  },
  {
    anchorAddress: "0xa7774F9386E1653645E1A08fb7Aae525B4DeDb24",
    converterAddress: "0x79E71FfEaE3aE4Be517154839E518789628B6D83"
  },
  {
    anchorAddress: "0xB3c55930368D71F643C3775869aFC73f6c5237b2",
    converterAddress: "0xD856CBd87D4563C199bf3A1956817951b12b430b"
  },
  {
    anchorAddress: "0x904c7051D12aCE7d0107ada8702C0C759cad1672",
    converterAddress: "0x9b10206f236669F4f40E8e9806De9ab1813d3f65"
  },
  {
    anchorAddress: "0xee01b3AB5F6728adc137Be101d99c678938E6E72",
    converterAddress: "0xDA1791b3F4d7827cE834A68751B4C2F52ADC42e2"
  },
  {
    anchorAddress: "0xf95dd0Fc6DF64b2F149aFA9219579e0f850BCD4D",
    converterAddress: "0xb695449D12B73DFc61B2150B07c7D1c342ddfDB6"
  },
  {
    anchorAddress: "0x0F2318565f1996CB1eD2F88e172135791BC1FcBf",
    converterAddress: "0xdF71c1bA66647D8b0EB5437F5907abDfB439aCca"
  },
  {
    anchorAddress: "0xc4938292EA2d3085fFFc11C46B87CA068a83BE01",
    converterAddress: "0x0d57AD6818b6b34154d06355caa7d3729E4bAF06"
  },
  {
    anchorAddress: "0x79d83B390cF0EDF86B9EFbE47B556Cc6e20926aC",
    converterAddress: "0x16706f5561B88F4c80Ce9B35b2C02dFb0E22DD87"
  },
  {
    anchorAddress: "0x8DA321aB610cD24fB2bcCe191F423Dae7c327ca9",
    converterAddress: "0x0160AE697A3538668CDb4698d3B89C7F36AD990d"
  },
  {
    anchorAddress: "0xccB5E3Ba5356D57001976092795626ac3b87Ad4e",
    converterAddress: "0x11110198B3B4AD6184e0587B76B28F34d54F6150"
  },
  {
    anchorAddress: "0x9003411Ac4073C2D9f37af71d00E373B72Cbe9E2",
    converterAddress: "0xf4F99f9339Ba0Cbff65eb46cfa939e3C54231e33"
  },
  {
    anchorAddress: "0xd2Deb679ed81238CaeF8E0c32257092cEcc8888b",
    converterAddress: "0x247AC58CD31541c65B3AAa47E047745107D13873"
  },
  {
    anchorAddress: "0xCad4da66E00FDeCaBeC137a24E12Af8eDF303a1d",
    converterAddress: "0xdD7DE51c4F6FAF10Afce495f1Ef02E5Baa91379c"
  },
  {
    anchorAddress: "0xAE201360282C885bf3F2616A3145D1344a1e43c0",
    converterAddress: "0xb7289a9Bbfb5C28598C0b825214b2e1dc51c72Ee"
  },
  {
    anchorAddress: "0xE844E4EF529CB1A507D47206bEeF65a921B07287",
    converterAddress: "0xe18b18B6F5c07feF86cF0f1C9d0de7fD94869c24"
  },
  {
    anchorAddress: "0x497Ec0D6Ba2080f0ed7ecf7a79a2A907401b3239",
    converterAddress: "0xC04B5a4556d00Bca8eac5F5accA31981a6597409"
  },
  {
    anchorAddress: "0x064432E84F05094E3eD746A35ab9B7aB865fDa5C",
    converterAddress: "0xC4D88D7f9CCb1b4c24c0EDaA27BF662256B85E31"
  },
  {
    anchorAddress: "0xc9c3A465380bFaaC486C89ff7d5F60CC275D4E08",
    converterAddress: "0x3B42239a8bc2f07bb16b17578fE44fF2422C16F6"
  },
  {
    anchorAddress: "0xA6Ab3c8aE51962f4582db841dE6b0A092041461e",
    converterAddress: "0xE860f5ac349eB093236AA173F00E00dAB763944E"
  },
  {
    anchorAddress: "0x6a46f6DC570A1304a23f771c26b1802DFfcDAB0D",
    converterAddress: "0x4F88DFc8e1D7bA696Db158656457797cfBDfB844"
  },
  {
    anchorAddress: "0xd387CDAF85429b455f0F716D51Be33db2FC00463",
    converterAddress: "0xc11CcE040583640001f5a7E945DFd82f662cC0aE"
  },
  {
    anchorAddress: "0x275a1a2Dad3075bEb96AF4f7fD93ade99bB0151f",
    converterAddress: "0x5A9f1cD844cE91AAADAA03059677EeBCf3CF00df"
  },
  {
    anchorAddress: "0x73fa2B855be96AB3C73f375B8Ec777226eFA3845",
    converterAddress: "0xdd9B82c59aa260B2A834Ec67C472f43b40a2E6f1"
  },
  {
    anchorAddress: "0x0f9Be347378a37CED33A13AE061175AF07CC9868",
    converterAddress: "0x5caa37CBa585C216D39e3a02D8C0DFd4843cA5f9"
  },
  {
    anchorAddress: "0xA2020e324C365D05e87cf25552E6e6734260b089",
    converterAddress: "0x83473C806d1c0d26b15B93AC3F3FE86F6615B2db"
  },
  {
    anchorAddress: "0x737Ac585809C0F64Ee09d7B8050d195d14f14c55",
    converterAddress: "0x266036713c53Cadaa16F9D3328741A4Cf435230b"
  },
  {
    anchorAddress: "0xC803B2B2c3BA24C0C934AEB3Ba508A4dD6853F1b",
    converterAddress: "0x7E4b0AbAd3407b87a381c1C05aF78d7ad42975E7"
  },
  {
    anchorAddress: "0x8E00BacD7d8265d8F3f9d5B4fbd7F6B0B0c46f36",
    converterAddress: "0xf42305EA9d1527211EdA8Fb333FBf2668BFfd9E1"
  },
  {
    anchorAddress: "0x248AFFf1aa83cF860198ddeE14b5b3E8eDb46d47",
    converterAddress: "0x65003F30295d8622827e23953664D3C78671C01C"
  },
  {
    anchorAddress: "0xB79C3a1a2d50CC99459F3a21D709bCEC86656e97",
    converterAddress: "0x4aabAacc70A7c592e506e00515b9a9E6CD4C3Ef2"
  },
  {
    anchorAddress: "0xbAb15d72731Ea7031B10324806E7AaD8448896D5",
    converterAddress: "0x697134bF35238773bcb6aef16956D1417B562002"
  },
  {
    anchorAddress: "0xb3b2861a093B7FB19352bD62CD8EFC314e0641a7",
    converterAddress: "0xFbbAf86D76ef7C86f1Aea216242EF8e203A8Be7E"
  },
  {
    anchorAddress: "0x5a4deB5704C1891dF3575d3EecF9471DA7F61Fa4",
    converterAddress: "0xE3c7239BCcEe98B85a7D7Bc364490440067Afabf"
  },
  {
    anchorAddress: "0x8104E7ce81FaB39c42e34Cd9d8B654135261Fae8",
    converterAddress: "0x4D6DE557092f9742606e226860d6718281C9D241"
  },
  {
    anchorAddress: "0x2843F6c3b14e698e3D7562584959C61274F93328",
    converterAddress: "0xc964DE24878B04AFDF6A7df5E7956deCC665D4bE"
  },
  {
    anchorAddress: "0x168D7Bbf38E17941173a352f1352DF91a7771dF3",
    converterAddress: "0x0512f5D48D636369C0e86924E10A8BB24C8E129f"
  },
  {
    anchorAddress: "0xf7b9fa01098f22527Db205Ff9BB6FdF7C7D9F1C5",
    converterAddress: "0x6Bb5BbAe5B226E9c0e25FB2D92FD273fD3a70242"
  },
  {
    anchorAddress: "0x5039f60594Ffa3f1a5ACbe85E1eBe12Dc8Da7c5c",
    converterAddress: "0x635C9C9940D512bF5CB455706a28F9C7174d307f"
  },
  {
    anchorAddress: "0x258D1210e9E242FDc0Ecfa3b039A51a945CD0D0a",
    converterAddress: "0x73f73391e5F56Ce371A61fC3e18200A73d44Cf6f"
  },
  {
    anchorAddress: "0xd7eB9DB184DA9f099B84e2F86b1da1Fe6b305B3d",
    converterAddress: "0x2E948017C68F1FedC2496dDD4cc33A517D4e0168"
  },
  {
    anchorAddress: "0x26b5748F9253363f95e37767e9ed7986877A4B1b",
    converterAddress: "0x55d32d9ed854559Ca8759D528bcC648036544fAC"
  },
  {
    anchorAddress: "0xA9DE5935aE3eae8a7F943C9329940EDA160267f4",
    converterAddress: "0x6d1CEB4Fd5595c9773EB7FC79B0c090a380514DA"
  },
  {
    anchorAddress: "0x679F601F0deb53c2dB0C8C26369FDcba5fD753CF",
    converterAddress: "0x8bB76C5AE6b7D6bd1678510edD06444AcDf8F72B"
  },
  {
    anchorAddress: "0xd4c810fdcA379831078267f3402845E5205Aa0e1",
    converterAddress: "0xeB4F011A862A8EDB723FDb3b5d144D77dFb7fa5f"
  },
  {
    anchorAddress: "0x2948BD241243Bb6924A0b2f368233DDa525AAB05",
    converterAddress: "0xbE1DAF05Bf9e054b3e28b7E9C318819eF5dAcb58"
  },
  {
    anchorAddress: "0xd1BB51fECC950c7b1e4197D8d13A1d2A60795D2C",
    converterAddress: "0xf66EFba4dCDAB29d864b3134970C28bFcF653f3f"
  },
  {
    anchorAddress: "0x164A1229F4826C9dd70Ee3D9f4f3d7B68a172153",
    converterAddress: "0x3B0116363e435D9E4EF24ecA6282a21b7CC662df"
  },
  {
    anchorAddress: "0x849D49911cEF804bdB1FEC58150B8EabAB119796",
    converterAddress: "0x3167cc146d228C6977dCbadA380dF926b39865b1"
  },
  {
    anchorAddress: "0x2F2ad6954d99Ea14fA145B9AB0fb6BA5Ac32c0Ee",
    converterAddress: "0x72A38A55849b58FC2537b225a1ba3c4766316b0a"
  },
  {
    anchorAddress: "0xEB027349398De19D925DefC15c4302fE92FC69f9",
    converterAddress: "0x64846ff24B1AF06075efc44d7Fe9f1d5969f3275"
  },
  {
    anchorAddress: "0xa06cFAB8B584c91Df1aBee6e8503486AB4e23F40",
    converterAddress: "0x20d23C7A4b2Ea38f9Dc885bd25b1BC8c2601D44d"
  },
  {
    anchorAddress: "0xdD8a17169aa94E548602096EB9C9d44216cE8a37",
    converterAddress: "0x8658863984d116d4B3A0A5af45979eceAC8a62f1"
  },
  {
    anchorAddress: "0x1F593cDC35D7f0B0495dA16B631d28DE5AE25a07",
    converterAddress: "0x71168843b49E305E4d53dE158683903eF261B37f"
  },
  {
    anchorAddress: "0x80c222E38fb57F0710aF21128535096D90503285",
    converterAddress: "0xac4CcEB8Bb7bF4d9Ff6493cDf3F87fE349Ab1beC"
  },
  {
    anchorAddress: "0x4d849DaD08A4061bE102DBCA2CE2718A9a0b635a",
    converterAddress: "0x810C99C5De0A673E4bc86090f9bFE96a6D1B49a7"
  },
  {
    anchorAddress: "0x5972CED550248B17c9F674639D33E5446b6ad95A",
    converterAddress: "0x32d4fb837f41955b81556F74DAdB2C5b8a0D0989"
  },
  {
    anchorAddress: "0x0Ac0e122D09cC4DA4A96Cc2731D2b7cc1f8b025a",
    converterAddress: "0x2BeA21613B6c2C129d3F714c702008cDD3dD995B"
  },
  {
    anchorAddress: "0x014186b1a2d675fc1e303A3d62B574C3270A38e0",
    converterAddress: "0xACC03E1fD72CddC66C736cCe84626fbc63dd953B"
  },
  {
    anchorAddress: "0xB2Ea67533290fAd84e3fe2E1Fb68D21Ca062d7fc",
    converterAddress: "0x952EB7dC904F6f8b6b0Bc6c5c99d45143E743Cd7"
  },
  {
    anchorAddress: "0x25Bf8913D6296a69C7B43BC781614992cb218935",
    converterAddress: "0xE65c7e27C1c086f26CE0Daa986C3d9c24Ef3c2D8"
  },
  {
    anchorAddress: "0xf22FB05aC032fcAf3273f50aF8db2753888Bdd48",
    converterAddress: "0x9dB89726aE2683d21A71fF1417638E72e6D8C0d9"
  },
  {
    anchorAddress: "0x564c07255AFe5050D82c8816F78dA13f2B17ac6D",
    converterAddress: "0x0bFbfF3FC69BD69b258C480bCc65C4E0d75A5163"
  },
  {
    anchorAddress: "0x78AcF38ec85A9E4B2B88961b9D4BffbA04FdbA59",
    converterAddress: "0x32131848eDc60E032aBf0369241D34ec969EBf90"
  },
  {
    anchorAddress: "0x28291d74Bca9dE7cb6948A8E699651ed93832c50",
    converterAddress: "0xe27cf7324E6377bdDc48DB6BAC642839ffa9Bb36"
  },
  {
    anchorAddress: "0xFcEb45cF070B277fedE520c5539ae204Bc1D493E",
    converterAddress: "0xd361339550CD8B3e9446Bbb12AEA337785A7aea4"
  },
  {
    anchorAddress: "0x09953e3e5C6Be303D8D83Ccb672d241abc9BEe29",
    converterAddress: "0x150A46613a16B4256AcD227d00463BAa78B547Ec"
  },
  {
    anchorAddress: "0xa3b3c5a8b22C044D5f2d372f628245E2106D310D",
    converterAddress: "0x9C67411d318b65A83bd07c717F46B8bA26Ae469F"
  },
  {
    anchorAddress: "0x5cf2f6387c4F551316e1E422aCf1025a539825c3",
    converterAddress: "0x7834D96BD681e43740E6dA513638504174040010"
  },
  {
    anchorAddress: "0xAe0ceCc84bC1DDefe13C6e5B2E9D311927e45eD8",
    converterAddress: "0x8C73126b85f59d85Aa61391579B4C2710DD70f96"
  },
  {
    anchorAddress: "0xbb83a9Fe991BAA72F412F39af254EEbbfdc910BA",
    converterAddress: "0xBA2BE1Cd1F00470c21385B7cbED6211aeFAc0172"
  },
  {
    anchorAddress: "0x1B4D8c62DdF6947616a5FCda4Ca40A8715d2a4cb",
    converterAddress: "0x4f138e1CEeC7b33dfA4f3051594Ec016a08c7513"
  },
  {
    anchorAddress: "0xC4a01182ab1e502a1C1d17024e4924573CE001CC",
    converterAddress: "0x056e7916cdc2BC7414a903685938c707186D140D"
  },
  {
    anchorAddress: "0xEe769CE6B4E2C2A079c5f67081225Af7C89F874C",
    converterAddress: "0x1f67A92AA26CC0Ff6c62B6e284aaf57249fdEBB8"
  },
  {
    anchorAddress: "0x980B4118dAb781829DF80D7912d70B059a280DAd",
    converterAddress: "0x99F357f722EC3e456Af0eB530c1C14a3251305Ad"
  },
  {
    anchorAddress: "0x6e0E0B9aB5f8e5F5F2DE4D34FfE46668FFB37476",
    converterAddress: "0x0f1C029C5D7f626f6820bfe0F6a7B2Ac48746dDF"
  },
  {
    anchorAddress: "0x67563E7A0F13642068F6F999e48c690107A4571F",
    converterAddress: "0x7BAc8115f3789F4d7a3BFE241EB1bCb4D7F71665"
  },
  {
    anchorAddress: "0x2d5aDD875442023eC83718Bb03D866c9F4C6E8cE",
    converterAddress: "0x604989E3cb3f4e77c29C220182d75A99531aCF3A"
  },
  {
    anchorAddress: "0x60Be88DD72f03C91FB22EEF7Af24C2e99Db58530",
    converterAddress: "0xE0569fd1C3f0affD7E08131A16C06f3381C9355a"
  },
  {
    anchorAddress: "0xb5b0E0642d35D7Cab64CDa6EcF87Fd842cB5c58d",
    converterAddress: "0xb2841c6e6a9ef1D6fEAa25cCaA6c61CBd58CAa76"
  },
  {
    anchorAddress: "0xEab935f35693c3218b927436E63564018E92034f",
    converterAddress: "0x7B00EFba58CC6fdaB1c162a9C9528B935F5F1af7"
  },
  {
    anchorAddress: "0x7Ef1fEDb73BD089eC1010bABA26Ca162DFa08144",
    converterAddress: "0xBA8ecf0080ED377E04c2b6761154E8777538f2dC"
  },
  {
    anchorAddress: "0xFC0e04Eae452c163883AAAd4Ac1AE091Cc87FEf3",
    converterAddress: "0x0D86A7A059f316F81FcEF32495aAe41Cd0C80511"
  },
  {
    anchorAddress: "0xBB8436eaf49888641Df27e4E1DfFbd4851788209",
    converterAddress: "0x3a79e5B49c098aa9Ff95C7a504863090DC19fe97"
  },
  {
    anchorAddress: "0x38838B895cbf02048455Fb7f649D97C564fC18a8",
    converterAddress: "0x248b13d6d10C4102f72e79C04f87228aCe67fd3D"
  },
  {
    anchorAddress: "0x6feb9Be6c40A12276cFa6DAFbD119ea62532daaB",
    converterAddress: "0xdc59242010E2d29617Bfeec57E62c7C00a5ACb52"
  },
  {
    anchorAddress: "0x4319f9130848544afB97e92cb3Ea9fdb4b0A0B2a",
    converterAddress: "0x1a24501A0D53c5F6f36BcA34103fB250e498396d"
  },
  {
    anchorAddress: "0xf553E6eA4CE2F7dEEcbe7837E27931850eC15faB",
    converterAddress: "0x2131C84dA69b879Cb505BFd9aBaaAf5ec8b6e83b"
  },
  {
    anchorAddress: "0x607108c46bCE4cF6f86698E9B46E3270A734FeFe",
    converterAddress: "0xc0b6d74940601Af8a8E720a9974E95DdA88B41b8"
  },
  {
    anchorAddress: "0xE9ADced9da076D9dADA35F5b99970fDd58B1440D",
    converterAddress: "0x1229e2a0711660BE162521f5626C68E85Ec99c7f"
  },
  {
    anchorAddress: "0xb2F40825d32b658d39e4F73bB34D33BA628e8B76",
    converterAddress: "0x5039D9B575bD5722d310AF6D2fC11e053c6D03DA"
  },
  {
    anchorAddress: "0x8DCF1cA9f4716ef8e86A29f224237540f3c7ABad",
    converterAddress: "0xc32cb2b5c5ce8b6b2b6d459C7de2Ca3e6e36A4cf"
  },
  {
    anchorAddress: "0x140d47AeA2f10FfF26de4150971e600A2e010A81",
    converterAddress: "0x06ddD7AE02762382184F511C14609c3AE03BAf2a"
  },
  {
    anchorAddress: "0x0c485BffD5df019F66927B2C32360159884D4409",
    converterAddress: "0x79a373401BA7C9557475dA0Ec73368AD0B86fae4"
  },
  {
    anchorAddress: "0x19dB077A54dEa3fD4CBCd9d31D4dB297562CbD94",
    converterAddress: "0x24090349a627B3529F883A09A049F9bC3aD19479"
  },
  {
    anchorAddress: "0xf34484286be88613ad8399fe40f93506125be139",
    converterAddress: "0x2A432989CFbAE00e807Bd8Cb414B657F1B74E5c7"
  },
  {
    anchorAddress: "0x2E8d4EF4Cce1a5235311307b45EBEcF31eE7CA88",
    converterAddress: "0x92a497f0bcDEaa5345f6aA4a3357EE3cbe2E7226"
  },
  {
    anchorAddress: "0x654Ee2EAf2082c5483f2212ba7b6701F334a159f",
    converterAddress: "0x1c29f12d94AD2e6b5321Ce226b4550f83ce88fCA"
  },
  {
    anchorAddress: "0x4B51AcC819591c885DbA0F06d98A07b432E6D6B4",
    converterAddress: "0x6C96693580Caa51515FC7FE9AE7A088ccB8451a5"
  },
  {
    anchorAddress: "0x11223Ed5D5846603C4EfC7c451FD8EB596d592cF",
    converterAddress: "0xB7246144F53Ec44E0f845Fd0DEea85208acFC2C9"
  },
  {
    anchorAddress: "0xB67FA7330154878cF1Fd8F4b20bf1C19F68a3926",
    converterAddress: "0x4E2C46b4E86A17aD942B2Cd6F84302AeE4196A60"
  },
  {
    anchorAddress: "0xaB5ae72d95d3A02796c87F8079b1E180507dF54f",
    converterAddress: "0x90aDD3Bbfc664C0A07572F4F3Ef94f64200832e1"
  },
  {
    anchorAddress: "0xd6A6c879Ad8c01D0C8d5bF1C85829814b954DBBF",
    converterAddress: "0xBAC94DC2411F494c438cA667A4836e3DCCAA4920"
  },
  {
    anchorAddress: "0x3364ccAedE016F4C433B326d96bE1A2eafA60bdD",
    converterAddress: "0x5C03354cbaB446CA3Cb426513f11f684724636f7"
  },
  {
    anchorAddress: "0xFEE7EeaA0c2f3F7C7e6301751a8dE55cE4D059Ec",
    converterAddress: "0xD4c2BD3c4203A16266eced70a3F8cb4999a73E8f"
  },
  {
    anchorAddress: "0x43d3a0712eD544b26d85c9eaf841008369bAB5d1",
    converterAddress: "0xb61b3FE730Fb58936f06239feA2FEEd5B3256F50"
  },
  {
    anchorAddress: "0xb93Cc8642f5e8644423Aa7305da96FFF75708228",
    converterAddress: "0x6b2c2db78Fc5F1f0A7a7a6d91d26922850A9C693"
  },
  {
    anchorAddress: "0x2788C2dB0fBdbaee39Fa010D325d55e7e4527e0d",
    converterAddress: "0x8bd7448162C296A5bB3F0B9cCDEe383f5b899C93"
  },
  {
    anchorAddress: "0x19683E94943E6b348D8AFB98C128B9b549B400DF",
    converterAddress: "0xbDC7310289dCd30D16E284d6F207a8E2F76A37aD"
  },
  {
    anchorAddress: "0x334C36Be5b1EaF0C4b61dDEa202c9f6Dc2640FE5",
    converterAddress: "0x1e45Ff6C529DD038E75767779D12b7981311B8Df"
  },
  {
    anchorAddress: "0xd1146B08e8104EeDBa44a73B7bda1d102c6ceDC9",
    converterAddress: "0xE03374cAcf4600F56BDDbDC82c07b375f318fc5C"
  },
  {
    anchorAddress: "0x9921f8F53EE185a6BFD5d9D8935107934D0B07DA",
    converterAddress: "0x70e6f05ae2F61562FAb7115DdD387b83B28564de"
  },
  {
    anchorAddress: "0xE729024679C29c2660E05727ECAfd3D8792b8111",
    converterAddress: "0x0dA9706F366C915D3769F7Ae9737Ef77c7741715"
  },
  {
    anchorAddress: "0x6F60D44A0d6fB95E037A099F8642f949c959a363",
    converterAddress: "0x6aD9C98E25D8E8292514ef108043278eeC34a27b"
  },
  {
    anchorAddress: "0x71c414DaCe65ABff9351E215d25f17F675241c0A",
    converterAddress: "0x868229B43a8BCBDFfb244DDE874f52Ade0B1c132"
  },
  {
    anchorAddress: "0x07009A1F62dd238c7167e4D9BC3C5b28B6Fe5a96",
    converterAddress: "0x7d9B4031290FDD0D48468CefD54a1E34090dC36C"
  },
  {
    anchorAddress: "0x1a3c6768e200482F5f47D1BE77B7255aBCAe4Fe2",
    converterAddress: "0xF4736618F2782b662304b7340084a6Bc6DDb5C2c"
  },
  {
    anchorAddress: "0x29dF79CB535f1fe82cA65d52cB8B5EE82D7E98a6",
    converterAddress: "0x2A1eAa24Ec7fF662157Bc8345a3e41cFdCE1Fdbe"
  },
  {
    anchorAddress: "0x9B6678c766003aD69A15f795f433C0F62c10D4d5",
    converterAddress: "0xc89bC9cBB8237C58587b5F907ed6B3163BFDD1B9"
  },
  {
    anchorAddress: "0xAb0C9850BaACF24eFA368b57C2822Ce73b60794c",
    converterAddress: "0xe037d37898E6f6fFE8AcE3Eb93cD0F78FF107A8e"
  },
  {
    anchorAddress: "0x06cd5923593a359111cDec66E74c62E831C8aEab",
    converterAddress: "0x3a8CC07F17Eb10E628c74B1a442c7ADC2BfD854D"
  },
  {
    anchorAddress: "0x1EF9e0ac29b3813528FbfdAdf5118AB63e4be015",
    converterAddress: "0xE04c8aecb58BC3C918aeDAc958224a632529926e"
  },
  {
    anchorAddress: "0xcb913ED43e43cc7Cec1D77243bA381615101E7E4",
    converterAddress: "0x06f7Bf937Dec0C413a2E0464Bb300C4d464bb891"
  },
  {
    anchorAddress: "0x42529f410f0a72599Fff2c67DD2a63CFfBcc3f91",
    converterAddress: "0xF02182DA935b810CDD3B5c92F324C16FC0413c3B"
  },
  {
    anchorAddress: "0x5E761d4529ae69996cb42E09707f9D1D29F047d6",
    converterAddress: "0x8F4789889CAe9227114fF4891Dc77a75379773C0"
  },
  {
    anchorAddress: "0x6534d2A69c2C7774DF42A55A1678bD008984B324",
    converterAddress: "0x2B4f0AD32a8aC2075648A054D6082727e21eD053"
  },
  {
    anchorAddress: "0xcaB1F46A73Aa6096707f5EF6Edc4C1dfE991f981",
    converterAddress: "0x6C69454b0ED9196Fa71cB514e7C3b49aC149eC4B"
  },
  {
    anchorAddress: "0xD69AE1D715d7451646107D43777139B0a42d7c63",
    converterAddress: "0x96772082615Fb019E91877653503EB6Ef1E65Aea"
  },
  {
    anchorAddress: "0x515d562496C43487eb2DDce1a2A7721148D44E36",
    converterAddress: "0x97Cf22539646d5a264Fb3FBb68bb0642D8AD2a66"
  },
  {
    anchorAddress: "0xEfec901ff0a33d0eF4f8068CDd8b28Fdc40aa556",
    converterAddress: "0xc3b1928A01aC03F8353d05196AfcA778ab9970f7"
  },
  {
    anchorAddress: "0x069D653038DB2F9d84e9620Be140B3D404a40258",
    converterAddress: "0x604F88101146b397c31dc4051C5F290f48a5862f"
  },
  {
    anchorAddress: "0xa88Fd7560efc654d86cF3728785f94a8Bc48BDAe",
    converterAddress: "0xD5aA38C6Df168741839F9E1e9c51e6d24b986970"
  },
  {
    anchorAddress: "0xAeBfeA5ce20af9fA2c65fb62863b31A90b7e056b",
    converterAddress: "0xE638A52dDAd3fa31233152C17422E3312A3f6643"
  },
  {
    anchorAddress: "0xc32BF4a12542E897BADbFf2B61e56c82eAe73d69",
    converterAddress: "0x81708ECf0ABB950100cd482d2843E1146fa778A4"
  },
  {
    anchorAddress: "0x7FfE011B93e06FA14CE5A6E00320937652664366",
    converterAddress: "0xD6DD7d29EcAB65D092942d42c4F360Fde41693Dc"
  },
  {
    anchorAddress: "0x0bA204702F102aD3B0156164754e8af18C24C49C",
    converterAddress: "0xabD0dDC9143972E4eA9A816821bfba8204122E6E"
  },
  {
    anchorAddress: "0x7F8c53072d9B809A108b1A9D677Bcc3B7B3F844e",
    converterAddress: "0x6bA3e97Dee101Edacc3b58ED59273693aCB4c79e"
  },
  {
    anchorAddress: "0x075561230DB23aa3B86ABE8AFE8bbc4eCDdf1C5A",
    converterAddress: "0x29f6Ae0f0c85b472Dc792CeF36e5690E1d3f7255"
  },
  {
    anchorAddress: "0xdf4971E3F52f5828C72A0512d560F54bFB2B2692",
    converterAddress: "0x296089F31af0648C1B0eFE1234527F85CDbC071C"
  },
  {
    anchorAddress: "0x28271853E950bE371B050F3f93aA0146225bF374",
    converterAddress: "0x73B9081946021Dc6B9cE3E335A11A6A5BB2879fE"
  },
  {
    anchorAddress: "0xE35a57AC913144AEf6a4b179634D343466DE3Cc3",
    converterAddress: "0x27004767B074C36092e98886c8D4781a14c3CF3b"
  },
  {
    anchorAddress: "0x7484867773Bc6f3110f710577d36A3605DBa59DF",
    converterAddress: "0x53106713B160C41634D78A9D5E15D252CCf03d0C"
  },
  {
    anchorAddress: "0xd8aB826b6D69f5E4Fa1325A5236491a309FBFF4f",
    converterAddress: "0x24844e100ab6cB505C4a195b4a9B610B02518fD4"
  },
  {
    anchorAddress: "0x4827e558e642861Cd7a1C8f011b2B4661F8d51fa",
    converterAddress: "0x66540A3fcD929774a8dab59d56fE7A2D3538450F"
  },
  {
    anchorAddress: "0x18D8001D1Da44fE96f442f5980e08D2Ab4e19594",
    converterAddress: "0x29e44d82303c4F9417B3A6E2e0f61314eAE84375"
  },
  {
    anchorAddress: "0x27b099CF19227Ef7488D60a441d7eA2CC7FDDb25",
    converterAddress: "0xE2AE92c64bfEFeC1Ef884071a7E7857d285c18D7"
  },
  {
    anchorAddress: "0xEc7558322f0DF8719c805b39583b6Fd5ca6c9E30",
    converterAddress: "0xe8cA7bbcAA9513638b0943664c99AEE16c1B290F"
  },
  {
    anchorAddress: "0xca186FacC9e927e0c2ddBbd31b16eE41057edDB2",
    converterAddress: "0xF9da2Fa63295bb991b56D38514D9E69B3C21699b"
  },
  {
    anchorAddress: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
    converterAddress: "0x99B4C9Eeae0b5D868Fc3B5e833A59Fef3e8FDab1"
  },
  {
    anchorAddress: "0x006BeA43Baa3f7A6f765F14f10A1a1b08334EF45",
    converterAddress: "0x4886D62cB84E24dD007DbD1f24f62591Fe2c7D8a"
  },
  {
    anchorAddress: "0x5afD005056d4b47EBFE31f4B4d33FD8C9Abf1817",
    converterAddress: "0xdcdc214997bb0E069057D8F7590BA9f1E7390498"
  },
  {
    anchorAddress: "0xbC5fe988433B97cDB1a578531c5380e8EC3242b1",
    converterAddress: "0xCdde64592624Ed922e895f172CDaAaBa78891937"
  },
  {
    anchorAddress: "0x323e4d8097B0A58aB8210AC6efCC4a89285cFc6B",
    converterAddress: "0xa6Bc8b07507bbEB13e21B82067a07802da8aEFBF"
  },
  {
    anchorAddress: "0x0D6777BFc95b284eA9246c889E99903641129D72",
    converterAddress: "0xe1087bf96bE2336a2b6B09F6e33636df0d4CF680"
  },
  {
    anchorAddress: "0x536545f6B120C2fD099370334097b35bB2403BC3",
    converterAddress: "0x0216E9D74BD5BdA4C415778d854464A8d4a0efaB"
  },
  {
    anchorAddress: "0x7694298e99aedC4E37F855A8661B47d505Ce1b37",
    converterAddress: "0xE2ac1898e44a3Be16F823d2b1203E6e3B1407B37"
  },
  {
    anchorAddress: "0xb1A5b7e9a268742B9B5D2455fFcf43BaBC6929bA",
    converterAddress: "0xB4b74425B15B18Cb20956ec16BB1b349F661E67e"
  },
  {
    anchorAddress: "0x846f7a6dE1eFbd7617760eBe1B89aa8CA2094025",
    converterAddress: "0xAc0763a04Ce3b9F00839288E9705076209E9E067"
  },
  {
    anchorAddress: "0xb83546551C9d4F6D7873804a7352FA930404260d",
    converterAddress: "0x4848b295326d49De8F83bD6663B8Cb091a730B06"
  },
  {
    anchorAddress: "0x34902D61c3f8D8809A8a2481C36DC514BEBA5cE8",
    converterAddress: "0x999053a876e4080c682Cfb86a1b2382d8DfCA517"
  },
  {
    anchorAddress: "0xF0F9bbd5eBc79d7cAD9d35564Ef45aDcD802611e",
    converterAddress: "0x86A43a57Cc762472B01d50009C4ED7C1cCD77C28"
  },
  {
    anchorAddress: "0x0B21617eD9b15fd901e0b36b8eDF9d68aDc11Ad5",
    converterAddress: "0x753B73e51c7414F1ff1A10EC5f55aafD1787Ce50"
  },
  {
    anchorAddress: "0x3A946bb329f78CCBc75d836136De3a472Bdf5499",
    converterAddress: "0xFF116e5b56a8FEb357fDb63c9Fe9b3d67Ba14B7F"
  },
  {
    anchorAddress: "0x6B09B01c19E4bD573eae4e235ee47CBD51dF3B6E",
    converterAddress: "0x1F60750F009745Bf0e139813C3786D10e744b50D"
  },
  {
    anchorAddress: "0xEEF7551e59b34F431D71C7593249F61D5c52ce65",
    converterAddress: "0x43C552eB8669D60929CE3D41f4632FE3b6CB79F2"
  },
  {
    anchorAddress: "0xb2D679F6D676f173fAF3670a074B2C3A6D7Ebe28",
    converterAddress: "0xDA1e8397d4ABBAd40de926e24c7BaFd851386D0a"
  },
  {
    anchorAddress: "0xd16a3A892695ec9a47EFFdD5247980a8d2be3fF2",
    converterAddress: "0x55baD7CDDe403872E1A4EAB787F67177A41aA716"
  },
  {
    anchorAddress: "0x290bd3a8F785a8dB30a0F6Baf9B88863b831747F",
    converterAddress: "0xc4bf6Dc46537AA77428CD87cFe57D817e76285A2"
  },
  {
    anchorAddress: "0xa7e21e7584fc6fDf6Fa978a5d4981352B0260954",
    converterAddress: "0xcFd79b484f33c8098E2fd279729BEcC1c53a362f"
  },
  {
    anchorAddress: "0x6f8BeaDF9eCd851be239b616149aF3E69D49ce11",
    converterAddress: "0xd79Bd02053287a2a635B09b63136806D174d51a5"
  },
  {
    anchorAddress: "0x437F7d93540094Da58F337644ba7D6E5Ad823564",
    converterAddress: "0xE1437F404451A00A9C555000b6f3cBA2480291c8"
  },
  {
    anchorAddress: "0xE5Df055773Bf9710053923599504831c7DBdD697",
    converterAddress: "0x615FED2B7A84537E729D3dd32dE150bF0253fF10"
  },
  {
    anchorAddress: "0x1344381f0e93a2A1Ab0BFd2fE209a9BD01343933",
    converterAddress: "0x62aeE73B82Cc64dd3c65ac220838210556C5c897"
  },
  {
    anchorAddress: "0x1F6e51ce0533A075fDd602FbD6159763aCaB579b",
    converterAddress: "0xfDC38F68177634317146431E834F0838D4d0DFD3"
  },
  {
    anchorAddress: "0x04A3030c94Fb2dBE2b898d8cBf6Fd1c656FA69dd",
    converterAddress: "0xe8b06d938a863bb2c82644125d7714844b8A98a4"
  },
  {
    anchorAddress: "0x782E07B7Bbf908135D083c4f65459f8F1549a415",
    converterAddress: "0x3cd2ea665e45310d4a7baf0b8a378793691d49AA"
  },
  {
    anchorAddress: "0x0F92330EAaBa84CB54b068F4331Cc40Dd2A98236",
    converterAddress: "0x66437A8E8D98ee27B5F5B99aB7835b6A887d191b"
  },
  {
    anchorAddress: "0xE355dcF475ff7569B8b74d5165a532ABa87c25bf",
    converterAddress: "0x8e11504d39dfc576a78cAC7FF835Bf9dcBb2453F"
  },
  {
    anchorAddress: "0x534DF0Ec6D65cD6fE1b05D3b8c935c97Eb844190",
    converterAddress: "0x850e6fDc53816Fb32d6A1B45aFD95e9e6420F9d7"
  },
  {
    anchorAddress: "0x0aacA86e54Fe70eDd7c86cBF3cFb470caA49FAeF",
    converterAddress: "0x6cba561bB35919597531d9cF6720A48867fdA8c9"
  },
  {
    anchorAddress: "0x488E99fbCF49BFfC94cCae3B8eaCDd2Bd9aC981C",
    converterAddress: "0xbB98e2d06B2AcD3E2E4694088B8B5A0014e222cD"
  },
  {
    anchorAddress: "0xFA3Bba432c0499c091F821aEB22FC36c4F8c78e3",
    converterAddress: "0x7D86d4d01DD72Db066655D38C1de0006c5B2224f"
  },
  {
    anchorAddress: "0x16EAcd526799C244CcBD8501422F542aAB07aAD4",
    converterAddress: "0x92826145C76D7808BA6a5eA1f8f5D491dfE440b5"
  },
  {
    anchorAddress: "0x4EB61146e9Ad2a9D395956eF410EBaF7459f4622",
    converterAddress: "0x4b536A64f25f2070B5ACe6d79f6CeFf0D9Be4DC1"
  },
  {
    anchorAddress: "0x368B3D50E51e8bf62E6C73fc389e4102B9aEB8e2",
    converterAddress: "0xa4FfBDc5B0F5e61537c0F43FAD28Cf45E94BdE43"
  },
  {
    anchorAddress: "0x91AFdd8EF36DEf4fa2B9d7A05420f9D0E4F775d1",
    converterAddress: "0xC9A722be71Ac8B1Faa00c995e6d47835C933DAd6"
  },
  {
    anchorAddress: "0x31633C7c4f3FD374d187da5c19BBdb41DBdDdc86",
    converterAddress: "0x4C10E60953C77d20dCC69E2462D794f14718adE6"
  },
  {
    anchorAddress: "0xDdde5DBa82B92DAF339fBB4cF1ec4d1CEC503075",
    converterAddress: "0x2727Da5FB75aA61876aD90Ec09c031C01919176B"
  },
  {
    anchorAddress: "0xEE4dC4C5Ca843B83035d8E5159AC1bd1b4EbdfF5",
    converterAddress: "0x7754717cDA23EfF9E0962a10E9Bb5B95aD2f4cdB"
  },
  {
    anchorAddress: "0x58239b5529198E0ad76975Bab0842367A4Cc7D5b",
    converterAddress: "0x4571c9937B2CB289c099C4e8daED68827D69f3A2"
  },
  {
    anchorAddress: "0x5a602561342F74D161E64796613D7528Dd0993C1",
    converterAddress: "0xa239EA1E43fCeAb1246eD819c88AC714B3c466aE"
  },
  {
    anchorAddress: "0xFD556AB5010A4076fee1A232117E4ef549A84032",
    converterAddress: "0x971E89e5202e2E4d4cB16Bc89F742D151931559d"
  },
  {
    anchorAddress: "0x94A2aAA374A8F2D52dad24330C8a0Ec2934700ae",
    converterAddress: "0xD4e88E23399b8cFCaF89CE5BEeD029D13513e6A5"
  },
  {
    anchorAddress: "0x653F1FFC243D7B6F4ca65Df9520A80D0113dA3d6",
    converterAddress: "0xF8e14A1189ddFa7c1d2F3a4DE905935d420e9e70"
  },
  {
    anchorAddress: "0x2f4EF142cd9983B1f86dF21BEd3cE12E06856dCb",
    converterAddress: "0x6769c5309967Ccf6b5E5eB340089fBE7957397d1"
  },
  {
    anchorAddress: "0x37Be876EF051eB8EDdD0745107c5222D8CA8EC60",
    converterAddress: "0x18d76D2d0a624AB973F1C98e8916aa45253b115c"
  },
  {
    anchorAddress: "0x7651021390129c9c2672f47292C31b33f63EE5Cc",
    converterAddress: "0xA64906C4434211ce9f3Ac2702D5f60b21EB02E74"
  },
  {
    anchorAddress: "0x10ef8f03cd0F3D7Bc14A04ba2C173414aA8C5E7E",
    converterAddress: "0x274b4b35eE47622016d94b7eD14460de00AA504A"
  },
  {
    anchorAddress: "0xB9fe4BD869a132137B668054ea48C897c0654ee4",
    converterAddress: "0xf462769d8C7f31A07d1636D9d492c0E592D804f4"
  },
  {
    anchorAddress: "0x2a3a6596B35735EfaC3577dC36bF750bfe5888e8",
    converterAddress: "0x554A544F2A21e5E13E42de5BCdDca6962ec2a478"
  },
  {
    anchorAddress: "0x83Ee8ec605C0aE3D7F1c9e360aB45A6C1C033Ab9",
    converterAddress: "0xfb64059D18BbfDc5EEdCc6e65C9F09de8ccAf5b6"
  },
  {
    anchorAddress: "0x9ceE7038Fc154D92d009c2Dd8ac083b557495713",
    converterAddress: "0xB485A5F793B1DEadA32783F99Fdccce9f28aB9a2"
  },
  {
    anchorAddress: "0x452821f74Ab9d38EDD3145C59280aC1bCBCe9B81",
    converterAddress: "0x121A7b80D7E73dbe928f783d4009074063bF659D"
  },
  {
    anchorAddress: "0x111252C5A7fb75d541071753bd1fAAf367d0321F",
    converterAddress: "0xd6562db5451534f9422c0b582bE48D2E0A37A919"
  },
  {
    anchorAddress: "0xbaD59113679717e0a9D5324d289DA6c5Fa8862E2",
    converterAddress: "0x444Bd9a308Bd2137208ABBcc3efF679A90d7A553"
  },
  {
    anchorAddress: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
    converterAddress: "0xC37E82FF3A6a9C41779C5801408755776Ce555Aa"
  },
  {
    anchorAddress: "0x482c31355F4f7966fFcD38eC5c9635ACAe5F4D4F",
    converterAddress: "0x5C8c7Ef16DaC7596C280E70C6905432F7470965E"
  },
  {
    anchorAddress: "0xE7845A9679dAd2B1cCCe49d5F0239d1c528f7A40",
    converterAddress: "0x40c7998B5d94e00Cd675eDB3eFf4888404f6385F"
  },
  {
    anchorAddress: "0xD86f489a495426B1847dBd4b5D85f4832E6D7225",
    converterAddress: "0x05e770141538e82C04a374bc11DA9B54fB50d28F"
  },
  {
    anchorAddress: "0xdB7B2616210Bd0068D914eEB7E31aFD2Da517444",
    converterAddress: "0x0429e43f488D2D24BB608EFbb0Ee3e646D61dE71"
  },
  {
    anchorAddress: "0xc570Bae3772b618a981c4A5AaD51bc3e222E7A3B",
    converterAddress: "0x7FF01DB7ae23b97B15Bc06f49C45d6e3d84df46f"
  },
  {
    anchorAddress: "0xC1a01Cc1F147A1a7e35E8caBFDe80706E76522dE",
    converterAddress: "0x16ff969cC3A4AE925D9C0A2851e2386d61E75954"
  },
  {
    anchorAddress: "0x623FA86c0e010Fe4701cEDF294C9cddb8f4F26e6",
    converterAddress: "0x72eC2FF62Eda1D5E9AcD6c4f6a016F0998ba1cB0"
  },
  {
    anchorAddress: "0x5094841D5eE018a5E29E23055aFC263093f95a3E",
    converterAddress: "0xcAf6Eb14c3A20B157439904a88F00a8bE929c887"
  },
  {
    anchorAddress: "0xE421EA0DB7A0B5bebB4b9b258D864a68546c0881",
    converterAddress: "0x1a7eC550f463138f283C542D755cc28c5b6E26C3"
  },
  {
    anchorAddress: "0xb381D21c09BaC7278b6802193167A2a01127b976",
    converterAddress: "0xdf6b463F27bE26110c20C1e3BDE480bD5Fc057d9"
  },
  {
    anchorAddress: "0x50eA977Abd2e622241d5074fa15B97eB823B3ED5",
    converterAddress: "0x5C1E2F8320Bfe3a5558B4eB529c823c3bB468C18"
  },
  {
    anchorAddress: "0x325732Fd6d9b98f60acFb6215eDe90B9F9bAD38a",
    converterAddress: "0x63CBbfB48B5cC9ea4B87b1B6A3a6abD70DD8A9eC"
  },
  {
    anchorAddress: "0x9DB9CcFC66e5caCdEf842c2F04fCD7d31C3fA137",
    converterAddress: "0x53E9c0Ee79Ab9Ccb46939685E1E62245Adf90Cba"
  },
  {
    anchorAddress: "0xb2aFA773c749F988B82CAb56284d0F1b01c7E2dC",
    converterAddress: "0x6e7646C7c4D4cf22d24FBAf990Cdc2C62aA1A7F5"
  },
  {
    anchorAddress: "0x500f3e107A6d62bb15394892a22495ACF71D007F",
    converterAddress: "0x7aA2b23eA10c4E8C778F60a93D1c25780DB14075"
  },
  {
    anchorAddress: "0xC42a9e06cEBF12AE96b11f8BAE9aCC3d6b016237",
    converterAddress: "0xA6CC5967be74A2b959D18469eBfb54ED317bC4B3"
  },
  {
    anchorAddress: "0x23736A2c9728C309039831c245754E19cEd07546",
    converterAddress: "0x1168d7C63ffa5baa167004f2b81b7f7104b4101C"
  },
  {
    anchorAddress: "0x992EcEA6bEf983168Fcb264C8b2C9A15E274e02F",
    converterAddress: "0x8863fE594289c281Aa385029904EE4575c775587"
  },
  {
    anchorAddress: "0xa8E7117ac5d76fC147B71524780327AA218B5612",
    converterAddress: "0x05840ca15Bef62b48FD2248CB688860C8A69aDff"
  },
  {
    anchorAddress: "0x5365B5BC56493F08A38E5Eb08E36cBbe6fcC8306",
    converterAddress: "0xA2C1dE568B70BC8b3565F1240D43b6949Bfe183A"
  },
  {
    anchorAddress: "0xF2ff22976B973d6bcC17a7dC93B719162ADA2045",
    converterAddress: "0x39e5AAE547752c1239b4738e75cDF705c25adeA6"
  },
  {
    anchorAddress: "0x1F5350558F1E3e8Bf370d4d552F3ebC785bf2979",
    converterAddress: "0xEF8c6c64926A9548210adDC22e8ed6034E39b0Da"
  },
  {
    anchorAddress: "0xc83300a16de6518Dd0Be5ad656F3d6f197A30692",
    converterAddress: "0x7fF10d4AdD8c9c2F5E47798cD60544Ad91c1F4eC"
  },
  {
    anchorAddress: "0x09C5188d9fE33d218Cc186baE8F985907b25eBEe",
    converterAddress: "0x99e8e0e3D4cd50f856f675567FeC8eb732CfE2d7"
  },
  {
    anchorAddress: "0xf001bC665ffac52c6a969305c3BDaaf88DE4bBC8",
    converterAddress: "0x6DAE0133395AeC73B122fF010Ce85b78209310C2"
  },
  {
    anchorAddress: "0xb47Bd84C954Fa597B40fe41D4e116fb0eF2468bb",
    converterAddress: "0x81b4bd459f3f73433222D7E5439E3640A4BF4B5B"
  },
  {
    anchorAddress: "0x01697e379E6B2dA6A6D052BAa09F98488433e167",
    converterAddress: "0x86412aef21A2BB0BE5ac7bd98C7375d655e30420"
  },
  {
    anchorAddress: "0x1f3fb50488124EB0d5Cf0d2b22CA7c8ed00e2344",
    converterAddress: "0x8f22D68c4F39d750A53fD51F4D8A03d8A2F25b03"
  },
  {
    anchorAddress: "0x2f005Cc29267f3B57E643B01575ec81789947142",
    converterAddress: "0x7fC1f8F9D20f8940BAE62A594ed5f4B3A4568f1C"
  },
  {
    anchorAddress: "0x7a553617592d5b67Ef4D8B9aa67aa2A539463900",
    converterAddress: "0x1393D065DF58ddb7874c280bb2D11a5e1e9eE96f"
  },
  {
    anchorAddress: "0x9E7749E446572842C7c0E1B76b673e9D1332db11",
    converterAddress: "0x29FE708D175C2Bc416139bA0272ADf975fE6d418"
  },
  {
    anchorAddress: "0x7482326Eb7E44Aec1269C052B9B1aF26606b0B90",
    converterAddress: "0x9f860A2C3786074e37fA2ab03B245A97E0e1F43E"
  },
  {
    anchorAddress: "0x3b8c8147325C378cfe10f7b8c3aB1683D300dF27",
    converterAddress: "0xA6cA935241a3EbCb0156C178103aa4827280f886"
  },
  {
    anchorAddress: "0x3E22d87977dA52Accef2Af9Eb50f76bd31b7b6B1",
    converterAddress: "0x15C6aC6Fc9d4179D9b799e709C1AfD726bA97418"
  },
  {
    anchorAddress: "0x44Fa59B2F044367f9F027b7694fD3BacbF22c3d5",
    converterAddress: "0x9fd87e582BF14aB33121BD92274aa0bA4A62b4E2"
  },
  {
    anchorAddress: "0x7b86306D72103Ccd5405DF9dBFf4B794C46EBbC9",
    converterAddress: "0x485e61D9549b65AbDb1EAbD15Cc30A1aB00f6cAF"
  },
  {
    anchorAddress: "0xE39c4Ae17C0d44e923B784794B3Ea419c04F02FA",
    converterAddress: "0x9b730363cFff06Ca6E976f8c549d1B6764ba021C"
  },
  {
    anchorAddress: "0xA31BF9E52B92ABF37D1d126ad2D9a6d0Ce9637f0",
    converterAddress: "0x70B4a71Ad893C2E775Cecd8855E7c6F95fB5af21"
  },
  {
    anchorAddress: "0xED8562cf805936AFdd2A405e7ACe80f78efc4Ed5",
    converterAddress: "0x303D1F3ff37A878d4023702be8d70a82A49D74Eb"
  },
  {
    anchorAddress: "0xB4c5BC0d1d41F3440c580A0F52B6641E4A913Df4",
    converterAddress: "0x7deb97229DBF5aaC741C62b36E8dde9F541F9CC1"
  },
  {
    anchorAddress: "0x8e7970eca4be7F186A5D7acdc8dcF778EA26Ee9b",
    converterAddress: "0x40280D2A19a52E064DF1Cc68F8d4f77856FD6A71"
  },
  {
    anchorAddress: "0xe783E81cf1b5bf475aDB76e41a2AB996c6e2ae50",
    converterAddress: "0xcD4B9ef178394B92b90cFD076FDf8C024461ca13"
  },
  {
    anchorAddress: "0xB3aF30c0c1a9673E14c9B0C56eCd4cBBeB0F6c48",
    converterAddress: "0xAe46E888aF6318aED82FE715b1b98b78F74e7b65"
  },
  {
    anchorAddress: "0x66948fEFCcc464c714574a884c0458981Cbd944C",
    converterAddress: "0xBDfFd4Fa6Fd5C8D3B9AbD81C9f7b71681A96763e"
  },
  {
    anchorAddress: "0xa09B58ECeFA3a5d3736Ba9E2E002ca566Adf08eb",
    converterAddress: "0xEcC601451e84Ea5eFb61e60A3e4e7BbC56E69b79"
  },
  {
    anchorAddress: "0x5A576922849dF442f1Dc0c3bA7b3c345EdB2bd44",
    converterAddress: "0x17A0edF4E67ED4C7FF3A3D06E0aAF7f38A3537D6"
  },
  {
    anchorAddress: "0xD6bF84B5D6F4d1288C39f2486688e949B1423E62",
    converterAddress: "0x834d0Af9a86431F3a366f20320c332E95E822E1a"
  },
  {
    anchorAddress: "0x04D0231162b4784b706908c787CE32bD075db9b7",
    converterAddress: "0xc314527CA3329bEDb35b3ec2657a5Bb2a0b01A83"
  },
  {
    anchorAddress: "0xF5A203E16ab9B850b27f1F00C37352b6b7A28339",
    converterAddress: "0xcCD95D042C598fB4AD544dF2b47D6C749d99A83a"
  },
  {
    anchorAddress: "0x8151E0Fbbc10Af5b0F16B413dB0747169e9687d9",
    converterAddress: "0x38894871b6beEF3fc18C3de6cF66d8252D65B49C"
  },
  {
    anchorAddress: "0xff2CCF332A2d6CD645f93c19690104B99943b13D",
    converterAddress: "0xa8BaE685a9213a27bC82ef782d1ba40964497dB1"
  },
  {
    anchorAddress: "0x3035529E7aE11A3660134c9C875F4faa6514d042",
    converterAddress: "0x1051f6DD42407908372Ba241206EBD33091b1BC5"
  },
  {
    anchorAddress: "0xCDfF066eDf8a770E9b6A7aE12F7CFD3DbA0011B5",
    converterAddress: "0xE9275ab4689B15C4E00de8F9c5e03e00358FC7Ab"
  },
  {
    anchorAddress: "0xb5faf55A4bD812a918c68F629A00d8F9750a2C4d",
    converterAddress: "0x9d614e61Fda55cdd10d6e73C333E23E41E2B37e2"
  },
  {
    anchorAddress: "0x6b181C478b315bE3f9E99c57CE926436c32e17a7",
    converterAddress: "0xAcba46e8654Bc8c55dd0CBDaF22b5e30036fAced"
  },
  {
    anchorAddress: "0xb479b102bF135bdC666d6916172422CbaD9E977f",
    converterAddress: "0xd1A758f84BF6762bdF6F795a9DdeE35eB0597ee4"
  },
  {
    anchorAddress: "0x986D522a4f9fd0b4158A88657a06A552f83C3e27",
    converterAddress: "0xB7588B165Cc8F51177Df4902Cd7839052B8c49b2"
  },
  {
    anchorAddress: "0x7d402c5CF587D4dEC6761C51E0aA903956495851",
    converterAddress: "0x7beDCB884146D1D8422E4cE56E7CeE62799A9f84"
  },
  {
    anchorAddress: "0x63bc130401dc9f7F70203B01D1875d0D2779dc96",
    converterAddress: "0xb39c206ec37B1aBCE8602c4f5EaafA99D3c10DDD"
  },
  {
    anchorAddress: "0xAdAA88CA9913f2d6F8Caa0616Ff01eE8D4223fde",
    converterAddress: "0xB2E1f4E30ceF322ac7a8E612AE2217ED00F7962A"
  },
  {
    anchorAddress: "0x6cfd8b295D64d84178ad7447a5Bb4488bC846005",
    converterAddress: "0x3BAbeA45ef298aD4935090365b7F8997F478a9dd"
  },
  {
    anchorAddress: "0x5062743A788D271FA247C3dA7Cd5af73Fd687BA8",
    converterAddress: "0x8D30d8184F0469C8a28a753fBf52CadeCE748110"
  },
  {
    anchorAddress: "0xd2C9F2A62f9a1e80cD76392c02491212a2230cF4",
    converterAddress: "0xa60B057673809956ae3cA9A0E0bc246efD4F8339"
  },
  {
    anchorAddress: "0xB2145C7f9249d79197fe3cB87333187eB4FC1Eec",
    converterAddress: "0x5820FdDC9Ae2a2b1F8cabdBF7266e0B36DB4E45A"
  },
  {
    anchorAddress: "0xa301Ad444e72F11590e3712bBb7aD0aC959b90C2",
    converterAddress: "0x68eAe22C00Aa8D67ddeD72186354b773dDA03077"
  },
  {
    anchorAddress: "0x9Ca631b980DeC1eEba001BBfaC8da5A9e7d744fF",
    converterAddress: "0x2dF5692aCc1E0Fec909870D05789B65C9B10b9a1"
  },
  {
    anchorAddress: "0x0dc75ECCcF5B784b793686e614C2E9dCdda63738",
    converterAddress: "0x868a85285901f4a818CE2e094f2852087c502161"
  },
  {
    anchorAddress: "0x8b3082e273E4B923830c637a203c1C1D963cA307",
    converterAddress: "0x37cDEC400afaaD77278fbc34876e083B520B2D7a"
  },
  {
    anchorAddress: "0x75aB5e15129BBBEcB5C5Fdb71d1ff7D5dA97d56c",
    converterAddress: "0x99049F92Fb57a54E77be1e45E0E6b9Eb2fc5A2EB"
  },
  {
    anchorAddress: "0xAeB3a1AeD77b5D6e3feBA0055d79176532e5cEb8",
    converterAddress: "0x9258Af079065857C01466CebDCFA2CFB6AA4983C"
  },
  {
    anchorAddress: "0x020F8aCf2Dea7Ad1CF8413431e427F684181C6BA",
    converterAddress: "0xD10591e2b47667AD9E543f780d5105E54Cc7C9D9"
  },
  {
    anchorAddress: "0x874d8dE5b26c9D9f6aA8d7bab283F9A9c6f777f4",
    converterAddress: "0x228F9EE87413a1BE69ef780eef2302b680d4863d"
  },
  {
    anchorAddress: "0x2d35087923194400d329EE74b45CBc77b7d573Ff",
    converterAddress: "0x112C5405d005F5e9C32eDB9A6B59E255B044126C"
  },
  {
    anchorAddress: "0x37382ca45EFc45bd1A53649Ab98D3Fa337e56A2F",
    converterAddress: "0xc11C56aa3cCb9c5065B2Be46Bbb50A83C5dC5012"
  },
  {
    anchorAddress: "0xD9c195c9E1C49e86C7A0F0E29627CB8F8523A7fb",
    converterAddress: "0xB20814d5cc0D723fefaad3BB9d74a2d90B3165D3"
  },
  {
    anchorAddress: "0x6c84F4ccC916ACf792538f1293b286b540906A2a",
    converterAddress: "0x52056B47F604216cf99782788922460F4E8E8c71"
  },
  {
    anchorAddress: "0xE274C0cCf7B0bC1eF29FFf9AD5eC98E9B5c45e84",
    converterAddress: "0x25F98800cd9d3FeEF2031d1C0b3FD1f7Cb83E4FF"
  },
  {
    anchorAddress: "0xBA04e539da9e7a6491A6c6ae38D9750226a3D36b",
    converterAddress: "0x8c3FBcfCB0f63eDdeD00b87C93B824DB86aa1D59"
  }
  // {
  //   anchorAddress: "0x295F136eB8c8D1429a77A2B5E0851AA035c8297C",
  //   converterAddress: "0x112fA1C7759c8f3cb8ae8ef5AC2eee31Fb78947b"
  // }
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

export const moreStaticRelays: StaticRelay[] = [
  {
    converterType: 1,
    version: 14,
    converterAddress: "0x7f913E9DeeF8eFE8d09A2e67d18cEd9BE4Ad1dc7",
    poolToken: {
      symbol: "AMPLBNT",
      decimals: "18",
      contract: "0x0e2145A23f7810431Ba0f2e19676530b3F1Fb0EC"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xD46bA6D942050d489DBd938a2C909A5d5039A161"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x235d4FD0D13784c848712c30f2Da03925496FBd4",
    poolToken: {
      symbol: "BUSDUSDB",
      decimals: "18",
      contract: "0xE94C892f90ABea59F3dd1D7d8c34aC9d7312F18A"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x4Fabb145d64652a948d72533023f6E7A623C7C53"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0x1e9653f8A3F1D5ACEC0d334e6433b9677acCe7fF",
    poolToken: {
      symbol: "SYB7BNT",
      decimals: "18",
      contract: "0xDC610F8eecE47E9F91209C77C8674C40d2d8E17F"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x86A49f08Ab6531A3E0e814c75F36de661B986Ca1"
    ]
  },
  {
    converterType: 1,
    version: 22,
    converterAddress: "0xDB3eC1d6A089F6be97B8fc00bEB43b34c7BeEB23",
    poolToken: {
      symbol: "POWRUSDB",
      decimals: "6",
      contract: "0x8bb91B280A39A9e9D8505B9a5BC792CCb3B9779E"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x595832F8FC6BF59c85C527fEC3740A1b7a361269"
    ]
  },
  {
    converterType: 1,
    version: 5,
    converterAddress: "0xB018AF916Ed0116404537D1238b18988D652733a",
    poolToken: {
      symbol: "INDBNT",
      decimals: "18",
      contract: "0x32423158e8FBD2839E085626F8a98D86b2766De8"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xf8e386EDa857484f5a12e4B5DAa9984E06E73705"
    ]
  },
  {
    converterType: 1,
    version: 42,
    converterAddress: "0xCbb50B9A3C587FF59B61702A9Bb93b6Ff0220ba9",
    poolToken: {
      symbol: "ENJBNT",
      decimals: "18",
      contract: "0xf3aD2cBc4276eb4B0fb627Af0059CfcE094E20a1"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xD2195468D42C607f6B62d3144a5d2f7f2BC09443",
    poolToken: {
      symbol: "OMGBNT",
      decimals: "18",
      contract: "0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07"
    ]
  },
  {
    converterType: 1,
    version: 5,
    converterAddress: "0x38a3Fc625DF834dD34e8EDE60E10Cd3024a6650E",
    poolToken: {
      symbol: "WISHBNT",
      decimals: "18",
      contract: "0x1C9Df905571B22214Fa5FB10ad99ebe327f199C5"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x1b22C32cD936cB97C28C5690a0695a82Abf688e6"
    ]
  },
  {
    converterType: 1,
    version: 6,
    converterAddress: "0xb85E52268CBF57b97Ae15136Aa65D4F567B8107c",
    poolToken: {
      symbol: "AIDBNT",
      decimals: "18",
      contract: "0xe3BF775Ec5f4F4dFCbb21194B22be1217b815b1d"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x37E8789bB9996CaC9156cD5F5Fd32599E6b91289"
    ]
  },
  {
    converterType: 1,
    version: 1,
    converterAddress: "0xb8a6920962655c97F0E3Eab40E5706Ed934907Cc",
    poolToken: {
      symbol: "AIXBNT",
      decimals: "18",
      contract: "0xA415cD56C694bd7402d14560D18Bb19A28F77617"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x1063ce524265d5a3A624f4914acd573dD89ce988"
    ]
  },
  {
    converterType: 1,
    version: 1,
    converterAddress: "0xa00655976c5c9A1eD58b3707b190867069bAbEe5",
    poolToken: {
      symbol: "ATSBNT",
      decimals: "18",
      contract: "0x1D75ebc72f4805e9C9918B36A8969b2e3847c9FB"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x2dAEE1AA61D60A252DC80564499A69802853583A"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x1317BD40c86461dFEE8E7bEE8B2Fb697b958cb7e",
    poolToken: {
      symbol: "BATBNT",
      decimals: "18",
      contract: "0x131da075a2832549128e93AcC2b54174045232Cf"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x0D8775F648430679A709E98d2b0Cb6250d2887EF"
    ]
  },
  {
    converterType: 1,
    version: 13,
    converterAddress: "0x27f8fd3ac4eAa50068B8F221bFa0b496F180813e",
    poolToken: {
      symbol: "BCSBNT",
      decimals: "18",
      contract: "0xD3aD4c39A12B48164068Fef8F86eF5836A9eF303"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x98Bde3a768401260E7025FaF9947ef1b81295519"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x0Da9F5b929B316D90F27F3510D7d9be6D8eA7706",
    poolToken: {
      symbol: "BNBBNT",
      decimals: "18",
      contract: "0xE6b31fB3f29fbde1b92794B0867A315Ff605A324"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"
    ]
  },
  {
    converterType: 1,
    version: 42,
    converterAddress: "0xB8A38Ca13bEE727092adB375FE64F6c23DeCC738",
    poolToken: {
      symbol: "USDB/CAT",
      decimals: "18",
      contract: "0xc9CEadb2d3bCeB198C1361c6a60892E95B1ABf60"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x1234567461d3f8Db7496581774Bd869C83D51c93"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x79E71FfEaE3aE4Be517154839E518789628B6D83",
    poolToken: {
      symbol: "DRGNBNT",
      decimals: "18",
      contract: "0xa7774F9386E1653645E1A08fb7Aae525B4DeDb24"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x419c4dB4B9e25d6Db2AD9691ccb832C8D9fDA05E"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0xD856CBd87D4563C199bf3A1956817951b12b430b",
    poolToken: {
      symbol: "CATBNT",
      decimals: "18",
      contract: "0xB3c55930368D71F643C3775869aFC73f6c5237b2"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x1234567461d3f8Db7496581774Bd869C83D51c93"
    ]
  },
  {
    converterType: 1,
    version: 6,
    converterAddress: "0x9b10206f236669F4f40E8e9806De9ab1813d3f65",
    poolToken: {
      symbol: "DRTBNT",
      decimals: "18",
      contract: "0x904c7051D12aCE7d0107ada8702C0C759cad1672"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x9AF4f26941677C706cfEcf6D3379FF01bB85D5Ab"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xDA1791b3F4d7827cE834A68751B4C2F52ADC42e2",
    poolToken: {
      symbol: "DAIBNT",
      decimals: "18",
      contract: "0xee01b3AB5F6728adc137Be101d99c678938E6E72"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xb695449D12B73DFc61B2150B07c7D1c342ddfDB6",
    poolToken: {
      symbol: "EDGBNT",
      decimals: "18",
      contract: "0xf95dd0Fc6DF64b2F149aFA9219579e0f850BCD4D"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x08711D3B02C8758F2FB3ab4e80228418a7F8e39c"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xdF71c1bA66647D8b0EB5437F5907abDfB439aCca",
    poolToken: {
      symbol: "ELFBNT",
      decimals: "18",
      contract: "0x0F2318565f1996CB1eD2F88e172135791BC1FcBf"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xbf2179859fc6D5BEE9Bf9158632Dc51678a4100e"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x0d57AD6818b6b34154d06355caa7d3729E4bAF06",
    poolToken: {
      symbol: "GTOBNT",
      decimals: "18",
      contract: "0xc4938292EA2d3085fFFc11C46B87CA068a83BE01"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xC5bBaE50781Be1669306b9e001EFF57a2957b09d"
    ]
  },
  {
    converterType: 1,
    version: 42,
    converterAddress: "0x16706f5561B88F4c80Ce9B35b2C02dFb0E22DD87",
    poolToken: {
      symbol: "MANABNT",
      decimals: "18",
      contract: "0x79d83B390cF0EDF86B9EFbE47B556Cc6e20926aC"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942"
    ]
  },
  {
    converterType: 1,
    version: 1,
    converterAddress: "0x0160AE697A3538668CDb4698d3B89C7F36AD990d",
    poolToken: {
      symbol: "MNTPBNT",
      decimals: "18",
      contract: "0x8DA321aB610cD24fB2bcCe191F423Dae7c327ca9"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x83cee9e086A77e492eE0bB93C2B0437aD6fdECCc"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x11110198B3B4AD6184e0587B76B28F34d54F6150",
    poolToken: {
      symbol: "REQBNT",
      decimals: "18",
      contract: "0xccB5E3Ba5356D57001976092795626ac3b87Ad4e"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x8f8221aFbB33998d8584A2B05749bA73c37a938a"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xf4F99f9339Ba0Cbff65eb46cfa939e3C54231e33",
    poolToken: {
      symbol: "RLCBNT",
      decimals: "18",
      contract: "0x9003411Ac4073C2D9f37af71d00E373B72Cbe9E2"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x607F4C5BB672230e8672085532f7e901544a7375"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x247AC58CD31541c65B3AAa47E047745107D13873",
    poolToken: {
      symbol: "SRNBNT",
      decimals: "18",
      contract: "0xd2Deb679ed81238CaeF8E0c32257092cEcc8888b"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x68d57c9a1C35f63E2c83eE8e49A64e9d70528D25"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0xdD7DE51c4F6FAF10Afce495f1Ef02E5Baa91379c",
    poolToken: {
      symbol: "STORMBNT",
      decimals: "18",
      contract: "0xCad4da66E00FDeCaBeC137a24E12Af8eDF303a1d"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xD0a4b8946Cb52f0661273bfbC6fD0E0C75Fc6433"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0xb7289a9Bbfb5C28598C0b825214b2e1dc51c72Ee",
    poolToken: {
      symbol: "TAASBNT",
      decimals: "18",
      contract: "0xAE201360282C885bf3F2616A3145D1344a1e43c0"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xE7775A6e9Bcf904eb39DA2b68c5efb4F9360e08C"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0xe18b18B6F5c07feF86cF0f1C9d0de7fD94869c24",
    poolToken: {
      symbol: "TBXBNT",
      decimals: "18",
      contract: "0xE844E4EF529CB1A507D47206bEeF65a921B07287"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x3A92bD396aEf82af98EbC0Aa9030D25a23B11C6b"
    ]
  },
  {
    converterType: 1,
    version: 32,
    converterAddress: "0xC04B5a4556d00Bca8eac5F5accA31981a6597409",
    poolToken: {
      symbol: "TKNBNT",
      decimals: "18",
      contract: "0x497Ec0D6Ba2080f0ed7ecf7a79a2A907401b3239"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xC4D88D7f9CCb1b4c24c0EDaA27BF662256B85E31",
    poolToken: {
      symbol: "TRSTBNT",
      decimals: "18",
      contract: "0x064432E84F05094E3eD746A35ab9B7aB865fDa5C"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x3B42239a8bc2f07bb16b17578fE44fF2422C16F6",
    poolToken: {
      symbol: "VEEBNT",
      decimals: "18",
      contract: "0xc9c3A465380bFaaC486C89ff7d5F60CC275D4E08"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x340D2bdE5Eb28c1eed91B2f790723E3B160613B7"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xE860f5ac349eB093236AA173F00E00dAB763944E",
    poolToken: {
      symbol: "WINGSBNT",
      decimals: "18",
      contract: "0xA6Ab3c8aE51962f4582db841dE6b0A092041461e"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x667088b212ce3d06a1b553a7221E1fD19000d9aF"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x4F88DFc8e1D7bA696Db158656457797cfBDfB844",
    poolToken: {
      symbol: "WANDBNT",
      decimals: "18",
      contract: "0x6a46f6DC570A1304a23f771c26b1802DFfcDAB0D"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x27f610BF36ecA0939093343ac28b1534a721DBB4"
    ]
  },
  {
    converterType: 1,
    version: 6,
    converterAddress: "0xc11CcE040583640001f5a7E945DFd82f662cC0aE",
    poolToken: {
      symbol: "WLKBNT",
      decimals: "18",
      contract: "0xd387CDAF85429b455f0F716D51Be33db2FC00463"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xF6B55acBBC49f4524Aa48D19281A9A77c54DE10f"
    ]
  },
  {
    converterType: 1,
    version: 1,
    converterAddress: "0x5A9f1cD844cE91AAADAA03059677EeBCf3CF00df",
    poolToken: {
      symbol: "ABXBNT",
      decimals: "18",
      contract: "0x275a1a2Dad3075bEb96AF4f7fD93ade99bB0151f"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x9a794Dc1939F1d78fa48613b89B8f9d0A20dA00E"
    ]
  },
  {
    converterType: 1,
    version: 7,
    converterAddress: "0xdd9B82c59aa260B2A834Ec67C472f43b40a2E6f1",
    poolToken: {
      symbol: "AIONBNT",
      decimals: "18",
      contract: "0x73fa2B855be96AB3C73f375B8Ec777226eFA3845"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0x5caa37CBa585C216D39e3a02D8C0DFd4843cA5f9",
    poolToken: {
      symbol: "AMNBNT",
      decimals: "18",
      contract: "0x0f9Be347378a37CED33A13AE061175AF07CC9868"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x737F98AC8cA59f2C68aD658E3C3d8C8963E40a4c"
    ]
  },
  {
    converterType: 1,
    version: 42,
    converterAddress: "0x83473C806d1c0d26b15B93AC3F3FE86F6615B2db",
    poolToken: {
      symbol: "ESZBNT",
      decimals: "18",
      contract: "0xA2020e324C365D05e87cf25552E6e6734260b089"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xe8A1Df958bE379045E2B46a31A98B93A2eCDfDeD"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x266036713c53Cadaa16F9D3328741A4Cf435230b",
    poolToken: {
      symbol: "CVTBNT",
      decimals: "18",
      contract: "0x737Ac585809C0F64Ee09d7B8050d195d14f14c55"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x4AaC461C86aBfA71e9d00d9a2cde8d74E4E1aeEa"
    ]
  },
  {
    converterType: 1,
    version: 7,
    converterAddress: "0x7E4b0AbAd3407b87a381c1C05aF78d7ad42975E7",
    poolToken: {
      symbol: "INSTAR",
      decimals: "18",
      contract: "0xC803B2B2c3BA24C0C934AEB3Ba508A4dD6853F1b"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xc72fe8e3Dd5BeF0F9f31f259399F301272eF2a2D"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xf42305EA9d1527211EdA8Fb333FBf2668BFfd9E1",
    poolToken: {
      symbol: "J8TBNT",
      decimals: "18",
      contract: "0x8E00BacD7d8265d8F3f9d5B4fbd7F6B0B0c46f36"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x65003F30295d8622827e23953664D3C78671C01C",
    poolToken: {
      symbol: "KNCBNT",
      decimals: "18",
      contract: "0x248AFFf1aa83cF860198ddeE14b5b3E8eDb46d47"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xdd974D5C2e2928deA5F71b9825b8b646686BD200"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x4aabAacc70A7c592e506e00515b9a9E6CD4C3Ef2",
    poolToken: {
      symbol: "LDCBNT",
      decimals: "18",
      contract: "0xB79C3a1a2d50CC99459F3a21D709bCEC86656e97"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x5102791cA02FC3595398400BFE0e33d7B6C82267"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x697134bF35238773bcb6aef16956D1417B562002",
    poolToken: {
      symbol: "MDTBNT",
      decimals: "18",
      contract: "0xbAb15d72731Ea7031B10324806E7AaD8448896D5"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x814e0908b12A99FeCf5BC101bB5d0b8B5cDf7d26"
    ]
  },
  {
    converterType: 1,
    version: 25,
    converterAddress: "0xFbbAf86D76ef7C86f1Aea216242EF8e203A8Be7E",
    poolToken: {
      symbol: "MFGBNT",
      decimals: "18",
      contract: "0xb3b2861a093B7FB19352bD62CD8EFC314e0641a7"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x6710c63432A2De02954fc0f851db07146a6c0312"
    ]
  },
  {
    converterType: 1,
    version: 42,
    converterAddress: "0xE3c7239BCcEe98B85a7D7Bc364490440067Afabf",
    poolToken: {
      symbol: "NPXSBNT",
      decimals: "18",
      contract: "0x5a4deB5704C1891dF3575d3EecF9471DA7F61Fa4"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xA15C7Ebe1f07CaF6bFF097D8a589fb8AC49Ae5B3"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x4D6DE557092f9742606e226860d6718281C9D241",
    poolToken: {
      symbol: "ONGBNT",
      decimals: "18",
      contract: "0x8104E7ce81FaB39c42e34Cd9d8B654135261Fae8"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xd341d1680Eeee3255b8C4c75bCCE7EB57f144dAe"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0xc964DE24878B04AFDF6A7df5E7956deCC665D4bE",
    poolToken: {
      symbol: "PLRBNT",
      decimals: "18",
      contract: "0x2843F6c3b14e698e3D7562584959C61274F93328"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xe3818504c1B32bF1557b16C238B2E01Fd3149C17"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x0512f5D48D636369C0e86924E10A8BB24C8E129f",
    poolToken: {
      symbol: "POWRBNT",
      decimals: "18",
      contract: "0x168D7Bbf38E17941173a352f1352DF91a7771dF3"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x595832F8FC6BF59c85C527fEC3740A1b7a361269"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x6Bb5BbAe5B226E9c0e25FB2D92FD273fD3a70242",
    poolToken: {
      symbol: "RCNBNT",
      decimals: "18",
      contract: "0xf7b9fa01098f22527Db205Ff9BB6FdF7C7D9F1C5"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x635C9C9940D512bF5CB455706a28F9C7174d307f",
    poolToken: {
      symbol: "RVTBNT",
      decimals: "18",
      contract: "0x5039f60594Ffa3f1a5ACbe85E1eBe12Dc8Da7c5c"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x3d1BA9be9f66B8ee101911bC36D3fB562eaC2244"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x73f73391e5F56Ce371A61fC3e18200A73d44Cf6f",
    poolToken: {
      symbol: "STACBNT",
      decimals: "18",
      contract: "0x258D1210e9E242FDc0Ecfa3b039A51a945CD0D0a"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x9a005c9a89BD72a4Bd27721E7a09A3c11D2b03C4"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x2E948017C68F1FedC2496dDD4cc33A517D4e0168",
    poolToken: {
      symbol: "GNOBNT",
      decimals: "18",
      contract: "0xd7eB9DB184DA9f099B84e2F86b1da1Fe6b305B3d"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x6810e776880C02933D47DB1b9fc05908e5386b96"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x55d32d9ed854559Ca8759D528bcC648036544fAC",
    poolToken: {
      symbol: "KINBNT",
      decimals: "18",
      contract: "0x26b5748F9253363f95e37767e9ed7986877A4B1b"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5"
    ]
  },
  {
    converterType: 1,
    version: 13,
    converterAddress: "0x6d1CEB4Fd5595c9773EB7FC79B0c090a380514DA",
    poolToken: {
      symbol: "BAXBNT",
      decimals: "18",
      contract: "0xA9DE5935aE3eae8a7F943C9329940EDA160267f4"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x9a0242b7a33DAcbe40eDb927834F96eB39f8fBCB"
    ]
  },
  {
    converterType: 1,
    version: 7,
    converterAddress: "0x8bB76C5AE6b7D6bd1678510edD06444AcDf8F72B",
    poolToken: {
      symbol: "BETRBNT",
      decimals: "18",
      contract: "0x679F601F0deb53c2dB0C8C26369FDcba5fD753CF"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x763186eB8d4856D536eD4478302971214FEbc6A9"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0xeB4F011A862A8EDB723FDb3b5d144D77dFb7fa5f",
    poolToken: {
      symbol: "UPBNT",
      decimals: "18",
      contract: "0xd4c810fdcA379831078267f3402845E5205Aa0e1"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x6Ba460AB75Cd2c56343b3517ffeBA60748654D26"
    ]
  },
  {
    converterType: 1,
    version: 32,
    converterAddress: "0xbE1DAF05Bf9e054b3e28b7E9C318819eF5dAcb58",
    poolToken: {
      symbol: "VIBBNT",
      decimals: "18",
      contract: "0x2948BD241243Bb6924A0b2f368233DDa525AAB05"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x2C974B2d0BA1716E644c1FC59982a89DDD2fF724"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0xf66EFba4dCDAB29d864b3134970C28bFcF653f3f",
    poolToken: {
      symbol: "XDCEBNT",
      decimals: "18",
      contract: "0xd1BB51fECC950c7b1e4197D8d13A1d2A60795D2C"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x41AB1b6fcbB2fA9DCEd81aCbdeC13Ea6315F2Bf2"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x3B0116363e435D9E4EF24ecA6282a21b7CC662df",
    poolToken: {
      symbol: "AUCBNT",
      decimals: "18",
      contract: "0x164A1229F4826C9dd70Ee3D9f4f3d7B68a172153"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xc12d099be31567add4e4e4d0D45691C3F58f5663"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x3167cc146d228C6977dCbadA380dF926b39865b1",
    poolToken: {
      symbol: "BOXXBNT",
      decimals: "18",
      contract: "0x849D49911cEF804bdB1FEC58150B8EabAB119796"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x780116D91E5592E58a3b3c76A351571b39abCEc6"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x72A38A55849b58FC2537b225a1ba3c4766316b0a",
    poolToken: {
      symbol: "CEEKBNT",
      decimals: "18",
      contract: "0x2F2ad6954d99Ea14fA145B9AB0fb6BA5Ac32c0Ee"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xb056c38f6b7Dc4064367403E26424CD2c60655e1"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x64846ff24B1AF06075efc44d7Fe9f1d5969f3275",
    poolToken: {
      symbol: "CLNBNT",
      decimals: "18",
      contract: "0xEB027349398De19D925DefC15c4302fE92FC69f9"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x4162178B78D6985480A308B2190EE5517460406D"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x20d23C7A4b2Ea38f9Dc885bd25b1BC8c2601D44d",
    poolToken: {
      symbol: "DANBNT",
      decimals: "18",
      contract: "0xa06cFAB8B584c91Df1aBee6e8503486AB4e23F40"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x9B70740e708a083C6fF38Df52297020f5DfAa5EE"
    ]
  },
  {
    converterType: 1,
    version: 32,
    converterAddress: "0x8658863984d116d4B3A0A5af45979eceAC8a62f1",
    poolToken: {
      symbol: "DATABNT",
      decimals: "18",
      contract: "0xdD8a17169aa94E548602096EB9C9d44216cE8a37"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x0Cf0Ee63788A0849fE5297F3407f701E122cC023"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x71168843b49E305E4d53dE158683903eF261B37f",
    poolToken: {
      symbol: "DTRCBNT",
      decimals: "18",
      contract: "0x1F593cDC35D7f0B0495dA16B631d28DE5AE25a07"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xc20464e0C373486d2B3335576e83a218b1618A5E"
    ]
  },
  {
    converterType: 1,
    version: 25,
    converterAddress: "0xac4CcEB8Bb7bF4d9Ff6493cDf3F87fE349Ab1beC",
    poolToken: {
      symbol: "FKXBNT",
      decimals: "18",
      contract: "0x80c222E38fb57F0710aF21128535096D90503285"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x009e864923b49263c7F10D19B7f8Ab7a9A5AAd33"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x810C99C5De0A673E4bc86090f9bFE96a6D1B49a7",
    poolToken: {
      symbol: "FTXBNT",
      decimals: "18",
      contract: "0x4d849DaD08A4061bE102DBCA2CE2718A9a0b635a"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xd559f20296FF4895da39b5bd9ADd54b442596a61"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x32d4fb837f41955b81556F74DAdB2C5b8a0D0989",
    poolToken: {
      symbol: "GESBNT",
      decimals: "18",
      contract: "0x5972CED550248B17c9F674639D33E5446b6ad95A"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xFB1e5F5e984C28Ad7E228CDaA1F8A0919BB6a09B"
    ]
  },
  {
    converterType: 1,
    version: 19,
    converterAddress: "0x2BeA21613B6c2C129d3F714c702008cDD3dD995B",
    poolToken: {
      symbol: "HOTBNT",
      decimals: "18",
      contract: "0x0Ac0e122D09cC4DA4A96Cc2731D2b7cc1f8b025a"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x9AF839687F6C94542ac5ece2e317dAAE355493A1"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xACC03E1fD72CddC66C736cCe84626fbc63dd953B",
    poolToken: {
      symbol: "MADBNT",
      decimals: "18",
      contract: "0x014186b1a2d675fc1e303A3d62B574C3270A38e0"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x5B09A0371C1DA44A8E24D36Bf5DEb1141a84d875"
    ]
  },
  {
    converterType: 1,
    version: 32,
    converterAddress: "0x952EB7dC904F6f8b6b0Bc6c5c99d45143E743Cd7",
    poolToken: {
      symbol: "MORPHBNT",
      decimals: "18",
      contract: "0xB2Ea67533290fAd84e3fe2E1Fb68D21Ca062d7fc"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x2Ef27BF41236bD859a95209e17a43Fbd26851f92"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0xE65c7e27C1c086f26CE0Daa986C3d9c24Ef3c2D8",
    poolToken: {
      symbol: "MRGBNT",
      decimals: "18",
      contract: "0x25Bf8913D6296a69C7B43BC781614992cb218935"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xcbee6459728019CB1f2bB971dDe2eE3271BC7617"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0x9dB89726aE2683d21A71fF1417638E72e6D8C0d9",
    poolToken: {
      symbol: "MYBBNT",
      decimals: "18",
      contract: "0xf22FB05aC032fcAf3273f50aF8db2753888Bdd48"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x5d60d8d7eF6d37E16EBABc324de3bE57f135e0BC"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x0bFbfF3FC69BD69b258C480bCc65C4E0d75A5163",
    poolToken: {
      symbol: "POABNT",
      decimals: "18",
      contract: "0x564c07255AFe5050D82c8816F78dA13f2B17ac6D"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x6758B7d441a9739b98552B373703d8d3d14f9e62"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x32131848eDc60E032aBf0369241D34ec969EBf90",
    poolToken: {
      symbol: "RBLXBNT",
      decimals: "18",
      contract: "0x78AcF38ec85A9E4B2B88961b9D4BffbA04FdbA59"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xFc2C4D8f95002C14eD0a7aA65102Cac9e5953b5E"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0xe27cf7324E6377bdDc48DB6BAC642839ffa9Bb36",
    poolToken: {
      symbol: "REPUXBNT",
      decimals: "18",
      contract: "0x28291d74Bca9dE7cb6948A8E699651ed93832c50"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x4D305c2334c02E44aC592BbEA681bA4cC1576DE3"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0xd361339550CD8B3e9446Bbb12AEA337785A7aea4",
    poolToken: {
      symbol: "SCLBNT",
      decimals: "18",
      contract: "0xFcEb45cF070B277fedE520c5539ae204Bc1D493E"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xd7631787B4dCc87b1254cfd1e5cE48e96823dEe8"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x150A46613a16B4256AcD227d00463BAa78B547Ec",
    poolToken: {
      symbol: "SIGBNT",
      decimals: "18",
      contract: "0x09953e3e5C6Be303D8D83Ccb672d241abc9BEe29"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x6888a16eA9792c15A4DCF2f6C623D055c8eDe792"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x9C67411d318b65A83bd07c717F46B8bA26Ae469F",
    poolToken: {
      symbol: "SNTBNT",
      decimals: "18",
      contract: "0xa3b3c5a8b22C044D5f2d372f628245E2106D310D"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x744d70FDBE2Ba4CF95131626614a1763DF805B9E"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x7834D96BD681e43740E6dA513638504174040010",
    poolToken: {
      symbol: "TNSBNT",
      decimals: "18",
      contract: "0x5cf2f6387c4F551316e1E422aCf1025a539825c3"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xb0280743b44bF7db4B6bE482b2Ba7b75E5dA096C"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x8C73126b85f59d85Aa61391579B4C2710DD70f96",
    poolToken: {
      symbol: "X8XBNT",
      decimals: "18",
      contract: "0xAe0ceCc84bC1DDefe13C6e5B2E9D311927e45eD8"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x910Dfc18D6EA3D6a7124A6F8B5458F281060fa4c"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0xBA2BE1Cd1F00470c21385B7cbED6211aeFAc0172",
    poolToken: {
      symbol: "XBPBNT",
      decimals: "18",
      contract: "0xbb83a9Fe991BAA72F412F39af254EEbbfdc910BA"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x28dee01D53FED0Edf5f6E310BF8Ef9311513Ae40"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x4f138e1CEeC7b33dfA4f3051594Ec016a08c7513",
    poolToken: {
      symbol: "XNKBNT",
      decimals: "18",
      contract: "0x1B4D8c62DdF6947616a5FCda4Ca40A8715d2a4cb"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xBC86727E770de68B1060C91f6BB6945c73e10388"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x056e7916cdc2BC7414a903685938c707186D140D",
    poolToken: {
      symbol: "ZIPTBNT",
      decimals: "18",
      contract: "0xC4a01182ab1e502a1C1d17024e4924573CE001CC"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xEDD7c94FD7B4971b916d15067Bc454b9E1bAD980"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x1f67A92AA26CC0Ff6c62B6e284aaf57249fdEBB8",
    poolToken: {
      symbol: "XPATBNT",
      decimals: "18",
      contract: "0xEe769CE6B4E2C2A079c5f67081225Af7C89F874C"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xBB1fA4FdEB3459733bF67EbC6f893003fA976a82"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0x99F357f722EC3e456Af0eB530c1C14a3251305Ad",
    poolToken: {
      symbol: "BBOBNT",
      decimals: "18",
      contract: "0x980B4118dAb781829DF80D7912d70B059a280DAd"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x84F7c44B6Fed1080f647E354D552595be2Cc602F"
    ]
  },
  {
    converterType: 1,
    version: 6,
    converterAddress: "0x0f1C029C5D7f626f6820bfe0F6a7B2Ac48746dDF",
    poolToken: {
      symbol: "SHPBNT",
      decimals: "18",
      contract: "0x6e0E0B9aB5f8e5F5F2DE4D34FfE46668FFB37476"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xEF2463099360a085f1f10b076Ed72Ef625497a06"
    ]
  },
  {
    converterType: 1,
    version: 6,
    converterAddress: "0x7BAc8115f3789F4d7a3BFE241EB1bCb4D7F71665",
    poolToken: {
      symbol: "WAXBNT",
      decimals: "18",
      contract: "0x67563E7A0F13642068F6F999e48c690107A4571F"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x39Bb259F66E1C59d5ABEF88375979b4D20D98022"
    ]
  },
  {
    converterType: 1,
    version: 39,
    converterAddress: "0x604989E3cb3f4e77c29C220182d75A99531aCF3A",
    poolToken: {
      symbol: "FLIXXBNT",
      decimals: "18",
      contract: "0x2d5aDD875442023eC83718Bb03D866c9F4C6E8cE"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xf04a8ac553FceDB5BA99A64799155826C136b0Be"
    ]
  },
  {
    converterType: 1,
    version: 9,
    converterAddress: "0xE0569fd1C3f0affD7E08131A16C06f3381C9355a",
    poolToken: {
      symbol: "MTLBNT",
      decimals: "18",
      contract: "0x60Be88DD72f03C91FB22EEF7Af24C2e99Db58530"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xF433089366899D83a9f26A773D59ec7eCF30355e"
    ]
  },
  {
    converterType: 1,
    version: 25,
    converterAddress: "0xb2841c6e6a9ef1D6fEAa25cCaA6c61CBd58CAa76",
    poolToken: {
      symbol: "CMCTBNT",
      decimals: "18",
      contract: "0xb5b0E0642d35D7Cab64CDa6EcF87Fd842cB5c58d"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x47bc01597798DCD7506DCCA36ac4302fc93a8cFb"
    ]
  },
  {
    converterType: 1,
    version: 32,
    converterAddress: "0x7B00EFba58CC6fdaB1c162a9C9528B935F5F1af7",
    poolToken: {
      symbol: "AGRIBNT",
      decimals: "18",
      contract: "0xEab935f35693c3218b927436E63564018E92034f"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xa704fCe7b309Ec09DF16e2F5Ab8cAf6Fe8A4BAA9"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0xBA8ecf0080ED377E04c2b6761154E8777538f2dC",
    poolToken: {
      symbol: "DGDBNT",
      decimals: "18",
      contract: "0x7Ef1fEDb73BD089eC1010bABA26Ca162DFa08144"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A"
    ]
  },
  {
    converterType: 1,
    version: 32,
    converterAddress: "0x0D86A7A059f316F81FcEF32495aAe41Cd0C80511",
    poolToken: {
      symbol: "EURSBNT",
      decimals: "18",
      contract: "0xFC0e04Eae452c163883AAAd4Ac1AE091Cc87FEf3"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xdB25f211AB05b1c97D595516F45794528a807ad8"
    ]
  },
  {
    converterType: 1,
    version: 40,
    converterAddress: "0x3a79e5B49c098aa9Ff95C7a504863090DC19fe97",
    poolToken: {
      symbol: "EVOBNT",
      decimals: "18",
      contract: "0xBB8436eaf49888641Df27e4E1DfFbd4851788209"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xefBd6D7deF37ffae990503EcdB1291B2f7E38788"
    ]
  },
  {
    converterType: 1,
    version: 39,
    converterAddress: "0x248b13d6d10C4102f72e79C04f87228aCe67fd3D",
    poolToken: {
      symbol: "LOCBNT",
      decimals: "18",
      contract: "0x38838B895cbf02048455Fb7f649D97C564fC18a8"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x5e3346444010135322268a4630d2ED5F8D09446c"
    ]
  },
  {
    converterType: 1,
    version: 1,
    converterAddress: "0xdc59242010E2d29617Bfeec57E62c7C00a5ACb52",
    poolToken: {
      symbol: "LOCIBNT",
      decimals: "18",
      contract: "0x6feb9Be6c40A12276cFa6DAFbD119ea62532daaB"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x9c23D67AEA7B95D80942e3836BCDF7E708A747C2"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x1a24501A0D53c5F6f36BcA34103fB250e498396d",
    poolToken: {
      symbol: "MFTBNT",
      decimals: "18",
      contract: "0x4319f9130848544afB97e92cb3Ea9fdb4b0A0B2a"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xDF2C7238198Ad8B389666574f2d8bc411A4b7428"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x2131C84dA69b879Cb505BFd9aBaaAf5ec8b6e83b",
    poolToken: {
      symbol: "MKRBNT",
      decimals: "18",
      contract: "0xf553E6eA4CE2F7dEEcbe7837E27931850eC15faB"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2"
    ]
  },
  {
    converterType: 1,
    version: 25,
    converterAddress: "0xc0b6d74940601Af8a8E720a9974E95DdA88B41b8",
    poolToken: {
      symbol: "BNT-USD",
      decimals: "18",
      contract: "0x607108c46bCE4cF6f86698E9B46E3270A734FeFe"
    },
    reserves: [
      "0xa485bD50228440797Abb4d4595161d7546811160",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 32,
    converterAddress: "0x1229e2a0711660BE162521f5626C68E85Ec99c7f",
    poolToken: {
      symbol: "REALBNT",
      decimals: "18",
      contract: "0xE9ADced9da076D9dADA35F5b99970fDd58B1440D"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x9214eC02CB71CbA0ADA6896b8dA260736a67ab10"
    ]
  },
  {
    converterType: 1,
    version: 1,
    converterAddress: "0x5039D9B575bD5722d310AF6D2fC11e053c6D03DA",
    poolToken: {
      symbol: "SPDBNT",
      decimals: "18",
      contract: "0xb2F40825d32b658d39e4F73bB34D33BA628e8B76"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x1dEa979ae76f26071870F824088dA78979eb91C8"
    ]
  },
  {
    converterType: 1,
    version: 24,
    converterAddress: "0xc32cb2b5c5ce8b6b2b6d459C7de2Ca3e6e36A4cf",
    poolToken: {
      symbol: "SVDBNT",
      decimals: "18",
      contract: "0x8DCF1cA9f4716ef8e86A29f224237540f3c7ABad"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xbdEB4b83251Fb146687fa19D1C660F99411eefe3"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x06ddD7AE02762382184F511C14609c3AE03BAf2a",
    poolToken: {
      symbol: "FTTBNT",
      decimals: "18",
      contract: "0x140d47AeA2f10FfF26de4150971e600A2e010A81"
    },
    reserves: [
      "0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x79a373401BA7C9557475dA0Ec73368AD0B86fae4",
    poolToken: {
      symbol: "ANTBNT",
      decimals: "18",
      contract: "0x0c485BffD5df019F66927B2C32360159884D4409"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x960b236A07cf122663c4303350609A66A7B288C0"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0x24090349a627B3529F883A09A049F9bC3aD19479",
    poolToken: {
      symbol: "COTBNT",
      decimals: "18",
      contract: "0x19dB077A54dEa3fD4CBCd9d31D4dB297562CbD94"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x5c872500c00565505F3624AB435c222E558E9ff8"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0x2A432989CFbAE00e807Bd8Cb414B657F1B74E5c7",
    poolToken: {
      symbol: "EFOODBNT",
      decimals: "18",
      contract: "0xf34484286be88613ad8399fe40f93506125be139"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x47Ec6AF8E27C98e41d1Df7fb8219408541463022"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0x92a497f0bcDEaa5345f6aA4a3357EE3cbe2E7226",
    poolToken: {
      symbol: "EMCOBNT",
      decimals: "18",
      contract: "0x2E8d4EF4Cce1a5235311307b45EBEcF31eE7CA88"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x9A07fD8a116b7E3Be9e6185861496AF7a2041460"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0x1c29f12d94AD2e6b5321Ce226b4550f83ce88fCA",
    poolToken: {
      symbol: "HEDGBNT",
      decimals: "18",
      contract: "0x654Ee2EAf2082c5483f2212ba7b6701F334a159f"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xF1290473E210b2108A85237fbCd7b6eb42Cc654F"
    ]
  },
  {
    converterType: 1,
    version: 40,
    converterAddress: "0x6C96693580Caa51515FC7FE9AE7A088ccB8451a5",
    poolToken: {
      symbol: "MRPHBNT",
      decimals: "18",
      contract: "0x4B51AcC819591c885DbA0F06d98A07b432E6D6B4"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x7B0C06043468469967DBA22d1AF33d77d44056c8"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0xB7246144F53Ec44E0f845Fd0DEea85208acFC2C9",
    poolToken: {
      symbol: "RDNBNT",
      decimals: "18",
      contract: "0x11223Ed5D5846603C4EfC7c451FD8EB596d592cF"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0x4E2C46b4E86A17aD942B2Cd6F84302AeE4196A60",
    poolToken: {
      symbol: "REFBNT",
      decimals: "18",
      contract: "0xB67FA7330154878cF1Fd8F4b20bf1C19F68a3926"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x89303500a7Abfb178B274FD89F2469C264951e1f"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x90aDD3Bbfc664C0A07572F4F3Ef94f64200832e1",
    poolToken: {
      symbol: "REMBNT",
      decimals: "18",
      contract: "0xaB5ae72d95d3A02796c87F8079b1E180507dF54f"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x83984d6142934bb535793A82ADB0a46EF0F66B6d"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0xBAC94DC2411F494c438cA667A4836e3DCCAA4920",
    poolToken: {
      symbol: "SANBNT",
      decimals: "18",
      contract: "0xd6A6c879Ad8c01D0C8d5bF1C85829814b954DBBF"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0x5C03354cbaB446CA3Cb426513f11f684724636f7",
    poolToken: {
      symbol: "SXLBNT",
      decimals: "18",
      contract: "0x3364ccAedE016F4C433B326d96bE1A2eafA60bdD"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x222eFe83d8cC48e422419d65Cf82D410A276499B"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xD4c2BD3c4203A16266eced70a3F8cb4999a73E8f",
    poolToken: {
      symbol: "WBTC",
      decimals: "18",
      contract: "0xFEE7EeaA0c2f3F7C7e6301751a8dE55cE4D059Ec"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0xb61b3FE730Fb58936f06239feA2FEEd5B3256F50",
    poolToken: {
      symbol: "RSTBNT",
      decimals: "18",
      contract: "0x43d3a0712eD544b26d85c9eaf841008369bAB5d1"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x86D17e2eF332293391303F188F6a467dc0D1fd0d"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0x6b2c2db78Fc5F1f0A7a7a6d91d26922850A9C693",
    poolToken: {
      symbol: "FXCBNT",
      decimals: "18",
      contract: "0xb93Cc8642f5e8644423Aa7305da96FFF75708228"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x4a57E687b9126435a9B19E4A802113e266AdeBde"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0x8bd7448162C296A5bB3F0B9cCDEe383f5b899C93",
    poolToken: {
      symbol: "PRTLBNT",
      decimals: "18",
      contract: "0x2788C2dB0fBdbaee39Fa010D325d55e7e4527e0d"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xF01d7939441a3b1B108C70A28DcD99c6A98aD4b4"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0xbDC7310289dCd30D16E284d6F207a8E2F76A37aD",
    poolToken: {
      symbol: "QDAOBNT",
      decimals: "18",
      contract: "0x19683E94943E6b348D8AFB98C128B9b549B400DF"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x3166C570935a7D8554c8f4eA792ff965D2EFe1f2"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x1e45Ff6C529DD038E75767779D12b7981311B8Df",
    poolToken: {
      symbol: "ELETBNT",
      decimals: "18",
      contract: "0x334C36Be5b1EaF0C4b61dDEa202c9f6Dc2640FE5"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x6c37Bf4f042712C978A73e3fd56D1F5738dD7C43"
    ]
  },
  {
    converterType: 1,
    version: 14,
    converterAddress: "0xE03374cAcf4600F56BDDbDC82c07b375f318fc5C",
    poolToken: {
      symbol: "USDB / BNT",
      decimals: "18",
      contract: "0xd1146B08e8104EeDBa44a73B7bda1d102c6ceDC9"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 0,
    converterAddress: "0x70e6f05ae2F61562FAb7115DdD387b83B28564de",
    poolToken: {
      symbol: "USDQBNT",
      decimals: "18",
      contract: "0x9921f8F53EE185a6BFD5d9D8935107934D0B07DA"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x4954Db6391F4feB5468b6B943D4935353596aEC9"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x0dA9706F366C915D3769F7Ae9737Ef77c7741715",
    poolToken: {
      symbol: "PKGBNT",
      decimals: "18",
      contract: "0xE729024679C29c2660E05727ECAfd3D8792b8111"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x02F2D4a04E6E01aCE88bD2Cd632875543b2eF577"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x6aD9C98E25D8E8292514ef108043278eeC34a27b",
    poolToken: {
      symbol: "MGTBNT",
      decimals: "18",
      contract: "0x6F60D44A0d6fB95E037A099F8642f949c959a363"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x0cB20b77AdBe5cD58fCeCc4F4069D04b327862e5"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x868229B43a8BCBDFfb244DDE874f52Ade0B1c132",
    poolToken: {
      symbol: "USDCUSDB",
      decimals: "18",
      contract: "0x71c414DaCe65ABff9351E215d25f17F675241c0A"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x7d9B4031290FDD0D48468CefD54a1E34090dC36C",
    poolToken: {
      symbol: "BNTSWRV",
      decimals: "18",
      contract: "0x07009A1F62dd238c7167e4D9BC3C5b28B6Fe5a96"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xB8BAa0e4287890a5F79863aB62b7F175ceCbD433"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xF4736618F2782b662304b7340084a6Bc6DDb5C2c",
    poolToken: {
      symbol: "ZRXUSDB",
      decimals: "18",
      contract: "0x1a3c6768e200482F5f47D1BE77B7255aBCAe4Fe2"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xE41d2489571d322189246DaFA5ebDe1F4699F498"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x2A1eAa24Ec7fF662157Bc8345a3e41cFdCE1Fdbe",
    poolToken: {
      symbol: "MKRUSDB",
      decimals: "18",
      contract: "0x29dF79CB535f1fe82cA65d52cB8B5EE82D7E98a6"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xc89bC9cBB8237C58587b5F907ed6B3163BFDD1B9",
    poolToken: {
      symbol: "sUSDUSDB",
      decimals: "18",
      contract: "0x9B6678c766003aD69A15f795f433C0F62c10D4d5"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xe037d37898E6f6fFE8AcE3Eb93cD0F78FF107A8e",
    poolToken: {
      symbol: "REPUSDB",
      decimals: "18",
      contract: "0xAb0C9850BaACF24eFA368b57C2822Ce73b60794c"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x1985365e9f78359a9B6AD760e32412f4a445E862"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x3a8CC07F17Eb10E628c74B1a442c7ADC2BfD854D",
    poolToken: {
      symbol: "TUSDUSDB",
      decimals: "18",
      contract: "0x06cd5923593a359111cDec66E74c62E831C8aEab"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x0000000000085d4780B73119b644AE5ecd22b376"
    ]
  },
  {
    converterType: 1,
    version: 13,
    converterAddress: "0xE04c8aecb58BC3C918aeDAc958224a632529926e",
    poolToken: {
      symbol: "C20BNT",
      decimals: "18",
      contract: "0x1EF9e0ac29b3813528FbfdAdf5118AB63e4be015"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x26E75307Fc0C021472fEb8F727839531F112f317"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x06f7Bf937Dec0C413a2E0464Bb300C4d464bb891",
    poolToken: {
      symbol: "DAIUSDB",
      decimals: "18",
      contract: "0xcb913ED43e43cc7Cec1D77243bA381615101E7E4"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xF02182DA935b810CDD3B5c92F324C16FC0413c3B",
    poolToken: {
      symbol: "ENJUSDB",
      decimals: "18",
      contract: "0x42529f410f0a72599Fff2c67DD2a63CFfBcc3f91"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c"
    ]
  },
  {
    converterType: 1,
    version: 27,
    converterAddress: "0x8F4789889CAe9227114fF4891Dc77a75379773C0",
    poolToken: {
      symbol: "EVEDBNT",
      decimals: "18",
      contract: "0x5E761d4529ae69996cb42E09707f9D1D29F047d6"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x5aaEFe84E0fB3DD1f0fCfF6fA7468124986B91bd"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x2B4f0AD32a8aC2075648A054D6082727e21eD053",
    poolToken: {
      symbol: "RLCUSDB",
      decimals: "18",
      contract: "0x6534d2A69c2C7774DF42A55A1678bD008984B324"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x607F4C5BB672230e8672085532f7e901544a7375"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x6C69454b0ED9196Fa71cB514e7C3b49aC149eC4B",
    poolToken: {
      symbol: "WETHOGN",
      decimals: "18",
      contract: "0xcaB1F46A73Aa6096707f5EF6Edc4C1dfE991f981"
    },
    reserves: [
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      "0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x96772082615Fb019E91877653503EB6Ef1E65Aea",
    poolToken: {
      symbol: "KNCUSDB",
      decimals: "18",
      contract: "0xD69AE1D715d7451646107D43777139B0a42d7c63"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xdd974D5C2e2928deA5F71b9825b8b646686BD200"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x97Cf22539646d5a264Fb3FBb68bb0642D8AD2a66",
    poolToken: {
      symbol: "NEXOUSDB",
      decimals: "18",
      contract: "0x515d562496C43487eb2DDce1a2A7721148D44E36"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xc3b1928A01aC03F8353d05196AfcA778ab9970f7",
    poolToken: {
      symbol: "NMRUSDB",
      decimals: "18",
      contract: "0xEfec901ff0a33d0eF4f8068CDd8b28Fdc40aa556"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x604F88101146b397c31dc4051C5F290f48a5862f",
    poolToken: {
      symbol: "JRTBNT",
      decimals: "18",
      contract: "0x069D653038DB2F9d84e9620Be140B3D404a40258"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x8A9C67fee641579dEbA04928c4BC45F66e26343A"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xE638A52dDAd3fa31233152C17422E3312A3f6643",
    poolToken: {
      symbol: "OMGUSDB",
      decimals: "18",
      contract: "0xAeBfeA5ce20af9fA2c65fb62863b31A90b7e056b"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x81708ECf0ABB950100cd482d2843E1146fa778A4",
    poolToken: {
      symbol: "LOOMUSDB",
      decimals: "18",
      contract: "0xc32BF4a12542E897BADbFf2B61e56c82eAe73d69"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xD6DD7d29EcAB65D092942d42c4F360Fde41693Dc",
    poolToken: {
      symbol: "BATUSDB",
      decimals: "18",
      contract: "0x7FfE011B93e06FA14CE5A6E00320937652664366"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x0D8775F648430679A709E98d2b0Cb6250d2887EF"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xabD0dDC9143972E4eA9A816821bfba8204122E6E",
    poolToken: {
      symbol: "MGTBNT",
      decimals: "18",
      contract: "0x0bA204702F102aD3B0156164754e8af18C24C49C"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xA207Ef81C35848A60A732005A42fAe0BA89A9bE2"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x6bA3e97Dee101Edacc3b58ED59273693aCB4c79e",
    poolToken: {
      symbol: "METUSDB",
      decimals: "18",
      contract: "0x7F8c53072d9B809A108b1A9D677Bcc3B7B3F844e"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x29f6Ae0f0c85b472Dc792CeF36e5690E1d3f7255",
    poolToken: {
      symbol: "ACDBNT",
      decimals: "18",
      contract: "0x075561230DB23aa3B86ABE8AFE8bbc4eCDdf1C5A"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xEa6d4D7B36C00B3611dE0B0e1982B12E9e736c66"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x296089F31af0648C1B0eFE1234527F85CDbC071C",
    poolToken: {
      symbol: "SNXUSDB",
      decimals: "18",
      contract: "0xdf4971E3F52f5828C72A0512d560F54bFB2B2692"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x73B9081946021Dc6B9cE3E335A11A6A5BB2879fE",
    poolToken: {
      symbol: "SNXUSDB",
      decimals: "18",
      contract: "0x28271853E950bE371B050F3f93aA0146225bF374"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x27004767B074C36092e98886c8D4781a14c3CF3b",
    poolToken: {
      symbol: "CBIX7USDB",
      decimals: "18",
      contract: "0xE35a57AC913144AEf6a4b179634D343466DE3Cc3"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xCf8f9555D55CE45a3A33a81D6eF99a2a2E71Dee2"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x53106713B160C41634D78A9D5E15D252CCf03d0C",
    poolToken: {
      symbol: "DZARUSDB",
      decimals: "18",
      contract: "0x7484867773Bc6f3110f710577d36A3605DBa59DF"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c"
    ]
  },
  {
    converterType: 1,
    version: 13,
    converterAddress: "0x24844e100ab6cB505C4a195b4a9B610B02518fD4",
    poolToken: {
      symbol: "4XBBNT",
      decimals: "8",
      contract: "0xd8aB826b6D69f5E4Fa1325A5236491a309FBFF4f"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xA3AC41Fde5f3a569fa79E81fFe6734ee8097Ce9d"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x66540A3fcD929774a8dab59d56fE7A2D3538450F",
    poolToken: {
      symbol: "JRTUSDB",
      decimals: "18",
      contract: "0x4827e558e642861Cd7a1C8f011b2B4661F8d51fa"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x8A9C67fee641579dEbA04928c4BC45F66e26343A"
    ]
  },
  {
    converterType: 1,
    version: 22,
    converterAddress: "0x29e44d82303c4F9417B3A6E2e0f61314eAE84375",
    poolToken: {
      symbol: "XIOUSDB",
      decimals: "18",
      contract: "0x18D8001D1Da44fE96f442f5980e08D2Ab4e19594"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704"
    ]
  },
  {
    converterType: 1,
    version: 22,
    converterAddress: "0xE2AE92c64bfEFeC1Ef884071a7E7857d285c18D7",
    poolToken: {
      symbol: "CEEKUSDB",
      decimals: "18",
      contract: "0x27b099CF19227Ef7488D60a441d7eA2CC7FDDb25"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xb056c38f6b7Dc4064367403E26424CD2c60655e1"
    ]
  },
  {
    converterType: 1,
    version: 29,
    converterAddress: "0xe8cA7bbcAA9513638b0943664c99AEE16c1B290F",
    poolToken: {
      symbol: "BNCBNT",
      decimals: "18",
      contract: "0xEc7558322f0DF8719c805b39583b6Fd5ca6c9E30"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xbe5b336eF62D1626940363Cf34bE079e0AB89F20"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0xF9da2Fa63295bb991b56D38514D9E69B3C21699b",
    poolToken: {
      symbol: "WETHWBTCDAISNX",
      decimals: "18",
      contract: "0xca186FacC9e927e0c2ddBbd31b16eE41057edDB2"
    },
    reserves: [
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x99B4C9Eeae0b5D868Fc3B5e833A59Fef3e8FDab1",
    poolToken: {
      symbol: "NMRBNT",
      decimals: "18",
      contract: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671"
    ]
  },
  {
    converterType: 1,
    version: 42,
    converterAddress: "0xdcdc214997bb0E069057D8F7590BA9f1E7390498",
    poolToken: {
      symbol: "BNTCAP",
      decimals: "18",
      contract: "0x5afD005056d4b47EBFE31f4B4d33FD8C9Abf1817"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x43044f861ec040DB59A7e324c40507adDb673142"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0xCdde64592624Ed922e895f172CDaAaBa78891937",
    poolToken: {
      symbol: "BNTQASH",
      decimals: "18",
      contract: "0xbC5fe988433B97cDB1a578531c5380e8EC3242b1"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x618E75Ac90b12c6049Ba3b27f5d5F8651b0037F6"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xa6Bc8b07507bbEB13e21B82067a07802da8aEFBF",
    poolToken: {
      symbol: "TBCUSDB",
      decimals: "18",
      contract: "0x323e4d8097B0A58aB8210AC6efCC4a89285cFc6B"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x627974847450C45b60B3Fe3598f4e6E4cf945B9a"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xe1087bf96bE2336a2b6B09F6e33636df0d4CF680",
    poolToken: {
      symbol: "MLNUSDB",
      decimals: "18",
      contract: "0x0D6777BFc95b284eA9246c889E99903641129D72"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0x0216E9D74BD5BdA4C415778d854464A8d4a0efaB",
    poolToken: {
      symbol: "TBCBNT",
      decimals: "18",
      contract: "0x536545f6B120C2fD099370334097b35bB2403BC3"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x627974847450C45b60B3Fe3598f4e6E4cf945B9a"
    ]
  },
  {
    converterType: 1,
    version: 40,
    converterAddress: "0xE2ac1898e44a3Be16F823d2b1203E6e3B1407B37",
    poolToken: {
      symbol: "CBLTBNT",
      decimals: "18",
      contract: "0x7694298e99aedC4E37F855A8661B47d505Ce1b37"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x29a99c126596c0Dc96b02A88a9EAab44EcCf511e"
    ]
  },
  {
    converterType: 1,
    version: 14,
    converterAddress: "0xAc0763a04Ce3b9F00839288E9705076209E9E067",
    poolToken: {
      symbol: "USDB:PEGUSD",
      decimals: "18",
      contract: "0x846f7a6dE1eFbd7617760eBe1B89aa8CA2094025"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xd758b77BCC792AFD58857E1d5C610aE649FDEE6b"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0x4848b295326d49De8F83bD6663B8Cb091a730B06",
    poolToken: {
      symbol: "COMMBNT",
      decimals: "18",
      contract: "0xb83546551C9d4F6D7873804a7352FA930404260d"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xc7DeB5543CfA97b0Af2841418f53B8E554Ff566A"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0x999053a876e4080c682Cfb86a1b2382d8DfCA517",
    poolToken: {
      symbol: "CHZBNT",
      decimals: "18",
      contract: "0x34902D61c3f8D8809A8a2481C36DC514BEBA5cE8"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x3506424F91fD33084466F402d5D97f05F8e3b4AF"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0x86A43a57Cc762472B01d50009C4ED7C1cCD77C28",
    poolToken: {
      symbol: "cUSDBNT",
      decimals: "18",
      contract: "0xF0F9bbd5eBc79d7cAD9d35564Ef45aDcD802611e"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x5C406D99E04B8494dc253FCc52943Ef82bcA7D75"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0x753B73e51c7414F1ff1A10EC5f55aafD1787Ce50",
    poolToken: {
      symbol: "AUTOBNT",
      decimals: "18",
      contract: "0x0B21617eD9b15fd901e0b36b8eDF9d68aDc11Ad5"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x0Ed55F31EE2F9875A738C6496842b0E6519D7833"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0xFF116e5b56a8FEb357fDb63c9Fe9b3d67Ba14B7F",
    poolToken: {
      symbol: "FTHBNT",
      decimals: "18",
      contract: "0x3A946bb329f78CCBc75d836136De3a472Bdf5499"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xB414F8Ec2D14c64f37B1559CBE43746284514596"
    ]
  },
  {
    converterType: 1,
    version: 27,
    converterAddress: "0x1F60750F009745Bf0e139813C3786D10e744b50D",
    poolToken: {
      symbol: "pBTCUSDB",
      decimals: "18",
      contract: "0x6B09B01c19E4bD573eae4e235ee47CBD51dF3B6E"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x5228a22e72ccC52d415EcFd199F99D0665E7733b"
    ]
  },
  {
    converterType: 1,
    version: 27,
    converterAddress: "0x43C552eB8669D60929CE3D41f4632FE3b6CB79F2",
    poolToken: {
      symbol: "pBTCBNT",
      decimals: "18",
      contract: "0xEEF7551e59b34F431D71C7593249F61D5c52ce65"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x5228a22e72ccC52d415EcFd199F99D0665E7733b"
    ]
  },
  {
    converterType: 1,
    version: 25,
    converterAddress: "0xDA1e8397d4ABBAd40de926e24c7BaFd851386D0a",
    poolToken: {
      symbol: "SUSDDAI",
      decimals: "18",
      contract: "0xb2D679F6D676f173fAF3670a074B2C3A6D7Ebe28"
    },
    reserves: [
      "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
      "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0x55baD7CDDe403872E1A4EAB787F67177A41aA716",
    poolToken: {
      symbol: "ESTBNT",
      decimals: "18",
      contract: "0xd16a3A892695ec9a47EFFdD5247980a8d2be3fF2"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x0Efc2390C79C47452898a234a27F2b9C39A7a725"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0xc4bf6Dc46537AA77428CD87cFe57D817e76285A2",
    poolToken: {
      symbol: "UBTBNT",
      decimals: "18",
      contract: "0x290bd3a8F785a8dB30a0F6Baf9B88863b831747F"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x8400D94A5cb0fa0D041a3788e395285d61c9ee5e"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0xcFd79b484f33c8098E2fd279729BEcC1c53a362f",
    poolToken: {
      symbol: "KEYBNT",
      decimals: "18",
      contract: "0xa7e21e7584fc6fDf6Fa978a5d4981352B0260954"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x4CC19356f2D37338b9802aa8E8fc58B0373296E7"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0xd79Bd02053287a2a635B09b63136806D174d51a5",
    poolToken: {
      symbol: "BFZBNT",
      decimals: "18",
      contract: "0x6f8BeaDF9eCd851be239b616149aF3E69D49ce11"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xCFABaFF3bb057ba878f43ce027c9266D2F900561"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0xE1437F404451A00A9C555000b6f3cBA2480291c8",
    poolToken: {
      symbol: "ANKBNT",
      decimals: "18",
      contract: "0x437F7d93540094Da58F337644ba7D6E5Ad823564"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x3C45B24359fB0E107a4eAA56Bd0F2cE66C99A0E5"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x615FED2B7A84537E729D3dd32dE150bF0253fF10",
    poolToken: {
      symbol: "DAIBNT",
      decimals: "18",
      contract: "0xE5Df055773Bf9710053923599504831c7DBdD697"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0x62aeE73B82Cc64dd3c65ac220838210556C5c897",
    poolToken: {
      symbol: "HOTELBNT",
      decimals: "18",
      contract: "0x1344381f0e93a2A1Ab0BFd2fE209a9BD01343933"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xf8A2ED21fEa517665b35aC824387bf9b41c71919"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0xfDC38F68177634317146431E834F0838D4d0DFD3",
    poolToken: {
      symbol: "GRIGUSDB",
      decimals: "18",
      contract: "0x1F6e51ce0533A075fDd602FbD6159763aCaB579b"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x618aCb9601cb54244F5780F09536DB07d2C7aCf4"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0xe8b06d938a863bb2c82644125d7714844b8A98a4",
    poolToken: {
      symbol: "YHTSBNT",
      decimals: "18",
      contract: "0x04A3030c94Fb2dBE2b898d8cBf6Fd1c656FA69dd"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xcf33Eb02227255c45F595727Dbb24cE16afc36A2"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x3cd2ea665e45310d4a7baf0b8a378793691d49AA",
    poolToken: {
      symbol: "BLYBNT",
      decimals: "18",
      contract: "0x782E07B7Bbf908135D083c4f65459f8F1549a415"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xf8aD7dFe656188A23e89da09506Adf7ad9290D5d"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0x66437A8E8D98ee27B5F5B99aB7835b6A887d191b",
    poolToken: {
      symbol: "CRTSBNT",
      decimals: "18",
      contract: "0x0F92330EAaBa84CB54b068F4331Cc40Dd2A98236"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x825a64810e3EE35bD64c940140eA91a609608ABE"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0x8e11504d39dfc576a78cAC7FF835Bf9dcBb2453F",
    poolToken: {
      symbol: "LRCASTBNT",
      decimals: "18",
      contract: "0xE355dcF475ff7569B8b74d5165a532ABa87c25bf"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD"
    ]
  },
  {
    converterType: 1,
    version: 27,
    converterAddress: "0x850e6fDc53816Fb32d6A1B45aFD95e9e6420F9d7",
    poolToken: {
      symbol: "BTCDEFI",
      decimals: "18",
      contract: "0x534DF0Ec6D65cD6fE1b05D3b8c935c97Eb844190"
    },
    reserves: [
      "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      "0x3212b29E33587A00FB1C83346f5dBFA69A458923"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0x6cba561bB35919597531d9cF6720A48867fdA8c9",
    poolToken: {
      symbol: "AURELIO",
      decimals: "18",
      contract: "0x0aacA86e54Fe70eDd7c86cBF3cFb470caA49FAeF"
    },
    reserves: [
      "0x261EfCdD24CeA98652B9700800a13DfBca4103fF",
      "0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0xbB98e2d06B2AcD3E2E4694088B8B5A0014e222cD",
    poolToken: {
      symbol: "BTZCUSDB",
      decimals: "18",
      contract: "0x488E99fbCF49BFfC94cCae3B8eaCDd2Bd9aC981C"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x80640db285Cc63496bdd8c1980A7f4526A4D477F"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0x7D86d4d01DD72Db066655D38C1de0006c5B2224f",
    poolToken: {
      symbol: "WBTCpBTC",
      decimals: "18",
      contract: "0xFA3Bba432c0499c091F821aEB22FC36c4F8c78e3"
    },
    reserves: [
      "0x5228a22e72ccC52d415EcFd199F99D0665E7733b",
      "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x92826145C76D7808BA6a5eA1f8f5D491dfE440b5",
    poolToken: {
      symbol: "NTKWETH",
      decimals: "18",
      contract: "0x16EAcd526799C244CcBD8501422F542aAB07aAD4"
    },
    reserves: [
      "0x5D4d57cd06Fa7fe99e26fdc481b468f77f05073C",
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0x4b536A64f25f2070B5ACe6d79f6CeFf0D9Be4DC1",
    poolToken: {
      symbol: "USDC-DZAR",
      decimals: "18",
      contract: "0x4EB61146e9Ad2a9D395956eF410EBaF7459f4622"
    },
    reserves: [
      "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0xa4FfBDc5B0F5e61537c0F43FAD28Cf45E94BdE43",
    poolToken: {
      symbol: "sUSD-DZAR",
      decimals: "18",
      contract: "0x368B3D50E51e8bf62E6C73fc389e4102B9aEB8e2"
    },
    reserves: [
      "0x57Ab1E02fEE23774580C119740129eAC7081e9D3",
      "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0xC9A722be71Ac8B1Faa00c995e6d47835C933DAd6",
    poolToken: {
      symbol: "SNX-DZAR",
      decimals: "18",
      contract: "0x91AFdd8EF36DEf4fa2B9d7A05420f9D0E4F775d1"
    },
    reserves: [
      "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F",
      "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x4C10E60953C77d20dCC69E2462D794f14718adE6",
    poolToken: {
      symbol: "HYBNT",
      decimals: "18",
      contract: "0x31633C7c4f3FD374d187da5c19BBdb41DBdDdc86"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x9b53E429B0baDd98ef7F01F03702986c516a5715"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0x2727Da5FB75aA61876aD90Ec09c031C01919176B",
    poolToken: {
      symbol: "GRIDBNT",
      decimals: "18",
      contract: "0xDdde5DBa82B92DAF339fBB4cF1ec4d1CEC503075"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x4571c9937B2CB289c099C4e8daED68827D69f3A2",
    poolToken: {
      symbol: "TRBBNT",
      decimals: "18",
      contract: "0x58239b5529198E0ad76975Bab0842367A4Cc7D5b"
    },
    reserves: [
      "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0xa239EA1E43fCeAb1246eD819c88AC714B3c466aE",
    poolToken: {
      symbol: "UPTBNT",
      decimals: "18",
      contract: "0x5a602561342F74D161E64796613D7528Dd0993C1"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x67Abf1C62D8Acd07aDa35908d38Cd67bE7DfEB36"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0x971E89e5202e2E4d4cB16Bc89F742D151931559d",
    poolToken: {
      symbol: "USDRAY1",
      decimals: "18",
      contract: "0xFD556AB5010A4076fee1A232117E4ef549A84032"
    },
    reserves: [
      "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0xD4e88E23399b8cFCaF89CE5BEeD029D13513e6A5",
    poolToken: {
      symbol: "FCOUSDB",
      decimals: "18",
      contract: "0x94A2aAA374A8F2D52dad24330C8a0Ec2934700ae"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x4cbdaea41E4C864477E1430a896d9E3Bac11f593"
    ]
  },
  {
    converterType: 1,
    version: 27,
    converterAddress: "0xF8e14A1189ddFa7c1d2F3a4DE905935d420e9e70",
    poolToken: {
      symbol: "AGSBNT",
      decimals: "18",
      contract: "0x653F1FFC243D7B6F4ca65Df9520A80D0113dA3d6"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x7db5454F3500f28171d1f9c7a38527C9cF94e6b2"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0x6769c5309967Ccf6b5E5eB340089fBE7957397d1",
    poolToken: {
      symbol: "PARETOWETHUSDCBNT",
      decimals: "18",
      contract: "0x2f4EF142cd9983B1f86dF21BEd3cE12E06856dCb"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0x18d76D2d0a624AB973F1C98e8916aa45253b115c",
    poolToken: {
      symbol: "EMIT1USDB",
      decimals: "18",
      contract: "0x37Be876EF051eB8EDdD0745107c5222D8CA8EC60"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xb5f278Ee11811eFEC0692EC61b1e9f9984f2de11"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0xA64906C4434211ce9f3Ac2702D5f60b21EB02E74",
    poolToken: {
      symbol: "MDZAUSDB",
      decimals: "18",
      contract: "0x7651021390129c9c2672f47292C31b33f63EE5Cc"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x0eCDd783dc7bF820614044B51862ED29714d2BA5"
    ]
  },
  {
    converterType: 1,
    version: 25,
    converterAddress: "0x274b4b35eE47622016d94b7eD14460de00AA504A",
    poolToken: {
      symbol: "TSTST",
      decimals: "18",
      contract: "0x10ef8f03cd0F3D7Bc14A04ba2C173414aA8C5E7E"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xf462769d8C7f31A07d1636D9d492c0E592D804f4",
    poolToken: {
      symbol: "RPLBNT",
      decimals: "18",
      contract: "0xB9fe4BD869a132137B668054ea48C897c0654ee4"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xB4EFd85c19999D84251304bDA99E90B92300Bd93"
    ]
  },
  {
    converterType: 1,
    version: 27,
    converterAddress: "0x554A544F2A21e5E13E42de5BCdDca6962ec2a478",
    poolToken: {
      symbol: "EMIT1USDB2FCO",
      decimals: "18",
      contract: "0x2a3a6596B35735EfaC3577dC36bF750bfe5888e8"
    },
    reserves: [
      "0x37Be876EF051eB8EDdD0745107c5222D8CA8EC60",
      "0xEE4dC4C5Ca843B83035d8E5159AC1bd1b4EbdfF5"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0xB485A5F793B1DEadA32783F99Fdccce9f28aB9a2",
    poolToken: {
      symbol: "CGTBNT",
      decimals: "18",
      contract: "0x9ceE7038Fc154D92d009c2Dd8ac083b557495713"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xF5238462E7235c7B62811567E63Dd17d12C2EAA0"
    ]
  },
  {
    converterType: 1,
    version: 23,
    converterAddress: "0x121A7b80D7E73dbe928f783d4009074063bF659D",
    poolToken: {
      symbol: "STMBNT",
      decimals: "18",
      contract: "0x452821f74Ab9d38EDD3145C59280aC1bCBCe9B81"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x0E22734e078d6e399BCeE40a549DB591C4EA46cB"
    ]
  },
  {
    converterType: 1,
    version: 27,
    converterAddress: "0xd6562db5451534f9422c0b582bE48D2E0A37A919",
    poolToken: {
      symbol: "XRTBNT",
      decimals: "18",
      contract: "0x111252C5A7fb75d541071753bd1fAAf367d0321F"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x7dE91B204C1C737bcEe6F000AAA6569Cf7061cb7"
    ]
  },
  {
    converterType: 1,
    version: 27,
    converterAddress: "0x444Bd9a308Bd2137208ABBcc3efF679A90d7A553",
    poolToken: {
      symbol: "STAWETH",
      decimals: "18",
      contract: "0xbaD59113679717e0a9D5324d289DA6c5Fa8862E2"
    },
    reserves: [
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      "0xa7DE087329BFcda5639247F96140f9DAbe3DeED1"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xC37E82FF3A6a9C41779C5801408755776Ce555Aa",
    poolToken: {
      symbol: "ETHBNT",
      decimals: "18",
      contract: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ]
  },
  {
    converterType: 1,
    version: 29,
    converterAddress: "0x5C8c7Ef16DaC7596C280E70C6905432F7470965E",
    poolToken: {
      symbol: "ETHUSDB",
      decimals: "18",
      contract: "0x482c31355F4f7966fFcD38eC5c9635ACAe5F4D4F"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ]
  },
  {
    converterType: 1,
    version: 29,
    converterAddress: "0x05e770141538e82C04a374bc11DA9B54fB50d28F",
    poolToken: {
      symbol: "INVOXBNT",
      decimals: "18",
      contract: "0xD86f489a495426B1847dBd4b5D85f4832E6D7225"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x4485561Db76614Ff727f8E0a3Ea95690b8b16022"
    ]
  },
  {
    converterType: 1,
    version: 29,
    converterAddress: "0x0429e43f488D2D24BB608EFbb0Ee3e646D61dE71",
    poolToken: {
      symbol: "XZARBNT",
      decimals: "18",
      contract: "0xdB7B2616210Bd0068D914eEB7E31aFD2Da517444"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x48f07301E9E29c3C38a80ae8d9ae771F224f1054"
    ]
  },
  {
    converterType: 1,
    version: 29,
    converterAddress: "0x7FF01DB7ae23b97B15Bc06f49C45d6e3d84df46f",
    poolToken: {
      symbol: "STONKBNT",
      decimals: "18",
      contract: "0xc570Bae3772b618a981c4A5AaD51bc3e222E7A3B"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xb60Fde5D798236fBF1e2697B2A0645380921FccF"
    ]
  },
  {
    converterType: 1,
    version: 29,
    converterAddress: "0x16ff969cC3A4AE925D9C0A2851e2386d61E75954",
    poolToken: {
      symbol: "STADIFX",
      decimals: "18",
      contract: "0xC1a01Cc1F147A1a7e35E8caBFDe80706E76522dE"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x0e511Aa1a137AaD267dfe3a6bFCa0b856C1a3682"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0xcAf6Eb14c3A20B157439904a88F00a8bE929c887",
    poolToken: {
      symbol: "WEBBNT",
      decimals: "18",
      contract: "0x5094841D5eE018a5E29E23055aFC263093f95a3E"
    },
    reserves: [
      "0x840fe75ABfaDc0F2d54037829571B2782e919ce4",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x1a7eC550f463138f283C542D755cc28c5b6E26C3",
    poolToken: {
      symbol: "PEGUSDB",
      decimals: "18",
      contract: "0xE421EA0DB7A0B5bebB4b9b258D864a68546c0881"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x8Ae56a6850a7cbeaC3c3Ab2cB311e7620167eAC8"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0xdf6b463F27bE26110c20C1e3BDE480bD5Fc057d9",
    poolToken: {
      symbol: "ICTBNT",
      decimals: "18",
      contract: "0xb381D21c09BaC7278b6802193167A2a01127b976"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x2d71983E810B9e95258966B9c164C4d61a829bA9"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x5C1E2F8320Bfe3a5558B4eB529c823c3bB468C18",
    poolToken: {
      symbol: "DCXUSDB",
      decimals: "18",
      contract: "0x50eA977Abd2e622241d5074fa15B97eB823B3ED5"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x199c3DdedB0e91dB3897039AF27c23286269F088"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x63CBbfB48B5cC9ea4B87b1B6A3a6abD70DD8A9eC",
    poolToken: {
      symbol: "SFGBEMITUSDB",
      decimals: "18",
      contract: "0x325732Fd6d9b98f60acFb6215eDe90B9F9bAD38a"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x7cE0641D19095ed3226fC5222836901bcE41585D"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x53E9c0Ee79Ab9Ccb46939685E1E62245Adf90Cba",
    poolToken: {
      symbol: "STCUSDB",
      decimals: "18",
      contract: "0x9DB9CcFC66e5caCdEf842c2F04fCD7d31C3fA137"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xb8B7791b1A445FB1e202683a0a329504772e0E52"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x6e7646C7c4D4cf22d24FBAf990Cdc2C62aA1A7F5",
    poolToken: {
      symbol: "GLDRBNT",
      decimals: "18",
      contract: "0xb2aFA773c749F988B82CAb56284d0F1b01c7E2dC"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xF2BA4AFcBE22F0e626d67D8f31E96428706282e9"
    ]
  },
  {
    converterType: 1,
    version: 30,
    converterAddress: "0x7aA2b23eA10c4E8C778F60a93D1c25780DB14075",
    poolToken: {
      symbol: "LKSCBNT",
      decimals: "18",
      contract: "0x500f3e107A6d62bb15394892a22495ACF71D007F"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xfC4A2Cd574bdcC385173f03A6a52cC3B853BB9d4"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x1168d7C63ffa5baa167004f2b81b7f7104b4101C",
    poolToken: {
      symbol: "FOURUSDB",
      decimals: "18",
      contract: "0x23736A2c9728C309039831c245754E19cEd07546"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x4730fB1463A6F1F44AEB45F6c5c422427f37F4D0"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x8863fE594289c281Aa385029904EE4575c775587",
    poolToken: {
      symbol: "ONTOBNT",
      decimals: "18",
      contract: "0x992EcEA6bEf983168Fcb264C8b2C9A15E274e02F"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xCB0aD5f479812edD6e2cED1cfE621bF39D7E9158"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x05840ca15Bef62b48FD2248CB688860C8A69aDff",
    poolToken: {
      symbol: "EXOBNT",
      decimals: "18",
      contract: "0xa8E7117ac5d76fC147B71524780327AA218B5612"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xE58E751abA3B9406367B5F3CbC39c2Fa9B519789"
    ]
  },
  {
    converterType: 1,
    version: 42,
    converterAddress: "0xA2C1dE568B70BC8b3565F1240D43b6949Bfe183A",
    poolToken: {
      symbol: "USDTBNT",
      decimals: "18",
      contract: "0x5365B5BC56493F08A38E5Eb08E36cBbe6fcC8306"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    ]
  },
  {
    converterType: 1,
    version: 20,
    converterAddress: "0x39e5AAE547752c1239b4738e75cDF705c25adeA6",
    poolToken: {
      symbol: "USDTUSDB",
      decimals: "18",
      contract: "0xF2ff22976B973d6bcC17a7dC93B719162ADA2045"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0xEF8c6c64926A9548210adDC22e8ed6034E39b0Da",
    poolToken: {
      symbol: "USDARY",
      decimals: "18",
      contract: "0x1F5350558F1E3e8Bf370d4d552F3ebC785bf2979"
    },
    reserves: [
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x7fF10d4AdD8c9c2F5E47798cD60544Ad91c1F4eC",
    poolToken: {
      symbol: "ECCUSDT",
      decimals: "18",
      contract: "0xc83300a16de6518Dd0Be5ad656F3d6f197A30692"
    },
    reserves: [
      "0xD5bF66fF3Dab4c74Ac6014fd2181Bd3aD1bBaF32",
      "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0x99e8e0e3D4cd50f856f675567FeC8eb732CfE2d7",
    poolToken: {
      symbol: "USDZAR",
      decimals: "18",
      contract: "0x09C5188d9fE33d218Cc186baE8F985907b25eBEe"
    },
    reserves: [
      "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
      "0x57Ab1E02fEE23774580C119740129eAC7081e9D3"
    ]
  },
  {
    converterType: 1,
    version: 26,
    converterAddress: "0x6DAE0133395AeC73B122fF010Ce85b78209310C2",
    poolToken: {
      symbol: "USDZAR 7030",
      decimals: "18",
      contract: "0xf001bC665ffac52c6a969305c3BDaaf88DE4bBC8"
    },
    reserves: [
      "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x81b4bd459f3f73433222D7E5439E3640A4BF4B5B",
    poolToken: {
      symbol: "MPTBNT",
      decimals: "18",
      contract: "0xb47Bd84C954Fa597B40fe41D4e116fb0eF2468bb"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x2cC1bE643e0882fB096f7f96d2b6Ca079ad5270c"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x86412aef21A2BB0BE5ac7bd98C7375d655e30420",
    poolToken: {
      symbol: "ALBTUSDT",
      decimals: "18",
      contract: "0x01697e379E6B2dA6A6D052BAa09F98488433e167"
    },
    reserves: [
      "0x00a8b738E453fFd858a7edf03bcCfe20412f0Eb0",
      "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    ]
  },
  {
    converterType: 1,
    version: 31,
    converterAddress: "0x8f22D68c4F39d750A53fD51F4D8A03d8A2F25b03",
    poolToken: {
      symbol: "CAPCCAPg",
      decimals: "18",
      contract: "0x1f3fb50488124EB0d5Cf0d2b22CA7c8ed00e2344"
    },
    reserves: [
      "0x79A91cCaaa6069A571f0a3FA6eD257796Ddd0eB4",
      "0x107721d9aA07d9DE8f2CC9545e0C9346A9Bb503b"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x7fC1f8F9D20f8940BAE62A594ed5f4B3A4568f1C",
    poolToken: {
      symbol: "JNTR/e",
      decimals: "18",
      contract: "0x2f005Cc29267f3B57E643B01575ec81789947142"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x1368452Bfb5Cd127971C8DE22C58fBE89D35A6BF"
    ]
  },
  {
    converterType: 1,
    version: 39,
    converterAddress: "0x1393D065DF58ddb7874c280bb2D11a5e1e9eE96f",
    poolToken: {
      symbol: "YFMBNT",
      decimals: "18",
      contract: "0x7a553617592d5b67Ef4D8B9aa67aa2A539463900"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xa665FED1b0C9dA00e91ca582f77dF36E325048c5"
    ]
  },
  {
    converterType: 1,
    version: 39,
    converterAddress: "0x29FE708D175C2Bc416139bA0272ADf975fE6d418",
    poolToken: {
      symbol: "ACPTBNT",
      decimals: "18",
      contract: "0x9E7749E446572842C7c0E1B76b673e9D1332db11"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0xcAd2d4C4469fF09aB24d02A63BCeDfCD44bE0645"
    ]
  },
  {
    converterType: 1,
    version: 40,
    converterAddress: "0x9f860A2C3786074e37fA2ab03B245A97E0e1F43E",
    poolToken: {
      symbol: "MITxUSDB",
      decimals: "18",
      contract: "0x7482326Eb7E44Aec1269C052B9B1aF26606b0B90"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x4a527d8fc13C5203AB24BA0944F4Cb14658D1Db6"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xA6cA935241a3EbCb0156C178103aa4827280f886",
    poolToken: {
      symbol: "ALEPHBNT",
      decimals: "18",
      contract: "0x3b8c8147325C378cfe10f7b8c3aB1683D300dF27"
    },
    reserves: [
      "0x27702a26126e0B3702af63Ee09aC4d1A084EF628",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x15C6aC6Fc9d4179D9b799e709C1AfD726bA97418",
    poolToken: {
      symbol: "BALBNT",
      decimals: "18",
      contract: "0x3E22d87977dA52Accef2Af9Eb50f76bd31b7b6B1"
    },
    reserves: [
      "0xba100000625a3754423978a60c9317c58a424e3D",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x9fd87e582BF14aB33121BD92274aa0bA4A62b4E2",
    poolToken: {
      symbol: "BANDBNT",
      decimals: "18",
      contract: "0x44Fa59B2F044367f9F027b7694fD3BacbF22c3d5"
    },
    reserves: [
      "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x485e61D9549b65AbDb1EAbD15Cc30A1aB00f6cAF",
    poolToken: {
      symbol: "BUSDBNT",
      decimals: "18",
      contract: "0x7b86306D72103Ccd5405DF9dBFf4B794C46EBbC9"
    },
    reserves: [
      "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x9b730363cFff06Ca6E976f8c549d1B6764ba021C",
    poolToken: {
      symbol: "BZRXBNT",
      decimals: "18",
      contract: "0xE39c4Ae17C0d44e923B784794B3Ea419c04F02FA"
    },
    reserves: [
      "0x56d811088235F11C8920698a204A5010a788f4b3",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x70B4a71Ad893C2E775Cecd8855E7c6F95fB5af21",
    poolToken: {
      symbol: "CELBNT",
      decimals: "18",
      contract: "0xA31BF9E52B92ABF37D1d126ad2D9a6d0Ce9637f0"
    },
    reserves: [
      "0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x303D1F3ff37A878d4023702be8d70a82A49D74Eb",
    poolToken: {
      symbol: "CHERRYBNT",
      decimals: "18",
      contract: "0xED8562cf805936AFdd2A405e7ACe80f78efc4Ed5"
    },
    reserves: [
      "0x4eCB692B0fEDeCD7B486b4c99044392784877E8C",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x7deb97229DBF5aaC741C62b36E8dde9F541F9CC1",
    poolToken: {
      symbol: "COMPBNT",
      decimals: "18",
      contract: "0xB4c5BC0d1d41F3440c580A0F52B6641E4A913Df4"
    },
    reserves: [
      "0xc00e94Cb662C3520282E6f5717214004A7f26888",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x40280D2A19a52E064DF1Cc68F8d4f77856FD6A71",
    poolToken: {
      symbol: "CROBNT",
      decimals: "18",
      contract: "0x8e7970eca4be7F186A5D7acdc8dcF778EA26Ee9b"
    },
    reserves: [
      "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xcD4B9ef178394B92b90cFD076FDf8C024461ca13",
    poolToken: {
      symbol: "CRVBNT",
      decimals: "18",
      contract: "0xe783E81cf1b5bf475aDB76e41a2AB996c6e2ae50"
    },
    reserves: [
      "0xD533a949740bb3306d119CC777fa900bA034cd52",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xAe46E888aF6318aED82FE715b1b98b78F74e7b65",
    poolToken: {
      symbol: "DXDBNT",
      decimals: "18",
      contract: "0xB3aF30c0c1a9673E14c9B0C56eCd4cBBeB0F6c48"
    },
    reserves: [
      "0xa1d65E8fB6e87b60FECCBc582F7f97804B725521",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xBDfFd4Fa6Fd5C8D3B9AbD81C9f7b71681A96763e",
    poolToken: {
      symbol: "EWTBBNT",
      decimals: "18",
      contract: "0x66948fEFCcc464c714574a884c0458981Cbd944C"
    },
    reserves: [
      "0x178c820f862B14f316509ec36b13123DA19A6054",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xEcC601451e84Ea5eFb61e60A3e4e7BbC56E69b79",
    poolToken: {
      symbol: "ZRXBNT",
      decimals: "18",
      contract: "0xa09B58ECeFA3a5d3736Ba9E2E002ca566Adf08eb"
    },
    reserves: [
      "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x17A0edF4E67ED4C7FF3A3D06E0aAF7f38A3537D6",
    poolToken: {
      symbol: "GUSDBNT",
      decimals: "18",
      contract: "0x5A576922849dF442f1Dc0c3bA7b3c345EdB2bd44"
    },
    reserves: [
      "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x834d0Af9a86431F3a366f20320c332E95E822E1a",
    poolToken: {
      symbol: "QNTBNT",
      decimals: "18",
      contract: "0xD6bF84B5D6F4d1288C39f2486688e949B1423E62"
    },
    reserves: [
      "0x4a220E6096B25EADb88358cb44068A3248254675",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xc314527CA3329bEDb35b3ec2657a5Bb2a0b01A83",
    poolToken: {
      symbol: "LINKBNT",
      decimals: "18",
      contract: "0x04D0231162b4784b706908c787CE32bD075db9b7"
    },
    reserves: [
      "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xcCD95D042C598fB4AD544dF2b47D6C749d99A83a",
    poolToken: {
      symbol: "LRCBNT",
      decimals: "18",
      contract: "0xF5A203E16ab9B850b27f1F00C37352b6b7A28339"
    },
    reserves: [
      "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x38894871b6beEF3fc18C3de6cF66d8252D65B49C",
    poolToken: {
      symbol: "MATICBNT",
      decimals: "18",
      contract: "0x8151E0Fbbc10Af5b0F16B413dB0747169e9687d9"
    },
    reserves: [
      "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xa8BaE685a9213a27bC82ef782d1ba40964497dB1",
    poolToken: {
      symbol: "MLNBNT",
      decimals: "18",
      contract: "0xff2CCF332A2d6CD645f93c19690104B99943b13D"
    },
    reserves: [
      "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x1051f6DD42407908372Ba241206EBD33091b1BC5",
    poolToken: {
      symbol: "MTABNT",
      decimals: "18",
      contract: "0x3035529E7aE11A3660134c9C875F4faa6514d042"
    },
    reserves: [
      "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xE9275ab4689B15C4E00de8F9c5e03e00358FC7Ab",
    poolToken: {
      symbol: "OCEANBNT",
      decimals: "18",
      contract: "0xCDfF066eDf8a770E9b6A7aE12F7CFD3DbA0011B5"
    },
    reserves: [
      "0x967da4048cD07aB37855c090aAF366e4ce1b9F48",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x9d614e61Fda55cdd10d6e73C333E23E41E2B37e2",
    poolToken: {
      symbol: "RARIBNT",
      decimals: "18",
      contract: "0xb5faf55A4bD812a918c68F629A00d8F9750a2C4d"
    },
    reserves: [
      "0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xAcba46e8654Bc8c55dd0CBDaF22b5e30036fAced",
    poolToken: {
      symbol: "RENBNT",
      decimals: "18",
      contract: "0x6b181C478b315bE3f9E99c57CE926436c32e17a7"
    },
    reserves: [
      "0x408e41876cCCDC0F92210600ef50372656052a38",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xd1A758f84BF6762bdF6F795a9DdeE35eB0597ee4",
    poolToken: {
      symbol: "renBTCBNT",
      decimals: "18",
      contract: "0xb479b102bF135bdC666d6916172422CbaD9E977f"
    },
    reserves: [
      "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xB7588B165Cc8F51177Df4902Cd7839052B8c49b2",
    poolToken: {
      symbol: "renZECBNT",
      decimals: "18",
      contract: "0x986D522a4f9fd0b4158A88657a06A552f83C3e27"
    },
    reserves: [
      "0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x7beDCB884146D1D8422E4cE56E7CeE62799A9f84",
    poolToken: {
      symbol: "RSRBNT",
      decimals: "18",
      contract: "0x7d402c5CF587D4dEC6761C51E0aA903956495851"
    },
    reserves: [
      "0x8762db106B2c2A0bccB3A80d1Ed41273552616E8",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xb39c206ec37B1aBCE8602c4f5EaafA99D3c10DDD",
    poolToken: {
      symbol: "sBTCBNT",
      decimals: "18",
      contract: "0x63bc130401dc9f7F70203B01D1875d0D2779dc96"
    },
    reserves: [
      "0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xB2E1f4E30ceF322ac7a8E612AE2217ED00F7962A",
    poolToken: {
      symbol: "SNXBNT",
      decimals: "18",
      contract: "0xAdAA88CA9913f2d6F8Caa0616Ff01eE8D4223fde"
    },
    reserves: [
      "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x3BAbeA45ef298aD4935090365b7F8997F478a9dd",
    poolToken: {
      symbol: "SRMBNT",
      decimals: "18",
      contract: "0x6cfd8b295D64d84178ad7447a5Bb4488bC846005"
    },
    reserves: [
      "0x476c5E26a75bd202a9683ffD34359C0CC15be0fF",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x8D30d8184F0469C8a28a753fBf52CadeCE748110",
    poolToken: {
      symbol: "STAKEBNT",
      decimals: "18",
      contract: "0x5062743A788D271FA247C3dA7Cd5af73Fd687BA8"
    },
    reserves: [
      "0x0Ae055097C6d159879521C384F1D2123D1f195e6",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xa60B057673809956ae3cA9A0E0bc246efD4F8339",
    poolToken: {
      symbol: "sUSDBNT",
      decimals: "18",
      contract: "0xd2C9F2A62f9a1e80cD76392c02491212a2230cF4"
    },
    reserves: [
      "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x5820FdDC9Ae2a2b1F8cabdBF7266e0B36DB4E45A",
    poolToken: {
      symbol: "SUSHIBNT",
      decimals: "18",
      contract: "0xB2145C7f9249d79197fe3cB87333187eB4FC1Eec"
    },
    reserves: [
      "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x68eAe22C00Aa8D67ddeD72186354b773dDA03077",
    poolToken: {
      symbol: "SXPBNT",
      decimals: "18",
      contract: "0xa301Ad444e72F11590e3712bBb7aD0aC959b90C2"
    },
    reserves: [
      "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x2dF5692aCc1E0Fec909870D05789B65C9B10b9a1",
    poolToken: {
      symbol: "UMABNT",
      decimals: "18",
      contract: "0x9Ca631b980DeC1eEba001BBfaC8da5A9e7d744fF"
    },
    reserves: [
      "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x868a85285901f4a818CE2e094f2852087c502161",
    poolToken: {
      symbol: "TOMOEBNT",
      decimals: "18",
      contract: "0x0dc75ECCcF5B784b793686e614C2E9dCdda63738"
    },
    reserves: [
      "0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x37cDEC400afaaD77278fbc34876e083B520B2D7a",
    poolToken: {
      symbol: "UNIBNT",
      decimals: "18",
      contract: "0x8b3082e273E4B923830c637a203c1C1D963cA307"
    },
    reserves: [
      "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x99049F92Fb57a54E77be1e45E0E6b9Eb2fc5A2EB",
    poolToken: {
      symbol: "wNXMBNT",
      decimals: "18",
      contract: "0x75aB5e15129BBBEcB5C5Fdb71d1ff7D5dA97d56c"
    },
    reserves: [
      "0x0d438F3b5175Bebc262bF23753C1E53d03432bDE",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x9258Af079065857C01466CebDCFA2CFB6AA4983C",
    poolToken: {
      symbol: "YFIBNT",
      decimals: "18",
      contract: "0xAeB3a1AeD77b5D6e3feBA0055d79176532e5cEb8"
    },
    reserves: [
      "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xD10591e2b47667AD9E543f780d5105E54Cc7C9D9",
    poolToken: {
      symbol: "LENDBNT",
      decimals: "18",
      contract: "0x020F8aCf2Dea7Ad1CF8413431e427F684181C6BA"
    },
    reserves: [
      "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x228F9EE87413a1BE69ef780eef2302b680d4863d",
    poolToken: {
      symbol: "USDCBNT",
      decimals: "18",
      contract: "0x874d8dE5b26c9D9f6aA8d7bab283F9A9c6f777f4"
    },
    reserves: [
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x112C5405d005F5e9C32eDB9A6B59E255B044126C",
    poolToken: {
      symbol: "BUFFGATEBNT",
      decimals: "18",
      contract: "0x2d35087923194400d329EE74b45CBc77b7d573Ff"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x0B244e01B1B0C9a959b3b0Bc19E3852395319876"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xc11C56aa3cCb9c5065B2Be46Bbb50A83C5dC5012",
    poolToken: {
      symbol: "BUFFGATEUSDB",
      decimals: "18",
      contract: "0x37382ca45EFc45bd1A53649Ab98D3Fa337e56A2F"
    },
    reserves: [
      "0x309627af60F0926daa6041B8279484312f2bf060",
      "0x0B244e01B1B0C9a959b3b0Bc19E3852395319876"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0xB20814d5cc0D723fefaad3BB9d74a2d90B3165D3",
    poolToken: {
      symbol: "BNTFTT",
      decimals: "18",
      contract: "0xD9c195c9E1C49e86C7A0F0E29627CB8F8523A7fb"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x2AEC18c5500f21359CE1BEA5Dc1777344dF4C0Dc"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x52056B47F604216cf99782788922460F4E8E8c71",
    poolToken: {
      symbol: "AAVEBNT",
      decimals: "18",
      contract: "0x6c84F4ccC916ACf792538f1293b286b540906A2a"
    },
    reserves: [
      "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
    ]
  },
  {
    converterType: 1,
    version: 41,
    converterAddress: "0x25F98800cd9d3FeEF2031d1C0b3FD1f7Cb83E4FF",
    poolToken: {
      symbol: "JRT90BNT10",
      decimals: "18",
      contract: "0xE274C0cCf7B0bC1eF29FFf9AD5eC98E9B5c45e84"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x8A9C67fee641579dEbA04928c4BC45F66e26343A"
    ]
  },
  {
    converterType: 1,
    version: 42,
    converterAddress: "0x8c3FBcfCB0f63eDdeD00b87C93B824DB86aa1D59",
    poolToken: {
      symbol: "BNTvBNT",
      decimals: "18",
      contract: "0xBA04e539da9e7a6491A6c6ae38D9750226a3D36b"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94"
    ]
  },
  {
    converterType: 1,
    version: 42,
    converterAddress: "0x947fe1e19048f4D1213dd5107eeB77D7748Eea10",
    poolToken: {
      symbol: "COTBNT",
      decimals: "18",
      contract: "0x19dB077A54dEa3fD4CBCd9d31D4dB297562CbD94"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x5c872500c00565505F3624AB435c222E558E9ff8"
    ]
  },
  {
    converterType: 1,
    version: 42,
    converterAddress: "0x112fA1C7759c8f3cb8ae8ef5AC2eee31Fb78947b",
    poolToken: {
      symbol: "XTRD",
      decimals: "18",
      contract: "0x295F136eB8c8D1429a77A2B5E0851AA035c8297C"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x9c794f933b4DD8B49031A79b0f924D68BEF43992"
    ]
  },
  {
    converterType: 1,
    version: 42,
    converterAddress: "0xc45aB6f39D6a87347aB4A46e2501dc5c78Aa5cd7",
    poolToken: {
      symbol: "REAL",
      decimals: "18",
      contract: "0xdbcaE67ECBA9DAAC61B1167cc8108B63BF8d59A2"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x6b4389Afb3e243A65668B7311fA9Ef092A8a3B64"
    ]
  },
  {
    converterType: 1,
    version: 42,
    converterAddress: "0x76ec8350FDB0061E15760D743b11FD183480D5A5",
    poolToken: {
      symbol: "BNTGRG",
      decimals: "18",
      contract: "0x0Dc4320ba50b7E05FC73b4531C59aCB46c5A7dD6"
    },
    reserves: [
      "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
      "0x4FbB350052Bca5417566f188eB2EBCE5b19BC964"
    ]
  }
];

const relaysDump = [
  {
    anchor: {
      poolContainerAddress: "0xa88Fd7560efc654d86cF3728785f94a8Bc48BDAe",
      poolTokens: [
        {
          reserveId: "0x408e41876cCCDC0F92210600ef50372656052a38",
          poolToken: {
            contract: "0x716BBCF0D084DDCC1d3C6c20bD46c54A93553fdC",
            decimals: 18,
            network: "ETH",
            symbol: "RENBNT1"
          }
        },
        {
          reserveId: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolToken: {
            contract: "0xcd1A771e8c77eCc4d259E25E21C9BB1EEF7D6197",
            decimals: 18,
            network: "ETH",
            symbol: "RENBNT2"
          }
        }
      ]
    },
    contract: "0xD5aA38C6Df168741839F9E1e9c51e6d24b986970",
    id: "0xa88Fd7560efc654d86cF3728785f94a8Bc48BDAe",
    converterType: 2,
    isMultiContract: false,
    network: "ETH",
    reserves: [
      {
        contract: "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
        decimals: 18,
        network: "ETH",
        symbol: "BNT",
        reserveWeight: 0.196943,
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
          poolId: "0xa88Fd7560efc654d86cF3728785f94a8Bc48BDAe",
          priority: 10,
          liqDepth: 114637.65781484911,
          costByNetworkUsd: 0.94692189
        }
      },
      {
        contract: "0x408e41876cccdc0f92210600ef50372656052a38",
        decimals: 18,
        network: "ETH",
        symbol: "REN",
        reserveWeight: 0.803057,
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/ren.png",
          name: "Republic"
        },
        reserveFeed: {
          reserveAddress: "0x408e41876cccdc0f92210600ef50372656052a38",
          poolId: "0xa88Fd7560efc654d86cF3728785f94a8Bc48BDAe",
          priority: 10,
          liqDepth: 467447.80759823543,
          costByNetworkUsd: 0.3001905222003756,
          change24H: -34.91796864096264,
          volume24H: 0
        }
      }
    ],
    version: "37",
    fee: 0.002
  },
  {
    anchor: {
      poolContainerAddress: "0xC42a9e06cEBF12AE96b11f8BAE9aCC3d6b016237",
      poolTokens: [
        {
          reserveId: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
          poolToken: {
            contract: "0x7b5b7c0534cd37fd7B637b46D9e9CdD3D7e3acD9",
            decimals: 18,
            network: "ETH",
            symbol: "LINKBNT1"
          }
        },
        {
          reserveId: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolToken: {
            contract: "0x5C38eD1Df9E2E46D67CcA448164D8313867945E9",
            decimals: 18,
            network: "ETH",
            symbol: "LINKBNT2"
          }
        }
      ]
    },
    contract: "0xA6CC5967be74A2b959D18469eBfb54ED317bC4B3",
    id: "0xC42a9e06cEBF12AE96b11f8BAE9aCC3d6b016237",
    converterType: 2,
    isMultiContract: false,
    network: "ETH",
    reserves: [
      {
        contract: "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
        decimals: 18,
        network: "ETH",
        symbol: "BNT",
        reserveWeight: 0.776262,
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c",
          poolId: "0xC42a9e06cEBF12AE96b11f8BAE9aCC3d6b016237",
          priority: 10,
          liqDepth: 128757.47399164128,
          costByNetworkUsd: 0.94692189
        }
      },
      {
        contract: "0x514910771af9ca656af840dff83e8264ecf986ca",
        decimals: 18,
        network: "ETH",
        symbol: "LINK",
        reserveWeight: 0.223738,
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/chainlink.jpg",
          name: "ChainLink Token"
        },
        reserveFeed: {
          reserveAddress: "0x514910771af9ca656af840dff83e8264ecf986ca",
          poolId: "0xC42a9e06cEBF12AE96b11f8BAE9aCC3d6b016237",
          priority: 10,
          liqDepth: 37111.10387464778,
          costByNetworkUsd: 12.658404933702752
        }
      }
    ],
    version: "37",
    fee: 0.001
  },
  {
    anchor: {
      symbol: "AMPLBNT",
      decimals: 18,
      contract: "0x0e2145A23f7810431Ba0f2e19676530b3F1Fb0EC",
      network: "ETH"
    },
    contract: "0x7f913E9DeeF8eFE8d09A2e67d18cEd9BE4Ad1dc7",
    converterType: 1,
    fee: 0.001,
    id: "0x0e2145A23f7810431Ba0f2e19676530b3F1Fb0EC",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "57684089619389104611840",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "59216016963412",
        id: "0xD46bA6D942050d489DBd938a2C909A5d5039A161"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "57684089619389104611840",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x0e2145A23f7810431Ba0f2e19676530b3F1Fb0EC",
          liqDepth: 54622.3271653213,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "AMPL",
        decimals: 9,
        contract: "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
        reserveBalance: "59216016963412",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/ampleforth_32.png",
          name: "Ampleforth"
        },
        reserveFeed: {
          reserveAddress: "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
          poolId: "0x0e2145A23f7810431Ba0f2e19676530b3F1Fb0EC",
          costByNetworkUsd: 0.9224248770239137,
          liqDepth: 54622.3271653213,
          priority: 10,
          change24H: -28.967351219252098,
          volume24H: 12671.334407
        }
      }
    ],
    version: "14"
  },
  {
    anchor: {
      symbol: "BUSDUSDB",
      decimals: 18,
      contract: "0xE94C892f90ABea59F3dd1D7d8c34aC9d7312F18A",
      network: "ETH"
    },
    contract: "0x235d4FD0D13784c848712c30f2Da03925496FBd4",
    converterType: 1,
    fee: 0.001001,
    id: "0xE94C892f90ABea59F3dd1D7d8c34aC9d7312F18A",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "4364328215225896170",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "3948468389813907474",
        id: "0x4Fabb145d64652a948d72533023f6E7A623C7C53"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "4364328215225896170",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xE94C892f90ABea59F3dd1D7d8c34aC9d7312F18A",
          liqDepth: 4.364328215225895,
          costByNetworkUsd: 0.9999999999999999,
          priority: 10
        }
      },
      {
        symbol: "BUSD",
        decimals: 18,
        contract: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
        reserveBalance: "3948468389813907474",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/busd.png",
          name: "Binance USD"
        },
        reserveFeed: {
          reserveAddress: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
          poolId: "0xE94C892f90ABea59F3dd1D7d8c34aC9d7312F18A",
          costByNetworkUsd: 1.10532180692767,
          liqDepth: 4.364328215225895,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "SYB7BNT",
      decimals: 18,
      contract: "0xDC610F8eecE47E9F91209C77C8674C40d2d8E17F",
      network: "ETH"
    },
    contract: "0x1e9653f8A3F1D5ACEC0d334e6433b9677acCe7fF",
    converterType: 1,
    fee: 0.001,
    id: "0xDC610F8eecE47E9F91209C77C8674C40d2d8E17F",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "454345189580201812",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "7108983907903089060",
        id: "0x86A49f08Ab6531A3E0e814c75F36de661B986Ca1"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "454345189580201812",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xDC610F8eecE47E9F91209C77C8674C40d2d8E17F",
          liqDepth: 0.430229405629693,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "SYB7",
        decimals: 18,
        contract: "0x86A49f08Ab6531A3E0e814c75F36de661B986Ca1",
        reserveBalance: "7108983907903089060",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x86A49f08Ab6531A3E0e814c75F36de661B986Ca1",
          poolId: "0xDC610F8eecE47E9F91209C77C8674C40d2d8E17F",
          costByNetworkUsd: 0.060519113730360966,
          liqDepth: 0.430229405629693,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "POWRUSDB",
      decimals: 6,
      contract: "0x8bb91B280A39A9e9D8505B9a5BC792CCb3B9779E",
      network: "ETH"
    },
    contract: "0xDB3eC1d6A089F6be97B8fc00bEB43b34c7BeEB23",
    converterType: 1,
    fee: 0,
    id: "0x8bb91B280A39A9e9D8505B9a5BC792CCb3B9779E",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "290978692782086489",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      { amount: "5498685", id: "0x595832F8FC6BF59c85C527fEC3740A1b7a361269" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "290978692782086489",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x8bb91B280A39A9e9D8505B9a5BC792CCb3B9779E",
          liqDepth: 0.2909786927820865,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "POWR",
        decimals: 6,
        contract: "0x595832F8FC6BF59c85C527fEC3740A1b7a361269",
        reserveBalance: "5498685",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/powerledger_28_2.png",
          name: "PowerLedger"
        },
        reserveFeed: {
          reserveAddress: "0x595832F8FC6BF59c85C527fEC3740A1b7a361269",
          poolId: "0x8bb91B280A39A9e9D8505B9a5BC792CCb3B9779E",
          costByNetworkUsd: 0.0529178690508888,
          liqDepth: 0.2909786927820865,
          priority: 10
        }
      }
    ],
    version: "22"
  },
  {
    anchor: {
      symbol: "INDBNT",
      decimals: 18,
      contract: "0x32423158e8FBD2839E085626F8a98D86b2766De8",
      network: "ETH"
    },
    contract: "0xB018AF916Ed0116404537D1238b18988D652733a",
    converterType: 1,
    fee: 0.001,
    id: "0x32423158e8FBD2839E085626F8a98D86b2766De8",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "7151567403437085673345",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1929938660564602304933397",
        id: "0xf8e386EDa857484f5a12e4B5DAa9984E06E73705"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "7151567403437085673345",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x32423158e8FBD2839E085626F8a98D86b2766De8",
          liqDepth: 6771.975722125037,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "IND",
        decimals: 18,
        contract: "0xf8e386EDa857484f5a12e4B5DAa9984E06E73705",
        reserveBalance: "1929938660564602304933397",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/indorse_28.png",
          name: "Indorse"
        },
        reserveFeed: {
          reserveAddress: "0xf8e386EDa857484f5a12e4B5DAa9984E06E73705",
          poolId: "0x32423158e8FBD2839E085626F8a98D86b2766De8",
          costByNetworkUsd: 0.00350890723135413,
          liqDepth: 6771.975722125037,
          priority: 10,
          change24H: 0.9072508854136938,
          volume24H: 0
        }
      }
    ],
    version: "5"
  },
  {
    anchor: {
      symbol: "ENJBNT",
      decimals: 18,
      contract: "0xf3aD2cBc4276eb4B0fb627Af0059CfcE094E20a1",
      network: "ETH"
    },
    contract: "0xCbb50B9A3C587FF59B61702A9Bb93b6Ff0220ba9",
    converterType: 1,
    fee: 0.001,
    id: "0xf3aD2cBc4276eb4B0fb627Af0059CfcE094E20a1",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "376670718912265616004389",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "2579206099754062879281941",
        id: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "376670718912265616004389",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xf3aD2cBc4276eb4B0fb627Af0059CfcE094E20a1",
          liqDepth: 356677.7490600613,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "ENJ",
        decimals: 18,
        contract: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
        reserveBalance: "2579206099754062879281941",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/enjin_28_2.png",
          name: "EnjinCoin"
        },
        reserveFeed: {
          reserveAddress: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
          poolId: "0xf3aD2cBc4276eb4B0fb627Af0059CfcE094E20a1",
          costByNetworkUsd: 0.13828974314773523,
          liqDepth: 356677.7490600613,
          priority: 10,
          change24H: 68.43869457627594,
          volume24H: 0
        }
      }
    ],
    version: "42"
  },
  {
    anchor: {
      symbol: "OMGBNT",
      decimals: 18,
      contract: "0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340",
      network: "ETH"
    },
    contract: "0xD2195468D42C607f6B62d3144a5d2f7f2BC09443",
    converterType: 1,
    fee: 0.005,
    id: "0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "600628857236348220411457",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "179836297079807536098837",
        id: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "600628857236348220411457",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340",
          liqDepth: 568748.6126827829,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "OMG",
        decimals: 18,
        contract: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
        reserveBalance: "179836297079807536098837",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/omise.png",
          name: "OmiseGO"
        },
        reserveFeed: {
          reserveAddress: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
          poolId: "0x99eBD396Ce7AA095412a4Cd1A0C959D6Fd67B340",
          costByNetworkUsd: 3.162590766814913,
          liqDepth: 568748.6126827829,
          priority: 10,
          change24H: -5.954718201116645,
          volume24H: 0
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "AIDBNT",
      decimals: 18,
      contract: "0xe3BF775Ec5f4F4dFCbb21194B22be1217b815b1d",
      network: "ETH"
    },
    contract: "0xb85E52268CBF57b97Ae15136Aa65D4F567B8107c",
    converterType: 1,
    fee: 0.001,
    id: "0xe3BF775Ec5f4F4dFCbb21194B22be1217b815b1d",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "8891799912798092351848",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1012108945306988546218069",
        id: "0x37E8789bB9996CaC9156cD5F5Fd32599E6b91289"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "8891799912798092351848",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xe3BF775Ec5f4F4dFCbb21194B22be1217b815b1d",
          liqDepth: 8419.839978928603,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "AID",
        decimals: 18,
        contract: "0x37E8789bB9996CaC9156cD5F5Fd32599E6b91289",
        reserveBalance: "1012108945306988546218069",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/aidcoin_28.png",
          name: "AidCoin"
        },
        reserveFeed: {
          reserveAddress: "0x37E8789bB9996CaC9156cD5F5Fd32599E6b91289",
          poolId: "0xe3BF775Ec5f4F4dFCbb21194B22be1217b815b1d",
          costByNetworkUsd: 0.008319104398760881,
          liqDepth: 8419.839978928603,
          priority: 10,
          change24H: -0.5652388461378122,
          volume24H: 0
        }
      }
    ],
    version: "6"
  },
  {
    anchor: {
      symbol: "AIXBNT",
      decimals: 18,
      contract: "0xA415cD56C694bd7402d14560D18Bb19A28F77617",
      network: "ETH"
    },
    contract: "0xb8a6920962655c97F0E3Eab40E5706Ed934907Cc",
    converterType: 1,
    fee: 0.001,
    id: "0xA415cD56C694bd7402d14560D18Bb19A28F77617",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "905666129389489711631",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "409967847922735455374728",
        id: "0x1063ce524265d5a3A624f4914acd573dD89ce988"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "905666129389489711631",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xA415cD56C694bd7402d14560D18Bb19A28F77617",
          liqDepth: 857.5950829504801,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "AIX",
        decimals: 18,
        contract: "0x1063ce524265d5a3A624f4914acd573dD89ce988",
        reserveBalance: "409967847922735455374728",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1063ce524265d5a3A624f4914acd573dD89ce988/logo.png",
          name: "Aigang"
        },
        reserveFeed: {
          reserveAddress: "0x1063ce524265d5a3A624f4914acd573dD89ce988",
          poolId: "0xA415cD56C694bd7402d14560D18Bb19A28F77617",
          costByNetworkUsd: 0.0020918593672548356,
          liqDepth: 857.5950829504801,
          priority: 10,
          change24H: 52.794622056241806,
          volume24H: 0
        }
      }
    ],
    version: "1"
  },
  {
    anchor: {
      symbol: "ATSBNT",
      decimals: 18,
      contract: "0x1D75ebc72f4805e9C9918B36A8969b2e3847c9FB",
      network: "ETH"
    },
    contract: "0xa00655976c5c9A1eD58b3707b190867069bAbEe5",
    converterType: 1,
    fee: 0.001,
    id: "0x1D75ebc72f4805e9C9918B36A8969b2e3847c9FB",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "336758016118832687224",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "60483774862",
        id: "0x2dAEE1AA61D60A252DC80564499A69802853583A"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "336758016118832687224",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x1D75ebc72f4805e9C9918B36A8969b2e3847c9FB",
          liqDepth: 318.88353709589546,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "ATS",
        decimals: 4,
        contract: "0x2dAEE1AA61D60A252DC80564499A69802853583A",
        reserveBalance: "60483774862",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2dAEE1AA61D60A252DC80564499A69802853583A/logo.png",
          name: "Authorship Token"
        },
        reserveFeed: {
          reserveAddress: "0x2dAEE1AA61D60A252DC80564499A69802853583A",
          poolId: "0x1D75ebc72f4805e9C9918B36A8969b2e3847c9FB",
          costByNetworkUsd: 0.00005272216190597583,
          liqDepth: 318.88353709589546,
          priority: 10,
          change24H: 153.16186029460363,
          volume24H: 0
        }
      }
    ],
    version: "1"
  },
  {
    anchor: {
      symbol: "BATBNT",
      decimals: 18,
      contract: "0x131da075a2832549128e93AcC2b54174045232Cf",
      network: "ETH"
    },
    contract: "0x1317BD40c86461dFEE8E7bEE8B2Fb697b958cb7e",
    converterType: 1,
    fee: 0.005,
    id: "0x131da075a2832549128e93AcC2b54174045232Cf",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "490846384496326297509692",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "2147319212319803843354166",
        id: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "490846384496326297509692",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x131da075a2832549128e93AcC2b54174045232Cf",
          liqDepth: 464793.1861069279,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "BAT",
        decimals: 18,
        contract: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
        reserveBalance: "2147319212319803843354166",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/bat.png",
          name: "BAT"
        },
        reserveFeed: {
          reserveAddress: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
          poolId: "0x131da075a2832549128e93AcC2b54174045232Cf",
          costByNetworkUsd: 0.21645276745081604,
          liqDepth: 464793.1861069279,
          priority: 10,
          change24H: 7.7380367582791925,
          volume24H: 0
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "BCSBNT",
      decimals: 18,
      contract: "0xD3aD4c39A12B48164068Fef8F86eF5836A9eF303",
      network: "ETH"
    },
    contract: "0x27f8fd3ac4eAa50068B8F221bFa0b496F180813e",
    converterType: 1,
    fee: 0.001,
    id: "0xD3aD4c39A12B48164068Fef8F86eF5836A9eF303",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x98Bde3a768401260E7025FaF9947ef1b81295519" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xD3aD4c39A12B48164068Fef8F86eF5836A9eF303",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "BCS",
        decimals: 18,
        contract: "0x98Bde3a768401260E7025FaF9947ef1b81295519",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/bcshop_32.png",
          name: "BCShop.io Token"
        },
        reserveFeed: {
          reserveAddress: "0x98Bde3a768401260E7025FaF9947ef1b81295519",
          poolId: "0xD3aD4c39A12B48164068Fef8F86eF5836A9eF303",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "13"
  },
  {
    anchor: {
      symbol: "BNBBNT",
      decimals: 18,
      contract: "0xE6b31fB3f29fbde1b92794B0867A315Ff605A324",
      network: "ETH"
    },
    contract: "0x0Da9F5b929B316D90F27F3510D7d9be6D8eA7706",
    converterType: 1,
    fee: 0.001,
    id: "0xE6b31fB3f29fbde1b92794B0867A315Ff605A324",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "109300161963554069992689",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "3665735753237226333016",
        id: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "109300161963554069992689",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xE6b31fB3f29fbde1b92794B0867A315Ff605A324",
          liqDepth: 103498.71594383473,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "BNB",
        decimals: 18,
        contract: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        reserveBalance: "3665735753237226333016",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/bnb_28_2.png",
          name: "BNB"
        },
        reserveFeed: {
          reserveAddress: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
          poolId: "0xE6b31fB3f29fbde1b92794B0867A315Ff605A324",
          costByNetworkUsd: 28.234090755842015,
          liqDepth: 103498.71594383473,
          priority: 10,
          change24H: 3.440184005907122,
          volume24H: 0
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "USDB/CAT",
      decimals: 18,
      contract: "0xc9CEadb2d3bCeB198C1361c6a60892E95B1ABf60",
      network: "ETH"
    },
    contract: "0xB8A38Ca13bEE727092adB375FE64F6c23DeCC738",
    converterType: 1,
    fee: 0,
    id: "0xc9CEadb2d3bCeB198C1361c6a60892E95B1ABf60",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x309627af60F0926daa6041B8279484312f2bf060" },
      { amount: "0", id: "0x1234567461d3f8Db7496581774Bd869C83D51c93" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xc9CEadb2d3bCeB198C1361c6a60892E95B1ABf60",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "CAT",
        decimals: 18,
        contract: "0x1234567461d3f8Db7496581774Bd869C83D51c93",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/bitclave2_28.png",
          name: "BitClave"
        },
        reserveFeed: {
          reserveAddress: "0x1234567461d3f8Db7496581774Bd869C83D51c93",
          poolId: "0xc9CEadb2d3bCeB198C1361c6a60892E95B1ABf60",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "42"
  },
  {
    anchor: {
      symbol: "DRGNBNT",
      decimals: 18,
      contract: "0xa7774F9386E1653645E1A08fb7Aae525B4DeDb24",
      network: "ETH"
    },
    contract: "0x79E71FfEaE3aE4Be517154839E518789628B6D83",
    converterType: 1,
    fee: 0.001,
    id: "0xa7774F9386E1653645E1A08fb7Aae525B4DeDb24",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "87706839948331725081",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "2154992390070447427897",
        id: "0x419c4dB4B9e25d6Db2AD9691ccb832C8D9fDA05E"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "87706839948331725081",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xa7774F9386E1653645E1A08fb7Aae525B4DeDb24",
          liqDepth: 83.05152664980176,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "DRGN",
        decimals: 18,
        contract: "0x419c4dB4B9e25d6Db2AD9691ccb832C8D9fDA05E",
        reserveBalance: "2154992390070447427897",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/dragonchain_32.png",
          name: "Dragon"
        },
        reserveFeed: {
          reserveAddress: "0x419c4dB4B9e25d6Db2AD9691ccb832C8D9fDA05E",
          poolId: "0xa7774F9386E1653645E1A08fb7Aae525B4DeDb24",
          costByNetworkUsd: 0.03853912757765552,
          liqDepth: 83.05152664980176,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "CATBNT",
      decimals: 18,
      contract: "0xB3c55930368D71F643C3775869aFC73f6c5237b2",
      network: "ETH"
    },
    contract: "0xD856CBd87D4563C199bf3A1956817951b12b430b",
    converterType: 1,
    fee: 0.001,
    id: "0xB3c55930368D71F643C3775869aFC73f6c5237b2",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1817566456184429096409",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "6105847700949852598529224",
        id: "0x1234567461d3f8Db7496581774Bd869C83D51c93"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1817566456184429096409",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xB3c55930368D71F643C3775869aFC73f6c5237b2",
          liqDepth: 1721.0934638907618,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "CAT",
        decimals: 18,
        contract: "0x1234567461d3f8Db7496581774Bd869C83D51c93",
        reserveBalance: "6105847700949852598529224",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/bitclave2_28.png",
          name: "BitClave"
        },
        reserveFeed: {
          reserveAddress: "0x1234567461d3f8Db7496581774Bd869C83D51c93",
          poolId: "0xB3c55930368D71F643C3775869aFC73f6c5237b2",
          costByNetworkUsd: 0.0002818762517812262,
          liqDepth: 1721.0934638907618,
          priority: 10,
          change24H: 22.864182332652714,
          volume24H: 0
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "DRTBNT",
      decimals: 18,
      contract: "0x904c7051D12aCE7d0107ada8702C0C759cad1672",
      network: "ETH"
    },
    contract: "0x9b10206f236669F4f40E8e9806De9ab1813d3f65",
    converterType: 1,
    fee: 0.001,
    id: "0x904c7051D12aCE7d0107ada8702C0C759cad1672",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "6901668871118171120596",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "645259717685102",
        id: "0x9AF4f26941677C706cfEcf6D3379FF01bB85D5Ab"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "6901668871118171120596",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x904c7051D12aCE7d0107ada8702C0C759cad1672",
          liqDepth: 6535.341331593384,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "DRT",
        decimals: 8,
        contract: "0x9AF4f26941677C706cfEcf6D3379FF01bB85D5Ab",
        reserveBalance: "645259717685102",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/domraider_28.png",
          name: "DomRaiderToken"
        },
        reserveFeed: {
          reserveAddress: "0x9AF4f26941677C706cfEcf6D3379FF01bB85D5Ab",
          poolId: "0x904c7051D12aCE7d0107ada8702C0C759cad1672",
          costByNetworkUsd: 0.0010128233876181226,
          liqDepth: 6535.341331593384,
          priority: 10,
          change24H: 1.1796741954972958,
          volume24H: 0
        }
      }
    ],
    version: "6"
  },
  {
    anchor: {
      symbol: "EDGBNT",
      decimals: 18,
      contract: "0xf95dd0Fc6DF64b2F149aFA9219579e0f850BCD4D",
      network: "ETH"
    },
    contract: "0xb695449D12B73DFc61B2150B07c7D1c342ddfDB6",
    converterType: 1,
    fee: 0,
    id: "0xf95dd0Fc6DF64b2F149aFA9219579e0f850BCD4D",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "132968014982958",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "1", id: "0x08711D3B02C8758F2FB3ab4e80228418a7F8e39c" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "132968014982958",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xf95dd0Fc6DF64b2F149aFA9219579e0f850BCD4D",
          liqDepth: 0.00012591032405721088,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "EDG",
        decimals: 0,
        contract: "0x08711D3B02C8758F2FB3ab4e80228418a7F8e39c",
        reserveBalance: "1",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/edgeless.png",
          name: "Edgeless"
        },
        reserveFeed: {
          reserveAddress: "0x08711D3B02C8758F2FB3ab4e80228418a7F8e39c",
          poolId: "0xf95dd0Fc6DF64b2F149aFA9219579e0f850BCD4D",
          costByNetworkUsd: 0.0001259103240572109,
          liqDepth: 0.00012591032405721088,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "ELFBNT",
      decimals: 18,
      contract: "0x0F2318565f1996CB1eD2F88e172135791BC1FcBf",
      network: "ETH"
    },
    contract: "0xdF71c1bA66647D8b0EB5437F5907abDfB439aCca",
    converterType: 1,
    fee: 0.001,
    id: "0x0F2318565f1996CB1eD2F88e172135791BC1FcBf",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "77963713444735486132025",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "555581591448955319422140",
        id: "0xbf2179859fc6D5BEE9Bf9158632Dc51678a4100e"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "77963713444735486132025",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x0F2318565f1996CB1eD2F88e172135791BC1FcBf",
          liqDepth: 73825.54688650732,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "ELF",
        decimals: 18,
        contract: "0xbf2179859fc6D5BEE9Bf9158632Dc51678a4100e",
        reserveBalance: "555581591448955319422140",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/aelf_28.png",
          name: "ELF"
        },
        reserveFeed: {
          reserveAddress: "0xbf2179859fc6D5BEE9Bf9158632Dc51678a4100e",
          poolId: "0x0F2318565f1996CB1eD2F88e172135791BC1FcBf",
          costByNetworkUsd: 0.13287975703797258,
          liqDepth: 73825.54688650732,
          priority: 10,
          change24H: 49.225882443955314,
          volume24H: 0
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "GTOBNT",
      decimals: 18,
      contract: "0xc4938292EA2d3085fFFc11C46B87CA068a83BE01",
      network: "ETH"
    },
    contract: "0x0d57AD6818b6b34154d06355caa7d3729E4bAF06",
    converterType: 1,
    fee: 0,
    id: "0xc4938292EA2d3085fFFc11C46B87CA068a83BE01",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "52592217976843426126310",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "340850280626",
        id: "0xC5bBaE50781Be1669306b9e001EFF57a2957b09d"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "52592217976843426126310",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xc4938292EA2d3085fFFc11C46B87CA068a83BE01",
          liqDepth: 49800.722445924555,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "GTO",
        decimals: 5,
        contract: "0xC5bBaE50781Be1669306b9e001EFF57a2957b09d",
        reserveBalance: "340850280626",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/gifto28.png",
          name: "Gifto"
        },
        reserveFeed: {
          reserveAddress: "0xC5bBaE50781Be1669306b9e001EFF57a2957b09d",
          poolId: "0xc4938292EA2d3085fFFc11C46B87CA068a83BE01",
          costByNetworkUsd: 0.014610732417312778,
          liqDepth: 49800.722445924555,
          priority: 10,
          change24H: 47.454436409375674,
          volume24H: 0
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "MANABNT",
      decimals: 18,
      contract: "0x79d83B390cF0EDF86B9EFbE47B556Cc6e20926aC",
      network: "ETH"
    },
    contract: "0x16706f5561B88F4c80Ce9B35b2C02dFb0E22DD87",
    converterType: 1,
    fee: 0.001,
    id: "0x79d83B390cF0EDF86B9EFbE47B556Cc6e20926aC",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "131577056086602530507488",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1514163347879746822539693",
        id: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "131577056086602530507488",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x79d83B390cF0EDF86B9EFbE47B556Cc6e20926aC",
          liqDepth: 124593.19463016167,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "MANA",
        decimals: 18,
        contract: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
        reserveBalance: "1514163347879746822539693",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/decentraland_32.png?v=1",
          name: "Decentraland"
        },
        reserveFeed: {
          reserveAddress: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
          poolId: "0x79d83B390cF0EDF86B9EFbE47B556Cc6e20926aC",
          costByNetworkUsd: 0.08228517405643657,
          liqDepth: 124593.19463016167,
          priority: 10,
          change24H: 21.206438736157647,
          volume24H: 0
        }
      }
    ],
    version: "42"
  },
  {
    anchor: {
      symbol: "MNTPBNT",
      decimals: 18,
      contract: "0x8DA321aB610cD24fB2bcCe191F423Dae7c327ca9",
      network: "ETH"
    },
    contract: "0x0160AE697A3538668CDb4698d3B89C7F36AD990d",
    converterType: 1,
    fee: 0.001,
    id: "0x8DA321aB610cD24fB2bcCe191F423Dae7c327ca9",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1487185704258284870983",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "12525180457098658603707",
        id: "0x83cee9e086A77e492eE0bB93C2B0437aD6fdECCc"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1487185704258284870983",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x8DA321aB610cD24fB2bcCe191F423Dae7c327ca9",
          liqDepth: 1408.2486978572363,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "MNTP",
        decimals: 18,
        contract: "0x83cee9e086A77e492eE0bB93C2B0437aD6fdECCc",
        reserveBalance: "12525180457098658603707",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/goldmint_28.png",
          name: "Goldmint MNT Prelaunch Token"
        },
        reserveFeed: {
          reserveAddress: "0x83cee9e086A77e492eE0bB93C2B0437aD6fdECCc",
          poolId: "0x8DA321aB610cD24fB2bcCe191F423Dae7c327ca9",
          costByNetworkUsd: 0.11243340586435302,
          liqDepth: 1408.2486978572363,
          priority: 10,
          change24H: 29.58780544109101,
          volume24H: 0
        }
      }
    ],
    version: "1"
  },
  {
    anchor: {
      symbol: "REQBNT",
      decimals: 18,
      contract: "0xccB5E3Ba5356D57001976092795626ac3b87Ad4e",
      network: "ETH"
    },
    contract: "0x11110198B3B4AD6184e0587B76B28F34d54F6150",
    converterType: 1,
    fee: 0,
    id: "0xccB5E3Ba5356D57001976092795626ac3b87Ad4e",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "59597894495407358322524",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "2322275223082468422887485",
        id: "0x8f8221aFbB33998d8584A2B05749bA73c37a938a"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "59597894495407358322524",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xccB5E3Ba5356D57001976092795626ac3b87Ad4e",
          liqDepth: 56434.55089561173,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "REQ",
        decimals: 18,
        contract: "0x8f8221aFbB33998d8584A2B05749bA73c37a938a",
        reserveBalance: "2322275223082468422887485",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/request_32.png",
          name: "Request"
        },
        reserveFeed: {
          reserveAddress: "0x8f8221aFbB33998d8584A2B05749bA73c37a938a",
          poolId: "0xccB5E3Ba5356D57001976092795626ac3b87Ad4e",
          costByNetworkUsd: 0.024301405076657286,
          liqDepth: 56434.55089561173,
          priority: 10,
          change24H: 24.020233742967424,
          volume24H: 0
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "RLCBNT",
      decimals: 18,
      contract: "0x9003411Ac4073C2D9f37af71d00E373B72Cbe9E2",
      network: "ETH"
    },
    contract: "0xf4F99f9339Ba0Cbff65eb46cfa939e3C54231e33",
    converterType: 1,
    fee: 0.001,
    id: "0x9003411Ac4073C2D9f37af71d00E373B72Cbe9E2",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "132796972922574818285",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "136991144321",
        id: "0x607F4C5BB672230e8672085532f7e901544a7375"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "132796972922574818285",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x9003411Ac4073C2D9f37af71d00E373B72Cbe9E2",
          liqDepth: 125.74836058612337,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "RLC",
        decimals: 9,
        contract: "0x607F4C5BB672230e8672085532f7e901544a7375",
        reserveBalance: "136991144321",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/iexec_28.png",
          name: "RLC"
        },
        reserveFeed: {
          reserveAddress: "0x607F4C5BB672230e8672085532f7e901544a7375",
          poolId: "0x9003411Ac4073C2D9f37af71d00E373B72Cbe9E2",
          costByNetworkUsd: 0.9179305801801878,
          liqDepth: 125.74836058612337,
          priority: 10,
          change24H: 510.97511095980497,
          volume24H: 0
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "SRNBNT",
      decimals: 18,
      contract: "0xd2Deb679ed81238CaeF8E0c32257092cEcc8888b",
      network: "ETH"
    },
    contract: "0x247AC58CD31541c65B3AAa47E047745107D13873",
    converterType: 1,
    fee: 0.001,
    id: "0xd2Deb679ed81238CaeF8E0c32257092cEcc8888b",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "18677102907556369194511",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1174363576959505945716948",
        id: "0x68d57c9a1C35f63E2c83eE8e49A64e9d70528D25"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "18677102907556369194511",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xd2Deb679ed81238CaeF8E0c32257092cEcc8888b",
          liqDepth: 17685.75758494777,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "SRN",
        decimals: 18,
        contract: "0x68d57c9a1C35f63E2c83eE8e49A64e9d70528D25",
        reserveBalance: "1174363576959505945716948",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/sirin_28.png",
          name: "SIRIN"
        },
        reserveFeed: {
          reserveAddress: "0x68d57c9a1C35f63E2c83eE8e49A64e9d70528D25",
          poolId: "0xd2Deb679ed81238CaeF8E0c32257092cEcc8888b",
          costByNetworkUsd: 0.015059865557766363,
          liqDepth: 17685.75758494777,
          priority: 10,
          change24H: -3.735616511231741,
          volume24H: 0
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "STORMBNT",
      decimals: 18,
      contract: "0xCad4da66E00FDeCaBeC137a24E12Af8eDF303a1d",
      network: "ETH"
    },
    contract: "0xdD7DE51c4F6FAF10Afce495f1Ef02E5Baa91379c",
    converterType: 1,
    fee: 0.001,
    id: "0xCad4da66E00FDeCaBeC137a24E12Af8eDF303a1d",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "18728676516225465933",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "3745514111554100527805",
        id: "0xD0a4b8946Cb52f0661273bfbC6fD0E0C75Fc6433"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "18728676516225465933",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xCad4da66E00FDeCaBeC137a24E12Af8eDF303a1d",
          liqDepth: 17.73459376394283,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "STORM",
        decimals: 18,
        contract: "0xD0a4b8946Cb52f0661273bfbC6fD0E0C75Fc6433",
        reserveBalance: "3745514111554100527805",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/stormx_28.png",
          name: "Storm"
        },
        reserveFeed: {
          reserveAddress: "0xD0a4b8946Cb52f0661273bfbC6fD0E0C75Fc6433",
          poolId: "0xCad4da66E00FDeCaBeC137a24E12Af8eDF303a1d",
          costByNetworkUsd: 0.004734889052809986,
          liqDepth: 17.73459376394283,
          priority: 10
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "TAASBNT",
      decimals: 18,
      contract: "0xAE201360282C885bf3F2616A3145D1344a1e43c0",
      network: "ETH"
    },
    contract: "0xb7289a9Bbfb5C28598C0b825214b2e1dc51c72Ee",
    converterType: 1,
    fee: 0.001,
    id: "0xAE201360282C885bf3F2616A3145D1344a1e43c0",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "4467901520654781123708",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "9004425221", id: "0xE7775A6e9Bcf904eb39DA2b68c5efb4F9360e08C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "4467901520654781123708",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xAE201360282C885bf3F2616A3145D1344a1e43c0",
          liqDepth: 4230.7537522723,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "TAAS",
        decimals: 6,
        contract: "0xE7775A6e9Bcf904eb39DA2b68c5efb4F9360e08C",
        reserveBalance: "9004425221",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/TAAS.png",
          name: "TAAS"
        },
        reserveFeed: {
          reserveAddress: "0xE7775A6e9Bcf904eb39DA2b68c5efb4F9360e08C",
          poolId: "0xAE201360282C885bf3F2616A3145D1344a1e43c0",
          costByNetworkUsd: 0.469852727790486,
          liqDepth: 4230.7537522723,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "TBXBNT",
      decimals: 18,
      contract: "0xE844E4EF529CB1A507D47206bEeF65a921B07287",
      network: "ETH"
    },
    contract: "0xe18b18B6F5c07feF86cF0f1C9d0de7fD94869c24",
    converterType: 1,
    fee: 0.001,
    id: "0xE844E4EF529CB1A507D47206bEeF65a921B07287",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "103287636813599846449",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "4555693909129316555544",
        id: "0x3A92bD396aEf82af98EbC0Aa9030D25a23B11C6b"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "103287636813599846449",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xE844E4EF529CB1A507D47206bEeF65a921B07287",
          liqDepth: 97.80532426516754,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "TBX",
        decimals: 18,
        contract: "0x3A92bD396aEf82af98EbC0Aa9030D25a23B11C6b",
        reserveBalance: "4555693909129316555544",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/tokenbox_28.png",
          name: "Tokenbox"
        },
        reserveFeed: {
          reserveAddress: "0x3A92bD396aEf82af98EbC0Aa9030D25a23B11C6b",
          poolId: "0xE844E4EF529CB1A507D47206bEeF65a921B07287",
          costByNetworkUsd: 0.021468809409950038,
          liqDepth: 97.80532426516754,
          priority: 10,
          change24H: 513.8233162249483,
          volume24H: 0
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "TKNBNT",
      decimals: 18,
      contract: "0x497Ec0D6Ba2080f0ed7ecf7a79a2A907401b3239",
      network: "ETH"
    },
    contract: "0xC04B5a4556d00Bca8eac5F5accA31981a6597409",
    converterType: 1,
    fee: 0.001,
    id: "0x497Ec0D6Ba2080f0ed7ecf7a79a2A907401b3239",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "91941605329108284991749",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "28050395647558",
        id: "0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "91941605329108284991749",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x497Ec0D6Ba2080f0ed7ecf7a79a2A907401b3239",
          liqDepth: 87061.51868787331,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "TKN",
        decimals: 8,
        contract: "0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a",
        reserveBalance: "28050395647558",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/monolith_32.png",
          name: "TokenCard"
        },
        reserveFeed: {
          reserveAddress: "0xaAAf91D9b90dF800Df4F55c205fd6989c977E73a",
          poolId: "0x497Ec0D6Ba2080f0ed7ecf7a79a2A907401b3239",
          costByNetworkUsd: 0.31037536789771686,
          liqDepth: 87061.51868787331,
          priority: 10,
          change24H: -7.931471375342263,
          volume24H: 926.596482
        }
      }
    ],
    version: "32"
  },
  {
    anchor: {
      symbol: "TRSTBNT",
      decimals: 18,
      contract: "0x064432E84F05094E3eD746A35ab9B7aB865fDa5C",
      network: "ETH"
    },
    contract: "0xC4D88D7f9CCb1b4c24c0EDaA27BF662256B85E31",
    converterType: 1,
    fee: 0.001,
    id: "0x064432E84F05094E3eD746A35ab9B7aB865fDa5C",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1404480575284858415",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "368718119", id: "0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1404480575284858415",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x064432E84F05094E3eD746A35ab9B7aB865fDa5C",
          liqDepth: 1.3299334008170254,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "TRST",
        decimals: 6,
        contract: "0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B",
        reserveBalance: "368718119",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/wetrust.png",
          name: "Trustcoin"
        },
        reserveFeed: {
          reserveAddress: "0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B",
          poolId: "0x064432E84F05094E3eD746A35ab9B7aB865fDa5C",
          costByNetworkUsd: 0.0036069108955750166,
          liqDepth: 1.3299334008170254,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "VEEBNT",
      decimals: 18,
      contract: "0xc9c3A465380bFaaC486C89ff7d5F60CC275D4E08",
      network: "ETH"
    },
    contract: "0x3B42239a8bc2f07bb16b17578fE44fF2422C16F6",
    converterType: 1,
    fee: 0.001,
    id: "0xc9c3A465380bFaaC486C89ff7d5F60CC275D4E08",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "14260724415960091645287",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "8281575149373545147975321",
        id: "0x340D2bdE5Eb28c1eed91B2f790723E3B160613B7"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "14260724415960091645287",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xc9c3A465380bFaaC486C89ff7d5F60CC275D4E08",
          liqDepth: 13503.792116730076,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "VEE",
        decimals: 18,
        contract: "0x340D2bdE5Eb28c1eed91B2f790723E3B160613B7",
        reserveBalance: "8281575149373545147975321",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/blockv_32.png?v=2",
          name: "BLOCKv"
        },
        reserveFeed: {
          reserveAddress: "0x340D2bdE5Eb28c1eed91B2f790723E3B160613B7",
          poolId: "0xc9c3A465380bFaaC486C89ff7d5F60CC275D4E08",
          costByNetworkUsd: 0.0016305825731414828,
          liqDepth: 13503.792116730076,
          priority: 10,
          change24H: -2.8253441223306446,
          volume24H: 0
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "WINGSBNT",
      decimals: 18,
      contract: "0xA6Ab3c8aE51962f4582db841dE6b0A092041461e",
      network: "ETH"
    },
    contract: "0xE860f5ac349eB093236AA173F00E00dAB763944E",
    converterType: 1,
    fee: 0.001,
    id: "0xA6Ab3c8aE51962f4582db841dE6b0A092041461e",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "9754132854046163799",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "875104423139681594839",
        id: "0x667088b212ce3d06a1b553a7221E1fD19000d9aF"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "9754132854046163799",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xA6Ab3c8aE51962f4582db841dE6b0A092041461e",
          liqDepth: 9.236401917464487,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "WINGS",
        decimals: 18,
        contract: "0x667088b212ce3d06a1b553a7221E1fD19000d9aF",
        reserveBalance: "875104423139681594839",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/wingsdao.png",
          name: "WINGS"
        },
        reserveFeed: {
          reserveAddress: "0x667088b212ce3d06a1b553a7221E1fD19000d9aF",
          poolId: "0xA6Ab3c8aE51962f4582db841dE6b0A092041461e",
          costByNetworkUsd: 0.010554628308615234,
          liqDepth: 9.236401917464487,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "WANDBNT",
      decimals: 18,
      contract: "0x6a46f6DC570A1304a23f771c26b1802DFfcDAB0D",
      network: "ETH"
    },
    contract: "0x4F88DFc8e1D7bA696Db158656457797cfBDfB844",
    converterType: 1,
    fee: 0.001,
    id: "0x6a46f6DC570A1304a23f771c26b1802DFfcDAB0D",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "7332682041337414658911",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "984343650318332953528189",
        id: "0x27f610BF36ecA0939093343ac28b1534a721DBB4"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "7332682041337414658911",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x6a46f6DC570A1304a23f771c26b1802DFfcDAB0D",
          liqDepth: 6943.477137352283,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "WAND",
        decimals: 18,
        contract: "0x27f610BF36ecA0939093343ac28b1534a721DBB4",
        reserveBalance: "984343650318332953528189",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x27f610BF36ecA0939093343ac28b1534a721DBB4/logo.png",
          name: "Wand Token"
        },
        reserveFeed: {
          reserveAddress: "0x27f610BF36ecA0939093343ac28b1534a721DBB4",
          poolId: "0x6a46f6DC570A1304a23f771c26b1802DFfcDAB0D",
          costByNetworkUsd: 0.007053915708306534,
          liqDepth: 6943.477137352283,
          priority: 10,
          change24H: 0.740175973045691,
          volume24H: 0
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "WLKBNT",
      decimals: 18,
      contract: "0xd387CDAF85429b455f0F716D51Be33db2FC00463",
      network: "ETH"
    },
    contract: "0xc11CcE040583640001f5a7E945DFd82f662cC0aE",
    converterType: 1,
    fee: 0.001,
    id: "0xd387CDAF85429b455f0F716D51Be33db2FC00463",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1706611669087681699499",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "879669082362420057972245",
        id: "0xF6B55acBBC49f4524Aa48D19281A9A77c54DE10f"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1706611669087681699499",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xd387CDAF85429b455f0F716D51Be33db2FC00463",
          liqDepth: 1616.0279471885622,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "WLK",
        decimals: 18,
        contract: "0xF6B55acBBC49f4524Aa48D19281A9A77c54DE10f",
        reserveBalance: "879669082362420057972245",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/wolk_28.png",
          name: "WOLK TOKEN"
        },
        reserveFeed: {
          reserveAddress: "0xF6B55acBBC49f4524Aa48D19281A9A77c54DE10f",
          poolId: "0xd387CDAF85429b455f0F716D51Be33db2FC00463",
          costByNetworkUsd: 0.0018370862175223811,
          liqDepth: 1616.0279471885622,
          priority: 10,
          change24H: 24.935107078604688,
          volume24H: 0
        }
      }
    ],
    version: "6"
  },
  {
    anchor: {
      symbol: "ABXBNT",
      decimals: 18,
      contract: "0x275a1a2Dad3075bEb96AF4f7fD93ade99bB0151f",
      network: "ETH"
    },
    contract: "0x5A9f1cD844cE91AAADAA03059677EeBCf3CF00df",
    converterType: 1,
    fee: 0.001,
    id: "0x275a1a2Dad3075bEb96AF4f7fD93ade99bB0151f",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "17930977725084970677358",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1592300789938939357588870",
        id: "0x9a794Dc1939F1d78fa48613b89B8f9d0A20dA00E"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "17930977725084970677358",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x275a1a2Dad3075bEb96AF4f7fD93ade99bB0151f",
          liqDepth: 16979.23531698536,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "ABX",
        decimals: 18,
        contract: "0x9a794Dc1939F1d78fa48613b89B8f9d0A20dA00E",
        reserveBalance: "1592300789938939357588870",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/abx_28.png",
          name: "ABX Token"
        },
        reserveFeed: {
          reserveAddress: "0x9a794Dc1939F1d78fa48613b89B8f9d0A20dA00E",
          poolId: "0x275a1a2Dad3075bEb96AF4f7fD93ade99bB0151f",
          costByNetworkUsd: 0.010663334103876486,
          liqDepth: 16979.23531698536,
          priority: 10,
          change24H: -3.6157399902546166,
          volume24H: 0
        }
      }
    ],
    version: "1"
  },
  {
    anchor: {
      symbol: "AIONBNT",
      decimals: 18,
      contract: "0x73fa2B855be96AB3C73f375B8Ec777226eFA3845",
      network: "ETH"
    },
    contract: "0xdd9B82c59aa260B2A834Ec67C472f43b40a2E6f1",
    converterType: 1,
    fee: 0.001,
    id: "0x73fa2B855be96AB3C73f375B8Ec777226eFA3845",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "242811471360495128",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "72772638", id: "0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "242811471360495128",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x73fa2B855be96AB3C73f375B8Ec777226eFA3845",
          liqDepth: 0.2299234973743609,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "AION",
        decimals: 8,
        contract: "0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466",
        reserveBalance: "72772638",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/aion-network_28.png",
          name: "AION"
        },
        reserveFeed: {
          reserveAddress: "0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466",
          poolId: "0x73fa2B855be96AB3C73f375B8Ec777226eFA3845",
          costByNetworkUsd: 0.31594772938471866,
          liqDepth: 0.2299234973743609,
          priority: 10
        }
      }
    ],
    version: "7"
  },
  {
    anchor: {
      symbol: "AMNBNT",
      decimals: 18,
      contract: "0x0f9Be347378a37CED33A13AE061175AF07CC9868",
      network: "ETH"
    },
    contract: "0x5caa37CBa585C216D39e3a02D8C0DFd4843cA5f9",
    converterType: 1,
    fee: 0.001,
    id: "0x0f9Be347378a37CED33A13AE061175AF07CC9868",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "16483818480587651822361",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "7111359056845082836997686",
        id: "0x737F98AC8cA59f2C68aD658E3C3d8C8963E40a4c"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "16483818480587651822361",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x0f9Be347378a37CED33A13AE061175AF07CC9868",
          liqDepth: 15608.888550054986,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "AMN",
        decimals: 18,
        contract: "0x737F98AC8cA59f2C68aD658E3C3d8C8963E40a4c",
        reserveBalance: "7111359056845082836997686",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/amon_28-1.png",
          name: "Amon"
        },
        reserveFeed: {
          reserveAddress: "0x737F98AC8cA59f2C68aD658E3C3d8C8963E40a4c",
          poolId: "0x0f9Be347378a37CED33A13AE061175AF07CC9868",
          costByNetworkUsd: 0.0021949234211469824,
          liqDepth: 15608.888550054986,
          priority: 10,
          change24H: 17.602249411589284,
          volume24H: 3531.301537
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "ESZBNT",
      decimals: 18,
      contract: "0xA2020e324C365D05e87cf25552E6e6734260b089",
      network: "ETH"
    },
    contract: "0x83473C806d1c0d26b15B93AC3F3FE86F6615B2db",
    converterType: 1,
    fee: 0.001,
    id: "0xA2020e324C365D05e87cf25552E6e6734260b089",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "10765655191014505774",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "281890100071379244690",
        id: "0xe8A1Df958bE379045E2B46a31A98B93A2eCDfDeD"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "10765655191014505774",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xA2020e324C365D05e87cf25552E6e6734260b089",
          liqDepth: 10.194234560563766,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "ESZ",
        decimals: 18,
        contract: "0xe8A1Df958bE379045E2B46a31A98B93A2eCDfDeD",
        reserveBalance: "281890100071379244690",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/ethersportz3_28.png",
          name: "ESZCoin"
        },
        reserveFeed: {
          reserveAddress: "0xe8A1Df958bE379045E2B46a31A98B93A2eCDfDeD",
          poolId: "0xA2020e324C365D05e87cf25552E6e6734260b089",
          costByNetworkUsd: 0.03616386158287367,
          liqDepth: 10.194234560563766,
          priority: 10
        }
      }
    ],
    version: "42"
  },
  {
    anchor: {
      symbol: "CVTBNT",
      decimals: 18,
      contract: "0x737Ac585809C0F64Ee09d7B8050d195d14f14c55",
      network: "ETH"
    },
    contract: "0x266036713c53Cadaa16F9D3328741A4Cf435230b",
    converterType: 1,
    fee: 0.001,
    id: "0x737Ac585809C0F64Ee09d7B8050d195d14f14c55",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "3617489217994159364861",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "107791049630086673223683",
        id: "0x4AaC461C86aBfA71e9d00d9a2cde8d74E4E1aeEa"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "3617489217994159364861",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x737Ac585809C0F64Ee09d7B8050d195d14f14c55",
          liqDepth: 3425.479727357651,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "ZINC",
        decimals: 18,
        contract: "0x4AaC461C86aBfA71e9d00d9a2cde8d74E4E1aeEa",
        reserveBalance: "107791049630086673223683",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/zincwork_28.png",
          name: "ZINC"
        },
        reserveFeed: {
          reserveAddress: "0x4AaC461C86aBfA71e9d00d9a2cde8d74E4E1aeEa",
          poolId: "0x737Ac585809C0F64Ee09d7B8050d195d14f14c55",
          costByNetworkUsd: 0.031778888313204905,
          liqDepth: 3425.479727357651,
          priority: 10
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "INSTAR",
      decimals: 18,
      contract: "0xC803B2B2c3BA24C0C934AEB3Ba508A4dD6853F1b",
      network: "ETH"
    },
    contract: "0x7E4b0AbAd3407b87a381c1C05aF78d7ad42975E7",
    converterType: 1,
    fee: 0.001,
    id: "0xC803B2B2c3BA24C0C934AEB3Ba508A4dD6853F1b",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "11978764314595854594611",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "605307731690989746122159",
        id: "0xc72fe8e3Dd5BeF0F9f31f259399F301272eF2a2D"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "11978764314595854594611",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xC803B2B2c3BA24C0C934AEB3Ba508A4dD6853F1b",
          liqDepth: 11342.95414464166,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "INSTAR",
        decimals: 18,
        contract: "0xc72fe8e3Dd5BeF0F9f31f259399F301272eF2a2D",
        reserveBalance: "605307731690989746122159",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/insightsnetwork28.png",
          name: "Insights Network"
        },
        reserveFeed: {
          reserveAddress: "0xc72fe8e3Dd5BeF0F9f31f259399F301272eF2a2D",
          poolId: "0xC803B2B2c3BA24C0C934AEB3Ba508A4dD6853F1b",
          costByNetworkUsd: 0.01873915291475618,
          liqDepth: 11342.95414464166,
          priority: 10
        }
      }
    ],
    version: "7"
  },
  {
    anchor: {
      symbol: "J8TBNT",
      decimals: 18,
      contract: "0x8E00BacD7d8265d8F3f9d5B4fbd7F6B0B0c46f36",
      network: "ETH"
    },
    contract: "0xf42305EA9d1527211EdA8Fb333FBf2668BFfd9E1",
    converterType: 1,
    fee: 0.001,
    id: "0x8E00BacD7d8265d8F3f9d5B4fbd7F6B0B0c46f36",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x8E00BacD7d8265d8F3f9d5B4fbd7F6B0B0c46f36",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "J8T",
        decimals: 8,
        contract: "0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/jet8_28.png",
          name: "J8T"
        },
        reserveFeed: {
          reserveAddress: "0x0D262e5dC4A06a0F1c90cE79C7a60C09DfC884E4",
          poolId: "0x8E00BacD7d8265d8F3f9d5B4fbd7F6B0B0c46f36",
          costByNetworkUsd: null,
          liqDepth: 0,
          priority: 10,
          change24H: null,
          volume24H: 0
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "KNCBNT",
      decimals: 18,
      contract: "0x248AFFf1aa83cF860198ddeE14b5b3E8eDb46d47",
      network: "ETH"
    },
    contract: "0x65003F30295d8622827e23953664D3C78671C01C",
    converterType: 1,
    fee: 0.001,
    id: "0x248AFFf1aa83cF860198ddeE14b5b3E8eDb46d47",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "127317103476324697445818",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "139023130842815454729614",
        id: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "127317103476324697445818",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x248AFFf1aa83cF860198ddeE14b5b3E8eDb46d47",
          liqDepth: 120559.35225312696,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "KNC",
        decimals: 18,
        contract: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
        reserveBalance: "139023130842815454729614",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/kyber2_28.png",
          name: "KyberNetwork"
        },
        reserveFeed: {
          reserveAddress: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
          poolId: "0x248AFFf1aa83cF860198ddeE14b5b3E8eDb46d47",
          costByNetworkUsd: 0.8671891614168558,
          liqDepth: 120559.35225312696,
          priority: 10,
          change24H: -1.2592312562058727,
          volume24H: 0
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "LDCBNT",
      decimals: 18,
      contract: "0xB79C3a1a2d50CC99459F3a21D709bCEC86656e97",
      network: "ETH"
    },
    contract: "0x4aabAacc70A7c592e506e00515b9a9E6CD4C3Ef2",
    converterType: 1,
    fee: 0.001,
    id: "0xB79C3a1a2d50CC99459F3a21D709bCEC86656e97",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "16832556846551506344376",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "83082106935782728653917353",
        id: "0x5102791cA02FC3595398400BFE0e33d7B6C82267"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "16832556846551506344376",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xB79C3a1a2d50CC99459F3a21D709bCEC86656e97",
          liqDepth: 15939.116542668993,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "LDC",
        decimals: 18,
        contract: "0x5102791cA02FC3595398400BFE0e33d7B6C82267",
        reserveBalance: "83082106935782728653917353",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/leadcoin_28.png",
          name: "LEADCOIN"
        },
        reserveFeed: {
          reserveAddress: "0x5102791cA02FC3595398400BFE0e33d7B6C82267",
          poolId: "0xB79C3a1a2d50CC99459F3a21D709bCEC86656e97",
          costByNetworkUsd: 0.00019184776518714112,
          liqDepth: 15939.116542668993,
          priority: 10,
          change24H: -3.516502958894867,
          volume24H: 0
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "MDTBNT",
      decimals: 18,
      contract: "0xbAb15d72731Ea7031B10324806E7AaD8448896D5",
      network: "ETH"
    },
    contract: "0x697134bF35238773bcb6aef16956D1417B562002",
    converterType: 1,
    fee: 0.001,
    id: "0xbAb15d72731Ea7031B10324806E7AaD8448896D5",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "68047477646982174023143",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "3438987417701474179696837",
        id: "0x814e0908b12A99FeCf5BC101bB5d0b8B5cDf7d26"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "68047477646982174023143",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xbAb15d72731Ea7031B10324806E7AaD8448896D5",
          liqDepth: 64435.6461432131,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "MDT",
        decimals: 18,
        contract: "0x814e0908b12A99FeCf5BC101bB5d0b8B5cDf7d26",
        reserveBalance: "3438987417701474179696837",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/mdt_28.png",
          name: "Measurable Data Token"
        },
        reserveFeed: {
          reserveAddress: "0x814e0908b12A99FeCf5BC101bB5d0b8B5cDf7d26",
          poolId: "0xbAb15d72731Ea7031B10324806E7AaD8448896D5",
          costByNetworkUsd: 0.01873680776252451,
          liqDepth: 64435.6461432131,
          priority: 10,
          change24H: -0.38205740271001043,
          volume24H: 11353.949309
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "MFGBNT",
      decimals: 18,
      contract: "0xb3b2861a093B7FB19352bD62CD8EFC314e0641a7",
      network: "ETH"
    },
    contract: "0xFbbAf86D76ef7C86f1Aea216242EF8e203A8Be7E",
    converterType: 1,
    fee: 0.003,
    id: "0xb3b2861a093B7FB19352bD62CD8EFC314e0641a7",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "21685663104007255174343",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "5557123381786199882901680",
        id: "0x6710c63432A2De02954fc0f851db07146a6c0312"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "21685663104007255174343",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xb3b2861a093B7FB19352bD62CD8EFC314e0641a7",
          liqDepth: 20534.629092349813,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "MFG",
        decimals: 18,
        contract: "0x6710c63432A2De02954fc0f851db07146a6c0312",
        reserveBalance: "5557123381786199882901680",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/syncfab_28.png",
          name: "SyncFab Smart Manufacturing Blockchain"
        },
        reserveFeed: {
          reserveAddress: "0x6710c63432A2De02954fc0f851db07146a6c0312",
          poolId: "0xb3b2861a093B7FB19352bD62CD8EFC314e0641a7",
          costByNetworkUsd: 0.0036951904216583125,
          liqDepth: 20534.629092349813,
          priority: 10,
          change24H: -2.3523635433365553,
          volume24H: 152.645753
        }
      }
    ],
    version: "25"
  },
  {
    anchor: {
      symbol: "NPXSBNT",
      decimals: 18,
      contract: "0x5a4deB5704C1891dF3575d3EecF9471DA7F61Fa4",
      network: "ETH"
    },
    contract: "0xE3c7239BCcEe98B85a7D7Bc364490440067Afabf",
    converterType: 1,
    fee: 0.001,
    id: "0x5a4deB5704C1891dF3575d3EecF9471DA7F61Fa4",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "237930888921525056",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1088840655573164753",
        id: "0xA15C7Ebe1f07CaF6bFF097D8a589fb8AC49Ae5B3"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "237930888921525056",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x5a4deB5704C1891dF3575d3EecF9471DA7F61Fa4",
          liqDepth: 0.22530196702695054,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "NPXS",
        decimals: 18,
        contract: "0xA15C7Ebe1f07CaF6bFF097D8a589fb8AC49Ae5B3",
        reserveBalance: "1088840655573164753",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/pundix-28.png",
          name: "Pundi X Token"
        },
        reserveFeed: {
          reserveAddress: "0xA15C7Ebe1f07CaF6bFF097D8a589fb8AC49Ae5B3",
          poolId: "0x5a4deB5704C1891dF3575d3EecF9471DA7F61Fa4",
          costByNetworkUsd: 0.20691913538841164,
          liqDepth: 0.22530196702695054,
          priority: 10
        }
      }
    ],
    version: "42"
  },
  {
    anchor: {
      symbol: "ONGBNT",
      decimals: 18,
      contract: "0x8104E7ce81FaB39c42e34Cd9d8B654135261Fae8",
      network: "ETH"
    },
    contract: "0x4D6DE557092f9742606e226860d6718281C9D241",
    converterType: 1,
    fee: 0.001,
    id: "0x8104E7ce81FaB39c42e34Cd9d8B654135261Fae8",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1969894430381646501",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "184762183701055284863",
        id: "0xd341d1680Eeee3255b8C4c75bCCE7EB57f144dAe"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1969894430381646501",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x8104E7ce81FaB39c42e34Cd9d8B654135261Fae8",
          liqDepth: 1.865336157117462,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "ONG",
        decimals: 18,
        contract: "0xd341d1680Eeee3255b8C4c75bCCE7EB57f144dAe",
        reserveBalance: "184762183701055284863",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/ongcoin_28.png",
          name: "onG"
        },
        reserveFeed: {
          reserveAddress: "0xd341d1680Eeee3255b8C4c75bCCE7EB57f144dAe",
          poolId: "0x8104E7ce81FaB39c42e34Cd9d8B654135261Fae8",
          costByNetworkUsd: 0.010095876330058812,
          liqDepth: 1.865336157117462,
          priority: 10
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "PLRBNT",
      decimals: 18,
      contract: "0x2843F6c3b14e698e3D7562584959C61274F93328",
      network: "ETH"
    },
    contract: "0xc964DE24878B04AFDF6A7df5E7956deCC665D4bE",
    converterType: 1,
    fee: 0.001,
    id: "0x2843F6c3b14e698e3D7562584959C61274F93328",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "19184369579342981535086",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1179988710968783211998989",
        id: "0xe3818504c1B32bF1557b16C238B2E01Fd3149C17"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "19184369579342981535086",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x2843F6c3b14e698e3D7562584959C61274F93328",
          liqDepth: 18166.09950052996,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "PLR",
        decimals: 18,
        contract: "0xe3818504c1B32bF1557b16C238B2E01Fd3149C17",
        reserveBalance: "1179988710968783211998989",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/plr_28_2.png",
          name: "PILLAR"
        },
        reserveFeed: {
          reserveAddress: "0xe3818504c1B32bF1557b16C238B2E01Fd3149C17",
          poolId: "0x2843F6c3b14e698e3D7562584959C61274F93328",
          costByNetworkUsd: 0.015395146861714804,
          liqDepth: 18166.09950052996,
          priority: 10,
          change24H: -3.8900832417311064,
          volume24H: 0
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "POWRBNT",
      decimals: 18,
      contract: "0x168D7Bbf38E17941173a352f1352DF91a7771dF3",
      network: "ETH"
    },
    contract: "0x0512f5D48D636369C0e86924E10A8BB24C8E129f",
    converterType: 1,
    fee: 0.001,
    id: "0x168D7Bbf38E17941173a352f1352DF91a7771dF3",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "82616531784387810299223",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "805683330551",
        id: "0x595832F8FC6BF59c85C527fEC3740A1b7a361269"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "82616531784387810299223",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x168D7Bbf38E17941173a352f1352DF91a7771dF3",
          liqDepth: 78231.40242251757,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "POWR",
        decimals: 6,
        contract: "0x595832F8FC6BF59c85C527fEC3740A1b7a361269",
        reserveBalance: "805683330551",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/powerledger_28_2.png",
          name: "PowerLedger"
        },
        reserveFeed: {
          reserveAddress: "0x595832F8FC6BF59c85C527fEC3740A1b7a361269",
          poolId: "0x168D7Bbf38E17941173a352f1352DF91a7771dF3",
          costByNetworkUsd: 0.09709944274137555,
          liqDepth: 78231.40242251757,
          priority: 10,
          change24H: -8.854296190042593,
          volume24H: 3319.671265
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "RCNBNT",
      decimals: 18,
      contract: "0xf7b9fa01098f22527Db205Ff9BB6FdF7C7D9F1C5",
      network: "ETH"
    },
    contract: "0x6Bb5BbAe5B226E9c0e25FB2D92FD273fD3a70242",
    converterType: 1,
    fee: 0.001,
    id: "0xf7b9fa01098f22527Db205Ff9BB6FdF7C7D9F1C5",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "78226100576527132970685",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1855054542063534908126853",
        id: "0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "78226100576527132970685",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xf7b9fa01098f22527Db205Ff9BB6FdF7C7D9F1C5",
          liqDepth: 74074.00700525515,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "RCN",
        decimals: 18,
        contract: "0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6",
        reserveBalance: "1855054542063534908126853",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/ripio_28_2.png",
          name: "RipioCreditNetwork"
        },
        reserveFeed: {
          reserveAddress: "0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6",
          poolId: "0xf7b9fa01098f22527Db205Ff9BB6FdF7C7D9F1C5",
          costByNetworkUsd: 0.03993090517050584,
          liqDepth: 74074.00700525515,
          priority: 10,
          change24H: -6.022741092552842,
          volume24H: 0
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "RVTBNT",
      decimals: 18,
      contract: "0x5039f60594Ffa3f1a5ACbe85E1eBe12Dc8Da7c5c",
      network: "ETH"
    },
    contract: "0x635C9C9940D512bF5CB455706a28F9C7174d307f",
    converterType: 1,
    fee: 0.001,
    id: "0x5039f60594Ffa3f1a5ACbe85E1eBe12Dc8Da7c5c",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "21355932184662202616928",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "2141953605081255159385849",
        id: "0x3d1BA9be9f66B8ee101911bC36D3fB562eaC2244"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "21355932184662202616928",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x5039f60594Ffa3f1a5ACbe85E1eBe12Dc8Da7c5c",
          liqDepth: 20222.399667012163,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "RVT",
        decimals: 18,
        contract: "0x3d1BA9be9f66B8ee101911bC36D3fB562eaC2244",
        reserveBalance: "2141953605081255159385849",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/rivet_28.png",
          name: "RvT"
        },
        reserveFeed: {
          reserveAddress: "0x3d1BA9be9f66B8ee101911bC36D3fB562eaC2244",
          poolId: "0x5039f60594Ffa3f1a5ACbe85E1eBe12Dc8Da7c5c",
          costByNetworkUsd: 0.009441100693796318,
          liqDepth: 20222.399667012163,
          priority: 10,
          change24H: -4.079125430844764,
          volume24H: 0
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "STACBNT",
      decimals: 18,
      contract: "0x258D1210e9E242FDc0Ecfa3b039A51a945CD0D0a",
      network: "ETH"
    },
    contract: "0x73f73391e5F56Ce371A61fC3e18200A73d44Cf6f",
    converterType: 1,
    fee: 0.001,
    id: "0x258D1210e9E242FDc0Ecfa3b039A51a945CD0D0a",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "900260877577937222350",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "21667903442082471428139250",
        id: "0x9a005c9a89BD72a4Bd27721E7a09A3c11D2b03C4"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "900260877577937222350",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x258D1210e9E242FDc0Ecfa3b039A51a945CD0D0a",
          liqDepth: 852.4767316891589,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "STAC",
        decimals: 18,
        contract: "0x9a005c9a89BD72a4Bd27721E7a09A3c11D2b03C4",
        reserveBalance: "21667903442082471428139250",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/stac_28.png",
          name: "StarterCoin"
        },
        reserveFeed: {
          reserveAddress: "0x9a005c9a89BD72a4Bd27721E7a09A3c11D2b03C4",
          poolId: "0x258D1210e9E242FDc0Ecfa3b039A51a945CD0D0a",
          costByNetworkUsd: 0.000039342834158726925,
          liqDepth: 852.4767316891589,
          priority: 10,
          change24H: 53.17985625016286,
          volume24H: 0
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "GNOBNT",
      decimals: 18,
      contract: "0xd7eB9DB184DA9f099B84e2F86b1da1Fe6b305B3d",
      network: "ETH"
    },
    contract: "0x2E948017C68F1FedC2496dDD4cc33A517D4e0168",
    converterType: 1,
    fee: 0.001,
    id: "0xd7eB9DB184DA9f099B84e2F86b1da1Fe6b305B3d",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "128947322758976530284288",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "2066477653147266264496",
        id: "0x6810e776880C02933D47DB1b9fc05908e5386b96"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "128947322758976530284288",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xd7eB9DB184DA9f099B84e2F86b1da1Fe6b305B3d",
          liqDepth: 122103.04257737007,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "GNO",
        decimals: 18,
        contract: "0x6810e776880C02933D47DB1b9fc05908e5386b96",
        reserveBalance: "2066477653147266264496",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/gnosis.png",
          name: "Gnosis"
        },
        reserveFeed: {
          reserveAddress: "0x6810e776880C02933D47DB1b9fc05908e5386b96",
          poolId: "0xd7eB9DB184DA9f099B84e2F86b1da1Fe6b305B3d",
          costByNetworkUsd: 59.087521411811984,
          liqDepth: 122103.04257737007,
          priority: 10,
          change24H: 57.2550228551932,
          volume24H: 0
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "KINBNT",
      decimals: 18,
      contract: "0x26b5748F9253363f95e37767e9ed7986877A4B1b",
      network: "ETH"
    },
    contract: "0x55d32d9ed854559Ca8759D528bcC648036544fAC",
    converterType: 1,
    fee: 0.001,
    id: "0x26b5748F9253363f95e37767e9ed7986877A4B1b",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "55902147756776674436",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1427930039189548696544457",
        id: "0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "55902147756776674436",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x26b5748F9253363f95e37767e9ed7986877A4B1b",
          liqDepth: 52.93496740890622,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "KIN",
        decimals: 18,
        contract: "0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5",
        reserveBalance: "1427930039189548696544457",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/kin_28_3.png",
          name: "Kin"
        },
        reserveFeed: {
          reserveAddress: "0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5",
          poolId: "0x26b5748F9253363f95e37767e9ed7986877A4B1b",
          costByNetworkUsd: 0.00003707112110264909,
          liqDepth: 52.93496740890622,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "BAXBNT",
      decimals: 18,
      contract: "0xA9DE5935aE3eae8a7F943C9329940EDA160267f4",
      network: "ETH"
    },
    contract: "0x6d1CEB4Fd5595c9773EB7FC79B0c090a380514DA",
    converterType: 1,
    fee: 0.001,
    id: "0xA9DE5935aE3eae8a7F943C9329940EDA160267f4",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "133301054162078780857",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "878871570689273487739710",
        id: "0x9a0242b7a33DAcbe40eDb927834F96eB39f8fBCB"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "133301054162078780857",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xA9DE5935aE3eae8a7F943C9329940EDA160267f4",
          liqDepth: 126.22568614614799,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "BAX",
        decimals: 18,
        contract: "0x9a0242b7a33DAcbe40eDb927834F96eB39f8fBCB",
        reserveBalance: "878871570689273487739710",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/bax_28_2.png",
          name: "BAX"
        },
        reserveFeed: {
          reserveAddress: "0x9a0242b7a33DAcbe40eDb927834F96eB39f8fBCB",
          poolId: "0xA9DE5935aE3eae8a7F943C9329940EDA160267f4",
          costByNetworkUsd: 0.00014362244764289377,
          liqDepth: 126.22568614614799,
          priority: 10
        }
      }
    ],
    version: "13"
  },
  {
    anchor: {
      symbol: "BETRBNT",
      decimals: 18,
      contract: "0x679F601F0deb53c2dB0C8C26369FDcba5fD753CF",
      network: "ETH"
    },
    contract: "0x8bB76C5AE6b7D6bd1678510edD06444AcDf8F72B",
    converterType: 1,
    fee: 0.001,
    id: "0x679F601F0deb53c2dB0C8C26369FDcba5fD753CF",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "5663015783580154366890",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "11892559733848049031503565",
        id: "0x763186eB8d4856D536eD4478302971214FEbc6A9"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "5663015783580154366890",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x679F601F0deb53c2dB0C8C26369FDcba5fD753CF",
          liqDepth: 5362.433608887551,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "BETR",
        decimals: 18,
        contract: "0x763186eB8d4856D536eD4478302971214FEbc6A9",
        reserveBalance: "11892559733848049031503565",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/betterbetting_28.png",
          name: "Better Betting"
        },
        reserveFeed: {
          reserveAddress: "0x763186eB8d4856D536eD4478302971214FEbc6A9",
          poolId: "0x679F601F0deb53c2dB0C8C26369FDcba5fD753CF",
          costByNetworkUsd: 0.00045090659445041445,
          liqDepth: 5362.433608887551,
          priority: 10,
          change24H: 2.8849071370495283,
          volume24H: 0
        }
      }
    ],
    version: "7"
  },
  {
    anchor: {
      symbol: "UPBNT",
      decimals: 18,
      contract: "0xd4c810fdcA379831078267f3402845E5205Aa0e1",
      network: "ETH"
    },
    contract: "0xeB4F011A862A8EDB723FDb3b5d144D77dFb7fa5f",
    converterType: 1,
    fee: 0.001,
    id: "0xd4c810fdcA379831078267f3402845E5205Aa0e1",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "9873194267491885174270",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "979122149325287",
        id: "0x6Ba460AB75Cd2c56343b3517ffeBA60748654D26"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "9873194267491885174270",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xd4c810fdcA379831078267f3402845E5205Aa0e1",
          liqDepth: 9349.14377611058,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "UP",
        decimals: 8,
        contract: "0x6Ba460AB75Cd2c56343b3517ffeBA60748654D26",
        reserveBalance: "979122149325287",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/uptoken_28.png",
          name: "UpToken"
        },
        reserveFeed: {
          reserveAddress: "0x6Ba460AB75Cd2c56343b3517ffeBA60748654D26",
          poolId: "0xd4c810fdcA379831078267f3402845E5205Aa0e1",
          costByNetworkUsd: 0.0009548495846563246,
          liqDepth: 9349.14377611058,
          priority: 10,
          change24H: -1.2471781279695129,
          volume24H: 0
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "VIBBNT",
      decimals: 18,
      contract: "0x2948BD241243Bb6924A0b2f368233DDa525AAB05",
      network: "ETH"
    },
    contract: "0xbE1DAF05Bf9e054b3e28b7E9C318819eF5dAcb58",
    converterType: 1,
    fee: 0.001,
    id: "0x2948BD241243Bb6924A0b2f368233DDa525AAB05",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "56889886526464924369086",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "3451458262507480258714693",
        id: "0x2C974B2d0BA1716E644c1FC59982a89DDD2fF724"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "56889886526464924369086",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x2948BD241243Bb6924A0b2f368233DDa525AAB05",
          liqDepth: 53870.278871525705,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "VIB",
        decimals: 18,
        contract: "0x2C974B2d0BA1716E644c1FC59982a89DDD2fF724",
        reserveBalance: "3451458262507480258714693",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/viberate2_28.png",
          name: "VIB"
        },
        reserveFeed: {
          reserveAddress: "0x2C974B2d0BA1716E644c1FC59982a89DDD2fF724",
          poolId: "0x2948BD241243Bb6924A0b2f368233DDa525AAB05",
          costByNetworkUsd: 0.015607976331832855,
          liqDepth: 53870.278871525705,
          priority: 10,
          change24H: -1.7179258964035466,
          volume24H: 1124.58
        }
      }
    ],
    version: "32"
  },
  {
    anchor: {
      symbol: "XDCEBNT",
      decimals: 18,
      contract: "0xd1BB51fECC950c7b1e4197D8d13A1d2A60795D2C",
      network: "ETH"
    },
    contract: "0xf66EFba4dCDAB29d864b3134970C28bFcF653f3f",
    converterType: 1,
    fee: 0.001,
    id: "0xd1BB51fECC950c7b1e4197D8d13A1d2A60795D2C",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "28606378245627228872222",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "41407736378833684986947372",
        id: "0x41AB1b6fcbB2fA9DCEd81aCbdeC13Ea6315F2Bf2"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "28606378245627228872222",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xd1BB51fECC950c7b1e4197D8d13A1d2A60795D2C",
          liqDepth: 27088.005754404217,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "XDCE",
        decimals: 18,
        contract: "0x41AB1b6fcbB2fA9DCEd81aCbdeC13Ea6315F2Bf2",
        reserveBalance: "41407736378833684986947372",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/xinfin_28.png",
          name: "XinFin XDCE"
        },
        reserveFeed: {
          reserveAddress: "0x41AB1b6fcbB2fA9DCEd81aCbdeC13Ea6315F2Bf2",
          poolId: "0xd1BB51fECC950c7b1e4197D8d13A1d2A60795D2C",
          costByNetworkUsd: 0.0006541774103896861,
          liqDepth: 27088.005754404217,
          priority: 10,
          change24H: -66.81146406132923,
          volume24H: 1011653.60087
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "AUCBNT",
      decimals: 18,
      contract: "0x164A1229F4826C9dd70Ee3D9f4f3d7B68a172153",
      network: "ETH"
    },
    contract: "0x3B0116363e435D9E4EF24ecA6282a21b7CC662df",
    converterType: 1,
    fee: 0.001,
    id: "0x164A1229F4826C9dd70Ee3D9f4f3d7B68a172153",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "25623917535614580829459",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "223542952180377380815948",
        id: "0xc12d099be31567add4e4e4d0D45691C3F58f5663"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "25623917535614580829459",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x164A1229F4826C9dd70Ee3D9f4f3d7B68a172153",
          liqDepth: 24263.8484220283,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "AUC",
        decimals: 18,
        contract: "0xc12d099be31567add4e4e4d0D45691C3F58f5663",
        reserveBalance: "223542952180377380815948",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/auctus_28.jpg",
          name: "Auctus"
        },
        reserveFeed: {
          reserveAddress: "0xc12d099be31567add4e4e4d0D45691C3F58f5663",
          poolId: "0x164A1229F4826C9dd70Ee3D9f4f3d7B68a172153",
          costByNetworkUsd: 0.10854222056819639,
          liqDepth: 24263.8484220283,
          priority: 10,
          change24H: 0.09972439108579356,
          volume24H: 2183.358129
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "BOXXBNT",
      decimals: 18,
      contract: "0x849D49911cEF804bdB1FEC58150B8EabAB119796",
      network: "ETH"
    },
    contract: "0x3167cc146d228C6977dCbadA380dF926b39865b1",
    converterType: 1,
    fee: 0.001,
    id: "0x849D49911cEF804bdB1FEC58150B8EabAB119796",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "3023413891427009136170",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "4690244915544968288015",
        id: "0x780116D91E5592E58a3b3c76A351571b39abCEc6"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "3023413891427009136170",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x849D49911cEF804bdB1FEC58150B8EabAB119796",
          liqDepth: 2862.936796322318,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "BOXX",
        decimals: 15,
        contract: "0x780116D91E5592E58a3b3c76A351571b39abCEc6",
        reserveBalance: "4690244915544968288015",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/boxx_28.png",
          name: "Boxx"
        },
        reserveFeed: {
          reserveAddress: "0x780116D91E5592E58a3b3c76A351571b39abCEc6",
          poolId: "0x849D49911cEF804bdB1FEC58150B8EabAB119796",
          costByNetworkUsd: 0.0006104024092289151,
          liqDepth: 2862.936796322318,
          priority: 10
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "CEEKBNT",
      decimals: 18,
      contract: "0x2F2ad6954d99Ea14fA145B9AB0fb6BA5Ac32c0Ee",
      network: "ETH"
    },
    contract: "0x72A38A55849b58FC2537b225a1ba3c4766316b0a",
    converterType: 1,
    fee: 0.001,
    id: "0x2F2ad6954d99Ea14fA145B9AB0fb6BA5Ac32c0Ee",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "15440599647331301909657",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "7797735154937855548344892",
        id: "0xb056c38f6b7Dc4064367403E26424CD2c60655e1"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "15440599647331301909657",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x2F2ad6954d99Ea14fA145B9AB0fb6BA5Ac32c0Ee",
          liqDepth: 14621.041800784289,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "CEEK",
        decimals: 18,
        contract: "0xb056c38f6b7Dc4064367403E26424CD2c60655e1",
        reserveBalance: "7797735154937855548344892",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/ceek_28.png",
          name: "CEEK"
        },
        reserveFeed: {
          reserveAddress: "0xb056c38f6b7Dc4064367403E26424CD2c60655e1",
          poolId: "0x2F2ad6954d99Ea14fA145B9AB0fb6BA5Ac32c0Ee",
          costByNetworkUsd: 0.0018750369832098784,
          liqDepth: 14621.041800784289,
          priority: 10,
          change24H: -19.299173627847335,
          volume24H: 1975.447634
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "CLNBNT",
      decimals: 18,
      contract: "0xEB027349398De19D925DefC15c4302fE92FC69f9",
      network: "ETH"
    },
    contract: "0x64846ff24B1AF06075efc44d7Fe9f1d5969f3275",
    converterType: 1,
    fee: 0.001,
    id: "0xEB027349398De19D925DefC15c4302fE92FC69f9",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "8106363496527",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "326050273078205",
        id: "0x4162178B78D6985480A308B2190EE5517460406D"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "8106363496527",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xEB027349398De19D925DefC15c4302fE92FC69f9",
          liqDepth: 0.000007676093043158355,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "CLN",
        decimals: 18,
        contract: "0x4162178B78D6985480A308B2190EE5517460406D",
        reserveBalance: "326050273078205",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/colu_28.png",
          name: "Colu Local Network"
        },
        reserveFeed: {
          reserveAddress: "0x4162178B78D6985480A308B2190EE5517460406D",
          poolId: "0xEB027349398De19D925DefC15c4302fE92FC69f9",
          costByNetworkUsd: 0.023542667119058662,
          liqDepth: 0.000007676093043158355,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "DANBNT",
      decimals: 18,
      contract: "0xa06cFAB8B584c91Df1aBee6e8503486AB4e23F40",
      network: "ETH"
    },
    contract: "0x20d23C7A4b2Ea38f9Dc885bd25b1BC8c2601D44d",
    converterType: 1,
    fee: 0.001,
    id: "0xa06cFAB8B584c91Df1aBee6e8503486AB4e23F40",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1050896611089389696",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "5435518285845",
        id: "0x9B70740e708a083C6fF38Df52297020f5DfAa5EE"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1050896611089389696",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xa06cFAB8B584c91Df1aBee6e8503486AB4e23F40",
          liqDepth: 0.9951170051673599,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "DAN",
        decimals: 10,
        contract: "0x9B70740e708a083C6fF38Df52297020f5DfAa5EE",
        reserveBalance: "5435518285845",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/daneel_28.png",
          name: "Daneel"
        },
        reserveFeed: {
          reserveAddress: "0x9B70740e708a083C6fF38Df52297020f5DfAa5EE",
          poolId: "0xa06cFAB8B584c91Df1aBee6e8503486AB4e23F40",
          costByNetworkUsd: 0.001830767468410163,
          liqDepth: 0.9951170051673599,
          priority: 10
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "DATABNT",
      decimals: 18,
      contract: "0xdD8a17169aa94E548602096EB9C9d44216cE8a37",
      network: "ETH"
    },
    contract: "0x8658863984d116d4B3A0A5af45979eceAC8a62f1",
    converterType: 1,
    fee: 0.001,
    id: "0xdD8a17169aa94E548602096EB9C9d44216cE8a37",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "36664181916838837076776",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "875065869717042204044081",
        id: "0x0Cf0Ee63788A0849fE5297F3407f701E122cC023"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "36664181916838837076776",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xdD8a17169aa94E548602096EB9C9d44216cE8a37",
          liqDepth: 34718.11643599685,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "DATA",
        decimals: 18,
        contract: "0x0Cf0Ee63788A0849fE5297F3407f701E122cC023",
        reserveBalance: "875065869717042204044081",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/streamr2_28.png",
          name: "DATAcoin"
        },
        reserveFeed: {
          reserveAddress: "0x0Cf0Ee63788A0849fE5297F3407f701E122cC023",
          poolId: "0xdD8a17169aa94E548602096EB9C9d44216cE8a37",
          costByNetworkUsd: 0.03967486064474571,
          liqDepth: 34718.11643599685,
          priority: 10,
          change24H: -2.103956303731827,
          volume24H: 549.384928
        }
      }
    ],
    version: "32"
  },
  {
    anchor: {
      symbol: "DTRCBNT",
      decimals: 18,
      contract: "0x1F593cDC35D7f0B0495dA16B631d28DE5AE25a07",
      network: "ETH"
    },
    contract: "0x71168843b49E305E4d53dE158683903eF261B37f",
    converterType: 1,
    fee: 0.001,
    id: "0x1F593cDC35D7f0B0495dA16B631d28DE5AE25a07",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "7040313799441201190464",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "61844751479836007689464170",
        id: "0xc20464e0C373486d2B3335576e83a218b1618A5E"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "7040313799441201190464",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x1F593cDC35D7f0B0495dA16B631d28DE5AE25a07",
          liqDepth: 6666.627249159942,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "DTRC",
        decimals: 18,
        contract: "0xc20464e0C373486d2B3335576e83a218b1618A5E",
        reserveBalance: "61844751479836007689464170",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/datarius_28.png",
          name: "Datarius Credit"
        },
        reserveFeed: {
          reserveAddress: "0xc20464e0C373486d2B3335576e83a218b1618A5E",
          poolId: "0x1F593cDC35D7f0B0495dA16B631d28DE5AE25a07",
          costByNetworkUsd: 0.00010779616846440953,
          liqDepth: 6666.627249159942,
          priority: 10,
          change24H: 1.0449599415630395,
          volume24H: 0
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "FKXBNT",
      decimals: 18,
      contract: "0x80c222E38fb57F0710aF21128535096D90503285",
      network: "ETH"
    },
    contract: "0xac4CcEB8Bb7bF4d9Ff6493cDf3F87fE349Ab1beC",
    converterType: 1,
    fee: 0.001,
    id: "0x80c222E38fb57F0710aF21128535096D90503285",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "354815622990578238",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "38711097864572368366",
        id: "0x009e864923b49263c7F10D19B7f8Ab7a9A5AAd33"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "354815622990578238",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x80c222E38fb57F0710aF21128535096D90503285",
          liqDepth: 0.33598268032376577,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "FKX",
        decimals: 18,
        contract: "0x009e864923b49263c7F10D19B7f8Ab7a9A5AAd33",
        reserveBalance: "38711097864572368366",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/fortknoxster28.png",
          name: "Knoxstertoken"
        },
        reserveFeed: {
          reserveAddress: "0x009e864923b49263c7F10D19B7f8Ab7a9A5AAd33",
          poolId: "0x80c222E38fb57F0710aF21128535096D90503285",
          costByNetworkUsd: 0.00867923409196954,
          liqDepth: 0.33598268032376577,
          priority: 10
        }
      }
    ],
    version: "25"
  },
  {
    anchor: {
      symbol: "FTXBNT",
      decimals: 18,
      contract: "0x4d849DaD08A4061bE102DBCA2CE2718A9a0b635a",
      network: "ETH"
    },
    contract: "0x810C99C5De0A673E4bc86090f9bFE96a6D1B49a7",
    converterType: 1,
    fee: 0.001,
    id: "0x4d849DaD08A4061bE102DBCA2CE2718A9a0b635a",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "7625381281802739415509",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "2493906317631236586493137",
        id: "0xd559f20296FF4895da39b5bd9ADd54b442596a61"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "7625381281802739415509",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x4d849DaD08A4061bE102DBCA2CE2718A9a0b635a",
          liqDepth: 7220.640455335274,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "FTX",
        decimals: 18,
        contract: "0xd559f20296FF4895da39b5bd9ADd54b442596a61",
        reserveBalance: "2493906317631236586493137",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/fintrux_28_28.png",
          name: "FintruX Network"
        },
        reserveFeed: {
          reserveAddress: "0xd559f20296FF4895da39b5bd9ADd54b442596a61",
          poolId: "0x4d849DaD08A4061bE102DBCA2CE2718A9a0b635a",
          costByNetworkUsd: 0.0028953134302950024,
          liqDepth: 7220.640455335274,
          priority: 10,
          change24H: 0.4397516636437381,
          volume24H: 0
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "GESBNT",
      decimals: 18,
      contract: "0x5972CED550248B17c9F674639D33E5446b6ad95A",
      network: "ETH"
    },
    contract: "0x32d4fb837f41955b81556F74DAdB2C5b8a0D0989",
    converterType: 1,
    fee: 0.001,
    id: "0x5972CED550248B17c9F674639D33E5446b6ad95A",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "7740149798781342937",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "90494640369776339925325",
        id: "0xFB1e5F5e984C28Ad7E228CDaA1F8A0919BB6a09B"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "7740149798781342937",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x5972CED550248B17c9F674639D33E5446b6ad95A",
          liqDepth: 7.329317276345151,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "GES",
        decimals: 18,
        contract: "0xFB1e5F5e984C28Ad7E228CDaA1F8A0919BB6a09B",
        reserveBalance: "90494640369776339925325",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/galaxy-esolutions_28.png",
          name: "Galaxy eSolutions"
        },
        reserveFeed: {
          reserveAddress: "0xFB1e5F5e984C28Ad7E228CDaA1F8A0919BB6a09B",
          poolId: "0x5972CED550248B17c9F674639D33E5446b6ad95A",
          costByNetworkUsd: 0.00008099172775753708,
          liqDepth: 7.329317276345151,
          priority: 10
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "HOTBNT",
      decimals: 18,
      contract: "0x0Ac0e122D09cC4DA4A96Cc2731D2b7cc1f8b025a",
      network: "ETH"
    },
    contract: "0x2BeA21613B6c2C129d3F714c702008cDD3dD995B",
    converterType: 1,
    fee: 0.001,
    id: "0x0Ac0e122D09cC4DA4A96Cc2731D2b7cc1f8b025a",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "27007943640341974",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "169320971156311400336",
        id: "0x9AF839687F6C94542ac5ece2e317dAAE355493A1"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "27007943640341974",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x0Ac0e122D09cC4DA4A96Cc2731D2b7cc1f8b025a",
          liqDepth: 0.025574413036926102,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "HOT",
        decimals: 18,
        contract: "0x9AF839687F6C94542ac5ece2e317dAAE355493A1",
        reserveBalance: "169320971156311400336",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/hydroprotocol_28.png",
          name: "Hydro Protocol"
        },
        reserveFeed: {
          reserveAddress: "0x9AF839687F6C94542ac5ece2e317dAAE355493A1",
          poolId: "0x0Ac0e122D09cC4DA4A96Cc2731D2b7cc1f8b025a",
          costByNetworkUsd: 0.00015104102499693714,
          liqDepth: 0.025574413036926102,
          priority: 10
        }
      }
    ],
    version: "19"
  },
  {
    anchor: {
      symbol: "MADBNT",
      decimals: 18,
      contract: "0x014186b1a2d675fc1e303A3d62B574C3270A38e0",
      network: "ETH"
    },
    contract: "0xACC03E1fD72CddC66C736cCe84626fbc63dd953B",
    converterType: 1,
    fee: 0.001,
    id: "0x014186b1a2d675fc1e303A3d62B574C3270A38e0",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "64259574010420341698090",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1768033734432046527733540",
        id: "0x5B09A0371C1DA44A8E24D36Bf5DEb1141a84d875"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "64259574010420341698090",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x014186b1a2d675fc1e303A3d62B574C3270A38e0",
          liqDepth: 60848.797272542106,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "MAD",
        decimals: 18,
        contract: "0x5B09A0371C1DA44A8E24D36Bf5DEb1141a84d875",
        reserveBalance: "1768033734432046527733540",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5B09A0371C1DA44A8E24D36Bf5DEb1141a84d875/logo.png",
          name: "MADToken"
        },
        reserveFeed: {
          reserveAddress: "0x5B09A0371C1DA44A8E24D36Bf5DEb1141a84d875",
          poolId: "0x014186b1a2d675fc1e303A3d62B574C3270A38e0",
          costByNetworkUsd: 0.03441608386057681,
          liqDepth: 60848.797272542106,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "MORPHBNT",
      decimals: 18,
      contract: "0xB2Ea67533290fAd84e3fe2E1Fb68D21Ca062d7fc",
      network: "ETH"
    },
    contract: "0x952EB7dC904F6f8b6b0Bc6c5c99d45143E743Cd7",
    converterType: 1,
    fee: 0.001,
    id: "0xB2Ea67533290fAd84e3fe2E1Fb68D21Ca062d7fc",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "32511145910426250687",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1797938235944146",
        id: "0x2Ef27BF41236bD859a95209e17a43Fbd26851f92"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "32511145910426250687",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xB2Ea67533290fAd84e3fe2E1Fb68D21Ca062d7fc",
          liqDepth: 30.785515731448655,
          costByNetworkUsd: 0.9469218899963723,
          priority: 10
        }
      },
      {
        symbol: "MORPH",
        decimals: 4,
        contract: "0x2Ef27BF41236bD859a95209e17a43Fbd26851f92",
        reserveBalance: "1797938235944146",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x2Ef27BF41236bD859a95209e17a43Fbd26851f92",
          poolId: "0xB2Ea67533290fAd84e3fe2E1Fb68D21Ca062d7fc",
          costByNetworkUsd: 1.712267702860346e-10,
          liqDepth: 30.785515731448655,
          priority: 10
        }
      }
    ],
    version: "32"
  },
  {
    anchor: {
      symbol: "MRGBNT",
      decimals: 18,
      contract: "0x25Bf8913D6296a69C7B43BC781614992cb218935",
      network: "ETH"
    },
    contract: "0xE65c7e27C1c086f26CE0Daa986C3d9c24Ef3c2D8",
    converterType: 1,
    fee: 0.001,
    id: "0x25Bf8913D6296a69C7B43BC781614992cb218935",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "4858315101341910101989",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "58825236756253285890222480",
        id: "0xcbee6459728019CB1f2bB971dDe2eE3271BC7617"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "4858315101341910101989",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x25Bf8913D6296a69C7B43BC781614992cb218935",
          liqDepth: 4600.444917978222,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "MRG",
        decimals: 18,
        contract: "0xcbee6459728019CB1f2bB971dDe2eE3271BC7617",
        reserveBalance: "58825236756253285890222480",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/1cca2ab0-d209-11e8-acf9-2579a95089da.jpeg",
          name: "Wemerge"
        },
        reserveFeed: {
          reserveAddress: "0xcbee6459728019CB1f2bB971dDe2eE3271BC7617",
          poolId: "0x25Bf8913D6296a69C7B43BC781614992cb218935",
          costByNetworkUsd: 0.00007820529370821755,
          liqDepth: 4600.444917978222,
          priority: 10,
          change24H: 4.47811631735827,
          volume24H: 0
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "MYBBNT",
      decimals: 18,
      contract: "0xf22FB05aC032fcAf3273f50aF8db2753888Bdd48",
      network: "ETH"
    },
    contract: "0x9dB89726aE2683d21A71fF1417638E72e6D8C0d9",
    converterType: 1,
    fee: 0.001,
    id: "0xf22FB05aC032fcAf3273f50aF8db2753888Bdd48",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "18512046398207372269513",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "17912834932942591074033252",
        id: "0x5d60d8d7eF6d37E16EBABc324de3bE57f135e0BC"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "18512046398207372269513",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xf22FB05aC032fcAf3273f50aF8db2753888Bdd48",
          liqDepth: 17529.46196315822,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "MYB",
        decimals: 18,
        contract: "0x5d60d8d7eF6d37E16EBABc324de3bE57f135e0BC",
        reserveBalance: "17912834932942591074033252",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/mybit_28_2.png",
          name: "MyBit"
        },
        reserveFeed: {
          reserveAddress: "0x5d60d8d7eF6d37E16EBABc324de3bE57f135e0BC",
          poolId: "0xf22FB05aC032fcAf3273f50aF8db2753888Bdd48",
          costByNetworkUsd: 0.0009785978617444116,
          liqDepth: 17529.46196315822,
          priority: 10,
          change24H: -8.67292579332693,
          volume24H: 660.970319
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "POABNT",
      decimals: 18,
      contract: "0x564c07255AFe5050D82c8816F78dA13f2B17ac6D",
      network: "ETH"
    },
    contract: "0x0bFbfF3FC69BD69b258C480bCc65C4E0d75A5163",
    converterType: 1,
    fee: 0.001,
    id: "0x564c07255AFe5050D82c8816F78dA13f2B17ac6D",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "38194838465113417519349",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1950468741916457556624939",
        id: "0x6758B7d441a9739b98552B373703d8d3d14f9e62"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "38194838465113417519349",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x564c07255AFe5050D82c8816F78dA13f2B17ac6D",
          liqDepth: 36167.528627629894,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "POA20",
        decimals: 18,
        contract: "0x6758B7d441a9739b98552B373703d8d3d14f9e62",
        reserveBalance: "1950468741916457556624939",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/poa_28_2.png",
          name: "POA ERC20 on Foundation"
        },
        reserveFeed: {
          reserveAddress: "0x6758B7d441a9739b98552B373703d8d3d14f9e62",
          poolId: "0x564c07255AFe5050D82c8816F78dA13f2B17ac6D",
          costByNetworkUsd: 0.018542993204850356,
          liqDepth: 36167.528627629894,
          priority: 10,
          change24H: -2.317796161302015,
          volume24H: 580.583441
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "RBLXBNT",
      decimals: 18,
      contract: "0x78AcF38ec85A9E4B2B88961b9D4BffbA04FdbA59",
      network: "ETH"
    },
    contract: "0x32131848eDc60E032aBf0369241D34ec969EBf90",
    converterType: 1,
    fee: 0.001,
    id: "0x78AcF38ec85A9E4B2B88961b9D4BffbA04FdbA59",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1984695072056234034521",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "245156793163353289059413",
        id: "0xFc2C4D8f95002C14eD0a7aA65102Cac9e5953b5E"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1984695072056234034521",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x78AcF38ec85A9E4B2B88961b9D4BffbA04FdbA59",
          liqDepth: 1879.3512087051754,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "RBLX",
        decimals: 18,
        contract: "0xFc2C4D8f95002C14eD0a7aA65102Cac9e5953b5E",
        reserveBalance: "245156793163353289059413",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/rublix_28.png",
          name: "Rublix"
        },
        reserveFeed: {
          reserveAddress: "0xFc2C4D8f95002C14eD0a7aA65102Cac9e5953b5E",
          poolId: "0x78AcF38ec85A9E4B2B88961b9D4BffbA04FdbA59",
          costByNetworkUsd: 0.007665915288151624,
          liqDepth: 1879.3512087051754,
          priority: 10,
          change24H: 4.291687841805315,
          volume24H: 138.885314
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "REPUXBNT",
      decimals: 18,
      contract: "0x28291d74Bca9dE7cb6948A8E699651ed93832c50",
      network: "ETH"
    },
    contract: "0xe27cf7324E6377bdDc48DB6BAC642839ffa9Bb36",
    converterType: 1,
    fee: 0.001,
    id: "0x28291d74Bca9dE7cb6948A8E699651ed93832c50",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "120025266214417130566",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "48822488102841082688516",
        id: "0x4D305c2334c02E44aC592BbEA681bA4cC1576DE3"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "120025266214417130566",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x28291d74Bca9dE7cb6948A8E699651ed93832c50",
          liqDepth: 113.654551931509,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "REPUX",
        decimals: 18,
        contract: "0x4D305c2334c02E44aC592BbEA681bA4cC1576DE3",
        reserveBalance: "48822488102841082688516",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/repux_28.png",
          name: "RepuX"
        },
        reserveFeed: {
          reserveAddress: "0x4D305c2334c02E44aC592BbEA681bA4cC1576DE3",
          poolId: "0x28291d74Bca9dE7cb6948A8E699651ed93832c50",
          costByNetworkUsd: 0.0023279139664513578,
          liqDepth: 113.654551931509,
          priority: 10
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "SCLBNT",
      decimals: 18,
      contract: "0xFcEb45cF070B277fedE520c5539ae204Bc1D493E",
      network: "ETH"
    },
    contract: "0xd361339550CD8B3e9446Bbb12AEA337785A7aea4",
    converterType: 1,
    fee: 0.001,
    id: "0xFcEb45cF070B277fedE520c5539ae204Bc1D493E",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "10210691772496721483180",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "90194715626040",
        id: "0xd7631787B4dCc87b1254cfd1e5cE48e96823dEe8"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "10210691772496721483180",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xFcEb45cF070B277fedE520c5539ae204Bc1D493E",
          liqDepth: 9668.727551420045,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "SCL",
        decimals: 8,
        contract: "0xd7631787B4dCc87b1254cfd1e5cE48e96823dEe8",
        reserveBalance: "90194715626040",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/socialcoin2_28.png",
          name: "SOCIALL"
        },
        reserveFeed: {
          reserveAddress: "0xd7631787B4dCc87b1254cfd1e5cE48e96823dEe8",
          poolId: "0xFcEb45cF070B277fedE520c5539ae204Bc1D493E",
          costByNetworkUsd: 0.010719838168244747,
          liqDepth: 9668.727551420045,
          priority: 10,
          change24H: -1.3468671095830482,
          volume24H: 0
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "SIGBNT",
      decimals: 18,
      contract: "0x09953e3e5C6Be303D8D83Ccb672d241abc9BEe29",
      network: "ETH"
    },
    contract: "0x150A46613a16B4256AcD227d00463BAa78B547Ec",
    converterType: 1,
    fee: 0.001,
    id: "0x09953e3e5C6Be303D8D83Ccb672d241abc9BEe29",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "164533620302227975",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "193565294273960445900",
        id: "0x6888a16eA9792c15A4DCF2f6C623D055c8eDe792"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "164533620302227975",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x09953e3e5C6Be303D8D83Ccb672d241abc9BEe29",
          liqDepth: 0.15580048670512806,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "SIG",
        decimals: 18,
        contract: "0x6888a16eA9792c15A4DCF2f6C623D055c8eDe792",
        reserveBalance: "193565294273960445900",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/spectiv_28.png",
          name: "Signals"
        },
        reserveFeed: {
          reserveAddress: "0x6888a16eA9792c15A4DCF2f6C623D055c8eDe792",
          poolId: "0x09953e3e5C6Be303D8D83Ccb672d241abc9BEe29",
          costByNetworkUsd: 0.0008048988703760997,
          liqDepth: 0.15580048670512806,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "SNTBNT",
      decimals: 18,
      contract: "0xa3b3c5a8b22C044D5f2d372f628245E2106D310D",
      network: "ETH"
    },
    contract: "0x9C67411d318b65A83bd07c717F46B8bA26Ae469F",
    converterType: 1,
    fee: 0.001,
    id: "0xa3b3c5a8b22C044D5f2d372f628245E2106D310D",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "42402691973701609925480",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1293157873043777665383992",
        id: "0x744d70FDBE2Ba4CF95131626614a1763DF805B9E"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "42402691973701609925480",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xa3b3c5a8b22C044D5f2d372f628245E2106D310D",
          liqDepth: 40152.03722482537,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "SNT",
        decimals: 18,
        contract: "0x744d70FDBE2Ba4CF95131626614a1763DF805B9E",
        reserveBalance: "1293157873043777665383992",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/status.png",
          name: "StatusNetwork"
        },
        reserveFeed: {
          reserveAddress: "0x744d70FDBE2Ba4CF95131626614a1763DF805B9E",
          poolId: "0xa3b3c5a8b22C044D5f2d372f628245E2106D310D",
          costByNetworkUsd: 0.031049601956424144,
          liqDepth: 40152.03722482537,
          priority: 10,
          change24H: 34.187677678216104,
          volume24H: 0
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "TNSBNT",
      decimals: 18,
      contract: "0x5cf2f6387c4F551316e1E422aCf1025a539825c3",
      network: "ETH"
    },
    contract: "0x7834D96BD681e43740E6dA513638504174040010",
    converterType: 1,
    fee: 0.001,
    id: "0x5cf2f6387c4F551316e1E422aCf1025a539825c3",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "2408443230552320325787",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "2435619496926359997971333",
        id: "0xb0280743b44bF7db4B6bE482b2Ba7b75E5dA096C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "2408443230552320325787",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x5cf2f6387c4F551316e1E422aCf1025a539825c3",
          liqDepth: 2280.607615832309,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "TNS",
        decimals: 18,
        contract: "0xb0280743b44bF7db4B6bE482b2Ba7b75E5dA096C",
        reserveBalance: "2435619496926359997971333",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/transcodium_28.png",
          name: "Transcodium"
        },
        reserveFeed: {
          reserveAddress: "0xb0280743b44bF7db4B6bE482b2Ba7b75E5dA096C",
          poolId: "0x5cf2f6387c4F551316e1E422aCf1025a539825c3",
          costByNetworkUsd: 0.0009363562817223015,
          liqDepth: 2280.607615832309,
          priority: 10,
          change24H: 15.63014299397463,
          volume24H: 0
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "X8XBNT",
      decimals: 18,
      contract: "0xAe0ceCc84bC1DDefe13C6e5B2E9D311927e45eD8",
      network: "ETH"
    },
    contract: "0x8C73126b85f59d85Aa61391579B4C2710DD70f96",
    converterType: 1,
    fee: 0.001,
    id: "0xAe0ceCc84bC1DDefe13C6e5B2E9D311927e45eD8",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "15150656167705682842268",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1845631025311480573398642",
        id: "0x910Dfc18D6EA3D6a7124A6F8B5458F281060fa4c"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "15150656167705682842268",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xAe0ceCc84bC1DDefe13C6e5B2E9D311927e45eD8",
          liqDepth: 14346.48797306402,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "X8X",
        decimals: 18,
        contract: "0x910Dfc18D6EA3D6a7124A6F8B5458F281060fa4c",
        reserveBalance: "1845631025311480573398642",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/x8currency_28.png",
          name: "X8XToken"
        },
        reserveFeed: {
          reserveAddress: "0x910Dfc18D6EA3D6a7124A6F8B5458F281060fa4c",
          poolId: "0xAe0ceCc84bC1DDefe13C6e5B2E9D311927e45eD8",
          costByNetworkUsd: 0.0077732156516185655,
          liqDepth: 14346.48797306402,
          priority: 10,
          change24H: -3.047010827765778,
          volume24H: 0
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "XBPBNT",
      decimals: 18,
      contract: "0xbb83a9Fe991BAA72F412F39af254EEbbfdc910BA",
      network: "ETH"
    },
    contract: "0xBA2BE1Cd1F00470c21385B7cbED6211aeFAc0172",
    converterType: 1,
    fee: 0.001,
    id: "0xbb83a9Fe991BAA72F412F39af254EEbbfdc910BA",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "19061702509699019747632",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "35275504435865966103206782",
        id: "0x28dee01D53FED0Edf5f6E310BF8Ef9311513Ae40"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "19061702509699019747632",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xbb83a9Fe991BAA72F412F39af254EEbbfdc910BA",
          liqDepth: 18049.94336710194,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "XBP",
        decimals: 18,
        contract: "0x28dee01D53FED0Edf5f6E310BF8Ef9311513Ae40",
        reserveBalance: "35275504435865966103206782",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/blitzpredict_28.png",
          name: "BlitzPredict"
        },
        reserveFeed: {
          reserveAddress: "0x28dee01D53FED0Edf5f6E310BF8Ef9311513Ae40",
          poolId: "0xbb83a9Fe991BAA72F412F39af254EEbbfdc910BA",
          costByNetworkUsd: 0.0005116849115487025,
          liqDepth: 18049.94336710194,
          priority: 10,
          change24H: -3.7758246932307062,
          volume24H: 0
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "XNKBNT",
      decimals: 18,
      contract: "0x1B4D8c62DdF6947616a5FCda4Ca40A8715d2a4cb",
      network: "ETH"
    },
    contract: "0x4f138e1CEeC7b33dfA4f3051594Ec016a08c7513",
    converterType: 1,
    fee: 0.001,
    id: "0x1B4D8c62DdF6947616a5FCda4Ca40A8715d2a4cb",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "10305850647900379305264",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "17244950816527533352563219",
        id: "0xBC86727E770de68B1060C91f6BB6945c73e10388"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "10305850647900379305264",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x1B4D8c62DdF6947616a5FCda4Ca40A8715d2a4cb",
          liqDepth: 9758.835573567552,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "XNK",
        decimals: 18,
        contract: "0xBC86727E770de68B1060C91f6BB6945c73e10388",
        reserveBalance: "17244950816527533352563219",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/paywithink_28.png",
          name: "Ink Protocol"
        },
        reserveFeed: {
          reserveAddress: "0xBC86727E770de68B1060C91f6BB6945c73e10388",
          poolId: "0x1B4D8c62DdF6947616a5FCda4Ca40A8715d2a4cb",
          costByNetworkUsd: 0.0005658952395628,
          liqDepth: 9758.835573567552,
          priority: 10,
          change24H: -1.1247943367613356,
          volume24H: 245.728566
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "ZIPTBNT",
      decimals: 18,
      contract: "0xC4a01182ab1e502a1C1d17024e4924573CE001CC",
      network: "ETH"
    },
    contract: "0x056e7916cdc2BC7414a903685938c707186D140D",
    converterType: 1,
    fee: 0.001,
    id: "0xC4a01182ab1e502a1C1d17024e4924573CE001CC",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "6230547351707505145916",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "10299446742069899991247790",
        id: "0xEDD7c94FD7B4971b916d15067Bc454b9E1bAD980"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "6230547351707505145916",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xC4a01182ab1e502a1C1d17024e4924573CE001CC",
          liqDepth: 5899.841674013364,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "ZIPT",
        decimals: 18,
        contract: "0xEDD7c94FD7B4971b916d15067Bc454b9E1bAD980",
        reserveBalance: "10299446742069899991247790",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/zippie_28.png",
          name: "Zippie"
        },
        reserveFeed: {
          reserveAddress: "0xEDD7c94FD7B4971b916d15067Bc454b9E1bAD980",
          poolId: "0xC4a01182ab1e502a1C1d17024e4924573CE001CC",
          costByNetworkUsd: 0.0005728309317736869,
          liqDepth: 5899.841674013364,
          priority: 10,
          change24H: 1.9972098552828805,
          volume24H: 143.643804
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "XPATBNT",
      decimals: 18,
      contract: "0xEe769CE6B4E2C2A079c5f67081225Af7C89F874C",
      network: "ETH"
    },
    contract: "0x1f67A92AA26CC0Ff6c62B6e284aaf57249fdEBB8",
    converterType: 1,
    fee: 0.001,
    id: "0xEe769CE6B4E2C2A079c5f67081225Af7C89F874C",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "2448730484141612172559",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "418634547728275390015710655",
        id: "0xBB1fA4FdEB3459733bF67EbC6f893003fA976a82"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "2448730484141612172559",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xEe769CE6B4E2C2A079c5f67081225Af7C89F874C",
          liqDepth: 2318.75649814399,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "PAT",
        decimals: 18,
        contract: "0xBB1fA4FdEB3459733bF67EbC6f893003fA976a82",
        reserveBalance: "418634547728275390015710655",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/pat.png",
          name: "Pangea Arbitration Token"
        },
        reserveFeed: {
          reserveAddress: "0xBB1fA4FdEB3459733bF67EbC6f893003fA976a82",
          poolId: "0xEe769CE6B4E2C2A079c5f67081225Af7C89F874C",
          costByNetworkUsd: 0.000005538856051720398,
          liqDepth: 2318.75649814399,
          priority: 10,
          change24H: 15.262883909940005,
          volume24H: 0
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "BBOBNT",
      decimals: 18,
      contract: "0x980B4118dAb781829DF80D7912d70B059a280DAd",
      network: "ETH"
    },
    contract: "0x99F357f722EC3e456Af0eB530c1C14a3251305Ad",
    converterType: 1,
    fee: 0.001,
    id: "0x980B4118dAb781829DF80D7912d70B059a280DAd",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "15961985724347089722",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "9680041088428712341564",
        id: "0x84F7c44B6Fed1080f647E354D552595be2Cc602F"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "15961985724347089722",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x980B4118dAb781829DF80D7912d70B059a280DAd",
          liqDepth: 15.114753690251764,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "BBO",
        decimals: 18,
        contract: "0x84F7c44B6Fed1080f647E354D552595be2Cc602F",
        reserveBalance: "9680041088428712341564",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/bigbom_28.png",
          name: "Bigbom"
        },
        reserveFeed: {
          reserveAddress: "0x84F7c44B6Fed1080f647E354D552595be2Cc602F",
          poolId: "0x980B4118dAb781829DF80D7912d70B059a280DAd",
          costByNetworkUsd: 0.001561434869147361,
          liqDepth: 15.114753690251764,
          priority: 10
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "SHPBNT",
      decimals: 18,
      contract: "0x6e0E0B9aB5f8e5F5F2DE4D34FfE46668FFB37476",
      network: "ETH"
    },
    contract: "0x0f1C029C5D7f626f6820bfe0F6a7B2Ac48746dDF",
    converterType: 1,
    fee: 0.001,
    id: "0x6e0E0B9aB5f8e5F5F2DE4D34FfE46668FFB37476",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "48667021457805653",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "230056049469443635969013",
        id: "0xEF2463099360a085f1f10b076Ed72Ef625497a06"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "48667021457805653",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x6e0E0B9aB5f8e5F5F2DE4D34FfE46668FFB37476",
          liqDepth: 0.04608386793949566,
          costByNetworkUsd: 0.9469218899999955,
          priority: 10
        }
      },
      {
        symbol: "SHP",
        decimals: 18,
        contract: "0xEF2463099360a085f1f10b076Ed72Ef625497a06",
        reserveBalance: "230056049469443635969013",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/sharpecapital_28_2.png",
          name: "Sharpe Platform Token"
        },
        reserveFeed: {
          reserveAddress: "0xEF2463099360a085f1f10b076Ed72Ef625497a06",
          poolId: "0x6e0E0B9aB5f8e5F5F2DE4D34FfE46668FFB37476",
          costByNetworkUsd: 2.0031582758103732e-7,
          liqDepth: 0.04608386793949566,
          priority: 10
        }
      }
    ],
    version: "6"
  },
  {
    anchor: {
      symbol: "WAXBNT",
      decimals: 18,
      contract: "0x67563E7A0F13642068F6F999e48c690107A4571F",
      network: "ETH"
    },
    contract: "0x7BAc8115f3789F4d7a3BFE241EB1bCb4D7F71665",
    converterType: 1,
    fee: 0.001,
    id: "0x67563E7A0F13642068F6F999e48c690107A4571F",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "11083962639611699343729",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "24312186427706",
        id: "0x39Bb259F66E1C59d5ABEF88375979b4D20D98022"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "11083962639611699343729",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x67563E7A0F13642068F6F999e48c690107A4571F",
          liqDepth: 10495.646851390498,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "WAX",
        decimals: 8,
        contract: "0x39Bb259F66E1C59d5ABEF88375979b4D20D98022",
        reserveBalance: "24312186427706",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/wax.png",
          name: "WAX Token"
        },
        reserveFeed: {
          reserveAddress: "0x39Bb259F66E1C59d5ABEF88375979b4D20D98022",
          poolId: "0x67563E7A0F13642068F6F999e48c690107A4571F",
          costByNetworkUsd: 0.0431703124792994,
          liqDepth: 10495.646851390498,
          priority: 10
        }
      }
    ],
    version: "6"
  },
  {
    anchor: {
      symbol: "FLIXXBNT",
      decimals: 18,
      contract: "0x2d5aDD875442023eC83718Bb03D866c9F4C6E8cE",
      network: "ETH"
    },
    contract: "0x604989E3cb3f4e77c29C220182d75A99531aCF3A",
    converterType: 1,
    fee: 0.001,
    id: "0x2d5aDD875442023eC83718Bb03D866c9F4C6E8cE",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "730045033108726099573",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "151623094426150983631633",
        id: "0xf04a8ac553FceDB5BA99A64799155826C136b0Be"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "730045033108726099573",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x2d5aDD875442023eC83718Bb03D866c9F4C6E8cE",
          liqDepth: 691.2956225364275,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "FLIXX",
        decimals: 18,
        contract: "0xf04a8ac553FceDB5BA99A64799155826C136b0Be",
        reserveBalance: "151623094426150983631633",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/flixxo_28.png",
          name: "Flixx"
        },
        reserveFeed: {
          reserveAddress: "0xf04a8ac553FceDB5BA99A64799155826C136b0Be",
          poolId: "0x2d5aDD875442023eC83718Bb03D866c9F4C6E8cE",
          costByNetworkUsd: 0.004559302955481677,
          liqDepth: 691.2956225364275,
          priority: 10,
          change24H: 66.91959509609352,
          volume24H: 0
        }
      }
    ],
    version: "39"
  },
  {
    anchor: {
      symbol: "MTLBNT",
      decimals: 18,
      contract: "0x60Be88DD72f03C91FB22EEF7Af24C2e99Db58530",
      network: "ETH"
    },
    contract: "0xE0569fd1C3f0affD7E08131A16C06f3381C9355a",
    converterType: 1,
    fee: 0.001,
    id: "0x60Be88DD72f03C91FB22EEF7Af24C2e99Db58530",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "38721925542111298550786",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "9857822662600",
        id: "0xF433089366899D83a9f26A773D59ec7eCF30355e"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "38721925542111298550786",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x60Be88DD72f03C91FB22EEF7Af24C2e99Db58530",
          liqDepth: 36666.6389187753,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "MTL",
        decimals: 8,
        contract: "0xF433089366899D83a9f26A773D59ec7eCF30355e",
        reserveBalance: "9857822662600",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/metalpay_28.png",
          name: "Metal"
        },
        reserveFeed: {
          reserveAddress: "0xF433089366899D83a9f26A773D59ec7eCF30355e",
          poolId: "0x60Be88DD72f03C91FB22EEF7Af24C2e99Db58530",
          costByNetworkUsd: 0.37195474268254364,
          liqDepth: 36666.6389187753,
          priority: 10,
          change24H: -26.164930639646293,
          volume24H: 21124.625072000003
        }
      }
    ],
    version: "9"
  },
  {
    anchor: {
      symbol: "CMCTBNT",
      decimals: 18,
      contract: "0xb5b0E0642d35D7Cab64CDa6EcF87Fd842cB5c58d",
      network: "ETH"
    },
    contract: "0xb2841c6e6a9ef1D6fEAa25cCaA6c61CBd58CAa76",
    converterType: 1,
    fee: 0.03,
    id: "0xb5b0E0642d35D7Cab64CDa6EcF87Fd842cB5c58d",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x47bc01597798DCD7506DCCA36ac4302fc93a8cFb" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xb5b0E0642d35D7Cab64CDa6EcF87Fd842cB5c58d",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "CMCT",
        decimals: 8,
        contract: "0x47bc01597798DCD7506DCCA36ac4302fc93a8cFb",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/crowdmachine_28.png",
          name: "Crowd Machine Compute Token"
        },
        reserveFeed: {
          reserveAddress: "0x47bc01597798DCD7506DCCA36ac4302fc93a8cFb",
          poolId: "0xb5b0E0642d35D7Cab64CDa6EcF87Fd842cB5c58d",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "25"
  },
  {
    anchor: {
      symbol: "AGRIBNT",
      decimals: 18,
      contract: "0xEab935f35693c3218b927436E63564018E92034f",
      network: "ETH"
    },
    contract: "0x7B00EFba58CC6fdaB1c162a9C9528B935F5F1af7",
    converterType: 1,
    fee: 0.001,
    id: "0xEab935f35693c3218b927436E63564018E92034f",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "24957646440687837031626",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "4132906892019509319295961",
        id: "0xa704fCe7b309Ec09DF16e2F5Ab8cAf6Fe8A4BAA9"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "24957646440687837031626",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xEab935f35693c3218b927436E63564018E92034f",
          liqDepth: 23632.941737567897,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "AGRI",
        decimals: 18,
        contract: "0xa704fCe7b309Ec09DF16e2F5Ab8cAf6Fe8A4BAA9",
        reserveBalance: "4132906892019509319295961",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/9c77fd00-c16f-11e8-9e96-092a24f940bf.jpeg",
          name: "AgriChain"
        },
        reserveFeed: {
          reserveAddress: "0xa704fCe7b309Ec09DF16e2F5Ab8cAf6Fe8A4BAA9",
          poolId: "0xEab935f35693c3218b927436E63564018E92034f",
          costByNetworkUsd: 0.0057182371524512774,
          liqDepth: 23632.941737567897,
          priority: 10,
          change24H: -4.442792425722944,
          volume24H: 0
        }
      }
    ],
    version: "32"
  },
  {
    anchor: {
      symbol: "EURSBNT",
      decimals: 18,
      contract: "0xFC0e04Eae452c163883AAAd4Ac1AE091Cc87FEf3",
      network: "ETH"
    },
    contract: "0x0D86A7A059f316F81FcEF32495aAe41Cd0C80511",
    converterType: 1,
    fee: 0.001,
    id: "0xFC0e04Eae452c163883AAAd4Ac1AE091Cc87FEf3",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "84911742208038205355241",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "6763963", id: "0xdB25f211AB05b1c97D595516F45794528a807ad8" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "84911742208038205355241",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xFC0e04Eae452c163883AAAd4Ac1AE091Cc87FEf3",
          liqDepth: 80404.78741482832,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "EURS",
        decimals: 2,
        contract: "0xdB25f211AB05b1c97D595516F45794528a807ad8",
        reserveBalance: "6763963",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/statiseuro_28.png",
          name: "STASIS EURS Token"
        },
        reserveFeed: {
          reserveAddress: "0xdB25f211AB05b1c97D595516F45794528a807ad8",
          poolId: "0xFC0e04Eae452c163883AAAd4Ac1AE091Cc87FEf3",
          costByNetworkUsd: 1.1887230520750678,
          liqDepth: 80404.78741482832,
          priority: 10,
          change24H: -0.7464264226287841,
          volume24H: 2194.3737039999996
        }
      }
    ],
    version: "32"
  },
  {
    anchor: {
      symbol: "EVOBNT",
      decimals: 18,
      contract: "0xBB8436eaf49888641Df27e4E1DfFbd4851788209",
      network: "ETH"
    },
    contract: "0x3a79e5B49c098aa9Ff95C7a504863090DC19fe97",
    converterType: 1,
    fee: 0.001,
    id: "0xBB8436eaf49888641Df27e4E1DfFbd4851788209",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "904454501785788530667",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "3884180628999058467693966",
        id: "0xefBd6D7deF37ffae990503EcdB1291B2f7E38788"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "904454501785788530667",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xBB8436eaf49888641Df27e4E1DfFbd4851788209",
          liqDepth: 856.4477662500071,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "EVO",
        decimals: 18,
        contract: "0xefBd6D7deF37ffae990503EcdB1291B2f7E38788",
        reserveBalance: "3884180628999058467693966",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xefBd6D7deF37ffae990503EcdB1291B2f7E38788",
          poolId: "0xBB8436eaf49888641Df27e4E1DfFbd4851788209",
          costByNetworkUsd: 0.0002204963795596476,
          liqDepth: 856.4477662500071,
          priority: 10
        }
      }
    ],
    version: "40"
  },
  {
    anchor: {
      symbol: "LOCBNT",
      decimals: 18,
      contract: "0x38838B895cbf02048455Fb7f649D97C564fC18a8",
      network: "ETH"
    },
    contract: "0x248b13d6d10C4102f72e79C04f87228aCe67fd3D",
    converterType: 1,
    fee: 0.01,
    id: "0x38838B895cbf02048455Fb7f649D97C564fC18a8",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "32870148363486381156",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "55911883918410779480",
        id: "0x5e3346444010135322268a4630d2ED5F8D09446c"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "32870148363486381156",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x38838B895cbf02048455Fb7f649D97C564fC18a8",
          liqDepth: 31.12546301293293,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "LOC",
        decimals: 18,
        contract: "0x5e3346444010135322268a4630d2ED5F8D09446c",
        reserveBalance: "55911883918410779480",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/locktrip_28_2.png",
          name: "LockTrip"
        },
        reserveFeed: {
          reserveAddress: "0x5e3346444010135322268a4630d2ED5F8D09446c",
          poolId: "0x38838B895cbf02048455Fb7f649D97C564fC18a8",
          costByNetworkUsd: 0.5566877885630299,
          liqDepth: 31.12546301293293,
          priority: 10,
          change24H: 1644.3133151417649,
          volume24H: 0
        }
      }
    ],
    version: "39"
  },
  {
    anchor: {
      symbol: "LOCIBNT",
      decimals: 18,
      contract: "0x6feb9Be6c40A12276cFa6DAFbD119ea62532daaB",
      network: "ETH"
    },
    contract: "0xdc59242010E2d29617Bfeec57E62c7C00a5ACb52",
    converterType: 1,
    fee: 0.001,
    id: "0x6feb9Be6c40A12276cFa6DAFbD119ea62532daaB",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "12851769572230137359244",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "8376844634840731349608335",
        id: "0x9c23D67AEA7B95D80942e3836BCDF7E708A747C2"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "12851769572230137359244",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x6feb9Be6c40A12276cFa6DAFbD119ea62532daaB",
          liqDepth: 12169.621933180651,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "LOCI",
        decimals: 18,
        contract: "0x9c23D67AEA7B95D80942e3836BCDF7E708A747C2",
        reserveBalance: "8376844634840731349608335",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/locipro_28.png",
          name: "LOCIcoin"
        },
        reserveFeed: {
          reserveAddress: "0x9c23D67AEA7B95D80942e3836BCDF7E708A747C2",
          poolId: "0x6feb9Be6c40A12276cFa6DAFbD119ea62532daaB",
          costByNetworkUsd: 0.0014527692065058853,
          liqDepth: 12169.621933180651,
          priority: 10,
          change24H: -2.4116214216468705,
          volume24H: 0
        }
      }
    ],
    version: "1"
  },
  {
    anchor: {
      symbol: "MFTBNT",
      decimals: 18,
      contract: "0x4319f9130848544afB97e92cb3Ea9fdb4b0A0B2a",
      network: "ETH"
    },
    contract: "0x1a24501A0D53c5F6f36BcA34103fB250e498396d",
    converterType: 1,
    fee: 0.001,
    id: "0x4319f9130848544afB97e92cb3Ea9fdb4b0A0B2a",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "33525183792186628799254",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "13406702835175698219443761",
        id: "0xDF2C7238198Ad8B389666574f2d8bc411A4b7428"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "33525183792186628799254",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x4319f9130848544afB97e92cb3Ea9fdb4b0A0B2a",
          liqDepth: 31745.730399094737,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "MFT",
        decimals: 18,
        contract: "0xDF2C7238198Ad8B389666574f2d8bc411A4b7428",
        reserveBalance: "13406702835175698219443761",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/mainframe_28.png",
          name: "Mainframe Token"
        },
        reserveFeed: {
          reserveAddress: "0xDF2C7238198Ad8B389666574f2d8bc411A4b7428",
          poolId: "0x4319f9130848544afB97e92cb3Ea9fdb4b0A0B2a",
          costByNetworkUsd: 0.0023678999071868887,
          liqDepth: 31745.730399094737,
          priority: 10,
          change24H: -11.688901398694444,
          volume24H: 1897.190089
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "BNT-USD",
      decimals: 18,
      contract: "0x607108c46bCE4cF6f86698E9B46E3270A734FeFe",
      network: "ETH"
    },
    contract: "0xc0b6d74940601Af8a8E720a9974E95DdA88B41b8",
    converterType: 1,
    fee: 0.003,
    id: "0x607108c46bCE4cF6f86698E9B46E3270A734FeFe",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "1", id: "0xa485bD50228440797Abb4d4595161d7546811160" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x607108c46bCE4cF6f86698E9B46E3270A734FeFe",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "PEG:USD",
        decimals: 18,
        contract: "0xa485bD50228440797Abb4d4595161d7546811160",
        reserveBalance: "1",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xa485bD50228440797Abb4d4595161d7546811160",
          poolId: "0x607108c46bCE4cF6f86698E9B46E3270A734FeFe",
          costByNetworkUsd: 0,
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "25"
  },
  {
    anchor: {
      symbol: "REALBNT",
      decimals: 18,
      contract: "0xE9ADced9da076D9dADA35F5b99970fDd58B1440D",
      network: "ETH"
    },
    contract: "0x1229e2a0711660BE162521f5626C68E85Ec99c7f",
    converterType: 1,
    fee: 0.001,
    id: "0xE9ADced9da076D9dADA35F5b99970fDd58B1440D",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "26805522640161260351520",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "505757985633982405104322",
        id: "0x9214eC02CB71CbA0ADA6896b8dA260736a67ab10"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "26805522640161260351520",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xE9ADced9da076D9dADA35F5b99970fDd58B1440D",
          liqDepth: 25382.73616085929,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "REAL",
        decimals: 18,
        contract: "0x9214eC02CB71CbA0ADA6896b8dA260736a67ab10",
        reserveBalance: "505757985633982405104322",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/realestatetoken_28.png",
          name: "Real Estate Asset Ledger"
        },
        reserveFeed: {
          reserveAddress: "0x9214eC02CB71CbA0ADA6896b8dA260736a67ab10",
          poolId: "0xE9ADced9da076D9dADA35F5b99970fDd58B1440D",
          costByNetworkUsd: 0.05018751434847102,
          liqDepth: 25382.73616085929,
          priority: 10,
          change24H: -4.591441345842705,
          volume24H: 0
        }
      }
    ],
    version: "32"
  },
  {
    anchor: {
      symbol: "SPDBNT",
      decimals: 18,
      contract: "0xb2F40825d32b658d39e4F73bB34D33BA628e8B76",
      network: "ETH"
    },
    contract: "0x5039D9B575bD5722d310AF6D2fC11e053c6D03DA",
    converterType: 1,
    fee: 0.001,
    id: "0xb2F40825d32b658d39e4F73bB34D33BA628e8B76",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "4879161816950423743142",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "63735552743722393661942296",
        id: "0x1dEa979ae76f26071870F824088dA78979eb91C8"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "4879161816950423743142",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xb2F40825d32b658d39e4F73bB34D33BA628e8B76",
          liqDepth: 4620.185129322529,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "SPD",
        decimals: 18,
        contract: "0x1dEa979ae76f26071870F824088dA78979eb91C8",
        reserveBalance: "63735552743722393661942296",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/spindle_28.png",
          name: "SPINDLE"
        },
        reserveFeed: {
          reserveAddress: "0x1dEa979ae76f26071870F824088dA78979eb91C8",
          poolId: "0xb2F40825d32b658d39e4F73bB34D33BA628e8B76",
          costByNetworkUsd: 0.0000724899201533573,
          liqDepth: 4620.185129322529,
          priority: 10,
          change24H: 4.430787730502582,
          volume24H: 0
        }
      }
    ],
    version: "1"
  },
  {
    anchor: {
      symbol: "FTTBNT",
      decimals: 18,
      contract: "0x140d47AeA2f10FfF26de4150971e600A2e010A81",
      network: "ETH"
    },
    contract: "0x06ddD7AE02762382184F511C14609c3AE03BAf2a",
    converterType: 1,
    fee: 0.002,
    id: "0x140d47AeA2f10FfF26de4150971e600A2e010A81",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "388077637794663387373",
        id: "0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9"
      },
      {
        amount: "1739000809423675643589",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1739000809423675643589",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x140d47AeA2f10FfF26de4150971e600A2e010A81",
          liqDepth: 1646.6979331709965,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "FTX Token",
        decimals: 18,
        contract: "0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9",
        reserveBalance: "388077637794663387373",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9/logo.png",
          name: "FTX Token"
        },
        reserveFeed: {
          reserveAddress: "0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9",
          poolId: "0x140d47AeA2f10FfF26de4150971e600A2e010A81",
          costByNetworkUsd: 4.243217781186054,
          liqDepth: 1646.6979331709965,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "ANTBNT",
      decimals: 18,
      contract: "0x0c485BffD5df019F66927B2C32360159884D4409",
      network: "ETH"
    },
    contract: "0x79a373401BA7C9557475dA0Ec73368AD0B86fae4",
    converterType: 1,
    fee: 0.005,
    id: "0x0c485BffD5df019F66927B2C32360159884D4409",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "148345972999603977267166",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "42514580473961833639076",
        id: "0x960b236A07cf122663c4303350609A66A7B288C0"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "148345972999603977267166",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x0c485BffD5df019F66927B2C32360159884D4409",
          liqDepth: 140472.04912667396,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "ANT",
        decimals: 18,
        contract: "0x960b236A07cf122663c4303350609A66A7B288C0",
        reserveBalance: "42514580473961833639076",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/aragon_28.png",
          name: "Aragon"
        },
        reserveFeed: {
          reserveAddress: "0x960b236A07cf122663c4303350609A66A7B288C0",
          poolId: "0x0c485BffD5df019F66927B2C32360159884D4409",
          costByNetworkUsd: 3.304091150863089,
          liqDepth: 140472.04912667396,
          priority: 10,
          change24H: -5.971048087008647,
          volume24H: 0
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "COTBNT",
      decimals: 18,
      contract: "0x19dB077A54dEa3fD4CBCd9d31D4dB297562CbD94",
      network: "ETH"
    },
    contract: "0x24090349a627B3529F883A09A049F9bC3aD19479",
    converterType: 1,
    fee: 0.03,
    id: "0x19dB077A54dEa3fD4CBCd9d31D4dB297562CbD94",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x5c872500c00565505F3624AB435c222E558E9ff8" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x19dB077A54dEa3fD4CBCd9d31D4dB297562CbD94",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "COT",
        decimals: 18,
        contract: "0x5c872500c00565505F3624AB435c222E558E9ff8",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/cotrader_28.png",
          name: "CoTrader"
        },
        reserveFeed: {
          reserveAddress: "0x5c872500c00565505F3624AB435c222E558E9ff8",
          poolId: "0x19dB077A54dEa3fD4CBCd9d31D4dB297562CbD94",
          costByNetworkUsd: 0.0001429471855675,
          liqDepth: 0,
          priority: 10,
          change24H: 2.330581858933978,
          volume24H: 98.414077
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "EFOODBNT",
      decimals: 18,
      contract: "0xf34484286be88613ad8399fe40f93506125be139",
      network: "ETH"
    },
    contract: "0x2A432989CFbAE00e807Bd8Cb414B657F1B74E5c7",
    converterType: 1,
    fee: 0,
    id: "0xf34484286be88613ad8399fe40f93506125be139",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "2616290963342635387574",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "12487017183004926363136276",
        id: "0x47Ec6AF8E27C98e41d1Df7fb8219408541463022"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "2616290963342635387574",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xf34484286be88613ad8399fe40f93506125be139",
          liqDepth: 2477.423183798329,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "EFOOD",
        decimals: 18,
        contract: "0x47Ec6AF8E27C98e41d1Df7fb8219408541463022",
        reserveBalance: "12487017183004926363136276",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/9f4446c0-6c31-11e9-9f0e-7591708e99af.jpeg",
          name: "Eurasia Food coin"
        },
        reserveFeed: {
          reserveAddress: "0x47Ec6AF8E27C98e41d1Df7fb8219408541463022",
          poolId: "0xf34484286be88613ad8399fe40f93506125be139",
          costByNetworkUsd: 0.00019839991788993055,
          liqDepth: 2477.423183798329,
          priority: 10,
          change24H: 13.721712263600056,
          volume24H: 0
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "EMCOBNT",
      decimals: 18,
      contract: "0x2E8d4EF4Cce1a5235311307b45EBEcF31eE7CA88",
      network: "ETH"
    },
    contract: "0x92a497f0bcDEaa5345f6aA4a3357EE3cbe2E7226",
    converterType: 1,
    fee: 0.001,
    id: "0x2E8d4EF4Cce1a5235311307b45EBEcF31eE7CA88",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "8454801347812298883898",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1945574324094706490864774",
        id: "0x9A07fD8a116b7E3Be9e6185861496AF7a2041460"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "8454801347812298883898",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x2E8d4EF4Cce1a5235311307b45EBEcF31eE7CA88",
          liqDepth: 8006.036471844969,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "EMCO",
        decimals: 18,
        contract: "0x9A07fD8a116b7E3Be9e6185861496AF7a2041460",
        reserveBalance: "1945574324094706490864774",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/emco.png",
          name: "Emirate Coin"
        },
        reserveFeed: {
          reserveAddress: "0x9A07fD8a116b7E3Be9e6185861496AF7a2041460",
          poolId: "0x2E8d4EF4Cce1a5235311307b45EBEcF31eE7CA88",
          costByNetworkUsd: 0.004114999037916607,
          liqDepth: 8006.036471844969,
          priority: 10,
          change24H: -0.25247046911443227,
          volume24H: 0
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "MRPHBNT",
      decimals: 18,
      contract: "0x4B51AcC819591c885DbA0F06d98A07b432E6D6B4",
      network: "ETH"
    },
    contract: "0x6C96693580Caa51515FC7FE9AE7A088ccB8451a5",
    converterType: 1,
    fee: 0.001,
    id: "0x4B51AcC819591c885DbA0F06d98A07b432E6D6B4",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "43535703277925385055316",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "1067022266", id: "0x7B0C06043468469967DBA22d1AF33d77d44056c8" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "43535703277925385055316",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x4B51AcC819591c885DbA0F06d98A07b432E6D6B4",
          liqDepth: 41224.910430412296,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "MRPH",
        decimals: 4,
        contract: "0x7B0C06043468469967DBA22d1AF33d77d44056c8",
        reserveBalance: "1067022266",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/morpheus_28.png",
          name: "Morpheus.Network"
        },
        reserveFeed: {
          reserveAddress: "0x7B0C06043468469967DBA22d1AF33d77d44056c8",
          poolId: "0x4B51AcC819591c885DbA0F06d98A07b432E6D6B4",
          costByNetworkUsd: 0.3863547345169674,
          liqDepth: 41224.910430412296,
          priority: 10,
          change24H: -1.27004462767758,
          volume24H: 36318.484955
        }
      }
    ],
    version: "40"
  },
  {
    anchor: {
      symbol: "RDNBNT",
      decimals: 18,
      contract: "0x11223Ed5D5846603C4EfC7c451FD8EB596d592cF",
      network: "ETH"
    },
    contract: "0xB7246144F53Ec44E0f845Fd0DEea85208acFC2C9",
    converterType: 1,
    fee: 0.005,
    id: "0x11223Ed5D5846603C4EfC7c451FD8EB596d592cF",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "8274709875747261995",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "65264121188852801050",
        id: "0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "8274709875747261995",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x11223Ed5D5846603C4EfC7c451FD8EB596d592cF",
          liqDepth: 7.835503914744264,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "RDN",
        decimals: 18,
        contract: "0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6",
        reserveBalance: "65264121188852801050",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/raiden28.png",
          name: "Raiden"
        },
        reserveFeed: {
          reserveAddress: "0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6",
          poolId: "0x11223Ed5D5846603C4EfC7c451FD8EB596d592cF",
          costByNetworkUsd: 0.12005836854940412,
          liqDepth: 7.835503914744264,
          priority: 10
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "REFBNT",
      decimals: 18,
      contract: "0xB67FA7330154878cF1Fd8F4b20bf1C19F68a3926",
      network: "ETH"
    },
    contract: "0x4E2C46b4E86A17aD942B2Cd6F84302AeE4196A60",
    converterType: 1,
    fee: 0.001,
    id: "0xB67FA7330154878cF1Fd8F4b20bf1C19F68a3926",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "3442364053826094298848",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "2357987509525",
        id: "0x89303500a7Abfb178B274FD89F2469C264951e1f"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "3442364053826094298848",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xB67FA7330154878cF1Fd8F4b20bf1C19F68a3926",
          liqDepth: 3259.6498759170668,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "REF",
        decimals: 8,
        contract: "0x89303500a7Abfb178B274FD89F2469C264951e1f",
        reserveBalance: "2357987509525",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/reftoken_28.png",
          name: "RefToken"
        },
        reserveFeed: {
          reserveAddress: "0x89303500a7Abfb178B274FD89F2469C264951e1f",
          poolId: "0xB67FA7330154878cF1Fd8F4b20bf1C19F68a3926",
          costByNetworkUsd: 0.138238640482608,
          liqDepth: 3259.6498759170668,
          priority: 10,
          change24H: 9.034523798907895,
          volume24H: 0
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "REMBNT",
      decimals: 18,
      contract: "0xaB5ae72d95d3A02796c87F8079b1E180507dF54f",
      network: "ETH"
    },
    contract: "0x90aDD3Bbfc664C0A07572F4F3Ef94f64200832e1",
    converterType: 1,
    fee: 0.001,
    id: "0xaB5ae72d95d3A02796c87F8079b1E180507dF54f",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "47537320360051552129475",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "223568770113",
        id: "0x83984d6142934bb535793A82ADB0a46EF0F66B6d"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "47537320360051552129475",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xaB5ae72d95d3A02796c87F8079b1E180507dF54f",
          liqDepth: 45014.1292408755,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "REM",
        decimals: 4,
        contract: "0x83984d6142934bb535793A82ADB0a46EF0F66B6d",
        reserveBalance: "223568770113",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/remme_28.png",
          name: "REMME"
        },
        reserveFeed: {
          reserveAddress: "0x83984d6142934bb535793A82ADB0a46EF0F66B6d",
          poolId: "0xaB5ae72d95d3A02796c87F8079b1E180507dF54f",
          costByNetworkUsd: 0.00201343547303694,
          liqDepth: 45014.1292408755,
          priority: 10,
          change24H: -11.98859337794565,
          volume24H: 1775.070862
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "SANBNT",
      decimals: 18,
      contract: "0xd6A6c879Ad8c01D0C8d5bF1C85829814b954DBBF",
      network: "ETH"
    },
    contract: "0xBAC94DC2411F494c438cA667A4836e3DCCAA4920",
    converterType: 1,
    fee: 0.001,
    id: "0xd6A6c879Ad8c01D0C8d5bF1C85829814b954DBBF",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "25517290157640343409862",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "203130473988284089931919",
        id: "0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "25517290157640343409862",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xd6A6c879Ad8c01D0C8d5bF1C85829814b954DBBF",
          liqDepth: 24162.880623751193,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "SAN",
        decimals: 18,
        contract: "0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098",
        reserveBalance: "203130473988284089931919",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/san.png",
          name: "SAN"
        },
        reserveFeed: {
          reserveAddress: "0x7C5A0CE9267ED19B22F8cae653F198e3E8daf098",
          poolId: "0xd6A6c879Ad8c01D0C8d5bF1C85829814b954DBBF",
          costByNetworkUsd: 0.11895251435855375,
          liqDepth: 24162.880623751193,
          priority: 10,
          change24H: -6.433588621330653,
          volume24H: 248.453515
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "SXLBNT",
      decimals: 18,
      contract: "0x3364ccAedE016F4C433B326d96bE1A2eafA60bdD",
      network: "ETH"
    },
    contract: "0x5C03354cbaB446CA3Cb426513f11f684724636f7",
    converterType: 1,
    fee: 0.001,
    id: "0x3364ccAedE016F4C433B326d96bE1A2eafA60bdD",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "3937322987091458597433",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "4055174831", id: "0x222eFe83d8cC48e422419d65Cf82D410A276499B" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "3937322987091458597433",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x3364ccAedE016F4C433B326d96bE1A2eafA60bdD",
          liqDepth: 3728.337324477089,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "SXL",
        decimals: 4,
        contract: "0x222eFe83d8cC48e422419d65Cf82D410A276499B",
        reserveBalance: "4055174831",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/9bb2bbe0-1a3d-11e9-99c6-21750f32c67e.jpeg",
          name: "Success Life"
        },
        reserveFeed: {
          reserveAddress: "0x222eFe83d8cC48e422419d65Cf82D410A276499B",
          poolId: "0x3364ccAedE016F4C433B326d96bE1A2eafA60bdD",
          costByNetworkUsd: 0.009194023636109635,
          liqDepth: 3728.337324477089,
          priority: 10,
          change24H: 7.069227129641896,
          volume24H: 0
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "WBTC",
      decimals: 18,
      contract: "0xFEE7EeaA0c2f3F7C7e6301751a8dE55cE4D059Ec",
      network: "ETH"
    },
    contract: "0xD4c2BD3c4203A16266eced70a3F8cb4999a73E8f",
    converterType: 1,
    fee: 0.004,
    id: "0xFEE7EeaA0c2f3F7C7e6301751a8dE55cE4D059Ec",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "4568530804785105064023339",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "23903613587",
        id: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "4568530804785105064023339",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xFEE7EeaA0c2f3F7C7e6301751a8dE55cE4D059Ec",
          liqDepth: 4326041.824190333,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "WBTC",
        decimals: 8,
        contract: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        reserveBalance: "23903613587",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/wbtc_28.png?v=1",
          name: "Wrapped BTC"
        },
        reserveFeed: {
          reserveAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
          poolId: "0xFEE7EeaA0c2f3F7C7e6301751a8dE55cE4D059Ec",
          costByNetworkUsd: 18097.857081086073,
          liqDepth: 4326041.824190333,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "RSTBNT",
      decimals: 18,
      contract: "0x43d3a0712eD544b26d85c9eaf841008369bAB5d1",
      network: "ETH"
    },
    contract: "0xb61b3FE730Fb58936f06239feA2FEEd5B3256F50",
    converterType: 1,
    fee: 0,
    id: "0x43d3a0712eD544b26d85c9eaf841008369bAB5d1",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "8756683945011890457444",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "11053868781594229450263",
        id: "0x86D17e2eF332293391303F188F6a467dc0D1fd0d"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "8756683945011890457444",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x43d3a0712eD544b26d85c9eaf841008369bAB5d1",
          liqDepth: 8291.895711343315,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "RST100",
        decimals: 18,
        contract: "0x86D17e2eF332293391303F188F6a467dc0D1fd0d",
        reserveBalance: "11053868781594229450263",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x86D17e2eF332293391303F188F6a467dc0D1fd0d",
          poolId: "0x43d3a0712eD544b26d85c9eaf841008369bAB5d1",
          costByNetworkUsd: 0.7501351676211437,
          liqDepth: 8291.895711343315,
          priority: 10
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "FXCBNT",
      decimals: 18,
      contract: "0xb93Cc8642f5e8644423Aa7305da96FFF75708228",
      network: "ETH"
    },
    contract: "0x6b2c2db78Fc5F1f0A7a7a6d91d26922850A9C693",
    converterType: 1,
    fee: 0,
    id: "0xb93Cc8642f5e8644423Aa7305da96FFF75708228",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "3874658294753827543",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "805291133018895735012",
        id: "0x4a57E687b9126435a9B19E4A802113e266AdeBde"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "3874658294753827543",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xb93Cc8642f5e8644423Aa7305da96FFF75708228",
          liqDepth: 3.6689987555724715,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "FXC",
        decimals: 18,
        contract: "0x4a57E687b9126435a9B19E4A802113e266AdeBde",
        reserveBalance: "805291133018895735012",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4a57E687b9126435a9B19E4A802113e266AdeBde/logo.png",
          name: "Flexacoin"
        },
        reserveFeed: {
          reserveAddress: "0x4a57E687b9126435a9B19E4A802113e266AdeBde",
          poolId: "0xb93Cc8642f5e8644423Aa7305da96FFF75708228",
          costByNetworkUsd: 0.004556114683416464,
          liqDepth: 3.6689987555724715,
          priority: 10
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "PRTLBNT",
      decimals: 18,
      contract: "0x2788C2dB0fBdbaee39Fa010D325d55e7e4527e0d",
      network: "ETH"
    },
    contract: "0x8bd7448162C296A5bB3F0B9cCDEe383f5b899C93",
    converterType: 1,
    fee: 0,
    id: "0x2788C2dB0fBdbaee39Fa010D325d55e7e4527e0d",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "326770982272205316156",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "414802173188274729115635",
        id: "0xF01d7939441a3b1B108C70A28DcD99c6A98aD4b4"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "326770982272205316156",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x2788C2dB0fBdbaee39Fa010D325d55e7e4527e0d",
          liqDepth: 309.4265961303532,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "PRTL",
        decimals: 18,
        contract: "0xF01d7939441a3b1B108C70A28DcD99c6A98aD4b4",
        reserveBalance: "414802173188274729115635",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/b8719300-81b7-11e9-b2e5-4b892ecdf4c1.jpeg",
          name: "Partial Coin"
        },
        reserveFeed: {
          reserveAddress: "0xF01d7939441a3b1B108C70A28DcD99c6A98aD4b4",
          poolId: "0x2788C2dB0fBdbaee39Fa010D325d55e7e4527e0d",
          costByNetworkUsd: 0.000745961849119598,
          liqDepth: 309.4265961303532,
          priority: 10,
          change24H: 157.57726549193143,
          volume24H: 0
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "QDAOBNT",
      decimals: 18,
      contract: "0x19683E94943E6b348D8AFB98C128B9b549B400DF",
      network: "ETH"
    },
    contract: "0xbDC7310289dCd30D16E284d6F207a8E2F76A37aD",
    converterType: 1,
    fee: 0,
    id: "0x19683E94943E6b348D8AFB98C128B9b549B400DF",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "3096006997510454427522",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "857535753638089005273",
        id: "0x3166C570935a7D8554c8f4eA792ff965D2EFe1f2"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "3096006997510454427522",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x19683E94943E6b348D8AFB98C128B9b549B400DF",
          liqDepth: 2931.676797535825,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "QDAO",
        decimals: 18,
        contract: "0x3166C570935a7D8554c8f4eA792ff965D2EFe1f2",
        reserveBalance: "857535753638089005273",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/usdqtoken_28.png",
          name: "Q DAO Governance token v1.0"
        },
        reserveFeed: {
          reserveAddress: "0x3166C570935a7D8554c8f4eA792ff965D2EFe1f2",
          poolId: "0x19683E94943E6b348D8AFB98C128B9b549B400DF",
          costByNetworkUsd: 3.418722525676869,
          liqDepth: 2931.676797535825,
          priority: 10,
          change24H: 10.56203655860153,
          volume24H: 0
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "ELETBNT",
      decimals: 18,
      contract: "0x334C36Be5b1EaF0C4b61dDEa202c9f6Dc2640FE5",
      network: "ETH"
    },
    contract: "0x1e45Ff6C529DD038E75767779D12b7981311B8Df",
    converterType: 1,
    fee: 0.02,
    id: "0x334C36Be5b1EaF0C4b61dDEa202c9f6Dc2640FE5",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "3918547402931168307093",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "453605105986071904558799",
        id: "0x6c37Bf4f042712C978A73e3fd56D1F5738dD7C43"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "3918547402931168307093",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x334C36Be5b1EaF0C4b61dDEa202c9f6Dc2640FE5",
          liqDepth: 3710.558312838173,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "ELET",
        decimals: 18,
        contract: "0x6c37Bf4f042712C978A73e3fd56D1F5738dD7C43",
        reserveBalance: "453605105986071904558799",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/elet_28.png",
          name: "Elementeum"
        },
        reserveFeed: {
          reserveAddress: "0x6c37Bf4f042712C978A73e3fd56D1F5738dD7C43",
          poolId: "0x334C36Be5b1EaF0C4b61dDEa202c9f6Dc2640FE5",
          costByNetworkUsd: 0.008180151113537305,
          liqDepth: 3710.558312838173,
          priority: 10,
          change24H: -21.702255086695743,
          volume24H: 843.881863
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "USDB / BNT",
      decimals: 18,
      contract: "0xd1146B08e8104EeDBa44a73B7bda1d102c6ceDC9",
      network: "ETH"
    },
    contract: "0xE03374cAcf4600F56BDDbDC82c07b375f318fc5C",
    converterType: 1,
    fee: 0.0015,
    id: "0xd1146B08e8104EeDBa44a73B7bda1d102c6ceDC9",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "6918457196213949167505",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "7051308968517525508473",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "6918457196213949167505",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xd1146B08e8104EeDBa44a73B7bda1d102c6ceDC9",
          liqDepth: 6918.457196213949,
          costByNetworkUsd: 0.9999999999999999,
          priority: 10,
          change24H: 1.134250623653587,
          volume24H: 0
        }
      },
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "7051308968517525508473",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xd1146B08e8104EeDBa44a73B7bda1d102c6ceDC9",
          costByNetworkUsd: 0.9811592751222887,
          liqDepth: 6918.457196213949,
          priority: 10
        }
      }
    ],
    version: "14"
  },
  {
    anchor: {
      symbol: "USDQBNT",
      decimals: 18,
      contract: "0x9921f8F53EE185a6BFD5d9D8935107934D0B07DA",
      network: "ETH"
    },
    contract: "0x70e6f05ae2F61562FAb7115DdD387b83B28564de",
    converterType: 1,
    fee: 0,
    id: "0x9921f8F53EE185a6BFD5d9D8935107934D0B07DA",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "11557078762877356289879",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "12032496735333607054182",
        id: "0x4954Db6391F4feB5468b6B943D4935353596aEC9"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "11557078762877356289879",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x9921f8F53EE185a6BFD5d9D8935107934D0B07DA",
          liqDepth: 10943.650865022688,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "USDQ",
        decimals: 18,
        contract: "0x4954Db6391F4feB5468b6B943D4935353596aEC9",
        reserveBalance: "12032496735333607054182",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/usdqtoken_28.png",
          name: "USDQ Stablecoin by Q DAO v1.0"
        },
        reserveFeed: {
          reserveAddress: "0x4954Db6391F4feB5468b6B943D4935353596aEC9",
          poolId: "0x9921f8F53EE185a6BFD5d9D8935107934D0B07DA",
          costByNetworkUsd: 0.9095079022865216,
          liqDepth: 10943.650865022688,
          priority: 10,
          change24H: -2.1385313974132765,
          volume24H: 0
        }
      }
    ],
    version: "0"
  },
  {
    anchor: {
      symbol: "PKGBNT",
      decimals: 18,
      contract: "0xE729024679C29c2660E05727ECAfd3D8792b8111",
      network: "ETH"
    },
    contract: "0x0dA9706F366C915D3769F7Ae9737Ef77c7741715",
    converterType: 1,
    fee: 0.001,
    id: "0xE729024679C29c2660E05727ECAfd3D8792b8111",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "42480000000000000000",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1428571428571428600000000",
        id: "0x02F2D4a04E6E01aCE88bD2Cd632875543b2eF577"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "42480000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xE729024679C29c2660E05727ECAfd3D8792b8111",
          liqDepth: 40.2252418872,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "PKG",
        decimals: 18,
        contract: "0x02F2D4a04E6E01aCE88bD2Cd632875543b2eF577",
        reserveBalance: "1428571428571428600000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/pkg_28.png",
          name: "PKG Token"
        },
        reserveFeed: {
          reserveAddress: "0x02F2D4a04E6E01aCE88bD2Cd632875543b2eF577",
          poolId: "0xE729024679C29c2660E05727ECAfd3D8792b8111",
          costByNetworkUsd: 0.00002815766932104,
          liqDepth: 40.2252418872,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "MGTBNT",
      decimals: 18,
      contract: "0x6F60D44A0d6fB95E037A099F8642f949c959a363",
      network: "ETH"
    },
    contract: "0x6aD9C98E25D8E8292514ef108043278eeC34a27b",
    converterType: 1,
    fee: 0.001,
    id: "0x6F60D44A0d6fB95E037A099F8642f949c959a363",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "112194513447639012",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "100250000000",
        id: "0x0cB20b77AdBe5cD58fCeCc4F4069D04b327862e5"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "112194513447639012",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x6F60D44A0d6fB95E037A099F8642f949c959a363",
          liqDepth: 0.10623944072146875,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "MGT",
        decimals: 8,
        contract: "0x0cB20b77AdBe5cD58fCeCc4F4069D04b327862e5",
        reserveBalance: "100250000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/mysteryghosttoken_32.png",
          name: "Mystery Ghost Token"
        },
        reserveFeed: {
          reserveAddress: "0x0cB20b77AdBe5cD58fCeCc4F4069D04b327862e5",
          poolId: "0x6F60D44A0d6fB95E037A099F8642f949c959a363",
          costByNetworkUsd: 0.00010597450446031796,
          liqDepth: 0.10623944072146875,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "USDCUSDB",
      decimals: 18,
      contract: "0x71c414DaCe65ABff9351E215d25f17F675241c0A",
      network: "ETH"
    },
    contract: "0x868229B43a8BCBDFfb244DDE874f52Ade0B1c132",
    converterType: 1,
    fee: 0.001,
    id: "0x71c414DaCe65ABff9351E215d25f17F675241c0A",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "536634319051341144",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      { amount: "490892", id: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "536634319051341144",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x71c414DaCe65ABff9351E215d25f17F675241c0A",
          liqDepth: 0.5366343190513411,
          costByNetworkUsd: 0.9999999999999999,
          priority: 10
        }
      },
      {
        symbol: "USDC",
        decimals: 6,
        contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        reserveBalance: "490892",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/usdc.png",
          name: "USD Coin"
        },
        reserveFeed: {
          reserveAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          poolId: "0x71c414DaCe65ABff9351E215d25f17F675241c0A",
          costByNetworkUsd: 1.0931820421830893,
          liqDepth: 0.5366343190513411,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "BNTSWRV",
      decimals: 18,
      contract: "0x07009A1F62dd238c7167e4D9BC3C5b28B6Fe5a96",
      network: "ETH"
    },
    contract: "0x7d9B4031290FDD0D48468CefD54a1E34090dC36C",
    converterType: 1,
    fee: 0,
    id: "0x07009A1F62dd238c7167e4D9BC3C5b28B6Fe5a96",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0xB8BAa0e4287890a5F79863aB62b7F175ceCbD433" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x07009A1F62dd238c7167e4D9BC3C5b28B6Fe5a96",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "SWRV",
        decimals: 18,
        contract: "0xB8BAa0e4287890a5F79863aB62b7F175ceCbD433",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xB8BAa0e4287890a5F79863aB62b7F175ceCbD433",
          poolId: "0x07009A1F62dd238c7167e4D9BC3C5b28B6Fe5a96",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "ZRXUSDB",
      decimals: 18,
      contract: "0x1a3c6768e200482F5f47D1BE77B7255aBCAe4Fe2",
      network: "ETH"
    },
    contract: "0xF4736618F2782b662304b7340084a6Bc6DDb5C2c",
    converterType: 1,
    fee: 0.0149,
    id: "0x1a3c6768e200482F5f47D1BE77B7255aBCAe4Fe2",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "370505039462152467902",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "789128206507031740815",
        id: "0xE41d2489571d322189246DaFA5ebDe1F4699F498"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "370505039462152467902",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x1a3c6768e200482F5f47D1BE77B7255aBCAe4Fe2",
          liqDepth: 370.50503946215247,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "ZRX",
        decimals: 18,
        contract: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
        reserveBalance: "789128206507031740815",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/bzrx.png",
          name: "ZRX"
        },
        reserveFeed: {
          reserveAddress: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
          poolId: "0x1a3c6768e200482F5f47D1BE77B7255aBCAe4Fe2",
          costByNetworkUsd: 0.4695118440920297,
          liqDepth: 370.50503946215247,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "sUSDUSDB",
      decimals: 18,
      contract: "0x9B6678c766003aD69A15f795f433C0F62c10D4d5",
      network: "ETH"
    },
    contract: "0xc89bC9cBB8237C58587b5F907ed6B3163BFDD1B9",
    converterType: 1,
    fee: 0.001,
    id: "0x9B6678c766003aD69A15f795f433C0F62c10D4d5",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1218156807463942891",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "1120616821888954551",
        id: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "1218156807463942891",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x9B6678c766003aD69A15f795f433C0F62c10D4d5",
          liqDepth: 1.2181568074639428,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "sUSD",
        decimals: 18,
        contract: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
        reserveBalance: "1120616821888954551",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/susd.png",
          name: "sUSD"
        },
        reserveFeed: {
          reserveAddress: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
          poolId: "0x9B6678c766003aD69A15f795f433C0F62c10D4d5",
          costByNetworkUsd: 1.0870413362263929,
          liqDepth: 1.2181568074639428,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "REPUSDB",
      decimals: 18,
      contract: "0xAb0C9850BaACF24eFA368b57C2822Ce73b60794c",
      network: "ETH"
    },
    contract: "0xe037d37898E6f6fFE8AcE3Eb93cD0F78FF107A8e",
    converterType: 1,
    fee: 0.001,
    id: "0xAb0C9850BaACF24eFA368b57C2822Ce73b60794c",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "549411216587183130",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "52085423901614843",
        id: "0x1985365e9f78359a9B6AD760e32412f4a445E862"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "549411216587183130",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xAb0C9850BaACF24eFA368b57C2822Ce73b60794c",
          liqDepth: 0.5494112165871832,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "REP",
        decimals: 18,
        contract: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
        reserveBalance: "52085423901614843",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/augur.png",
          name: "Reputation"
        },
        reserveFeed: {
          reserveAddress: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
          poolId: "0xAb0C9850BaACF24eFA368b57C2822Ce73b60794c",
          costByNetworkUsd: 10.548271962324364,
          liqDepth: 0.5494112165871832,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "TUSDUSDB",
      decimals: 18,
      contract: "0x06cd5923593a359111cDec66E74c62E831C8aEab",
      network: "ETH"
    },
    contract: "0x3a8CC07F17Eb10E628c74B1a442c7ADC2BfD854D",
    converterType: 1,
    fee: 0.0015,
    id: "0x06cd5923593a359111cDec66E74c62E831C8aEab",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "491146817781095304",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "512022387857512525",
        id: "0x0000000000085d4780B73119b644AE5ecd22b376"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "491146817781095304",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x06cd5923593a359111cDec66E74c62E831C8aEab",
          liqDepth: 0.4911468177810953,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "TUSD",
        decimals: 18,
        contract: "0x0000000000085d4780B73119b644AE5ecd22b376",
        reserveBalance: "512022387857512525",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/trueusd_32.png",
          name: "TrueUSD"
        },
        reserveFeed: {
          reserveAddress: "0x0000000000085d4780B73119b644AE5ecd22b376",
          poolId: "0x06cd5923593a359111cDec66E74c62E831C8aEab",
          costByNetworkUsd: 0.9592291849507437,
          liqDepth: 0.4911468177810953,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "C20BNT",
      decimals: 18,
      contract: "0x1EF9e0ac29b3813528FbfdAdf5118AB63e4be015",
      network: "ETH"
    },
    contract: "0xE04c8aecb58BC3C918aeDAc958224a632529926e",
    converterType: 1,
    fee: 0.005,
    id: "0x1EF9e0ac29b3813528FbfdAdf5118AB63e4be015",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "299537971533005966630",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "322621315539868600721",
        id: "0x26E75307Fc0C021472fEb8F727839531F112f317"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "299537971533005966630",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x1EF9e0ac29b3813528FbfdAdf5118AB63e4be015",
          liqDepth: 283.6390621308002,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "C20",
        decimals: 18,
        contract: "0x26E75307Fc0C021472fEb8F727839531F112f317",
        reserveBalance: "322621315539868600721",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/crypto20_28.png",
          name: "Crypto20"
        },
        reserveFeed: {
          reserveAddress: "0x26E75307Fc0C021472fEb8F727839531F112f317",
          poolId: "0x1EF9e0ac29b3813528FbfdAdf5118AB63e4be015",
          costByNetworkUsd: 0.879170248426282,
          liqDepth: 283.6390621308002,
          priority: 10
        }
      }
    ],
    version: "13"
  },
  {
    anchor: {
      symbol: "DAIUSDB",
      decimals: 18,
      contract: "0xcb913ED43e43cc7Cec1D77243bA381615101E7E4",
      network: "ETH"
    },
    contract: "0x06f7Bf937Dec0C413a2E0464Bb300C4d464bb891",
    converterType: 1,
    fee: 0.0015,
    id: "0xcb913ED43e43cc7Cec1D77243bA381615101E7E4",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "116868722143967896268",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "114344351009327736387",
        id: "0x6B175474E89094C44Da98b954EedeAC495271d0F"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "116868722143967896268",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xcb913ED43e43cc7Cec1D77243bA381615101E7E4",
          liqDepth: 116.86872214396789,
          costByNetworkUsd: 0.9999999999999999,
          priority: 10
        }
      },
      {
        symbol: "DAI",
        decimals: 18,
        contract: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        reserveBalance: "114344351009327736387",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/MCDDai_32.png",
          name: "Dai Stablecoin"
        },
        reserveFeed: {
          reserveAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          poolId: "0xcb913ED43e43cc7Cec1D77243bA381615101E7E4",
          costByNetworkUsd: 1.0220769203931572,
          liqDepth: 116.86872214396789,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "ENJUSDB",
      decimals: 18,
      contract: "0x42529f410f0a72599Fff2c67DD2a63CFfBcc3f91",
      network: "ETH"
    },
    contract: "0xF02182DA935b810CDD3B5c92F324C16FC0413c3B",
    converterType: 1,
    fee: 0.004,
    id: "0x42529f410f0a72599Fff2c67DD2a63CFfBcc3f91",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "76379482532722639808",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "590436779897445424657",
        id: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "76379482532722639808",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x42529f410f0a72599Fff2c67DD2a63CFfBcc3f91",
          liqDepth: 76.37948253272263,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "ENJ",
        decimals: 18,
        contract: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
        reserveBalance: "590436779897445424657",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/enjin_28_2.png",
          name: "EnjinCoin"
        },
        reserveFeed: {
          reserveAddress: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
          poolId: "0x42529f410f0a72599Fff2c67DD2a63CFfBcc3f91",
          costByNetworkUsd: 0.1293609834841068,
          liqDepth: 76.37948253272263,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "EVEDBNT",
      decimals: 18,
      contract: "0x5E761d4529ae69996cb42E09707f9D1D29F047d6",
      network: "ETH"
    },
    contract: "0x8F4789889CAe9227114fF4891Dc77a75379773C0",
    converterType: 1,
    fee: 0.001,
    id: "0x5E761d4529ae69996cb42E09707f9D1D29F047d6",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "15657610557491373282",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "592465460048746703911",
        id: "0x5aaEFe84E0fB3DD1f0fCfF6fA7468124986B91bd"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "15657610557491373282",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x5E761d4529ae69996cb42E09707f9D1D29F047d6",
          liqDepth: 14.826534181983684,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "EVED",
        decimals: 18,
        contract: "0x5aaEFe84E0fB3DD1f0fCfF6fA7468124986B91bd",
        reserveBalance: "592465460048746703911",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5aaEFe84E0fB3DD1f0fCfF6fA7468124986B91bd/logo.png",
          name: "Evedo Token"
        },
        reserveFeed: {
          reserveAddress: "0x5aaEFe84E0fB3DD1f0fCfF6fA7468124986B91bd",
          poolId: "0x5E761d4529ae69996cb42E09707f9D1D29F047d6",
          costByNetworkUsd: 0.02502514523085243,
          liqDepth: 14.826534181983684,
          priority: 10
        }
      }
    ],
    version: "27"
  },
  {
    anchor: {
      symbol: "RLCUSDB",
      decimals: 18,
      contract: "0x6534d2A69c2C7774DF42A55A1678bD008984B324",
      network: "ETH"
    },
    contract: "0x2B4f0AD32a8aC2075648A054D6082727e21eD053",
    converterType: 1,
    fee: 0.001,
    id: "0x6534d2A69c2C7774DF42A55A1678bD008984B324",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "327384643800404270",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      { amount: "1956210994", id: "0x607F4C5BB672230e8672085532f7e901544a7375" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "327384643800404270",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x6534d2A69c2C7774DF42A55A1678bD008984B324",
          liqDepth: 0.3273846438004042,
          costByNetworkUsd: 0.9999999999999999,
          priority: 10
        }
      },
      {
        symbol: "RLC",
        decimals: 9,
        contract: "0x607F4C5BB672230e8672085532f7e901544a7375",
        reserveBalance: "1956210994",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/iexec_28.png",
          name: "RLC"
        },
        reserveFeed: {
          reserveAddress: "0x607F4C5BB672230e8672085532f7e901544a7375",
          poolId: "0x6534d2A69c2C7774DF42A55A1678bD008984B324",
          costByNetworkUsd: 0.16735650949950864,
          liqDepth: 0.3273846438004042,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "WETHOGN",
      decimals: 18,
      contract: "0xcaB1F46A73Aa6096707f5EF6Edc4C1dfE991f981",
      network: "ETH"
    },
    contract: "0x6C69454b0ED9196Fa71cB514e7C3b49aC149eC4B",
    converterType: 1,
    fee: 0,
    id: "0xcaB1F46A73Aa6096707f5EF6Edc4C1dfE991f981",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
      { amount: "0", id: "0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26" }
    ],
    reserves: [
      {
        symbol: "WETH",
        decimals: 18,
        contract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          poolId: "0xcaB1F46A73Aa6096707f5EF6Edc4C1dfE991f981",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "OGN",
        decimals: 18,
        contract: "0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/origintoken_28.png",
          name: "OriginToken"
        },
        reserveFeed: {
          reserveAddress: "0x8207c1FfC5B6804F6024322CcF34F29c3541Ae26",
          poolId: "0xcaB1F46A73Aa6096707f5EF6Edc4C1dfE991f981",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "KNCUSDB",
      decimals: 18,
      contract: "0xD69AE1D715d7451646107D43777139B0a42d7c63",
      network: "ETH"
    },
    contract: "0x96772082615Fb019E91877653503EB6Ef1E65Aea",
    converterType: 1,
    fee: 0.003,
    id: "0xD69AE1D715d7451646107D43777139B0a42d7c63",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1835408670511398471",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "1120576771968764243",
        id: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "1835408670511398471",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xD69AE1D715d7451646107D43777139B0a42d7c63",
          liqDepth: 1.8354086705113986,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "KNC",
        decimals: 18,
        contract: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
        reserveBalance: "1120576771968764243",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/kyber2_28.png",
          name: "KyberNetwork"
        },
        reserveFeed: {
          reserveAddress: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
          poolId: "0xD69AE1D715d7451646107D43777139B0a42d7c63",
          costByNetworkUsd: 1.6379142566793807,
          liqDepth: 1.8354086705113986,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "NEXOUSDB",
      decimals: 18,
      contract: "0x515d562496C43487eb2DDce1a2A7721148D44E36",
      network: "ETH"
    },
    contract: "0x97Cf22539646d5a264Fb3FBb68bb0642D8AD2a66",
    converterType: 1,
    fee: 0.015,
    id: "0x515d562496C43487eb2DDce1a2A7721148D44E36",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "434211665534525301077",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "1107080286484370884301",
        id: "0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "434211665534525301077",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x515d562496C43487eb2DDce1a2A7721148D44E36",
          liqDepth: 434.2116655345253,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "NEXO",
        decimals: 18,
        contract: "0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206",
        reserveBalance: "1107080286484370884301",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/nexo_32.png",
          name: "Nexo"
        },
        reserveFeed: {
          reserveAddress: "0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206",
          poolId: "0x515d562496C43487eb2DDce1a2A7721148D44E36",
          costByNetworkUsd: 0.3922133478804884,
          liqDepth: 434.2116655345253,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "NMRUSDB",
      decimals: 18,
      contract: "0xEfec901ff0a33d0eF4f8068CDd8b28Fdc40aa556",
      network: "ETH"
    },
    contract: "0xc3b1928A01aC03F8353d05196AfcA778ab9970f7",
    converterType: 1,
    fee: 0.01,
    id: "0xEfec901ff0a33d0eF4f8068CDd8b28Fdc40aa556",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1211785162202383492",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "48202434666737120",
        id: "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "1211785162202383492",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xEfec901ff0a33d0eF4f8068CDd8b28Fdc40aa556",
          liqDepth: 1.2117851622023834,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "NMR",
        decimals: 18,
        contract: "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671",
        reserveBalance: "48202434666737120",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/numeraire_28_2.png",
          name: "Numeraire"
        },
        reserveFeed: {
          reserveAddress: "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671",
          poolId: "0xEfec901ff0a33d0eF4f8068CDd8b28Fdc40aa556",
          costByNetworkUsd: 25.13950115964984,
          liqDepth: 1.2117851622023834,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "JRTBNT",
      decimals: 18,
      contract: "0x069D653038DB2F9d84e9620Be140B3D404a40258",
      network: "ETH"
    },
    contract: "0x604F88101146b397c31dc4051C5F290f48a5862f",
    converterType: 1,
    fee: 0.001,
    id: "0x069D653038DB2F9d84e9620Be140B3D404a40258",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "194207620089655828022384",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "2911917761033117912768124",
        id: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "194207620089655828022384",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x069D653038DB2F9d84e9620Be140B3D404a40258",
          liqDepth: 183899.44666769885,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "JRT",
        decimals: 18,
        contract: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A",
        reserveBalance: "2911917761033117912768124",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/jarvis_28.png",
          name: "Jarvis Reward Token"
        },
        reserveFeed: {
          reserveAddress: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A",
          poolId: "0x069D653038DB2F9d84e9620Be140B3D404a40258",
          costByNetworkUsd: 0.06315406606897211,
          liqDepth: 183899.44666769885,
          priority: 10,
          change24H: 13.3133379029987,
          volume24H: 1344.1490119999999
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "OMGUSDB",
      decimals: 18,
      contract: "0xAeBfeA5ce20af9fA2c65fb62863b31A90b7e056b",
      network: "ETH"
    },
    contract: "0xE638A52dDAd3fa31233152C17422E3312A3f6643",
    converterType: 1,
    fee: 0.003,
    id: "0xAeBfeA5ce20af9fA2c65fb62863b31A90b7e056b",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "21587703288099075525",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "6774019770942276466",
        id: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "21587703288099075525",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xAeBfeA5ce20af9fA2c65fb62863b31A90b7e056b",
          liqDepth: 21.587703288099075,
          costByNetworkUsd: 0.9999999999999999,
          priority: 10
        }
      },
      {
        symbol: "OMG",
        decimals: 18,
        contract: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
        reserveBalance: "6774019770942276466",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/omise.png",
          name: "OmiseGO"
        },
        reserveFeed: {
          reserveAddress: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
          poolId: "0xAeBfeA5ce20af9fA2c65fb62863b31A90b7e056b",
          costByNetworkUsd: 3.186837951182447,
          liqDepth: 21.587703288099075,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "LOOMUSDB",
      decimals: 18,
      contract: "0xc32BF4a12542E897BADbFf2B61e56c82eAe73d69",
      network: "ETH"
    },
    contract: "0x81708ECf0ABB950100cd482d2843E1146fa778A4",
    converterType: 1,
    fee: 0.0015,
    id: "0xc32BF4a12542E897BADbFf2B61e56c82eAe73d69",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "149223727720959045225",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "5944241943689589190255",
        id: "0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "149223727720959045225",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xc32BF4a12542E897BADbFf2B61e56c82eAe73d69",
          liqDepth: 149.22372772095903,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "LOOM",
        decimals: 18,
        contract: "0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0",
        reserveBalance: "5944241943689589190255",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/loom_28.png",
          name: "Loom"
        },
        reserveFeed: {
          reserveAddress: "0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0",
          poolId: "0xc32BF4a12542E897BADbFf2B61e56c82eAe73d69",
          costByNetworkUsd: 0.025103912178301397,
          liqDepth: 149.22372772095903,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "BATUSDB",
      decimals: 18,
      contract: "0x7FfE011B93e06FA14CE5A6E00320937652664366",
      network: "ETH"
    },
    contract: "0xD6DD7d29EcAB65D092942d42c4F360Fde41693Dc",
    converterType: 1,
    fee: 0.003,
    id: "0x7FfE011B93e06FA14CE5A6E00320937652664366",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1747952922809056665",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "6621725453823141434",
        id: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "1747952922809056665",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x7FfE011B93e06FA14CE5A6E00320937652664366",
          liqDepth: 1.7479529228090565,
          costByNetworkUsd: 0.9999999999999999,
          priority: 10
        }
      },
      {
        symbol: "BAT",
        decimals: 18,
        contract: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
        reserveBalance: "6621725453823141434",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/bat.png",
          name: "BAT"
        },
        reserveFeed: {
          reserveAddress: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
          poolId: "0x7FfE011B93e06FA14CE5A6E00320937652664366",
          costByNetworkUsd: 0.2639724245588969,
          liqDepth: 1.7479529228090565,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "MGTBNT",
      decimals: 18,
      contract: "0x0bA204702F102aD3B0156164754e8af18C24C49C",
      network: "ETH"
    },
    contract: "0xabD0dDC9143972E4eA9A816821bfba8204122E6E",
    converterType: 1,
    fee: 0.001,
    id: "0x0bA204702F102aD3B0156164754e8af18C24C49C",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "2513416185865053503",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "3970", id: "0xA207Ef81C35848A60A732005A42fAe0BA89A9bE2" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "2513416185865053503",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x0bA204702F102aD3B0156164754e8af18C24C49C",
          liqDepth: 2.380008805075928,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "MGT",
        decimals: 4,
        contract: "0xA207Ef81C35848A60A732005A42fAe0BA89A9bE2",
        reserveBalance: "3970",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xA207Ef81C35848A60A732005A42fAe0BA89A9bE2",
          poolId: "0x0bA204702F102aD3B0156164754e8af18C24C49C",
          costByNetworkUsd: 5.994984395657249,
          liqDepth: 2.380008805075928,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "METUSDB",
      decimals: 18,
      contract: "0x7F8c53072d9B809A108b1A9D677Bcc3B7B3F844e",
      network: "ETH"
    },
    contract: "0x6bA3e97Dee101Edacc3b58ED59273693aCB4c79e",
    converterType: 1,
    fee: 0.0015,
    id: "0x7F8c53072d9B809A108b1A9D677Bcc3B7B3F844e",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "3508670931803988198823",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "3070619095260443664234",
        id: "0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "3508670931803988198823",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x7F8c53072d9B809A108b1A9D677Bcc3B7B3F844e",
          liqDepth: 3508.670931803988,
          costByNetworkUsd: 0.9999999999999999,
          priority: 10
        }
      },
      {
        symbol: "MET",
        decimals: 18,
        contract: "0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e",
        reserveBalance: "3070619095260443664234",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/metronome_28.png",
          name: "Metronome"
        },
        reserveFeed: {
          reserveAddress: "0xa3d58c4E56fedCae3a7c43A725aeE9A71F0ece4e",
          poolId: "0x7F8c53072d9B809A108b1A9D677Bcc3B7B3F844e",
          costByNetworkUsd: 1.142659126043893,
          liqDepth: 3508.670931803988,
          priority: 10,
          change24H: 16.502621826298935,
          volume24H: 0
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "ACDBNT",
      decimals: 18,
      contract: "0x075561230DB23aa3B86ABE8AFE8bbc4eCDdf1C5A",
      network: "ETH"
    },
    contract: "0x29f6Ae0f0c85b472Dc792CeF36e5690E1d3f7255",
    converterType: 1,
    fee: 0.001,
    id: "0x075561230DB23aa3B86ABE8AFE8bbc4eCDdf1C5A",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "5226233911934720890",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "26067332779696732190",
        id: "0xEa6d4D7B36C00B3611dE0B0e1982B12E9e736c66"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "5226233911934720890",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x075561230DB23aa3B86ABE8AFE8bbc4eCDdf1C5A",
          liqDepth: 4.948835293471319,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "ACD",
        decimals: 18,
        contract: "0xEa6d4D7B36C00B3611dE0B0e1982B12E9e736c66",
        reserveBalance: "26067332779696732190",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xEa6d4D7B36C00B3611dE0B0e1982B12E9e736c66",
          poolId: "0x075561230DB23aa3B86ABE8AFE8bbc4eCDdf1C5A",
          costByNetworkUsd: 0.18984816495402465,
          liqDepth: 4.948835293471319,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "SNXUSDB",
      decimals: 18,
      contract: "0xdf4971E3F52f5828C72A0512d560F54bFB2B2692",
      network: "ETH"
    },
    contract: "0x296089F31af0648C1B0eFE1234527F85CDbC071C",
    converterType: 1,
    fee: 0.002,
    id: "0xdf4971E3F52f5828C72A0512d560F54bFB2B2692",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x309627af60F0926daa6041B8279484312f2bf060" },
      { amount: "0", id: "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xdf4971E3F52f5828C72A0512d560F54bFB2B2692",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "SNX",
        decimals: 18,
        contract: "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/synthetix_28.png",
          name: "Synthetix Network Token"
        },
        reserveFeed: {
          reserveAddress: "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F",
          poolId: "0xdf4971E3F52f5828C72A0512d560F54bFB2B2692",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "SNXUSDB",
      decimals: 18,
      contract: "0x28271853E950bE371B050F3f93aA0146225bF374",
      network: "ETH"
    },
    contract: "0x73B9081946021Dc6B9cE3E335A11A6A5BB2879fE",
    converterType: 1,
    fee: 0.003,
    id: "0x28271853E950bE371B050F3f93aA0146225bF374",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "91315214857018494244",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "23385509003716984019",
        id: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "91315214857018494244",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x28271853E950bE371B050F3f93aA0146225bF374",
          liqDepth: 91.31521485701849,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "SNX",
        decimals: 18,
        contract: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
        reserveBalance: "23385509003716984019",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/snx.png",
          name: "SNX"
        },
        reserveFeed: {
          reserveAddress: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
          poolId: "0x28271853E950bE371B050F3f93aA0146225bF374",
          costByNetworkUsd: 3.9047777340448095,
          liqDepth: 91.31521485701849,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "CBIX7USDB",
      decimals: 18,
      contract: "0xE35a57AC913144AEf6a4b179634D343466DE3Cc3",
      network: "ETH"
    },
    contract: "0x27004767B074C36092e98886c8D4781a14c3CF3b",
    converterType: 1,
    fee: 0.001,
    id: "0xE35a57AC913144AEf6a4b179634D343466DE3Cc3",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "11790000000000000000",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "1156506888984473460438",
        id: "0xCf8f9555D55CE45a3A33a81D6eF99a2a2E71Dee2"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "11790000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xE35a57AC913144AEf6a4b179634D343466DE3Cc3",
          liqDepth: 11.79,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "CBIX7",
        decimals: 18,
        contract: "0xCf8f9555D55CE45a3A33a81D6eF99a2a2E71Dee2",
        reserveBalance: "1156506888984473460438",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xCf8f9555D55CE45a3A33a81D6eF99a2a2E71Dee2",
          poolId: "0xE35a57AC913144AEf6a4b179634D343466DE3Cc3",
          costByNetworkUsd: 0.010194491803116518,
          liqDepth: 11.79,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "DZARUSDB",
      decimals: 18,
      contract: "0x7484867773Bc6f3110f710577d36A3605DBa59DF",
      network: "ETH"
    },
    contract: "0x53106713B160C41634D78A9D5E15D252CCf03d0C",
    converterType: 1,
    fee: 0.001,
    id: "0x7484867773Bc6f3110f710577d36A3605DBa59DF",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "10483433617788526850",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      { amount: "181570425", id: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "10483433617788526850",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x7484867773Bc6f3110f710577d36A3605DBa59DF",
          liqDepth: 10.483433617788528,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "DZAR",
        decimals: 6,
        contract: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
        reserveBalance: "181570425",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/digitalrand_32.png",
          name: "Digital Rand"
        },
        reserveFeed: {
          reserveAddress: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
          poolId: "0x7484867773Bc6f3110f710577d36A3605DBa59DF",
          costByNetworkUsd: 0.05773756170801785,
          liqDepth: 10.483433617788528,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "4XBBNT",
      decimals: 8,
      contract: "0xd8aB826b6D69f5E4Fa1325A5236491a309FBFF4f",
      network: "ETH"
    },
    contract: "0x24844e100ab6cB505C4a195b4a9B610B02518fD4",
    converterType: 1,
    fee: 0.001,
    id: "0xd8aB826b6D69f5E4Fa1325A5236491a309FBFF4f",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1925273846634522026",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "1473209497", id: "0xA3AC41Fde5f3a569fa79E81fFe6734ee8097Ce9d" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1925273846634522026",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xd8aB826b6D69f5E4Fa1325A5236491a309FBFF4f",
          liqDepth: 1.8230839496227318,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "4XB",
        decimals: 8,
        contract: "0xA3AC41Fde5f3a569fa79E81fFe6734ee8097Ce9d",
        reserveBalance: "1473209497",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xA3AC41Fde5f3a569fa79E81fFe6734ee8097Ce9d",
          poolId: "0xd8aB826b6D69f5E4Fa1325A5236491a309FBFF4f",
          costByNetworkUsd: 0.12374913095083936,
          liqDepth: 1.8230839496227318,
          priority: 10
        }
      }
    ],
    version: "13"
  },
  {
    anchor: {
      symbol: "JRTUSDB",
      decimals: 18,
      contract: "0x4827e558e642861Cd7a1C8f011b2B4661F8d51fa",
      network: "ETH"
    },
    contract: "0x66540A3fcD929774a8dab59d56fE7A2D3538450F",
    converterType: 1,
    fee: 0.001,
    id: "0x4827e558e642861Cd7a1C8f011b2B4661F8d51fa",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "4657213232106496162839",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "68077424749764777628872",
        id: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "4657213232106496162839",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x4827e558e642861Cd7a1C8f011b2B4661F8d51fa",
          liqDepth: 4657.2132321064955,
          costByNetworkUsd: 0.9999999999999999,
          priority: 10
        }
      },
      {
        symbol: "JRT",
        decimals: 18,
        contract: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A",
        reserveBalance: "68077424749764777628872",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/jarvis_28.png",
          name: "Jarvis Reward Token"
        },
        reserveFeed: {
          reserveAddress: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A",
          poolId: "0x4827e558e642861Cd7a1C8f011b2B4661F8d51fa",
          costByNetworkUsd: 0.06841053769623663,
          liqDepth: 4657.2132321064955,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "XIOUSDB",
      decimals: 18,
      contract: "0x18D8001D1Da44fE96f442f5980e08D2Ab4e19594",
      network: "ETH"
    },
    contract: "0x29e44d82303c4F9417B3A6E2e0f61314eAE84375",
    converterType: 1,
    fee: 0,
    id: "0x18D8001D1Da44fE96f442f5980e08D2Ab4e19594",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "752532303275406864",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "1120403483452102642",
        id: "0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "752532303275406864",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x18D8001D1Da44fE96f442f5980e08D2Ab4e19594",
          liqDepth: 0.7525323032754069,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "XIO",
        decimals: 18,
        contract: "0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704",
        reserveBalance: "1120403483452102642",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/xionetwork_32.png",
          name: "XIO Network"
        },
        reserveFeed: {
          reserveAddress: "0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704",
          poolId: "0x18D8001D1Da44fE96f442f5980e08D2Ab4e19594",
          costByNetworkUsd: 0.6716618739498749,
          liqDepth: 0.7525323032754069,
          priority: 10
        }
      }
    ],
    version: "22"
  },
  {
    anchor: {
      symbol: "CEEKUSDB",
      decimals: 18,
      contract: "0x27b099CF19227Ef7488D60a441d7eA2CC7FDDb25",
      network: "ETH"
    },
    contract: "0xE2AE92c64bfEFeC1Ef884071a7E7857d285c18D7",
    converterType: 1,
    fee: 0.001,
    id: "0x27b099CF19227Ef7488D60a441d7eA2CC7FDDb25",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "74716435767338444",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "59085239967335211649",
        id: "0xb056c38f6b7Dc4064367403E26424CD2c60655e1"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "74716435767338444",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x27b099CF19227Ef7488D60a441d7eA2CC7FDDb25",
          liqDepth: 0.07471643576733844,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "CEEK",
        decimals: 18,
        contract: "0xb056c38f6b7Dc4064367403E26424CD2c60655e1",
        reserveBalance: "59085239967335211649",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/ceek_28.png",
          name: "CEEK"
        },
        reserveFeed: {
          reserveAddress: "0xb056c38f6b7Dc4064367403E26424CD2c60655e1",
          poolId: "0x27b099CF19227Ef7488D60a441d7eA2CC7FDDb25",
          costByNetworkUsd: 0.0012645533099069212,
          liqDepth: 0.07471643576733844,
          priority: 10
        }
      }
    ],
    version: "22"
  },
  {
    anchor: {
      symbol: "BNCBNT",
      decimals: 18,
      contract: "0xEc7558322f0DF8719c805b39583b6Fd5ca6c9E30",
      network: "ETH"
    },
    contract: "0xe8cA7bbcAA9513638b0943664c99AEE16c1B290F",
    converterType: 1,
    fee: 0,
    id: "0xEc7558322f0DF8719c805b39583b6Fd5ca6c9E30",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0xbe5b336eF62D1626940363Cf34bE079e0AB89F20" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xEc7558322f0DF8719c805b39583b6Fd5ca6c9E30",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "BNC",
        decimals: 18,
        contract: "0xbe5b336eF62D1626940363Cf34bE079e0AB89F20",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xbe5b336eF62D1626940363Cf34bE079e0AB89F20",
          poolId: "0xEc7558322f0DF8719c805b39583b6Fd5ca6c9E30",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "29"
  },
  {
    anchor: {
      symbol: "WETHWBTCDAISNX",
      decimals: 18,
      contract: "0xca186FacC9e927e0c2ddBbd31b16eE41057edDB2",
      network: "ETH"
    },
    contract: "0xF9da2Fa63295bb991b56D38514D9E69B3C21699b",
    converterType: 1,
    fee: 0.001,
    id: "0xca186FacC9e927e0c2ddBbd31b16eE41057edDB2",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
      { amount: "0", id: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" }
    ],
    reserves: [
      {
        symbol: "WETH",
        decimals: 18,
        contract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          poolId: "0xca186FacC9e927e0c2ddBbd31b16eE41057edDB2",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "WBTC",
        decimals: 8,
        contract: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/wbtc_28.png?v=1",
          name: "Wrapped BTC"
        },
        reserveFeed: {
          reserveAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
          poolId: "0xca186FacC9e927e0c2ddBbd31b16eE41057edDB2",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "NMRBNT",
      decimals: 18,
      contract: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
      network: "ETH"
    },
    contract: "0x99B4C9Eeae0b5D868Fc3B5e833A59Fef3e8FDab1",
    converterType: 1,
    fee: 0.005,
    id: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "102547806244272254176942",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "3515332165508633814121",
        id: "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "102547806244272254176942",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
          liqDepth: 97104.76250418008,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "NMR",
        decimals: 18,
        contract: "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671",
        reserveBalance: "3515332165508633814121",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/numeraire_28_2.png",
          name: "Numeraire"
        },
        reserveFeed: {
          reserveAddress: "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671",
          poolId: "0x9Cbb076C3dc14F025bE30b4Cc34c33107D602A44",
          costByNetworkUsd: 27.623211102763594,
          liqDepth: 97104.76250418008,
          priority: 10,
          change24H: -8.897826746496358,
          volume24H: 3005.990113
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "BNTCAP",
      decimals: 18,
      contract: "0x5afD005056d4b47EBFE31f4B4d33FD8C9Abf1817",
      network: "ETH"
    },
    contract: "0xdcdc214997bb0E069057D8F7590BA9f1E7390498",
    converterType: 1,
    fee: 0.015,
    id: "0x5afD005056d4b47EBFE31f4B4d33FD8C9Abf1817",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "74869163750444811033",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "556543575351017556",
        id: "0x43044f861ec040DB59A7e324c40507adDb673142"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "74869163750444811033",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x5afD005056d4b47EBFE31f4B4d33FD8C9Abf1817",
          liqDepth: 70.89525004129068,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "CAP",
        decimals: 18,
        contract: "0x43044f861ec040DB59A7e324c40507adDb673142",
        reserveBalance: "556543575351017556",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x43044f861ec040DB59A7e324c40507adDb673142",
          poolId: "0x5afD005056d4b47EBFE31f4B4d33FD8C9Abf1817",
          costByNetworkUsd: 127.38490422169791,
          liqDepth: 70.89525004129068,
          priority: 10
        }
      }
    ],
    version: "42"
  },
  {
    anchor: {
      symbol: "BNTQASH",
      decimals: 18,
      contract: "0xbC5fe988433B97cDB1a578531c5380e8EC3242b1",
      network: "ETH"
    },
    contract: "0xCdde64592624Ed922e895f172CDaAaBa78891937",
    converterType: 1,
    fee: 0,
    id: "0xbC5fe988433B97cDB1a578531c5380e8EC3242b1",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x618E75Ac90b12c6049Ba3b27f5d5F8651b0037F6" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xbC5fe988433B97cDB1a578531c5380e8EC3242b1",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "QASH",
        decimals: 6,
        contract: "0x618E75Ac90b12c6049Ba3b27f5d5F8651b0037F6",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/qash_28_2.png",
          name: "QASH"
        },
        reserveFeed: {
          reserveAddress: "0x618E75Ac90b12c6049Ba3b27f5d5F8651b0037F6",
          poolId: "0xbC5fe988433B97cDB1a578531c5380e8EC3242b1",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "TBCUSDB",
      decimals: 18,
      contract: "0x323e4d8097B0A58aB8210AC6efCC4a89285cFc6B",
      network: "ETH"
    },
    contract: "0xa6Bc8b07507bbEB13e21B82067a07802da8aEFBF",
    converterType: 1,
    fee: 0.001,
    id: "0x323e4d8097B0A58aB8210AC6efCC4a89285cFc6B",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "60526463664972415007",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "1240460049195647738522613",
        id: "0x627974847450C45b60B3Fe3598f4e6E4cf945B9a"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "60526463664972415007",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x323e4d8097B0A58aB8210AC6efCC4a89285cFc6B",
          liqDepth: 60.52646366497241,
          costByNetworkUsd: 0.9999999999999999,
          priority: 10
        }
      },
      {
        symbol: "TBC",
        decimals: 18,
        contract: "0x627974847450C45b60B3Fe3598f4e6E4cf945B9a",
        reserveBalance: "1240460049195647738522613",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x627974847450C45b60B3Fe3598f4e6E4cf945B9a",
          poolId: "0x323e4d8097B0A58aB8210AC6efCC4a89285cFc6B",
          costByNetworkUsd: 0.0000487935614727936,
          liqDepth: 60.52646366497241,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "MLNUSDB",
      decimals: 18,
      contract: "0x0D6777BFc95b284eA9246c889E99903641129D72",
      network: "ETH"
    },
    contract: "0xe1087bf96bE2336a2b6B09F6e33636df0d4CF680",
    converterType: 1,
    fee: 0.05,
    id: "0x0D6777BFc95b284eA9246c889E99903641129D72",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "205392547078632463766",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "7975350019219042089",
        id: "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "205392547078632463766",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x0D6777BFc95b284eA9246c889E99903641129D72",
          liqDepth: 205.39254707863248,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "MLN",
        decimals: 18,
        contract: "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
        reserveBalance: "7975350019219042089",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/mln.png",
          name: "Melon Token"
        },
        reserveFeed: {
          reserveAddress: "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
          poolId: "0x0D6777BFc95b284eA9246c889E99903641129D72",
          costByNetworkUsd: 25.753421051574712,
          liqDepth: 205.39254707863248,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "TBCBNT",
      decimals: 18,
      contract: "0x536545f6B120C2fD099370334097b35bB2403BC3",
      network: "ETH"
    },
    contract: "0x0216E9D74BD5BdA4C415778d854464A8d4a0efaB",
    converterType: 1,
    fee: 0.001,
    id: "0x536545f6B120C2fD099370334097b35bB2403BC3",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "22960694352582525750",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "349391860763489384995025",
        id: "0x627974847450C45b60B3Fe3598f4e6E4cf945B9a"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "22960694352582525750",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x536545f6B120C2fD099370334097b35bB2403BC3",
          liqDepth: 21.74198409205977,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "TBC",
        decimals: 18,
        contract: "0x627974847450C45b60B3Fe3598f4e6E4cf945B9a",
        reserveBalance: "349391860763489384995025",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x627974847450C45b60B3Fe3598f4e6E4cf945B9a",
          poolId: "0x536545f6B120C2fD099370334097b35bB2403BC3",
          costByNetworkUsd: 0.00006222807836607669,
          liqDepth: 21.74198409205977,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "CBLTBNT",
      decimals: 18,
      contract: "0x7694298e99aedC4E37F855A8661B47d505Ce1b37",
      network: "ETH"
    },
    contract: "0xE2ac1898e44a3Be16F823d2b1203E6e3B1407B37",
    converterType: 1,
    fee: 0,
    id: "0x7694298e99aedC4E37F855A8661B47d505Ce1b37",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x29a99c126596c0Dc96b02A88a9EAab44EcCf511e" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x7694298e99aedC4E37F855A8661B47d505Ce1b37",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "CBLT",
        decimals: 18,
        contract: "0x29a99c126596c0Dc96b02A88a9EAab44EcCf511e",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x29a99c126596c0Dc96b02A88a9EAab44EcCf511e",
          poolId: "0x7694298e99aedC4E37F855A8661B47d505Ce1b37",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "40"
  },
  {
    anchor: {
      symbol: "USDB:PEGUSD",
      decimals: 18,
      contract: "0x846f7a6dE1eFbd7617760eBe1B89aa8CA2094025",
      network: "ETH"
    },
    contract: "0xAc0763a04Ce3b9F00839288E9705076209E9E067",
    converterType: 1,
    fee: 0.0015,
    id: "0x846f7a6dE1eFbd7617760eBe1B89aa8CA2094025",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1960212779755232442339",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "1120000000000000000000",
        id: "0xd758b77BCC792AFD58857E1d5C610aE649FDEE6b"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "1960212779755232442339",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x846f7a6dE1eFbd7617760eBe1B89aa8CA2094025",
          liqDepth: 1960.2127797552325,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "PEG:USD",
        decimals: 18,
        contract: "0xd758b77BCC792AFD58857E1d5C610aE649FDEE6b",
        reserveBalance: "1120000000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xd758b77BCC792AFD58857E1d5C610aE649FDEE6b",
          poolId: "0x846f7a6dE1eFbd7617760eBe1B89aa8CA2094025",
          costByNetworkUsd: 1.7501899819243147,
          liqDepth: 1960.2127797552325,
          priority: 10
        }
      }
    ],
    version: "14"
  },
  {
    anchor: {
      symbol: "COMMBNT",
      decimals: 18,
      contract: "0xb83546551C9d4F6D7873804a7352FA930404260d",
      network: "ETH"
    },
    contract: "0x4848b295326d49De8F83bD6663B8Cb091a730B06",
    converterType: 1,
    fee: 0.001,
    id: "0xb83546551C9d4F6D7873804a7352FA930404260d",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0xc7DeB5543CfA97b0Af2841418f53B8E554Ff566A" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xb83546551C9d4F6D7873804a7352FA930404260d",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "COMM",
        decimals: 18,
        contract: "0xc7DeB5543CfA97b0Af2841418f53B8E554Ff566A",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xc7DeB5543CfA97b0Af2841418f53B8E554Ff566A",
          poolId: "0xb83546551C9d4F6D7873804a7352FA930404260d",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "CHZBNT",
      decimals: 18,
      contract: "0x34902D61c3f8D8809A8a2481C36DC514BEBA5cE8",
      network: "ETH"
    },
    contract: "0x999053a876e4080c682Cfb86a1b2382d8DfCA517",
    converterType: 1,
    fee: 0.01,
    id: "0x34902D61c3f8D8809A8a2481C36DC514BEBA5cE8",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x3506424F91fD33084466F402d5D97f05F8e3b4AF" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x34902D61c3f8D8809A8a2481C36DC514BEBA5cE8",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "CHZ",
        decimals: 18,
        contract: "0x3506424F91fD33084466F402d5D97f05F8e3b4AF",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/chiliz_28.png",
          name: "chiliZ"
        },
        reserveFeed: {
          reserveAddress: "0x3506424F91fD33084466F402d5D97f05F8e3b4AF",
          poolId: "0x34902D61c3f8D8809A8a2481C36DC514BEBA5cE8",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "cUSDBNT",
      decimals: 18,
      contract: "0xF0F9bbd5eBc79d7cAD9d35564Ef45aDcD802611e",
      network: "ETH"
    },
    contract: "0x86A43a57Cc762472B01d50009C4ED7C1cCD77C28",
    converterType: 1,
    fee: 0.01,
    id: "0xF0F9bbd5eBc79d7cAD9d35564Ef45aDcD802611e",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x5C406D99E04B8494dc253FCc52943Ef82bcA7D75" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xF0F9bbd5eBc79d7cAD9d35564Ef45aDcD802611e",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "cUSD",
        decimals: 6,
        contract: "0x5C406D99E04B8494dc253FCc52943Ef82bcA7D75",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5C406D99E04B8494dc253FCc52943Ef82bcA7D75/logo.png",
          name: "cUSD Currency"
        },
        reserveFeed: {
          reserveAddress: "0x5C406D99E04B8494dc253FCc52943Ef82bcA7D75",
          poolId: "0xF0F9bbd5eBc79d7cAD9d35564Ef45aDcD802611e",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "AUTOBNT",
      decimals: 18,
      contract: "0x0B21617eD9b15fd901e0b36b8eDF9d68aDc11Ad5",
      network: "ETH"
    },
    contract: "0x753B73e51c7414F1ff1A10EC5f55aafD1787Ce50",
    converterType: 1,
    fee: 0.001,
    id: "0x0B21617eD9b15fd901e0b36b8eDF9d68aDc11Ad5",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "107500000000000000000",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "2150000", id: "0x0Ed55F31EE2F9875A738C6496842b0E6519D7833" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "107500000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x0B21617eD9b15fd901e0b36b8eDF9d68aDc11Ad5",
          liqDepth: 101.794103175,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "AUTO",
        decimals: 4,
        contract: "0x0Ed55F31EE2F9875A738C6496842b0E6519D7833",
        reserveBalance: "2150000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x0Ed55F31EE2F9875A738C6496842b0E6519D7833",
          poolId: "0x0B21617eD9b15fd901e0b36b8eDF9d68aDc11Ad5",
          costByNetworkUsd: 0.473460945,
          liqDepth: 101.794103175,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "FTHBNT",
      decimals: 18,
      contract: "0x3A946bb329f78CCBc75d836136De3a472Bdf5499",
      network: "ETH"
    },
    contract: "0xFF116e5b56a8FEb357fDb63c9Fe9b3d67Ba14B7F",
    converterType: 1,
    fee: 0.0011,
    id: "0x3A946bb329f78CCBc75d836136De3a472Bdf5499",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "116903866919634283",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "18186531974791916640",
        id: "0xB414F8Ec2D14c64f37B1559CBE43746284514596"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "116903866919634283",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x3A946bb329f78CCBc75d836136De3a472Bdf5499",
          liqDepth: 0.11069883061184856,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "FTH",
        decimals: 18,
        contract: "0xB414F8Ec2D14c64f37B1559CBE43746284514596",
        reserveBalance: "18186531974791916640",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xB414F8Ec2D14c64f37B1559CBE43746284514596",
          poolId: "0x3A946bb329f78CCBc75d836136De3a472Bdf5499",
          costByNetworkUsd: 0.006086857613385915,
          liqDepth: 0.11069883061184856,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "pBTCUSDB",
      decimals: 18,
      contract: "0x6B09B01c19E4bD573eae4e235ee47CBD51dF3B6E",
      network: "ETH"
    },
    contract: "0x1F60750F009745Bf0e139813C3786D10e744b50D",
    converterType: 1,
    fee: 0.002,
    id: "0x6B09B01c19E4bD573eae4e235ee47CBD51dF3B6E",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "179650821066602663281",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "9684588973881585",
        id: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "179650821066602663281",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x6B09B01c19E4bD573eae4e235ee47CBD51dF3B6E",
          liqDepth: 179.6508210666027,
          costByNetworkUsd: 1.0000000000000002,
          priority: 10
        }
      },
      {
        symbol: "pBTC",
        decimals: 18,
        contract: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b",
        reserveBalance: "9684588973881585",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5228a22e72ccC52d415EcFd199F99D0665E7733b/logo.png",
          name: "pTokens BTC"
        },
        reserveFeed: {
          reserveAddress: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b",
          poolId: "0x6B09B01c19E4bD573eae4e235ee47CBD51dF3B6E",
          costByNetworkUsd: 18550.175082401933,
          liqDepth: 179.6508210666027,
          priority: 10
        }
      }
    ],
    version: "27"
  },
  {
    anchor: {
      symbol: "pBTCBNT",
      decimals: 18,
      contract: "0xEEF7551e59b34F431D71C7593249F61D5c52ce65",
      network: "ETH"
    },
    contract: "0x43C552eB8669D60929CE3D41f4632FE3b6CB79F2",
    converterType: 1,
    fee: 0.002,
    id: "0xEEF7551e59b34F431D71C7593249F61D5c52ce65",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "218287935014132080596",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "12499880520293673",
        id: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "218287935014132080596",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xEEF7551e59b34F431D71C7593249F61D5c52ce65",
          liqDepth: 206.7016239877791,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "pBTC",
        decimals: 18,
        contract: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b",
        reserveBalance: "12499880520293673",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5228a22e72ccC52d415EcFd199F99D0665E7733b/logo.png",
          name: "pTokens BTC"
        },
        reserveFeed: {
          reserveAddress: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b",
          poolId: "0xEEF7551e59b34F431D71C7593249F61D5c52ce65",
          costByNetworkUsd: 16536.287979088847,
          liqDepth: 206.7016239877791,
          priority: 10,
          change24H: 240.62228563388896,
          volume24H: 0
        }
      }
    ],
    version: "27"
  },
  {
    anchor: {
      symbol: "SUSDDAI",
      decimals: 18,
      contract: "0xb2D679F6D676f173fAF3670a074B2C3A6D7Ebe28",
      network: "ETH"
    },
    contract: "0xDA1e8397d4ABBAd40de926e24c7BaFd851386D0a",
    converterType: 1,
    fee: 0.0005,
    id: "0xb2D679F6D676f173fAF3670a074B2C3A6D7Ebe28",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "5193124485176421959",
        id: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51"
      },
      {
        amount: "5071232761228115399",
        id: "0x6B175474E89094C44Da98b954EedeAC495271d0F"
      }
    ],
    reserves: [
      {
        symbol: "sUSD",
        decimals: 18,
        contract: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
        reserveBalance: "5193124485176421959",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/susd.png",
          name: "sUSD"
        },
        reserveFeed: {
          reserveAddress: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
          poolId: "0xb2D679F6D676f173fAF3670a074B2C3A6D7Ebe28",
          liqDepth: 5.645140979556176,
          costByNetworkUsd: 1.0870413362263929,
          priority: 10
        }
      },
      {
        symbol: "DAI",
        decimals: 18,
        contract: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        reserveBalance: "5071232761228115399",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/MCDDai_32.png",
          name: "Dai Stablecoin"
        },
        reserveFeed: {
          reserveAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          poolId: "0xb2D679F6D676f173fAF3670a074B2C3A6D7Ebe28",
          costByNetworkUsd: 1.1131693703187617,
          liqDepth: 5.645140979556176,
          priority: 10
        }
      }
    ],
    version: "25"
  },
  {
    anchor: {
      symbol: "ESTBNT",
      decimals: 18,
      contract: "0xd16a3A892695ec9a47EFFdD5247980a8d2be3fF2",
      network: "ETH"
    },
    contract: "0x55baD7CDDe403872E1A4EAB787F67177A41aA716",
    converterType: 1,
    fee: 0.001,
    id: "0xd16a3A892695ec9a47EFFdD5247980a8d2be3fF2",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "13865100000000000000",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1000000000000000000",
        id: "0x0Efc2390C79C47452898a234a27F2b9C39A7a725"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "13865100000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xd16a3A892695ec9a47EFFdD5247980a8d2be3fF2",
          liqDepth: 13.129166697039,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "EST",
        decimals: 18,
        contract: "0x0Efc2390C79C47452898a234a27F2b9C39A7a725",
        reserveBalance: "1000000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x0Efc2390C79C47452898a234a27F2b9C39A7a725",
          poolId: "0xd16a3A892695ec9a47EFFdD5247980a8d2be3fF2",
          costByNetworkUsd: 13.129166697039,
          liqDepth: 13.129166697039,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "UBTBNT",
      decimals: 18,
      contract: "0x290bd3a8F785a8dB30a0F6Baf9B88863b831747F",
      network: "ETH"
    },
    contract: "0xc4bf6Dc46537AA77428CD87cFe57D817e76285A2",
    converterType: 1,
    fee: 0.00225,
    id: "0x290bd3a8F785a8dB30a0F6Baf9B88863b831747F",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "163474497461196431181",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "33448384948",
        id: "0x8400D94A5cb0fa0D041a3788e395285d61c9ee5e"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "163474497461196431181",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x290bd3a8F785a8dB30a0F6Baf9B88863b831747F",
          liqDepth: 154.7975801027563,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "UBT",
        decimals: 8,
        contract: "0x8400D94A5cb0fa0D041a3788e395285d61c9ee5e",
        reserveBalance: "33448384948",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/unibright_28.png",
          name: "UniBright"
        },
        reserveFeed: {
          reserveAddress: "0x8400D94A5cb0fa0D041a3788e395285d61c9ee5e",
          poolId: "0x290bd3a8F785a8dB30a0F6Baf9B88863b831747F",
          costByNetworkUsd: 0.46279537963764145,
          liqDepth: 154.7975801027563,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "KEYBNT",
      decimals: 18,
      contract: "0xa7e21e7584fc6fDf6Fa978a5d4981352B0260954",
      network: "ETH"
    },
    contract: "0xcFd79b484f33c8098E2fd279729BEcC1c53a362f",
    converterType: 1,
    fee: 0.001,
    id: "0xa7e21e7584fc6fDf6Fa978a5d4981352B0260954",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "990000000000000000",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "173450966760000000000",
        id: "0x4CC19356f2D37338b9802aa8E8fc58B0373296E7"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "990000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xa7e21e7584fc6fDf6Fa978a5d4981352B0260954",
          liqDepth: 0.9374526711000002,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "KEY",
        decimals: 18,
        contract: "0x4CC19356f2D37338b9802aa8E8fc58B0373296E7",
        reserveBalance: "173450966760000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/selfkey_28.png",
          name: "SelfKey"
        },
        reserveFeed: {
          reserveAddress: "0x4CC19356f2D37338b9802aa8E8fc58B0373296E7",
          poolId: "0xa7e21e7584fc6fDf6Fa978a5d4981352B0260954",
          costByNetworkUsd: 0.005404712862725817,
          liqDepth: 0.9374526711000002,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "BFZBNT",
      decimals: 18,
      contract: "0x6f8BeaDF9eCd851be239b616149aF3E69D49ce11",
      network: "ETH"
    },
    contract: "0xd79Bd02053287a2a635B09b63136806D174d51a5",
    converterType: 1,
    fee: 0.001,
    id: "0x6f8BeaDF9eCd851be239b616149aF3E69D49ce11",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "70000000000000000000",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "10989000000000000000",
        id: "0xCFABaFF3bb057ba878f43ce027c9266D2F900561"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "70000000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x6f8BeaDF9eCd851be239b616149aF3E69D49ce11",
          liqDepth: 66.2845323,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "BFZ",
        decimals: 18,
        contract: "0xCFABaFF3bb057ba878f43ce027c9266D2F900561",
        reserveBalance: "10989000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xCFABaFF3bb057ba878f43ce027c9266D2F900561",
          poolId: "0x6f8BeaDF9eCd851be239b616149aF3E69D49ce11",
          costByNetworkUsd: 6.031898471198471,
          liqDepth: 66.2845323,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "ANKBNT",
      decimals: 18,
      contract: "0x437F7d93540094Da58F337644ba7D6E5Ad823564",
      network: "ETH"
    },
    contract: "0xE1437F404451A00A9C555000b6f3cBA2480291c8",
    converterType: 1,
    fee: 0.001,
    id: "0x437F7d93540094Da58F337644ba7D6E5Ad823564",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "389558871129210532752",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "34880586370766280040276618",
        id: "0x3C45B24359fB0E107a4eAA56Bd0F2cE66C99A0E5"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "389558871129210532752",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x437F7d93540094Da58F337644ba7D6E5Ad823564",
          liqDepth: 368.8818225159383,
          costByNetworkUsd: 0.9469218899999996,
          priority: 10
        }
      },
      {
        symbol: "ANK",
        decimals: 18,
        contract: "0x3C45B24359fB0E107a4eAA56Bd0F2cE66C99A0E5",
        reserveBalance: "34880586370766280040276618",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/ank.jpg",
          name: "Apple Network"
        },
        reserveFeed: {
          reserveAddress: "0x3C45B24359fB0E107a4eAA56Bd0F2cE66C99A0E5",
          poolId: "0x437F7d93540094Da58F337644ba7D6E5Ad823564",
          costByNetworkUsd: 0.00001057556253770726,
          liqDepth: 368.8818225159383,
          priority: 10,
          change24H: 26.312172601378666,
          volume24H: 103.800507
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "DAIBNT",
      decimals: 18,
      contract: "0xE5Df055773Bf9710053923599504831c7DBdD697",
      network: "ETH"
    },
    contract: "0x615FED2B7A84537E729D3dd32dE150bF0253fF10",
    converterType: 1,
    fee: 0.001,
    id: "0xE5Df055773Bf9710053923599504831c7DBdD697",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "5280192366094932883277680",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "4990790112539698769801663",
        id: "0x6B175474E89094C44Da98b954EedeAC495271d0F"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "5280192366094932883277680",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xE5Df055773Bf9710053923599504831c7DBdD697",
          liqDepth: 4999929.734866186,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "DAI",
        decimals: 18,
        contract: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        reserveBalance: "4990790112539698769801663",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/MCDDai_32.png",
          name: "Dai Stablecoin"
        },
        reserveFeed: {
          reserveAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          poolId: "0xE5Df055773Bf9710053923599504831c7DBdD697",
          costByNetworkUsd: 1.001831297674395,
          liqDepth: 4999929.734866186,
          priority: 10,
          change24H: 0.1815634308390363,
          volume24H: 356113.094422
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "HOTELBNT",
      decimals: 18,
      contract: "0x1344381f0e93a2A1Ab0BFd2fE209a9BD01343933",
      network: "ETH"
    },
    contract: "0x62aeE73B82Cc64dd3c65ac220838210556C5c897",
    converterType: 1,
    fee: 0.001,
    id: "0x1344381f0e93a2A1Ab0BFd2fE209a9BD01343933",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "2130432160000000200",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1459600000000000000",
        id: "0xf8A2ED21fEa517665b35aC824387bf9b41c71919"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "2130432160000000200",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x1344381f0e93a2A1Ab0BFd2fE209a9BD01343933",
          liqDepth: 2.017352847463983,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "HOTEL",
        decimals: 18,
        contract: "0xf8A2ED21fEa517665b35aC824387bf9b41c71919",
        reserveBalance: "1459600000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xf8A2ED21fEa517665b35aC824387bf9b41c71919",
          poolId: "0x1344381f0e93a2A1Ab0BFd2fE209a9BD01343933",
          costByNetworkUsd: 1.3821271906440002,
          liqDepth: 2.017352847463983,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "GRIGUSDB",
      decimals: 18,
      contract: "0x1F6e51ce0533A075fDd602FbD6159763aCaB579b",
      network: "ETH"
    },
    contract: "0xfDC38F68177634317146431E834F0838D4d0DFD3",
    converterType: 1,
    fee: 0.01,
    id: "0x1F6e51ce0533A075fDd602FbD6159763aCaB579b",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "746251421370763364069",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      { amount: "2291", id: "0x618aCb9601cb54244F5780F09536DB07d2C7aCf4" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "746251421370763364069",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x1F6e51ce0533A075fDd602FbD6159763aCaB579b",
          liqDepth: 746.2514213707634,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "GRIG",
        decimals: 2,
        contract: "0x618aCb9601cb54244F5780F09536DB07d2C7aCf4",
        reserveBalance: "2291",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/Grig.png",
          name: "Defence Grade Security"
        },
        reserveFeed: {
          reserveAddress: "0x618aCb9601cb54244F5780F09536DB07d2C7aCf4",
          poolId: "0x1F6e51ce0533A075fDd602FbD6159763aCaB579b",
          costByNetworkUsd: 32.5731742195881,
          liqDepth: 746.2514213707634,
          priority: 10,
          change24H: 75.24459096808248,
          volume24H: 0
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "YHTSBNT",
      decimals: 18,
      contract: "0x04A3030c94Fb2dBE2b898d8cBf6Fd1c656FA69dd",
      network: "ETH"
    },
    contract: "0xe8b06d938a863bb2c82644125d7714844b8A98a4",
    converterType: 1,
    fee: 0.001,
    id: "0x04A3030c94Fb2dBE2b898d8cBf6Fd1c656FA69dd",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "201135445560000000000",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "77862900882626200062",
        id: "0xcf33Eb02227255c45F595727Dbb24cE16afc36A2"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "201135445560000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x04A3030c94Fb2dBE2b898d8cBf6Fd1c656FA69dd",
          liqDepth: 190.4595562556673,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "YHTS",
        decimals: 18,
        contract: "0xcf33Eb02227255c45F595727Dbb24cE16afc36A2",
        reserveBalance: "77862900882626200062",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xcf33Eb02227255c45F595727Dbb24cE16afc36A2",
          poolId: "0x04A3030c94Fb2dBE2b898d8cBf6Fd1c656FA69dd",
          costByNetworkUsd: 2.446088626248,
          liqDepth: 190.4595562556673,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "BLYBNT",
      decimals: 18,
      contract: "0x782E07B7Bbf908135D083c4f65459f8F1549a415",
      network: "ETH"
    },
    contract: "0x3cd2ea665e45310d4a7baf0b8a378793691d49AA",
    converterType: 1,
    fee: 0,
    id: "0x782E07B7Bbf908135D083c4f65459f8F1549a415",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0xf8aD7dFe656188A23e89da09506Adf7ad9290D5d" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x782E07B7Bbf908135D083c4f65459f8F1549a415",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "BLY",
        decimals: 18,
        contract: "0xf8aD7dFe656188A23e89da09506Adf7ad9290D5d",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xf8aD7dFe656188A23e89da09506Adf7ad9290D5d",
          poolId: "0x782E07B7Bbf908135D083c4f65459f8F1549a415",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "CRTSBNT",
      decimals: 18,
      contract: "0x0F92330EAaBa84CB54b068F4331Cc40Dd2A98236",
      network: "ETH"
    },
    contract: "0x66437A8E8D98ee27B5F5B99aB7835b6A887d191b",
    converterType: 1,
    fee: 0.0015,
    id: "0x0F92330EAaBa84CB54b068F4331Cc40Dd2A98236",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "12623403454537152205",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "242304135142091993144",
        id: "0x825a64810e3EE35bD64c940140eA91a609608ABE"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "12623403454537152205",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x0F92330EAaBa84CB54b068F4331Cc40Dd2A98236",
          liqDepth: 11.953377057402848,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "CRTS",
        decimals: 18,
        contract: "0x825a64810e3EE35bD64c940140eA91a609608ABE",
        reserveBalance: "242304135142091993144",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x825a64810e3EE35bD64c940140eA91a609608ABE",
          poolId: "0x0F92330EAaBa84CB54b068F4331Cc40Dd2A98236",
          costByNetworkUsd: 0.049332121593356835,
          liqDepth: 11.953377057402848,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "LRCASTBNT",
      decimals: 18,
      contract: "0xE355dcF475ff7569B8b74d5165a532ABa87c25bf",
      network: "ETH"
    },
    contract: "0x8e11504d39dfc576a78cAC7FF835Bf9dcBb2453F",
    converterType: 1,
    fee: 0.005,
    id: "0xE355dcF475ff7569B8b74d5165a532ABa87c25bf",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xE355dcF475ff7569B8b74d5165a532ABa87c25bf",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "LRC",
        decimals: 18,
        contract: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/lrc.png",
          name: "LoopringCoin V2"
        },
        reserveFeed: {
          reserveAddress: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
          poolId: "0xE355dcF475ff7569B8b74d5165a532ABa87c25bf",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "BTCDEFI",
      decimals: 18,
      contract: "0x534DF0Ec6D65cD6fE1b05D3b8c935c97Eb844190",
      network: "ETH"
    },
    contract: "0x850e6fDc53816Fb32d6A1B45aFD95e9e6420F9d7",
    converterType: 1,
    fee: 0.003333,
    id: "0x534DF0Ec6D65cD6fE1b05D3b8c935c97Eb844190",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "115333", id: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" },
      { amount: "98994", id: "0x3212b29E33587A00FB1C83346f5dBFA69A458923" }
    ],
    reserves: [
      {
        symbol: "WBTC",
        decimals: 8,
        contract: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        reserveBalance: "115333",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/wbtc_28.png?v=1",
          name: "Wrapped BTC"
        },
        reserveFeed: {
          reserveAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
          poolId: "0x534DF0Ec6D65cD6fE1b05D3b8c935c97Eb844190",
          liqDepth: 20.872801507329,
          costByNetworkUsd: 18097.857081086073,
          priority: 10
        }
      },
      {
        symbol: "imBTC",
        decimals: 8,
        contract: "0x3212b29E33587A00FB1C83346f5dBFA69A458923",
        reserveBalance: "98994",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x3212b29E33587A00FB1C83346f5dBFA69A458923",
          poolId: "0x534DF0Ec6D65cD6fE1b05D3b8c935c97Eb844190",
          costByNetworkUsd: 21084.915759873325,
          liqDepth: 20.872801507329,
          priority: 10
        }
      }
    ],
    version: "27"
  },
  {
    anchor: {
      symbol: "BTZCUSDB",
      decimals: 18,
      contract: "0x488E99fbCF49BFfC94cCae3B8eaCDd2Bd9aC981C",
      network: "ETH"
    },
    contract: "0xbB98e2d06B2AcD3E2E4694088B8B5A0014e222cD",
    converterType: 1,
    fee: 0,
    id: "0x488E99fbCF49BFfC94cCae3B8eaCDd2Bd9aC981C",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x309627af60F0926daa6041B8279484312f2bf060" },
      { amount: "0", id: "0x80640db285Cc63496bdd8c1980A7f4526A4D477F" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x488E99fbCF49BFfC94cCae3B8eaCDd2Bd9aC981C",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "BTZC",
        decimals: 6,
        contract: "0x80640db285Cc63496bdd8c1980A7f4526A4D477F",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x80640db285Cc63496bdd8c1980A7f4526A4D477F",
          poolId: "0x488E99fbCF49BFfC94cCae3B8eaCDd2Bd9aC981C",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "WBTCpBTC",
      decimals: 18,
      contract: "0xFA3Bba432c0499c091F821aEB22FC36c4F8c78e3",
      network: "ETH"
    },
    contract: "0x7D86d4d01DD72Db066655D38C1de0006c5B2224f",
    converterType: 1,
    fee: 0.0004,
    id: "0xFA3Bba432c0499c091F821aEB22FC36c4F8c78e3",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b" },
      { amount: "0", id: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" }
    ],
    reserves: [
      {
        symbol: "pBTC",
        decimals: 18,
        contract: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5228a22e72ccC52d415EcFd199F99D0665E7733b/logo.png",
          name: "pTokens BTC"
        },
        reserveFeed: {
          reserveAddress: "0x5228a22e72ccC52d415EcFd199F99D0665E7733b",
          poolId: "0xFA3Bba432c0499c091F821aEB22FC36c4F8c78e3",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "WBTC",
        decimals: 8,
        contract: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/wbtc_28.png?v=1",
          name: "Wrapped BTC"
        },
        reserveFeed: {
          reserveAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
          poolId: "0xFA3Bba432c0499c091F821aEB22FC36c4F8c78e3",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "NTKWETH",
      decimals: 18,
      contract: "0x16EAcd526799C244CcBD8501422F542aAB07aAD4",
      network: "ETH"
    },
    contract: "0x92826145C76D7808BA6a5eA1f8f5D491dfE440b5",
    converterType: 1,
    fee: 0.002,
    id: "0x16EAcd526799C244CcBD8501422F542aAB07aAD4",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "136147942751399200000",
        id: "0x5D4d57cd06Fa7fe99e26fdc481b468f77f05073C"
      },
      {
        amount: "2722958855028",
        id: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      }
    ],
    reserves: [
      {
        symbol: "NTK",
        decimals: 18,
        contract: "0x5D4d57cd06Fa7fe99e26fdc481b468f77f05073C",
        reserveBalance: "136147942751399200000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/netkoin_28.png",
          name: "Netkoin"
        },
        reserveFeed: {
          reserveAddress: "0x5D4d57cd06Fa7fe99e26fdc481b468f77f05073C",
          poolId: "0x16EAcd526799C244CcBD8501422F542aAB07aAD4",
          liqDepth: 0.0005117978391780444,
          costByNetworkUsd: 0.000003759130169984038,
          priority: 10
        }
      },
      {
        symbol: "WETH",
        decimals: 18,
        contract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        reserveBalance: "2722958855028",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          poolId: "0x16EAcd526799C244CcBD8501422F542aAB07aAD4",
          costByNetworkUsd: 187.9565084992019,
          liqDepth: 0.0005117978391780444,
          priority: 10
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "USDC-DZAR",
      decimals: 18,
      contract: "0x4EB61146e9Ad2a9D395956eF410EBaF7459f4622",
      network: "ETH"
    },
    contract: "0x4b536A64f25f2070B5ACe6d79f6CeFf0D9Be4DC1",
    converterType: 1,
    fee: 0.005,
    id: "0x4EB61146e9Ad2a9D395956eF410EBaF7459f4622",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c" },
      { amount: "0", id: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }
    ],
    reserves: [
      {
        symbol: "DZAR",
        decimals: 6,
        contract: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/digitalrand_32.png",
          name: "Digital Rand"
        },
        reserveFeed: {
          reserveAddress: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
          poolId: "0x4EB61146e9Ad2a9D395956eF410EBaF7459f4622",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "USDC",
        decimals: 6,
        contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/usdc.png",
          name: "USD Coin"
        },
        reserveFeed: {
          reserveAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          poolId: "0x4EB61146e9Ad2a9D395956eF410EBaF7459f4622",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "sUSD-DZAR",
      decimals: 18,
      contract: "0x368B3D50E51e8bf62E6C73fc389e4102B9aEB8e2",
      network: "ETH"
    },
    contract: "0xa4FfBDc5B0F5e61537c0F43FAD28Cf45E94BdE43",
    converterType: 1,
    fee: 0.005,
    id: "0x368B3D50E51e8bf62E6C73fc389e4102B9aEB8e2",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3" },
      { amount: "0", id: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c" }
    ],
    reserves: [
      {
        symbol: "sUSD",
        decimals: 18,
        contract: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/synthetix-sUSD_28.png",
          name: "Synth sUSD"
        },
        reserveFeed: {
          reserveAddress: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3",
          poolId: "0x368B3D50E51e8bf62E6C73fc389e4102B9aEB8e2",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "DZAR",
        decimals: 6,
        contract: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/digitalrand_32.png",
          name: "Digital Rand"
        },
        reserveFeed: {
          reserveAddress: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
          poolId: "0x368B3D50E51e8bf62E6C73fc389e4102B9aEB8e2",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "SNX-DZAR",
      decimals: 18,
      contract: "0x91AFdd8EF36DEf4fa2B9d7A05420f9D0E4F775d1",
      network: "ETH"
    },
    contract: "0xC9A722be71Ac8B1Faa00c995e6d47835C933DAd6",
    converterType: 1,
    fee: 0.005,
    id: "0x91AFdd8EF36DEf4fa2B9d7A05420f9D0E4F775d1",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F" },
      { amount: "0", id: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c" }
    ],
    reserves: [
      {
        symbol: "SNX",
        decimals: 18,
        contract: "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/synthetix_28.png",
          name: "Synthetix Network Token"
        },
        reserveFeed: {
          reserveAddress: "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F",
          poolId: "0x91AFdd8EF36DEf4fa2B9d7A05420f9D0E4F775d1",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "DZAR",
        decimals: 6,
        contract: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/digitalrand_32.png",
          name: "Digital Rand"
        },
        reserveFeed: {
          reserveAddress: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
          poolId: "0x91AFdd8EF36DEf4fa2B9d7A05420f9D0E4F775d1",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "HYBNT",
      decimals: 18,
      contract: "0x31633C7c4f3FD374d187da5c19BBdb41DBdDdc86",
      network: "ETH"
    },
    contract: "0x4C10E60953C77d20dCC69E2462D794f14718adE6",
    converterType: 1,
    fee: 0,
    id: "0x31633C7c4f3FD374d187da5c19BBdb41DBdDdc86",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x9b53E429B0baDd98ef7F01F03702986c516a5715" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x31633C7c4f3FD374d187da5c19BBdb41DBdDdc86",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "HY",
        decimals: 18,
        contract: "0x9b53E429B0baDd98ef7F01F03702986c516a5715",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://avatars3.githubusercontent.com/u/48753493?s=200&v=4",
          name: "hybrix hydra"
        },
        reserveFeed: {
          reserveAddress: "0x9b53E429B0baDd98ef7F01F03702986c516a5715",
          poolId: "0x31633C7c4f3FD374d187da5c19BBdb41DBdDdc86",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "GRIDBNT",
      decimals: 18,
      contract: "0xDdde5DBa82B92DAF339fBB4cF1ec4d1CEC503075",
      network: "ETH"
    },
    contract: "0x2727Da5FB75aA61876aD90Ec09c031C01919176B",
    converterType: 1,
    fee: 0.001,
    id: "0xDdde5DBa82B92DAF339fBB4cF1ec4d1CEC503075",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "2866611596248525803768",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "13749646856513716",
        id: "0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "2866611596248525803768",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xDdde5DBa82B92DAF339fBB4cF1ec4d1CEC503075",
          liqDepth: 2714.457270615571,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "GRID",
        decimals: 12,
        contract: "0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD",
        reserveBalance: "13749646856513716",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/grid_28.png",
          name: "GRID"
        },
        reserveFeed: {
          reserveAddress: "0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD",
          poolId: "0xDdde5DBa82B92DAF339fBB4cF1ec4d1CEC503075",
          costByNetworkUsd: 0.19742014460026894,
          liqDepth: 2714.457270615571,
          priority: 10,
          change24H: 12.15361584142526,
          volume24H: 0
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "TRBBNT",
      decimals: 18,
      contract: "0x58239b5529198E0ad76975Bab0842367A4Cc7D5b",
      network: "ETH"
    },
    contract: "0x4571c9937B2CB289c099C4e8daED68827D69f3A2",
    converterType: 1,
    fee: 0.01,
    id: "0x58239b5529198E0ad76975Bab0842367A4Cc7D5b",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "293794343668416126947",
        id: "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5"
      },
      {
        amount: "7297221834544343017183",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "7297221834544343017183",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x58239b5529198E0ad76975Bab0842367A4Cc7D5b",
          liqDepth: 6909.899091315997,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "TRB",
        decimals: 18,
        contract: "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5",
        reserveBalance: "293794343668416126947",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/trb.png",
          name: "Tellor Tributes"
        },
        reserveFeed: {
          reserveAddress: "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5",
          poolId: "0x58239b5529198E0ad76975Bab0842367A4Cc7D5b",
          costByNetworkUsd: 23.519510297702283,
          liqDepth: 6909.899091315997,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "UPTBNT",
      decimals: 18,
      contract: "0x5a602561342F74D161E64796613D7528Dd0993C1",
      network: "ETH"
    },
    contract: "0xa239EA1E43fCeAb1246eD819c88AC714B3c466aE",
    converterType: 1,
    fee: 0.001,
    id: "0x5a602561342F74D161E64796613D7528Dd0993C1",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "6746245922290120539845",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "18251618190016",
        id: "0x67Abf1C62D8Acd07aDa35908d38Cd67bE7DfEB36"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "6746245922290120539845",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x5a602561342F74D161E64796613D7528Dd0993C1",
          liqDepth: 6388.167939139754,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "UPT",
        decimals: 8,
        contract: "0x67Abf1C62D8Acd07aDa35908d38Cd67bE7DfEB36",
        reserveBalance: "18251618190016",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/UPT.png",
          name: "Ultraplay"
        },
        reserveFeed: {
          reserveAddress: "0x67Abf1C62D8Acd07aDa35908d38Cd67bE7DfEB36",
          poolId: "0x5a602561342F74D161E64796613D7528Dd0993C1",
          costByNetworkUsd: 0.035000556513034055,
          liqDepth: 6388.167939139754,
          priority: 10,
          change24H: 1.3781639331608238,
          volume24H: 0
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "USDRAY1",
      decimals: 18,
      contract: "0xFD556AB5010A4076fee1A232117E4ef549A84032",
      network: "ETH"
    },
    contract: "0x971E89e5202e2E4d4cB16Bc89F742D151931559d",
    converterType: 1,
    fee: 0.001,
    id: "0xFD556AB5010A4076fee1A232117E4ef549A84032",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "12959520825038796777",
        id: "0x6B175474E89094C44Da98b954EedeAC495271d0F"
      },
      { amount: "12535899", id: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }
    ],
    reserves: [
      {
        symbol: "DAI",
        decimals: 18,
        contract: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        reserveBalance: "12959520825038796777",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/MCDDai_32.png",
          name: "Dai Stablecoin"
        },
        reserveFeed: {
          reserveAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          poolId: "0xFD556AB5010A4076fee1A232117E4ef549A84032",
          liqDepth: 12.983253565386963,
          costByNetworkUsd: 1.001831297674395,
          priority: 10
        }
      },
      {
        symbol: "USDC",
        decimals: 6,
        contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        reserveBalance: "12535899",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/usdc.png",
          name: "USD Coin"
        },
        reserveFeed: {
          reserveAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          poolId: "0xFD556AB5010A4076fee1A232117E4ef549A84032",
          costByNetworkUsd: 1.035685878243512,
          liqDepth: 12.983253565386963,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "FCOUSDB",
      decimals: 18,
      contract: "0x94A2aAA374A8F2D52dad24330C8a0Ec2934700ae",
      network: "ETH"
    },
    contract: "0xD4e88E23399b8cFCaF89CE5BEeD029D13513e6A5",
    converterType: 1,
    fee: 0.001,
    id: "0x94A2aAA374A8F2D52dad24330C8a0Ec2934700ae",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "7514992500000000000",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      { amount: "2", id: "0x4cbdaea41E4C864477E1430a896d9E3Bac11f593" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "7514992500000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x94A2aAA374A8F2D52dad24330C8a0Ec2934700ae",
          liqDepth: 7.5149925,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "FCO",
        decimals: 0,
        contract: "0x4cbdaea41E4C864477E1430a896d9E3Bac11f593",
        reserveBalance: "2",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x4cbdaea41E4C864477E1430a896d9E3Bac11f593",
          poolId: "0x94A2aAA374A8F2D52dad24330C8a0Ec2934700ae",
          costByNetworkUsd: 3.75749625,
          liqDepth: 7.5149925,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "AGSBNT",
      decimals: 18,
      contract: "0x653F1FFC243D7B6F4ca65Df9520A80D0113dA3d6",
      network: "ETH"
    },
    contract: "0xF8e14A1189ddFa7c1d2F3a4DE905935d420e9e70",
    converterType: 1,
    fee: 0.004,
    id: "0x653F1FFC243D7B6F4ca65Df9520A80D0113dA3d6",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "25726320462788724000",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "119913", id: "0x7db5454F3500f28171d1f9c7a38527C9cF94e6b2" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "25726320462788724000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x653F1FFC243D7B6F4ca65Df9520A80D0113dA3d6",
          liqDepth: 24.360815995369578,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "AGS",
        decimals: 4,
        contract: "0x7db5454F3500f28171d1f9c7a38527C9cF94e6b2",
        reserveBalance: "119913",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/silver.png",
          name: "Silver"
        },
        reserveFeed: {
          reserveAddress: "0x7db5454F3500f28171d1f9c7a38527C9cF94e6b2",
          poolId: "0x653F1FFC243D7B6F4ca65Df9520A80D0113dA3d6",
          costByNetworkUsd: 2.0315408667425197,
          liqDepth: 24.360815995369578,
          priority: 10
        }
      }
    ],
    version: "27"
  },
  {
    anchor: {
      symbol: "PARETOWETHUSDCBNT",
      decimals: 18,
      contract: "0x2f4EF142cd9983B1f86dF21BEd3cE12E06856dCb",
      network: "ETH"
    },
    contract: "0x6769c5309967Ccf6b5E5eB340089fBE7957397d1",
    converterType: 1,
    fee: 0.001,
    id: "0x2f4EF142cd9983B1f86dF21BEd3cE12E06856dCb",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "9286812518785332038",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "46786813250476806",
        id: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "9286812518785332038",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x2f4EF142cd9983B1f86dF21BEd3cE12E06856dCb",
          liqDepth: 8.793886062363866,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "WETH",
        decimals: 18,
        contract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        reserveBalance: "46786813250476806",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          poolId: "0x2f4EF142cd9983B1f86dF21BEd3cE12E06856dCb",
          costByNetworkUsd: 187.95650849920298,
          liqDepth: 8.793886062363866,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "EMIT1USDB",
      decimals: 18,
      contract: "0x37Be876EF051eB8EDdD0745107c5222D8CA8EC60",
      network: "ETH"
    },
    contract: "0x18d76D2d0a624AB973F1C98e8916aa45253b115c",
    converterType: 1,
    fee: 0.03,
    id: "0x37Be876EF051eB8EDdD0745107c5222D8CA8EC60",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "21010351979436395603",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      { amount: "210104", id: "0xb5f278Ee11811eFEC0692EC61b1e9f9984f2de11" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "21010351979436395603",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x37Be876EF051eB8EDdD0745107c5222D8CA8EC60",
          liqDepth: 21.010351979436397,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "EMIT",
        decimals: 3,
        contract: "0xb5f278Ee11811eFEC0692EC61b1e9f9984f2de11",
        reserveBalance: "210104",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xb5f278Ee11811eFEC0692EC61b1e9f9984f2de11",
          poolId: "0x37Be876EF051eB8EDdD0745107c5222D8CA8EC60",
          costByNetworkUsd: 0.09999977144383922,
          liqDepth: 21.010351979436397,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "MDZAUSDB",
      decimals: 18,
      contract: "0x7651021390129c9c2672f47292C31b33f63EE5Cc",
      network: "ETH"
    },
    contract: "0xA64906C4434211ce9f3Ac2702D5f60b21EB02E74",
    converterType: 1,
    fee: 0.001,
    id: "0x7651021390129c9c2672f47292C31b33f63EE5Cc",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "33012622938047908923",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "176851189258197305344",
        id: "0x0eCDd783dc7bF820614044B51862ED29714d2BA5"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "33012622938047908923",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x7651021390129c9c2672f47292C31b33f63EE5Cc",
          liqDepth: 31.26037530635368,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "MDZA",
        decimals: 18,
        contract: "0x0eCDd783dc7bF820614044B51862ED29714d2BA5",
        reserveBalance: "176851189258197305344",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x0eCDd783dc7bF820614044B51862ED29714d2BA5",
          poolId: "0x7651021390129c9c2672f47292C31b33f63EE5Cc",
          costByNetworkUsd: 0.17676089958724842,
          liqDepth: 31.26037530635368,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "TSTST",
      decimals: 18,
      contract: "0x10ef8f03cd0F3D7Bc14A04ba2C173414aA8C5E7E",
      network: "ETH"
    },
    contract: "0x274b4b35eE47622016d94b7eD14460de00AA504A",
    converterType: 1,
    fee: 0.001,
    id: "0x10ef8f03cd0F3D7Bc14A04ba2C173414aA8C5E7E",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "433254742736065266",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "9263944061", id: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "433254742736065266",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x10ef8f03cd0F3D7Bc14A04ba2C173414aA8C5E7E",
          liqDepth: 0.41025839984309864,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "HEX",
        decimals: 8,
        contract: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
        reserveBalance: "9263944061",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
          name: "HEX"
        },
        reserveFeed: {
          reserveAddress: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
          poolId: "0x10ef8f03cd0F3D7Bc14A04ba2C173414aA8C5E7E",
          costByNetworkUsd: 0.004428550055372562,
          liqDepth: 0.41025839984309864,
          priority: 10
        }
      }
    ],
    version: "25"
  },
  {
    anchor: {
      symbol: "RPLBNT",
      decimals: 18,
      contract: "0xB9fe4BD869a132137B668054ea48C897c0654ee4",
      network: "ETH"
    },
    contract: "0xf462769d8C7f31A07d1636D9d492c0E592D804f4",
    converterType: 1,
    fee: 0.005,
    id: "0xB9fe4BD869a132137B668054ea48C897c0654ee4",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "138244491263087885956147",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "59682546189754796346756",
        id: "0xB4EFd85c19999D84251304bDA99E90B92300Bd93"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "138244491263087885956147",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xB9fe4BD869a132137B668054ea48C897c0654ee4",
          liqDepth: 130906.73494893167,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "RPL",
        decimals: 18,
        contract: "0xB4EFd85c19999D84251304bDA99E90B92300Bd93",
        reserveBalance: "59682546189754796346756",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/Rocketpool_32.png",
          name: "Rocket Pool"
        },
        reserveFeed: {
          reserveAddress: "0xB4EFd85c19999D84251304bDA99E90B92300Bd93",
          poolId: "0xB9fe4BD869a132137B668054ea48C897c0654ee4",
          costByNetworkUsd: 2.1933838836688797,
          liqDepth: 130906.73494893167,
          priority: 10,
          change24H: -4.187724275111544,
          volume24H: 8789.47161
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "CGTBNT",
      decimals: 18,
      contract: "0x9ceE7038Fc154D92d009c2Dd8ac083b557495713",
      network: "ETH"
    },
    contract: "0xB485A5F793B1DEadA32783F99Fdccce9f28aB9a2",
    converterType: 1,
    fee: 0.001,
    id: "0x9ceE7038Fc154D92d009c2Dd8ac083b557495713",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "16296692408892806500",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      { amount: "22326537", id: "0xF5238462E7235c7B62811567E63Dd17d12C2EAA0" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "16296692408892806500",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x9ceE7038Fc154D92d009c2Dd8ac083b557495713",
          liqDepth: 15.431694776577428,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "CGT",
        decimals: 8,
        contract: "0xF5238462E7235c7B62811567E63Dd17d12C2EAA0",
        reserveBalance: "22326537",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xF5238462E7235c7B62811567E63Dd17d12C2EAA0",
          poolId: "0x9ceE7038Fc154D92d009c2Dd8ac083b557495713",
          costByNetworkUsd: 69.11817437956199,
          liqDepth: 15.431694776577428,
          priority: 10
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "STMBNT",
      decimals: 18,
      contract: "0x452821f74Ab9d38EDD3145C59280aC1bCBCe9B81",
      network: "ETH"
    },
    contract: "0x121A7b80D7E73dbe928f783d4009074063bF659D",
    converterType: 1,
    fee: 0.003,
    id: "0x452821f74Ab9d38EDD3145C59280aC1bCBCe9B81",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x0E22734e078d6e399BCeE40a549DB591C4EA46cB" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x452821f74Ab9d38EDD3145C59280aC1bCBCe9B81",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "STM",
        decimals: 18,
        contract: "0x0E22734e078d6e399BCeE40a549DB591C4EA46cB",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/STM.jpg",
          name: "Streamity"
        },
        reserveFeed: {
          reserveAddress: "0x0E22734e078d6e399BCeE40a549DB591C4EA46cB",
          poolId: "0x452821f74Ab9d38EDD3145C59280aC1bCBCe9B81",
          costByNetworkUsd: null,
          liqDepth: 0,
          priority: 10,
          change24H: null,
          volume24H: 0
        }
      }
    ],
    version: "23"
  },
  {
    anchor: {
      symbol: "XRTBNT",
      decimals: 18,
      contract: "0x111252C5A7fb75d541071753bd1fAAf367d0321F",
      network: "ETH"
    },
    contract: "0xd6562db5451534f9422c0b582bE48D2E0A37A919",
    converterType: 1,
    fee: 0.01,
    id: "0x111252C5A7fb75d541071753bd1fAAf367d0321F",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1326318280976062073604",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "57685910764",
        id: "0x7dE91B204C1C737bcEe6F000AAA6569Cf7061cb7"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1326318280976062073604",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x111252C5A7fb75d541071753bd1fAAf367d0321F",
          liqDepth: 1255.9198133634038,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "XRT",
        decimals: 9,
        contract: "0x7dE91B204C1C737bcEe6F000AAA6569Cf7061cb7",
        reserveBalance: "57685910764",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/33e530c3-8cc9-4777-b0ea-10fcc63e5ae2.png",
          name: "Robonomics"
        },
        reserveFeed: {
          reserveAddress: "0x7dE91B204C1C737bcEe6F000AAA6569Cf7061cb7",
          poolId: "0x111252C5A7fb75d541071753bd1fAAf367d0321F",
          costByNetworkUsd: 21.771690812016868,
          liqDepth: 1255.9198133634038,
          priority: 10,
          change24H: 63.36455851135175,
          volume24H: 115.242015
        }
      }
    ],
    version: "27"
  },
  {
    anchor: {
      symbol: "STAWETH",
      decimals: 18,
      contract: "0xbaD59113679717e0a9D5324d289DA6c5Fa8862E2",
      network: "ETH"
    },
    contract: "0x444Bd9a308Bd2137208ABBcc3efF679A90d7A553",
    converterType: 1,
    fee: 0.003,
    id: "0xbaD59113679717e0a9D5324d289DA6c5Fa8862E2",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
      { amount: "0", id: "0xa7DE087329BFcda5639247F96140f9DAbe3DeED1" }
    ],
    reserves: [
      {
        symbol: "WETH",
        decimals: 18,
        contract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          poolId: "0xbaD59113679717e0a9D5324d289DA6c5Fa8862E2",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "STA",
        decimals: 18,
        contract: "0xa7DE087329BFcda5639247F96140f9DAbe3DeED1",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xa7DE087329BFcda5639247F96140f9DAbe3DeED1",
          poolId: "0xbaD59113679717e0a9D5324d289DA6c5Fa8862E2",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "27"
  },
  {
    anchor: {
      symbol: "ETHBNT",
      decimals: 18,
      contract: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
      network: "ETH"
    },
    contract: "0xC37E82FF3A6a9C41779C5801408755776Ce555Aa",
    converterType: 1,
    fee: 0.001,
    id: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "9434962225509058856875519",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "16357363866786098703575",
        id: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "9434962225509058856875519",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
          liqDepth: 8934172.262657644,
          costByNetworkUsd: 0.94692189,
          priority: 10,
          change24H: -6.803178309641649,
          volume24H: 1841189.597407
        }
      },
      {
        reserveBalance: "16357363866786098703575",
        contract: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: 18,
        symbol: "ETH",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/aea83e97-13a3-4fe7-b682-b2a82299cdf2.png",
          name: "Ether"
        },
        reserveFeed: {
          reserveAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          poolId: "0xb1CD6e4153B2a390Cf00A6556b0fC1458C4A5533",
          costByNetworkUsd: 546.1865576517883,
          liqDepth: 8934172.262657644,
          priority: 10,
          change24H: -7.225081256771397,
          volume24H: 1552496.509006
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "ETHUSDB",
      decimals: 18,
      contract: "0x482c31355F4f7966fFcD38eC5c9635ACAe5F4D4F",
      network: "ETH"
    },
    contract: "0x5C8c7Ef16DaC7596C280E70C6905432F7470965E",
    converterType: 1,
    fee: 0.0015,
    id: "0x482c31355F4f7966fFcD38eC5c9635ACAe5F4D4F",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "334357647158226378228",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "584499837612071189",
        id: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "334357647158226378228",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x482c31355F4f7966fFcD38eC5c9635ACAe5F4D4F",
          liqDepth: 334.35764715822637,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        reserveBalance: "584499837612071189",
        contract: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: 18,
        symbol: "ETH",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/aea83e97-13a3-4fe7-b682-b2a82299cdf2.png",
          name: "Ether"
        },
        reserveFeed: {
          reserveAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          poolId: "0x482c31355F4f7966fFcD38eC5c9635ACAe5F4D4F",
          costByNetworkUsd: 572.0406159978053,
          liqDepth: 334.35764715822637,
          priority: 10
        }
      }
    ],
    version: "29"
  },
  {
    anchor: {
      symbol: "INVOXBNT",
      decimals: 18,
      contract: "0xD86f489a495426B1847dBd4b5D85f4832E6D7225",
      network: "ETH"
    },
    contract: "0x05e770141538e82C04a374bc11DA9B54fB50d28F",
    converterType: 1,
    fee: 0,
    id: "0xD86f489a495426B1847dBd4b5D85f4832E6D7225",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1484641218005881293886",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1943230435077797557727838",
        id: "0x4485561Db76614Ff727f8E0a3Ea95690b8b16022"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1484641218005881293886",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xD86f489a495426B1847dBd4b5D85f4832E6D7225",
          liqDepth: 1405.8392681260311,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "INVOX",
        decimals: 18,
        contract: "0x4485561Db76614Ff727f8E0a3Ea95690b8b16022",
        reserveBalance: "1943230435077797557727838",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/f3ad1750-5dc2-48ec-8ac0-7f9254ca2878.png",
          name: "Invox Finance Token"
        },
        reserveFeed: {
          reserveAddress: "0x4485561Db76614Ff727f8E0a3Ea95690b8b16022",
          poolId: "0xD86f489a495426B1847dBd4b5D85f4832E6D7225",
          costByNetworkUsd: 0.0007234547394631292,
          liqDepth: 1405.8392681260311,
          priority: 10,
          change24H: 29.366560937291062,
          volume24H: 0
        }
      }
    ],
    version: "29"
  },
  {
    anchor: {
      symbol: "XZARBNT",
      decimals: 18,
      contract: "0xdB7B2616210Bd0068D914eEB7E31aFD2Da517444",
      network: "ETH"
    },
    contract: "0x0429e43f488D2D24BB608EFbb0Ee3e646D61dE71",
    converterType: 1,
    fee: 0.00375,
    id: "0xdB7B2616210Bd0068D914eEB7E31aFD2Da517444",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x48f07301E9E29c3C38a80ae8d9ae771F224f1054" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xdB7B2616210Bd0068D914eEB7E31aFD2Da517444",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "XZAR",
        decimals: 18,
        contract: "0x48f07301E9E29c3C38a80ae8d9ae771F224f1054",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x48f07301E9E29c3C38a80ae8d9ae771F224f1054",
          poolId: "0xdB7B2616210Bd0068D914eEB7E31aFD2Da517444",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "29"
  },
  {
    anchor: {
      symbol: "STONKBNT",
      decimals: 18,
      contract: "0xc570Bae3772b618a981c4A5AaD51bc3e222E7A3B",
      network: "ETH"
    },
    contract: "0x7FF01DB7ae23b97B15Bc06f49C45d6e3d84df46f",
    converterType: 1,
    fee: 0.01,
    id: "0xc570Bae3772b618a981c4A5AaD51bc3e222E7A3B",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "10000000000000000000",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "10000000000000000000",
        id: "0xb60Fde5D798236fBF1e2697B2A0645380921FccF"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "10000000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xc570Bae3772b618a981c4A5AaD51bc3e222E7A3B",
          liqDepth: 9.4692189,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "STONK",
        decimals: 18,
        contract: "0xb60Fde5D798236fBF1e2697B2A0645380921FccF",
        reserveBalance: "10000000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xb60Fde5D798236fBF1e2697B2A0645380921FccF",
          poolId: "0xc570Bae3772b618a981c4A5AaD51bc3e222E7A3B",
          costByNetworkUsd: 0.94692189,
          liqDepth: 9.4692189,
          priority: 10
        }
      }
    ],
    version: "29"
  },
  {
    anchor: {
      symbol: "STADIFX",
      decimals: 18,
      contract: "0xC1a01Cc1F147A1a7e35E8caBFDe80706E76522dE",
      network: "ETH"
    },
    contract: "0x16ff969cC3A4AE925D9C0A2851e2386d61E75954",
    converterType: 1,
    fee: 0.0001,
    id: "0xC1a01Cc1F147A1a7e35E8caBFDe80706E76522dE",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "235207851830831594",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "29370474803174",
        id: "0x0e511Aa1a137AaD267dfe3a6bFCa0b856C1a3682"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "235207851830831594",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xC1a01Cc1F147A1a7e35E8caBFDe80706E76522dE",
          liqDepth: 0.222723463598491,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "BPT",
        decimals: 18,
        contract: "0x0e511Aa1a137AaD267dfe3a6bFCa0b856C1a3682",
        reserveBalance: "29370474803174",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x0e511Aa1a137AaD267dfe3a6bFCa0b856C1a3682",
          poolId: "0xC1a01Cc1F147A1a7e35E8caBFDe80706E76522dE",
          costByNetworkUsd: 7583.243549553438,
          liqDepth: 0.222723463598491,
          priority: 10
        }
      }
    ],
    version: "29"
  },
  {
    anchor: {
      symbol: "WEBBNT",
      decimals: 18,
      contract: "0x5094841D5eE018a5E29E23055aFC263093f95a3E",
      network: "ETH"
    },
    contract: "0xcAf6Eb14c3A20B157439904a88F00a8bE929c887",
    converterType: 1,
    fee: 0.003,
    id: "0x5094841D5eE018a5E29E23055aFC263093f95a3E",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x840fe75ABfaDc0F2d54037829571B2782e919ce4" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x5094841D5eE018a5E29E23055aFC263093f95a3E",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "WEB",
        decimals: 18,
        contract: "0x840fe75ABfaDc0F2d54037829571B2782e919ce4",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/webcoin_28.png",
          name: "Webcoin"
        },
        reserveFeed: {
          reserveAddress: "0x840fe75ABfaDc0F2d54037829571B2782e919ce4",
          poolId: "0x5094841D5eE018a5E29E23055aFC263093f95a3E",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "PEGUSDB",
      decimals: 18,
      contract: "0xE421EA0DB7A0B5bebB4b9b258D864a68546c0881",
      network: "ETH"
    },
    contract: "0x1a7eC550f463138f283C542D755cc28c5b6E26C3",
    converterType: 1,
    fee: 0.001,
    id: "0xE421EA0DB7A0B5bebB4b9b258D864a68546c0881",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "2529724298567746504241",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "119603744354774325257959",
        id: "0x8Ae56a6850a7cbeaC3c3Ab2cB311e7620167eAC8"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "2529724298567746504241",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xE421EA0DB7A0B5bebB4b9b258D864a68546c0881",
          liqDepth: 2529.7242985677467,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "PEG",
        decimals: 18,
        contract: "0x8Ae56a6850a7cbeaC3c3Ab2cB311e7620167eAC8",
        reserveBalance: "119603744354774325257959",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x8Ae56a6850a7cbeaC3c3Ab2cB311e7620167eAC8",
          poolId: "0xE421EA0DB7A0B5bebB4b9b258D864a68546c0881",
          costByNetworkUsd: 0.021150878780717416,
          liqDepth: 2529.7242985677467,
          priority: 10
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "ICTBNT",
      decimals: 18,
      contract: "0xb381D21c09BaC7278b6802193167A2a01127b976",
      network: "ETH"
    },
    contract: "0xdf6b463F27bE26110c20C1e3BDE480bD5Fc057d9",
    converterType: 1,
    fee: 0.004,
    id: "0xb381D21c09BaC7278b6802193167A2a01127b976",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x2d71983E810B9e95258966B9c164C4d61a829bA9" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xb381D21c09BaC7278b6802193167A2a01127b976",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "ICT",
        decimals: 6,
        contract: "0x2d71983E810B9e95258966B9c164C4d61a829bA9",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x2d71983E810B9e95258966B9c164C4d61a829bA9",
          poolId: "0xb381D21c09BaC7278b6802193167A2a01127b976",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "DCXUSDB",
      decimals: 18,
      contract: "0x50eA977Abd2e622241d5074fa15B97eB823B3ED5",
      network: "ETH"
    },
    contract: "0x5C1E2F8320Bfe3a5558B4eB529c823c3bB468C18",
    converterType: 1,
    fee: 0,
    id: "0x50eA977Abd2e622241d5074fa15B97eB823B3ED5",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x309627af60F0926daa6041B8279484312f2bf060" },
      { amount: "0", id: "0x199c3DdedB0e91dB3897039AF27c23286269F088" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x50eA977Abd2e622241d5074fa15B97eB823B3ED5",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "DCX",
        decimals: 8,
        contract: "0x199c3DdedB0e91dB3897039AF27c23286269F088",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x199c3DdedB0e91dB3897039AF27c23286269F088",
          poolId: "0x50eA977Abd2e622241d5074fa15B97eB823B3ED5",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "SFGBEMITUSDB",
      decimals: 18,
      contract: "0x325732Fd6d9b98f60acFb6215eDe90B9F9bAD38a",
      network: "ETH"
    },
    contract: "0x63CBbfB48B5cC9ea4B87b1B6A3a6abD70DD8A9eC",
    converterType: 1,
    fee: 0.03,
    id: "0x325732Fd6d9b98f60acFb6215eDe90B9F9bAD38a",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1000000000000000000",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      {
        amount: "99000000000000000000",
        id: "0x7cE0641D19095ed3226fC5222836901bcE41585D"
      }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "1000000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x325732Fd6d9b98f60acFb6215eDe90B9F9bAD38a",
          liqDepth: 1,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "SFGB",
        decimals: 18,
        contract: "0x7cE0641D19095ed3226fC5222836901bcE41585D",
        reserveBalance: "99000000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x7cE0641D19095ed3226fC5222836901bcE41585D",
          poolId: "0x325732Fd6d9b98f60acFb6215eDe90B9F9bAD38a",
          costByNetworkUsd: 0.010101010101010102,
          liqDepth: 1,
          priority: 10
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "STCUSDB",
      decimals: 18,
      contract: "0x9DB9CcFC66e5caCdEf842c2F04fCD7d31C3fA137",
      network: "ETH"
    },
    contract: "0x53E9c0Ee79Ab9Ccb46939685E1E62245Adf90Cba",
    converterType: 1,
    fee: 0,
    id: "0x9DB9CcFC66e5caCdEf842c2F04fCD7d31C3fA137",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x309627af60F0926daa6041B8279484312f2bf060" },
      { amount: "0", id: "0xb8B7791b1A445FB1e202683a0a329504772e0E52" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x9DB9CcFC66e5caCdEf842c2F04fCD7d31C3fA137",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "STC",
        decimals: 2,
        contract: "0xb8B7791b1A445FB1e202683a0a329504772e0E52",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xb8B7791b1A445FB1e202683a0a329504772e0E52",
          poolId: "0x9DB9CcFC66e5caCdEf842c2F04fCD7d31C3fA137",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "GLDRBNT",
      decimals: 18,
      contract: "0xb2aFA773c749F988B82CAb56284d0F1b01c7E2dC",
      network: "ETH"
    },
    contract: "0x6e7646C7c4D4cf22d24FBAf990Cdc2C62aA1A7F5",
    converterType: 1,
    fee: 0.001,
    id: "0xb2aFA773c749F988B82CAb56284d0F1b01c7E2dC",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "4409891447199251800",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "729673239137918351239",
        id: "0xF2BA4AFcBE22F0e626d67D8f31E96428706282e9"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "4409891447199251800",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xb2aFA773c749F988B82CAb56284d0F1b01c7E2dC",
          liqDepth: 4.175822743876751,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "GLDR",
        decimals: 18,
        contract: "0xF2BA4AFcBE22F0e626d67D8f31E96428706282e9",
        reserveBalance: "729673239137918351239",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xF2BA4AFcBE22F0e626d67D8f31E96428706282e9",
          poolId: "0xb2aFA773c749F988B82CAb56284d0F1b01c7E2dC",
          costByNetworkUsd: 0.005722866784603927,
          liqDepth: 4.175822743876751,
          priority: 10
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "LKSCBNT",
      decimals: 18,
      contract: "0x500f3e107A6d62bb15394892a22495ACF71D007F",
      network: "ETH"
    },
    contract: "0x7aA2b23eA10c4E8C778F60a93D1c25780DB14075",
    converterType: 1,
    fee: 0.003,
    id: "0x500f3e107A6d62bb15394892a22495ACF71D007F",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "667198143018196585561",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "498992744980036134962572",
        id: "0xfC4A2Cd574bdcC385173f03A6a52cC3B853BB9d4"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "667198143018196585561",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x500f3e107A6d62bb15394892a22495ACF71D007F",
          liqDepth: 631.7845265912812,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "LKSC",
        decimals: 18,
        contract: "0xfC4A2Cd574bdcC385173f03A6a52cC3B853BB9d4",
        reserveBalance: "498992744980036134962572",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xfC4A2Cd574bdcC385173f03A6a52cC3B853BB9d4",
          poolId: "0x500f3e107A6d62bb15394892a22495ACF71D007F",
          costByNetworkUsd: 0.0012661196639573542,
          liqDepth: 631.7845265912812,
          priority: 10
        }
      }
    ],
    version: "30"
  },
  {
    anchor: {
      symbol: "FOURUSDB",
      decimals: 18,
      contract: "0x23736A2c9728C309039831c245754E19cEd07546",
      network: "ETH"
    },
    contract: "0x1168d7C63ffa5baa167004f2b81b7f7104b4101C",
    converterType: 1,
    fee: 0,
    id: "0x23736A2c9728C309039831c245754E19cEd07546",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x309627af60F0926daa6041B8279484312f2bf060" },
      { amount: "0", id: "0x4730fB1463A6F1F44AEB45F6c5c422427f37F4D0" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x23736A2c9728C309039831c245754E19cEd07546",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "FOUR",
        decimals: 18,
        contract: "0x4730fB1463A6F1F44AEB45F6c5c422427f37F4D0",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/the4thpillartoken_32.png",
          name: "The 4th Pillar Token"
        },
        reserveFeed: {
          reserveAddress: "0x4730fB1463A6F1F44AEB45F6c5c422427f37F4D0",
          poolId: "0x23736A2c9728C309039831c245754E19cEd07546",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "ONTOBNT",
      decimals: 18,
      contract: "0x992EcEA6bEf983168Fcb264C8b2C9A15E274e02F",
      network: "ETH"
    },
    contract: "0x8863fE594289c281Aa385029904EE4575c775587",
    converterType: 1,
    fee: 0,
    id: "0x992EcEA6bEf983168Fcb264C8b2C9A15E274e02F",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0xCB0aD5f479812edD6e2cED1cfE621bF39D7E9158" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x992EcEA6bEf983168Fcb264C8b2C9A15E274e02F",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "ONTO",
        decimals: 18,
        contract: "0xCB0aD5f479812edD6e2cED1cfE621bF39D7E9158",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xCB0aD5f479812edD6e2cED1cfE621bF39D7E9158",
          poolId: "0x992EcEA6bEf983168Fcb264C8b2C9A15E274e02F",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "EXOBNT",
      decimals: 18,
      contract: "0xa8E7117ac5d76fC147B71524780327AA218B5612",
      network: "ETH"
    },
    contract: "0x05840ca15Bef62b48FD2248CB688860C8A69aDff",
    converterType: 1,
    fee: 0.001,
    id: "0xa8E7117ac5d76fC147B71524780327AA218B5612",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1331914065504086120933",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "830320858719313718569566",
        id: "0xE58E751abA3B9406367B5F3CbC39c2Fa9B519789"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1331914065504086120933",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xa8E7117ac5d76fC147B71524780327AA218B5612",
          liqDepth: 1261.218584224713,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "EXO",
        decimals: 18,
        contract: "0xE58E751abA3B9406367B5F3CbC39c2Fa9B519789",
        reserveBalance: "830320858719313718569566",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xE58E751abA3B9406367B5F3CbC39c2Fa9B519789",
          poolId: "0xa8E7117ac5d76fC147B71524780327AA218B5612",
          costByNetworkUsd: 0.0015189532708717152,
          liqDepth: 1261.218584224713,
          priority: 10
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "USDTBNT",
      decimals: 18,
      contract: "0x5365B5BC56493F08A38E5Eb08E36cBbe6fcC8306",
      network: "ETH"
    },
    contract: "0xA2C1dE568B70BC8b3565F1240D43b6949Bfe183A",
    converterType: 1,
    fee: 0.002,
    id: "0x5365B5BC56493F08A38E5Eb08E36cBbe6fcC8306",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "5278767498324342697134872",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "5016584299297",
        id: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "5278767498324342697134872",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x5365B5BC56493F08A38E5Eb08E36cBbe6fcC8306",
          liqDepth: 4998580.496383859,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "USDT",
        decimals: 6,
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        reserveBalance: "5016584299297",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/tether28_2.png",
          name: "Tether USD"
        },
        reserveFeed: {
          reserveAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          poolId: "0x5365B5BC56493F08A38E5Eb08E36cBbe6fcC8306",
          costByNetworkUsd: 0.99641114315259,
          liqDepth: 4998580.496383859,
          priority: 10,
          change24H: null,
          volume24H: 242715.031635
        }
      }
    ],
    version: "42"
  },
  {
    anchor: {
      symbol: "USDTUSDB",
      decimals: 18,
      contract: "0xF2ff22976B973d6bcC17a7dC93B719162ADA2045",
      network: "ETH"
    },
    contract: "0x39e5AAE547752c1239b4738e75cDF705c25adeA6",
    converterType: 1,
    fee: 0.001,
    id: "0xF2ff22976B973d6bcC17a7dC93B719162ADA2045",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "22170717070829661921",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      { amount: "23704408", id: "0xdAC17F958D2ee523a2206206994597C13D831ec7" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "22170717070829661921",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0xF2ff22976B973d6bcC17a7dC93B719162ADA2045",
          liqDepth: 22.17071707082966,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "USDT",
        decimals: 6,
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        reserveBalance: "23704408",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/tether28_2.png",
          name: "Tether USD"
        },
        reserveFeed: {
          reserveAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          poolId: "0xF2ff22976B973d6bcC17a7dC93B719162ADA2045",
          costByNetworkUsd: 0.9352993363440952,
          liqDepth: 22.17071707082966,
          priority: 10
        }
      }
    ],
    version: "20"
  },
  {
    anchor: {
      symbol: "USDARY",
      decimals: 18,
      contract: "0x1F5350558F1E3e8Bf370d4d552F3ebC785bf2979",
      network: "ETH"
    },
    contract: "0xEF8c6c64926A9548210adDC22e8ed6034E39b0Da",
    converterType: 1,
    fee: 0.004,
    id: "0x1F5350558F1E3e8Bf370d4d552F3ebC785bf2979",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "1112", id: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
      { amount: "1050", id: "0xdAC17F958D2ee523a2206206994597C13D831ec7" }
    ],
    reserves: [
      {
        symbol: "USDC",
        decimals: 6,
        contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        reserveBalance: "1112",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/usdc.png",
          name: "USD Coin"
        },
        reserveFeed: {
          reserveAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          poolId: "0x1F5350558F1E3e8Bf370d4d552F3ebC785bf2979",
          liqDepth: 0.0011074119141821451,
          costByNetworkUsd: 0.9958740235450945,
          priority: 10
        }
      },
      {
        symbol: "USDT",
        decimals: 6,
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        reserveBalance: "1050",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/tether28_2.png",
          name: "Tether USD"
        },
        reserveFeed: {
          reserveAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          poolId: "0x1F5350558F1E3e8Bf370d4d552F3ebC785bf2979",
          costByNetworkUsd: 1.0546780135068048,
          liqDepth: 0.0011074119141821451,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "ECCUSDT",
      decimals: 18,
      contract: "0xc83300a16de6518Dd0Be5ad656F3d6f197A30692",
      network: "ETH"
    },
    contract: "0x7fF10d4AdD8c9c2F5E47798cD60544Ad91c1F4eC",
    converterType: 1,
    fee: 0,
    id: "0xc83300a16de6518Dd0Be5ad656F3d6f197A30692",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xD5bF66fF3Dab4c74Ac6014fd2181Bd3aD1bBaF32" },
      { amount: "0", id: "0xdAC17F958D2ee523a2206206994597C13D831ec7" }
    ],
    reserves: [
      {
        symbol: "ECC",
        decimals: 8,
        contract: "0xD5bF66fF3Dab4c74Ac6014fd2181Bd3aD1bBaF32",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xD5bF66fF3Dab4c74Ac6014fd2181Bd3aD1bBaF32",
          poolId: "0xc83300a16de6518Dd0Be5ad656F3d6f197A30692",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "USDT",
        decimals: 6,
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/tether28_2.png",
          name: "Tether USD"
        },
        reserveFeed: {
          reserveAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          poolId: "0xc83300a16de6518Dd0Be5ad656F3d6f197A30692",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "USDZAR",
      decimals: 18,
      contract: "0x09C5188d9fE33d218Cc186baE8F985907b25eBEe",
      network: "ETH"
    },
    contract: "0x99e8e0e3D4cd50f856f675567FeC8eb732CfE2d7",
    converterType: 1,
    fee: 0.005,
    id: "0x09C5188d9fE33d218Cc186baE8F985907b25eBEe",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c" },
      { amount: "0", id: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3" }
    ],
    reserves: [
      {
        symbol: "DZAR",
        decimals: 6,
        contract: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/digitalrand_32.png",
          name: "Digital Rand"
        },
        reserveFeed: {
          reserveAddress: "0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c",
          poolId: "0x09C5188d9fE33d218Cc186baE8F985907b25eBEe",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "sUSD",
        decimals: 18,
        contract: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/synthetix-sUSD_28.png",
          name: "Synth sUSD"
        },
        reserveFeed: {
          reserveAddress: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3",
          poolId: "0x09C5188d9fE33d218Cc186baE8F985907b25eBEe",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "USDZAR 7030",
      decimals: 18,
      contract: "0xf001bC665ffac52c6a969305c3BDaaf88DE4bBC8",
      network: "ETH"
    },
    contract: "0x6DAE0133395AeC73B122fF010Ce85b78209310C2",
    converterType: 1,
    fee: 0.005,
    id: "0xf001bC665ffac52c6a969305c3BDaaf88DE4bBC8",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
      { amount: "0", id: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }
    ],
    reserves: [
      {
        symbol: "USDT",
        decimals: 6,
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/tether28_2.png",
          name: "Tether USD"
        },
        reserveFeed: {
          reserveAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          poolId: "0xf001bC665ffac52c6a969305c3BDaaf88DE4bBC8",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "USDC",
        decimals: 6,
        contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/usdc.png",
          name: "USD Coin"
        },
        reserveFeed: {
          reserveAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          poolId: "0xf001bC665ffac52c6a969305c3BDaaf88DE4bBC8",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "MPTBNT",
      decimals: 18,
      contract: "0xb47Bd84C954Fa597B40fe41D4e116fb0eF2468bb",
      network: "ETH"
    },
    contract: "0x81b4bd459f3f73433222D7E5439E3640A4BF4B5B",
    converterType: 1,
    fee: 0,
    id: "0xb47Bd84C954Fa597B40fe41D4e116fb0eF2468bb",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "17445721583652618137",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "156600000000",
        id: "0x2cC1bE643e0882fB096f7f96d2b6Ca079ad5270c"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "17445721583652618137",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xb47Bd84C954Fa597B40fe41D4e116fb0eF2468bb",
          liqDepth: 16.51973565440613,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "MPT",
        decimals: 8,
        contract: "0x2cC1bE643e0882fB096f7f96d2b6Ca079ad5270c",
        reserveBalance: "156600000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x2cC1bE643e0882fB096f7f96d2b6Ca079ad5270c",
          poolId: "0xb47Bd84C954Fa597B40fe41D4e116fb0eF2468bb",
          costByNetworkUsd: 0.010549001056453467,
          liqDepth: 16.51973565440613,
          priority: 10
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "ALBTUSDT",
      decimals: 18,
      contract: "0x01697e379E6B2dA6A6D052BAa09F98488433e167",
      network: "ETH"
    },
    contract: "0x86412aef21A2BB0BE5ac7bd98C7375d655e30420",
    converterType: 1,
    fee: 0,
    id: "0x01697e379E6B2dA6A6D052BAa09F98488433e167",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "491219818538077836084",
        id: "0x00a8b738E453fFd858a7edf03bcCfe20412f0Eb0"
      },
      { amount: "47258472", id: "0xdAC17F958D2ee523a2206206994597C13D831ec7" }
    ],
    reserves: [
      {
        symbol: "ALBT",
        decimals: 18,
        contract: "0x00a8b738E453fFd858a7edf03bcCfe20412f0Eb0",
        reserveBalance: "491219818538077836084",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x00a8b738E453fFd858a7edf03bcCfe20412f0Eb0",
          poolId: "0x01697e379E6B2dA6A6D052BAa09F98488433e167",
          liqDepth: 47.08886810916466,
          costByNetworkUsd: 0.09586109178026675,
          priority: 10
        }
      },
      {
        symbol: "USDT",
        decimals: 6,
        contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        reserveBalance: "47258472",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/tether28_2.png",
          name: "Tether USD"
        },
        reserveFeed: {
          reserveAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          poolId: "0x01697e379E6B2dA6A6D052BAa09F98488433e167",
          costByNetworkUsd: 0.9964111431525898,
          liqDepth: 47.08886810916466,
          priority: 10
        }
      }
    ],
    version: "31"
  },
  {
    anchor: {
      symbol: "JNTR/e",
      decimals: 18,
      contract: "0x2f005Cc29267f3B57E643B01575ec81789947142",
      network: "ETH"
    },
    contract: "0x7fC1f8F9D20f8940BAE62A594ed5f4B3A4568f1C",
    converterType: 1,
    fee: 0,
    id: "0x2f005Cc29267f3B57E643B01575ec81789947142",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "832399198076439626079",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "22164845956886334557967",
        id: "0x1368452Bfb5Cd127971C8DE22C58fBE89D35A6BF"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "832399198076439626079",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x2f005Cc29267f3B57E643B01575ec81789947142",
          liqDepth: 788.2170218770265,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "JNTR/e",
        decimals: 18,
        contract: "0x1368452Bfb5Cd127971C8DE22C58fBE89D35A6BF",
        reserveBalance: "22164845956886334557967",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/JNTRe.jpg",
          name: "JNTR/e"
        },
        reserveFeed: {
          reserveAddress: "0x1368452Bfb5Cd127971C8DE22C58fBE89D35A6BF",
          poolId: "0x2f005Cc29267f3B57E643B01575ec81789947142",
          costByNetworkUsd: 0.03556158357293422,
          liqDepth: 788.2170218770265,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "YFMBNT",
      decimals: 18,
      contract: "0x7a553617592d5b67Ef4D8B9aa67aa2A539463900",
      network: "ETH"
    },
    contract: "0x1393D065DF58ddb7874c280bb2D11a5e1e9eE96f",
    converterType: 1,
    fee: 0.003,
    id: "0x7a553617592d5b67Ef4D8B9aa67aa2A539463900",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0xa665FED1b0C9dA00e91ca582f77dF36E325048c5" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x7a553617592d5b67Ef4D8B9aa67aa2A539463900",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "YFM",
        decimals: 18,
        contract: "0xa665FED1b0C9dA00e91ca582f77dF36E325048c5",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xa665FED1b0C9dA00e91ca582f77dF36E325048c5",
          poolId: "0x7a553617592d5b67Ef4D8B9aa67aa2A539463900",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "39"
  },
  {
    anchor: {
      symbol: "ACPTBNT",
      decimals: 18,
      contract: "0x9E7749E446572842C7c0E1B76b673e9D1332db11",
      network: "ETH"
    },
    contract: "0x29FE708D175C2Bc416139bA0272ADf975fE6d418",
    converterType: 1,
    fee: 0.02,
    id: "0x9E7749E446572842C7c0E1B76b673e9D1332db11",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "391318094135492163166",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "1230346483849499471528829",
        id: "0xcAd2d4C4469fF09aB24d02A63BCeDfCD44bE0645"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "391318094135492163166",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x9E7749E446572842C7c0E1B76b673e9D1332db11",
          liqDepth: 370.5476692899781,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "ACPT",
        decimals: 18,
        contract: "0xcAd2d4C4469fF09aB24d02A63BCeDfCD44bE0645",
        reserveBalance: "1230346483849499471528829",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xcAd2d4C4469fF09aB24d02A63BCeDfCD44bE0645",
          poolId: "0x9E7749E446572842C7c0E1B76b673e9D1332db11",
          costByNetworkUsd: 0.0003011734289113512,
          liqDepth: 370.5476692899781,
          priority: 10
        }
      }
    ],
    version: "39"
  },
  {
    anchor: {
      symbol: "MITxUSDB",
      decimals: 18,
      contract: "0x7482326Eb7E44Aec1269C052B9B1aF26606b0B90",
      network: "ETH"
    },
    contract: "0x9f860A2C3786074e37fA2ab03B245A97E0e1F43E",
    converterType: 1,
    fee: 0,
    id: "0x7482326Eb7E44Aec1269C052B9B1aF26606b0B90",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x309627af60F0926daa6041B8279484312f2bf060" },
      { amount: "0", id: "0x4a527d8fc13C5203AB24BA0944F4Cb14658D1Db6" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x7482326Eb7E44Aec1269C052B9B1aF26606b0B90",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "MITx",
        decimals: 18,
        contract: "0x4a527d8fc13C5203AB24BA0944F4Cb14658D1Db6",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/morpheuslab_28.png",
          name: "Morpheus Infrastructure Token"
        },
        reserveFeed: {
          reserveAddress: "0x4a527d8fc13C5203AB24BA0944F4Cb14658D1Db6",
          poolId: "0x7482326Eb7E44Aec1269C052B9B1aF26606b0B90",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "40"
  },
  {
    anchor: {
      symbol: "ALEPHBNT",
      decimals: 18,
      contract: "0x3b8c8147325C378cfe10f7b8c3aB1683D300dF27",
      network: "ETH"
    },
    contract: "0xA6cA935241a3EbCb0156C178103aa4827280f886",
    converterType: 1,
    fee: 0.002,
    id: "0x3b8c8147325C378cfe10f7b8c3aB1683D300dF27",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "376394873705019577443151",
        id: "0x27702a26126e0B3702af63Ee09aC4d1A084EF628"
      },
      {
        amount: "54355041412727689174614",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "54355041412727689174614",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x3b8c8147325C378cfe10f7b8c3aB1683D300dF27",
          liqDepth: 51469.978545568374,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "ALEPH",
        decimals: 18,
        contract: "0x27702a26126e0B3702af63Ee09aC4d1A084EF628",
        reserveBalance: "376394873705019577443151",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/aleph.png",
          name: "ALEPH"
        },
        reserveFeed: {
          reserveAddress: "0x27702a26126e0B3702af63Ee09aC4d1A084EF628",
          poolId: "0x3b8c8147325C378cfe10f7b8c3aB1683D300dF27",
          costByNetworkUsd: 0.1367446321437028,
          liqDepth: 51469.978545568374,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "BALBNT",
      decimals: 18,
      contract: "0x3E22d87977dA52Accef2Af9Eb50f76bd31b7b6B1",
      network: "ETH"
    },
    contract: "0x15C6aC6Fc9d4179D9b799e709C1AfD726bA97418",
    converterType: 1,
    fee: 0.002,
    id: "0x3E22d87977dA52Accef2Af9Eb50f76bd31b7b6B1",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xba100000625a3754423978a60c9317c58a424e3D" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x3E22d87977dA52Accef2Af9Eb50f76bd31b7b6B1",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "BAL",
        decimals: 18,
        contract: "0xba100000625a3754423978a60c9317c58a424e3D",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/bal.png",
          name: "BAL"
        },
        reserveFeed: {
          reserveAddress: "0xba100000625a3754423978a60c9317c58a424e3D",
          poolId: "0x3E22d87977dA52Accef2Af9Eb50f76bd31b7b6B1",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "BANDBNT",
      decimals: 18,
      contract: "0x44Fa59B2F044367f9F027b7694fD3BacbF22c3d5",
      network: "ETH"
    },
    contract: "0x9fd87e582BF14aB33121BD92274aa0bA4A62b4E2",
    converterType: 1,
    fee: 0.002,
    id: "0x44Fa59B2F044367f9F027b7694fD3BacbF22c3d5",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "115791296786869151329",
        id: "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55"
      },
      {
        amount: "862711244737272249860",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "862711244737272249860",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x44Fa59B2F044367f9F027b7694fD3BacbF22c3d5",
          liqDepth: 816.9201623908704,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "BAND",
        decimals: 18,
        contract: "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55",
        reserveBalance: "115791296786869151329",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/band.png",
          name: "BandToken"
        },
        reserveFeed: {
          reserveAddress: "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55",
          poolId: "0x44Fa59B2F044367f9F027b7694fD3BacbF22c3d5",
          costByNetworkUsd: 7.055108501760125,
          liqDepth: 816.9201623908704,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "BUSDBNT",
      decimals: 18,
      contract: "0x7b86306D72103Ccd5405DF9dBFf4B794C46EBbC9",
      network: "ETH"
    },
    contract: "0x485e61D9549b65AbDb1EAbD15Cc30A1aB00f6cAF",
    converterType: 1,
    fee: 0.002,
    id: "0x7b86306D72103Ccd5405DF9dBFf4B794C46EBbC9",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x4Fabb145d64652a948d72533023f6E7A623C7C53" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x7b86306D72103Ccd5405DF9dBFf4B794C46EBbC9",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "BUSD",
        decimals: 18,
        contract: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/busd.png",
          name: "Binance USD"
        },
        reserveFeed: {
          reserveAddress: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
          poolId: "0x7b86306D72103Ccd5405DF9dBFf4B794C46EBbC9",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "BZRXBNT",
      decimals: 18,
      contract: "0xE39c4Ae17C0d44e923B784794B3Ea419c04F02FA",
      network: "ETH"
    },
    contract: "0x9b730363cFff06Ca6E976f8c549d1B6764ba021C",
    converterType: 1,
    fee: 0.002,
    id: "0xE39c4Ae17C0d44e923B784794B3Ea419c04F02FA",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "34572861640875522092097",
        id: "0x56d811088235F11C8920698a204A5010a788f4b3"
      },
      {
        amount: "8350726750663096459554",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "8350726750663096459554",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xE39c4Ae17C0d44e923B784794B3Ea419c04F02FA",
          liqDepth: 7907.485957611458,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "BZRX",
        decimals: 18,
        contract: "0x56d811088235F11C8920698a204A5010a788f4b3",
        reserveBalance: "34572861640875522092097",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/bzrx.png",
          name: "BZRX"
        },
        reserveFeed: {
          reserveAddress: "0x56d811088235F11C8920698a204A5010a788f4b3",
          poolId: "0xE39c4Ae17C0d44e923B784794B3Ea419c04F02FA",
          costByNetworkUsd: 0.2287194516829475,
          liqDepth: 7907.485957611458,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "CELBNT",
      decimals: 18,
      contract: "0xA31BF9E52B92ABF37D1d126ad2D9a6d0Ce9637f0",
      network: "ETH"
    },
    contract: "0x70B4a71Ad893C2E775Cecd8855E7c6F95fB5af21",
    converterType: 1,
    fee: 0.01,
    id: "0xA31BF9E52B92ABF37D1d126ad2D9a6d0Ce9637f0",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "7973225", id: "0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d" },
      {
        amount: "1836655375918042665546",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1836655375918042665546",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xA31BF9E52B92ABF37D1d126ad2D9a6d0Ce9637f0",
          liqDepth: 1739.1691798429738,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "CEL",
        decimals: 4,
        contract: "0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d",
        reserveBalance: "7973225",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/cel.png",
          name: "Celsius"
        },
        reserveFeed: {
          reserveAddress: "0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d",
          poolId: "0xA31BF9E52B92ABF37D1d126ad2D9a6d0Ce9637f0",
          costByNetworkUsd: 2.1812618856773436,
          liqDepth: 1739.1691798429738,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "CHERRYBNT",
      decimals: 18,
      contract: "0xED8562cf805936AFdd2A405e7ACe80f78efc4Ed5",
      network: "ETH"
    },
    contract: "0x303D1F3ff37A878d4023702be8d70a82A49D74Eb",
    converterType: 1,
    fee: 0.002,
    id: "0xED8562cf805936AFdd2A405e7ACe80f78efc4Ed5",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "154272134", id: "0x4eCB692B0fEDeCD7B486b4c99044392784877E8C" },
      {
        amount: "63399294368264992073211",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "63399294368264992073211",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xED8562cf805936AFdd2A405e7ACe80f78efc4Ed5",
          liqDepth: 60034.179647863835,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "CHERRY",
        decimals: 4,
        contract: "0x4eCB692B0fEDeCD7B486b4c99044392784877E8C",
        reserveBalance: "154272134",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/cherry.png",
          name: "CHERRY"
        },
        reserveFeed: {
          reserveAddress: "0x4eCB692B0fEDeCD7B486b4c99044392784877E8C",
          poolId: "0xED8562cf805936AFdd2A405e7ACe80f78efc4Ed5",
          costByNetworkUsd: 3.891446763020977,
          liqDepth: 60034.179647863835,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "COMPBNT",
      decimals: 18,
      contract: "0xB4c5BC0d1d41F3440c580A0F52B6641E4A913Df4",
      network: "ETH"
    },
    contract: "0x7deb97229DBF5aaC741C62b36E8dde9F541F9CC1",
    converterType: 1,
    fee: 0.002,
    id: "0xB4c5BC0d1d41F3440c580A0F52B6641E4A913Df4",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xc00e94Cb662C3520282E6f5717214004A7f26888" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xB4c5BC0d1d41F3440c580A0F52B6641E4A913Df4",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "COMP",
        decimals: 18,
        contract: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/comp.png",
          name: "COMP"
        },
        reserveFeed: {
          reserveAddress: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
          poolId: "0xB4c5BC0d1d41F3440c580A0F52B6641E4A913Df4",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "CROBNT",
      decimals: 18,
      contract: "0x8e7970eca4be7F186A5D7acdc8dcF778EA26Ee9b",
      network: "ETH"
    },
    contract: "0x40280D2A19a52E064DF1Cc68F8d4f77856FD6A71",
    converterType: 1,
    fee: 0.002,
    id: "0x8e7970eca4be7F186A5D7acdc8dcF778EA26Ee9b",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x8e7970eca4be7F186A5D7acdc8dcF778EA26Ee9b",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "CRO",
        decimals: 8,
        contract: "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/cro.png",
          name: "Crypto.com Coin"
        },
        reserveFeed: {
          reserveAddress: "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b",
          poolId: "0x8e7970eca4be7F186A5D7acdc8dcF778EA26Ee9b",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "CRVBNT",
      decimals: 18,
      contract: "0xe783E81cf1b5bf475aDB76e41a2AB996c6e2ae50",
      network: "ETH"
    },
    contract: "0xcD4B9ef178394B92b90cFD076FDf8C024461ca13",
    converterType: 1,
    fee: 0.002,
    id: "0xe783E81cf1b5bf475aDB76e41a2AB996c6e2ae50",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xD533a949740bb3306d119CC777fa900bA034cd52" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xe783E81cf1b5bf475aDB76e41a2AB996c6e2ae50",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "CRV",
        decimals: 18,
        contract: "0xD533a949740bb3306d119CC777fa900bA034cd52",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/crv.png",
          name: "CRV"
        },
        reserveFeed: {
          reserveAddress: "0xD533a949740bb3306d119CC777fa900bA034cd52",
          poolId: "0xe783E81cf1b5bf475aDB76e41a2AB996c6e2ae50",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "DXDBNT",
      decimals: 18,
      contract: "0xB3aF30c0c1a9673E14c9B0C56eCd4cBBeB0F6c48",
      network: "ETH"
    },
    contract: "0xAe46E888aF6318aED82FE715b1b98b78F74e7b65",
    converterType: 1,
    fee: 0.01,
    id: "0xB3aF30c0c1a9673E14c9B0C56eCd4cBBeB0F6c48",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "8489834407117146946",
        id: "0xa1d65E8fB6e87b60FECCBc582F7f97804B725521"
      },
      {
        amount: "1489918399024397497099",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1489918399024397497099",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xB3aF30c0c1a9673E14c9B0C56eCd4cBBeB0F6c48",
          liqDepth: 1410.8363463499566,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "DXD",
        decimals: 18,
        contract: "0xa1d65E8fB6e87b60FECCBc582F7f97804B725521",
        reserveBalance: "8489834407117146946",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/dxd.png",
          name: "DXD"
        },
        reserveFeed: {
          reserveAddress: "0xa1d65E8fB6e87b60FECCBc582F7f97804B725521",
          poolId: "0xB3aF30c0c1a9673E14c9B0C56eCd4cBBeB0F6c48",
          costByNetworkUsd: 166.17948933930123,
          liqDepth: 1410.8363463499566,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "EWTBBNT",
      decimals: 18,
      contract: "0x66948fEFCcc464c714574a884c0458981Cbd944C",
      network: "ETH"
    },
    contract: "0xBDfFd4Fa6Fd5C8D3B9AbD81C9f7b71681A96763e",
    converterType: 1,
    fee: 0.01,
    id: "0x66948fEFCcc464c714574a884c0458981Cbd944C",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "7994809933775429085720",
        id: "0x178c820f862B14f316509ec36b13123DA19A6054"
      },
      {
        amount: "46445979787802818275945",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "46445979787802818275945",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x66948fEFCcc464c714574a884c0458981Cbd944C",
          liqDepth: 43980.71496356804,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "EWTB",
        decimals: 18,
        contract: "0x178c820f862B14f316509ec36b13123DA19A6054",
        reserveBalance: "7994809933775429085720",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x178c820f862B14f316509ec36b13123DA19A6054",
          poolId: "0x66948fEFCcc464c714574a884c0458981Cbd944C",
          costByNetworkUsd: 5.501158292427198,
          liqDepth: 43980.71496356804,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "ZRXBNT",
      decimals: 18,
      contract: "0xa09B58ECeFA3a5d3736Ba9E2E002ca566Adf08eb",
      network: "ETH"
    },
    contract: "0xEcC601451e84Ea5eFb61e60A3e4e7BbC56E69b79",
    converterType: 1,
    fee: 0.002,
    id: "0xa09B58ECeFA3a5d3736Ba9E2E002ca566Adf08eb",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xE41d2489571d322189246DaFA5ebDe1F4699F498" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xa09B58ECeFA3a5d3736Ba9E2E002ca566Adf08eb",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "ZRX",
        decimals: 18,
        contract: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/bzrx.png",
          name: "ZRX"
        },
        reserveFeed: {
          reserveAddress: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
          poolId: "0xa09B58ECeFA3a5d3736Ba9E2E002ca566Adf08eb",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "GUSDBNT",
      decimals: 18,
      contract: "0x5A576922849dF442f1Dc0c3bA7b3c345EdB2bd44",
      network: "ETH"
    },
    contract: "0x17A0edF4E67ED4C7FF3A3D06E0aAF7f38A3537D6",
    converterType: 1,
    fee: 0.002,
    id: "0x5A576922849dF442f1Dc0c3bA7b3c345EdB2bd44",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x5A576922849dF442f1Dc0c3bA7b3c345EdB2bd44",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "GUSD",
        decimals: 2,
        contract: "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/gusd.png",
          name: "Gemini dollar"
        },
        reserveFeed: {
          reserveAddress: "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
          poolId: "0x5A576922849dF442f1Dc0c3bA7b3c345EdB2bd44",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "QNTBNT",
      decimals: 18,
      contract: "0xD6bF84B5D6F4d1288C39f2486688e949B1423E62",
      network: "ETH"
    },
    contract: "0x834d0Af9a86431F3a366f20320c332E95E822E1a",
    converterType: 1,
    fee: 0.002,
    id: "0xD6bF84B5D6F4d1288C39f2486688e949B1423E62",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x4a220E6096B25EADb88358cb44068A3248254675" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xD6bF84B5D6F4d1288C39f2486688e949B1423E62",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "QNT",
        decimals: 18,
        contract: "0x4a220E6096B25EADb88358cb44068A3248254675",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/qnt.png",
          name: "Quant"
        },
        reserveFeed: {
          reserveAddress: "0x4a220E6096B25EADb88358cb44068A3248254675",
          poolId: "0xD6bF84B5D6F4d1288C39f2486688e949B1423E62",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "LINKBNT",
      decimals: 18,
      contract: "0x04D0231162b4784b706908c787CE32bD075db9b7",
      network: "ETH"
    },
    contract: "0xc314527CA3329bEDb35b3ec2657a5Bb2a0b01A83",
    converterType: 1,
    fee: 0.005,
    id: "0x04D0231162b4784b706908c787CE32bD075db9b7",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "429409965206347895140411",
        id: "0x514910771AF9Ca656af840dff83E8264EcF986CA"
      },
      {
        amount: "5390936312771863461262013",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "5390936312771863461262013",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x04D0231162b4784b706908c787CE32bD075db9b7",
          liqDepth: 5104795.602159563,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "LINK",
        decimals: 18,
        contract: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        reserveBalance: "429409965206347895140411",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/chainlink.jpg",
          name: "ChainLink Token"
        },
        reserveFeed: {
          reserveAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
          poolId: "0x04D0231162b4784b706908c787CE32bD075db9b7",
          costByNetworkUsd: 11.887929987154617,
          liqDepth: 5104795.602159563,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "LRCBNT",
      decimals: 18,
      contract: "0xF5A203E16ab9B850b27f1F00C37352b6b7A28339",
      network: "ETH"
    },
    contract: "0xcCD95D042C598fB4AD544dF2b47D6C749d99A83a",
    converterType: 1,
    fee: 0.01,
    id: "0xF5A203E16ab9B850b27f1F00C37352b6b7A28339",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "82741532900695754721093",
        id: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD"
      },
      {
        amount: "15790858368168133496831",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "15790858368168133496831",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xF5A203E16ab9B850b27f1F00C37352b6b7A28339",
          liqDepth: 14952.709450708082,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "LRC",
        decimals: 18,
        contract: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
        reserveBalance: "82741532900695754721093",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/lrc.png",
          name: "LoopringCoin V2"
        },
        reserveFeed: {
          reserveAddress: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
          poolId: "0xF5A203E16ab9B850b27f1F00C37352b6b7A28339",
          costByNetworkUsd: 0.18071588628475058,
          liqDepth: 14952.709450708082,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "MATICBNT",
      decimals: 18,
      contract: "0x8151E0Fbbc10Af5b0F16B413dB0747169e9687d9",
      network: "ETH"
    },
    contract: "0x38894871b6beEF3fc18C3de6cF66d8252D65B49C",
    converterType: 1,
    fee: 0.002,
    id: "0x8151E0Fbbc10Af5b0F16B413dB0747169e9687d9",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "65838350366239897484809",
        id: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
      },
      {
        amount: "1240384949278051793998",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1240384949278051793998",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x8151E0Fbbc10Af5b0F16B413dB0747169e9687d9",
          liqDepth: 1174.547660497927,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "MATIC",
        decimals: 18,
        contract: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
        reserveBalance: "65838350366239897484809",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/matic.png",
          name: "Matic Token"
        },
        reserveFeed: {
          reserveAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
          poolId: "0x8151E0Fbbc10Af5b0F16B413dB0747169e9687d9",
          costByNetworkUsd: 0.01783987074348392,
          liqDepth: 1174.547660497927,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "MLNBNT",
      decimals: 18,
      contract: "0xff2CCF332A2d6CD645f93c19690104B99943b13D",
      network: "ETH"
    },
    contract: "0xa8BaE685a9213a27bC82ef782d1ba40964497dB1",
    converterType: 1,
    fee: 0.01,
    id: "0xff2CCF332A2d6CD645f93c19690104B99943b13D",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "120740201913623411966",
        id: "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892"
      },
      {
        amount: "3957892527391451144228",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "3957892527391451144228",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xff2CCF332A2d6CD645f93c19690104B99943b13D",
          liqDepth: 3747.81507245439,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "MLN",
        decimals: 18,
        contract: "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
        reserveBalance: "120740201913623411966",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/mln.png",
          name: "Melon Token"
        },
        reserveFeed: {
          reserveAddress: "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
          poolId: "0xff2CCF332A2d6CD645f93c19690104B99943b13D",
          costByNetworkUsd: 31.04032470589661,
          liqDepth: 3747.81507245439,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "MTABNT",
      decimals: 18,
      contract: "0x3035529E7aE11A3660134c9C875F4faa6514d042",
      network: "ETH"
    },
    contract: "0x1051f6DD42407908372Ba241206EBD33091b1BC5",
    converterType: 1,
    fee: 0.01,
    id: "0x3035529E7aE11A3660134c9C875F4faa6514d042",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "9601784320472765462115",
        id: "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2"
      },
      {
        amount: "12358807262824290158341",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "12358807262824290158341",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x3035529E7aE11A3660134c9C875F4faa6514d042",
          liqDepth: 11702.825131459302,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "MTA",
        decimals: 18,
        contract: "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2",
        reserveBalance: "9601784320472765462115",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/mta.png",
          name: "MTA"
        },
        reserveFeed: {
          reserveAddress: "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2",
          poolId: "0x3035529E7aE11A3660134c9C875F4faa6514d042",
          costByNetworkUsd: 1.2188177468751025,
          liqDepth: 11702.825131459302,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "OCEANBNT",
      decimals: 18,
      contract: "0xCDfF066eDf8a770E9b6A7aE12F7CFD3DbA0011B5",
      network: "ETH"
    },
    contract: "0xE9275ab4689B15C4E00de8F9c5e03e00358FC7Ab",
    converterType: 1,
    fee: 0.005,
    id: "0xCDfF066eDf8a770E9b6A7aE12F7CFD3DbA0011B5",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "7069415283443530958072184",
        id: "0x967da4048cD07aB37855c090aAF366e4ce1b9F48"
      },
      {
        amount: "2740571112321611258215335",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "2740571112321611258215335",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xCDfF066eDf8a770E9b6A7aE12F7CFD3DbA0011B5",
          liqDepth: 2595106.777358982,
          costByNetworkUsd: 0.9469218899999998,
          priority: 10
        }
      },
      {
        symbol: "OCEAN",
        decimals: 18,
        contract: "0x967da4048cD07aB37855c090aAF366e4ce1b9F48",
        reserveBalance: "7069415283443530958072184",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/ocean.png",
          name: "OCEAN"
        },
        reserveFeed: {
          reserveAddress: "0x967da4048cD07aB37855c090aAF366e4ce1b9F48",
          poolId: "0xCDfF066eDf8a770E9b6A7aE12F7CFD3DbA0011B5",
          costByNetworkUsd: 0.36708930983821036,
          liqDepth: 2595106.777358982,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "RARIBNT",
      decimals: 18,
      contract: "0xb5faf55A4bD812a918c68F629A00d8F9750a2C4d",
      network: "ETH"
    },
    contract: "0x9d614e61Fda55cdd10d6e73C333E23E41E2B37e2",
    converterType: 1,
    fee: 0.002,
    id: "0xb5faf55A4bD812a918c68F629A00d8F9750a2C4d",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xb5faf55A4bD812a918c68F629A00d8F9750a2C4d",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "RARI",
        decimals: 18,
        contract: "0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF",
          poolId: "0xb5faf55A4bD812a918c68F629A00d8F9750a2C4d",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "RENBNT",
      decimals: 18,
      contract: "0x6b181C478b315bE3f9E99c57CE926436c32e17a7",
      network: "ETH"
    },
    contract: "0xAcba46e8654Bc8c55dd0CBDaF22b5e30036fAced",
    converterType: 1,
    fee: 0.005,
    id: "0x6b181C478b315bE3f9E99c57CE926436c32e17a7",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "6347973126926365448825960",
        id: "0x408e41876cCCDC0F92210600ef50372656052a38"
      },
      {
        amount: "1933810005284858422409077",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1933810005284858422409077",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x6b181C478b315bE3f9E99c57CE926436c32e17a7",
          liqDepth: 1831167.0251052482,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "REN",
        decimals: 18,
        contract: "0x408e41876cCCDC0F92210600ef50372656052a38",
        reserveBalance: "6347973126926365448825960",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/ren.png",
          name: "Republic"
        },
        reserveFeed: {
          reserveAddress: "0x408e41876cCCDC0F92210600ef50372656052a38",
          poolId: "0x6b181C478b315bE3f9E99c57CE926436c32e17a7",
          costByNetworkUsd: 0.28846483570290155,
          liqDepth: 1831167.0251052482,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "renBTCBNT",
      decimals: 18,
      contract: "0xb479b102bF135bdC666d6916172422CbaD9E977f",
      network: "ETH"
    },
    contract: "0xd1A758f84BF6762bdF6F795a9DdeE35eB0597ee4",
    converterType: 1,
    fee: 0.005,
    id: "0xb479b102bF135bdC666d6916172422CbaD9E977f",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "8183948578",
        id: "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D"
      },
      {
        amount: "1562939618979616818458525",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1562939618979616818458525",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xb479b102bF135bdC666d6916172422CbaD9E977f",
          liqDepth: 1479981.7379600587,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "renBTC",
        decimals: 8,
        contract: "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
        reserveBalance: "8183948578",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/renBTC.png",
          name: "renBTC"
        },
        reserveFeed: {
          reserveAddress: "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
          poolId: "0xb479b102bF135bdC666d6916172422CbaD9E977f",
          costByNetworkUsd: 18083.956953719495,
          liqDepth: 1479981.7379600587,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "renZECBNT",
      decimals: 18,
      contract: "0x986D522a4f9fd0b4158A88657a06A552f83C3e27",
      network: "ETH"
    },
    contract: "0xB7588B165Cc8F51177Df4902Cd7839052B8c49b2",
    converterType: 1,
    fee: 0.002,
    id: "0x986D522a4f9fd0b4158A88657a06A552f83C3e27",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "2658951529",
        id: "0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2"
      },
      {
        amount: "1909211038409346147385",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1909211038409346147385",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x986D522a4f9fd0b4158A88657a06A552f83C3e27",
          liqDepth: 1807.8737248994405,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "renZEC",
        decimals: 8,
        contract: "0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2",
        reserveBalance: "2658951529",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/renZEC.png",
          name: "renZEC"
        },
        reserveFeed: {
          reserveAddress: "0x1C5db575E2Ff833E46a2E9864C22F4B22E0B37C2",
          poolId: "0x986D522a4f9fd0b4158A88657a06A552f83C3e27",
          costByNetworkUsd: 67.99197748367231,
          liqDepth: 1807.8737248994405,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "RSRBNT",
      decimals: 18,
      contract: "0x7d402c5CF587D4dEC6761C51E0aA903956495851",
      network: "ETH"
    },
    contract: "0x7beDCB884146D1D8422E4cE56E7CeE62799A9f84",
    converterType: 1,
    fee: 0.01,
    id: "0x7d402c5CF587D4dEC6761C51E0aA903956495851",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "6632293907402537558746582",
        id: "0x8762db106B2c2A0bccB3A80d1Ed41273552616E8"
      },
      {
        amount: "124196903303268866584525",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "124196903303268866584525",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x7d402c5CF587D4dEC6761C51E0aA903956495851",
          liqDepth: 117604.76640807859,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "RSR",
        decimals: 18,
        contract: "0x8762db106B2c2A0bccB3A80d1Ed41273552616E8",
        reserveBalance: "6632293907402537558746582",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/rsr.png",
          name: "RSR"
        },
        reserveFeed: {
          reserveAddress: "0x8762db106B2c2A0bccB3A80d1Ed41273552616E8",
          poolId: "0x7d402c5CF587D4dEC6761C51E0aA903956495851",
          costByNetworkUsd: 0.017732140349934696,
          liqDepth: 117604.76640807859,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "sBTCBNT",
      decimals: 18,
      contract: "0x63bc130401dc9f7F70203B01D1875d0D2779dc96",
      network: "ETH"
    },
    contract: "0xb39c206ec37B1aBCE8602c4f5EaafA99D3c10DDD",
    converterType: 1,
    fee: 0.002,
    id: "0x63bc130401dc9f7F70203B01D1875d0D2779dc96",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x63bc130401dc9f7F70203B01D1875d0D2779dc96",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "sBTC",
        decimals: 18,
        contract: "0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/sBTC.png",
          name: "sBTC"
        },
        reserveFeed: {
          reserveAddress: "0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6",
          poolId: "0x63bc130401dc9f7F70203B01D1875d0D2779dc96",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "SNXBNT",
      decimals: 18,
      contract: "0xAdAA88CA9913f2d6F8Caa0616Ff01eE8D4223fde",
      network: "ETH"
    },
    contract: "0xB2E1f4E30ceF322ac7a8E612AE2217ED00F7962A",
    converterType: 1,
    fee: 0.002,
    id: "0xAdAA88CA9913f2d6F8Caa0616Ff01eE8D4223fde",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xAdAA88CA9913f2d6F8Caa0616Ff01eE8D4223fde",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "SNX",
        decimals: 18,
        contract: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/snx.png",
          name: "SNX"
        },
        reserveFeed: {
          reserveAddress: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
          poolId: "0xAdAA88CA9913f2d6F8Caa0616Ff01eE8D4223fde",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "SRMBNT",
      decimals: 18,
      contract: "0x6cfd8b295D64d84178ad7447a5Bb4488bC846005",
      network: "ETH"
    },
    contract: "0x3BAbeA45ef298aD4935090365b7F8997F478a9dd",
    converterType: 1,
    fee: 0.002,
    id: "0x6cfd8b295D64d84178ad7447a5Bb4488bC846005",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1612093439",
        id: "0x476c5E26a75bd202a9683ffD34359C0CC15be0fF"
      },
      {
        amount: "1890074243703531389662",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1890074243703531389662",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x6cfd8b295D64d84178ad7447a5Bb4488bC846005",
          liqDepth: 1789.7526750880684,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "SRM",
        decimals: 6,
        contract: "0x476c5E26a75bd202a9683ffD34359C0CC15be0fF",
        reserveBalance: "1612093439",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/srm.png",
          name: "SRM"
        },
        reserveFeed: {
          reserveAddress: "0x476c5E26a75bd202a9683ffD34359C0CC15be0fF",
          poolId: "0x6cfd8b295D64d84178ad7447a5Bb4488bC846005",
          costByNetworkUsd: 1.1102040562848965,
          liqDepth: 1789.7526750880684,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "STAKEBNT",
      decimals: 18,
      contract: "0x5062743A788D271FA247C3dA7Cd5af73Fd687BA8",
      network: "ETH"
    },
    contract: "0x8D30d8184F0469C8a28a753fBf52CadeCE748110",
    converterType: 1,
    fee: 0.01,
    id: "0x5062743A788D271FA247C3dA7Cd5af73Fd687BA8",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "4388587218916654386144",
        id: "0x0Ae055097C6d159879521C384F1D2123D1f195e6"
      },
      {
        amount: "52847104340929361999434",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "52847104340929361999434",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x5062743A788D271FA247C3dA7Cd5af73Fd687BA8",
          liqDepth: 50042.07992354003,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "STAKE",
        decimals: 18,
        contract: "0x0Ae055097C6d159879521C384F1D2123D1f195e6",
        reserveBalance: "4388587218916654386144",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/stake.png",
          name: "STAKE"
        },
        reserveFeed: {
          reserveAddress: "0x0Ae055097C6d159879521C384F1D2123D1f195e6",
          poolId: "0x5062743A788D271FA247C3dA7Cd5af73Fd687BA8",
          costByNetworkUsd: 11.402776663031249,
          liqDepth: 50042.07992354003,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "sUSDBNT",
      decimals: 18,
      contract: "0xd2C9F2A62f9a1e80cD76392c02491212a2230cF4",
      network: "ETH"
    },
    contract: "0xa60B057673809956ae3cA9A0E0bc246efD4F8339",
    converterType: 1,
    fee: 0.002,
    id: "0xd2C9F2A62f9a1e80cD76392c02491212a2230cF4",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xd2C9F2A62f9a1e80cD76392c02491212a2230cF4",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "sUSD",
        decimals: 18,
        contract: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/susd.png",
          name: "sUSD"
        },
        reserveFeed: {
          reserveAddress: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
          poolId: "0xd2C9F2A62f9a1e80cD76392c02491212a2230cF4",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "SUSHIBNT",
      decimals: 18,
      contract: "0xB2145C7f9249d79197fe3cB87333187eB4FC1Eec",
      network: "ETH"
    },
    contract: "0x5820FdDC9Ae2a2b1F8cabdBF7266e0B36DB4E45A",
    converterType: 1,
    fee: 0.002,
    id: "0xB2145C7f9249d79197fe3cB87333187eB4FC1Eec",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xB2145C7f9249d79197fe3cB87333187eB4FC1Eec",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "SUSHI",
        decimals: 18,
        contract: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/sushi.png",
          name: "SUSHI"
        },
        reserveFeed: {
          reserveAddress: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
          poolId: "0xB2145C7f9249d79197fe3cB87333187eB4FC1Eec",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "SXPBNT",
      decimals: 18,
      contract: "0xa301Ad444e72F11590e3712bBb7aD0aC959b90C2",
      network: "ETH"
    },
    contract: "0x68eAe22C00Aa8D67ddeD72186354b773dDA03077",
    converterType: 1,
    fee: 0.002,
    id: "0xa301Ad444e72F11590e3712bBb7aD0aC959b90C2",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xa301Ad444e72F11590e3712bBb7aD0aC959b90C2",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "SXP",
        decimals: 18,
        contract: "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/sxp.png",
          name: "Swipe"
        },
        reserveFeed: {
          reserveAddress: "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9",
          poolId: "0xa301Ad444e72F11590e3712bBb7aD0aC959b90C2",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "UMABNT",
      decimals: 18,
      contract: "0x9Ca631b980DeC1eEba001BBfaC8da5A9e7d744fF",
      network: "ETH"
    },
    contract: "0x2dF5692aCc1E0Fec909870D05789B65C9B10b9a1",
    converterType: 1,
    fee: 0.002,
    id: "0x9Ca631b980DeC1eEba001BBfaC8da5A9e7d744fF",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x9Ca631b980DeC1eEba001BBfaC8da5A9e7d744fF",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "UMA",
        decimals: 18,
        contract: "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/uma.png",
          name: "UMA"
        },
        reserveFeed: {
          reserveAddress: "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
          poolId: "0x9Ca631b980DeC1eEba001BBfaC8da5A9e7d744fF",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "TOMOEBNT",
      decimals: 18,
      contract: "0x0dc75ECCcF5B784b793686e614C2E9dCdda63738",
      network: "ETH"
    },
    contract: "0x868a85285901f4a818CE2e094f2852087c502161",
    converterType: 1,
    fee: 0.002,
    id: "0x0dc75ECCcF5B784b793686e614C2E9dCdda63738",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x0dc75ECCcF5B784b793686e614C2E9dCdda63738",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "TOMOE",
        decimals: 18,
        contract: "0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/tomoe.png",
          name: "TOMOE"
        },
        reserveFeed: {
          reserveAddress: "0x05D3606d5c81EB9b7B18530995eC9B29da05FaBa",
          poolId: "0x0dc75ECCcF5B784b793686e614C2E9dCdda63738",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "UNIBNT",
      decimals: 18,
      contract: "0x8b3082e273E4B923830c637a203c1C1D963cA307",
      network: "ETH"
    },
    contract: "0x37cDEC400afaaD77278fbc34876e083B520B2D7a",
    converterType: 1,
    fee: 0.002,
    id: "0x8b3082e273E4B923830c637a203c1C1D963cA307",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x8b3082e273E4B923830c637a203c1C1D963cA307",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "UNI",
        decimals: 18,
        contract: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/uni.png",
          name: "UNI"
        },
        reserveFeed: {
          reserveAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
          poolId: "0x8b3082e273E4B923830c637a203c1C1D963cA307",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "wNXMBNT",
      decimals: 18,
      contract: "0x75aB5e15129BBBEcB5C5Fdb71d1ff7D5dA97d56c",
      network: "ETH"
    },
    contract: "0x99049F92Fb57a54E77be1e45E0E6b9Eb2fc5A2EB",
    converterType: 1,
    fee: 0.002,
    id: "0x75aB5e15129BBBEcB5C5Fdb71d1ff7D5dA97d56c",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "51104818562562247217",
        id: "0x0d438F3b5175Bebc262bF23753C1E53d03432bDE"
      },
      {
        amount: "1021850025077315900194",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1021850025077315900194",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x75aB5e15129BBBEcB5C5Fdb71d1ff7D5dA97d56c",
          liqDepth: 967.6121570427593,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "wNXM",
        decimals: 18,
        contract: "0x0d438F3b5175Bebc262bF23753C1E53d03432bDE",
        reserveBalance: "51104818562562247217",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/wnxm.png",
          name: "wNXM"
        },
        reserveFeed: {
          reserveAddress: "0x0d438F3b5175Bebc262bF23753C1E53d03432bDE",
          poolId: "0x75aB5e15129BBBEcB5C5Fdb71d1ff7D5dA97d56c",
          costByNetworkUsd: 18.933873248335942,
          liqDepth: 967.6121570427593,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "YFIBNT",
      decimals: 18,
      contract: "0xAeB3a1AeD77b5D6e3feBA0055d79176532e5cEb8",
      network: "ETH"
    },
    contract: "0x9258Af079065857C01466CebDCFA2CFB6AA4983C",
    converterType: 1,
    fee: 0.0035,
    id: "0xAeB3a1AeD77b5D6e3feBA0055d79176532e5cEb8",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "92189084696009180800",
        id: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e"
      },
      {
        amount: "2458518119124816146418636",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "2458518119124816146418636",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xAeB3a1AeD77b5D6e3feBA0055d79176532e5cEb8",
          liqDepth: 2328024.6239609164,
          costByNetworkUsd: 0.9469218900000002,
          priority: 10
        }
      },
      {
        symbol: "YFI",
        decimals: 18,
        contract: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
        reserveBalance: "92189084696009180800",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/yfi.png",
          name: "YFI"
        },
        reserveFeed: {
          reserveAddress: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
          poolId: "0xAeB3a1AeD77b5D6e3feBA0055d79176532e5cEb8",
          costByNetworkUsd: 25252.714371094036,
          liqDepth: 2328024.6239609164,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "LENDBNT",
      decimals: 18,
      contract: "0x020F8aCf2Dea7Ad1CF8413431e427F684181C6BA",
      network: "ETH"
    },
    contract: "0xD10591e2b47667AD9E543f780d5105E54Cc7C9D9",
    converterType: 1,
    fee: 0.002,
    id: "0x020F8aCf2Dea7Ad1CF8413431e427F684181C6BA",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x020F8aCf2Dea7Ad1CF8413431e427F684181C6BA",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "LEND",
        decimals: 18,
        contract: "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/ethlend_28.png",
          name: "EthLend"
        },
        reserveFeed: {
          reserveAddress: "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03",
          poolId: "0x020F8aCf2Dea7Ad1CF8413431e427F684181C6BA",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "USDCBNT",
      decimals: 18,
      contract: "0x874d8dE5b26c9D9f6aA8d7bab283F9A9c6f777f4",
      network: "ETH"
    },
    contract: "0x228F9EE87413a1BE69ef780eef2302b680d4863d",
    converterType: 1,
    fee: 0.003,
    id: "0x874d8dE5b26c9D9f6aA8d7bab283F9A9c6f777f4",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "4702145518194",
        id: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      },
      {
        amount: "4945227928460279520731497",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "4945227928460279520731497",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x874d8dE5b26c9D9f6aA8d7bab283F9A9c6f777f4",
          liqDepth: 4682744.576498392,
          costByNetworkUsd: 0.9469218899999999,
          priority: 10
        }
      },
      {
        symbol: "USDC",
        decimals: 6,
        contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        reserveBalance: "4702145518194",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/usdc.png",
          name: "USD Coin"
        },
        reserveFeed: {
          reserveAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          poolId: "0x874d8dE5b26c9D9f6aA8d7bab283F9A9c6f777f4",
          costByNetworkUsd: 0.9958740235450945,
          liqDepth: 4682744.576498392,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "BUFFGATEBNT",
      decimals: 18,
      contract: "0x2d35087923194400d329EE74b45CBc77b7d573Ff",
      network: "ETH"
    },
    contract: "0x112C5405d005F5e9C32eDB9A6B59E255B044126C",
    converterType: 1,
    fee: 0,
    id: "0x2d35087923194400d329EE74b45CBc77b7d573Ff",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x0B244e01B1B0C9a959b3b0Bc19E3852395319876" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x2d35087923194400d329EE74b45CBc77b7d573Ff",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "BUFFGATE",
        decimals: 4,
        contract: "0x0B244e01B1B0C9a959b3b0Bc19E3852395319876",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x0B244e01B1B0C9a959b3b0Bc19E3852395319876",
          poolId: "0x2d35087923194400d329EE74b45CBc77b7d573Ff",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "BUFFGATEUSDB",
      decimals: 18,
      contract: "0x37382ca45EFc45bd1A53649Ab98D3Fa337e56A2F",
      network: "ETH"
    },
    contract: "0xc11C56aa3cCb9c5065B2Be46Bbb50A83C5dC5012",
    converterType: 1,
    fee: 0.03,
    id: "0x37382ca45EFc45bd1A53649Ab98D3Fa337e56A2F",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "20999999999679643466",
        id: "0x309627af60F0926daa6041B8279484312f2bf060"
      },
      { amount: "840000", id: "0x0B244e01B1B0C9a959b3b0Bc19E3852395319876" }
    ],
    reserves: [
      {
        symbol: "USDB",
        decimals: 18,
        contract: "0x309627af60F0926daa6041B8279484312f2bf060",
        reserveBalance: "20999999999679643466",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/usdb.png",
          name: "Bancor USD"
        },
        reserveFeed: {
          reserveAddress: "0x309627af60F0926daa6041B8279484312f2bf060",
          poolId: "0x37382ca45EFc45bd1A53649Ab98D3Fa337e56A2F",
          liqDepth: 20.999999999679645,
          costByNetworkUsd: 1,
          priority: 10
        }
      },
      {
        symbol: "BUFFGATE",
        decimals: 4,
        contract: "0x0B244e01B1B0C9a959b3b0Bc19E3852395319876",
        reserveBalance: "840000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x0B244e01B1B0C9a959b3b0Bc19E3852395319876",
          poolId: "0x37382ca45EFc45bd1A53649Ab98D3Fa337e56A2F",
          costByNetworkUsd: 0.24999999999618625,
          liqDepth: 20.999999999679645,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "BNTFTT",
      decimals: 18,
      contract: "0xD9c195c9E1C49e86C7A0F0E29627CB8F8523A7fb",
      network: "ETH"
    },
    contract: "0xB20814d5cc0D723fefaad3BB9d74a2d90B3165D3",
    converterType: 1,
    fee: 0.002,
    id: "0xD9c195c9E1C49e86C7A0F0E29627CB8F8523A7fb",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x2AEC18c5500f21359CE1BEA5Dc1777344dF4C0Dc" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xD9c195c9E1C49e86C7A0F0E29627CB8F8523A7fb",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "FTT",
        decimals: 18,
        contract: "0x2AEC18c5500f21359CE1BEA5Dc1777344dF4C0Dc",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/farmatrust_28.png",
          name: "FarmaTrust Token"
        },
        reserveFeed: {
          reserveAddress: "0x2AEC18c5500f21359CE1BEA5Dc1777344dF4C0Dc",
          poolId: "0xD9c195c9E1C49e86C7A0F0E29627CB8F8523A7fb",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "AAVEBNT",
      decimals: 18,
      contract: "0x6c84F4ccC916ACf792538f1293b286b540906A2a",
      network: "ETH"
    },
    contract: "0x52056B47F604216cf99782788922460F4E8E8c71",
    converterType: 1,
    fee: 0.002,
    id: "0x6c84F4ccC916ACf792538f1293b286b540906A2a",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9" },
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0x6c84F4ccC916ACf792538f1293b286b540906A2a",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "AAVE",
        decimals: 18,
        contract: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        },
        reserveFeed: {
          reserveAddress: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
          poolId: "0x6c84F4ccC916ACf792538f1293b286b540906A2a",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "JRT90BNT10",
      decimals: 18,
      contract: "0xE274C0cCf7B0bC1eF29FFf9AD5eC98E9B5c45e84",
      network: "ETH"
    },
    contract: "0x25F98800cd9d3FeEF2031d1C0b3FD1f7Cb83E4FF",
    converterType: 1,
    fee: 0.001,
    id: "0xE274C0cCf7B0bC1eF29FFf9AD5eC98E9B5c45e84",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "1089690436873531180587",
        id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      },
      {
        amount: "152313083709064109079331",
        id: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A"
      }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "1089690436873531180587",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xE274C0cCf7B0bC1eF29FFf9AD5eC98E9B5c45e84",
          liqDepth: 1031.8517279992097,
          costByNetworkUsd: 0.94692189,
          priority: 10
        }
      },
      {
        symbol: "JRT",
        decimals: 18,
        contract: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A",
        reserveBalance: "152313083709064109079331",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/jarvis_28.png",
          name: "Jarvis Reward Token"
        },
        reserveFeed: {
          reserveAddress: "0x8A9C67fee641579dEbA04928c4BC45F66e26343A",
          poolId: "0xE274C0cCf7B0bC1eF29FFf9AD5eC98E9B5c45e84",
          costByNetworkUsd: 0.006774544266795674,
          liqDepth: 1031.8517279992097,
          priority: 10
        }
      }
    ],
    version: "41"
  },
  {
    anchor: {
      symbol: "BNTvBNT",
      decimals: 18,
      contract: "0xBA04e539da9e7a6491A6c6ae38D9750226a3D36b",
      network: "ETH"
    },
    contract: "0x8c3FBcfCB0f63eDdeD00b87C93B824DB86aa1D59",
    converterType: 1,
    fee: 0,
    id: "0xBA04e539da9e7a6491A6c6ae38D9750226a3D36b",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C" },
      { amount: "0", id: "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94" }
    ],
    reserves: [
      {
        symbol: "BNT",
        decimals: 18,
        contract: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          name: "Bancor"
        },
        reserveFeed: {
          reserveAddress: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
          poolId: "0xBA04e539da9e7a6491A6c6ae38D9750226a3D36b",
          liqDepth: 0,
          costByNetworkUsd: 0,
          priority: 10
        }
      },
      {
        symbol: "vBNT",
        decimals: 18,
        contract: "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo:
            "https://raw.githubusercontent.com/Velua/eth-tokens-registry/master/logos/vBNT.png",
          name: "vBNT"
        },
        reserveFeed: {
          reserveAddress: "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94",
          poolId: "0xBA04e539da9e7a6491A6c6ae38D9750226a3D36b",
          costByNetworkUsd: "__vue_devtool_nan__",
          liqDepth: 0,
          priority: 10
        }
      }
    ],
    version: "42"
  },
  {
    anchor: {
      symbol: "AURELIO",
      decimals: 18,
      contract: "0x0aacA86e54Fe70eDd7c86cBF3cFb470caA49FAeF",
      network: "ETH"
    },
    contract: "0x6cba561bB35919597531d9cF6720A48867fdA8c9",
    converterType: 1,
    fee: 0.003,
    id: "0x0aacA86e54Fe70eDd7c86cBF3cFb470caA49FAeF",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "43613771613027395",
        id: "0x261EfCdD24CeA98652B9700800a13DfBca4103fF"
      },
      { amount: "1446413709", id: "0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF" }
    ],
    reserves: [
      {
        symbol: "sXAU",
        decimals: 18,
        contract: "0x261EfCdD24CeA98652B9700800a13DfBca4103fF",
        reserveBalance: "43613771613027395",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        }
      },
      {
        symbol: "DGX",
        decimals: 9,
        contract: "0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF",
        reserveBalance: "1446413709",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://etherscan.io/token/images/digix_dgx_28.png",
          name: "Digix Gold Token"
        }
      }
    ],
    version: "26"
  },
  {
    anchor: {
      symbol: "EMIT1USDB2FCO",
      decimals: 18,
      contract: "0x2a3a6596B35735EfaC3577dC36bF750bfe5888e8",
      network: "ETH"
    },
    contract: "0x554A544F2A21e5E13E42de5BCdDca6962ec2a478",
    converterType: 1,
    fee: 0.03,
    id: "0x2a3a6596B35735EfaC3577dC36bF750bfe5888e8",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      {
        amount: "30000000000000000000",
        id: "0x37Be876EF051eB8EDdD0745107c5222D8CA8EC60"
      },
      {
        amount: "30000000000000000000",
        id: "0xEE4dC4C5Ca843B83035d8E5159AC1bd1b4EbdfF5"
      }
    ],
    reserves: [
      {
        symbol: "EMIT1USDB",
        decimals: 18,
        contract: "0x37Be876EF051eB8EDdD0745107c5222D8CA8EC60",
        reserveBalance: "30000000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        }
      },
      {
        symbol: "FCO",
        decimals: 18,
        contract: "0xEE4dC4C5Ca843B83035d8E5159AC1bd1b4EbdfF5",
        reserveBalance: "30000000000000000000",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        }
      }
    ],
    version: "27"
  },
  {
    anchor: {
      symbol: "CAPCCAPg",
      decimals: 18,
      contract: "0x1f3fb50488124EB0d5Cf0d2b22CA7c8ed00e2344",
      network: "ETH"
    },
    contract: "0x8f22D68c4F39d750A53fD51F4D8A03d8A2F25b03",
    converterType: 1,
    fee: 0.005,
    id: "0x1f3fb50488124EB0d5Cf0d2b22CA7c8ed00e2344",
    isMultiContract: false,
    network: "ETH",
    reserveBalances: [
      { amount: "0", id: "0x79A91cCaaa6069A571f0a3FA6eD257796Ddd0eB4" },
      { amount: "0", id: "0x107721d9aA07d9DE8f2CC9545e0C9346A9Bb503b" }
    ],
    reserves: [
      {
        symbol: "CAPC",
        decimals: 18,
        contract: "0x79A91cCaaa6069A571f0a3FA6eD257796Ddd0eB4",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        }
      },
      {
        symbol: "CAPg",
        decimals: 18,
        contract: "0x107721d9aA07d9DE8f2CC9545e0C9346A9Bb503b",
        reserveBalance: "0",
        reserveWeight: 0.5,
        network: "ETH",
        meta: {
          logo: "https://ropsten.etherscan.io/images/main/empty-token.png"
        }
      }
    ],
    version: "31"
  }
];

const newStaticRelays: StaticRelay[] = moreStaticRelays.map(relay => {


  const reserveTokens = relay.reserves;
  const newReserveTokens = reserveTokens.map(token => {
    const relayContaining = relaysDump.find(relay => relay.reserves.some(reserve => compareString(reserve.contract, token)));
    return relayContaining.reserves.find(reserve => compareString(reserve.contract, token))
  })

  return ({ ...relay, reserves: newReserveTokens })
})

// update static relays to have the reserve tokens included as well
// this prevents a race condition on the token meta screwing things up 
// probably use the filter function more often too 
// hard to cache balances but is somewhat do-able should it remain
// contained in the thingy. 

console.log(newStaticRelays, 'mine now');

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
