<template>
  <b-modal
    :content-class="darkMode ? 'bg-block-dark' : 'bg-block-light'"
    id="vote-details"
    scrollable
    size="xl"
    centered
    v-model="show"
    @close="onHide"
    @cancel="onHide"
    @hide="onHide"
    @show="update"
  >
    <template slot="modal-header">
      <div class="w-100">
        <b-row>
          <b-col cols="12" class="d-flex justify-content-between">
            <span
              class="font-size-14 font-w600"
              :class="darkMode ? 'text-dark' : 'text-light'"
            >
              <span>{{ $t("voting_statistics") }}</span>
            </span>
            <font-awesome-icon
              class="cursor font-size-lg"
              :class="darkMode ? 'text-dark' : 'text-light'"
              @click="onHide"
              icon="times"
            />
          </b-col>
        </b-row>
      </div>
    </template>

    <div class="w-100 p-3">
      <span
        class="font-size-12 font-w600"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        {{ `${$t("proposal_title")}:` }}
      </span>
      <span
        class="font-size-14 font-w500"
        :class="darkMode ? 'text-dark' : 'proposal-title-light'"
      >
        {{ proposal.name }}
      </span>
    </div>

    <data-table
      :items="getVoters()"
      :fields="fields"
      class="p-0"
      hide-pagination="true"
      per-page="100000000"
    >
      <template #cell(account)="data">
        <a
          :href="getEtherscanUrl(data.item.account)"
          target="_blank"
          rel="noopener"
          class="font-size-14"
          :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
        >
          {{ data.item.account }}
        </a>
      </template>

      <template #cell(weight)="data">
        <div class="text-right">
          {{ getWeight(data.item.votes) }}
          {{ symbol }}
        </div>
      </template>

      <template #cell(voted)="data">
        <div :class="getVoteClass(data.value)">
          {{ data.value === 1 ? $t("for") : $t("against") }}
        </div>
      </template>

      <template #cell(percentOfTotal)="data">
        <div class="text-right">{{ data.item.percentOfTotal }}%</div>
      </template>
    </data-table>

    <template slot="modal-footer">
      <div class="text-center w-100">
        <main-button
          @click="onHide"
          :label="$t('close')"
          :active="true"
          :block="false"
          style="width: 175px"
        />
      </div>
    </template>
  </b-modal>
</template>

<script lang="ts">
import { vxm } from "@/store/";
import { i18n } from "@/i18n";
import { Component, Prop, Emit, VModel } from "vue-property-decorator";
import MainButton from "@/components/common/Button.vue";
import {
  Proposal,
  Voter,
  Votes
} from "@/store/modules/governance/ethGovernance";
import BigNumber from "bignumber.js";
import DataTable from "@/components/common/DataTable.vue";
import { shrinkToken } from "@/api/eth/helpers";
import BaseComponent from "@/components/BaseComponent.vue";
import { ViewTableField } from "@/types/bancor";

@Component({
  components: {
    MainButton,
    DataTable
  }
})
export default class ModalVoteDetails extends BaseComponent {
  @VModel({ type: Boolean }) show!: boolean;
  @Prop() proposal!: Proposal;

  symbol: string = "";
  decimals: number = 0;
  etherscanUrl: string = "";

  get fields(): ViewTableField[] {
    return [
      {
        id: 1,
        key: "index",
        label: "#",
        sortable: true
      },
      {
        id: 2,
        key: "account",
        label: i18n.tc("user_wallet"),
        sortable: true
      },
      {
        id: 3,
        key: "weight",
        label: i18n.tc("amount"),
        sortable: true,
        thClass: "text-right"
      },
      {
        id: 4,
        key: "voted",
        label: i18n.tc("vote.title"),
        sortable: true
      },
      {
        id: 5,
        key: "percentOfTotal",
        label: `%${i18n.tc("amount")}`,
        sortable: true,
        thClass: "text-right"
      }
    ];
  }

  getWeight(votes: Votes): string {
    return this.formatNumber(votes.for !== "0" ? votes.for : votes.against);
  }

  getVoteClass(vote: number) {
    return vote === 1 ? "voted-for" : "voted-against";
  }

  getVoters() {
    return this.proposal.voters.map((v: Voter, index: number) => {
      return {
        id: `${v.account}-${index}`,
        index: index + 1,
        ...v,
        percentOfTotal: this.calculatePercentOfTotal(
          v.votes.for !== "0" ? v.votes.for : v.votes.against
        ),
        voted: v.votes.voted === "for" ? 1 : 2,
        weight: v.votes.for !== "0" ? v.votes.for : v.votes.against
      };
    });
  }

  calculatePercentOfTotal(vote: string) {
    const percent = new BigNumber(100)
      .dividedBy(new BigNumber(this.proposal.totalVotes))
      .multipliedBy(
        new BigNumber(vote).dividedBy(new BigNumber(10).pow(this.decimals))
      );

    return percent.toFixed(2);
  }

  formatNumber(num: string) {
    return this.prettifyNumber(shrinkToken(num, this.decimals));
  }

  getEtherscanUrl(account: string) {
    return `${this.etherscanUrl}address/${account}`;
  }

  @Emit("hide")
  onHide() {
    this.show = false;
  }

  async update() {}

  async mounted() {
    this.symbol = await vxm.ethGovernance.getSymbol();
    this.decimals = await vxm.ethGovernance.getDecimals();
    this.etherscanUrl = await vxm.ethGovernance.getEtherscanUrl();
  }
}
</script>
<style lang="scss">
@import "@/assets/_scss/custom/_variables";

#vote-details .voted-for {
  color: #3ec8c8;
}

#vote-details .voted-against {
  color: #de4a5c;
}

#vote-details .modal-header {
  border-bottom: 1px solid #e6ebf2;
}

#vote-details .proposal-title-light {
  color: #0a2540;
}

#vote-details .modal-body {
  padding-right: 0 !important;
  padding-left: 0 !important;
}

#vote-details a {
  color: #0f59d1;
}
</style>
