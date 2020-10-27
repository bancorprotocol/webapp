<template>
  <div class="px-4 pt-4 border-top">
    {{ jsonDump }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class WhitelistedPools extends Vue {
  get relays() {
    return vxm.ethBancor.relays.filter(x => x.whitelisted);
  }

  get jsonDump() {
    return JSON.stringify(this.relays, null, 10);
  }
}
</script>

<style lang="scss"></style>
