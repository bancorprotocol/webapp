<template>
  <div
    v-if="msg !== ''"
    class="w-100 mt-1 font-size-14"
    :class="
      darkMode ? 'alert-' + variant + '-dark' : 'alert-' + variant + '-light'
    "
  >
    <div v-if="title" class="font-w700 mb-2">{{ title }}</div>
    <span class="font-w500">{{ msg }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component
export default class AlertBlock extends Vue {
  @Prop({ default: "info" }) variant!: "info" | "error";
  @Prop() title?: string;
  @Prop({ default: "" }) msg!: string;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
