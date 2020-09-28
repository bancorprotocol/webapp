<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-row>
      <b-col cols="12">
        <div class="mt-2">
          <span
            class="font-size-20 font-w600"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            Liquidity Protection
          </span>

          <b-btn
            variant="primary"
            class="float-right"
            :to="{ name: 'AddProtection' }"
            >Stake</b-btn
          >
        </div>
        <p
          class="font-size-14 font-w400 my-3"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          Add impermanent loss protection to any of your pool token stakings
        </p>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <protectable-liquidity class="mb-3" />
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <protected-liquidities />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ProtectableLiquidity from "@/components/protection/ProtectableLiquidity.vue";
import ProtectedLiquidities from "@/components/protection/ProtectedLiquidities.vue";

@Component({
  components: {
    ProtectedLiquidities,
    ProtectableLiquidity
  }
})
export default class LiquidityProtectionSummary extends Vue {
  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
