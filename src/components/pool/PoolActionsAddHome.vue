<template>
  <content-block title="Add Liquidity" :back-button="true" @back="back">
    <div class="mt-3">
      <label-content-split label="Selected Pool" class="mb-3">
        <pool-logos :pool="pool" :cursor="false" />
      </label-content-split>

      <alert-block
        title="Learn what it means to add liquidity to a pool:"
        class="my-3"
      >
        <ol class="m-0 pl-3">
          <li>
            <a
              href="https://blog.bancor.network/how-to-stake-liquidity-earn-fees-on-bancor-bff8369274a1"
              target="_blank"
            >
              How do I make money by providing liquidity?
            </a>
          </li>
          <li>
            <a
              href="https://blog.bancor.network/beginners-guide-to-getting-rekt-by-impermanent-loss-7c9510cb2f22"
              target="_blank"
            >
              What is impermanent loss?
            </a>
          </li>
          <li>
            <a
              href="https://bankless.substack.com/p/how-to-protect-yourself-from-impermanent"
              target="_blank"
            >
              How does Bancor protect me from impermanent loss?
            </a>
          </li>
        </ol>
      </alert-block>

      <stake-buttons @click="click" :show-add-liquidity="true" />
    </div>
  </content-block>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
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
    this.$router.push({
      name: "AddProtectionSingle",
      params: { id: this.pool.id }
    });
  }

  goToAddLiquidity() {
    this.$router.push({
      name: "PoolAction",
      params: { poolAction: "add", account: this.pool.id }
    });
  }

  back() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss"></style>
