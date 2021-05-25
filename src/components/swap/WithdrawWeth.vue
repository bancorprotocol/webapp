<template>
  <div>
    <b-btn
      @click="openModal()"
      :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
      size="sm"
    >
      {{ $t("button.withdraw_weth", { amount: prettifyNumber(balance) }) }}
    </b-btn>

    <modal-tx-action
      :title="$t('modal.withdraw_weth.title')"
      icon="arrow-from-bottom"
      :tx-meta="txMeta"
      :no-prompt="true"
    >
      <label-content-split :label="$t('modal.withdraw_weth.balance')">
        {{ balance }} WETH
      </label-content-split>

      <hr />

      <percentage-slider
        v-model="percentage"
        :label="$t('modal.withdraw_weth.amount')"
        :show-buttons="true"
      />

      <gray-border-block class="mt-4">
        <span
          class="font-size-12"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          {{ $t("modal.withdraw_weth.output_amount") }}
        </span>
        <div class="font-size-14 font-w500">{{ output }} ETH</div>
      </gray-border-block>

      <p
        class="font-size-12 font-w400 mt-3 mb-0 text-left px-3"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        {{ $t("modal.withdraw_weth.info") }}
      </p>

      <b-btn
        @click="withdrawWeth()"
        class="mt-2 rounded py-2 btn-block"
        variant="primary"
      >
        Confirm
      </b-btn>
    </modal-tx-action>
  </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import BaseTxAction from "@/components/BaseTxAction.vue";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import PercentageSlider from "@/components/common/PercentageSlider.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import BigNumber from "bignumber.js";
import { wethTokenContractAddress } from "@/store/modules/swap/ethBancor";
import { addNotification } from "@/components/compositions/notifications";

@Component({
  components: {
    GrayBorderBlock,
    PercentageSlider,
    LabelContentSplit,
    ModalTxAction
  }
})
export default class WithdrawWeth extends BaseTxAction {
  percentage = "50";

  get balance(): string {
    const wethToken = vxm.ethBancor.tokenBalance(wethTokenContractAddress);
    return wethToken?.balance || "0";
  }

  get decOutput() {
    if (this.percentage == "100") return this.balance;
    const percentage = new BigNumber(this.percentage).div(100);
    return new BigNumber(this.balance).times(percentage).toString();
  }

  get output() {
    return this.prettifyNumber(this.decOutput);
  }

  async withdrawWeth() {
    this.openModal();
    if (this.txMeta.txBusy) return;
    this.txMeta.txBusy = true;
    try {
      this.txMeta.success = await vxm.ethBancor.withdrawWeth({
        decAmount: this.decOutput
      });
      this.txMeta.showTxModal = false;
      addNotification({
        title: this.$tc("notifications.add.withdraw_weth.title"),
        description: this.$tc("notifications.add.withdraw_weth.description"),
        txHash: this.txMeta.success!.txId
      });
    } catch (e) {
      console.error("failed to withdraw weth", e);
      this.txMeta.txError = e.message;
    } finally {
      this.txMeta.txBusy = false;
    }
  }
}
</script>
