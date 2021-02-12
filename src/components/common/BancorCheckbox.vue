<template>
  <div class="mb-3 d-flex justify-content-center">
    <b-form-checkbox v-model="localValue" size="lg">
      <span class="font-w600 font-size-12 mt-1">
        {{ label }}
      </span>
    </b-form-checkbox>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, VModel } from "vue-property-decorator";

@Component
export default class BancorCheckbox extends Vue {
  @VModel({ type: Boolean }) localValue!: boolean;
  @Prop() label!: string;
}
</script>

<style scoped lang="scss"></style>
