<template>
  <div class="d-flex justify-content-between align-items-center">
    <span
      class="font-size-12 font-w500 text-uppercase"
      :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >{{ label }}</span
    >
    <span
      v-if="value"
      class="font-size-12 font-w600"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      {{ value }}
    </span>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component({
  components: {}
})
export default class LabelContentSplit extends Vue {
  @Prop() label!: string;
  @Prop() value?: string;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
