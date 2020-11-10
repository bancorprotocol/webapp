<template>
  <b-modal
    :content-class="darkMode ? 'bg-block-dark' : 'bg-block-light'"
    scrollable
    size="xl"
    centered
    v-model="show"
    hide-footer
    @close="onHide"
    @cancel="onHide"
    @hide="onHide"
    @show="update"
  >
    <template slot="modal-header">
      <div class="w-100">
        <b-row>
          <b-col cols="12" class="d-flex justify-content-between mb-2">
            <span
              class="font-size-14 font-w600"
              :class="darkMode ? 'text-dark' : 'text-light'"
            >
              <span>Voting Statistics</span>
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

    <div class=" pb-3">
      <span
        class="text-uppercase"
        :class="this.darkMode ? 'text-dark' : 'text-light'"
      >
        Proposal Title:
      </span>
      <span :class="this.darkMode ? 'text-dark' : 'text-light'">
        {{ proposal.name }}
      </span>
    </div>

    <table-wrapper
      :items="getVoters()"
      :fields="fields"
      class="p-0"
      per-page="100000000"
    >
      <template #cell(account)="data">
        <a
          :href="getEtherscanUrl(data.item.account)"
          target="_blank"
          rel="noopener"
          >{{ data.item.account }}
        </a>
      </template>

      <template #head(weight)="data">
        <div class="text-right">
          {{ data.label }}
        </div>
      </template>

      <template #cell(weight)="data">
        <div class="text-right">
          {{
            formatNumber(
              data.item.votes.for !== "0"
                ? data.item.votes.for
                : data.item.votes.against
            )
          }}
          {{ symbol }}
        </div>
      </template>

      <template #cell(voted)="data">
        <div class="text-uppercase" :class="getVoteClass(data.value)">
          {{ data.value }}
        </div>
      </template>

      <template #head(percentOfTotal)="data">
        <div class="text-right">
          {{ data.label }}
        </div>
      </template>

      <template #cell(percentOfTotal)="data">
        <div class="text-right">{{ data.item.percentOfTotal }}%</div>
      </template>
    </table-wrapper>

    <div class="text-center">
      <main-button
        @click="onHide"
        label="Close"
        :active="true"
        :block="false"
        style="width: 175px"
      />
    </div>
  </b-modal>
</template>

<script lang="ts">
import { vxm } from "@/store/";
import { Component, Vue, Prop } from "vue-property-decorator";
import { prettifyNumber, VModel } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import { Proposal, Voter } from "@/store/modules/governance/ethGovernance";
import TableWrapper from "@/components/common/TableWrapper.vue";
import { BvTableFieldArray } from "bootstrap-vue/src/components/table";
import BigNumber from "bignumber.js";

@Component({
  components: {
    MainButton,
    TableWrapper
  }
})
export default class ModalVoteDetails extends Vue {
  @VModel({ type: Boolean }) show!: boolean;
  @Prop() proposal!: Proposal;

  symbol: string = "";
  decimals: number = 0;
  etherscanUrl: string = "";

  fields: BvTableFieldArray = [
    {
      key: "index",
      label: "#",
      sortable: true
    },
    {
      key: "account",
      label: "User Wallet",
      sortable: true
    },
    {
      key: "weight",
      label: "Amount",
      sortable: true,
      formatter: (data, key, object) => {
        return object.votes.for !== "0"
          ? object.votes.for
          : object.votes.against;
      },
      sortByFormatted: true
    },
    {
      key: "voted",
      label: "Vote",
      sortable: true,
      formatter: (data, key, object) => {
        return object.votes.voted.toUpperCase();
      },
      sortByFormatted: true
    },
    {
      key: "percentOfTotal",
      label: "% of Total",
      sortable: true
    }
  ];

  getVoteClass(vote: string) {
    return vote === "FOR" ? "voted-for" : "voted-against";
  }

  getVoters() {
    return this.proposal.voters.map((v: Voter, index: number) => {
      return {
        index: index + 1,
        ...v,
        percentOfTotal: this.calculatePercentOfTotal(
          v.votes.for !== 0 ? v.votes.for : v.votes.against
        )
      };
    });
  }

  calculatePercentOfTotal(vote: number) {
    const pct = new BigNumber(100)
      .dividedBy(new BigNumber(this.proposal.totalVotes))
      .multipliedBy(
        new BigNumber(vote).dividedBy(new BigNumber(10).pow(this.decimals))
      );

    return pct.toFixed(2);
  }

  formatNumber(num: string) {
    return prettifyNumber(
      new BigNumber(num)
        .dividedBy(new BigNumber(10).pow(this.decimals))
        .toString()
    );
  }

  getEtherscanUrl(account: string) {
    return `${this.etherscanUrl}address/${account}`;
  }

  get darkMode(): boolean {
    return vxm.general.darkMode;
  }

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
<style scoped lang="scss">
@import "@/assets/_scss/custom/_variables";

.voted-for {
  color: #3ec8c8;
}

.voted-against {
  color: #de4a5c;
}
</style>
