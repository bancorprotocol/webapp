<template>
  <div>
    <content-block class="mb-3">
      <template slot="header">
        <sub-navigation />
      </template>

      <div>
        <swap-action />
      </div>
    </content-block>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContentBlock from "@/components/common/ContentBlock.vue";
import SubNavigation from "@/components/layout/SubNavigation.vue";
import SwapAction from "@/components/swap/SwapAction.vue";

@Component({
  components: {
    SwapAction,
    SubNavigation,
    ContentBlock
  }
})
export default class SwapHome extends Vue {}
</script>

<style scoped lang="scss"></style>
