<template>
  <content-block :px0="true" :shadow-light="true" :no-header="true">
    <div>
      <b-tabs
        class="overlap-tabs"
        no-fade
        :class="darkMode ? 'tabs-dark' : 'tabs-light'"
      >
        <b-tab title="Open Proposals" active>
          <open-proposals
            :proposals="proposals.filter(p => p.open)"
            :update="updateProposals.bind(this)"
          />
        </b-tab>
        <b-tab title="History">
          <done-proposals :proposals="proposals.filter(p => !p.open)" />
        </b-tab>
      </b-tabs>
    </div>
  </content-block>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import { Proposal } from "@/store/modules/governance/ethGovernance";

import OpenProposals from "@/components/governance/stake/OpenProposals.vue";
import DoneProposals from "@/components/governance/stake/DoneProposals.vue";

@Component({
  components: {
    ContentBlock,
    ProgressBar,
    RemainingTime,
    OpenProposals,
    DoneProposals
  }
})
export default class Proposals extends Vue {
  proposals: Proposal[] = [];

  get isEth() {
    return this.$route.params.service === "eth";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  @Watch("isAuthenticated")
  async updateProposals() {
    this.proposals = await vxm.ethGovernance.getProposals({
      voter: this.isAuthenticated
    });
  }

  async mounted() {
    await this.updateProposals();
  }
}
</script>

<style lang="scss"></style>
