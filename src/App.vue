<template>
  <div v-if="networkNotSupported">
    <b-row>
      <b-col cols="12" class="d-flex justify-content-center align-items-center">
        <img
          :src="require('@/assets/media/logos/bancor-black.png')"
          class="mt-5"
          width="200px"
        />
      </b-col>
      <b-col
        cols="12"
        class="d-flex justify-content-center align-items-center mt-3"
      >
        <div class="text-primary font-size-24 font-w600">
          Network not supported
        </div>
      </b-col>
      <b-col
        cols="12"
        class="d-flex justify-content-center align-items-center mt-3"
      >
        <div class="text-light font-w400">
          Please switch to Ethereum Mainnet or Ropsten and refresh the site.
        </div>
      </b-col>
    </b-row>
  </div>
  <div
    v-else-if="loading"
    class="loading d-flex justify-content-center align-items-center"
    :class="darkMode ? 'bg-body-dark' : 'bg-body-light'"
  >
    <div class="text-center mb-5">
      <img
        v-if="darkMode"
        src="@/assets/media/logos/bancor-white2.png"
        height="85px"
      />
      <img v-else src="@/assets/media/logos/bancor-black2.png" height="85px" />
      <div class="d-flex justify-content-center align-items-center my-5">
        <b-spinner
          style="display: block; width: 2rem; height: 2rem"
          class="align-self-center align-middle"
          :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          :label="`${$t('loading')}... `"
        ></b-spinner>
        <h5
          class="m-0 ml-3"
          :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
        >
          {{ `${$t("just_a_moment")}...` }}
        </h5>
      </div>
    </div>
  </div>

  <div
    v-else-if="error"
    class="loading page-header-fixed align-items-center"
    :class="darkMode ? 'bg-body-dark' : 'bg-body-light'"
  >
    <div class="d-flex justify-content-center align-items-center mb-3">
      <div>
        <h2 class="text-white">{{ error }}</h2>
      </div>
    </div>
  </div>

  <div
    v-else
    id="page-container"
    :class="
      darkMode ? 'bg-body-dark text-body-dark' : 'bg-body-light text-body-light'
    "
  >
    <NetworkAlert v-if="!isMainNet" />
    <div name="MainLayout" class="main-layout">
      <side-bar />
      <main
        id="main-container"
        :class="
          darkMode
            ? 'bg-body-dark text-body-dark main-container'
            : 'bg-body-light text-body-light main-container'
        "
        style="flex-grow: 1"
      >
        <router-view name="Nav" />
        <b-container fluid="xl" class="pt-1">
          <b-row class="d-flex justify-content-center">
            <b-col cols="12" style="max-width: 460px">
              <router-view name="Hero"></router-view>
            </b-col>
          </b-row>
        </b-container>
        <router-view />
      </main>
    </div>
    <div>
      <modal-login />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import ModalLogin from "@/components/modals/ModalLogin.vue";
import SideBar from "@/components/layout/SideBar.vue";
import { vxm } from "@/store/";
import wait from "waait";
import BaseComponent from "@/components/BaseComponent.vue";
import NetworkAlert from "@/components/layout/NetworkAlert.vue";
import { EthNetworks } from "./api/web3";

@Component({
  components: {
    NetworkAlert,
    ModalLogin,
    SideBar
  }
})
export default class App extends BaseComponent {
  loading = true;
  error = false;

  get networkNotSupported() {
    console.log(vxm.ethBancor.currentNetwork, "is the current network");
    return !(
      vxm.ethBancor.currentNetwork == EthNetworks.Mainnet ||
      vxm.ethBancor.currentNetwork == EthNetworks.Ropsten
    );
  }

  get isMainNet() {
    return vxm.ethBancor.currentNetwork == EthNetworks.Mainnet;
  }

  get isDevOrStaging() {
    return (
      process.env.NODE_ENV == "development" ||
      window.location.host.includes("staging")
    );
  }

  async loadBancor() {
    const trade = this.$route.meta.feature == "Trade";

    const service = this.$route.params && this.$route.params.service;
    const pool = this.$route.params && this.$route.params.account;
    const feature = this.$route.meta && this.$route.meta.feature;
    const query = this.$route.query;
    const paramsSatisfied = service && feature && query;

    const initParams = {
      initialChain: this.$route.params.service,
      ...(paramsSatisfied && {
        initialModuleParam: {
          [trade ? "tradeQuery" : "poolQuery"]: trade ? this.$route.query : pool
        }
      })
    };

    try {
      await vxm.bancor.init(initParams);
      this.loading = false;
    } catch (e) {
      await wait(1000);
      try {
        await vxm.bancor.init(initParams);
      } catch (e) {
        this.loading = false;
        this.error = e.message;
        throw new Error(e);
      }
    }
  }

  openUrl(url: string) {
    window.open(url, "_blank");
  }

  async created() {
    const darkMode = localStorage.getItem("darkMode") === "true";
    const adminMode = localStorage.getItem("adminMode") === "true";
    const locale = localStorage.getItem("locale");
    const lang =
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;
    if (darkMode) vxm.general.toggleDarkMode();
    if (adminMode) vxm.general.toggleAdminMode();
    if (locale) vxm.general.setLocale(locale);
    else vxm.general.setLocale(lang);

    await this.loadBancor();

    if (this.$route.name === "404") this.loading = false;
  }

  @Watch("$route.params.service")
  async onServiceChange() {
    await this.loadBancor();
  }
}
</script>
<style scoped lang="scss">
h2 {
  padding: 25px;
}
.hide-on-mobile {
  @media screen and (max-width: 768px) {
    display: none !important;
  }
}
#page-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.loading {
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.main-layout {
  display: flex;
  flex-direction: row;
  height: 100%;
  flex-grow: 1;
  overflow: hidden;
}
.main-container {
  overflow-y: auto;
  overflow-x: hidden !important;
  padding: 12px;
  @media screen and (max-width: 768px) {
    margin-bottom: 56px;
  }
}
</style>
