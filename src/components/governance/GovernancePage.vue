<template>
  <b-row>
    <b-col cols="4">
      <stake />
    </b-col>
    <b-col cols="8">
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
    Proposals,
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
