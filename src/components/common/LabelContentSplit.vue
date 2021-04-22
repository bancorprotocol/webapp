<template>
  <div class="d-flex justify-content-between align-items-center">
    <div class="d-flex align-items-center">
      <span
        class="font-size-14 font-w400"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        {{ label }}
      </span>
      <font-awesome-icon
        v-if="tooltip"
        id="popover-target"
        icon="info-circle"
        class="ml-1"
        :class="isAlert ? 'text-red' : ''"
      />
      <b-popover
        v-if="tooltip"
        target="popover-target"
        triggers="hover"
        placement="top"
      >
        {{ tooltip }}
        <a v-if="href" :href="href" target="_blank">
          {{ hrefText }}
        </a>
      </b-popover>
    </div>

    <span
      v-if="!loading"
      class="font-size-14 font-w400"
      :class="isAlert ? 'text-red' : darkMode ? 'text-dark' : 'text-light'"
    >
      <slot>{{ value }}</slot>
    </span>
    <span
      v-else
      class="font-size-14 font-w400"
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
  @Prop({ default: "" }) href?: string;
  @Prop({ default: "" }) hrefText?: string;
  @Prop({ default: false }) isAlert?: boolean;
}
</script>

<style scoped lang="scss"></style>
