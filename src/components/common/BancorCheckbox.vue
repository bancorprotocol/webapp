<template>
  <div class="mb-3 d-flex justify-content-center">
    <b-form-checkbox :value="checked" @input="update" size="lg">
      <span class="font-w600 font-size-12 mt-1">
        {{ label }}
      </span>
    </b-form-checkbox>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

@Component
export default class BancorCheckbox extends Vue {
  @Prop() checked!: boolean;
  @Prop() label!: string;

  @Emit("input")
  update(value: boolean) {
    return value;
  }
}
</script>

<style scoped lang="scss"></style>
