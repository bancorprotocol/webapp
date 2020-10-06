<template>
  <div
    class="font-w600 font-size-14 d-flex align-items-center justify-content-between"
    :class="darkMode ? 'text-dark' : 'text-light'"
    @click="click"
  >
    <div class="d-flex justify-content-center">
      <pool-logos :pool="pool" :version="true" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import { ViewRelay } from "@/types/bancor";
import { vxm } from "@/store";
import PoolLogos from "@/components/common/PoolLogos.vue";

@Component({
  components: { PoolLogos }
})
export default class SelectPoolRow extends Vue {
  @Prop() pool!: ViewRelay;

  @Emit()
  click() {}

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
