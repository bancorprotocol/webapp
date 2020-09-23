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
        <div class="font-size-14 font-w500">
          Governance #comptroller:_supportMarket(address)
        </div>

        <div class="pt-2 pb-3">
          <remaining-time
            class="remaining-time"
            type="warn"
            :from="proposal.startDate"
            :to="proposal.endDate"
          />
        </div>

        <b-row>
          <b-col cols="6">
            <div class="pb-1">
              <span class="font-size-14 font-w500 text-muted-light">
                Vote Start
              </span>
              <span class="font-size-14 font-w500 pl-1 pr-1">
                {{ formatDate(proposal.startDate) }}
              </span>
              <span class="font-size-12 font-w500 text-muted-light">
                {{ formatTime(proposal.startDate) }}
              </span>
            </div>
            <div>
              <span class="font-size-14 font-w500 text-muted-light">
                Vote End
              </span>
              <span class="font-size-14 font-w500 pl-1 pr-1">
                {{ formatDate(proposal.endDate) }}
              </span>
              <span class="font-size-12 font-w500 text-muted-light">
                {{ formatTime(proposal.endDate) }}
              </span>
            </div>
          </b-col>
          <b-col cols="6">
            <div class="font-size-14 font-w500 text-muted-light pb-1">
              Proposed
              <a target="_blank" class="font-size-14 font-w500 fix-a pl-1">
                <font-awesome-icon icon="external-link-alt" />
              </a>
              <a target="_blank" class="font-size-14 font-w500 fix-a pl-1">
                <font-awesome-icon :icon="['fab', 'github']" />
              </a>
            </div>
            <div
              class="font-size-14 font-w500 pb-1"
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
          </b-col>
        </b-row>

      </td>
      <td>
        <button-progress
          :click="voteFor.bind(this, proposal.id.toString())"
          title="For"
          :percentage="
            (100 / proposal.totalVotes) * proposal.totalVotesFor
          "
          type="info"
          :selected="proposal.votes.for > 0"
        />
        <div class="pt-1" />
        <button-progress
          :click="voteAgainst.bind(this, proposal.id.toString())"
          title="Against"
          :percentage="
            (100 / proposal.totalVotes) * proposal.totalVotesAgainst
          "
          type="error"
          :selected="proposal.votes.against > 0"
        />
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
        label: '',
      },
      {
        label: "Proposal ID",
        key: "id",
        minWidth: "500px",
        maxWidth: "600px"
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
      timeStyle: "short",
      timezone: "UTC"
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
.remaining-time {
  width: 150px;
}
</style>
