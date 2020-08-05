<template>
  <div
    class="font-w600 font-size-14 d-flex align-items-center cursor"
    :class="darkMode ? 'text-dark' : 'text-light'"
  >
    <img
      class="img-avatar img-avatar32 bg-white"
      :src="pool.reserves[0].logo"
      alt="Token Logo"
    />
    <img
      class="img-avatar img-avatar32 bg-white overlap"
      :src="pool.reserves[1].logo"
      alt="Token Logo"
    />
    <span class="ml-2 mr-2"
      >{{ pool.reserves[0].symbol }}/{{ pool.reserves[1].symbol }}</span
    >
    <font-awesome-icon v-if="dropdown" icon="caret-down" />
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
  @Prop({ default: false }) dropdown!: boolean;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss">
.overlap {
  margin-left: -10px;
}
</style>
