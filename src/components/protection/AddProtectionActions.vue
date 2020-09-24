<template>
  <content-block :shadow="true" title="Add Liquidity Protection">
    <add-protection-v1 v-if="!pool.v2" :pool="pool" />
    <add-protection-v2 v-else :pool="pool" />
  </content-block>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store/";
import ContentBlock from "@/components/common/ContentBlock.vue";
import { ViewRelay } from "@/types/bancor";
import AddProtectionV1 from "@/components/protection/AddProtectionV1.vue";
import AddProtectionV2 from "@/components/protection/AddProtectionV2.vue";

@Component({
  components: {
    AddProtectionV1,
    AddProtectionV2,
    ContentBlock
  }
})
export default class AddProtectionActions extends Vue {
  get pool(): ViewRelay {
    return vxm.bancor.relay(this.$route.params.id);
  }

  back() {
    this.$router.push({ name: "AddProtectionHome" });
  }

  created() {}
}
</script>

<style scoped lang="scss"></style>
