<template>
  <div class="mt-3">
    <label-content-split :label="$t('claimable_rewards')">
      <logo-amount-symbol
        :token-id="bntAddress"
        :amount="prettifyNumber(pendingRewards.bnt)"
        symbol="BNT"
      />
    </label-content-split>

    <alert-block
      class="my-3"
      :variant="warning.variant"
      :title="warning.title"
      :msg="warning.msg"
    />

    <main-button
      :label="$t('stake_my_rewards')"
      @click="restakeAction"
      :active="true"
      :large="true"
    />
    <main-button
      :label="$t('withdraw_rewards')"
      @click="withdrawAction"
      :large="true"
      :disabled="disableWithdraw"
    />

    <modal-pool-select
      @select="selectPool"
      v-model="showPoolSelectModal"
      :pools="pools"
    />

    <modal-tx-action
      :tx-meta="txMeta"
      :title="$t('you_withdrawing_rewards')"
      @close="closeTxModal"
    />
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { getNetworkVariables } from "@/api/config";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import LogoAmountSymbol from "@/components/common/LogoAmountSymbol.vue";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import AlertBlock from "@/components/common/AlertBlock.vue";
import MainButton from "@/components/common/Button.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import BaseTxAction from "@/components/BaseTxAction.vue";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";

@Component({
  components: {
    ModalTxAction,
    ModalPoolSelect,
    AlertBlock,
    LogoAmountSymbol,
    LabelContentSplit,
    MainButton
  }
})
export default class WithdrawRewards extends BaseTxAction {
  loading = false;
  showPoolSelectModal = false;

  get pendingRewards() {
    return vxm.rewards.balance.pendingRewards;
  }

  get pools() {
    return vxm.bancor.relays.filter(pool => pool.liquidityProtection);
  }

  get bntAddress() {
    return getNetworkVariables(vxm.ethBancor.currentNetwork).bntToken;
  }

  get warning() {
    return {
      variant: "warning",
      title: i18n.t("important"),
      msg: i18n.t("withdrawing_rewards_reset")
    };
  }

  get disableWithdraw() {
    return !this.pendingRewards.bnt.gt(0);
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

  async closeTxModal() {
    if (this.txMeta.success) {
      await this.$router.replace({ name: "LiqProtection" });
    }
    this.setDefault();
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

  async mounted() {
    this.loading = true;
    try {
      await vxm.rewards.loadData();
    } catch (e) {
      console.log(e);
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss" scoped></style>
