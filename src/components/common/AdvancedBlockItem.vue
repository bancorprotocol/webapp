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
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component
export default class AdvancedBlockItem extends Vue {
  @Prop() label!: string;
  @Prop() value!: string;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped></style>
