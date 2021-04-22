<template>
  <div>
    <b-row>
      <b-col cols="12">
        <content-block
          :title="$t('manage_pool_tokens')"
          :tabs="true"
          :padding="false"
        >
        </content-block>
      </b-col>
      <b-col cols="12">
        <pool-token />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import PoolToken from "@/components/pool/PoolToken.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
import BaseComponent from "@/components/BaseComponent.vue";
@Component({
  components: {
    PoolToken,
    ContentBlock
  }
})
export default class PoolHome extends BaseComponent {}
</script>

<style scoped lang="scss"></style>
