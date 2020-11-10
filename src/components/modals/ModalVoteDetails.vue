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

    <div>
      {{ proposal.name }}
    </div>

    <table-wrapper :items="proposal.voters" :fields="fields" class="p-0" per-page="100000000">
      <template #cell(index)="data">
        {{ data.index + 1 }}
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

      <template #cell(vote)="data">
        <span class="text-uppercase">
          {{ data.item.votes.voted }}
        </span>
      </template>

      <template #cell(percentOfTotal)="data">
        {{
          calculatePercentOfTotal(
            data.item.votes.for !== "0"
              ? data.item.votes.for
              : data.item.votes.against
          )
        }}%
      </template>
    </table-wrapper>
  </b-modal>
</template>

<script lang="ts">
import { vxm } from "@/store/";
import { Component, Vue, Prop } from "vue-property-decorator";
import { prettifyNumber, VModel } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import { Proposal } from "@/store/modules/governance/ethGovernance";
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

  fields: BvTableFieldArray = [
    {
      key: "index",
      label: "#"
    },
    {
      key: "account",
      label: "User Wallet"
    },
    {
      key: "weight",
      label: "Amount"
    },
    {
      key: "vote",
      label: "Vote"
    },
    {
      key: "percentOfTotal",
      label: "% of Total"
    }
  ];

  calculatePercentOfTotal(vote: string) {
    const pct = new BigNumber(100)
      .dividedBy(new BigNumber(this.proposal.totalVotes))
      .multipliedBy(
        new BigNumber(vote).dividedBy(new BigNumber(10).pow(this.decimals))
      );

    return pct.toFixed(2);
  }

  formatNumber(num: string) {
    console.log(num)
    return prettifyNumber(
        new BigNumber(num).dividedBy(new BigNumber(10).pow(this.decimals)).toString()
    );
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
  }
}
</script>
<style lang="scss">
@import "@/assets/_scss/custom/_variables";
</style>
