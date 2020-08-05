<template>
  <b-btn
    :variant="variant"
    class="block-rounded btn-block"
    :class="{ 'btn-large': large, 'btn-sm': small }"
    :disabled="disabled || loading"
  >
    <font-awesome-icon v-if="loading" icon="circle-notch" spin />
    <span v-else-if="label">{{ label }}</span>
    <slot v-else></slot>
  </b-btn>
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

  get darkMode() {
    return vxm.general.darkMode;
  }

  get variant() {
    return this.active ? "primary" : this.darkMode ? "dark" : "light";
  }
}
</script>

<style lang="scss">
.btn-large {
  height: 49px !important;
}
</style>
