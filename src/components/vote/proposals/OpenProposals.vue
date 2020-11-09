<template>
  <div>
    <modal-not-enough-tokens v-model="notEnoughTokensModal" />
    <div v-if="!proposals">
      <div class="d-flex justify-content-center align-items-center my-5">
        <b-spinner
          style="display: block; width: 2rem; height: 2rem;"
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
    <data-table
      v-else-if="proposals"
      :items="proposals"
      :fields="fields"
      default-sort="to"
      :hidePagination="true"
    >
      <template
        v-for="proposal in proposals"
        class="font-w500 font-size-14 align-rows-cells"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        <tr :key="proposal.id">
          <td>{{ proposal.id }}</td>
          <td>
            <div class="font-size-14 font-w500">
              {{ proposal.name }}
            </div>

            <div class="font-size-14 font-w500 text-muted-light pb-3 pt-2">
              More about proposal:
              <a
                target="_blank"
                class="font-size-14 font-w500 fix-a pl-2"
                :href="
                  (proposal.metadata &&
                    proposal.metadata.payload &&
                    proposal.metadata.payload.metadata &&
                    proposal.metadata.payload.metadata.discourse.startsWith(
                      'https://gov.bancor.network/'
                    ) &&
                    proposal.metadata.payload.metadata.discourse) ||
                    undefined
                "
              >
                <font-awesome-icon icon="external-link-alt" />
                Discussion Forum
              </a>
              <a
                target="_blank"
                class="font-size-14 font-w500 fix-a pl-2"
                :href="
                  (proposal.metadata &&
                    proposal.metadata.payload &&
                    proposal.metadata.payload.metadata &&
                    proposal.metadata.payload.metadata.github &&
                    proposal.metadata.payload.metadata.github.startsWith(
                      'https://github.com/'
                    ) &&
                    proposal.metadata.payload.metadata.github) ||
                    undefined
                "
              >
                <font-awesome-icon :icon="['fab', 'github']" />
                GitHub
              </a>
            </div>

            <b-row>
              <b-col cols="6">
                <b-row class="pb-1">
                  <b-col
                    class="font-size-12 text-muted-light text-nowrap"
                    cols="4"
                  >
                    Vote Start
                  </b-col>
                  <b-col class="font-size-12 font-w500 pl-1 pr-1" cols="4">
                    {{ formatDate(proposal.start) }}
                  </b-col>
                  <b-col
                    class="font-size-12 font-w500 text-muted-light"
                    cols="2"
                  >
                    {{ formatTime(proposal.start) }}
                  </b-col>
                </b-row>
                <b-row>
                  <b-col
                    class="font-size-12 text-muted-light text-nowrap"
                    cols="4"
                  >
                    Vote End
                  </b-col>
                  <b-col class="font-size-12 font-w500 pl-1 pr-1" cols="4">
                    {{ formatDate(proposal.end) }}
                  </b-col>
                  <b-col
                    class="font-size-12 font-w500 text-muted-light"
                    cols="2"
                  >
                    {{ formatTime(proposal.end) }}
                  </b-col>
                </b-row>
              </b-col>
              <b-col cols="6">
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
              </b-col>
            </b-row>

            <div class="pt-2">
              <remaining-time
                type="warn"
                :showSeconds="true"
                :from="proposal.start"
                :to="proposal.end"
              />
            </div>
          </td>
          <td>
            <div class="pl-3 container-border">
              <div
                v-if="!proposal.votes.voted && proposal.end > Date.now()"
                class="d-flex align-items-center mb-2"
              >
                <main-button
                  @click="() => voteFor(proposal.id.toString())"
                  label="Vote for"
                  :large="true"
                  :active="true"
                  :block="true"
                  class="font-size-14 font-w400 mr-3 text-uppercase button-vote button-vote--for"
                />

                <main-button
                  @click="voteAgainst(proposal.id.toString())"
                  label="Vote against"
                  :large="true"
                  :active="true"
                  :block="true"
                  class="font-size-14 font-w400 mt-0 text-uppercase button-vote button-vote--against"
                />
              </div>

              <div v-if="proposal.votes.voted">
                <div
                  class="votes-bar--empty voted-box mb-2"
                  :class="'votes-bar--' + proposal.votes.voted"
                >
                  <div class="row">
                    <span class="col-3">
                      <span class="text-uppercase">{{
                        proposal.votes.voted
                      }}</span>
                    </span>
                    <span class="col-9 text-right">
                      {{ proposal.votes.for || proposal.votes.against }}
                      {{ symbol }}
                    </span>
                  </div>
                  <div class="row">
                    <div
                      class="col-4 tiny-text"
                      :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
                    >
                      <span>your vote</span>
                    </div>
                    <div class="col-8 font-size-12 text-right voted-box__text">
                      <span
                        class="tiny-text"
                        :class="
                          darkMode ? 'text-body-dark' : 'text-muted-light'
                        "
                      >
                        {{
                          (
                            ((proposal.votes.for || proposal.votes.against) /
                              proposal.totalVotes) *
                            100
                          ).toFixed(2)
                        }}% from voters
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="font-size-12 font-w500 text-uppercase">
                <div class="votes-bar">
                  <div
                    class="votes-bar__progress"
                    :style="{
                      width: `${(100 / proposal.totalVotes) *
                        proposal.totalVotesFor}%`
                    }"
                  />
                  <div class="votes-bar__content text-uppercase">
                    <span>
                      For
                      {{
                        (
                          (100 / proposal.totalVotes) *
                            proposal.totalVotesFor || 0
                        ).toFixed(2)
                      }}%
                    </span>
                    <span>
                      Against
                      {{
                        (
                          (100 / proposal.totalVotes) *
                            proposal.totalVotesAgainst || 0
                        ).toFixed(2)
                      }}%
                    </span>
                  </div>
                </div>
              </div>

              <div
                class="tiny-text font-w500"
                :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
              >
                <div class="row pt-2">
                  <div class="col-6">
                    {{ prettifyNumber(proposal.totalVotesFor) }} {{ symbol }}
                  </div>
                  <div class="col-6 text-right">
                    {{ prettifyNumber(proposal.totalVotesAgainst) }}
                    {{ symbol }}
                  </div>
                </div>

                <div class="row pt-2">
                  <div class="col-12">
                    <span>
                      {{ (proposal.quorum / 10000).toFixed(2) }}% Quorum ({{
                        (proposal.quorumRequired / 10000).toFixed(2)
                      }}% to pass)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </data-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import PieChart from "@/components/data/charts/PieChart.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
import DataTable from "@/components/deprecated/DataTable.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import ButtonProgress from "@/components/common/ButtonProgress.vue";
import MainButton from "@/components/common/Button.vue";
import { ViewTableFields } from "@/components/common/TableHeader.vue";
import { prettifyNumber, shortenEthAddress } from "@/api/helpers";
import { Proposal } from "@/store/modules/governance/ethGovernance";
import BigNumber from "bignumber.js";
import ModalNotEnoughTokens from "@/components/modals/ModalNotEnoughTokens.vue";

@Component({
  components: {
    ContentBlock,
    ProgressBar,
    RemainingTime,
    DataTable,
    ButtonProgress,
    MainButton,
    PieChart,
    ModalNotEnoughTokens
  }
})
export default class OpenProposals extends Vue {
  @Prop() proposals?: Proposal[];

  notEnoughTokensModal = false;
  symbol: string = "";
  etherscanUrl: string = "";
  currentVotes: BigNumber = new BigNumber(0);

  get fields(): ViewTableFields[] {
    console.log("proposals", this.proposals);
    return [
      {
        label: "ID",
        key: "id",
        minWidth: "60px",
        maxWidth: "60px"
      },
      {
        label: "Details",
        key: "",
        minWidth: "450px",
        maxWidth: "500px"
      },
      {
        label: "Vote",
        key: "",
        minWidth: "300px",
        maxWidth: "300px"
      }
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  prettifyNumber(number: string | number): string {
    return prettifyNumber(number);
  }

  getVotePercent(proposal: Proposal) {
    return (
      (100 / proposal.totalVotes) *
        (proposal.votes.voted === "for"
          ? proposal.totalVotesFor
          : proposal.totalVotesAgainst) || 0
    ).toFixed(1);
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

  getEtherscanUrl(address: string) {
    return `${this.etherscanUrl}address/${address}`;
  }

  shortAddress(address: string) {
    return shortenEthAddress(address);
  }

  async voteFor(proposalId: string) {
    await this.update();

    if (this.currentVotes.isGreaterThan(0)) {
      await vxm.ethGovernance.voteFor({
        account: vxm.ethWallet.isAuthenticated,
        proposalId
      });
    } else {
      this.notEnoughTokensModal = true;
    }
  }

  async voteAgainst(proposalId: string) {
    await this.update();

    if (this.currentVotes.isGreaterThan(0)) {
      await vxm.ethGovernance.voteAgainst({
        account: vxm.ethWallet.isAuthenticated,
        proposalId
      });
    } else {
      this.notEnoughTokensModal = true;
    }
  }

  async update() {
    this.currentVotes = await vxm.ethGovernance.getVotes({
      voter: vxm.wallet.isAuthenticated
    });
  }
  async mounted() {
    this.etherscanUrl = await vxm.ethGovernance.getEtherscanUrl();
    this.symbol = await vxm.ethGovernance.getSymbol();
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

a:not([href]).fix-a {
  color: $text-muted-light !important;
  cursor: default;
}

.align-rows-cells {
  @at-root .table & > td {
    vertical-align: top !important;
  }
}

.container-border {
  border-left: 1px solid $gray-border;
}

@mixin vote-bg() {
  &--for {
    background: #3ec8c8 !important;
  }
  &--against {
    background: #de4a5c !important;
  }
}

.button-vote {
  @include vote-bg;

  border-color: transparent !important;
  outline: none !important;
  box-shadow: none !important;
}

.square {
  @include vote-bg;

  display: inline-block;
  height: 4px;
  width: 4px;
  vertical-align: middle;
  margin-right: 8px;
}

.mini-pie-wrapper {
  height: 16px;
  width: 16px;
  display: inline-flex;
  vertical-align: middle;
}

.voted-box {
  border: 1px solid $gray-border;
  background: $block-bg-blue;
  padding: 4px 8px;
  border-radius: 8px;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 16px + 8px;
  }

  &__text {
    color: #0a2540;
  }
}

.vote-chip {
  border-radius: 8px;
  border: 1px solid currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 24px;

  &--for {
    color: #3ec8c8;

    &:before {
      content: "For";
    }
  }

  &--against {
    color: #de4a5c;

    &:before {
      content: "Against";
    }
  }
}

.votes-bar {
  height: 24px;
  border-radius: 8px;
  overflow: hidden;
  background: #de4a5c;
  position: relative;
  color: #ffffff;
  font-size: 12px;

  &__progress {
    background: #3ec8c8;
    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
  }

  &__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
  }

  &--empty {
    border: 1px solid currentColor;
    background: transparent;
  }

  &--for {
    color: #3ec8c8;
  }

  &--against {
    color: #de4a5c;
  }
}

.tiny-text {
  font-size: 10px;
  line-height: 12px;
  color: #0a2540;
}
</style>
