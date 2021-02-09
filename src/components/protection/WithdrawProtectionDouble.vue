<template>
  <div class="mt-3">
    <label-content-split label="Stake in Pool" class="mt-3">
      <pool-logos :pool="pool" :label="formatNumber(position.stake.amount)" />
    </label-content-split>

    <alert-block
      v-if="warning"
      variant="warning"
      title="Important"
      :msg="warning"
      class="my-3"
    />

    <alert-block
      v-if="inputError"
      variant="error"
      title="Important"
      :msg="inputError"
      class="my-3"
    />

    <percentage-slider
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
      <action-modal-status
        :error="error"
        :success="success"
        msg="BNT withdrawals are subject to a 24h lock period before they can be claimed."
      />

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
import { Component } from "vue-property-decorator";
import { vxm } from "@/store/";
import { TxResponse } from "@/types/bancor";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MainButton from "@/components/common/Button.vue";
import PercentageSlider from "@/components/common/PercentageSlider.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import { compareString, findOrThrow, formatNumber } from "@/api/helpers";
import ModalBase from "@/components/modals/ModalBase.vue";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import LogoAmountSymbol from "@/components/common/LogoAmountSymbol.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import BigNumber from "bignumber.js";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    LogoAmountSymbol,
    ActionModalStatus,
    ModalBase,
    AlertBlock,
    PoolLogos,
    PercentageSlider,
    LabelContentSplit,
    GrayBorderBlock,
    MainButton
  }
})
export default class WithdrawProtectionDouble extends BaseComponent {
  percentage: string = "50";

  modal = false;
  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";

  get pool() {
    return vxm.ethBancor.relay(this.poolIds.poolId);
  }

  get warning() {
    return this.position.coverageDecPercent !== 1
      ? "You still haven’t reached full coverage. There is a risk for impermanent loss."
      : "";
  }

  get disableActionButton() {
    if (parseFloat(this.percentage) === 0) return true;
    else return this.inputError ? true : false;
  }

  get inputError() {
    if (!this.sufficientVBnt) {
      return `Insufficient vBNT balance, you must hold ${this.position.givenVBnt} vBNT before withdrawing position.`;
    }
    return parseFloat(this.percentage) === 0
      ? "Percentage can not be Zero"
      : "";
  }

  get position() {
    const positions = vxm.ethBancor.protectedPositions;
    console.log(positions, "x");
    const pos = findOrThrow(positions, position =>
      compareString(position.id, this.$route.params.id)
    );
    console.log(pos, "is the selected pos", this.pool, "is the pass pool");
    return pos;
  }

  get poolIds() {
    const [poolId, first, second] = this.$route.params.id.split(":");
    return {
      poolId,
      first,
      second
    };
  }

  get sufficientVBnt() {
    return new BigNumber(this.position.givenVBnt!).isLessThanOrEqualTo(
      this.vBntBalance
    );
  }

  get vBntBalance() {
    const balance = vxm.ethBancor.tokenBalance(
      vxm.ethBancor.liquidityProtectionSettings.govToken
    );
    return balance ? balance.balance : "0";
  }

  async initAction() {
    this.setDefault();
    this.modal = true;
    this.txBusy = true;
    const { poolId, first, second } = this.poolIds;
    console.log({ poolId, first, second });
    try {
      const txRes = await vxm.ethBancor.removeProtection({
        decPercent: Number(this.percentage) / 100,
        id: this.position.id
      });
      this.success = txRes;
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
      this.$router.push({ name: "LiqProtection" });
    } else if (this.error) {
      this.setDefault();
      this.modal = false;
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
      ? "Close"
      : this.success
      ? "Close"
      : this.txBusy
      ? "processing ..."
      : "Confirm";
  }
}
</script>

<style scoped lang="scss"></style>
