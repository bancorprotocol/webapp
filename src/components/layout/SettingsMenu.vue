<template>
  <b-dropdown
    id="dropdown-settings"
    ref="dropdown"
    right
    variant="white"
    size="sm"
    toggle-class="block-rounded"
    no-caret
  >
    <template v-slot:button-content>
      <font-awesome-icon icon="cog" fixed-width />
    </template>

    <b-dropdown-group id="dropdown-group-1" v-if="showTx">
      <b-dropdown-header class="text-uppercase"
        >Transaction Settings</b-dropdown-header
      >
      <b-dropdown-text style="width: 300px;">
        <p class="font-size-sm mb-0">Slippage Tolerance</p>
        <slippage-tolerance />
      </b-dropdown-text>
    </b-dropdown-group>
    <b-dropdown-divider v-if="showTx"></b-dropdown-divider>
    <b-dropdown-group id="dropdown-group-2">
      <b-dropdown-header class="text-uppercase"
        >Interface Settings</b-dropdown-header
      >
      <b-dropdown-item @click="toggleDarkMode">
        <div class="d-flex justify-content-between align-items-center">
          <span class="font-size-sm">Dark Mode</span>
          <div>
            <b-btn
              size="sm"
              :variant="!darkMode ? 'primary' : 'light'"
              class="mr-1 rounded"
              style="width: 50px"
              >OFF</b-btn
            >
            <b-btn
              size="sm"
              :variant="darkMode ? 'primary' : 'light'"
              class="rounded"
              style="width: 50px"
              >ON</b-btn
            >
          </div>
        </div>
      </b-dropdown-item>
    </b-dropdown-group>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-group id="dropdown-group-3">
      <b-dropdown-header class="text-uppercase">Blockchains</b-dropdown-header>
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
        Version {{ appVersion }}
      </div>
    </b-dropdown-group>
  </b-dropdown>
</template>

<script lang="ts">
import { Prop, Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import SlippageTolerance from "@/components/common/SlippageTolerance.vue";
@Component({
  components: { SlippageTolerance }
})
export default class SettingsMenu extends Vue {
  @Prop({ default: true }) showTx!: boolean;

  get darkMode() {
    return vxm.general.darkMode;
  }

  get showTxSettings() {
    if (this.$route.fullPath.includes("data")) return false;
    else return true;
  }

  get currentNetwork() {
    return vxm.bancor.currentNetwork;
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

  set darkMode(value: boolean) {
    vxm.general.toggleDarkMode();
  }
}
</script>

<style scoped lang="scss"></style>
