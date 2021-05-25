<template>
  <div class="mt-3">
    <label-content-split :label="$t('pool')" class="my-4">
      <pool-logos @click="poolLogosClick" :pool="pool" />
    </label-content-split>
    <label-content-split
      :label="$t('claimable_amount')"
      :tooltip="$t('not_include_liquidity_rewards')"
    >
      <logo-amount-symbol
        :pool-id="position.stake.poolId"
        :amount="prettifyNumber(position.protectedAmount.amount)"
        :symbol="position.stake.symbol"
      />
    </label-content-split>

    <alert-block
      v-if="priceDeviationTooHigh && !inputError"
      variant="error"
      class="mb-3"
      msg="Due to price volatility, withdrawing your tokens is currently not available. Please try again in a few minutes."
    />

    <alert-block
      v-if="warning"
      variant="warning"
      :title="$t('important')"
      :messages="
        rewardsWithMultiplier ? [warning, $t('withdraw_reset')] : [warning]
      "
      class="my-3"
    />

    <percentage-slider
      class="mt-3"
      :label="$t('input')"
      v-model="percentage"
      @input="onPercentUpdate"
      :show-buttons="true"
    />

    <alert-block
      v-if="inputError"
      variant="error"
      :msg="inputError"
      class="mt-3"
    />

    <div class="d-flex justify-content-center mb-3">
      <font-awesome-icon icon="arrow-down" class="mt-3" />
    </div>

    <gray-border-block :gray-bg="true" class="my-3">
      <label-content-split
        v-if="expectedValue"
        :label="$t('output_value')"
        :value="`${prettifyNumber(expectedValue.amount)} ${
          expectedValue.symbol
        }`"
      />

      <label-content-split
        v-for="(output, index) in outputs"
        :label="index === 0 ? $t('output_breakdown') : ''"
        :key="output.id"
        :value="`${prettifyNumber(output.amount)} ${output.symbol}`"
      />
      <span
        class="font-size-14 font-w400 mt-2"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >{{ outputInfo }}</span
      >
    </gray-border-block>

    <alert-block
      v-if="vBntWarning"
      variant="error"
      :msg="vBntWarning"
      class="my-3"
    />

    <main-button
      :label="$t('continue')"
      @click="initAction"
      :active="true"
      :large="true"
      :disabled="disableActionButton"
    />

    <modal-tx-action
      title="Confirm Withdraw"
      icon="arrow-up"
      :tx-meta.sync="txMeta"
      redirect-on-success="Portfolio"
    >
      <gray-border-block>
        <span
          class="font-size-12"
          :class="darkMode ? 'text-muted-dark' : 'text-muted'"
          v-text="`${percentage}% of your protected position`"
        />
        <div
          v-if="expectedValue"
          class="font-size-14 font-w500 mb-1"
          v-text="
            `~${prettifyNumber(expectedValue.amount)} ${expectedValue.symbol}`
          "
        />
      </gray-border-block>
      <div class="mt-3" v-if="outputs.length > 1">
        <span
          class="font-size-12"
          :class="darkMode ? 'text-muted-dark' : 'text-muted'"
        >
          You will receive
        </span>
        <gray-border-block gray-bg="true" class="mt-1">
          <label-content-split
            v-for="output in outputs"
            :label="output.symbol"
            :key="output.id"
            :value="prettifyNumber(output.amount)"
          />
        </gray-border-block>
      </div>

      <p
        class="font-size-12 my-3 text-left pl-3"
        :class="darkMode ? 'text-muted-dark' : 'text-muted'"
      >
        {{ outputInfo }}
      </p>
    </modal-tx-action>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store/";
import { i18n } from "@/i18n";
import { TxResponse, ViewAmountDetail, ViewRelay } from "@/types/bancor";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MainButton from "@/components/common/Button.vue";
import PercentageSlider from "@/components/common/PercentageSlider.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import { compareString, findOrThrow } from "@/api/helpers";
import ModalBase from "@/components/modals/ModalBase.vue";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import LogoAmountSymbol from "@/components/common/LogoAmountSymbol.vue";
import BigNumber from "bignumber.js";
import BaseTxAction from "@/components/BaseTxAction.vue";
import { addNotification } from "@/components/compositions/notifications";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";

@Component({
  components: {
    ModalTxAction,
    LogoAmountSymbol,
    ActionModalStatus,
    ModalBase,
    AlertBlock,
    PercentageSlider,
    LabelContentSplit,
    GrayBorderBlock,
    MainButton,
    PoolLogos
  }
})
export default class WithdrawProtectionSingle extends BaseTxAction {
  get pool(): ViewRelay {
    return vxm.bancor.relay(this.position.stake.poolId);
  }
  percentage: string = "50";
  modal = false;
  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";

  outputs: ViewAmountDetail[] = [];
  expectedValue: ViewAmountDetail | null = null;
  priceDeviationTooHigh: boolean = false;

  get warning() {
    return this.position.whitelisted && this.position.coverageDecPercent !== 1
      ? i18n.t("havent_reached_protection")
      : "";
  }

  get disableActionButton() {
    if (this.vBntWarning) return true;
    else if (!this.percentage || parseFloat(this.percentage) === 0) return true;
    else if (this.priceDeviationTooHigh) return true;
    else return this.inputError ? true : false;
  }

  get inputError() {
    const percentage = parseFloat(this.percentage);
    if (percentage === 0) return i18n.t("percentage_not_zero");
    if (percentage > 100) return i18n.t("percentage_not_100");

    return "";
  }

  get outputInfo() {
    const isBnt =
      this.outputs.length === 1 && this.outputs.find(o => o.symbol === "BNT");
    const isTknWithBnt =
      this.outputs.length === 2 && this.outputs.find(o => o.symbol === "BNT");
    if (isBnt) return i18n.t("bnt_withdrawls");
    else if (isTknWithBnt) return i18n.t("part_output_bnt");
    else return "";
  }

  get position() {
    const pos = findOrThrow(vxm.ethBancor.protectedPositions, position =>
      compareString(position.id, this.$route.params.id)
    );
    return pos;
  }

  get rewardsWithMultiplier() {
    return vxm.ethBancor.protectedPositions.some(
      position => position.rewardsMultiplier && position.rewardsMultiplier > 1
    );
  }

  get vBntWarning() {
    const givenVBnt =
      Number(this.position.givenVBnt!) * (Number(this.percentage) / 100);

    if (this.position.givenVBnt && !this.sufficientVBnt) {
      const missingVBnt = givenVBnt - Number(this.vBntBalance);
      return i18n.t("insufficient_vBNT_balance_missing", {
        amount: this.prettifyNumber(givenVBnt),
        missing: this.prettifyNumber(missingVBnt)
      });
    } else return "";
  }

  get sufficientVBnt() {
    if (this.vBntBalance === null || !this.percentage) return true;
    if (this.position.givenVBnt) {
      const decPercent = new BigNumber(this.percentage).div(100);
      const proposedWithdraw = new BigNumber(this.position.givenVBnt).times(
        decPercent
      );
      return proposedWithdraw.isLessThanOrEqualTo(this.vBntBalance);
    } else return true;
  }

  vBntBalance: BigNumber | null = null;

  get isVoteLoaded() {
    return vxm.ethGovernance.isLoaded;
  }

  async loadVBntBalance() {
    this.vBntBalance = this.currentUser
      ? await vxm.ethGovernance.getBalance({
          account: this.currentUser
        })
      : new BigNumber(0);
  }

  async initAction() {
    this.openModal();
    if (this.txMeta.txBusy) return;
    this.txMeta.txBusy = true;
    try {
      this.txMeta.success = await vxm.ethBancor.removeProtection({
        decPercent: Number(this.percentage) / 100,
        id: this.position.id,
        onPrompt: this.onPrompt
      });
      this.txMeta.showTxModal = false;
      addNotification({
        title: "Withdraw Protection",
        description: `Withdraw ~${this.prettifyNumber(
          this.expectedValue!.amount
        )} ${this.expectedValue!.symbol} from your protected position in pool ${
          this.pool.name
        }.`,
        txHash: this.txMeta.success.txId
      });
    } catch (err) {
      this.txMeta.txError = err.message;
    } finally {
      this.txMeta.txBusy = false;
    }
  }

  onModalClick() {
    if (this.success) {
      this.setDefault();
      this.modal = false;
      this.$router.push({ name: "Portfolio", params: { scroll: "true" } });
    } else if (this.error) {
      this.setDefault();
      this.modal = false;
    }
  }

  setDefault() {
    this.error = "";
    this.success = null;
    this.txBusy = false;
  }

  async onPercentUpdate(newPercent: string) {
    const percentage = Number(this.percentage) / 100;
    if (!percentage) return;
    const res = await vxm.ethBancor.calculateSingleWithdraw({
      id: this.position.id,
      decPercent: percentage
    });
    await this.loadRecentAverageRate();

    this.expectedValue = res.expectedValue;
    this.outputs = res.outputs;
  }

  get tokenContract() {
    const reserve = this.pool.reserves.find(
      x => x.symbol === this.position.stake.symbol
    );
    if (reserve) return reserve.contract;
    else return "";
  }

  async loadRecentAverageRate() {
    this.priceDeviationTooHigh = await vxm.bancor.checkPriceDeviationTooHigh({
      relayId: this.pool.id,
      selectedTokenAddress: this.tokenContract
    });
  }

  private interval: any;

  async mounted() {
    if (!this.isVoteLoaded) await vxm.ethGovernance.init();
    await this.onPercentUpdate(this.percentage);
    await this.loadVBntBalance();
    this.interval = setInterval(async () => {
      await this.loadVBntBalance();
      await this.loadRecentAverageRate();
    }, 10000);
  }

  destroyed() {
    clearInterval(this.interval);
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
}
</script>

<style scoped lang="scss"></style>
