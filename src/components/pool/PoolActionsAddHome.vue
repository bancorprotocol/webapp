<template>
  <content-block
    title="Add Liquidity"
    :back-button="true"
    @back="back"
    :version="version"
  >
    <div class="mt-3">
      <label-content-split label="Selected Pool">
        <pool-logos :pool="pool" :cursor="false" />
      </label-content-split>

      <alert-block
        msg="In this particular pool you are able to stake and protect from impermanent loss single token or both pool assets."
        class="my-3"
      />

      <gray-border-block>
        <h5 class="font-size-12 font-w500 text-uppercase mb-2">
          Single Token
        </h5>
        <p class="font-size-14 font-w400 mb-3">
          Placeholder text allows you to stake just 1 of the assets in the pool
          with no exposure.
        </p>
        <main-button
          @click="goToAddProtection"
          label="Stake and Protect"
          :active="true"
          :large="true"
          class="mb-2 font-size-14"
        />
      </gray-border-block>

      <gray-border-block class="mt-3">
        <h5 class="font-size-12 font-w500 text-uppercase mb-2">
          Both Assets
        </h5>
        <p class="font-size-14 font-w400 mb-3">
          Placeholder text allows you to stake your existing pool tokens for
          protection.
        </p>
        <main-button
          @click="goToAddLiquidity"
          label="Add Liquidity"
          :active="false"
          :large="true"
          class="mb-2 font-size-14"
        />
      </gray-border-block>
    </div>
  </content-block>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store/";
import { ViewRelay } from "@/types/bancor";
import MainButton from "@/components/common/Button.vue";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";

@Component({
  components: {
    GrayBorderBlock,
    AlertBlock,
    PoolLogos,
    ContentBlock,
    LabelContentSplit,
    MainButton
  }
})
export default class PoolActionsAddHome extends Vue {
  get pool(): ViewRelay {
    return vxm.bancor.relay(this.$route.params.id);
  }

  get version() {
    return this.pool.v2 ? 2 : 1;
  }

  goToAddLiquidity() {
    this.$router.push({
      name: "PoolAction",
      params: { poolAction: "add", account: this.pool.id }
    });
  }

  goToAddProtection() {
    this.$router.push({
      name: "ProtectionAction",
      params: { action: "add", id: this.pool.id }
    });
  }

  back() {
    this.$router.push({ name: "Pool" });
  }
}
</script>

<style lang="scss">
.custom-control-inline {
  margin-right: 0 !important;
  margin-left: 1rem !important;
}
.custom-control-label {
  display: inline-flex !important;
  align-items: center !important;
}
</style>
