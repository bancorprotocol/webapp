<template>
  <content-block title="Proposals" :shadow-light="true">
    <div class="pt-2">
      <div class="float-right mr-2">
        + add
      </div>
      <b-tabs no-fade :class="darkMode ? 'tabs-dark' : 'tabs-light'">
        <b-tab title="Playground" active>
          <!--  -->

          <remaining-time type="warn" from="1600348747298" to="1600358747298" />
          <progress-bar type="warn" percentage="20" />

          <!--  -->
        </b-tab>
        <b-tab title="Open">
          Open
        </b-tab>
        <b-tab title="Done">
          Done
        </b-tab>
      </b-tabs>
    </div>
  </content-block>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";

import ProgressBar from "@/components/common/ProgressBar.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import { Proposal } from "@/store/modules/governance/ethGovernance"

@Component({
  components: {
    ContentBlock,
    ProgressBar,
    RemainingTime,
  }
})
export default class Stake extends Vue {
  proposals: Proposal[] = []

  get isEth() {
    return this.$route.params.service === "eth";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  async created() {
    await vxm.ethGovernance.getProposals()
  }
}
</script>

<style lang="scss"></style>
