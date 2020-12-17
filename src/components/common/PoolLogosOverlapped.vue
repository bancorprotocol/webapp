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
import { Prop } from "vue-property-decorator";
import { vxm } from "@/store/";
import { ViewRelay } from "@/types/bancor"
import { defaultImage } from "@/store/modules/swap/ethBancor"
import { Vue } from "vue-class-component/dist/vue-class-component"

export default class PoolLogosOverlapped extends Vue {
  @Prop() poolId?: string;
  @Prop() pool?: ViewRelay;
  @Prop({ default: "32" }) size!: "16" | "20" | "32" | "48" | "96" | "128";

  get loadedPool() {
    const pool = this.pool ? this.pool : vxm.bancor.relay(this.poolId);
    if (
      pool &&
      pool.id &&
      pool.reserves &&
      pool.reserves.length >= 2 &&
      pool.reserves[0].id &&
      pool.reserves[1].id
    )
      return pool;
    else
      return {
        reserves: [
          { id: 1, logo: defaultImage },
          { id: 2, logo: defaultImage }
        ]
      };
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
