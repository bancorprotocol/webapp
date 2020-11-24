<template>
  <div class="d-flex justify-content-between">
    <p
      class="m-0 my-1 p-0"
      :class="darkMode ? 'text-body-dark' : 'text-body-light'"
    >
      {{ label }}
    </p>
    <p
      class="m-0 my-1 p-0 font-w600"
      :class="darkMode ? 'text-body-dark' : 'text-body-light'"
    >
      {{ value }}
    </p>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";

@Component
export default class AdvancedBlockItem extends BaseComponent {
  @Prop() label!: string;
  @Prop() value!: string;
}
</script>

<style scoped></style>
