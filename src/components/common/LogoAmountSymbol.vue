<template>
  <div class="d-flex align-items-center">
    <pool-logos-overlapped v-if="poolId" :pool-id="poolId" size="20" />
    <img
      v-if="tokenId"
      class="img-avatar bg-white logo-shadow img-avatar20"
      :src="logo"
      :alt="$t('token_logo')"
    />

    <span
      class="font-size-14 font-w600 ml-2"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <animation-number
        v-if="animated"
        :target-value="amount"
        :animation-time="3000"
        :trailing-text="symbol"
      />
      <span v-else>{{ `${amount} ${symbol}` }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { vxm } from "@/store/";
import PoolLogosOverlapped from "@/components/common/PoolLogosOverlapped.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import AnimationNumber from "@/components/common/AnimationNumber.vue";
@Component({
  components: { AnimationNumber, PoolLogosOverlapped }
})
export default class LogoAmountSymbol extends BaseComponent {
  @Prop() tokenId?: string;
  @Prop() poolId?: string;
  @Prop() amount!: string | number;
  @Prop() symbol!: string;
  @Prop({ default: null }) usdValue!: string | number;
  @Prop({ default: false }) animated!: boolean;

  get logo() {
    return vxm.bancor.token(this.tokenId!).logo;
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/_scss/custom/variables";

.overlap {
  margin-left: -10px;
}
</style>
