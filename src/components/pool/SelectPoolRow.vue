<template>
  <div
    class="font-w600 font-size-14"
    :class="darkMode ? 'text-dark' : 'text-light'"
    @click="click"
  >
    <div class="d-flex justify-content-between">
      <pool-logos :pool="pool" />
      <div>
        <span>{{ smartTokenAmount }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import { PoolTokenPosition, ViewRelay, ViewReserve } from "@/types/bancor";
import { vxm } from "@/store";
import PoolLogos from "@/components/common/PoolLogos.vue";
import { prettifyNumber } from "@/api/helpers";

@Component({
  components: { PoolLogos }
})
export default class SelectPoolRow extends Vue {
  @Prop() pool!: ViewRelay;

  @Emit()
  click() {}

  get smartTokenAmount() {
    const position = this.positions.find(x => x.relay.id === this.pool.id);
    if (position && position.smartTokenAmount)
      return prettifyNumber(position.smartTokenAmount);
    else return "";
  }

  get positions(): PoolTokenPosition[] {
    return vxm.bancor.poolTokenPositions.filter((x: PoolTokenPosition) =>
      this.getPoolLabel(x.relay.reserves)
    );
  }

  getPoolLabel(reserves: ViewReserve[]) {
    return `${reserves[0].symbol}/${reserves[1].symbol}`;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/_scss/custom/variables";

.overlap {
  margin-left: -10px;
}
</style>
