<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-tabs no-fade :class="darkMode ? 'large-tabs-dark' : 'large-tabs-light'">
      <b-tab :title="$t('liquidity_protection')" active>
        <protection-home />
      </b-tab>
      <b-tab :title="$t('pool_token')" v-if="hasPositions">
        <pool-home />
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";
import { vxm } from "@/store";
import ProtectionHome from "@/components/protection/ProtectionHome.vue";
import PoolHome from "@/components/pool/PoolHome.vue";

@Component({
  components: {
    ProtectionHome,
    PoolHome
  }
})
export default class Portfolio extends BaseComponent {
  get hasPositions() {
    return vxm.bancor.poolTokenPositions.length > 0;
  }
}
</script>

<style lang="scss"></style>
