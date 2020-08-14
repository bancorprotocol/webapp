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
    {{ percentage ? numeral(percentage / 100).format("0.00%") : "N/A" }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, PropSync } from "vue-property-decorator";
import { vxm } from "@/store";
import numeral from "numeral";

@Component({
  components: {}
})
export default class ColoredPercentage extends Vue {
  @Prop() percentage!: number | null;

  numeral = numeral;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
