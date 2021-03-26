<template>
  <content-block :no-header="true" class="mb-3" :shadow="true">
    <b-button-group class="d-flex w-100 text-center mt-2 mb-3 pt-3">
      <b-button
        @click="$router.push({ name: 'Swap' })"
        :variant="
          limit ? 'outline-primary' + (darkMode ? '-dark' : '') : 'primary'
        "
        >{{ $t("market") }}
      </b-button>
      <b-button
        @click="$router.push({ name: 'SwapLimit' })"
        :variant="
          !limit ? 'outline-primary' + (darkMode ? '-dark' : '') : 'primary'
        "
        >{{ $t("limit") }}
      </b-button>
    </b-button-group>
    <router-view />
  </content-block>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import ContentBlock from "@/components/common/ContentBlock.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    ContentBlock
  }
})
export default class SwapHome extends BaseComponent {
  get limit() {
    return this.$route.name === "SwapLimit";
  }
}
</script>

<style scoped lang="scss"></style>
