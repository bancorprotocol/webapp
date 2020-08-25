<template>
  <div>
    <span v-for="(reserve, index) in pool.reserves" :key="reserve.id">
      {{ reserve.symbol }}
      <span v-if="index + 1 < pool.reserves.length">/</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ViewRelay } from "@/types/bancor";
import { vxm } from "@/store";

@Component({
  components: {}
})
export default class PoolLogos extends Vue {
  @Prop() pool!: ViewRelay;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
