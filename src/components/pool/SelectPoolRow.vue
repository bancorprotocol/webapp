<template>
  <div
    class="font-w600 font-size-14"
    :class="darkMode ? 'text-dark' : 'text-light'"
    @click="click"
  >
    <div class="d-flex justify-content-between">
      <pool-logos :pool="pool" />
      <div>
        <span>{{ balance }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit } from "vue-property-decorator";
import { PoolTokenPosition, ViewRelay } from "@/types/bancor";
import { vxm } from "@/store";
import PoolLogos from "@/components/common/PoolLogos.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: { PoolLogos }
})
export default class SelectPoolRow extends BaseComponent {
  @Prop() pool!: ViewRelay;
  @Prop({ default: false }) showTokenBalance!: boolean;

  @Emit()
  click() {}

  get balance() {
    const balance = this.showTokenBalance ? this.tokenBalance : null;
    return balance ? this.prettifyNumber(balance) : "";
  }

  get smartTokenBalance() {
    const position = this.positions.find(x => x.relay.id === this.pool.id);
    if (position && position.smartTokenAmount) return position.smartTokenAmount;
    else return "";
  }

  get tokenBalance() {
    return vxm.bancor.token(this.pool.reserves[1].id).balance ?? "";
  }

  get positions(): PoolTokenPosition[] {
    return vxm.bancor.poolTokenPositions;
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/_scss/custom/variables";

.overlap {
  margin-left: -10px;
}
</style>
