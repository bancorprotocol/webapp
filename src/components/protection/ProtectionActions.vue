<template>
  <content-block :shadow="true" :title="title">
    <div v-if="!withdrawProtection">
      <add-protection-v1 v-if="!pool.v2" :pool="pool" />
      <add-protection-v2 v-else :pool="pool" />
    </div>

    <div v-else>
      <withdraw-protection-v1 v-if="!pool.v2" :pool="pool" />
      <withdraw-protection-v2 v-else :pool="pool" />
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
import WithdrawProtectionV1 from "@/components/protection/WithdrawProtectionV1.vue";
import WithdrawProtectionV2 from "@/components/protection/WithdrawProtectionV2.vue";

@Component({
  components: {
    WithdrawProtectionV2,
    WithdrawProtectionV1,
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
    return vxm.bancor.relay(this.$route.params.id);
  }

  back() {
    this.$router.push({ name: "AddProtectionHome" });
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
