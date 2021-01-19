<template>
  <div class="mt-3">
    <label-content-split :label="$t('select_pool')">
      <pool-logos :pool="pool" :cursor="false" />
    </label-content-split>

    <percentage-slider
      class="mt-3"
      v-model="percentage"
      :label="$t('amount')"
      :show-buttons="true"
    />

    <div class="text-center my-3">
      <font-awesome-icon
        icon="long-arrow-alt-down"
        class="text-primary font-size-16"
      />
    </div>

    <div
      class="block block-rounded block-bordered mb-4"
      :class="darkMode ? 'block-light-blue-dark' : 'block-light-blue-light'"
    >
      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center"
        style="min-height: 67px"
      >
        <font-awesome-icon
          icon="circle-notch"
          spin
          :class="darkMode ? 'text-dark' : 'text-light'"
        />
      </div>
      <div v-else>
        <div
          class="block-content d-flex justify-content-between align-items-center font-size-14 font-w600 pt-2"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          <span>{{ prettifyNumber(amountToken1) }}</span>
          <div class="d-flex align-items-center">
            <img
              :src="pool.reserves[0].logo"
              class="img-avatar img-avatar20"
              :alt="$t('token_logo')"
            />
            <span class="ml-2">{{ pool.reserves[0].symbol }}</span>
          </div>
        </div>
        <div
          class="block-content d-flex justify-content-between align-items-center font-size-14 font-w600 py-2"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          <span>{{ prettifyNumber(amountToken2) }}</span>
          <div class="d-flex align-items-center">
            <img
              :src="pool.reserves[1].logo"
              class="img-avatar img-avatar20"
              :alt="$t('token_logo')"
            />
            <span class="ml-2">{{ pool.reserves[1].symbol }}</span>
          </div>
        </div>
      </div>
    </div>

    <label-content-split
      v-if="false"
      :label="$t('price')"
      :value="`1 ${pool.reserves[1].symbol} = ${rate} ${pool.reserves[0].symbol}`"
      class="my-3"
    />

    <alert-block variant="error" :msg="error" />

    <main-button
      @click="initAction"
      :label="$t('remove')"
      :active="true"
      :large="true"
      class="mt-1"
      :disabled="error !== '' || !(amountToken1 && amountToken2) || loading"
    />

    <modal-pool-action
      v-model="modal"
      :amounts-array="[amountSmartToken, amountToken1, amountToken2]"
      :advanced-block-items="[]"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import { vxm } from "@/store/";
import { i18n } from "@/i18n";
import { ViewRelay } from "@/types/bancor";
import PoolLogos from "@/components/common/PoolLogos.vue";
import MainButton from "@/components/common/Button.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import ModalPoolAction from "@/components/pool/ModalPoolAction.vue";
import BigNumber from "bignumber.js";
import BaseComponent from "@/components/BaseComponent.vue";
import PercentageSlider from "@/components/common/PercentageSlider.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";

@Component({
  components: {
    AlertBlock,
    PercentageSlider,
    ModalPoolAction,
    LabelContentSplit,
    PoolLogos,
    MainButton
  }
})
export default class PoolActionsRemoveV1 extends BaseComponent {
  @Prop() pool!: ViewRelay;

  loading = false;

  percentage: string = "50";
  rate = "??????.?????";

  amountSmartToken = "";
  amountToken1: BigNumber | null = null;
  amountToken2: BigNumber | null = null;

  error = "";
  balance1: BigNumber | null = null;
  balance2: BigNumber | null = null;
  modal = false;

  async initAction() {
    if (this.currentUser) this.modal = true;
    //@ts-ignore
    else await this.promptAuth();
  }

  @Watch("percentage")
  async calculate() {
    if (this.balance1 === null || this.balance2 === null) return;
    const percentage = new BigNumber(this.percentage).div(100);
    const amount = this.balance1.times(percentage);
    this.loading = true;
    this.error = "";
    try {
      const results = await vxm.bancor.calculateOpposingWithdraw({
        id: this.pool.id,
        reserves: [
          { id: this.pool.reserves[0].id, amount: amount.toString() },
          { id: this.pool.reserves[1].id, amount: "" }
        ],
        changedReserveId: this.pool.reserves[0].id
      });
      const opposingAmount = results.opposingAmount;
      if (typeof opposingAmount !== "undefined") {
        this.amountToken1 = amount;
        this.amountToken2 = new BigNumber(opposingAmount);
      } else {
        this.error = i18n.tc("failed_calculate_withdraw");
        return;
      }
      if (
        this.balance1.isLessThan(amount) ||
        this.balance2.isLessThan(opposingAmount)
      ) {
        this.error = i18n.tc("insufficient_token");
      }
    } catch (e) {
      this.error = e.message;
    }
    this.loading = false;
  }

  @Watch("currentUser")
  async onAuthChange() {
    await this.fetchBalances();
  }

  async fetchBalances() {
    if (!this.currentUser) return;
    this.loading = true;
    const res = await vxm.bancor.getUserBalances(this.pool.id);
    if (this.pool.reserves[0].id === res.maxWithdrawals[0].id) {
      this.balance1 = new BigNumber(res.maxWithdrawals[0].amount);
      this.balance2 = new BigNumber(res.maxWithdrawals[1].amount);
    } else {
      this.balance1 = new BigNumber(res.maxWithdrawals[1].amount);
      this.balance2 = new BigNumber(res.maxWithdrawals[0].amount);
    }
    this.loading = false;
  }

  async mounted() {
    await this.fetchBalances();
    await this.calculate();
  }
}
</script>
