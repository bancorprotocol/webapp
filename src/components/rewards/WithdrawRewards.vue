<template>
  <div class="mt-3">
    <label-content-split label="Claimable Rewards">
      <div>
        <logo-amount-symbol :token-id="bntAddress" :amount="''" symbol="BNT" />
        <!-- pendingRewards -->
        <animation-number
          :startingValue="100"
          :targetValue="0"
          :animateOnMount="false"
        />
      </div>
    </label-content-split>

    <alert-block
      class="my-3"
      :variant="warning.variant"
      :title="warning.title"
      :msg="warning.msg"
    />

    <main-button
      label="Restake my rewards"
      @click="restakeAction"
      :active="true"
      :large="true"
    />
    <main-button
      label="Withdraw rewards"
      @click="withdrawAction"
      :large="true"
    />

    <modal-pool-select
      @select="selectPool"
      v-model="showPoolSelectModal"
      :pools="pools"
    />

    <modal-tx-action :tx-meta="txMeta" @close="setDefault" />
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { getNetworkVariables } from "@/api/config";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import LogoAmountSymbol from "@/components/common/LogoAmountSymbol.vue";
import { vxm } from "@/store";
import AlertBlock from "@/components/common/AlertBlock.vue";
import MainButton from "@/components/common/Button.vue";
import BigNumber from "bignumber.js";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import BaseTxAction from "@/components/BaseTxAction.vue";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";
import AnimationNumber from "@/components/common/AnimationNumber.vue";

@Component({
  components: {
    ModalTxAction,
    ModalPoolSelect,
    AlertBlock,
    LogoAmountSymbol,
    LabelContentSplit,
    MainButton,
    AnimationNumber
  }
})
export default class WithdrawRewards extends BaseTxAction {
  pendingRewards: BigNumber = new BigNumber(0);
  loading = false;
  showPoolSelectModal = false;

  get pools() {
    return vxm.bancor.relays.filter(pool => pool.liquidityProtection);
  }

  get bntAddress() {
    return getNetworkVariables(vxm.ethBancor.currentNetwork).bntToken;
  }

  get warning() {
    return {
      variant: "warning",
      title: "Important",
      msg:
        "This will reset your rewards multiplier for all active positions back to x1 and reduce the future rewards you are able to receive. In order to claim and re-stake your rewards atomically without resetting your current multipliers, click the “Restake my rewards” button below."
    };
  }

  selectPool(id: string) {
    this.showPoolSelectModal = false;
    this.$router.replace({
      name: "RewardsRestake",
      params: { id }
    });
  }

  restakeAction() {
    this.showPoolSelectModal = true;
  }

  async withdrawAction() {
    this.txMeta.txBusy = true;
    this.txMeta.showTxModal = true;

    try {
      this.txMeta.success = await vxm.rewards.claimRewards({
        onUpdate: this.onUpdate
      });
    } catch (e) {
      this.txMeta.txError = e.message;
    } finally {
      this.txMeta.txBusy = false;
    }
  }

  async loadData() {
    this.loading = true;
    try {
      this.pendingRewards = await vxm.rewards.pendingRewards();
    } catch (e) {
      console.log(e);
    } finally {
      this.loading = false;
    }
  }

  async mounted() {
    await this.loadData();
  }
}
</script>

<style lang="scss" scoped></style>
