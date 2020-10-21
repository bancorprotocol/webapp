<template>
  <content-block title="Add Liquidity" :back-button="true" @back="back">
    <div class="mt-3">
      <label-content-split label="Selected Pool" class="mb-3">
        <pool-logos :pool="pool" :cursor="false" />
      </label-content-split>

      <alert-block
        v-if="false"
        msg="In this particular pool you are able to stake and protect from impermanent loss single token or both pool assets."
        class="my-3"
      />

      <stake-buttons :show-add-liquidity="true" @click="click" />
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
import StakeButtons from "@/components/protection/StakeButtons.vue";

@Component({
  components: {
    StakeButtons,
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

  click(optionId: number) {
    if (optionId === 0) {
      this.goToSingle();
    } else {
      this.goToAddLiquidity();
    }
  }

  goToSingle() {
    void this.$router.push({
      name: "AddProtectionSingle",
      params: { id: this.pool.id }
    });
  }

  goToAddLiquidity() {
    void this.$router.push({
      name: "PoolAction",
      params: { poolAction: "add", account: this.pool.id }
    });
  }

  back() {
    void this.$router.push({ name: "Pool" });
  }
}
</script>

<style lang="scss"></style>
