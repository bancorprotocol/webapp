<template>
  <div>
    <b-row>
      <b-col cols="12" class="mb-5">
        <p
          class="font-size-14 font-w400 my-3"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          {{ $t("manage_pool_tokens") }}
        </p>
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
import BaseComponent from "@/components/BaseComponent.vue";
@Component({
  components: {
    PoolToken
  }
})
export default class PoolHome extends BaseComponent {}
</script>

<style scoped lang="scss"></style>
