<template>
  <content-block :shadow="true" :title="title" :back-button="true" @back="back">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </content-block>
</template>

<script lang="ts">
import { i18n } from "@/i18n";
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
      case "AddProtectionSingle":
        return i18n.t("add_single_sided_liquidity");
      case "WithdrawProtectionSingle":
        return i18n.t("withdraw");
      case "RewardsRestake":
        return i18n.t("stake__bnt_protection");
      case "RewardsWithdraw":
        return i18n.t("withdraw_rewards");
      default:
        return i18n.t("stake");
    }
  }

  back() {
    this.$router.back();
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
