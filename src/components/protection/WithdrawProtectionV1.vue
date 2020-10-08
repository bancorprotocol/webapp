<template>
  <div class="mt-3">
    <label-content-split
      label="Stake"
      :value="
        `${position.protectedAmount.amount} ${position.protectedAmount.symbol}`
      "
    />
    <!-- <label-content-split value="????" class="mb-2" /> -->

    <label-content-split
      v-if="poolWhitelisted"
      label="Fully Protected Value"
      value="????"
    />
    <label-content-split v-if="poolWhitelisted" value="????" />

    <alert-block
      variant="warning"
      title="Important"
      msg="You still haven’t reached full coverage. There is a risk for impermanent loss."
      class="my-3"
    />

    <percentage-slider
      v-if="poolWhitelisted"
      label="Input"
      v-model="percentage"
      :show-buttons="true"
    />

    <div class="d-flex justify-content-center mb-3">
      <font-awesome-icon icon="arrow-down" class="mt-3" />
    </div>

    <gray-border-block :gray-bg="true" class="my-3" v-if="false">
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
import { compareString, compareToken, findOrThrow } from "@/api/helpers";

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

  get poolWhitelisted() {
    return false;
  }

  get disableActionButton() {
    if (parseFloat(this.percentage) === 0) return true;
    else return this.inputError ? true : false;
  }

  get inputError() {
    if (parseFloat(this.percentage) === 0) return "Percentage can not be Zero";
    else return "";
  }

  get position() {
    const [poolId, first, second] = this.$route.params.id.split(":");

    const pos = findOrThrow(vxm.ethBancor.protectedLiquidity, position =>
      compareString(poolId, position.stake.poolId)
    );
    return pos;
  }

  async initAction() {
    this.modal = true;
    const [poolId, first, second] = this.$route.params.id.split(":");
    console.log({ poolId, first, second });
    try {
      const txRes = await vxm.ethBancor.unprotectLiquidity({
        id1: first,
        id2: second
      });
      console.log(txRes, "was tx res");
    } catch (e) {
      console.log("derp", e.message);
    }
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
