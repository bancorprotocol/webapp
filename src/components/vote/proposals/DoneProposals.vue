<template>
  <div v-if="!proposals">
    <div class="d-flex justify-content-center align-items-center my-5">
      <b-spinner
        style="display: block; width: 2rem; height: 2rem"
        class="align-self-center align-middle"
        :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
        :label="`${$t('loading')}... `"
      ></b-spinner>
      <h5
        class="m-0 ml-3"
        :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
      >
        {{ `${$t("just_a_moment")}...` }}
      </h5>
    </div>
  </div>
  <div
    v-else-if="proposals && proposals.length === 0"
    class="d-flex justify-content-center align-items-center my-5"
  >
    <h5
      class="m-0 ml-3"
      :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
    >
      {{ `${$t("no_proposals_yet")}...` }}
    </h5>
  </div>
  <layout-proposals
    v-else-if="proposals"
    :items="proposals"
    :fields="fields"
    :fields2="fields2"
    default-sort="to"
    :hide-pagination="true"
  >
    <template #cell(id)="{ item, opened, label }">
      <div class="d-block d-md-block d-lg-none font-w800 font-size-14">
        {{ label }}
      </div>
      <div :class="{ 'no-border': !isNaN(opened) && item.id === opened }">
        {{ item.id }}
      </div>
    </template>

    <template #cell(details)="{ item, label }">
      <div class="d-block d-md-block d-lg-none font-w800 font-size-14">
        {{ label }}
      </div>
      <div class="font-size-14 font-w500">
        {{ item.name }}
      </div>
    </template>

    <template #cell(result)="{ item, label }">
      <div class="d-block d-md-block d-lg-none font-w800 font-size-14">
        {{ label }}
      </div>
      <div
        class="result"
        :class="'result--' + (isApproved(item) ? 'for' : 'against')"
      >
        {{ isApproved(item) ? $t("approved") : $t("rejected") }}
      </div>
    </template>

    <template #cell(votesFor)="{ item, label }">
      <div class="d-block d-md-block d-lg-none font-w800 font-size-14">
        {{ label }}
      </div>
      <div>
        <div class="font-size-14 font-w500">
          {{ prettifyNumber(item.totalVotesFor) }} {{ symbol }}
        </div>
        <div class="font-size-12 font-w500 result result--for">
          {{ getVotesPercentage(item, item.totalVotesFor) }}
        </div>
      </div>
    </template>

    <template #cell(votesAgainst)="{ item, label }">
      <div class="d-block d-md-block d-lg-none font-w800 font-size-14">
        {{ label }}
      </div>
      <div>
        <div class="font-size-14 font-w500">
          {{ prettifyNumber(item.totalVotesAgainst) }} {{ symbol }}
        </div>
        <div class="font-size-12 font-w500 result result--against">
          {{ getVotesPercentage(item, item.totalVotesAgainst) }}
        </div>
      </div>
    </template>

    <template #cell(startDate)="{ item, label }">
      <div class="d-block d-md-block d-lg-none font-w800 font-size-14">
        {{ label }}
      </div>
      <div>
        <div class="font-size-14 font-w500">
          {{ formatDate(item.end) }}
        </div>
        <div class="font-size-12 font-w500 text-muted-light">
          {{ formatTime(item.end) }} UTC
        </div>
      </div>
    </template>

    <template #cell(spacer)="{ item, opened, label }">
      <div class="d-block d-md-block d-lg-none font-w800 font-size-14">
        {{ label }}
      </div>
      <div class="cursor" @click="() => openProposal(item)">
        <font-awesome-icon
          :icon="
            !isNaN(opened) && item.id === opened ? 'caret-up' : 'caret-down'
          "
        />
      </div>
    </template>

    <template #cell(no)="{}">
      <div></div>
    </template>

    <template #cell(proposed)="{ item }">
      <div
        class="font-size-12 pb-1"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        {{ $t("proposed_by") }}
        <a
          target="_blank"
          class="font-size-12 font-w500 fix-a"
          :href="getEtherscanUrl(item.proposer)"
          :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
        >
          {{ shortAddress(item.proposer) }}
        </a>
      </div>

      <div
        class="font-size-12"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        {{ $t("contract_execute") }}
        <a
          target="_blank"
          class="font-size-12 font-w500 fix-a"
          :href="getEtherscanUrl(item.executor)"
          :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
        >
          {{ shortAddress(item.executor) }}
        </a>
      </div>
    </template>

    <template #cell(vote)="{ item }">
      <div class="pb-1">
        <span class="font-size-12 text-muted-light">
          {{ $t("vote_start") }}
        </span>
        <span class="font-size-12 font-w500 pl-1 pr-1">
          {{ formatDate(item.start) }}
        </span>
        <span class="font-size-12 font-w500 text-muted-light">
          {{ formatTime(item.start) }}
        </span>
      </div>
      <div>
        <span class="font-size-12 text-muted-light">
          {{ $t("quorum_Required") }}
        </span>
        <span class="font-size-12 font-w500 pl-1 pr-1">
          {{ item.quorum / 10000 }}% / {{ item.quorumRequired / 10000 }}%
        </span>
      </div>
    </template>

    <template #cell(actions)="{ item }">
      <div class="buttons-container">
        <a
          :href="getBIPLink(item)"
          target="_blank"
          style="width: 100%; display: inline-block"
          :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
        >
          <main-button :small="true" :active="true" class="font-w400 mt-0 mb-0">
            BIP
            <font-awesome-icon icon="external-link-alt" />
          </main-button>
        </a>

        <a
          :href="getIPFSUrl(item.hash)"
          target="_blank"
          style="width: 100%; display: inline-block"
          :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
        >
          <main-button :small="true" class="font-w400 mt-0 mb-0 ml-3">
            IPFS
            <font-awesome-icon icon="external-link-alt" />
          </main-button>
        </a>
      </div>
    </template>
  </layout-proposals>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import ContentBlock from "@/components/common/ContentBlock.vue";
import LayoutProposals from "@/components/vote/proposals/LayoutProposals.vue";
import MainButton from "@/components/common/Button.vue";
import { ViewProposalsField } from "@/types/bancor";
import { shortenEthAddress } from "@/api/helpers";
import {
  ipfsViewUrl,
  Proposal
} from "@/store/modules/governance/ethGovernance";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    ContentBlock,
    LayoutProposals,
    MainButton
  }
})
export default class DoneProposals extends BaseComponent {
  @Prop() proposals?: Proposal[];
  symbol: string = "";
  etherscanUrl: string = "";

  get fields(): ViewProposalsField[] {
    return [
      {
        id: 1,
        label: i18n.tc("id"),
        key: "id",
        minWidth: "16px",
        maxWidth: "16px",
        colRate: 1
      },
      {
        id: 2,
        label: i18n.tc("details"),
        key: "details",
        colRate: 5
      },
      {
        id: 3,
        label: i18n.tc("result"),
        key: "result",
        maxWidth: "120px",
        minWidth: "100px",
        colRate: 1
      },
      {
        id: 4,
        label: i18n.tc("votes_for"),
        key: "votesFor",
        minWidth: "120px",
        colRate: 1
      },
      {
        id: 5,
        label: i18n.tc("votes_against"),
        key: "votesAgainst",
        minWidth: "120px",
        colRate: 1
      },
      {
        id: 6,
        label: i18n.tc("votes_start"),
        key: "startDate",
        minWidth: "120px",
        colRate: 1
      },
      {
        id: 7,
        label: "",
        key: "spacer",
        minWidth: "10px",
        maxWidth: "10px",
        colRate: 0
      }
    ];
  }

  get fields2(): ViewProposalsField[] {
    return [
      {
        id: 8,
        label: "",
        key: "no",
        minWidth: "16px",
        maxWidth: "16px",
        colRate: 1
      },
      {
        id: 9,
        label: "",
        key: "proposed",
        colRate: 5
      },
      {
        id: 10,
        label: "",
        key: "vote",
        minWidth: "140px",
        colRate: 3
      },
      {
        id: 11,
        label: "",
        key: "actions",
        minWidth: "240px",
        colRate: 3
      }
    ];
  }

  getIPFSUrl(hash: string) {
    return `${ipfsViewUrl}/${hash}`;
  }

  getEtherscanUrl(address: string) {
    return `${this.etherscanUrl}address/${address}`;
  }

  formatDate(date: number) {
    return new Intl.DateTimeFormat("en-GB").format(date);
  }

  formatTime(date: number) {
    return new Intl.DateTimeFormat("en-GB", {
      timeStyle: "short",
      timezone: "UTC"
    } as any).format(date);
  }

  shortAddress(address: string) {
    return shortenEthAddress(address);
  }

  getVotesPercentage(proposal: Proposal, votes: number): any {
    return (
      ((100 / proposal.totalVotes) * votes || 0)
        .toFixed(2)
        .replace(/\.0+$/, "") + "%"
    );
  }

  isApproved(proposal: Proposal) {
    return proposal.totalVotesFor > proposal.totalVotesAgainst;
  }

  getBIPLink(proposal: Proposal) {
    return proposal?.metadata?.payload?.metadata?.discourse || "#";
  }

  async mounted() {
    this.etherscanUrl = await vxm.ethGovernance.getEtherscanUrl();
    this.symbol = await vxm.ethGovernance.getSymbol();
  }
}
</script>

<style lang="scss">
@import "@/assets/_scss/custom/_variables";

.fix-a {
  vertical-align: middle;
  cursor: pointer;
  color: $primary !important;
}

.align-rows-cells {
  @at-root .table & > td {
    vertical-align: top !important;
  }
}

.fix-pie {
  circle,
  text {
    display: none;
  }
}

.pie-wrapper {
  height: 24px;
  width: 24px;
  background: #de4a5c;
  border-radius: 12px;
}

.result {
  &--for {
    color: #3ec8c8 !important;
  }

  &--against {
    color: #de4a5c !important;
  }
}

.dark-table td.no-border,
.table td.no-border {
  border-bottom: 0 !important;
}

.buttons-container {
  display: flex;
  margin-right: 20px;
  align-items: center;
  justify-content: space-between;
}
</style>
