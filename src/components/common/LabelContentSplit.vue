<template>
  <div class="d-flex justify-content-between align-items-center">
    <div>
      <span
        class="font-size-12 font-w500 text-uppercase"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        {{ label }}
      </span>
      <font-awesome-icon
        v-if="tooltip"
        id="popover-target"
        icon="info-circle"
        class="ml-1"
      />
      <b-popover
        v-if="tooltip"
        target="popover-target"
        triggers="hover"
        placement="top"
      >
        {{ tooltip }}
      </b-popover>
    </div>

    <span
      v-if="!loading"
      class="font-size-12 font-w600"
      :class="isAlert ? 'text-red' : darkMode ? 'text-dark' : 'text-light'"
    >
      <slot>{{ value }}</slot>
    </span>
    <span
      v-else
      class="font-size-12 font-w600"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <font-awesome-icon icon="circle-notch" spin />
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class LabelContentSplit extends BaseComponent {
  @Prop() label!: string;
  @Prop() value?: string;
  @Prop({ default: false }) loading?: boolean;
  @Prop({ default: "" }) tooltip?: string;
  @Prop({ default: false }) isAlert?: boolean;
}
</script>

<style scoped lang="scss"></style>
