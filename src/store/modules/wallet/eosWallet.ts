import { createModule, mutation, action } from "vuex-class-component";

import {
  initAccessContext,
  WalletProvider,
  Wallet,
  WalletState
} from "eos-transit";
import scatter from "eos-transit-scatter-provider";
import lynx from "eos-transit-lynx-provider";
import ledger from "eos-transit-ledger-provider";
import tp from "eos-transit-tokenpocket-provider";
import meetone from "eos-transit-meetone-provider";
import whalevault from "eos-transit-whalevault-provider";
import keycat from "eos-transit-keycat-provider";
import anchor from "eos-transit-anchorlink-provider";
import { vxm } from "@/store";

interface EosWalletAction {
  name: string;
  data: any;
  authorization?: {
    actor: string;
    permission: string;
  }[];
  account: string;
}

const appName = "Bancor";

const VuexModule = createModule({
  strict: false
});

export class EosTransitModule extends VuexModule.With({
  namespaced: "eosWallet/"
}) {
  accessContext = initAccessContext({
    appName,
    network: {
      host: "eos.greymass.com",
      port: 443,
      protocol: "https",
      chainId:
        "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
    },
    walletProviders: [
      scatter(),
      anchor(appName),
      lynx(),
      ledger(),
      tp(),
      meetone(),
      whalevault(),
      keycat()
    ]
  });
  isMobile = false;

  walletProviders: WalletProvider[] = this.accessContext.getWalletProviders();

  selectedProvider: WalletProvider | "" = "";

  wallet: Wallet | false = false;
  walletState: WalletState | false = false;

  get loginStatus() {
    const login = ["Connect Wallet", "arrow-circle-right", false];
    if (!this.wallet && !this.walletState) return login;
    else if (this.walletState && this.walletState.authenticating)
      return ["Authenticating", "spinner", true];
    else if (this.walletState && this.walletState.connecting)
      return ["Connecting", "spinner", true];
    else if (this.walletState && this.walletState.accountFetching)
      return ["Fetching", "spinner", true];
    else if (this.wallet && this.wallet.auth) {
      return [this.wallet.auth.accountName, "power-off", false];
    } else return login;
  }

  get currentUser(): string | false {
    // @ts-ignore
    return this.wallet && this.wallet.auth && this.wallet.auth.accountName;
  }

  @action async checkDevice() {
    const width = window.innerWidth;
    this.setIsMobile(width <= 768);
  }

  @mutation setIsMobile(isMobile: boolean) {
    this.isMobile = isMobile;
  }

  @action async tx(actions: EosWalletAction[]) {
    const authIncluded = actions.every(
      (action: EosWalletAction) => action.authorization
    );

    const builtActions = authIncluded
      ? actions
      : actions.map((action: any) => ({
          ...action,
          authorization: [
            {
              // @ts-ignore
              actor: this.wallet.auth.accountName,
              // @ts-ignore
              permission: this.wallet.auth.permission
            }
          ]
        }));
    try {
      // @ts-ignore
      return await this.wallet.eosApi.transact(
        {
          actions: builtActions
        },
        {
          broadcast: true,
          blocksBehind: 3,
          expireSeconds: 60
        }
      );
    } catch (e) {
      if (e.message == "Unexpected end of JSON input")
        // @ts-ignore
        return await this.wallet.eosApi.transact(
          {
            actions: builtActions
          },
          {
            broadcast: true,
            blocksBehind: 3,
            expireSeconds: 60
          }
        );
      throw new Error(e.message);
    }
  }

  @action async initLogin(provider: WalletProvider) {
    this.setProvider(provider);
    this.checkDevice();

    const wallet = this.accessContext.initWallet(provider);

    wallet.subscribe((walletState: any) => {
      if (walletState) this.setWalletState(walletState);
    });

    try {
      await wallet.connect();
      try {
        await wallet.login();
        this.setWallet(wallet);
        localStorage.setItem("autoLogin", provider.id);
        vxm.eosBancor.onAuthChange(
          wallet && wallet.auth! && wallet.auth!.accountName!
        );
      } catch (e) {
        console.error("auth error");
        throw e;
      }
    } catch (e) {
      console.error("connection error");
      throw e;
    }
  }

  @action async logout() {
    if (this.wallet) {
      this.wallet.logout();
      this.setWallet(false);
      this.setWalletState(false);
      localStorage.removeItem("autoLogin");
      vxm.network.resetBalances();
    }
  }

  @mutation setProvider(provider: WalletProvider) {
    this.selectedProvider = provider;
  }

  @mutation setWallet(wallet: Wallet | false) {
    this.wallet = wallet;
  }

  @mutation setWalletState(state: WalletState | false) {
    this.walletState = state;
  }
}
