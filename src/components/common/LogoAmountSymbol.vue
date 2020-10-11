<template>
  <div class="d-flex justify-content-start align-items-baseline">
    <pool-logos-overlapped v-if="poolId" :pool-id="poolId" size="20" />
    <img
      v-if="tokenId"
      class="img-avatar bg-white logo-shadow img-avatar20"
      :src="logo"
      alt="Token Logo"
    />
    <span
      class="font-size-14 font-w600 ml-2"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      {{ `${amount} ${symbol}` }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import PoolLogosOverlapped from "@/components/common/PoolLogosOverlapped.vue";
@Component({
  components: { PoolLogosOverlapped }
})
export default class LogoAmountSymbol extends Vue {
  @Prop() tokenId?: string;
  @Prop() poolId?: string;
  @Prop() amount!: string | number;
  @Prop() symbol!: string;
  @Prop({ default: null }) usdValue!: string | number;

  get logo() {
    return vxm.bancor.token(this.tokenId!).logo;
  }

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
