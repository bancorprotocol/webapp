<template>
  <div class="mt-3">
    <label-content-split
      :label="$t('claimable_rewards')"
      :tooltip="$t('not_include_liquidity_rewards')"
    >
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
      :messages="[warning.msg]"
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

    <modal-tx-action :tx-meta="txMeta" :title="$t('you_withdrawing_rewards')" />
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
import { addNotification } from "@/components/compositions/notifications";

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
      msg: i18n.t("rewards_withdrawing_reset")
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

  async withdrawAction() {
    this.txMeta.txBusy = true;
    this.txMeta.showTxModal = true;

    try {
      this.txMeta.success = await vxm.rewards.claimRewards({
        onUpdate: this.onUpdate
      });
      this.txMeta.showTxModal = false;
      addNotification({
        title: this.$tc("notifications.add.withdraw.title"),
        description: this.$tc("notifications.add.withdraw.description", 0, {
          amount: this.prettifyNumber(this.pendingRewards.bnt)
        }),
        txHash: this.txMeta.success.txId
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
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss" scoped></style>
