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
    <b-dropdown-group id="dropdown-group-2">
      <b-dropdown-header class="text-uppercase">Apps</b-dropdown-header>
      <b-dropdown-item v-if="false" :to="{ name: 'Swap' }"
        ><font-awesome-icon icon="exchange-alt" class="mr-2" fixed-width />
        Bancor Swap</b-dropdown-item
      >
      <b-dropdown-item @click="navData"
        ><font-awesome-icon icon="chart-line" class="mr-2" fixed-width /> Bancor
        Data</b-dropdown-item
      >
      <b-dropdown-item :to="{ name: 'LiqProtection' }">
        <font-awesome-icon icon="shield-alt" class="mr-2" fixed-width />
        Liquidity Protection
      </b-dropdown-item>
      <b-dropdown-item @click="openUrl('https://x.bancor.network/')"
        ><font-awesome-icon icon="times" class="mr-2" fixed-width /> Bancor
        X</b-dropdown-item
      >
      <b-dropdown-item @click="openUrl('https://bancor.network/')"
        ><font-awesome-icon icon="chart-bar" class="mr-2" fixed-width /> Bancor
        Wallet</b-dropdown-item
      >
    </b-dropdown-group>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-group id="dropdown-group-3">
      <b-dropdown-header class="text-uppercase">Developers</b-dropdown-header>
      <b-dropdown-item @click="openUrl('https://docs.bancor.network/')"
        ><font-awesome-icon icon="book-open" class="mr-2" fixed-width />
        Gitbook</b-dropdown-item
      >
      <b-dropdown-item @click="openUrl('https://github.com/bancorprotocol/')"
        ><font-awesome-icon
          :icon="['fab', 'github']"
          class="mr-2"
          fixed-width
        />
        GitHub</b-dropdown-item
      >
      <b-dropdown-item @click="openUrl('https://t.me/BancorDevelopers')"
        ><font-awesome-icon
          :icon="['fab', 'telegram-plane']"
          class="mr-2"
          fixed-width
        />
        Chat</b-dropdown-item
      >
    </b-dropdown-group>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-group id="dropdown-group-3">
      <b-dropdown-header class="text-uppercase">Community</b-dropdown-header>
      <b-dropdown-text>
        <div class="d-flex justify-content-between cursor">
          <font-awesome-icon
            @click="openUrl('https://www.facebook.com/bancor/')"
            :icon="['fab', 'facebook']"
            class="mr-2"
            fixed-width
          />
          <font-awesome-icon
            @click="openUrl('https://twitter.com/Bancor')"
            :icon="['fab', 'twitter']"
            class="mr-2"
            fixed-width
          />
          <font-awesome-icon
            @click="
              openUrl('https://www.linkedin.com/company/bancor-foundation/')
            "
            :icon="['fab', 'linkedin']"
            class="mr-2"
            fixed-width
          />
          <font-awesome-icon
            @click="openUrl('https://www.reddit.com/r/Bancor/')"
            :icon="['fab', 'reddit-alien']"
            class="mr-2"
            fixed-width
          />
          <font-awesome-icon
            @click="openUrl('https://t.me/bancor')"
            :icon="['fab', 'telegram-plane']"
            class="mr-2"
            fixed-width
          />
        </div>
      </b-dropdown-text>
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

<style scoped lang="scss"></style>
