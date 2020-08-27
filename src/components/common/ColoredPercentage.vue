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
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import numeral from "numeral";

@Component
export default class ColoredPercentage extends Vue {
  @Prop() percentage!: number | null;

  get formattedPercentage() {
    const percentage = this.percentage;
    return percentage ? numeral(percentage / 100).format("0.00%") : "N/A";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
