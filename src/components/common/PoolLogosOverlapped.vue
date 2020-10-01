<template>
  <div>
    <img
      v-for="(reserve, index) in pool.reserves"
      :key="reserve.id"
      class="img-avatar bg-white logo-shadow"
      :class="styleClasses(index)"
      :src="reserve.logo"
      alt="Token Logo"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";

@Component
export default class PoolLogosOverlapped extends Vue {
  @Prop() poolId!: string;
  @Prop({ default: "32" }) size!: "16" | "20" | "32" | "48" | "96" | "128";

  get pool() {
    return vxm.bancor.relay(this.poolId);
  }

  styleClasses(index: number) {
    const shadow = index !== 0 ? "overlap" : "";
    const size = "img-avatar" + this.size;
    return [shadow, size];
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/_scss/custom/variables";

.overlap {
  margin-left: -10px;
}
</style>
