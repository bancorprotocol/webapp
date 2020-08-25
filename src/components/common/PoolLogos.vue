<template>
  <div
    v-if="pool"
    class="font-w600 font-size-14 d-flex align-items-center"
    :class="[darkMode ? 'text-dark' : 'text-light', cursor ? 'cursor' : '']"
  >
    <img
      v-for="(reserve, index) in pool.reserves"
      :key="reserve.id"
      class="img-avatar img-avatar32 bg-white"
      :class="index !== 0 ? 'overlap' : ''"
      :src="reserve.logo"
      alt="Token Logo"
      style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08); border: solid 1px #e6ebf2;"
    />

    <pool-name v-if="showName" :pool="pool" class="mx-2" />

    <font-awesome-icon v-if="dropdown" icon="caret-down" />

    <b-badge v-if="version" class="badge-v2 text-primary px-2">
      {{ pool.v2 ? "V2" : "V1" }}
    </b-badge>
  </div>

  <div
    v-else-if="token"
    class="font-w600 font-size-14 d-flex align-items-center"
    :class="[darkMode ? 'text-dark' : 'text-light', cursor ? 'cursor' : '']"
  >
    <img
      class="img-avatar img-avatar32 bg-white"
      :src="token.logo"
      alt="Token Logo"
      style="box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08); border: solid 1px #e6ebf2;"
    />
    <span v-if="showName" class="ml-2 mr-2">{{ token.symbol }}</span>
    <font-awesome-icon v-if="dropdown" icon="caret-down" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ViewRelay, ViewToken } from "@/types/bancor";
import { vxm } from "@/store";
import PoolName from "@/components/common/PoolName.vue";

@Component({
  components: {
    PoolName
  }
})
export default class PoolLogos extends Vue {
  @Prop() pool?: ViewRelay;
  @Prop() token?: ViewToken;
  @Prop({ default: true }) showName!: boolean;
  @Prop({ default: false }) dropdown!: boolean;
  @Prop({ default: true }) cursor!: boolean;
  @Prop({ default: false }) version!: boolean;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss">
.overlap {
  margin-left: -10px;
}

.badge-v2 {
  font-size: 12px !important;
  background-color: #e9f2fd !important;
}
</style>
