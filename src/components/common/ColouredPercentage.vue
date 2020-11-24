<template>
  <div
    :class="
      percentage == null
        ? darkMode
          ? 'text-dark'
          : 'text-light'
        : percentage > 0
        ? `text-success `
        : 'text-danger '
    "
  >
    {{ formattedPercentage }}
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import numeral from "numeral";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class ColouredPercentage extends BaseComponent {
  @Prop() percentage!: number | null;

  get formattedPercentage() {
    const percentage = this.percentage;
    return percentage ? numeral(percentage / 100).format("0.00%") : "N/A";
  }
}
</script>

<style lang="scss"></style>
