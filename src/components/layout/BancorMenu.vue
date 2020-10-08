<template>
  <b-dropdown
    id="dropdown-settings"
    right
    variant="white"
    size="sm"
    toggle-class="block-rounded"
    menu-class="dropdown-dark"
    no-caret
  >
    <template v-slot:button-content>
      <font-awesome-icon icon="bars" fixed-width />
    </template>

    <b-dropdown-group v-if="false" id="dropdown-group-1">
      <b-dropdown-header class="text-uppercase">Bancor</b-dropdown-header>
      <b-dropdown-item style="width: 230px;" disabled>
        <font-awesome-icon icon="info" class="mr-2" fixed-width /> About (Coming
        Soon)
      </b-dropdown-item>
    </b-dropdown-group>
    <b-dropdown-divider v-if="false"></b-dropdown-divider>
    <b-dropdown-group v-if="false" id="dropdown-group-2">
      <b-dropdown-header class="text-uppercase">Apps</b-dropdown-header>
      <b-dropdown-item v-if="isDataPage" @click="navSwap">
        <div class="d-flex align-items-center">
          <img
            height="16"
            width="16"
            :src="require(`@/assets/media/icons/swap.svg`)"
          />
          <span class="ml-3">Swap</span>
        </div>
      </b-dropdown-item>
      <b-dropdown-item v-else @click="navData">
        <div class="d-flex align-items-center">
          <img
            height="16"
            width="16"
            :src="require(`@/assets/media/icons/data.svg`)"
          />
          <span class="ml-3">Data</span>
        </div>
      </b-dropdown-item>
      <b-dropdown-item v-if="false" :to="{ name: 'LiqProtection' }">
        <font-awesome-icon icon="shield-alt" class="mr-2" fixed-width />
        Liquidity Protection
      </b-dropdown-item>
      <b-dropdown-item @click="openUrl('https://x.bancor.network/')">
        <div class="d-flex align-items-center">
          <img
            height="16"
            width="16"
            :src="require(`@/assets/media/icons/bancorx.svg`)"
          />
          <span class="ml-3">Bancor X</span>
        </div>
      </b-dropdown-item>
      <b-dropdown-item @click="openUrl('https://bancor.network/')">
        <div class="d-flex align-items-center">
          <img
            height="16"
            width="16"
            :src="require(`@/assets/media/icons/bancor.svg`)"
          />
          <span class="ml-3">Bancor Wallet</span>
        </div>
      </b-dropdown-item>
    </b-dropdown-group>
    <b-dropdown-divider v-if="false"></b-dropdown-divider>
    <b-dropdown-group id="dropdown-group-3">
      <b-dropdown-header class="text-uppercase">Developers</b-dropdown-header>
      <b-dropdown-item @click="openUrl('https://docs.bancor.network/')">
        <font-awesome-icon
          icon="book-open"
          class="mr-2 menu-icon"
          fixed-width
        />
        Gitbook
      </b-dropdown-item>
      <b-dropdown-item @click="openUrl('https://github.com/bancorprotocol/')">
        <font-awesome-icon
          :icon="['fab', 'github']"
          class="mr-2 menu-icon"
          fixed-width
        />
        GitHub
      </b-dropdown-item>
      <b-dropdown-item @click="openUrl('https://t.me/BancorDevelopers')">
        <font-awesome-icon
          :icon="['fab', 'telegram-plane']"
          class="mr-2 menu-icon"
          fixed-width
        />
        Chat
      </b-dropdown-item>
    </b-dropdown-group>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-group id="dropdown-group-3">
      <b-dropdown-header class="text-uppercase">Community</b-dropdown-header>
      <b-dropdown-text>
        <div class="d-flex justify-content-between cursor">
          <font-awesome-icon
            @click="openUrl('https://twitter.com/Bancor')"
            :icon="['fab', 'twitter']"
            class="mr-2 menu-icon"
            fixed-width
          />
          <font-awesome-icon
            @click="openUrl('https://www.reddit.com/r/Bancor/')"
            :icon="['fab', 'reddit-alien']"
            class="mr-2 menu-icon"
            fixed-width
          />
          <font-awesome-icon
            @click="openUrl('https://t.me/bancor')"
            :icon="['fab', 'telegram-plane']"
            class="mr-2 menu-icon"
            fixed-width
          />
        </div>
      </b-dropdown-text>
    </b-dropdown-group>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-group id="dropdown-group-3" class="font-size-12">
      <b-dropdown-item @click="navPrivacy"> Privacy Policy</b-dropdown-item>
      <b-dropdown-item @click="navTermsOfUse"> Terms of Use</b-dropdown-item>
    </b-dropdown-group>
  </b-dropdown>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class BancorMenu extends Vue {
  get darkMode() {
    return vxm.general.darkMode;
  }

  get isDataPage() {
    return this.$route.fullPath.includes("data");
  }

  navData() {
    const hostbase = window.location.hostname;
    const service = this.$route.params.service;

    const isDev = hostbase == "localhost";
    const isStaging = hostbase.includes("staging");
    const isProd = !isDev && !isStaging;

    if (isDev) {
      this.openUrl(`http://localhost:8080/${service}/data`);
    } else if (isStaging) {
      this.openUrl(`https://staging.swap.bancor.network/${service}/data`);
    } else if (isProd) {
      this.openUrl(`https://swap.bancor.network/${service}/data`);
    } else {
      console.log("failed to determine route...");
      this.openUrl(`https://swap.bancor.network/${service}/data`);
    }
  }

  navSwap() {
    let routeData = this.$router.resolve({ name: "Swap" });
    this.openUrl(routeData.href);
  }

  navPrivacy() {
    this.$router.push({ name: "PrivacyPolicy" });
  }

  navTermsOfUse() {
    this.$router.push({ name: "TermsOfUse" });
  }

  openUrl(url: string) {
    window.open(url, "_blank");
  }

  toggleDarkMode() {
    vxm.general.toggleDarkMode();
  }

  set darkMode(value: boolean) {
    vxm.general.toggleDarkMode();
  }
}
</script>

<style scoped lang="scss">
.menu-icon {
  color: #6b7c93;
}
</style>
