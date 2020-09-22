<template>
  <data-table :items="proposals" :fields="fields" default-sort="to">
    <tr
      v-for="proposal in proposals"
      :key="proposal.id"
      class="font-w500 font-size-14 aling-rows-cells"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <td>{{ proposal.id }}</td>
      <td>
        <div class="pie-wrapper">
          <pie-chart
            class="fix-pie"
            width="24"
            height="24"
            :ratio="proposal.totalVotesFor / proposal.totalVotes"
            :stroke-width="12"
            :opacity="1"
            color="#3ec8c8"
          />
        </div>
      </td>
      <td>
        <div
          class="font-size-14 font-w500"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          Proposed by
          <a target="_blank" class="font-size-14 font-w500 fix-a">
            {{ shortAddress(proposal.proposer) }}
          </a>
        </div>

        <div
          class="font-size-14 font-w500"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          Executed by
          <a target="_blank" class="font-size-14 font-w500 fix-a">
            {{ shortAddress(proposal.executor) }}
          </a>
        </div>
      </td>
      <td>
        <div class="font-size-14 font-w500">{{ proposal.totalVotesFor }}</div>
        <div class="font-size-12 font-w500 text-muted-light">
          {{ getVotesPercentage(proposal, proposal.totalVotesFor) }}
        </div>
      </td>
      <td>
        <div class="font-size-14 font-w500">
          {{ proposal.totalVotesAgainst }}
        </div>
        <div class="font-size-12 font-w500 text-muted-light">
          {{ getVotesPercentage(proposal, proposal.totalVotesAgainst) }}
        </div>
      </td>
      <td>
        <div class="font-size-14 font-w500">
          {{ formatDate(proposal.startDate) }}
        </div>
        <div class="font-size-12 font-w500 text-muted-light">
          {{ formatTime(proposal.startDate) }} UTC
        </div>
      </td>
      <td>
        <div class="font-size-14 font-w500">
          {{ formatDate(proposal.endDate) }}
        </div>
        <div class="font-size-12 font-w500 text-muted-light">
          {{ formatTime(proposal.endDate) }} UTC
        </div>
      </td>
    </tr>
  </data-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// @ts-ignore
import PieChart from "vue-pie-chart";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import DataTable from "@/components/deprecated/DataTable.vue";
import { ViewTableFields } from "@/components/common/TableHeader.vue";
import { shortenEthAddress } from "@/api/helpers";
import { Proposal } from "@/store/modules/governance/ethGovernance";

@Component({
  components: {
    ContentBlock,
    DataTable,
    PieChart
  }
})
export default class DoneProposals extends Vue {
  @Prop() proposals?: Proposal[] = [
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
      startDate: 1600348747298,
      endDate: 1600248747298,
      open: false,
      hash: "sdadsa",
      quorum: "10000",
      quorumRequired: "100000",
      votes: {
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
      startDate: 1600348747298,
      endDate: 1600268747298,
      open: false,
      hash: "sdadsa",
      quorum: "10000",
      quorumRequired: "100000",
      votes: {
        for: 10,
        against: 0
      }
    }
  ];

  get fields(): ViewTableFields[] {
    return [
      {
        label: "",
        key: "id",
        minWidth: "16px",
        maxWidth: "16px"
      },
      {
        label: "",
        minWidth: "24px",
        maxWidth: "24px"
      },
      {
        label: "",
        key: "creator",
        minWidth: "186px",
        maxWidth: "220px"
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
      },
      {
        label: "Vote End",
        key: "endDate",
        maxWidth: "120px",
        minWidth: "120px"
      }
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
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
    return ((100 / proposal.totalVotes) * votes).toFixed(2) + "%";
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
.aling-rows-cells {
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
</style>
