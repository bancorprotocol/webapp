<template>
  <content-block :px0="true" :shadow-light="true" :no-header="true">
    <div>
      <b-tabs
        class="overlap-tabs add-proposal-button"
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
        <b-tab title="+ New Proposal">
          <add-proposal />
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

.add-proposal-button > * > .nav.nav-tabs {
  align-items: center;
  height: 44px;

  & > .nav-item:nth-child(3) > a {
    margin-left: auto;
    height: 24px;
    line-height: 21px;
    padding: 0 20px;
    border-radius: 8px !important;
    border: 1px solid $gray-placeholder !important;
    color: $text-color-light !important;
    margin-right: 16px !important;
    font-size: 13px !important;
  }
}
</style>
