<template>
  <div :class="contentClass" class="mb-3">
    <div class="sub-content-header px-3 py-3">{{ title }}</div>
    <div class="sub-content-body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class SubContentBlock extends BaseComponent {
  @Prop() title!: string;

  get contentClass() {
    return this.darkMode ? "sub-content-dark" : "sub-content";
  }
}
</script>
<style lang="scss">
@import "../../assets/_scss/custom/variables";

.sub-content {
  border: solid 1px $gray-border;
  border-radius: $border-radius;

  .sub-content-header {
    font-size: 14px;
    font-weight: 500;
    color: $text-muted-light;
    background-color: $block-bg-blue;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    border-bottom: solid 1px $gray-border;
  }

  .sub-content-body {
    font-size: 14px;
    font-weight: 500;
    color: $text-color-light;
  }
}

.sub-content-dark {
  @extend .sub-content;
  border: solid 1px $gray-border-dark !important;

  .sub-content-header {
    color: $text-muted-dark !important;
    background-color: $gray-border-dark !important;
    border-bottom: solid 1px $gray-border-dark !important;
  }

  .sub-content-body {
    color: $text-color-dark !important;
  }
}
</style>
