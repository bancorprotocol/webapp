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
      <div
        name="side-bar"
        class="side-bar"
        :class="darkMode ? 'side-bar-dark' : ''"
      >
        <b-navbar-brand class="pb-1 brand-icon">
          <router-link
            :to="{ name: 'Swap', params: { service: selectedNetwork } }"
          >
            <img
              v-if="darkMode"
              src="@/assets/media/logos/bancor-white.png"
              height="35px"
              class="mb-1"
            />
            <img
              v-else
              src="@/assets/media/logos/bancor-black.png"
              height="35px"
              class="mb-1"
            />
          </router-link>
        </b-navbar-brand>
        <div class="side-bar-links">
          <div
            v-for="link in links"
            :key="link.key"
            @click="sideLinkClicked(link.key)"
            class="side-bar-link"
            :class="
              $route.name === link.route
                ? darkMode
                  ? 'clicked-link-dark'
                  : 'clicked-link'
                : darkMode
                ? 'side-bar-link-dark'
                : 'side-bar-link'
            "
          >
            <img
              class="side-bar-link-icon"
              :src="require(`@/assets/media/icons/${link.key}.svg`)"
            />
            <span>{{ link.label }}</span>
          </div>
        </div>
        <div class="middle-space" />
        <p class="tm-text">© Bancor 2020</p>
      </div>
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
import { vxm } from "@/store/";
import { WalletProvider } from "eos-transit";
import wait from "waait";

@Component({
  components: {
    ModalLogin
  }
})
export default class App extends Vue {
  loading = true;
  error = false;
  selectedLink = "swap";
  links = [
    { route: "Data", key: "data", label: "Data" },
    { route: "Swap", key: "swap", label: "Swap" },
    { route: "GovernancePage", key: "governance", label: "Governance" },
    // { route: "LiqProtection", key: "liquidity", label: "Liquidity" },
    { route: "swap", key: "bancorx", label: "BancorX" }
  ];

  // get isMobile() {
  //   return window.innerWidth < 450;
  // }

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

  sideLinkClicked(newSelected: string) {
    if (this.selectedLink == newSelected) return;
    const currentService = this.$route.params.service;
    const path =
      window.location.protocol +
      "//" +
      window.location.hostname +
      `:${window.location.port}` +
      `/${currentService}`;
    if (newSelected == "swap") {
      this.openUrl(`${path}/swap`);
    } else if (newSelected == "bancorx") {
      this.openUrl("https://x.bancor.network/");
    } else if (newSelected == "data") {
      this.openUrl(`${path}/data`);
    } else if (newSelected == "governance") {
      this.$router.push({ name: "GovernancePage" });
    }
    return;
    // const linkSelected = this.links.find(link => link.key == newSelected)!;
    // this.$router.push({
    // name: linkSelected.route,
    // params: { service: this.$route.params.service }
    // });
    // this.selectedLink = newSelected;
  }

  detectSubdomain() {
    const hostname = window.location.hostname;
    const splitted = hostname.split(".");
    const withoutStaging = splitted.length == 4 ? splitted.slice(1) : splitted;
    console.log(withoutStaging, "is without staging");
    const subDomain = withoutStaging[0];
    if (subDomain == "localhost") return;
    if (subDomain == "data") {
      this.selectedLink = "data";
    } else if (subDomain == "swap") {
      this.selectedLink = "swap";
    }
  }

  async created() {
    this.detectSubdomain();
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
    vxm.general.setLanguage();
    await vxm.general.getUserCountry();
    await this.loadBancor();
    if (this.$route.name == "DataSummary") {
      this.selectedLink = "data";
    }
    if (this.$route.name == "Swap") {
      this.selectedLink = "swap";
    }
    if (this.$route.name === "404") this.loading = false;
    // const a = this.$route.fullPath.lastIndexOf("/") + 1;
    // const b = this.$route.fullPath.indexOf("?");
    // console.log(a, b);
    // this.selectedLink =
    //   b > 0
    //     ? this.$route.fullPath.substring(a, b)
    //     : this.$route.fullPath.slice(a);
    // console.log("SELECTED LINK", this.selectedLink);
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
  overflow-x: auto;
  padding: 12px;
}
.side-bar {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 230px;
  background-color: #e6ebf2;
  z-index: 10;
  @media (max-width: 450px) {
    position: fixed;
    overflow: hidden;
    top: calc(100vh - 56px);
    left: 0;
    width: 100%;
    height: 56px;
    background-color: white;
    border-top: 1px solid #e6ebf2;
  }
  .brand-icon {
    @media (max-width: 450px) {
      display: none;
    }
    margin-top: 18px;
    margin-left: 25px;
    width: 80.9px;
    height: 22px;
    object-fit: contain;
  }
  .side-bar-links {
    margin-top: 28px;
    @media (max-width: 450px) {
      width: 100%;
      height: 56px;
      align-items: center;
      margin-top: 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
  }
  .side-bar-link {
    padding-left: 25px;
    width: 100%;
    cursor: pointer;
    height: 40px;
    position: relative;
    @media (max-width: 450px) {
      padding-left: 0px;
      display: flex;
      flex-direction: column;
    }
    span {
      height: 40px;
      display: inline-flex;
      align-items: center;
      font-family: Inter;
      font-size: 14px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #6b7c93;
      @media (max-width: 450px) {
        align-self: center;
        font-size: 10px;
      }
    }
    .side-bar-link-icon {
      align-self: center;
      width: 14px;
      height: 14px;
      margin-right: 12px;
      @media (max-width: 450px) {
        width: 32px;
        height: 32px;
        margin-right: 0px;
      }
    }
  }
  .middle-space {
    flex-grow: 1;
  }
  .tm-text {
    width: 88px;
    height: 15px;
    font-family: Inter;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #97a5b8;
    margin-left: 25px;
    @media (max-width: 450px) {
      display: none;
    }
  }
  .clicked-link {
    span {
      color: #0f59d1;
    }
    img {
      filter: invert(0.6) sepia(1) saturate(5) hue-rotate(195deg)
        brightness(0.7);
      color: #0f59d1;
    }
    @media (min-width: 450px) {
      background-color: #f8f9fd;
      border-left: 2px solid #0f59d1;
      &::before {
        content: "";
        position: absolute;
        left: 202px;
        top: -26px;
        width: 26px;
        height: 26px;
        background-color: transparent;
        border-bottom-right-radius: 14px;
        box-shadow: 0 11px 0 0 #f8f9fd;
      }
      &::after {
        content: "";
        position: absolute;
        left: 202px;
        top: 40px;
        width: 26px;
        height: 26px;
        background-color: transparent;
        border-top-right-radius: 14px;
        box-shadow: 0 -11px 0 0 #f8f9fd;
      }
    }
  }
}
.side-bar-dark {
  background-color: #0a2540;
}
.side-bar-link-dark {
  span {
    color: #aaa !important;
  }
}
.clicked-link-dark {
  span {
    color: #fff !important;
  }
  img {
    filter: invert(0.2) saturate(5) brightness(1);
    color: #0f59d1;
  }
  @media (min-width: 450px) {
    background-color: #1c344e;
    border-left: 2px solid #0f59d1;
    &::before {
      content: "";
      position: absolute;
      left: 202px;
      top: -26px;
      width: 26px;
      height: 26px;
      background-color: transparent;
      border-bottom-right-radius: 14px;
      box-shadow: 0 11px 0 0 #1c344e;
    }
    &::after {
      content: "";
      position: absolute;
      left: 202px;
      top: 40px;
      width: 26px;
      height: 26px;
      background-color: transparent;
      border-top-right-radius: 14px;
      box-shadow: 0 -11px 0 0 #1c344e;
    }
  }
}
</style>
