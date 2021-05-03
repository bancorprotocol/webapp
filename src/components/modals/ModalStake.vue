<template>
  <b-modal
    :content-class="darkMode ? 'bg-block-dark' : 'bg-block-light'"
    scrollable
    size="sm"
    centered
    v-model="show"
    hide-footer
    @close="onHide"
    @cancel="onHide"
    @hide="onHide"
    @show="update"
  >
    <template slot="modal-header">
      <div class="w-100">
        <b-row>
          <b-col cols="12" class="d-flex justify-content-between mb-2">
            <span
              class="font-size-14 font-w600"
              :class="darkMode ? 'text-dark' : 'text-light'"
            >
              <span v-if="step === 'stake'">{{ $t("stake") }}</span>
            </span>
            <font-awesome-icon
              class="cursor font-size-lg"
              :class="darkMode ? 'text-dark' : 'text-light'"
              @click="onHide"
              icon="times"
            />
          </b-col>
        </b-row>
      </div>
    </template>

    <div v-if="step === 'stake'">
      <token-input-field
        :state="state"
        @keypress="setStakeInput"
        @input="setStakeInput"
        :max="currentBalance.toNumber()"
        placeholder="0"
        :token="vBnt"
        :label="$t('stake_your_tokens')"
        v-model="stakeInput"
        :balance="currentBalance"
      />
      <alert-block
        class="my-3"
        variant="warning"
        :msg="$t('enable_vote', { symbol: symbol, hours: maxLock })"
      />
      <main-button
        @click="stake"
        :label="stakeLabel"
        :active="true"
        :block="true"
        :disabled="!buttonActive"
        class="font-size-14 font-w400 mt-3 button-status"
        :class="{
          'button-status--empty': stakeInput.length === 0,
          'button-status--invalid': !buttonActive
        }"
      />
    </div>

    <div
      v-if="step === 'staking'"
      class="text-center"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <b-spinner
        :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
      ></b-spinner>
      <h3
        class="font-size-lg mt-4"
        :class="darkMode ? 'text-body-dark' : 'text-body-light'"
      >
        {{ $t("waiting_for_confirmation") }}
      </h3>
      <div class="mt-2 mb-3">
        {{ `${$t("staking")} ${stakeValue} ${symbol}` }}
      </div>
      <div
        class="font-size-12 font-w500"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        {{ $t("confirm__transaction_in_wallet") }}
      </div>
    </div>

    <div
      v-if="step === 'staked'"
      class="text-center"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <font-awesome-icon class="text-primary" size="4x" icon="check-circle" />
      <h3
        class="font-size-lg mt-4"
        :class="darkMode ? 'text-body-dark' : 'text-body-light'"
      >
        {{ $t("transaction_submitted") }}
      </h3>
      <div class="mt-2 mb-3">
        {{ `${$t("staking")} ${stakeValue} ${symbol}` }}
      </div>
      <a
        target="_blank"
        class="font-w500 cursor"
        :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
        :href="getEtherscanUrl()"
        >{{ $t("view_etherscan") }}</a
      >
      <main-button
        @click="onHide"
        :label="$t('close')"
        :large="true"
        :active="true"
        :block="true"
        class="font-size-14 font-w400 mt-3"
      />
    </div>
  </b-modal>
</template>

<script lang="ts">
import { vxm } from "@/store/";
import { i18n } from "@/i18n";
import { Component, Watch, VModel } from "vue-property-decorator";
import MainButton from "@/components/common/Button.vue";
import { compareString } from "@/api/helpers";
import AlertBlock from "@/components/common/AlertBlock.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import BigNumber from "bignumber.js";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    MainButton,
    AlertBlock,
    TokenInputField
  }
})
export default class ModalStake extends BaseComponent {
  @VModel({ type: Boolean }) show!: boolean;

  currentBalance: BigNumber = new BigNumber(0);
  stakeInput: string = "";
  stakeValue: BigNumber = new BigNumber(0);
  step: "stake" | "staking" | "staked" = "stake";
  symbol: string = "";
  etherscanUrl: string = "";
  maxLock: number = 0;

  get buttonActive() {
    return (
      this.stakeValue.isGreaterThan(0) &&
      this.currentBalance.isGreaterThanOrEqualTo(this.stakeValue)
    );
  }

  get vBnt() {
    const bntToken = vxm.bancor.tokens.find(token =>
      compareString(token.symbol, "BNT")
    );
    return {
      id: -1,
      symbol: this.symbol,
      logo: bntToken ? bntToken.logo : ""
    };
  }

  get state() {
    return (
      (this.stakeInput.length === 0 ||
        (this.stakeValue &&
          this.stakeValue.isGreaterThan(0) &&
          this.currentBalance.isGreaterThanOrEqualTo(this.stakeValue))) &&
      undefined
    );
  }

  get stakeLabel() {
    return this.stakeValue && this.stakeInput.length === 0
      ? i18n.t("enter_amount")
      : this.stakeValue &&
        this.stakeValue.isGreaterThan(0) &&
        this.currentBalance.isGreaterThanOrEqualTo(this.stakeValue)
      ? i18n.t("stake_your_tokens")
      : i18n.t("insufficient_amount");
  }

  setStakeInput() {
    this.stakeValue = new BigNumber(this.stakeInput);
  }

  getEtherscanUrl() {
    return `${this.etherscanUrl}address/${this.currentUser}#tokentxns`;
  }

  stake() {
    this.step = "staking";
    this.doStake()
      .then(() => {
        this.step = "staked";
      })
      .catch(() => this.onHide());
  }

  async doStake() {
    await vxm.ethGovernance.stake({
      account: this.currentUser,
      amount: this.stakeValue
        .multipliedBy(
          new BigNumber(10).pow(await vxm.ethGovernance.getDecimals())
        )
        .toString()
    });
  }

  onHide() {
    this.show = false;
    this.step = "stake";
    setTimeout(() => {
      this.stakeInput = "";
      this.setStakeInput();
    }, 100);
  }

  useMax() {
    this.stakeValue = this.currentBalance;
    this.stakeInput = this.currentBalance.toString(10);
  }

  @Watch("step")
  @Watch("currentUser")
  @Watch("show")
  async update() {
    this.currentBalance = this.currentUser
      ? await vxm.ethGovernance.getBalance({
          account: this.currentUser
        })
      : new BigNumber(0);

    this.setStakeInput();

    this.symbol = await vxm.ethGovernance.getSymbol();
    this.etherscanUrl = await vxm.ethGovernance.getEtherscanUrl();

    await this.updateMaxLock();
  }

  async updateMaxLock() {
    const [voteDuration, voteLockFraction] = await Promise.all([
      vxm.ethGovernance.getVoteLockDuration(),
      vxm.ethGovernance.getVoteLockFraction()
    ]);

    this.maxLock = voteDuration / voteLockFraction / 60 / 60;
  }

  async mounted() {
    this.symbol = await vxm.ethGovernance.getSymbol();
    await this.update();
  }
}
</script>
<style lang="scss">
@import "@/assets/_scss/custom/_variables";

.modal-body {
  padding-top: 0 !important;
}

.input-currency {
  border-right: 0 !important;
  position: relative;

  &__append {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    height: 100%;
    right: 0;
  }

  &__img {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border: solid 1px #e6ebf2;
    padding: 4px;
  }

  &__input {
    background-image: none !important;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type="number"] {
      -moz-appearance: textfield;
    }
  }
}

.button-status {
  &--invalid {
    background: $text-error-light !important;
    border-color: transparent !important;
  }

  &--empty {
    background: $gray-placeholder !important;
    border-color: transparent !important;
  }
}

.alert-over {
  box-shadow: none !important;
  border-radius: 8px !important;
  border: solid 1px #f6ab30 !important;
  color: #f6ab30 !important;
  background-color: #fff8ed !important;
}

.balance {
  min-width: 225px;
  padding-left: 5px;
}
</style>
