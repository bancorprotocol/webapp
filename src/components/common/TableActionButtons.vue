<template>
  <b-row v-if="pool" class="mx-0">
    <b-col cols="7" class="pl-0 pr-0">
      <b-btn
        :to="{
          name: 'PoolAction',
          params: {
            poolAction: 'add',
            account: pool.id
          }
        }"
        variant="primary"
        class="btn-block mr-2"
        style="min-width: 130px"
      >
        Add Liquidity
      </b-btn>
    </b-col>
    <b-col cols="5" class="pr-0 pl-2">
      <b-btn
        :to="{
          name: 'Swap',
          query: {
            from: pool.reserves[1].id
          }
        }"
        :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
        class="btn-block"
      >
        Trade
      </b-btn>
    </b-col>
  </b-row>
  <b-btn
    v-else-if="token"
    :to="{
      name: 'Swap',
      query: {
        from: token.id
      }
    }"
    :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
    class="btn-block"
  >
    Trade
  </b-btn>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, PropSync } from "vue-property-decorator";
import { vxm } from "@/store";
import { ViewToken, ViewRelay } from "@/types/bancor";

@Component({
  components: {}
})
export default class TableActionButtons extends Vue {
  @Prop() pool?: ViewRelay;
  @Prop() token?: ViewToken;

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
