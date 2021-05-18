import { createModule, mutation, action } from "vuex-class-component";
import { compareString, onboard, selectedWeb3Wallet } from "@/api/helpers";
import { ABISmartToken, ethReserveAddress } from "@/api/eth/ethAbis";
import { EthAddress } from "@/types/bancor";
import { fromWei, isAddress, toHex, toWei } from "web3-utils";
import { shrinkToken } from "@/api/eth/helpers";
import { vxm } from "@/store";
import { EthNetworks, getWeb3, Provider, web3 } from "@/api/web3";
import {
  sendConversionEvent,
  googleTagManager,
  sendWalletEvent,
  WalletEvents
} from "@/gtm";

const tx = (data: any) =>
  new Promise((resolve, reject) => {
    web3.eth
      .sendTransaction(data)
      .on("transactionHash", hash => {
        resolve(hash);
      })
      .on("receipt", (receipt: any) => {})
      .on("error", error => reject(error));
  });

const VuexModule = createModule({
  strict: false
});

export class EthereumModule extends VuexModule.With({
  namespaced: "ethWallet/"
}) {
  loggedInAccount: string = "";
  currentNetwork: EthNetworks = EthNetworks.Mainnet;

  @mutation setLoggedInAccount(account: string) {
    this.loggedInAccount = account;
  }

  get currentUser() {
    return this.loggedInAccount;
  }

  get ethereum() {
    // @ts-ignore
    return window["ethereum"];
  }

  @mutation setNetwork(network: EthNetworks) {
    this.currentNetwork = network;
  }

  @action async onNetworkChange(network: EthNetworks) {
    if (network !== this.currentNetwork) {
      this.setNetwork(network);
      vxm.ethBancor.onNetworkChange(network);
    }
  }

  @action async logout() {
    console.warn("Client cannot logout by itself, log out via MetaMask.");
  }

  @action async connect() {
    try {
      sendWalletEvent(WalletEvents.popup);
      await onboard.walletSelect();
      const state = onboard.getState();
      sendWalletEvent(WalletEvents.click, {
        wallet_name: state.wallet.name
      });
      await onboard.walletCheck();
      sendWalletEvent(
        WalletEvents.connect,
        undefined,
        state.address,
        state.wallet.name ?? ""
      );
    } catch (e) {
      console.error(e, "was the error");
      throw new Error(`error: ${e}`);
    }
  }

  @action async nativeBalanceChange(nativeBalance: string) {
    if (nativeBalance)
      vxm.ethBancor.updateUserBalances([
        { balance: fromWei(nativeBalance), id: ethReserveAddress }
      ]);
  }

  @action async checkAlreadySignedIn() {
    const previouslySelectedWallet = localStorage.getItem(selectedWeb3Wallet);

    googleTagManager(this.loggedInAccount, previouslySelectedWallet);

    if (previouslySelectedWallet) {
      await onboard.walletSelect(previouslySelectedWallet);
    }
  }

  @action async getBalance({
    accountHolder,
    tokenContractAddress,
    keepWei = false
  }: {
    accountHolder: EthAddress;
    tokenContractAddress: EthAddress;
    keepWei?: boolean;
  }): Promise<string> {
    if (!accountHolder || !tokenContractAddress)
      throw new Error(
        "Cannot get balance without both the account holder and token contract address"
      );
    const web3View = getWeb3(this.currentNetwork, Provider.Alchemy);

    if (
      compareString(
        tokenContractAddress,
        "0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315"
      ) ||
      compareString(tokenContractAddress, ethReserveAddress)
    ) {
      const weiBalance = await web3View.eth.getBalance(accountHolder);
      return fromWei(weiBalance);
    } else {
      if (!tokenContractAddress)
        throw new Error("tokenContractAddress is falsy");

      const tokenContract = new web3View.eth.Contract(
        ABISmartToken,
        tokenContractAddress
      );

      const [decimals, weiBalance] = await Promise.all([
        tokenContract.methods.decimals().call() as string,
        tokenContract.methods.balanceOf(accountHolder).call() as string
      ]);
      if (keepWei) return weiBalance;
      return shrinkToken(weiBalance, Number(decimals));
    }
  }

  @action async tx(params: any) {
    return tx(params);
  }

  @action async transfer({
    floatAmount,
    recipient
  }: {
    floatAmount: string;
    recipient: string;
  }) {
    if (!floatAmount) throw new Error("Float Amount required.");
    if (!isAddress(recipient))
      throw new Error("Recipient must be valid ETH address");
    const weiAmount = toWei(floatAmount);
    const value = toHex(weiAmount);
    const params = [
      {
        from: this.currentUser,
        to: recipient,
        value
      }
    ];
    return this.tx(params);
  }
}
