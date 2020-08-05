<template>
  <div
    class="block"
    :class="[
      { 'block-rounded': rounded },
      { 'block-shadow': shadow },
      { 'bg-block-dark': darkMode },
      { 'bg-block-light': !darkMode }
    ]"
  >
    <div v-if="noHeader" class="block-header p-0"></div>
    <div v-else-if="title" class="block-header">
      <h3
        class="block-title"
        :class="darkMode ? 'text-body-dark' : 'text-body-light'"
      >
        {{ title }}
      </h3>
    </div>
    <div v-else class="block-header">
      <slot name="header"></slot>
    </div>
    <div class="block-content pb-3 pt-0">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Watch, Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component
export default class ContentBlock extends Vue {
  @Prop() title?: string;
  @Prop({ default: false }) noHeader?: boolean;
  @Prop({ default: true }) rounded?: boolean;
  @Prop({ default: true }) shadow?: boolean;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped></style>
