<template>
  <alert-block v-if="error" variant="error" :msg="errorMsg" />
</template>

<script lang="ts">
import { Component, Prop, VModel } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import AlertBlock from "@/components/common/AlertBlock.vue";

@Component({
  components: { AlertBlock }
})
export default class PriceDeviationError extends BaseComponent {
  @VModel() error!: boolean;
  @Prop() poolId!: string;
  @Prop() tokenContract!: string;

  errorMsg: string = "";

  async loadRecentAverageRate() {
    try {
      this.error = await vxm.bancor.checkPriceDeviationTooHigh({
        relayId: this.poolId,
        selectedTokenAddress: this.tokenContract
      });

      if (this.error) {
        this.errorMsg = i18n.tc("price_volatility");
      } else this.errorMsg = "";
    } catch (e) {
      this.error = true;
      this.errorMsg =
        "Price deviation calculation failed. Please contact support.";
    } finally {
      if (this.errorMsg) console.error(this.errorMsg);
    }
  }
}
</script>

<style lang="scss"></style>
