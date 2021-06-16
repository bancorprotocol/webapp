<template>
  <div class="container-xl px-0">
    <div id="navigation-top" class="d-flex justify-content-end">
      <b-btn
        @click="loginAction"
        :variant="darkMode ? 'outline-dark' : 'outline-light'"
        class="block-rounded"
        size="sm"
      >
        <span class="d-none d-sm-inline mr-2">{{ loginButtonLabel }}</span>
        <font-awesome-icon :icon="icon" :pulse="spin" fixed-width />
      </b-btn>
      <Notifications />
      <settings-menu @showLocaleModal="showLocaleMod" />
      <bancor-menu />
    </div>
    <modal-language-change v-model="modal" />
  </div>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import { i18n } from "@/i18n";
import SettingsMenu from "@/components/layout/SettingsMenu.vue";
import BancorMenu from "@/components/layout/BancorMenu.vue";
import { onboard, shortenEthAddress } from "@/api/helpers";
import BaseComponent from "@/components/BaseComponent.vue";
import Notifications from "@/components/compositions/notifications/Notifications.vue";
import ModalLanguageChange from "@/components/modals/ModalLanguageChange.vue";
import { onLogout$ } from "@/api/observables/auth";

@Component({
  components: { BancorMenu, SettingsMenu, Notifications, ModalLanguageChange }
})
export default class Navigation extends BaseComponent {
  modal: boolean = false;

  get selectedWallet() {
    return vxm.wallet.currentWallet;
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

  showLocaleMod() {
    this.modal = true;
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
      } else return i18n.t("connect_wallet");
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
    if (status === i18n.t("connect_wallet")) {
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
      localStorage.removeItem("SELECTED_WEB3_WALLET");
      onLogout$.subscribe(() => console.log("Debug onLogout subscription"));
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
  margin-top: 0.2rem;
  margin-bottom: 0.6rem;

  & > * {
    margin-left: 0.75rem;
  }
}
</style>
