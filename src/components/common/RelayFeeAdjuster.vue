<template>
  <b-form-spinbutton
    :formatter-fn="feeFormatter"
    min="0"
    max="3"
    step="0.1"
    id="sb-inline"
    size="sm"
    v-model="feeAmount"
    placeholder="Fee"
  ></b-form-spinbutton>
</template>

<script lang="ts">
import { Prop, Component, Vue, PropSync } from "vue-property-decorator";

@Component
export default class RelayFeeAdjuster extends Vue {
  @PropSync("fee", { type: Number }) feeAmount!: number;

  feeFormatter(fee: number) {
    return `${fee} %`;
  }
}
</script>

<style lang="scss" scoped></style>
