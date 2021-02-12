<template>
  <b-dropdown
    id="dropdown-menu"
    right
    :variant="darkMode ? 'outline-dark' : 'outline-light'"
    size="sm"
    toggle-class="block-rounded"
    :menu-class="darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'"
    no-caret
  >
    <template #button-content>
      <font-awesome-icon icon="bars" fixed-width />
    </template>

    <b-dropdown-group v-if="false" id="dropdown-group-1">
      <b-dropdown-header class="text-uppercase">Bancor</b-dropdown-header>
      <b-dropdown-item style="width: 230px" disabled>
        <font-awesome-icon icon="info" class="mr-2" fixed-width />
        {{ $t("about") }}
      </b-dropdown-item>
    </b-dropdown-group>
    <b-dropdown-divider v-if="false"></b-dropdown-divider>
    <b-dropdown-group v-if="false" id="dropdown-group-2">
      <b-dropdown-header class="text-uppercase">{{
        $t("apps")
      }}</b-dropdown-header>
      <b-dropdown-item v-if="isDataPage" @click="navSwap">
        <div class="d-flex align-items-center">
          <img
            height="16"
            width="16"
            :src="require(`@/assets/media/icons/swap.svg`)"
          />
          <span class="ml-3">{{ $t("swap") }}</span>
        </div>
      </b-dropdown-item>
      <b-dropdown-item v-else @click="navData">
        <div class="d-flex align-items-center">
          <img
            height="16"
            width="16"
            :src="require(`@/assets/media/icons/data.svg`)"
          />
          <span class="ml-3">{{ $t("data") }}</span>
        </div>
      </b-dropdown-item>
      <b-dropdown-item :to="{ name: 'LiqProtection' }">
        <font-awesome-icon icon="shield-alt" class="mr-2" fixed-width />
        {{ $t("liquidity_protection") }}
      </b-dropdown-item>
      <b-dropdown-item :to="{ name: 'GovernancePage' }">
        <font-awesome-icon icon="thumbs-up" class="mr-2" fixed-width />
        Bancor Governance
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
      <b-dropdown-item @click="openUrl('https://wallet.bancor.network/')">
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
      <b-dropdown-header class="text-uppercase">
        {{ $t("community_support") }}
      </b-dropdown-header>
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
          <font-awesome-icon
            @click="openUrl('https://discord.gg/EHK8wHbgau')"
            :icon="['fab', 'discord']"
            class="mr-2 menu-icon"
            fixed-width
          />
          <font-awesome-icon
            @click="openUrl('https://gov.bancor.network')"
            :icon="['fab', 'discourse']"
            class="mr-2 menu-icon"
            fixed-width
          />
        </div>
      </b-dropdown-text>
    </b-dropdown-group>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-group id="dropdown-group-4">
      <b-dropdown-header class="text-uppercase">{{
        $t("developers")
      }}</b-dropdown-header>
      <b-dropdown-item
        @click="openUrl('https://docs.bancor.network/')"
        :variant="darkMode ? 'dark' : 'light'"
      >
        <font-awesome-icon
          icon="book-open"
          class="mr-2 menu-icon"
          fixed-width
        />
        Gitbook
      </b-dropdown-item>
      <b-dropdown-item
        @click="openUrl('https://github.com/bancorprotocol/')"
        :variant="darkMode ? 'dark' : 'light'"
      >
        <font-awesome-icon
          :icon="['fab', 'github']"
          class="mr-2 menu-icon"
          fixed-width
        />
        GitHub
      </b-dropdown-item>
      <b-dropdown-item
        @click="openUrl('https://t.me/BancorDevelopers')"
        :variant="darkMode ? 'dark' : 'light'"
      >
        <font-awesome-icon
          :icon="['fab', 'telegram-plane']"
          class="mr-2 menu-icon"
          fixed-width
        />
        {{ $t("chat") }}
      </b-dropdown-item>
    </b-dropdown-group>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-group id="dropdown-group-5" class="font-size-12">
      <b-dropdown-item
        @click="navPrivacy"
        :variant="darkMode ? 'dark' : 'light'"
      >
        {{ $t("privacy_policy") }}
      </b-dropdown-item>
      <b-dropdown-item
        @click="navTermsOfUse"
        :variant="darkMode ? 'dark' : 'light'"
      >
        {{ $t("terms_of_use") }}
      </b-dropdown-item>
    </b-dropdown-group>
  </b-dropdown>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class BancorMenu extends BaseComponent {
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
}
</script>

<style scoped lang="scss">
.menu-icon {
  color: #6b7c93;
}
</style>
