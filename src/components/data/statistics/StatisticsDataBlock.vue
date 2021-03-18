<template>
  <div>
    <span
      class="font-size-14 font-w500"
      :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
    >
      {{ title }}
    </span>

    <div
      class="font-size-16 font-w500 d-flex justify-content-between align-items-center ="
      :style="blockStyle"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <animation-number
        v-if="value"
        :target-value="value"
        :usd="usd"
        :percentage="stringifyPercentage"
        :watch="true"
      />
      <div v-else>
        {{ replacmentTxt }}
      </div>
      <div
        v-if="percentage"
        class="font-size-14 font-w500"
        :class="percentage >= 0 ? 'percentage-positive' : 'percentage-negative'"
      >
        {{ `${percentage > 0 ? "+" : ""}${percentage}%` }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";
import AnimationNumber from "@/components/common/AnimationNumber.vue";

@Component({
  components: { AnimationNumber }
})
export default class StatisticsDataBlock extends BaseComponent {
  @Prop() title!: string;
  @Prop() value!: string | number;
  @Prop({ default: "N/A" }) replacmentTxt!: string | number;
  @Prop({ default: false }) usd!: boolean;
  @Prop({ default: false }) stringifyPercentage!: boolean;
  @Prop() percentage?: number;
  @Prop() blockStyle!: string;
}
</script>

<style lang="scss"></style>
