<template>
  <div class="mt-3">
    <label-content-split label="Stake" value="????" />
    <label-content-split value="????" class="mb-2" />

    <label-content-split label="Fully Protected Value" value="????" />
    <label-content-split value="????" />

    <alert-block
      variant="warning"
      title="Important"
      msg="You still haven’t reached full coverage. There is a risk for impermanent loss."
      class="my-3"
    />

    <percentage-slider
      label="Input"
      v-model="percentage"
      :show-buttons="true"
    />
    <div class="d-flex justify-content-center">
      <font-awesome-icon icon="arrow-down" class="mt-3" />
    </div>

    <gray-border-block :gray-bg="true" class="my-3">
      <label-content-split label="Output value of" value="????" />
      <label-content-split value="????" class="mb-2" />

      <label-content-split label="Output breakdown" value="????" />
      <label-content-split value="????" />
    </gray-border-block>

    <main-button
      label="Continue"
      @click="initAction"
      :active="true"
      :large="true"
      :disabled="disableActionButton"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import { ViewRelay } from "@/types/bancor";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MainButton from "@/components/common/Button.vue";
import PercentageSlider from "@/components/common/PercentageSlider.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";

@Component({
  components: {
    AlertBlock,
    PercentageSlider,
    LabelContentSplit,
    GrayBorderBlock,
    MainButton
  }
})
export default class WithdrawProtectionV1 extends Vue {
  @Prop() pool!: ViewRelay;

  percentage: string = "50";

  modal = false;

  get disableActionButton() {
    if (parseFloat(this.percentage) === 0) return true;
    else return this.inputError ? true : false;
  }

  get inputError() {
    if (parseFloat(this.percentage) === 0) return "Percentage can not be Zero";
    else return "";
  }

  initAction() {
    this.modal = true;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
