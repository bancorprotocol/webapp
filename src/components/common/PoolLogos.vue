<template>
  <span @click="click">
    <div
      v-if="pool"
      class="font-w600 font-size-14 d-flex align-items-center"
      :class="[darkMode ? 'text-dark' : 'text-light', cursor ? 'cursor' : '']"
    >
      <pool-logos-overlapped :pool-id="pool.id" size="20" />
      <span class="ml-2">{{ poolName }}</span>
      <font-awesome-icon v-if="dropdown" icon="caret-down" class="ml-2" />
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
      <span class="ml-2 mr-2">{{ token.symbol }}</span>
      <font-awesome-icon v-if="dropdown" icon="caret-down" />
    </div>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import { ViewRelay, ViewToken } from "@/types/bancor";
import { vxm } from "@/store";
import PoolLogosOverlapped from "@/components/common/PoolLogosOverlapped.vue";
import { buildPoolName } from "@/api/helpers";
import VersionBadge from "@/components/common/VersionBadge.vue";

@Component({
  components: { VersionBadge, PoolLogosOverlapped }
})
export default class PoolLogos extends Vue {
  @Prop() pool?: ViewRelay;
  @Prop() token?: ViewToken;
  @Prop({ default: false }) dropdown!: boolean;
  @Prop({ default: true }) cursor!: boolean;
  @Prop({ default: false }) version!: boolean;

  @Emit()
  click() {}

  get poolName() {
    return buildPoolName(this.pool!.id);
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
