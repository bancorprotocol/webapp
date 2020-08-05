<template>
  <div class="d-flex justify-content-between w-100 align-items-center">
    <font-awesome-icon
      icon="chevron-left"
      @click="$router.push({ name: 'Pool' })"
      class="cursor"
    />
    <span>{{ withdrawLiquidity ? "Remove" : "Add" }} Liquidity</span>
    <div class="d-flex align-items-center">
      <b-badge variant="primary" class="px-2">{{ v2 ? "V2" : "V1" }}</b-badge>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component
export default class PoolActionsHeader extends Vue {
  @Prop() withdrawLiquidity!: boolean;
  @Prop() v2!: boolean;
}
</script>

<style scoped lang="scss"></style>
