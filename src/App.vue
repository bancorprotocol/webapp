<template>
  <div
    v-if="loading"
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
          style="display: block; width: 2rem; height: 2rem;"
          class="align-self-center align-middle"
          :class="darkMode ? 'text-primary' : 'text-primary'"
          label="Loading..."
        ></b-spinner>
        <h5
          class="m-0 ml-3"
          :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
        >
          Just a moment ...
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
    <div
      class="d-block mb-0 py-2 bg-primary text-white text-center font-size-12 font-w600"
    >
      This interface is in beta. Use it at your own risk.
    </div>
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
import { Component, Vue, Watch } from "vue-property-decorator";
import ModalLogin from "@/components/modals/ModalLogin.vue";
import SideBar from "@/components/layout/SideBar.vue";
import { vxm } from "@/store/";
import { WalletProvider } from "eos-transit";
import wait from "waait";

@Component({
  components: {
    ModalLogin,
    SideBar
  }
})
export default class App extends Vue {
  loading = true;
  error = false;

  get isDevOrStaging() {
    return (
      process.env.NODE_ENV == "development" ||
      window.location.host.includes("staging")
    );
  }

  get selectedNetwork() {
    return vxm.bancor.currentNetwork;
  }
  get darkMode() {
    return vxm.general.darkMode;
  }

  async loadBancor() {
    console.log("feature:", this.$route.meta.feature);
    console.log("service:", this.$route.params.service);
    console.log("query:", this.$route.query);
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

    console.log({ service, feature, query, initParams, paramsSatisfied });
    try {
      await vxm.bancor.init(initParams);
      // @ts-ignore
      console.log(new Date() / 1, "stopped loading");
      this.loading = false;
      // @ts-ignore
      this.$gtag.event("initBancor", {
        event_category: this.$route.params.service
      });
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
    console.log(this.$route, "initial route on render");
    const darkMode = localStorage.getItem("darkMode") === "true";
    if (darkMode) vxm.general.toggleDarkMode();

    const autoLogin = localStorage.getItem("autoLogin");
    if (autoLogin) {
      const provider = vxm.eosWallet.walletProviders.find(
        (p: WalletProvider) => p.id === autoLogin
      );
      // if (provider) vxm.eosWallet.initLogin(provider);
    }
    await vxm.general.setLanguage();
    await vxm.general.getUserCountry();
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
