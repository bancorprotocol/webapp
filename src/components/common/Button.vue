<template>
  <b-btn
    :variant="variant"
    @click="click"
    class="block-rounded"
    :class="{ 'btn-large': large, 'btn-sm': small, 'btn-block': block }"
    :disabled="disabled || loading"
  >
    <font-awesome-icon v-if="loading" icon="circle-notch" spin />
    <span v-else-if="label" class="font-size-14 font-w500">{{ label }}</span>
    <slot v-else></slot>
  </b-btn>
</template>

<script lang="ts">
import { Prop, Component, Emit } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class MainButton extends BaseComponent {
  @Prop({ default: "" }) label!: string;
  @Prop({ default: false }) active!: boolean;
  @Prop({ default: false }) error!: boolean;
  @Prop({ default: false }) large!: boolean;
  @Prop({ default: false }) disabled!: boolean;
  @Prop({ default: false }) small!: boolean;
  @Prop({ default: false }) loading!: boolean;
  @Prop({ default: true }) block!: boolean;

  get variant() {
    return this.error
      ? "error"
      : this.active
      ? "primary"
      : this.darkMode
      ? "outline-gray-dark"
      : "outline-gray";
  }

  @Emit()
  click() {}
}
</script>

<style lang="scss">
@import "@/assets/_scss/custom/_variables";

.btn-large {
  height: 49px !important;
}

.btn-disabled-light {
  button:disabled,
  button[disabled] {
    background-color: $gray-placeholder !important;
  }
}

.btn-disabled-dark {
  button:disabled,
  button[disabled] {
    background-color: $gray-border-dark !important;
  }
}
</style>
