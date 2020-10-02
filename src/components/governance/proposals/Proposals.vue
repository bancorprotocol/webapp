<template>
  <content-block :px0="true" :shadow-light="true" :no-header="true">
    <div>
      <div class="new-proposal-button cursor" @click="showNewProposal = true">
        + New Proposal
      </div>
      <add-proposal v-model="showNewProposal" />

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

import OpenProposals from "@/components/governance/proposals/OpenProposals.vue";
import DoneProposals from "@/components/governance/proposals/DoneProposals.vue";
import AddProposal from "@/components/governance/proposals/AddProposal.vue";

@Component({
  components: {
    ContentBlock,
    ProgressBar,
    RemainingTime,
    OpenProposals,
    DoneProposals,
    AddProposal
  }
})
export default class Proposals extends Vue {
  proposals: Proposal[] = [];
  showNewProposal = true;

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

<style lang="scss">
@import "@/assets/_scss/custom/_variables";

.overlap-tabs > * > .nav.nav-tabs {
  margin-bottom: -1px;
  border-bottom: 1px solid $gray-border !important;
  position: relative;
}
.new-proposal-button {
  height: 24px;
  line-height: 21px;
  padding: 0 20px;
  border-radius: 8px !important;
  border: 1px solid $gray-placeholder !important;
  color: $text-color-light !important;
  font-size: 13px !important;
  position: absolute;
  top: 9px;
  right: 26px;
  z-index: 2;
}
</style>
