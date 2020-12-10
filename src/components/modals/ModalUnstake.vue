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
              <span v-if="step === 'unstake'">Unstake</span>
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
      <div
        class="font-size-12 font-w500 text-nowrap"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        <div class="text-uppercase d-inline-block">Unstake your tokens</div>
        <div
          class="text-nowrap d-inline-block text-right balance cursor"
          @click="useMax"
        >
          Balance: {{ prettifyNumber(currentStake) }} {{ symbol }}
        </div>
      </div>

      <div class="input-currency mt-1">
        <b-form-input
          v-model="unstakeInput"
          :state="state"
          @keypress="setUnstakeInput"
          @input="setUnstakeInput"
          :max="currentStake.toNumber()"
          type="number"
          placeholder="0"
          size="lg"
          class="input-currency__input"
        />
        <div class="input-currency__append pr-3">
          <img
            class="img-avatar img-avatar32 bg-dark input-currency__img mr-2 ml-3"
            src="@/assets/media/logos/bancor-white2.png"
          />

          <span class="font-size-14 font-w500">{{ symbol }}</span>
        </div>
      </div>

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
      <b-spinner variant="primary"></b-spinner>
      <h3
        class="font-size-lg mt-4"
        :class="darkMode ? 'text-body-dark' : 'text-body-light'"
      >
        Waiting For Confirmation
      </h3>
      <div class="mt-2 mb-3">Unstaking {{ unstakeValue }} {{ symbol }}</div>
      <div
        class="font-size-12 font-w500"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        Confirm this transaction in your wallet
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
        Transaction Submitted
      </h3>
      <div class="mt-2 mb-3">Unstaking {{ unstakeValue }} {{ symbol }}</div>
      <a
        target="_blank"
        class="text-primary font-w500 cursor"
        :href="getEtherscanUrl()"
        >View on Etherscan</a
      >
      <main-button
        @click="onHide"
        label="Close"
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
import { Component, Watch, VModel } from "vue-property-decorator";
import { prettifyNumber } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import BigNumber from "bignumber.js";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    MainButton
  }
})
export default class ModalUnstake extends BaseComponent {
  @VModel({ type: Boolean }) show!: boolean;

  currentStake: BigNumber = new BigNumber(0);
  unstakeInput: string = "";
  unstakeValue: BigNumber = new BigNumber(0);

  prettifyNumber = prettifyNumber;

  step: "unstake" | "unstaking" | "unstaked" = "unstake";
  symbol: string = "";
  etherscanUrl: string = "";

  get buttonActive() {
    return (
      this.unstakeValue.isGreaterThan(0) &&
      this.currentStake.isGreaterThanOrEqualTo(this.unstakeValue)
    );
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
      ? "Enter Amount"
      : this.unstakeValue &&
        this.unstakeValue.isGreaterThan(0) &&
        this.currentStake.isGreaterThanOrEqualTo(this.unstakeValue)
      ? "Unstake Tokens"
      : "Insufficient Amount";
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
