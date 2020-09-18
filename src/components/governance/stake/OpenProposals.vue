<template>
  <data-table
    :items="openProposals"
    :fields="fields"
    default-sort="to"
  >
    <tr
      v-for="proposal in openProposals"
      :key="proposal.id"
      class="font-w500 font-size-14 aling-rows-cells"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <td>{{proposal.id}}</td>
      <td>
        <div
          class="font-size-14 font-w500"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          Proposed by
          <a target="_blank" class="font-size-14 font-w500 fix-a">
            {{shortAddress(proposal.creator)}}
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

        <div class="pt-2">
          <remaining-time type="warn" :from="proposal.from" :to="proposal.to" />
        </div>
      </td>
      <td>
        <button-progress title="For" :percentage="proposal.voteFor * 100" type="info" />
        <div class="pt-1" />
        <button-progress title="Against" :percentage="(1 - proposal.voteFor) * 100" type="error" :selected="true" />
      </td>
      <td>
        <div class="font-size-14 font-w500">{{formatDate(proposal.from)}}</div>
        <div class="font-size-12 font-w500 text-muted-light">{{formatTime(proposal.from)}}</div>
      </td>
      <td>
        <div class="font-size-14 font-w500">{{formatDate(proposal.to)}}</div>
        <div class="font-size-12 font-w500 text-muted-light">{{formatTime(proposal.to)}}</div>
      </td>
      <td>
        <a target="_blank" class="font-size-14 font-w500 fix-a">
          <font-awesome-icon icon="external-link-alt" />
          &nbsp;Disscussion Forum
        </a>
        <div class="pt-2" />
        <a target="_blank" class="font-size-14 font-w500 fix-a">
          <font-awesome-icon icon="github" />
          &nbsp;GitHub
        </a>
      </td>
    </tr>
  </data-table>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import DataTable from "@/components/common/DataTable.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import ButtonProgress from "@/components/common/ButtonProgress.vue";

import { ViewTableFields } from "@/components/common/TableHeader.vue";

@Component({
  components: {
    ContentBlock,
    ProgressBar,
    RemainingTime,
    DataTable,
    ButtonProgress,
  }
})
export default class Stake extends Vue {

  get openProposals() {
    return [
      {id: 1, creator: '0x' + '1'.repeat(8), executor: '0x' + '1'.repeat(8), voteFor: 0.34, from: 1600348747298, to: 1600248747298},
      {id: 2, creator: '0x' + '3'.repeat(8), executor: '0x' + '2'.repeat(8), voteFor: 0.87, from: 1600348747298, to: 1600268747298},
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
        key: "creator",
        minWidth: "186px",
        maxWidth: "220px"
      },
      {
        label: "Options",
        key: "voteFor",
        minWidth: "160px",
        maxWidth: "160px"
      },
      {
        label: "Vote start",
        key: "from",
        maxWidth: "120px",
        minWidth: "120px"
      },
      {
        label: "Vote End",
        key: "to",
        maxWidth: "120px",
        minWidth: "120px"
      },
      {
        label: "Vote",
      }
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
    return `${address.substr(0, 4)}...${address.substr(-6, 6)}`
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
