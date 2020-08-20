<template>
  <div :class="darkMode ? 'btn-disabled-dark' : 'btn-disabled-light'">
    <b-btn
      :variant="variant"
      class="block-rounded border-0"
      :class="{
        'btn-large': large,
        'btn-sm': small,
        'btn-block': block
      }"
      :disabled="disabled"
    >
      <span v-if="label">{{ label }}</span>
      <slot v-else></slot>
    </b-btn>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class MainButton extends Vue {
  @Prop({ default: "" }) label!: string;
  @Prop({ default: false }) active!: boolean;
  @Prop({ default: false }) large!: boolean;
  @Prop({ default: false }) disabled!: boolean;
  @Prop({ default: false }) small!: boolean;
  @Prop({ default: false }) loading!: boolean;
  @Prop({ default: true }) block!: boolean;

  get darkMode() {
    return vxm.general.darkMode;
  }

  get variant() {
    return this.active ? "primary" : this.darkMode ? "dark" : "light";
  }
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
