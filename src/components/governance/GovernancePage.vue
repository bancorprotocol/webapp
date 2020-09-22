<template>
  <b-row>
    <b-col cols="3">
      <stake />
    </b-col>
    <b-col class="pl-1" cols="9">
      <proposals />
    </b-col>
  </b-row>
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

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
