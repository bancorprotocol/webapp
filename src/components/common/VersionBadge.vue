<template>
  <div class="d-flex align-items-center">
    <b-badge class="badge-version text-primary px-2">
      {{ versionString }}
    </b-badge>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class VersionBadge extends BaseComponent {
  @Prop() version!: 1 | 2;

  get versionString() {
    return "V" + this.version;
  }
}
</script>
<style lang="scss">
// @import "../../../assets/_scss/custom/variables";

.badge-version {
  font-size: 12px !important;
  background-color: #e9f2fd !important;
}
</style>
