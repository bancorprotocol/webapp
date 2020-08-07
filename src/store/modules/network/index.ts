import { createModule, action } from "vuex-class-component";
import {
  GetBalanceParam,
  TokenBalanceReturn,
  TransferParam
} from "@/types/bancor";
import { vxm } from "@/store";
import { store } from "../../../store";

const VuexModule = createModule({
  strict: false
});

export class NetworkModule extends VuexModule.With({ namespaced: "network/" }) {
  chains = ["eos", "eth"];

  get currentNetwork() {
    // @ts-ignore
    if (
      // @ts-ignore
      store.state.routeModule &&
      // @ts-ignore
      store.state.routeModule.params &&
      // @ts-ignore
      store.state.routeModule.params.service
    ) {
      // @ts-ignore
      return store.state.routeModule.params.service;
    } else {
      return "eth";
    }
  }

  get balances() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Network`]["balances"];
  }

  get balance() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Network`]["balance"];
  }

  get networkId() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Network`]["networkId"];
  }

  get protocol() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Network`]["protocol"];
  }

  @action async resetBalances() {
    return this.$store.dispatch(`eosNetwork/resetBalances`, null, {
      root: true
    });
  }

  @action async transfer(params: TransferParam): Promise<void> {
    return this.dispatcher(["transfer", params]);
  }

  @action async getBalances(
    params: GetBalanceParam
  ): Promise<TokenBalanceReturn[]> {
    return this.dispatcher(["getBalances", params]);
  }

  @action async dispatcher([methodName, params]: [string, any?]) {
    return this.$store.dispatch(
      `${this.currentNetwork}Network/${methodName}`,
      params,
      { root: true }
    );
  }
}
