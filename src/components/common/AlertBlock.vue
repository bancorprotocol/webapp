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
      <div v-if="messages !== undefined">
        <div v-for="message in messages" :key="message" name="default">
          <font-awesome-icon
            :icon="`exclamation-${
              variant === 'warning' ? 'triangle' : 'circle'
            }`"
            :class="`text-${variant} mr-1`"
          />
          {{ message }}
        </div>
      </div>
      <div v-else>
        <slot name="default">{{ msg }}</slot>
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class AlertBlock extends BaseComponent {
  @Prop({ default: "info" }) variant!: "info" | "error" | "warning";
  @Prop() title?: string;
  @Prop({ default: "" }) msg!: string;
  @Prop() messages!: string[];

  get showAlert() {
    return !!this.$slots.default || this.msg || this.messages;
  }

  @Emit()
  click() {}
}
</script>

<style lang="scss"></style>
