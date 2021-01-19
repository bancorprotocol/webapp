<template>
  <b-modal
    id="modal-login"
    :content-class="darkMode ? 'bg-block-dark' : 'bg-block-light'"
    size="md"
    centered
    hide-footer
    hide-header-close
    scrollable
  >
    <template slot="modal-header">
      <h5 :class="darkMode ? 'text-body-dark' : 'text-body-light'" class="m-0">
        {{ $t("select_wallet") }}
      </h5>
      <font-awesome-icon
        icon="times"
        @click="$bvModal.hide('modal-login')"
        class="cursor"
        :class="darkMode ? 'text-body-dark' : 'text-body-light'"
      />
    </template>
    <transition name="slide-fade" mode="out-in">
      <b-row v-if="!loading && !error" key="select">
        <b-col
          sm="6"
          v-for="(provider, index) in walletProviders"
          :key="provider.id"
          class="my-3"
        >
          <div
            @click="initLogin(provider)"
            class="cursor d-flex align-items-center"
            :class="index % 2 ? '' : 'flex-sm-row-reverse'"
          >
            <img
              class="img-avatar img-avatar48 mr-3 mr-sm-0"
              :class="index % 2 ? 'mr-sm-3' : 'ml-sm-3'"
              :src="
                require('@/assets/media/logos/' + providerLogoUrl(provider))
              "
              :alt="$t('provider_logo')"
            />
            <h5
              class="m-0 p-0"
              :class="darkMode ? 'text-body-dark' : 'text-body-light'"
            >
              {{ provider.meta.name }}
            </h5>
          </div>
        </b-col>
      </b-row>
      <b-row v-else-if="error" key="error">
        <b-col class="text-center">
          <div class="cursor d-flex justify-content-center align-items-center">
            <img
              class="img-avatar img-avatar48 mr-3"
              :src="
                require('@/assets/media/logos/' +
                  providerLogoUrl(selectedProvider))
              "
              :alt="$t('provider_logo')"
            />
            <h5
              class="m-0 p-0"
              :class="darkMode ? 'text-body-dark' : 'text-body-light'"
            >
              {{ selectedProvider.meta.name }}
            </h5>
          </div>
          <h3 class="mt-5 text-danger text-center">
            <font-awesome-icon icon="exclamation-circle" class="mr-2" />
            {{ $t("cnnection_error") }}
          </h3>
          <p :class="darkMode ? 'text-body-dark' : 'text-body-light'">
            {{ error.message ? error.message : error }}
          </p>
          <b-btn
            @click="error = false"
            size="lg"
            variant="primary"
            class="btn-block block-rounded"
          >
            {{ $t("try_again") }}</b-btn
          >
        </b-col>
      </b-row>
      <b-row v-else key="loading">
        <b-col class="text-center">
          <div class="cursor d-flex justify-content-center align-items-center">
            <img
              class="img-avatar img-avatar48 mr-3"
              :src="
                require('@/assets/media/logos/' +
                  providerLogoUrl(selectedProvider))
              "
              :alt="$t('provider_logo')"
            />
            <h5
              class="m-0 p-0"
              :class="darkMode ? 'text-body-dark' : 'text-body-light'"
            >
              {{ selectedProvider.meta.name }}
            </h5>
          </div>
          <h3
            class="mt-5 text-center"
            :class="darkMode ? 'text-body-dark' : 'text-body-light'"
          >
            <font-awesome-icon
              icon="circle-notch"
              class="text-primary mr-3"
              spin
            />
            {{ loginStatus[0] }} ...
          </h3>
        </b-col>
      </b-row>
    </transition>
  </b-modal>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store/";
import { WalletProvider } from "eos-transit";
import BaseComponent from "@/components/BaseComponent.vue";

const mobileCompatibleWallets = [
  "EOS Lynx",
  "TokenPocket",
  "meetone_provider",
  "whalevault",
  "Keycat",
  "anchor-link"
];

const isMobileCompatible = (mobileCompatibleIds: string[]) => (
  provider: WalletProvider
): boolean => mobileCompatibleIds.some(id => provider.id == id);

@Component
export default class ModalLogin extends BaseComponent {
  loading = false;
  error: any = false;

  get width() {
    return window.innerWidth;
  }

  get isMobile() {
    return this.width <= 768;
  }

  get walletProviders(): WalletProvider[] {
    return this.isMobile
      ? vxm.eosWallet.walletProviders.filter(
          isMobileCompatible(mobileCompatibleWallets)
        )
      : vxm.eosWallet.walletProviders;
  }

  get selectedProvider() {
    return vxm.eosWallet.selectedProvider;
  }

  get loginStatus() {
    return vxm.eosWallet.loginStatus;
  }

  async initLogin(p: WalletProvider) {
    this.loading = true;
    try {
      await vxm.eosWallet.initLogin(p);
      this.$bvModal.hide("modal-login");
    } catch (e) {
      this.error = e;
    } finally {
      this.loading = false;
    }
  }

  providerLogoUrl(p: WalletProvider) {
    switch (p.id) {
      case "scatter":
        return "scatter.svg";
      case "ledger":
        return "ledger.png";
      case "meetone_provider":
        return "meetone.jpg";
      case "Keycat":
        return "keycat.svg";
      case "TokenPocket":
        return "tp.jpg";
      case "EOS Lynx":
        return "lynx.jpg";
      case "whalevault":
        return "whalevault.png";
      case "anchor-link":
        return "anchor.svg";
      default:
        return "eos.png";
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
  //transform: translateX(10px);
  opacity: 0;
}
</style>
