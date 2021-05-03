<template>
  <content-block
    id="proposals"
    :px0="true"
    :shadow-light="true"
    :no-header="true"
  >
    <div>
      <div class="float-right d-flex mt-3 mr-3">
        <a
          href="https://discord.gg/EHK8wHbgau"
          target="_blank"
          class="mr-2"
          :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
        >
          <b-btn :variant="ctaBtnVariant" class="proposal-cta-button">
            <font-awesome-icon
              :icon="['fab', 'discord']"
              class="text-muted-light"
            />
            <span class="d-none d-lg-block ml-2">Discord</span>
          </b-btn>
        </a>
        <a
          href="https://gov.bancor.network/"
          target="_blank"
          class="mr-2"
          :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
        >
          <b-btn :variant="ctaBtnVariant" class="proposal-cta-button">
            <img :src="require(`@/assets/media/icons/governance.svg`)" />
            <span class="d-none d-lg-block ml-2">{{ $t("governance") }}</span>
          </b-btn>
        </a>
        <b-btn
          @click="showNewProposal = true"
          variant="primary"
          class="proposal-cta-button"
        >
          + <span class="d-none d-lg-block ml-2">{{ $t("new_proposal") }}</span>
        </b-btn>
      </div>

      <add-proposal v-model="showNewProposal" />

      <b-tabs no-fade :class="darkMode ? 'tabs-dark' : 'tabs-light'">
        <b-tab :title="$t('open_proposals')" active>
          <open-proposals
            :proposals="
              proposalsLoaded ? proposals.filter(p => p.open) : undefined
            "
          />
        </b-tab>
        <b-tab :title="$t('history')">
          <done-proposals
            :proposals="
              proposalsLoaded ? proposals.filter(p => !p.open) : undefined
            "
          />
        </b-tab>
      </b-tabs>
    </div>
  </content-block>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import { Proposal } from "@/store/modules/governance/ethGovernance";

import OpenProposals from "@/components/vote/proposals/OpenProposals.vue";
import DoneProposals from "@/components/vote/proposals/DoneProposals.vue";
import AddProposal from "@/components/vote/proposals/AddProposal.vue";
import BaseComponent from "@/components/BaseComponent.vue";

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
export default class Proposals extends BaseComponent {
  proposals: Proposal[] = [];
  proposalsLoaded: boolean = false;
  showNewProposal = false;

  get isEth() {
    return this.$route.params.service === "eth";
  }

  get ctaBtnVariant() {
    return this.darkMode ? "outline-gray-dark" : "outline-gray";
  }

  get lastTransaction() {
    return vxm.ethGovernance.lastTransaction;
  }

  @Watch("currentUser")
  @Watch("showNewProposal")
  @Watch("lastTransaction")
  async updateProposals() {
    this.proposals = await vxm.ethGovernance.getProposals({
      voter: this.currentUser
    });
    this.proposalsLoaded = true;
  }

  async mounted() {
    await this.updateProposals();
  }
}
</script>

<style lang="scss">
@import "@/assets/_scss/custom/_variables";

#proposals .nav-tabs li {
  line-height: 28px;
  padding-bottom: 0 !important;
  padding-top: 6px !important;
}

.proposal-cta-button {
  min-height: 23px;
  display: flex !important;
  align-items: center !important;
  padding: 1px 13px !important;
  font-size: 13px !important;
}
</style>
