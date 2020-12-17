<template>
  <div
    v-if="showAlert"
    class="w-100 mt-1 font-size-14"
    @click="click"
    :class="
      darkMode ? 'alert-' + variant + '-dark' : 'alert-' + variant + '-light'
    "
  >
    <div v-if="title" class="font-w700 mb-2">{{ title }}</div>
    <span class="font-w500">
      <slot name="default">{{ msg }}</slot>
    </span>
  </div>
</template>

<script lang="ts">
import { Prop, Emit } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

export default class AlertBlock extends BaseComponent {
  @Prop({ default: "info" }) variant!: "info" | "error" | "warning";
  @Prop() title?: string;
  @Prop({ default: "" }) msg!: string;

  get showAlert() {
    return !!this.$slots.default || this.msg;
  }

  @Emit()
  click() {}
}
</script>

<style lang="scss"></style>
