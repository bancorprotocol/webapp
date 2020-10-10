<template>
  <div class="mt-3">
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

    <div class="mt-2 d-flex flex-row-reverse">
      <pool-logos :pool="pool" />
    </div>

    <alert-block
      v-if="!isWhitelisted"
      variant="warning"
      :msg="whitelistWarning.msg"
      class="mt-3 mb-3"
    />

    <gray-border-block v-else :gray-bg="true" class="my-3">
      <label-content-split label="Value you receive" value="????" />
      <label-content-split value="????" class="mb-2" />

      <span
        class="font-size-14 font-w400"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        If pool ratio is changed during the protection period - you’ll receive
        change value in BNT.
      </span>
    </gray-border-block>

    <label-content-split
      label="Full Coverage Date"
      :value="fullCoverageDate"
      class="mb-3"
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
            {{ `${formatNumber(amount)} ${poolName}` }}
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
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import { Step, TxResponse, ViewRelay } from "@/types/bancor";
import TokenInputField from "@/components/common/TokenInputField.vue";
import BigNumber from "bignumber.js";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import {
  compareString,
  compareToken,
  formatUnixTime,
  formatNumber,
  buildPoolName
} from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import ModalBase from "@/components/modals/ModalBase.vue";
import moment from "moment";
import { format } from "numeral";
import PoolLogos from "@/components/common/PoolLogos.vue";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";

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
export default class AddProtectionV2 extends Vue {
  @Prop() pool!: ViewRelay;

  amount: string = "";

  modal = false;
  txBusy = false;
  success: TxResponse | string | null = null;
  error = "";
  sections: Step[] = [];
  stepIndex = 0;
  preTxError = "";

  selectedTokenIndex = 0;

  toggleReserveIndex(x: string) {
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

  get pools() {
    return vxm.bancor.relays.filter(x => !x.v2);
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
      ? "Try Again"
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
      const res = await vxm.ethBancor.calculateProtection({
        poolId: this.pool.id,
        reserveAmount: { id: this.token.id, amount: this.amount }
      });

      this.preTxError =
        res == "Insufficient store balance"
          ? `Insufficient store balance, please add pool tokens instead or wait for other Liquidity Providers to supply more ${
              this.opposingToken!.symbol
            } tokens`
          : res;
    }
  }

  async openModal() {
    if (this.isAuthenticated) this.modal = true;
    // @ts-ignore
    else await this.promptAuth();
  }

  setDefault() {
    this.sections = [];
    this.error = "";
    this.success = null;
  }

  formatNumber(amount: string) {
    return parseFloat(formatNumber(amount, 6));
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
      name: "ProtectionAction",
      params: { action: "add", id }
    });
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
