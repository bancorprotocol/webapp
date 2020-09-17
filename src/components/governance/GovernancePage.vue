<template>
  <b-col cols="4">
    <stake />
  </b-col>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import Stake from "@/components/governance/stake/Stake.vue";

@Component({
  components: {
    Stake
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
