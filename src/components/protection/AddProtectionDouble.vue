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
          :label="index === 0 ? $t('value_receive') : ''"
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

    <!--    <modal-base
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
    </modal-base>-->

    <modal-tx-action
      title="Confirm Stake & Protect"
      icon="coins"
      :tx-meta.sync="txMeta"
      @onConfirm="initStake"
      redirect-on-success="LiqProtection"
    >
      <gray-border-block>
        <span
          class="font-size-12"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          You are staking and protecting
        </span>
        <div
          class="font-w500 font-size-14"
          v-text="`${prettifyNumber(amount)} ${token.symbol}`"
        />
      </gray-border-block>
    </modal-tx-action>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store/";
import { i18n } from "@/i18n";
import { ViewAmountDetail, ViewRelay } from "@/types/bancor";
import TokenInputField from "@/components/common/TokenInputField.vue";
import BigNumber from "bignumber.js";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import { compareString, formatNumber, formatUnixTime } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import dayjs from "@/utils/dayjs";
import PoolLogos from "@/components/common/PoolLogos.vue";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import BaseTxAction from "@/components/BaseTxAction.vue";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";

@Component({
  components: {
    ModalTxAction,
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
export default class AddProtectionDouble extends BaseTxAction {
  get pool(): ViewRelay {
    const [poolId] = this.$route.params.id.split(":");
    return vxm.bancor.relay(poolId);
  }

  amount: string = "";
  error = "";

  outputs: ViewAmountDetail[] = [];

  get pools() {
    return vxm.bancor.relays.filter(x => x.liquidityProtection);
  }

  get balance() {
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
    else return !!this.inputError;
  }

  get inputError() {
    if (parseFloat(this.amount) === 0) return i18n.t("amount_not_zero");

    const amountNumber = new BigNumber(this.amount);
    const balanceNumber = new BigNumber(this.balance || 0);

    if (amountNumber.gt(balanceNumber)) return i18n.t("insufficient_balance");
    else return "";
  }

  async initStake() {
    this.txMeta.txBusy = true;
    try {
      this.txMeta.success = await vxm.ethBancor.protectLiquidity({
        amount: { amount: this.amount, id: this.pool.id },
        onUpdate: this.onUpdate,
        onPrompt: this.onPrompt
      });
      this.amount = "";
    } catch (e) {
      this.txMeta.txError = e.message;
      this.txMeta.txBusy = false;
    }
  }

  formatNumber(amount: string) {
    return formatNumber(amount, 6);
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
