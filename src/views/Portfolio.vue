<template>
  <b-container fluid="xl" class="px-xl-0">
    <b-tabs no-fade>
      <b-tab :title="$t('liquidity_protection')" active>
        <protection-home />
      </b-tab>
      <b-tab :title="$t('pool_token')">
        <pool-home />
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";
import ProtectionHome from "@/components/protection/ProtectionHome.vue";
import PoolHome from "@/components/pool/PoolHome.vue";

@Component({
  components: {
    ProtectionHome,
    PoolHome
  }
})
export default class Portfolio extends BaseComponent {}
</script>

<style lang="scss"></style>
