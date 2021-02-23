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
        class="font-size-20 font-w600"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        {{ value }}
      </span>
      <span
        v-if="percentage"
        class="font-size-14"
        :class="percentage >= 0 ? 'percentage-positive' : 'percentage-negative'"
        >{{ `${percentage > 0 ? "+" : ""}${percentage}%` }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class StatisticsDataBlock extends BaseComponent {
  @Prop(String) title!: string;
  @Prop(String) value!: string | number;
  @Prop(Number) percentage?: number;
}
</script>

<style lang="scss"></style>
