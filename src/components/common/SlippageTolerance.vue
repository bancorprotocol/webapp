<template>
  <div class="d-flex justify-content-between mt-2">
    <div v-for="x in options" :key="x" class="w-50 mr-2">
      <b-btn @click="setSlippage(x)" :variant="getVariant(x)" size="xs" block>
        {{ x }}%
      </b-btn>
    </div>
    <div class="w-100">
      <b-input-group>
        <b-form-input
          class="text-right custom-input-field pr-1"
          :class="formInputStyles"
          v-model="custom"
          inputmode="decimal"
          @input="setCustomSlippage"
          :placeholder="$t('custom')"
          :formatter="formatter"
        />
        <b-input-group-append>
          <div
            class="d-flex align-items-center pr-2 custom-input-append"
            :class="formInputStyles"
          >
            %
          </div>
        </b-input-group-append>
      </b-input-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class SlippageTolerance extends BaseComponent {
  options = [0.1, 0.5, 1];

  custom = "";

  get currentSlippage() {
    return vxm.bancor.slippageTolerance;
  }

  get formInputStyles() {
    if (this.custom !== "") return "custom-input-active-borderless";
    else return this.darkMode ? "text-dark" : "text-light";
  }

  setSlippage(percentage: number) {
    vxm.bancor.setSlippageTolerance(percentage / 100);
    this.custom = "";
  }

  setCustomSlippage(percentage: string) {
    vxm.bancor.setSlippageTolerance(Number(percentage) / 100);
  }

  getVariant(percentage: number) {
    const inDecimal = percentage / 100;
    if (this.currentSlippage === inDecimal) return "primary";
    else return this.darkMode ? "outline-gray-dark" : "outline-gray";
  }

  formatter(text: String) {
    if (text === undefined) text = this.custom.toString();

    return text
      .replace(/[^\d\.]/g, "")
      .replace(/\./, "x")
      .replace(/\./g, "")
      .replace(/x/, ".");
  }

  @Watch("currentSlippage")
  onSlippageChange(slippage: number) {
    if (!this.options.find(x => x / 100 === slippage))
      this.custom = (slippage * 100).toString();
    else this.custom = "";
  }

  created() {
    if (!this.options.find(x => x / 100 === this.currentSlippage))
      this.custom = (this.currentSlippage * 100).toString();
    else this.custom = "";
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
  color: red;
  border-left: none !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.btn-xs {
  padding: 0.25rem 0.4rem !important;
  font-size: 12px !important;
  line-height: 1.1 !important;
  border-radius: 8px !important;
}
</style>
