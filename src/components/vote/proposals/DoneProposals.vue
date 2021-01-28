<template>
  <div v-if="!proposals">
    <div class="d-flex justify-content-center align-items-center my-5">
      <b-spinner
        style="display: block; width: 2rem; height: 2rem"
        class="align-self-center align-middle"
        :class="darkMode ? 'text-primary' : 'text-primary'"
        label="Loading..."
      ></b-spinner>
      <h5
        class="m-0 ml-3"
        :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
      >
        Just a moment ...
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
      No Proposals yet ...
    </h5>
  </div>
  <layout-proposals
    v-else-if="proposals"
    :items="proposals"
    :fields="fields"
    default-sort="to"
    :hide-pagination="true"
  >
    <!-- <template
      v-for="proposal in proposals"
      class="font-w500 font-size-14 aling-rows-cells"
      :class="darkMode ? 'text-dark' : 'text-light'"
    > -->
      <!-- <tr
        :key="'r1-' + proposal.id"
        class="align-rows-cells cursor"
        @click="() => openProposal(proposal)"
      > -->

      <template #cell(id)="{ item }">
        <div :class="{ 'no-border': !isNaN(opened) && item.id === opened }">
          {{ item.id }}
        </div>
      </template>

      <template #cell(details)="{ item }">
        <div class="font-size-14 font-w500">
          {{ item.name }}
        </div>
      </template>

      <template #cell(result)="{ item }">
        <div
          class="result"
          :class="'result--' + (isApproved(item) ? 'for' : 'against')"
        >
          {{ isApproved(item) ? "Approved" : "Rejected" }}
        </div>
      </template>

      <template #cell(votesFor)="{ item }">
        <div>
          <div class="font-size-14 font-w500">
            {{ prettifyNumber(item.totalVotesFor) }} {{ symbol }}
          </div>
          <div class="font-size-12 font-w500 result result--for">
            {{ getVotesPercentage(item, item.totalVotesFor) }}
          </div>
        </div>
      </template>

      <template #cell(votesAgainst)="{ item }">
        <div>
          <div class="font-size-14 font-w500">
            {{ prettifyNumber(item.totalVotesAgainst) }} {{ symbol }}
          </div>
          <div class="font-size-12 font-w500 result result--against">
            {{ getVotesPercentage(item, item.totalVotesAgainst) }}
          </div>
        </div>
      </template>
      
      <template #cell(startDate)="{ item }">
        <div>
          <div class="font-size-14 font-w500">
            {{ formatDate(item.end) }}
          </div>
          <div class="font-size-12 font-w500 text-muted-light">
            {{ formatTime(item.end) }} UTC
          </div>
        </div>
      </template>

      <template #cell(spacer)="{ item }">
        <div>
          <font-awesome-icon
            :icon="
              !isNaN(opened) && item.id === opened
                ? 'caret-up'
                : 'caret-down'
            "
          />
        </div>
      </template>

      <!-- </tr> -->
      <!-- <tr
        :key="'r2-' + proposal.id"
        class="align-rows-cells"
        v-if="!isNaN(opened) && proposal.id === opened"
      >
        <td></td>
        <td>
          <div
            class="font-size-12 pb-1"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            Proposed by
            <a
              target="_blank"
              class="font-size-12 font-w500 fix-a"
              :href="getEtherscanUrl(proposal.proposer)"
            >
              {{ shortAddress(proposal.proposer) }}
            </a>
          </div>

          <div
            class="font-size-12"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            Contract to execute
            <a
              target="_blank"
              class="font-size-12 font-w500 fix-a"
              :href="getEtherscanUrl(proposal.executor)"
            >
              {{ shortAddress(proposal.executor) }}
            </a>
          </div>
        </td>
        <td colspan="2">
          <div class="pb-1">
            <span class="font-size-12 text-muted-light"> Vote Start </span>
            <span class="font-size-12 font-w500 pl-1 pr-1">
              {{ formatDate(proposal.start) }}
            </span>
            <span class="font-size-12 font-w500 text-muted-light">
              {{ formatTime(proposal.start) }}
            </span>
          </div>
          <div>
            <span class="font-size-12 text-muted-light"> Quorum/Required </span>
            <span class="font-size-12 font-w500 pl-1 pr-1">
              {{ proposal.quorum / 10000 }}% /
              {{ proposal.quorumRequired / 10000 }}%
            </span>
          </div>
        </td>
        <td colspan="3">
          <div class="buttons-container">
            <a
              :href="getBIPLink(proposal)"
              target="_blank"
              style="width: 100%; display: inline-block"
            >
              <main-button
                :small="true"
                :active="true"
                class="font-w400 mt-0 mb-0"
              >
                BIP
                <font-awesome-icon icon="external-link-alt" />
              </main-button>
            </a>

            <a
              :href="getIPFSUrl(proposal.hash)"
              target="_blank"
              style="width: 100%; display: inline-block"
            >
              <main-button :small="true" class="font-w400 mt-0 mb-0 ml-3">
                IPFS
                <font-awesome-icon icon="external-link-alt" />
              </main-button>
            </a>
          </div>
        </td>
      </tr> -->
    <!-- </template> -->
  </layout-proposals>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import LayoutProposals from "@/components/vote/proposals/LayoutProposals.vue";
import MainButton from "@/components/common/Button.vue";

import { ViewTableFields } from "@/components/common/TableHeader.vue";
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

  opened: number = -1;

  get fields(): ViewTableFields[] {
    return [
      {
        label: "ID",
        key: "id",
        minWidth: "16px",
        maxWidth: "16px"
      },
      {
        label: "Details",
        key: "details"
      },
      {
        label: "Result",
        key: "result",
        maxWidth: "120px",
        minWidth: "120px"
      },
      {
        label: "Votes for",
        key: "votesFor",
        maxWidth: "140px",
        minWidth: "140px"
      },
      {
        label: "Votes against",
        key: "votesAgainst",
        maxWidth: "140px",
        minWidth: "140px"
      },
      {
        label: "Vote start",
        key: "startDate",
        maxWidth: "120px",
        minWidth: "120px"
      },
      {
        label: "",
        key: "spacer",
        maxWidth: "10px"
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

  openProposal(proposal: Proposal) {
    this.opened = proposal.id === this.opened ? -1 : proposal.id;
    this.$forceUpdate();
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
