import { DryRelay } from "@/api/eos/eosBancorCalc";
import { Sym } from "eos-common";

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
