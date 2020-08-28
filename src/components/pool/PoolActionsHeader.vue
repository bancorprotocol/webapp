<template>
  <div class="d-flex justify-content-between w-100 align-items-center">
    <font-awesome-icon icon="chevron-left" @click="back" class="cursor" />
    <span
      class="font-size-14 font-w600"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      {{ title }}
    </span>
    <div class="d-flex align-items-center">
      <b-badge v-if="v2 !== null" variant="primary" class="px-2">{{
        v2 ? "V2" : "V1"
      }}</b-badge>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component
export default class PoolActionsHeader extends Vue {
  @Prop() title!: string;
  @Prop({ default: null }) v2!: boolean | null;

  @Emit()
  back() {}

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
