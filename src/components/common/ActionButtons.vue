<template>
  <div>
    <b-btn
      v-if="pool"
      @click="goToPool"
      variant="primary"
      class="mr-3"
      :class="small ? 'table-button-small' : 'table-button'"
    >
      <span v-if="!small"> {{ $t("add_liquidity") }} </span>
      <font-awesome-icon v-else icon="plus" />
    </b-btn>

    <b-btn
      @click="goToSwap"
      :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
      :class="small ? 'table-button-small' : 'table-button'"
    >
      <span v-if="!small">{{ $t("trade") }}</span>
      <font-awesome-icon
        v-else
        icon="exchange-alt"
        v-b-tooltip.hover
        :title="$t('trade')"
      />
    </b-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { ViewToken, ViewRelay } from "@/types/bancor";
import BaseComponent from "@/components/BaseComponent.vue";
import BigNumber from "bignumber.js";

@Component
export default class ActionButtons extends BaseComponent {
  @Prop() pool?: ViewRelay;
  @Prop() token?: ViewToken;
  @Prop({ default: false }) small!: boolean;

  goToPool() {
    if (this.pool && this.pool.addProtectionSupported) {
      this.$router.push({
        name: "AddProtectionSingle",
        params: { id: this.pool!.id }
      });
    } else {
      this.$router.push({
        name: "PoolAction",
        params: { poolAction: "add", account: this.pool!.id }
      });
    }
  }

  goToSwap() {
    this.$router.push({
      name: "Swap",
      query: {
        from: this.getId
      }
    });
  }

  get getId() {
    if (this.pool) return this.pool.reserves[1].id;
    else if (this.token) return this.token.id;
    else return null;
  }
}
</script>

<style lang="scss">
.table-button {
  font-size: 14px !important;
  font-weight: 500 !important;
  width: 132px;
  padding: 9px 0px 9px 0px !important;
}

.table-button-small {
  @extend .table-button;

  width: 50px;
}
</style>
