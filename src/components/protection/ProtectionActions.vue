<template>
  <content-block
    :shadow="true"
    :title="title"
    :back-button="true"
    @back="back"
    :version="version"
  >
    <div v-if="!withdrawProtection">
      <add-protection-v1 v-if="!pool.whitelisted" :pool="pool" />
      <add-protection-v2 v-else :pool="pool" />
    </div>

    <div v-else>
      <withdraw-protection :pool="pool" />
    </div>
  </content-block>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import ContentBlock from "@/components/common/ContentBlock.vue";
import { ViewRelay } from "@/types/bancor";
import AddProtectionV1 from "@/components/protection/AddProtectionV1.vue";
import AddProtectionV2 from "@/components/protection/AddProtectionV2.vue";
import WithdrawProtection from "@/components/protection/WithdrawProtection.vue";

@Component({
  components: {
    WithdrawProtection,
    AddProtectionV1,
    AddProtectionV2,
    ContentBlock
  }
})
export default class ProtectionActions extends Vue {
  withdrawProtection = false;

  get title() {
    return this.withdrawProtection ? "Withdraw" : "Add Liquidity Protection";
  }

  get protectionAction() {
    return this.$route.params.action;
  }

  get pool(): ViewRelay {
    const [poolId] = this.$route.params.id.split(":");
    return vxm.bancor.relay(poolId);
  }

  get version() {
    return this.pool.v2 ? 2 : 1;
  }

  back() {
    this.$router.push({ name: "LiqProtection" });
  }

  created() {
    if (this.protectionAction === "add") this.withdrawProtection = false;
    else if (this.protectionAction === "withdraw")
      this.withdrawProtection = true;
    else this.$router.push({ name: "404" });
  }
}
</script>

<style scoped lang="scss"></style>
