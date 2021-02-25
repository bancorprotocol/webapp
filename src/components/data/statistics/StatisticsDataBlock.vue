<template>
  <div>
    <span
      class="text-uppercase font-size-12 font-w600"
      :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
    >
      {{ title }}
    </span>
    <div>
      <span
        class="font-size-14 font-w600"
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
      </span>
      <span
        v-if="typeof percentage !== 'undefined'"
        :class="percentage >= 0 ? 'text-success' : 'text-danger'"
        >{{ percentage }}%</span
      >
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
}
</script>

<style lang="scss"></style>
