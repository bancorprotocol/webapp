<template>
  <div class="mt-3">
    <alert-block :title="`${$t('add_liquidity_pool')}:`" class="my-3">
      <ol class="m-0 pl-3">
        <li>
          <a
            href="https://blog.bancor.network/how-to-stake-liquidity-earn-fees-on-bancor-bff8369274a1"
            target="_blank"
          >
            {{ `${$t("make_money_liquidity")}?` }}
          </a>
        </li>
        <li>
          <a
            href="https://blog.bancor.network/beginners-guide-to-getting-rekt-by-impermanent-loss-7c9510cb2f22"
            target="_blank"
          >
            {{ `${$t("impermanent_loss")}?` }}
          </a>
        </li>
        <li>
          <a
            href="https://bankless.substack.com/p/how-to-protect-yourself-from-impermanent"
            target="_blank"
          >
            {{ `${$t("protect_impermanent_loss")}?` }}
          </a>
        </li>
      </ol>
    </alert-block>

    <label-content-split :label="$t('stake_pool')" class="my-3">
      <pool-logos
        :pool="pool"
        :dropdown="true"
        :cursor="true"
        @click="openPoolSelectModal"
      />
      <modal-pool-select
        @select="selectPool"
        v-model="poolSelectModal"
        :pools="pools"
      />
    </label-content-split>

    <token-input-field
      :label="$t('stake_amount')"
      :token="token"
      v-model="amount"
      :disabled="focusedReserveIsDisabled"
      @input="amountChanged"
      :balance="balance"
      :error-msg="inputError"
      :tokens="tokens"
      @select="toggleReserveIndex"
    />

    <alert-block
      v-if="!isWhitelisted"
      variant="warning"
      :msg="whitelistWarning.msg"
      class="mt-3 mb-3"
    />

    <gray-border-block v-else-if="outputs.length" :gray-bg="true" class="my-3">
      <div>
        {{ outputs }}
        <label-content-split
          v-for="(output, index) in outputs"
          :key="output.id"
          :label="index == 0 ? $t('value_receive') : ''"
          :value="`${prettifyNumber(output.amount)} ${output.symbol}`"
        />
      </div>
    </gray-border-block>

    <alert-block
      v-if="focusedReserveIsDisabled"
      variant="error"
      :msg="$t(`available_reserve_only`, { availableReserveSymbol })"
      class="mt-3 mb-3"
    />

    <gray-border-block :gray-bg="true" class="my-3">
      <label-content-split
        :label="$t('space_available')"
        :loading="loading"
        :tooltip="`${$t('for_more_information')} `"
        :href-text="$t('click_here')"
        href="https://docs.bancor.network/faqs#why-is-there-no-space-available-for-my-tokens-in-certain-pools"
      >
        <span @click="setAmount(maxStakeAmount)" class="cursor">{{
          `${prettifyNumber(maxStakeAmount)} ${maxStakeSymbol}`
        }}</span>
      </label-content-split>
      <label-content-split
        v-if="amountToMakeSpace"
        class="mt-2"
        :label="
          $t('needed_open_space', { bnt: bnt.symbol, tkn: otherTkn.symbol })
        "
        :loading="loading"
      >
        <span @click="setAmount(amountToMakeSpace, 0)" class="cursor">{{
          `${prettifyNumber(amountToMakeSpace)} ${bnt.symbol}`
        }}</span>
      </label-content-split>
    </gray-border-block>

    <price-deviation-error
      v-model="priceDeviationTooHigh"
      :pool-id="pool.id"
      :token-contract="token.contract"
      class="mb-3"
      ref="priceDeviationError"
    />

    <main-button
      :label="actionButtonLabel"
      @click="openModal"
      :active="true"
      :large="true"
      :disabled="disableActionButton"
    />

    <modal-base
      :title="`${$t('staking_protecting')}:`"
      v-model="modal"
      @input="setDefault"
    >
      <b-row v-if="!(txBusy || success || error)">
        <b-col cols="12" class="text-center mb-3">
          <span
            class="font-size-24 font-w600"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            {{ `${prettifyNumber(amount)} ${token.symbol}` }}
          </span>
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
import { Component, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import { i18n } from "@/i18n";
import { Step, TxResponse, ViewRelay, ViewAmountDetail } from "@/types/bancor";
import TokenInputField from "@/components/common/TokenInputField.vue";
import BigNumber from "bignumber.js";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import {
  formatUnixTime,
  formatNumber,
  compareString,
  findOrThrow
} from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import dayjs from "@/utils/dayjs";
import PoolLogos from "@/components/common/PoolLogos.vue";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import Vue from "vue";
import PriceDeviationError from "@/components/common/PriceDeviationError.vue";

@Component({
  components: {
    PriceDeviationError,
    ModalPoolSelect,
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
export default class AddProtectionSingle extends BaseComponent {
  get pool(): ViewRelay {
    const [poolId] = this.$route.params.id.split(":");
    return vxm.bancor.relay(poolId);
  }

  maxStakeAmount: string = "";
  maxStakeSymbol: string = "";
  amountToMakeSpace: string = "";
  priceDeviationTooHigh: boolean = false;

  loading: boolean = false;

  amount: string = "";

  modal = false;
  poolSelectModal = false;

  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";
  sections: Step[] = [];
  stepIndex = 0;
  preTxError = "";
  outputs: ViewAmountDetail[] = [];

  selectedTokenIndex = 0;

  private interval: any;

  @Watch("token")
  async onTokenChange() {
    await this.load();
    await this.loadRecentAverageRate();
  }

  toggleReserveIndex(x: string) {
    this.preTxError = "";
    this.selectedTokenIndex = this.pool.reserves.findIndex(
      reserve => reserve.id == x
    );
    this.amountChanged(this.amount);
  }

  get token() {
    return this.pool.reserves[this.selectedTokenIndex];
  }

  get bnt() {
    return this.pool.reserves[0];
  }

  get otherTkn() {
    return this.pool.reserves[1];
  }

  get opposingToken() {
    return this.pool.reserves.find(
      (reserve, index) => index !== this.selectedTokenIndex
    );
  }

  disabledReserves: string[] = [];

  get tokens() {
    return this.pool.reserves;
  }

  get focusedReserveIsDisabled() {
    return this.disabledReserves.some(reserveId =>
      compareString(reserveId, this.token.id)
    );
  }

  get availableReserveSymbol() {
    return this.pool.reserves.find(
      reserve =>
        !this.disabledReserves.some(reserveId =>
          compareString(reserveId, reserve.id)
        )
    )!.symbol;
  }

  get pools() {
    return vxm.bancor.relays.filter(x => x.whitelisted);
  }

  get isWhitelisted() {
    return this.pool.whitelisted;
  }

  get balance() {
    const poolBalance = vxm.ethBancor.tokenBalance(this.token.id);
    return poolBalance ? poolBalance.balance : "0";
  }

  get fullCoverageDate() {
    const maxDelayTime = vxm.ethBancor.liquidityProtectionSettings.maxDelay;
    const currentTime = dayjs().unix();
    return formatUnixTime(currentTime + maxDelayTime).date;
  }

  get actionButtonLabel() {
    if (!this.amount) return i18n.t("enter_amount");
    else if (this.priceDeviationTooHigh) return i18n.t("price_deviation_high");
    else return i18n.t("stake_protect");
  }

  get disableActionButton() {
    if (this.focusedReserveIsDisabled) return true;
    if (!this.amount) return true;
    else if (this.priceDeviationTooHigh) return true;
    else if (this.loading) return true;
    else return this.inputError ? true : false;
  }

  get inputError() {
    if (this.amount == "") return "";
    if (this.preTxError) return this.preTxError;
    if (parseFloat(this.amount) === 0) return i18n.t("amount_not_zero");

    const amountNumber = new BigNumber(this.amount);
    const balanceNumber = new BigNumber(this.balance || 0);

    if (amountNumber.gt(balanceNumber)) return i18n.t("insufficient_balance");
    else return "";
  }

  get whitelistWarning() {
    const msg = i18n.t("pool_not_approved");
    const show = true;

    return { show, msg };
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
    } else if (this.error || this.inputError) {
      this.modal = false;
      this.setDefault();
      return;
    }

    this.txBusy = true;
    try {
      const txRes = await vxm.ethBancor.addProtection({
        poolId: this.pool.id,
        reserveAmount: {
          id: this.token.id,
          amount: this.amount
        },
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

  async amountChanged(tokenAmount: string) {
    const input = new BigNumber(tokenAmount);
    const inputIsNumber = !input.isNaN() && input.isGreaterThan(0);

    console.log(inputIsNumber);
    if (inputIsNumber) {
      const res = await vxm.ethBancor.calculateProtectionSingle({
        poolId: this.pool.id,
        reserveAmount: { id: this.token.id, amount: this.amount }
      });
      this.outputs = res.outputs;

      console.log(res, "was res");

      const errorMsg = `${this.token.symbol} limit reached. Additional ${
        this.opposingToken!.symbol
      } liquidity should be staked to allow for ${
        this.token.symbol
      } single-sided staking.`;

      if (res.error) {
        this.preTxError =
          res.error == "balance"
            ? i18n.tc("insufficient_store_balance")
            : errorMsg;
      } else {
        this.preTxError = "";
      }
    } else {
      this.outputs = [];
    }
  }

  async openModal() {
    if (this.currentUser) this.modal = true;
    // @ts-ignore
    else await this.promptAuth();
  }

  openPoolSelectModal() {
    this.poolSelectModal = true;
  }

  setDefault() {
    this.sections = [];
    this.error = "";
    this.success = null;
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

  async loadRecentAverageRate() {
    await (this.$refs.priceDeviationError as Vue & {
      loadRecentAverageRate: () => boolean;
    }).loadRecentAverageRate();
  }

  async selectPool(id: string) {
    await this.$router.replace({
      name: "AddProtectionSingle",
      params: { id }
    });
  }

  async fetchAndSetMaxStakes(poolId: string) {
    this.amountToMakeSpace = "";

    const res = await vxm.ethBancor.getAvailableAndAmountToGetSpace({
      poolId
    });
    const availableSpace = res.availableSpace;

    const selectedToken = findOrThrow(
      availableSpace,
      space => compareString(space.token, this.token.symbol),
      "Failed finding focused token in available space"
    );
    this.maxStakeAmount = selectedToken.amount;
    this.maxStakeSymbol = selectedToken.token;

    if (res.amountToGetSpace) this.amountToMakeSpace = res.amountToGetSpace;
  }

  async fetchAndSetDisabledReserves(poolId: string) {
    const disabledReserves = await vxm.ethBancor.fetchDisabledReserves(poolId);
    this.disabledReserves = disabledReserves;
  }

  async load() {
    if (this.loading) return;
    this.loading = true;
    try {
      await Promise.all([
        this.fetchAndSetMaxStakes(this.pool.id),
        this.fetchAndSetDisabledReserves(this.pool.id)
      ]);
    } catch (e) {
      console.error(e.message);
    } finally {
      this.loading = false;
    }
  }

  setAmount(amount: string, switchToken: number = -1) {
    if (switchToken != -1 && this.selectedTokenIndex != switchToken)
      this.selectedTokenIndex = switchToken;
    this.amount = parseFloat(amount) > 0 ? amount : "0";
  }

  async mounted() {
    await this.load();
    await this.loadRecentAverageRate();
    this.interval = setInterval(async () => {
      await this.load();
      await this.loadRecentAverageRate();
    }, 30000);
  }

  destroyed() {
    clearInterval(this.interval);
  }
}
</script>

<style scoped lang="scss"></style>
