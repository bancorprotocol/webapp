<template>
  <div>
    <label-content-split label="Amount">
      <span
        :class="darkMode ? 'text-dark' : 'text-light'"
        class="font-size-16 font-w700"
        >{{ percentageAmount }} %</span
      >
    </label-content-split>
    <b-form-input
      id="range-1"
      v-model="percentageAmount"
      type="range"
      debounce="300"
      min="0"
      max="100"
      class="my-2"
    ></b-form-input>
    <b-row>
      <b-col cols="3" v-for="p in percentages" :key="p">
        <main-button
          @click.native="percentageAmount = p"
          :label="`${p}%`"
          :active="p === percentageAmount"
          :small="true"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import MainButton from "@/components/common/Button.vue";
@Component({
  components: { LabelContentSplit, MainButton }
})
export default class PoolActionsPercentages extends Vue {
  @PropSync("percentage", { type: String }) percentageAmount!: string;

  percentages = ["25", "50", "75", "100"];

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
