<template>
  <div>
    <span class="font-size-sm font-w400">
      <div v-if="Number(balance) > 0" class="cursor">
        <span @click="setPercentage(10)">10%</span>
        -
        <span @click="setPercentage(25)">25%</span>
        -
        <span @click="setPercentage(50)">50%</span>
        -
        <span @click="setPercentage(100)">100%</span>
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import { Prop, Watch, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import debounce from "lodash.debounce";
import numeral from "numeral";

@Component
export default class Percentages extends Vue {
  @Prop(Number) balance!: number;
  @Prop(Boolean) loading?: boolean;
  @Prop(String) amount!: number;
  @Prop({ default: "Available:" }) readonly label!: string;

  numeral = numeral;

  get formattedBalance() {
    return numeral(this.balance).format(
      Number(this.balance) > 0.0001 ? "0,0[.][0000]" : "0,0[.][000000000]"
    );
  }

  setPercentage(percentage: number) {
    this.$emit("percentUpdate", String(percentage));
  }
}
</script>

<style lang="scss" scoped></style>
