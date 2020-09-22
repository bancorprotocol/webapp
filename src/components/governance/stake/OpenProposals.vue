<template>
  <data-table
    v-if="proposals.length > 0"
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
      <td>{{ proposal.id }}</td>
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

        <div class="pt-2">
          <remaining-time
            type="warn"
            :from="proposal.startDate"
            :to="proposal.endDate"
          />
        </div>
      </td>
      <td>
        <button-progress
          :click="voteFor.bind(this, proposal.id.toString())"
          title="For"
          :percentage="
            (100 / proposal.totalVotesAvailable) * proposal.totalVotesFor
          "
          type="info"
        />
        <div class="pt-1" />
        <button-progress
          :click="voteAgainst.bind(this, proposal.id.toString())"
          title="Against"
          :percentage="
            (100 / proposal.totalVotesAvailable) * proposal.totalVotesAgainst
          "
          type="error"
          :selected="true"
        />
      </td>
      <td>
        <div class="font-size-14 font-w500">
          {{ formatDate(proposal.startDate) }}
        </div>
        <div class="font-size-12 font-w500 text-muted-light">
          {{ formatTime(proposal.startDate) }}
        </div>
      </td>
      <td>
        <div class="font-size-14 font-w500">
          {{ formatDate(proposal.endDate) }}
        </div>
        <div class="font-size-12 font-w500 text-muted-light">
          {{ formatTime(proposal.endDate) }}
        </div>
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
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import DataTable from "@/components/deprecated/DataTable.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import ButtonProgress from "@/components/common/ButtonProgress.vue";
import { ViewTableFields } from "@/components/common/TableHeader.vue";
import { shortenEthAddress } from "@/api/helpers";
import { Proposal } from "@/store/modules/governance/ethGovernance";

@Component({
  components: {
    ContentBlock,
    ProgressBar,
    RemainingTime,
    DataTable,
    ButtonProgress
  }
})
export default class OpenProposals extends Vue {
  @Prop() proposals?: Proposal[];
  @Prop() update?: any;

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
      {
        label: "Vote"
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
      timeStyle: "short"
    } as any).format(date);
  }

  shortAddress(address: string) {
    return shortenEthAddress(address);
  }

  async voteFor(proposalId: string) {
    await vxm.ethGovernance.voteFor({
      account: vxm.ethWallet.isAuthenticated,
      proposalId
    });

    await this.update();
  }

  async voteAgainst(proposalId: string) {
    await vxm.ethGovernance.voteAgainst({
      account: vxm.ethWallet.isAuthenticated,
      proposalId
    });

    await this.update();
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
