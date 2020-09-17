<template>
  <p>hello world</p>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import Statistics from "@/components/data/statistics/Statistics.vue";
import LiquidityChart from "@/components/data/charts/LiquidityChart.vue";
import VolumeChart from "@/components/data/charts/VolumeChart.vue";
import PoolTokenTables from "@/components/data/pooltokentables/PoolTokenTables.vue";
import TransactionTables from "@/components/data/transactiontables/TransactionTables.vue";

@Component({})
export default class Stake extends Vue {
  get isEth() {
    return this.$route.params.service === "eth";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
