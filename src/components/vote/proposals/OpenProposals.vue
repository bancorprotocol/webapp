<template>
  <div id="open-proposals">
    <modal-not-enough-tokens v-model="notEnoughTokensModal" />
    <modal-vote-details
      v-model="voteDetailsModal"
      :proposal="selectedProposal"
    />
    <div v-if="!proposals">
      <div class="d-flex justify-content-center align-items-center my-5">
        <b-spinner
          style="display: block; width: 2rem; height: 2rem"
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
      :items="items"
      :fields="fields"
      :hide-pagination="true"
    >
      <template #cell(name)="{ item }">
        <div class="font-size-14 font-w500">
          {{ item.name }}
        </div>

        <div class="font-size-14 font-w500 text-muted-light pb-3 pt-2">
          <span>More about proposal:</span>
          <a
            target="_blank"
            class="font-size-14 font-w500 pl-2"
            :href="
              (item.metadata &&
                item.metadata.payload &&
                item.metadata.payload.metadata &&
                item.metadata.payload.metadata.discourse.startsWith(
                  'https://gov.bancor.network/'
                ) &&
                item.metadata.payload.metadata.discourse) ||
              undefined
            "
          >
            <font-awesome-icon icon="external-link-alt" />
            Discussion Forum
          </a>
          <a
            target="_blank"
            class="font-size-14 font-w500 pl-2"
            :href="
              (item.metadata &&
                item.metadata.payload &&
                item.metadata.payload.metadata &&
                item.metadata.payload.metadata.github &&
                item.metadata.payload.metadata.github.startsWith(
                  'https://github.com/'
                ) &&
                item.metadata.payload.metadata.github) ||
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
              <b-col class="font-size-12 text-muted-light text-nowrap" cols="4">
                Vote Start
              </b-col>
              <b-col class="font-size-12 font-w500 pl-1 pr-1" cols="4">
                {{ formatDate(item.start) }}
              </b-col>
              <b-col class="font-size-12 font-w500 text-muted-light" cols="2">
                {{ formatTime(item.start) }}
              </b-col>
            </b-row>
            <b-row>
              <b-col class="font-size-12 text-muted-light text-nowrap" cols="4">
                Vote End
              </b-col>
              <b-col class="font-size-12 font-w500 pl-1 pr-1" cols="4">
                {{ formatDate(item.end) }}
              </b-col>
              <b-col class="font-size-12 font-w500 text-muted-light" cols="2">
                {{ formatTime(item.end) }}
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
                :href="getEtherscanUrl(item.proposer)"
              >
                {{ shortAddress(item.proposer) }}
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
                :href="getEtherscanUrl(item.executor)"
              >
                {{ shortAddress(item.executor) }}
              </a>
            </div>
          </b-col>
        </b-row>

        <div class="pt-2">
          <remaining-time
            type="warn"
            :show-seconds="true"
            :from="item.start"
            :to="item.end"
          />
        </div>
      </template>

      <template #cell(votes)="{ item }">
        <div class="pl-3 container-border h-100">
          <div
            v-if="!item.votes.voted && item.end > Date.now()"
            class="d-flex align-items-center mb-2"
          >
            <main-button
              @click="voteFor(item.id.toString())"
              label="Vote for"
              :large="true"
              :active="true"
              :block="true"
              class="font-size-14 font-w400 mr-3 text-uppercase button-vote button-vote--for"
            />

            <main-button
              @click="voteAgainst(item.id.toString())"
              label="Vote against"
              :large="true"
              :active="true"
              :block="true"
              class="font-size-14 font-w400 mt-0 text-uppercase button-vote button-vote--against"
            />
          </div>

          <div v-if="item.votes.voted">
            <div
              class="votes-bar--empty voted-box mb-2"
              :class="'votes-bar--' + item.votes.voted"
            >
              <div class="row">
                <span class="col-3">
                  <span class="text-uppercase">{{ item.votes.voted }}</span>
                </span>
                <span class="col-9 text-right">
                  {{ item.votes.for || item.votes.against }}
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
                    :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
                  >
                    {{
                      (
                        ((item.votes.for || item.votes.against) /
                          item.totalVotes) *
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
                  width: `${(100 / item.totalVotes) * item.totalVotesFor}%`
                }"
              />
              <div class="votes-bar__content text-uppercase">
                <span>
                  For
                  {{
                    ((100 / item.totalVotes) * item.totalVotesFor || 0).toFixed(
                      2
                    )
                  }}%
                </span>
                <span>
                  Against
                  {{
                    (
                      (100 / item.totalVotes) * item.totalVotesAgainst || 0
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
                {{ prettifyNumber(item.totalVotesFor) }} {{ symbol }}
              </div>
              <div class="col-6 text-right">
                {{ prettifyNumber(item.totalVotesAgainst) }}
                {{ symbol }}
              </div>
            </div>

            <div class="row pt-2">
              <div class="col-12">
                <span>
                  {{ (item.quorum / 10000).toFixed(2) }}% Quorum ({{
                    (item.quorumRequired / 10000).toFixed(2)
                  }}% to pass)
                </span>
              </div>
            </div>
          </div>
        </div>
                <div class="row pt-2">
                  <div class="col-6">
                    <span>
                      {{
                        proposal.voters.filter(v => v.votes.voted === "for")
                          .length
                      }}
                      Users
                    </span>
                  </div>
                  <div class="col-6 text-right">
                    <span>
                      {{
                        proposal.voters.filter(v => v.votes.voted === "against")
                          .length
                      }}
                      Users
                    </span>
                  </div>
                </div>

                <div class="row pt-1">
                  <div class="col-6 pt-1">
                    <span v-if="Date.now() > proposal.end">
                      {{ (proposal.quorum / 10000).toFixed(2) }}% Quorum
                    </span>
                  </div>
                  <div class="col-6 text-right">
                    <b-btn
                      @click="() => showDetails(proposal.id)"
                      :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
                      class="block-rounded btn-sm"
                    >
                      <span class="font-size-14 font-w500">
                        <font-awesome-icon icon="poll" />
                        Breakdown
                      </span>
                    </b-btn>
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import DataTable, { ViewTableField } from "@/components/common/DataTable.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import ButtonProgress from "@/components/common/ButtonProgress.vue";
import MainButton from "@/components/common/Button.vue";
import { prettifyNumber, shortenEthAddress } from "@/api/helpers";
import { Proposal } from "@/store/modules/governance/ethGovernance";
import BigNumber from "bignumber.js";
import ModalNotEnoughTokens from "@/components/modals/ModalNotEnoughTokens.vue";
import ModalVoteDetails from "@/components/modals/ModalVoteDetails.vue";

@Component({
  components: {
    ModalVoteDetails,
    ContentBlock,
    ProgressBar,
    RemainingTime,
    DataTable,
    ButtonProgress,
    MainButton,
    ModalNotEnoughTokens
  }
})
export default class OpenProposals extends Vue {
  @Prop() proposals?: Proposal[];

  notEnoughTokensModal = false;
  voteDetailsModal = false;
  selectedProposal?: Proposal;

  symbol: string = "";
  etherscanUrl: string = "";
  currentVotes: BigNumber = new BigNumber(0);

  get items(): Proposal[] {
    return this.proposals ? this.proposals.slice() : [];
  }

  get fields(): ViewTableField[] {
    console.log("proposals", this.proposals);
    return [
      {
        id: 1,
        label: "ID",
        key: "id",
        minWidth: "16px",
        maxWidth: "16px",
        sortable: false
      },
      {
        id: 2,
        label: "Details",
        key: "name",
        minWidth: "450px",
        maxWidth: "500px",
        sortable: false
      },
      {
        id: 3,
        label: "Vote",
        key: "votes",
        minWidth: "300px",
        maxWidth: "300px",
        sortable: false
      }
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  get currentUser() {
    return vxm.wallet.currentUser;
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

  showDetails(id: number) {
    this.selectedProposal = this.proposals?.find(p => p.id === id);
    this.voteDetailsModal = true;
  }

  async voteFor(proposalId: string) {
    await this.update();

    if (this.currentVotes.isGreaterThan(0)) {
      await vxm.ethGovernance.voteFor({
        account: vxm.ethWallet.currentUser,
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
        account: vxm.ethWallet.currentUser,
        proposalId
      });
    } else {
      this.notEnoughTokensModal = true;
    }
  }

  @Watch("currentUser")
  async update() {
    if (this.currentUser) {
      this.currentVotes = await vxm.ethGovernance.getVotes({
        voter: this.currentUser
      });
    }
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

#open-proposals .align-rows-cells td {
  height: 1px;
  padding-top: 24px !important;
  padding-bottom: 24px !important;
  vertical-align: top !important;
}

#open-proposals tr:last-child,
#open-proposals tr:last-child > td {
  border-bottom: none !important;
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
