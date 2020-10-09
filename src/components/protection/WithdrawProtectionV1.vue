<template>
  <div class="mt-3">
    <label-content-split
      label="Stake"
      :value="`${formatNumber(position.stake.amount)} ${position.stake.symbol}`"
    />
    <!-- <label-content-split value="????" class="mb-2" /> -->

    <label-content-split
      v-if="poolWhitelisted"
      label="Fully Protected Value"
      value="????"
    />
    <label-content-split v-if="poolWhitelisted" value="????" />

    <alert-block
      v-if="warning"
      variant="warning"
      title="Important"
      :msg="warning"
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

    <modal-base title="You will receive" v-model="modal" @input="setDefault">
      <action-modal-status :error="error" :success="success" />

      <main-button
        @click="onModalClick"
        class="mt-3"
        :label="modalConfirmButton"
        :active="true"
        :large="true"
        :disabled="txBusy"
      />
    </modal-base>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import { TxResponse, ViewRelay } from "@/types/bancor";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MainButton from "@/components/common/Button.vue";
import PercentageSlider from "@/components/common/PercentageSlider.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import {
  compareString,
  compareToken,
  findOrThrow,
  formatNumber
} from "@/api/helpers";
import ModalBase from "@/components/modals/ModalBase.vue";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";

@Component({
  components: {
    ActionModalStatus,
    ModalBase,
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
  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";

  get poolWhitelisted() {
    return this.position.whitelisted;
  }

  get warning() {
    return this.position.whitelisted && this.position.coverageDecPercent !== 1
      ? "You still haven’t reached full coverage. There is a risk for impermanent loss."
      : "";
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
      compareString(position.id, this.$route.params.id)
    );
    console.log(pos, "is the selected pos");
    return pos;
  }

  async initAction() {
    this.setDefault();
    this.modal = true;
    this.txBusy = true;
    const [poolId, first, second] = this.$route.params.id.split(":");
    console.log({ poolId, first, second });
    try {
      let txHash: string;
      if (this.poolWhitelisted) {
        const txRes = await vxm.ethBancor.removeProtection({
          decPercent: Number(this.percentage) / 100,
          id: this.position.id
        });
      } else {
        const txRes = await vxm.ethBancor.unprotectLiquidity({
          id1: first,
          id2: second
        });
        this.success = txRes.txId;
      }
      this.$router.push({ name: "LiqProtection" });
    } catch (err) {
      this.error = err.message;
    } finally {
      this.txBusy = false;
    }
  }

  onModalClick() {
    if (this.success) {
      this.setDefault();
      this.modal = false;
    } else if (this.error) {
      this.initAction();
    }
  }

  formatNumber(amount: string) {
    return parseFloat(formatNumber(amount, 6));
  }

  setDefault() {
    this.error = "";
    this.success = null;
    this.txBusy = false;
  }

  get modalConfirmButton() {
    return this.error
      ? "Try Again"
      : this.success
      ? "Close"
      : this.txBusy
      ? "processing ..."
      : "Confirm";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
