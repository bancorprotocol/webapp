import Vue from "vue";
import Vuex from "vuex";

import { createProxy, extractVuexModule } from "vuex-class-component";
import { GeneralModule } from "./modules/general";
import { EosTransitModule } from "./modules/wallet/eosWallet";
import { EthereumModule } from "./modules/wallet/ethWallet";
import { EosBancorModule } from "./modules/swap/eosBancor";
import { EthBancorModule } from "./modules/swap/ethBancor";
import { BancorModule } from "./modules/swap/index";
import { WalletModule } from "./modules/wallet/index";
import { NetworkModule } from "./modules/network/index";
import { EosNetworkModule } from "./modules/network/eosNetwork";
import { EthereumGovernance } from "./modules/governance/ethGovernance";
import { MintingModule } from "./modules/minting/minting";
import { RewardsModule } from "./modules/rewards";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(EosBancorModule),
    ...extractVuexModule(EthBancorModule),
    ...extractVuexModule(GeneralModule),
    ...extractVuexModule(EosTransitModule),
    ...extractVuexModule(EthereumModule),
    ...extractVuexModule(BancorModule),
    ...extractVuexModule(WalletModule),
    ...extractVuexModule(NetworkModule),
    ...extractVuexModule(EosNetworkModule),
    ...extractVuexModule(EthereumGovernance),
    ...extractVuexModule(MintingModule),
    ...extractVuexModule(RewardsModule)
  },
  strict: process.env.NODE_ENV !== "production"
});

export const vxm = {
  general: createProxy(store, GeneralModule),
  wallet: createProxy(store, WalletModule),
  eosWallet: createProxy(store, EosTransitModule),
  ethWallet: createProxy(store, EthereumModule),
  eosBancor: createProxy(store, EosBancorModule),
  ethBancor: createProxy(store, EthBancorModule),
  bancor: createProxy(store, BancorModule),
  eosNetwork: createProxy(store, EosNetworkModule),
  network: createProxy(store, NetworkModule),
  ethGovernance: createProxy(store, EthereumGovernance),
  minting: createProxy(store, MintingModule),
  rewards: createProxy(store, RewardsModule)
};
