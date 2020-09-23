<template>
  <b-row
    v-if="loaded"
  >
    <b-col cols="3">
      <stake />
    </b-col>
    <b-col class="pl-1" cols="9">
      <proposals />
    </b-col>
  </b-row>
  <span
      v-else
  >
    Loading ...
  </span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import Stake from "@/components/governance/stake/Stake.vue";
import Proposals from "@/components/governance/stake/Proposals.vue";

@Component({
  components: {
    Stake,
    Proposals
  }
})
export default class GovernancePage extends Vue {
  get isEth() {
    return this.$route.params.service === "eth";
  }

  get loaded(){
    return vxm.ethGovernance.isLoaded
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  async mounted() {
    try{
      await vxm.ethGovernance.init();
    } catch {
      console.error('unable to load governance')
    }
  }
}
</script>

<style lang="scss"></style>
