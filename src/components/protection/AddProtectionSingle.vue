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

    <alert-block
      v-if="priceDeviationTooHigh && !inputError && amount"
      variant="error"
      :msg="$t('price_volatility')"
    />

    <gray-border-block v-else-if="outputs.length" :gray-bg="true" class="my-3">
      <div>
        {{ outputs }}
        <label-content-split
          v-for="(output, index) in outputs"
          :key="output.id"
          :label="index == 0 ? $t('value_receive') : ''"
          :value="`${formatNumber(output.amount)} ${output.symbol}`"
        />
      </div>
    </gray-border-block>

    <gray-border-block :gray-bg="true" class="my-3">
      <label-content-split
        :label="$t('space_available')"
        :loading="loadingMaxStakes"
      >
        <span @click="setAmount" class="cursor">{{
          `${prettifyNumber(maxStakeAmount)} ${maxStakeSymbol}`
        }}</span>
      </label-content-split>
    </gray-border-block>

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
            {{ `${formatNumber(amount)} ${token.symbol}` }}
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
import { formatUnixTime, formatNumber } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import dayjs from "@/utils/dayjs";
import PoolLogos from "@/components/common/PoolLogos.vue";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
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
  priceDeviationTooHigh: boolean = false;

  loadingMaxStakes = false;

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
    await this.loadMaxStakes();
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

  get opposingToken() {
    return this.pool.reserves.find(
      (reserve, index) => index !== this.selectedTokenIndex
    );
  }

  get tokens() {
    return this.pool.reserves;
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
    if (!this.amount) return true;
    else if (this.priceDeviationTooHigh) return true;
    else if (this.loadingMaxStakes) return true;
    else return this.inputError ? true : false;
  }

  get inputError() {
    if (this.amount == "") return "";
    if (this.preTxError) return this.preTxError;
    if (parseFloat(this.amount) === 0) return i18n.t("amount_not_Zero");

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

      const errorMsg = i18n.tc("limit_reached", 0, {
        token: this.token.symbol,
        opposingToken: this.opposingToken!.symbol
      });

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

  async loadRecentAverageRate() {
    this.priceDeviationTooHigh = await vxm.bancor.checkPriceDeviationTooHigh({
      relayId: this.pool.id,
      selectedTokenAddress: this.token.contract
    });

    console.log("priceDeviationTooHigh", this.priceDeviationTooHigh);
  }

  async selectPool(id: string) {
    await this.$router.replace({
      name: "AddProtectionSingle",
      params: { id }
    });
  }

  async loadMaxStakes() {
    if (this.loadingMaxStakes) return;
    this.loadingMaxStakes = true;
    try {
      const result = await vxm.ethBancor.getMaxStakesView({
        poolId: this.pool.id
      });
      let stake = result.filter(x => x.token === this.token.symbol);
      if (stake.length === 1) {
        this.maxStakeAmount = stake[0].amount;
        this.maxStakeSymbol = stake[0].token;
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.loadingMaxStakes = false;
    }
  }

  setAmount() {
    this.amount =
      parseFloat(this.maxStakeAmount) > 0 ? this.maxStakeAmount : "0";
  }

  async mounted() {
    await this.loadMaxStakes();
    await this.loadRecentAverageRate();
    this.interval = setInterval(async () => {
      await this.loadMaxStakes();
      await this.loadRecentAverageRate();
    }, 30000);
  }

  destroyed() {
    clearInterval(this.interval);
  }
}
</script>

<style scoped lang="scss"></style>
