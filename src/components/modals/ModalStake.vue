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
              <span v-if="step === 'stake'">Stake</span>
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
      <div
        class="font-size-12 font-w500 text-nowrap"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        <div class="text-uppercase d-inline-block">Stake your tokens</div>
        <div
          class="text-nowrap d-inline-block text-right balance cursor"
          @click="useMax"
        >
          Balance: {{ prettifyNumber(currentBalance) }} {{ symbol }}
        </div>
      </div>

      <div class="input-currency mt-1">
        <b-form-input
          v-model="stakeInput"
          :state="state"
          @keypress="setStakeInput"
          @input="setStakeInput"
          :max="currentBalance.toNumber()"
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

      <b-alert show variant="warning" class="my-3 p-3 font-size-14 alert-over">
        Staking {{ symbol }} enables you to vote on proposals. You will be able
        to unstake once the lock period is over (up to {{ maxLock }}h)
      </b-alert>

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
      <b-spinner variant="primary"></b-spinner>
      <h3
        class="font-size-lg mt-4"
        :class="darkMode ? 'text-body-dark' : 'text-body-light'"
      >
        Waiting For Confirmation
      </h3>
      <div class="mt-2 mb-3">Staking {{ stakeValue }} {{ symbol }}</div>
      <div
        class="font-size-12 font-w500"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        Confirm this transaction in your wallet
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
        Transaction Submitted
      </h3>
      <div class="mt-2 mb-3">Staking {{ stakeValue }} {{ symbol }}</div>
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
export default class ModalStake extends BaseComponent {
  @VModel({ type: Boolean }) show!: boolean;

  currentBalance: BigNumber = new BigNumber(0);
  stakeInput: string = "";
  stakeValue: BigNumber = new BigNumber(0);
  step: "stake" | "staking" | "staked" = "stake";
  symbol: string = "";
  etherscanUrl: string = "";
  maxLock: number = 0;

  prettifyNumber = prettifyNumber;

  get buttonActive() {
    return (
      this.stakeValue.isGreaterThan(0) &&
      this.currentBalance.isGreaterThanOrEqualTo(this.stakeValue)
    );
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
      ? "Enter Amount"
      : this.stakeValue &&
        this.stakeValue.isGreaterThan(0) &&
        this.currentBalance.isGreaterThanOrEqualTo(this.stakeValue)
      ? "Stake Tokens"
      : "Insufficient Amount";
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
