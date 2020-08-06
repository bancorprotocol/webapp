<template>
  <content-block>
    <template slot="header">
      <pool-actions-header
        :withdraw-liquidity="withdrawLiquidity"
        :v2="pool.v2"
      />
      <hr :class="darkMode ? 'hr-dark' : 'hr-light'" />
    </template>

    <div v-if="!withdrawLiquidity">
      <pool-actions-add-v1 v-if="!pool.v2" :pool="pool" />
      <pool-actions-add-v2 v-else :pool="pool" />
    </div>

    <div v-else>
      <pool-actions-remove-v1 v-if="!pool.v2" :pool="pool" />
      <pool-actions-remove-v2 v-else :pool="pool" />
    </div>
  </content-block>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import ContentBlock from "@/components/common/ContentBlock.vue";
import { ViewRelay } from "@/types/bancor";
import PoolActionsHeader from "@/components/pool/PoolActionsHeader.vue";
import PoolActionsAddV1 from "@/components/pool/PoolActionsAddV1.vue";
import PoolActionsAddV2 from "@/components/pool/PoolActionsAddV2.vue";
import PoolActionsRemoveV1 from "@/components/pool/PoolActionsRemoveV1.vue";
import PoolActionsRemoveV2 from "@/components/pool/PoolActionsRemoveV2.vue";

@Component({
  components: {
    PoolActionsRemoveV2,
    PoolActionsRemoveV1,
    PoolActionsAddV2,
    PoolActionsAddV1,
    PoolActionsHeader,
    ContentBlock
  }
})
export default class PoolActions extends Vue {
  withdrawLiquidity = false;

  get pool(): ViewRelay {
    return vxm.bancor.relay(this.$route.params.account);
  }

  created() {
    this.withdrawLiquidity = this.$route.params.poolAction === "remove";
  }
}
</script>

<style scoped lang="scss"></style>
