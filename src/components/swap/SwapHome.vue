<template>
  <div>
    <content-block class="mb-3" :shadow="true">
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
import ContentBlock from "@/components/common/ContentBlock.vue";
import SubNavigation from "@/components/layout/SubNavigation.vue";
import SwapAction from "@/components/swap/SwapAction.vue";
import { Options, Vue } from "vue-class-component/dist/vue-class-component"

@Options({
  components: {
    SwapAction,
    SubNavigation,
    ContentBlock
  }
})
export default class SwapHome extends Vue {}
</script>

<style scoped lang="scss"></style>
