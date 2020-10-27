<template>
  <div class="mt-3">
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

    <gray-border-block v-else-if="amount" :gray-bg="true" class="my-3">
      <div>
        <label-content-split
          v-for="(output, index) in outputs"
          :key="output.id"
          :label="index == 0 ? `Value you receive` : ``"
          :value="`${formatNumber(output.amount)} ${output.symbol}`"
        />
      </div>
    </gray-border-block>

    <gray-border-block :gray-bg="true" class="mt-3">
      <label-content-split
        label="Currently Available"
        :value="loadingMaxStakes ? '' : currentlyAvailable"
      />
    </gray-border-block>

    <label-content-split
      label="Full Coverage Date"
      :value="fullCoverageDate"
      class="my-3"
    />

    <main-button
      :label="actionButtonLabel"
      @click="openModal"
      :active="true"
      :large="true"
      :disabled="disableActionButton"
    />

    <modal-base
      title="You are adding liquidity protection"
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
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import { Step, TxResponse, ViewRelay, ViewAmountDetail } from "@/types/bancor";
import TokenInputField from "@/components/common/TokenInputField.vue";
import BigNumber from "bignumber.js";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import {
  formatUnixTime,
  formatNumber,
  buildPoolName, prettifyNumber
} from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import moment from "moment";
import PoolLogos from "@/components/common/PoolLogos.vue";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";

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
export default class AddProtectionSingle extends Vue {
  get pool(): ViewRelay {
    const [poolId] = this.$route.params.id.split(":");
    return vxm.bancor.relay(poolId);
  }

  maxStakes: any = null;

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

  @Watch("token")
  async onTokenChange() {
    await this.loadMaxStakes();
  }

  toggleReserveIndex(x: string) {
    this.preTxError = "";
    this.selectedTokenIndex = this.pool.reserves.findIndex(
      reserve => reserve.id == x
    );
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

  get currentlyAvailable() {
    return `${prettifyNumber(this.maxStakes ?? "0")} ${this.token.symbol}`
  }

  get pools() {
    return vxm.bancor.relays.filter(x => x.whitelisted);
  }

  get poolName() {
    return buildPoolName(this.pool.id);
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
    const currentTime = moment().unix();
    return formatUnixTime(currentTime + maxDelayTime).date;
  }

  get actionButtonLabel() {
    if (!this.amount) return "Enter an Amount";
    else return "Stake and Protect";
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  get disableActionButton() {
    if (!this.amount) return true;
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
    } else if (this.error) {
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
      } single-sided staking. Alternatively, provide dual-sided liquidity (${
        this.opposingToken!.symbol
      }+${this.token.symbol})`;

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
    if (this.isAuthenticated) this.modal = true;
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

  async selectPool(id: string) {
    await this.$router.replace({
      name: "AddProtectionSingle",
      params: { id }
    });
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  async loadMaxStakes() {
    this.loadingMaxStakes = true;
    try {
      const result = await vxm.ethBancor.getMaxStakes({
        poolId: this.pool.id
      });
      if (this.token.symbol === "BNT")
        this.maxStakes = result.maxStakesConverted.maxAllowedBnt;
      else
        this.maxStakes =
          result.maxStakesConverted[`maxAllowedTkn${this.token.symbol}`];
    } catch (e) {
      console.log(e);
    } finally {
      this.loadingMaxStakes = false;
    }
  }

  async created() {
    await this.loadMaxStakes();
  }
}
</script>

<style scoped lang="scss"></style>
