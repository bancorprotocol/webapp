<template>
  <div class="container-xl px-0">
    <div id="navigation-top" class="d-flex justify-content-end">
      <b-alert
        class="alert-network"
        variant="danger"
        dismissible
        fade
        :show="showAlert"
      >
        <font-awesome-icon
          icon="exclamation-triangle"
          class="text-danger ml-1 mr-1"
          size="1x"
        />
        Unsupported Network. Switch to mainnet network to use the app!
      </b-alert>
      <b-btn
        @click="loginAction"
        variant="white"
        class="block-rounded"
        size="sm"
      >
        <span class="d-none d-sm-inline mr-2">{{ loginButtonLabel }}</span>
        <font-awesome-icon :icon="icon" :pulse="spin" fixed-width />
      </b-btn>
      <settings-menu />
      <bancor-menu />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import SettingsMenu from "@/components/layout/SettingsMenu.vue";
import BancorMenu from "@/components/layout/BancorMenu.vue";
import { onboard, shortenEthAddress } from "@/api/helpers";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: { BancorMenu, SettingsMenu }
})
export default class Navigation extends BaseComponent {
  get selectedWallet() {
    return vxm.wallet.currentWallet;
  }

  get showAlert() {
    return !vxm.ethBancor.isSupportedNetwork;
  }

  created() {
    vxm.ethWallet.checkAlreadySignedIn();
  }

  @Watch("currentUser")
  onAuthentication(account: string) {
    if (account) {
      vxm.bancor.refreshBalances();
    }
  }

  get loginStatus() {
    return vxm.eosWallet.loginStatus;
  }

  get shortenedEthAddress() {
    const currentUser = vxm.ethWallet.currentUser;
    return currentUser.length > 13
      ? shortenEthAddress(currentUser)
      : currentUser;
  }

  get loginButtonLabel() {
    if (this.selectedWallet == "eos") {
      return this.loginStatus[0];
    } else {
      const currentUser = vxm.ethWallet.currentUser;
      if (currentUser) {
        return this.shortenedEthAddress;
      } else return "Connect Wallet";
    }
  }

  get icon() {
    if (this.selectedWallet == "eos") {
      return this.loginStatus[1];
    } else {
      return vxm.ethWallet.currentUser ? "power-off" : "arrow-circle-right";
    }
  }

  get spin() {
    return this.loginStatus[2];
  }

  async loginActionEos() {
    const status = this.loginButtonLabel;
    if (status === "Connect Wallet") {
      this.$bvModal.show("modal-login");
    } else if (
      status !== "Authenticating" &&
      status !== "Connecting" &&
      status !== "Fetching"
    ) {
      vxm.eosWallet.logout();
    }
  }

  async loginActionEth() {
    if (vxm.ethWallet.currentUser) {
      onboard.walletReset();
    } else {
      await vxm.ethWallet.connect();
    }
  }

  async loginAction() {
    const wallet = this.selectedWallet;
    if (wallet === "eos") await this.loginActionEos();
    else await this.loginActionEth();
  }
}
</script>

<style lang="scss">
#navigation-top {
  margin: 1rem 0;

  & > * {
    margin-left: 0.75rem;
  }

  .alert-network {
    width: 420px;
    background: #fff;
    border: 1px solid #ff4e37;
    border-radius: 8px;
    padding: 7px;
    padding-right: 15px;
    color: #ff4e37;
    font-size: 0.7rem;

    .close {
      width: 25px;
      margin-left: 10px;
      line-height: 6px;
    }
  }
}
</style>
