<template>
  <div style="max-height:200px;">
    <b-form-select v-model="displayCurrency" :options="options">
    </b-form-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import { BvModalEvent } from "bootstrap-vue";

@Component
export default class SettingsMenu extends Vue {
  dropdownHeight = "auto";
  isConversionActive = false;
  displayCurrency = "USD";

  options = vxm.general.supportedCurrencies;
  custom = "";

  get darkMode() {
    return vxm.general.darkMode;
  }

  get formInputStyles() {
    if (this.custom !== "") return "custom-input-active";
    else return this.darkMode ? "text-dark" : "text-light";
  }

  setCurrency(currency: string) {
    vxm.general.setCurrency(currency);
    this.custom = "";
  }

  getVariant(currency: string) {
    if (this.displayCurrency === currency) return "primary";
    else if (this.darkMode) return "outline-gray-dark";
    else return "outline-gray";
  }

  @Watch("displayCurrency")
  onCurrencyChange(currency: string) {
    this.setCurrency(currency);
  }

  created() {
    if (!this.options.find(x => x === this.displayCurrency))
      this.custom = this.displayCurrency;
    else this.custom = "";
  }

  mounted() {
    this.displayCurrency = vxm.general.currency;
    this.$root.$on("bv::dropdown::show", (bvEvent: BvModalEvent) => {
      if (bvEvent.componentId === "currencyDropdown") {
        console.log("TRUE");
        this.isConversionActive = true;
      }
    });
    this.$root.$on("bv::dropdown::hide", (bvEvent: BvModalEvent) => {
      if (bvEvent.componentId === "currencyDropdown") {
        console.log("FALSE");
        this.isConversionActive = false;
        this.dropdownHeight = "100px";
      }
      if (this.isConversionActive) {
        bvEvent.preventDefault();
        this.dropdownHeight = "auto";
      }
    });
  }
}
</script>

<style lang="scss">
@import "../../assets/_scss/custom/variables";

.custom-input {
  background-color: transparent !important;
  font-weight: 600 !important;
  font-size: 12px !important;
  height: 23px !important;
  border: 1px solid #d0d7df !important;
  border-radius: 8px !important;
}

.custom-input-field {
  @extend .custom-input;
  border-right: none !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.custom-input-append {
  @extend .custom-input;
  border-left: none !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.custom-input-active {
  background-color: $primary !important;
  color: #fff !important;
  border-color: $primary !important;
}
.btn-xs {
  padding: 0.25rem 0.4rem !important;
  font-size: 12px !important;
  line-height: 1.1 !important;
  border-radius: 8px !important;
}
</style>
