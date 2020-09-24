<template>
  <div class="mt-3">
    <token-input-field
      label="Stake Amount"
      :pool="pool"
      v-model="amount"
      @input="amountChanged"
      :balance="balance"
      :error-msg="inputError"
      :pools="pools"
      @select="selectPool"
    />

    <gray-border-block :gray-bg="true" class="my-3">
      <label-content-split label="Value you receive" value="????" />
      <label-content-split value="????" class="mb-2" />

      <span
        class="font-size-14 font-w400"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        If pool ratio will be changed during protection period - you’ll receive
        change value in BNT.
      </span>
    </gray-border-block>

    <label-content-split
      label="Full Coverage Date"
      :value="fullCoverageDate"
      class="mb-3"
    />

    <main-button
      :label="actionButtonLabel"
      @click="initAction"
      :active="true"
      :large="true"
      :disabled="disableActionButton"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import { ViewRelay } from "@/types/bancor";
import TokenInputField from "@/components/common/TokenInputField.vue";
import BigNumber from "bignumber.js";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import { formatUnixTime } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";

@Component({
  components: {
    LabelContentSplit,
    GrayBorderBlock,
    TokenInputField,
    MainButton
  }
})
export default class AddProtectionV1 extends Vue {
  @Prop() pool!: ViewRelay;

  amount: string = "";

  modal = false;

  get pools() {
    return vxm.bancor.relays.filter(x => !x.v2);
  }

  get balance() {
    return "0";
  }

  get fullCoverageDate() {
    return formatUnixTime(Date.now()).date;
  }

  get actionButtonLabel() {
    if (!this.amount) return "Enter an Amount";
    else return "Stake and Protect";
  }

  get disableActionButton() {
    if (!this.amount) return true;
    else return this.inputError ? true : false;
  }

  get inputError() {
    if (parseFloat(this.amount) === 0) return "Amount can not be Zero";

    const amountNumber = new BigNumber(this.amount);
    const balanceNumber = new BigNumber(this.balance);

    if (amountNumber.gt(balanceNumber)) return "Insufficient balance";
    else return "";
  }

  initAction() {
    this.modal = true;
  }

  async selectPool(id: string) {
    await this.$router.replace({
      name: "ProtectionAction",
      params: { action: "add", id }
    });
  }

  async amountChanged(tokenAmount: string) {}

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
