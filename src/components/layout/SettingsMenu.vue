<template>
  <b-dropdown
    id="dropdown-settings"
    ref="dropdown"
    right
    :variant="darkMode ? 'outline-light' : 'outline-dark'"
    size="sm"
    toggle-class="block-rounded"
    :menu-class="darkMode ? 'bg-block-dark shadow' : 'bg-block-light shadow'"
    no-caret
    @hide="settingsMenuHide($event)"
  >
    <template #button-content>
      <font-awesome-icon icon="cog" fixed-width />
    </template>
    <b-dropdown-group id="dropdown-group-1" v-if="showTx && !showLocale">
      <b-dropdown-header
        class="text-uppercase"
        :variant="darkMode ? 'dark' : 'light'"
        >{{ $t("transaction_settings") }}</b-dropdown-header
      >
      <b-dropdown-text
        style="width: 300px"
        :variant="darkMode ? 'dark' : 'light'"
      >
        <p class="font-size-sm mb-0">{{ $t("slippage_tolerance") }}</p>
        <slippage-tolerance />
      </b-dropdown-text>
    </b-dropdown-group>
    <b-dropdown-divider v-if="showTx && !showLocale"></b-dropdown-divider>
    <b-dropdown-group id="dropdown-group-2" v-if="!showLocale">
      <b-dropdown-header
        class="text-uppercase"
        :variant="darkMode ? 'dark' : 'light'"
        >{{ $t("interface_settings") }}</b-dropdown-header
      >
      <b-dropdown-text :variant="darkMode ? 'dark' : 'light'">
        <div class="d-flex justify-content-between align-items-center">
          <span class="font-size-sm">{{ $t("dark_mode") }}</span>
          <div>
            <b-btn
              size="sm"
              :variant="!darkMode ? 'primary' : 'light'"
              class="mr-2 rounded"
              style="width: 50px"
              @click="toggleDarkMode"
              >{{ $t("off") }}</b-btn
            >
            <b-btn
              size="sm"
              :variant="darkMode ? 'primary' : 'light'"
              class="rounded"
              style="width: 50px"
              @click="toggleDarkMode"
              >{{ $t("on") }}</b-btn
            >
          </div>
        </div>
      </b-dropdown-text>
    </b-dropdown-group>
    <b-dropdown-text
      :variant="darkMode ? 'dark' : 'light'"
      v-if="!showLocale"
      @click="toggleLocale"
      class="cursor"
    >
      <div class="d-flex justify-content-between align-items-center">
        <span>{{
          `${$t("language")}: ${getLanguageByLocale(i18n.locale)}`
        }}</span>
        <font-awesome-icon icon="arrow-right" class="mr-2 menu-icon" />
      </div>
    </b-dropdown-text>
    <b-dropdown-divider v-if="!showLocale"></b-dropdown-divider>
    <b-dropdown-group id="dropdown-group-3" v-if="!showLocale">
      <b-dropdown-header
        class="text-uppercase"
        :variant="darkMode ? 'dark' : 'light'"
        v-if="showLocale"
        style="width: 300px !important"
        @click="goToSettings"
        >{{ $t("blockchains") }}
      </b-dropdown-header>
      <b-dropdown-text style="width: 300px">
        <div class="d-flex justify-content-between align-items-end">
          <b-btn
            size="sm"
            @click="changeModule('eth')"
            :variant="currentNetwork === 'eth' ? 'primary' : 'light'"
            class="border-0 px-4 block-rounded btn-block mr-1"
          >
            ETH
          </b-btn>
          <b-btn
            size="sm"
            @click="changeModule('eos')"
            :variant="currentNetwork === 'eos' ? 'primary' : 'light'"
            class="border-0 px-4 block-rounded btn-block ml-1"
          >
            EOS
          </b-btn>
        </div>
      </b-dropdown-text>
      <div class="font-size-12 text-muted-light text-center font-w400">
        {{ `${$t("version")} ${appVersion}` }}
      </div>
    </b-dropdown-group>
    <b-dropdown-header
      :variant="darkMode ? 'dark' : 'light'"
      v-if="showLocale"
      style="width: 300px !important"
      class="cursor"
      @click="goToSettings"
    >
      <font-awesome-icon icon="arrow-left" class="mr-2 menu-icon" />
      {{ $t("choose_language") }}
    </b-dropdown-header>
    <b-dropdown-group v-if="showLocale">
      <b-dropdown-item-button
        style="margin: 5px"
        v-for="item in i18n.availableLocales"
        :variant="darkMode ? 'dark' : 'light'"
        :key="item.toString()"
        @click="switchlocale(item)"
      >
        {{ getLanguageByLocale(item) }}
      </b-dropdown-item-button>
    </b-dropdown-group>
  </b-dropdown>
</template>

<script lang="ts">
import { Prop, Component } from "vue-property-decorator";
import { vxm } from "@/store";
import SlippageTolerance from "@/components/common/SlippageTolerance.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import { i18n, getLanguageByLocale } from "@/i18n";

@Component({
  components: { SlippageTolerance }
})
export default class SettingsMenu extends BaseComponent {
  @Prop({ default: true }) showTx!: boolean;

  showLocale: boolean = false;
  goBack: boolean = false;
  goLocale: boolean = false;

  get i18n() {
    return i18n;
  }

  get getLanguageByLocale() {
    return getLanguageByLocale;
  }

  get showTxSettings() {
    if (this.$route.fullPath.includes("data")) return false;
    else return true;
  }

  get appVersion() {
    return JSON.parse(
      unescape(escape(JSON.stringify(require("../../../package.json"))))
    ).version;
  }

  async changeModule(id: string) {
    await this.$router.push({ name: "Swap", params: { service: id } });
    //@ts-ignore
    this.$refs.dropdown.hide(true);
  }

  toggleDarkMode() {
    vxm.general.toggleDarkMode();
  }

  switchlocale(locale: string) {
    i18n.locale = locale;
  }

  toggleLocale() {
    this.showLocale = !this.showLocale;
    this.goLocale = true;
  }

  goToSettings() {
    this.goBack = true;
    this.toggleLocale();
  }

  settingsMenuHide(bvEvent: any) {
    if (this.goLocale || this.goBack) {
      this.goBack = false;
      this.goLocale = false;
      bvEvent.preventDefault();
    } else this.showLocale = false;
  }
}
</script>

<style scoped lang="scss"></style>
