<template>
  <div>
    <img
      v-for="(reserve, index) in loadedPool.reserves"
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
import { ViewRelay } from "@/types/bancor"

@Component
export default class PoolLogosOverlapped extends Vue {
  @Prop() poolId?: string;
  @Prop() pool?: ViewRelay;
  @Prop({ default: "32" }) size!: "16" | "20" | "32" | "48" | "96" | "128";

  get loadedPool() {
    return this.pool ? this.pool : vxm.bancor.relay(this.poolId);
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
