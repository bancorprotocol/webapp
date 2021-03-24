<template>
  <content-block :no-header="true" class="mb-3" :shadow="true">
    <b-button-group class="d-flex w-100 text-center mt-2 mb-3 pt-3">
      <b-button
        @click="toggleLimit"
        :variant="
          limit ? 'outline-primary' + (darkMode ? '-dark' : '') : 'primary'
        "
        >{{ $t("market") }}
      </b-button>
      <b-button
        @click="toggleLimit"
        :variant="
          !limit ? 'outline-primary' + (darkMode ? '-dark' : '') : 'primary'
        "
        >{{ $t("limit") }}
      </b-button>
    </b-button-group>
    <swap-limit v-if="limit" />
    <swap-market v-else />
  </content-block>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import ContentBlock from "@/components/common/ContentBlock.vue";
import SwapLimit from "@/components/swap/SwapLimit.vue";
import SwapMarket from "@/components/swap/SwapMarket.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    SwapLimit,
    SwapMarket,
    ContentBlock
  }
})
export default class SwapHome extends BaseComponent {
  limit: boolean = false;

  toggleLimit() {
    this.limit = !this.limit;
  }
}
</script>

<style scoped lang="scss"></style>
