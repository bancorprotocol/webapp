<template>

</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {ViewProtectedLiquidity} from "@/types/bancor";

@Component
export default class ProtectedSummary extends Vue {
  @Prop() positions!: ViewProtectedLiquidity[]

}
</script>

<style lang="scss" scoped>

</style>
