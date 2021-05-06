<template>
  <content-block :no-header="true" class="mb-3" :shadow="true">
    <b-button-group class="d-flex w-100 text-center mt-2 mb-3 pt-3">
      <b-button
        id="market"
        @click="limit = false"
        :variant="
          limit ? 'outline-primary' + (darkMode ? '-dark' : '') : 'primary'
        "
        >{{ $t("market") }}
      </b-button>
      <b-button
        id="limit"
        @click="limit = true"
        :variant="
          !limit ? 'outline-primary' + (darkMode ? '-dark' : '') : 'primary'
        "
        >{{ $t("limit") }}
      </b-button>
    </b-button-group>
    <b-popover
      target="market"
      triggers="hover"
      placement="left"
      class="font-size-12 font-w400"
      :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
    >
      {{ $t("exe_market_rate") }}
    </b-popover>
    <b-popover
      target="limit"
      triggers="hover"
      placement="right"
      class="font-size-12 font-w400"
      :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
    >
      {{ $t("trade_at_pre_det") }}
    </b-popover>
    <swap-limit v-if="limit" />
    <swap-market v-else />
  </content-block>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import ContentBlock from "@/components/common/ContentBlock.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import SwapMarket from "@/components/swap/SwapMarket.vue";
import SwapLimit from "@/components/swap/SwapLimit.vue";

@Component({
  components: {
    ContentBlock,
    SwapLimit,
    SwapMarket
  }
})
export default class SwapHome extends BaseComponent {
  limit = false;
}
</script>

<style lang="scss">
.popover {
  max-width: 300px;
}
</style>
