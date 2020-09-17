<template>
  <content-block title="Stake" :shadow-light="true">
    <p>hello world</p>
    {{ balance }}
    {{ votes }}
  </content-block>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";

@Component({
  components: {
    ContentBlock
  }
})
export default class Stake extends Vue {
  votes: string = ""
  balance: string = ""

  get isEth() {
    return this.$route.params.service === "eth";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  async created() {
    this.balance = await vxm.ethGovernance.getBalance({
      account: vxm.ethWallet.isAuthenticated
    });

    this.votes = await vxm.ethGovernance.getVotes({
      voter: vxm.ethWallet.isAuthenticated
    });
  }
}
</script>

<style lang="scss"></style>
