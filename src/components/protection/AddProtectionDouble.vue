<template>
  <div class="mt-3">
    <token-input-field
      :label="$t('stake_amount')"
      :pool="pool"
      v-model="amount"
      @input="amountChanged"
      :balance="balance"
      :error-msg="inputError"
      :pools="pools"
      @select="selectPool"
    />

    <div v-if="amount">
      <gray-border-block :gray-bg="true" class="mt-3">
        <label-content-split
          v-for="(output, index) in outputs"
          :key="output.id"
          :label="index == 0 ? $t('value_receive') : ''"
          :value="`${formatNumber(output.amount)} ${output.symbol}`"
        />
      </gray-border-block>
    </div>

    <main-button
      :label="actionButtonLabel"
      @click="openModal"
      :active="true"
      :large="true"
      :disabled="disableActionButton"
      class="mt-3"
    />

    <modal-base
      :title="$t('adding_liquidity_protection')"
      v-model="modal"
      @input="setDefault"
    >
      <b-row v-if="!(txBusy || success || error)">
        <b-col cols="12" class="text-center mb-3">
          <span
            class="font-size-24 font-w600"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            {{ `${formatNumber(amount)} ${pool.name}` }}
          </span>
        </b-col>
        <b-col v-if="false" cols="12">
          <gray-border-block>
            <label-content-split label="???" value="????" />
            <label-content-split label="???" value="????" />
            <label-content-split label="???" value="????" />
          </gray-border-block>
        </b-col>
      </b-row>

      <action-modal-status
        v-else
        :error="error"
        :success="success"
        :step-description="currentStatus"
      />

      <main-button
        @click="initAction"
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
import { i18n } from "@/i18n";
import { Step, TxResponse, ViewAmountDetail, ViewRelay } from "@/types/bancor";
import TokenInputField from "@/components/common/TokenInputField.vue";
import BigNumber from "bignumber.js";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import { compareString, formatUnixTime, formatNumber } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import dayjs from "@/utils/dayjs";
import PoolLogos from "@/components/common/PoolLogos.vue";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    ActionModalStatus,
    PoolLogos,
    ModalBase,
    AlertBlock,
    LabelContentSplit,
    GrayBorderBlock,
    TokenInputField,
    MainButton
  }
})
export default class AddProtectionDouble extends BaseComponent {
  get pool(): ViewRelay {
    const [poolId] = this.$route.params.id.split(":");
    return vxm.bancor.relay(poolId);
  }

  amount: string = "";

  modal = false;
  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";
  sections: Step[] = [];
  stepIndex = 0;
  outputs: ViewAmountDetail[] = [];

  get pools() {
    return vxm.bancor.relays.filter(x => x.liquidityProtection);
  }

  get balance() {
    console.log(vxm.ethBancor.poolTokenPositions, "are pool token positions");
    const poolBalance = vxm.ethBancor.poolTokenPositions.find(position =>
      compareString(position.relay.id as string, this.pool.id)
    );
    return poolBalance ? poolBalance.smartTokenAmount : "0";
  }

  get fullCoverageDate() {
    const maxDelayTime = vxm.ethBancor.liquidityProtectionSettings.maxDelay;
    const currentTime = dayjs().unix();
    return formatUnixTime(currentTime + maxDelayTime).date;
  }

  get actionButtonLabel() {
    if (!this.amount) return i18n.t("enter_amount");
    else return i18n.t("stake_protect");
  }

  get disableActionButton() {
    if (!this.amount) return true;
    else return this.inputError ? true : false;
  }

  get inputError() {
    if (parseFloat(this.amount) === 0) return i18n.t("amount_not_zero");

    const amountNumber = new BigNumber(this.amount);
    const balanceNumber = new BigNumber(this.balance || 0);

    if (amountNumber.gt(balanceNumber)) return i18n.t("insufficient_balance");
    else return "";
  }

  get modalConfirmButton() {
    return this.error
      ? i18n.t("close")
      : this.success
      ? i18n.t("close")
      : this.txBusy
      ? `${i18n.t("processing")}...`
      : i18n.t("confirm");
  }

  async initAction() {
    if (this.success) {
      this.setDefault();
      this.modal = false;
      this.$router.push({ name: "LiqProtection" });
      return;
    } else if (this.error) {
      this.modal = false;
      this.setDefault();
      return;
    }

    this.txBusy = true;
    try {
      const txRes = await vxm.ethBancor.protectLiquidity({
        amount: { amount: this.amount, id: this.pool.id },
        onUpdate: this.onUpdate
      });
      this.success = txRes;
      this.amount = "";
    } catch (e) {
      this.error = e.message;
    } finally {
      this.txBusy = false;
    }
  }

  async openModal() {
    if (this.currentUser) this.modal = true;
    // @ts-ignore
    else await this.promptAuth();
  }

  setDefault() {
    this.sections = [];
    this.error = "";
    this.success = null;
  }

  formatNumber(amount: string) {
    return formatNumber(amount, 6);
  }

  get currentStatus() {
    if (this.sections.length) {
      return this.sections[this.stepIndex].description;
    }
    return undefined;
  }

  onUpdate(index: number, steps: any[]) {
    this.sections = steps;
    this.stepIndex = index;
  }

  async selectPool(id: string) {
    await this.$router.replace({
      name: "AddProtectionDouble",
      params: { id }
    });
  }

  async amountChanged() {
    const res = await vxm.ethBancor.calculateProtectionDouble({
      poolTokenAmount: { amount: this.amount, id: this.pool.id }
    });

    this.outputs = res.outputs;
    if (res.error) {
      this.error = res.error;
    } else {
      this.error = "";
    }
  }
}
</script>

<style scoped lang="scss"></style>
