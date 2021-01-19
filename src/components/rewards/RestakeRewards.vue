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
      :balance="pendingRewards.toString()"
      :error-msg="inputError"
    />

    <gray-border-block :gray-bg="true" class="my-3">
      <label-content-split label="Space Available" :loading="loading">
        <span class="cursor">{{
          `${prettifyNumber(maxStakeAmount)} ${maxStakeSymbol}`
        }}</span>
      </label-content-split>
    </gray-border-block>

    <main-button
      :label="actionButtonLabel"
      :active="true"
      :large="true"
      :disabled="disableActionButton"
    />
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store/";
import { ViewRelay } from "@/types/bancor";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import MainButton from "@/components/common/Button.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import BigNumber from "bignumber.js";

@Component({
  components: {
    ModalPoolSelect,
    PoolLogos,
    LabelContentSplit,
    GrayBorderBlock,
    TokenInputField,
    MainButton
  }
})
export default class RestakeRewards extends BaseComponent {
  get pool(): ViewRelay {
    const [poolId] = this.$route.params.id.split(":");
    return vxm.bancor.relay(poolId);
  }
  amount: string = "";
  poolSelectModal = false;

  maxStakeAmount: string = "";
  maxStakeSymbol: string = "";
  loading = false;

  pendingRewards: BigNumber = new BigNumber(0);

  private interval: any;

  get token() {
    return this.pool.reserves[0]; //BNT
  }

  get pools() {
    return vxm.bancor.relays.filter(x => x.whitelisted);
  }

  get actionButtonLabel() {
    if (this.amount) return "ReStake and Protect";
    return "Enter an Amount";
  }

  get disableActionButton() {
    if (!this.amount) return true;
    else if (this.loading) return true;
    else return this.inputError ? true : false;
  }

  get inputError() {
    if (this.amount == "") return "";
    if (this.pendingRewards.lt(this.amount))
      return "Insufficient rewards balance";
    if (parseFloat(this.amount) === 0) return "Amount can not be Zero";
    else return "";
  }

  openPoolSelectModal() {
    this.poolSelectModal = true;
  }

  async selectPool(id: string) {
    if (this.pool.id === id) return;

    await this.$router.replace({
      name: "RewardsRestake",
      params: { id }
    });

    await this.loadData();
  }

  async loadMaxStakes() {
    const result = await vxm.ethBancor.getMaxStakesView({
      poolId: this.pool.id
    });
    let stake = result.filter(x => x.token === this.token.symbol);
    if (stake.length === 1) {
      this.maxStakeAmount = stake[0].amount;
      this.maxStakeSymbol = stake[0].token;
    }
  }

  async loadPendingRewards() {
    this.pendingRewards = await vxm.rewards.pendingRewards();
  }

  async loadData() {
    this.loading = true;
    try {
      await this.loadMaxStakes();
      await this.loadPendingRewards();
    } catch (e) {
      console.log(e);
    } finally {
      this.loading = false;
    }
  }

  async mounted() {
    await this.loadData();
    this.interval = setInterval(async () => {
      await this.loadData();
    }, 30000);
  }

  destroyed() {
    clearInterval(this.interval);
  }
}
</script>

<style scoped lang="scss"></style>
