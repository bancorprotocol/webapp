<template>
  <content-block :px0="true" :shadow-light="true" :no-header="true">
    <div>
      <div class="block-header pr-2">
        <h3
          class="m-0 p-0 my-1 font-size-14 font-w600"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          Proposals
        </h3>
        <div class="float-right mr-2">
          + add
        </div>
      </div>
      <b-tabs
        class="overlap-tabs"
        no-fade
        :class="darkMode ? 'tabs-dark' : 'tabs-light'"
      >
        <b-tab title="Open" active>
          <open-proposals
            :proposals="proposals.filter(p => p.open)"
            :update="updateProposals.bind(this)"
          />
        </b-tab>
        <b-tab title="Done">
          <done-proposals :proposals="proposals.filter(p => !p.open)" />
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

  async updateProposals() {
    this.proposals = await vxm.ethGovernance.getProposals();
  }

  async created() {
    await this.updateProposals();
  }
}
</script>

<style lang="scss">
.overlap-tabs {
  & > div > .nav.nav-tabs {
    height: 0;
    position: relative;
    top: 3px;

    & > li > .nav-link {
      padding-bottom: 10px;
      font-weight: 500;
    }
  }
}
</style>
