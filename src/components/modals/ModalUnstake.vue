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
              <span v-if="step === 'unstake'">{{ $t("unstake") }}</span>
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

    <div v-if="step === 'unstake'">
      <token-input-field
        :state="state"
        @keypress="setUnstakeInput"
        @input="setUnstakeInput"
        :max="currentStake.toNumber()"
        placeholder="0"
        :token="vBnt"
        :label="$t('unstake_your_tokens')"
        v-model="unstakeInput"
        :balance="currentStake"
      />
      <main-button
        @click="unstake"
        :label="unstakeLabel"
        :active="true"
        :block="true"
        :disabled="!buttonActive"
        class="font-size-14 font-w400 mt-3 button-status"
        :class="{
          'button-status--empty': unstakeInput.length === 0,
          'button-status--invalid': !buttonActive
        }"
      />
    </div>

    <div
      v-if="step === 'unstaking'"
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
        {{ `${$t("unstaking")} ${unstakeValue} ${symbol}` }}
      </div>
      <div
        class="font-size-12 font-w500"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        {{ $t("confirm__transaction_in_wallet") }}
      </div>
    </div>

    <div
      v-if="step === 'unstaked'"
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
        {{ `${$t("unstaking")} ${unstakeValue} ${symbol}` }}
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
import BigNumber from "bignumber.js";
import BaseComponent from "@/components/BaseComponent.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import { compareString } from "@/api/helpers";

@Component({
  components: {
    MainButton,
    TokenInputField
  }
})
export default class ModalUnstake extends BaseComponent {
  @VModel({ type: Boolean }) show!: boolean;

  currentStake: BigNumber = new BigNumber(0);
  unstakeInput: string = "";
  unstakeValue: BigNumber = new BigNumber(0);

  step: "unstake" | "unstaking" | "unstaked" = "unstake";
  symbol: string = "";
  etherscanUrl: string = "";

  get buttonActive() {
    return (
      this.unstakeValue.isGreaterThan(0) &&
      this.currentStake.isGreaterThanOrEqualTo(this.unstakeValue)
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
      (this.unstakeInput.length === 0 ||
        (this.unstakeValue &&
          this.unstakeValue.isGreaterThan(0) &&
          this.currentStake.isGreaterThanOrEqualTo(this.unstakeValue))) &&
      undefined
    );
  }

  get unstakeLabel() {
    return this.unstakeValue && this.unstakeInput.length === 0
      ? i18n.t("enter_amount")
      : this.unstakeValue &&
        this.unstakeValue.isGreaterThan(0) &&
        this.currentStake.isGreaterThanOrEqualTo(this.unstakeValue)
      ? i18n.t("unstake_your_tokens")
      : i18n.t("insufficient_amount");
  }

  setUnstakeInput() {
    this.unstakeValue = new BigNumber(this.unstakeInput);
  }

  getEtherscanUrl() {
    return `${this.etherscanUrl}address/${this.currentUser}#tokentxns`;
  }

  unstake() {
    this.step = "unstaking";
    this.doUnstake()
      .then(() => {
        this.step = "unstaked";
      })
      .catch(() => {
        this.onHide();
      });
  }

  async doUnstake() {
    await vxm.ethGovernance.unstake({
      account: this.currentUser,
      amount: this.unstakeValue
        .multipliedBy(
          new BigNumber(10).pow(await vxm.ethGovernance.getDecimals())
        )
        .toString()
    });
  }

  useMax() {
    this.unstakeValue = this.currentStake;
    this.unstakeInput = this.currentStake.toString(10);
  }

  onHide() {
    this.show = false;
    this.step = "unstake";
    setTimeout(() => {
      this.unstakeInput = "";
      this.setUnstakeInput();
    }, 100);
  }

  @Watch("step")
  @Watch("currentUser")
  @Watch("show")
  async update() {
    this.currentStake = await vxm.ethGovernance.getVotes({
      voter: this.currentUser
    });

    this.setUnstakeInput();

    this.symbol = await vxm.ethGovernance.getSymbol();
    this.etherscanUrl = await vxm.ethGovernance.getEtherscanUrl();
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

.balance {
  min-width: 205px;
  padding-left: 5px;
}
</style>
