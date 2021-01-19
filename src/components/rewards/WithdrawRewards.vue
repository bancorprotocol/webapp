<template>
  <div class="mt-3">
    <label-content-split label="Claimable Rewards">
      <logo-amount-symbol
        :token-id="bntAddress"
        :amount="prettifyNumber(amount)"
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
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";
import { getNetworkVariables } from "@/api/config";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import LogoAmountSymbol from "@/components/common/LogoAmountSymbol.vue";
import { vxm } from "@/store";
import AlertBlock from "@/components/common/AlertBlock.vue";
import MainButton from "@/components/common/Button.vue";

@Component({
  components: { AlertBlock, LogoAmountSymbol, LabelContentSplit, MainButton }
})
export default class WithdrawRewards extends BaseComponent {
  amount: number = 123;

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

  restakeAction() {
    return;
  }

  withdrawAction() {
    return;
  }
}
</script>

<style lang="scss" scoped></style>
