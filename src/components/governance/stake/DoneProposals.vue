<template>
  <data-table
    :items="proposals"
    :fields="fields"
    default-sort="to"
  >
    <tr
      v-for="proposal in proposals"
      :key="proposal.id"
      class="font-w500 font-size-14 aling-rows-cells"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <td>{{proposal.id}}</td>
      <td>0</td>
      <td>
        <div
          class="font-size-14 font-w500"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          Proposed by
          <a target="_blank" class="font-size-14 font-w500 fix-a">
            {{shortAddress(proposal.proposer)}}
          </a>
        </div>

        <div
          class="font-size-14 font-w500"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          Executed by
          <a target="_blank" class="font-size-14 font-w500 fix-a">
            {{shortAddress(proposal.executor)}}
          </a>
        </div>
      </td>
      <td>
        <div class="font-size-14 font-w500">{{proposal.votesFor}}</div>
        <div class="font-size-12 font-w500 text-muted-light">{{getVotesPercentage(proposal, proposal.votesFor)}}</div>
      </td>
      <td>
        <div class="font-size-14 font-w500">{{proposal.votesAgainst}}</div>
        <div class="font-size-12 font-w500 text-muted-light">{{getVotesPercentage(proposal, proposal.votesAgainst)}}</div>
      </td>
      <td>
        <div class="font-size-14 font-w500">{{formatDate(proposal.startDate)}}</div>
        <div class="font-size-12 font-w500 text-muted-light">{{formatTime(proposal.startDate)}}</div>
      </td>
      <td>
        <div class="font-size-14 font-w500">{{formatDate(proposal.endDate)}}</div>
        <div class="font-size-12 font-w500 text-muted-light">{{formatTime(proposal.endDate)}}</div>
      </td>
    </tr>
  </data-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import DataTable from "@/components/deprecated/DataTable.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import ButtonProgress from "@/components/common/ButtonProgress.vue";
import { ViewTableFields } from "@/components/common/TableHeader.vue";
import { shortenEthAddress } from "@/api/helpers";

@Component({
  components: {
    ContentBlock,
    ProgressBar,
    RemainingTime,
    DataTable,
    ButtonProgress,
  }
})
export default class OpenProposals extends Vue {
  get proposals(): Partial<Proposal>[] {
    return [
      {id: 1, proposer: '0x' + '1'.repeat(40), executor: '0x' + '1'.repeat(40), totalAgainstVotes: '3777', totalForVotes: '1900', startDate: 1600348747298, endDate: 1600248747298},
      {id: 2, proposer: '0x' + '3'.repeat(40), executor: '0x' + '2'.repeat(40), totalAgainstVotes: '1299', totalForVotes: '1900', startDate: 1600348747298, endDate: 1600268747298},
    ]
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
        label: "",
        minWidth: "16px",
        maxWidth: "16px"
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
        maxWidth: "120px",
        minWidth: "120px"
      },
      {
        label: "Votes against",
        key: "votesAgainst",
        maxWidth: "120px",
        minWidth: "120px"
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
      },
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  formatDate(date: number) {
    return new Intl.DateTimeFormat('en-GB').format(date)
  }

  formatTime(date: number) {
    return new Intl.DateTimeFormat('en-GB', {timeStyle: "short"} as any).format(date)
  }

  shortAddress(address: string) {
    return shortenEthAddress(address)
  }

  getVotesPercentage(proposal: Proposal, votes: number): any {
    return (votes / (+proposal.totalForVotes + +proposal.totalAgainstVotes) * 100).toFixed(2) + '%'
  }
}
</script>

<style lang="scss">
.fix-a {
  vertical-align: middle;
  cursor: pointer;
}
.aling-rows-cells {
  @at-root .table & > td {
    vertical-align: top !important;
  }
}
</style>
