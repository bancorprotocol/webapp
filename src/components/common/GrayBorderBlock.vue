<template>
  <div>
    <div
      class="block-rounded rounded px-3 py-2"
      :class="darkMode ? 'border-gray-dark' : 'border-gray'"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component
export default class GrayBorderBlock extends Vue {
  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>
<style lang="scss"></style>
