<template>
  <div>
    <div
      class="d-block mb-0 py-2 bg-primary text-white text-center font-size-12 font-w600"
    >
      This interface is in beta. Use it at your own risk.
    </div>
    <b-navbar class="navBar">
      <div class="d-flex justify-content-between container-xl">
        <b-navbar-brand class="pb-1" style="width: 250px">
          <router-link
            :to="{ name: 'Swap', params: { service: selectedNetwork } }"
          >
            <img
              v-if="darkMode"
              src="@/assets/media/logos/bancor-white2.png"
              height="35px"
              class="mb-1"
            />
            <img
              v-else
              src="@/assets/media/logos/bancor-black2.png"
              height="35px"
              class="mb-1"
            />
          </router-link>
        </b-navbar-brand>

        <div class="d-flex justify-content-end" style="width: 250px">
          <b-navbar-nav class="mr-2">
            <b-btn
              v-if="showLogin"
              @click="loginAction"
              variant="white"
              class="block-rounded"
              size="sm"
              v-b-tooltip.hover
              :title="loginTooltip"
            >
              <span class="d-none d-sm-inline mr-2">{{
                loginButtonLabel
              }}</span>
              <font-awesome-icon :icon="icon" :pulse="spin" fixed-width />
            </b-btn>
          </b-navbar-nav>
          <b-navbar-nav class="mr-2">
            <settings-menu :show-tx="showLogin" />
          </b-navbar-nav>
          <b-navbar-nav>
            <bancor-menu />
          </b-navbar-nav>
        </div>
      </div>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import SettingsMenu from "@/components/layout/SettingsMenu.vue";
import BancorMenu from "@/components/layout/BancorMenu.vue";
import { shortenEthAddress } from "@/api/helpers";

@Component({
  components: { BancorMenu, SettingsMenu }
})
export default class Navigation extends Vue {
  get selectedNetwork() {
    return vxm.bancor.currentNetwork;
  }

  get selectedWallet() {
    return vxm.wallet.currentWallet;
  }

  get selected() {
    return this.selectedNetwork;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  get showLogin() {
    return !this.$route.fullPath.includes("data");
  }

  created() {
    vxm.ethWallet.checkAlreadySignedIn();
  }

  @Watch("isAuthenticated")
  onAuthentication(account: string) {
    if (account) {
      vxm.bancor.refreshBalances();
      // @ts-ignore
      // this.$analytics.setUserId(account);
      // @ts-ignore
      // this.$analytics.logEvent("login", { account });
    }
  }

  get language() {
    return vxm.general.language;
  }

  get loginTooltip() {
    return this.selected == "eth" && vxm.ethWallet.isAuthenticated
      ? "Logout via wallet"
      : "";
  }

  set language(lang: string) {
    vxm.general.setLanguage(lang);
  }

  get loginStatus() {
    return vxm.eosWallet.loginStatus;
  }

  get shortenedEthAddress() {
    const isAuthenticated = vxm.ethWallet.isAuthenticated;
    return isAuthenticated.length > 13
      ? shortenEthAddress(isAuthenticated)
      : isAuthenticated;
  }

  get loginButtonLabel() {
    if (this.selectedWallet == "eos") {
      return this.loginStatus[0];
    } else {
      const isAuthenticated = vxm.ethWallet.isAuthenticated;
      if (isAuthenticated) {
        return this.shortenedEthAddress;
      } else return "Connect Wallet";
    }
  }

  get icon() {
    if (this.selectedWallet == "eos") {
      return this.loginStatus[1];
    } else {
      return vxm.ethWallet.isAuthenticated ? "power-off" : "arrow-circle-right";
    }
  }

  get spin() {
    return this.loginStatus[2];
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
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
    if (vxm.ethWallet.isAuthenticated) {
      // Cannot logout of MetaMask
    } else {
      await vxm.ethWallet.connect();
    }
  }

  async loginAction() {
    const wallet = this.selectedWallet;
    if (wallet == "eos") await this.loginActionEos();
    else await this.loginActionEth();
  }
}
</script>

<style>
.navItem {
  margin: 2px 2px;
}

#form-group {
  margin-bottom: unset;
}

@media (max-width: 768px) {
  .networks {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .login {
    margin-top: 15px;
  }
}

.features {
  flex-grow: 2;
  flex-basis: auto;
  display: flex;
  justify-content: center;
}

.spacer {
  display: hidden;
  flex-grow: 1;
}

.networks {
  flex-grow: 1;
  flex-basis: auto;
  display: flex;
  justify-content: center;
}

.big {
  width: 100%;
  display: flex;
  justify-content: center;
}

label.active {
  color: black !important;
}
</style>
