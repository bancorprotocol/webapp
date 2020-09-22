<template>
  <b-modal
    scrollable
    size="sm"
    centered
    v-model="show"
    hide-footer
    @close="onHide"
    @cancel="onHide"
    @hide="onHide"
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
        class="font-size-12 font-w500"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        <span class="text-uppercase">Stake your tokens</span>
        <span class="float-right">Balance: {{ currentBalance }} gBTN</span>
      </div>

      <div class="input-currency mt-1">
        <b-form-input
          v-model="stakeValue"
          :state="
            (stakeValue.length === 0 ||
              (stakeValue > 0 && stakeValue <= currentBalance)) &&
              undefined
          "
          :max="currentBalance"
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

          <span class=" font-size-14 font-w500">gBNT</span>
        </div>
      </div>

      <main-button
        @click="stake"
        :label="
          stakeValue.length === 0
            ? 'Enter Amount'
            : stakeValue > 0 && stakeValue <= currentBalance
            ? 'Stake Tokens'
            : 'Insufficient Amount'
        "
        :active="true"
        :block="true"
        :disabled="!(stakeValue > 0 && stakeValue <= currentBalance)"
        class="font-size-14 font-w400 mt-3 button-status"
        :class="{
          'button-status--empty': stakeValue.length === 0,
          'button-status--invalid': !(
            stakeValue > 0 && stakeValue <= currentBalance
          )
        }"
      />
    </div>

    <div
      v-if="step === 'staking'"
      class="text-center"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <b-spinner variant="primary"></b-spinner>
      <h3 class="font-size-lg mt-4">Waiting For Confirmation</h3>
      <div class="mt-2 mb-3">Staking {{ stakeValue }} gBNT</div>
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
      <h3 class="font-size-lg mt-4">Transaction Submitted</h3>
      <div class="mt-2 mb-3">Staking {{ stakeValue }} gBNT</div>
      <a target="_blank" class="text-primary font-w500 cursor"
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
import {
  Component,
  Prop,
  PropSync,
  Vue,
  Emit,
  Model
} from "vue-property-decorator";
import { VModel } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";

@Component({
  components: {
    MainButton
  }
})
export default class ModalBase extends Vue {
  @VModel({ type: Boolean }) show!: boolean;

  currentBalance: number = 120;
  stakeValue?: number = "" as any;
  step: "stake" | "staking" | "staked" = "stake";

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }

  stake() {
    this.step = "staking";
    setTimeout(() => (this.step = "staked"), 5000);
  }

  onHide() {
    this.show = false;
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
</style>
