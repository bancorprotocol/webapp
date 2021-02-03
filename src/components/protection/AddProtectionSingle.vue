<template>
  <div class="mt-3">
    <alert-block
      title="Learn what it means to add liquidity to a pool:"
      class="my-3"
    >
      <ol class="m-0 pl-3">
        <li>
          <a
            href="https://blog.bancor.network/how-to-stake-liquidity-earn-fees-on-bancor-bff8369274a1"
            target="_blank"
          >
            How do I make money by providing liquidity?
          </a>
        </li>
        <li>
          <a
            href="https://blog.bancor.network/beginners-guide-to-getting-rekt-by-impermanent-loss-7c9510cb2f22"
            target="_blank"
          >
            What is impermanent loss?
          </a>
        </li>
        <li>
          <a
            href="https://bankless.substack.com/p/how-to-protect-yourself-from-impermanent"
            target="_blank"
          >
            How does Bancor protect me from impermanent loss?
          </a>
        </li>
      </ol>
    </alert-block>

    <label-content-split label="Stake in Pool" class="my-3">
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
      label="Stake Amount"
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
      msg="Due to price volatility, protecting your tokens is currently not available. Please try again in a few seconds."
    />

    <gray-border-block v-else-if="outputs.length" :gray-bg="true" class="my-3">
      <div>
        {{ outputs }}
        <label-content-split
          v-for="(output, index) in outputs"
          :key="output.id"
          :label="index == 0 ? `Value you receive` : ``"
          :value="`${prettifyNumber(output.amount)} ${output.symbol}`"
        />
      </div>
    </gray-border-block>

    <gray-border-block :gray-bg="true" class="my-3">
      <label-content-split
        label="Space Available"
        :loading="loading"
        tooltip="For more information "
        hrefText="click here"
        href="https://docs.bancor.network/faqs#why-is-there-no-space-available-for-my-tokens-in-certain-pools"
      >
        <span @click="setAmount(maxStakeAmount)" class="cursor">{{
          `${prettifyNumber(maxStakeAmount)} ${maxStakeSymbol}`
        }}</span>
      </label-content-split>
      <label-content-split
        v-if="amountToMakeSpace"
        class="mt-2"
        :label="`${bnt.symbol} needed to open up ${otherTkn.symbol} space`"
        :loading="loading"
      >
        <span @click="setAmount(amountToMakeSpace, 0)" class="cursor">{{
          `${prettifyNumber(amountToMakeSpace)} ${bnt.symbol}`
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
      title="You are staking and protecting:"
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
    if (!this.amount) return "Enter an Amount";
    else if (this.priceDeviationTooHigh) return "Price Deviation too High";
    else return "Stake and Protect";
  }

  get disableActionButton() {
    if (!this.amount) return true;
    else if (this.priceDeviationTooHigh) return true;
    else if (this.loading) return true;
    else return this.inputError ? true : false;
  }

  get inputError() {
    if (this.amount == "") return "";
    if (this.preTxError) return this.preTxError;
    if (parseFloat(this.amount) === 0) return "Amount can not be Zero";

    const amountNumber = new BigNumber(this.amount);
    const balanceNumber = new BigNumber(this.balance || 0);

    if (amountNumber.gt(balanceNumber)) return "Insufficient balance";
    else return "";
  }

  get whitelistWarning() {
    const msg =
      "Pool you have selected is not approved for protection. Your stake will provide you with gBNT voting power which can be used to propose including it. If is approved, your original stake time will be used for vesting.";
    const show = true;

    return { show, msg };
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
          res.error == "Insufficient store balance" ? errorMsg : res.error;
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

  async load() {
    if (this.loading) return;
    this.loading = true;
    this.amountToMakeSpace = "";
    try {
      const res = await vxm.ethBancor.getAvailableAndAmountToGetSpace({
        poolId: this.pool.id
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
    } catch (e) {
      console.log(e.message);
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
