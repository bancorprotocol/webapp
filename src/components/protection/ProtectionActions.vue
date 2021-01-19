<template>
  <content-block :shadow="true" :title="title" :back-button="true" @back="back">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
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
      case "RewardsRestake":
        return "ReStake BNT for Protection";
      case "RewardsWithdraw":
        return "Withdraw Rewards";
      default:
        return "Stake";
    }
  }

  back() {
    this.$router.go(-1);
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active {
  transition: opacity 0.3s;
}
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
