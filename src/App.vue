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
    <div>
      <router-view name="Nav"></router-view>

      <main
        id="main-container"
        :class="
          darkMode
            ? 'bg-body-dark text-body-dark'
            : 'bg-body-light text-body-light'
        "
      >
        <b-container fluid="xl" class="pt-1">
          <b-row class="d-flex justify-content-center">
            <b-col cols="12" style="max-width: 460px">
              <router-view name="Hero"></router-view>
            </b-col>
          </b-row>
        </b-container>
        <router-view></router-view>
      </main>
    </div>
    <div>
      <modal-login />
      <modal-join-pool />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ModalLogin from "@/components/modals/ModalLogin.vue";
import { vxm } from "@/store/";
import { WalletProvider } from "eos-transit";
import wait from "waait";
import ModalJoinPool from "@/components/pool/ModalJoinPool.vue";

@Component({
  components: {
    ModalJoinPool,
    ModalLogin
  }
})
export default class App extends Vue {
  loading = true;
  error = false;

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

  async created() {
    const darkMode = localStorage.getItem("darkMode") === "true" ? true : false;
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
    if (this.$route.name === "404") this.loading = false;
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
</style>
