<template>
  <data-table :items="proposalsToDisplay" :fields="fields" default-sort="to">
    <template
      v-for="proposal in proposalsToDisplay"
      class="font-w500 font-size-14 aling-rows-cells"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <tr :key="'r1-' + proposal.id" class="align-rows-cells">
        <td>{{ proposal.id }}</td>
        <td class="font-size-14 font-w500">
          {{ proposal.name }}
        </td>
        <td
          class="result"
          :class="'result--' + (isApproved(proposal) ? 'for' : 'against')"
        >
          {{ isApproved(proposal) ? "Approved" : "Rejected" }}
        </td>
        <td>
          <div class="font-size-14 font-w500">{{ proposal.totalVotesFor }}</div>
          <div class="font-size-12 font-w500 result result--for">
            {{ getVotesPercentage(proposal, proposal.totalVotesFor) }}
          </div>
        </td>
        <td>
          <div class="font-size-14 font-w500">
            {{ proposal.totalVotesAgainst }}
          </div>
          <div class="font-size-12 font-w500 result result--against">
            {{ getVotesPercentage(proposal, proposal.totalVotesAgainst) }}
          </div>
        </td>
        <!--       <td>
          <div class="font-size-14 font-w500">
            {{ formatDate(proposal.startDate) }}
          </div>
          <div class="font-size-12 font-w500 text-muted-light">
            {{ formatTime(proposal.startDate) }} UTC
          </div>
        </td> -->
        <td>
          <div class="font-size-14 font-w500">
            {{ formatDate(proposal.endDate) }}
          </div>
          <div class="font-size-12 font-w500 text-muted-light">
            {{ formatTime(proposal.endDate) }} UTC
          </div>
        </td>
      </tr>
      <tr :key="'r2-' + proposal.id" class="align-rows-cells">
        <td class="no-border"></td>
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
            <span class="font-size-12 text-muted-light">
              Vote Start
            </span>
            <span class="font-size-12 font-w500 pl-1 pr-1">
              {{ formatDate(proposal.startDate) }}
            </span>
            <span class="font-size-12 font-w500 text-muted-light">
              {{ formatTime(proposal.startDate) }}
            </span>
          </div>
          <div>
            <span class="font-size-12 text-muted-light">
              Quorum/Required
            </span>
            <span class="font-size-12 font-w500 pl-1 pr-1">
              {{ proposal.quorum / 100 }}% /
              {{ proposal.quorumRequired / 100 }}%
            </span>
          </div>
        </td>
        <td colspan="2">
          <div class="buttons-container">
            <main-button
              :small="true"
              :active="true"
              class="font-w400 mt-0 mb-0"
            >
              BIP
              <font-awesome-icon icon="external-link-alt" />
            </main-button>

            <main-button :small="true" class="font-w400 mt-0 mb-0 ml-3">
              <a :href="getIPFSUrl(proposal.hash)" target="_blank">
                IPFS
                <font-awesome-icon icon="external-link-alt" />
              </a>
            </main-button>
          </div>
        </td>
      </tr>
    </template>
  </data-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PieChart from "vue-pie-chart";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import MainButton from "@/components/common/Button.vue";
import DataTable from "@/components/deprecated/DataTable.vue";
import { ViewTableFields } from "@/components/common/TableHeader.vue";
import { shortenEthAddress } from "@/api/helpers";
import {
  etherscanUrl,
  ipfsUrl,
  Proposal
} from "@/store/modules/governance/ethGovernance";

@Component({
  components: {
    ContentBlock,
    DataTable,
    PieChart,
    MainButton
  }
})
export default class DoneProposals extends Vue {
  @Prop() proposals?: Proposal[];

  mockData: Proposal[] = [
    {
      id: 1,
      proposer: "0x" + "1".repeat(40),
      executor: "0x" + "1".repeat(40),
      totalVotesAgainst: 3777,
      totalVotesFor: 1900,
      totalVotesAvailable: 10000,
      totalVotes: 1900 + 3777,
      start: 0,
      end: 0,
      name: "Test1",
      startDate: 1600348747298,
      endDate: 1600248747298,
      open: false,
      hash: "sdadsa",
      quorum: "10000",
      quorumRequired: "100000",
      votes: {
        voted: "for",
        for: 10,
        against: 0
      }
    },
    {
      id: 2,
      proposer: "0x" + "3".repeat(40),
      executor: "0x" + "2".repeat(40),
      totalVotesAgainst: 1299,
      totalVotesFor: 1900,
      totalVotesAvailable: 10000,
      totalVotes: 1900 + 1299,
      start: 0,
      end: 0,
      name: "Test2",
      startDate: 1600348747298,
      endDate: 1600268747298,
      open: false,
      hash: "sdadsa",
      quorum: "10000",
      quorumRequired: "100000",
      votes: {
        voted: "for",
        for: 10,
        against: 0
      }
    }
  ];

  get proposalsToDisplay() {
    // @ts-ignore
    return this.proposals.length > 0 ? this.proposals : this.mockData;
  }

  get fields(): ViewTableFields[] {
    return [
      {
        label: "",
        key: "id",
        minWidth: "16px",
        maxWidth: "16px"
      },
      {
        label: "Proposal ID"
      },
      {
        label: "Result",
        maxWidth: "180px",
        minWidth: "180px"
      },
      {
        label: "Votes for",
        key: "votesFor",
        maxWidth: "130px",
        minWidth: "130px"
      },
      {
        label: "Votes against",
        key: "votesAgainst",
        maxWidth: "130px",
        minWidth: "130px"
      },
      {
        label: "Vote start",
        key: "startDate",
        maxWidth: "120px",
        minWidth: "120px"
      }
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  getIPFSUrl(hash: string) {
    return `${ipfsUrl}/${hash}`;
  }

  getEtherscanUrl(address: string) {
    return `${etherscanUrl}address/${address}`;
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

.no-border {
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: -1px;
    height: 1px;
    width: 100%;
    left: 0;
    background: #ffffff;
  }
}

.buttons-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
