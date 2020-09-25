<template>
  <div>
    <div class="block-rounded rounded px-3 py-2" :class="blockStyle">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component
export default class GrayBorderBlock extends Vue {
  @Prop({ default: false }) grayBg!: boolean;

  get blockStyle() {
    if (this.grayBg)
      return this.darkMode ? "block-light-blue-dark" : "block-light-blue-light";
    else return this.darkMode ? "border-gray-dark" : "border-gray";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>
<style lang="scss"></style>
