<template>
  <content-block :shadow="true" :title="title" :back-button="true" @back="back">
    <router-view />
  </content-block>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ContentBlock from "@/components/common/ContentBlock.vue";

@Component({
  components: {
    ContentBlock
  }
})
export default class ProtectionActions extends Vue {
  withdrawProtection = false;

  get title() {
    const name = this.$route.name;
    switch (name) {
      case "AddProtectionDouble":
        return "Add Liquidity Protection";
      case "AddProtectionSingle":
        return "Add Liquidity Protection";
      case "WithdrawProtectionSingle":
        return "Withdraw";
      case "WithdrawProtectionDouble":
        return "Withdraw";
      default:
        return "Stake";
    }
  }

  back() {
    this.$router.go(-1);
  }
}
</script>

<style scoped lang="scss"></style>
