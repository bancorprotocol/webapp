import { createModule, action, mutation } from "vuex-class-component";
import { vxm, store } from "@/store";

const VuexModule = createModule({
  strict: false
});

export class WalletModule extends VuexModule.With({ namespaced: "wallet/" }) {
  user = "";

  get currentWallet() {
    return vxm.bancor.wallet;
  }

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

  get currentUser() {
    return this.user;
    // @ts-ignore
    return vxm[`${vxm.bancor.wallet}Wallet`].currentUser;
  }

  @mutation setUser(user: string) {
    this.user = user;
  }

  @action async dispatcher(methodName: string, params: any = null) {
    return params
      ? this.$store.dispatch(`${this.currentWallet}/${methodName}`, params)
      : this.$store.dispatch(`${this.currentWallet}/${methodName}`);
  }

  @action async tx(actions: any[]) {
    return this.dispatcher("tx", actions);
  }

  @action async initLogin() {
    return this.dispatcher("initLogin");
  }

  @action async logout() {
    return this.dispatcher("logout");
  }
}
