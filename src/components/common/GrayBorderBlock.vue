<template>
  <div>
    <div class="block-rounded rounded px-3 py-2" :class="blockStyle">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class GrayBorderBlock extends BaseComponent {
  @Prop({ default: false }) grayBg!: boolean;

  get blockStyle() {
    if (this.grayBg)
      return this.darkMode ? "block-light-blue-dark" : "block-light-blue-light";
    else return this.darkMode ? "border-gray-dark" : "border-gray";
  }
}
</script>
<style lang="scss"></style>
