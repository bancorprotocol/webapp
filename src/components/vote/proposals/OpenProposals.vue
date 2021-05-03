<template>
  <div id="open-proposals">
    <modal-not-enough-tokens v-model="notEnoughTokensModal" />
    <modal-vote-details
      v-if="proposals && opened > -1"
      v-model="voteDetailsModal"
      @hide="hideDetails"
      :proposal="proposals.find(p => p.id === opened)"
    />
    <div v-if="!proposals">
      <div class="d-flex justify-content-center align-items-center my-5">
        <b-spinner
          style="display: block; width: 2rem; height: 2rem"
          class="align-self-center align-middle"
          :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
          :label="`${$t('loading')}...`"
        ></b-spinner>
        <h5
          class="m-0 ml-3"
          :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
        >
          {{ `${$t("just_a_moment")}...` }}
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
        {{ `${$t("no_proposals_yet")}...` }}
      </h5>
    </div>
    <layout-proposals
      v-else-if="proposals"
      :items="items"
      :fields="fields"
      :hide-pagination="true"
      per-page="1000000"
    >
      <template #cell(name)="{ item }">
        <div class="font-size-14 font-w500">
          {{ item.name }}
        </div>

        <div class="font-size-14 font-w500 text-muted-light pb-3 pt-2">
          <span>{{ `${$t("more_about_proposal")}:` }}</span>
          <a
            target="_blank"
            class="font-size-14 font-w500 pl-2"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
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
            {{ $t("discussion_forum") }}
          </a>
          <a
            target="_blank"
            class="font-size-14 font-w500 pl-2"
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
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
              <b-col class="font-size-12 text-muted-light" cols="4">
                {{ $t("vote_start") }}
              </b-col>
              <b-col class="font-size-12 font-w500 text-nowrap" cols="4">
                {{ formatDate(item.start) }}
                <span class="text-muted-light pl-1">
                  {{ formatTime(item.start) }}
                </span>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="font-size-12 text-muted-light" cols="4">
                {{ $t("vote_end") }}
              </b-col>
              <b-col class="font-size-12 font-w500 text-nowrap" cols="4">
                {{ formatDate(item.end) }}
                <span class="text-muted-light pl-1">
                  {{ formatTime(item.end) }}
                </span>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="6">
            <div
              class="font-size-12 pb-1"
              :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
            >
              {{ $t("proposed_by") }}
              <a
                target="_blank"
                class="font-size-12 font-w500 fix-a"
                :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
                :href="getEtherscanUrl(item.proposer)"
              >
                {{ shortAddress(item.proposer) }}
              </a>
            </div>
            <div
              class="font-size-12"
              :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
            >
              {{ $t("contract_execute") }}
              <a
                target="_blank"
                class="font-size-12 font-w500 fix-a"
                :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
                :href="getEtherscanUrl(item.executor)"
              >
                {{ shortAddress(item.executor) }}
              </a>
            </div>
          </b-col>
        </b-row>

        <div class="pt-2 px-1">
          <remaining-time
            type="warn"
            :show-seconds="true"
            :from="item.start"
            :to="item.end"
          />
        </div>
      </template>
      <template #cell(votes)="{ item }">
        <div class="pl-lg-3 container-border h-100">
          <div
            v-if="!item.votes.voted && item.end > Date.now()"
            class="d-flex align-items-center mb-2"
          >
            <main-button
              @click="voteFor(item.id.toString())"
              :label="$t('vote_for')"
              :large="true"
              :active="true"
              :block="true"
              class="font-size-14 font-w400 mr-3 button-vote button-vote--for"
            />

            <main-button
              @click="voteAgainst(item.id.toString())"
              :label="$t('vote_against')"
              :large="true"
              :active="true"
              :block="true"
              class="font-size-14 font-w400 mt-0 button-vote button-vote--against"
            />
          </div>

          <div v-if="item.votes.voted">
            <div
              class="votes-bar--empty voted-box mb-2"
              :class="'votes-bar--' + item.votes.voted"
            >
              <div class="row">
                <span class="col-3">
                  <span>{{ item.votes.voted }}</span>
                </span>
                <span class="col-9 text-right">
                  {{
                    prettifyNumber(
                      shrinkToken(
                        item.votes.for !== "0"
                          ? item.votes.for
                          : item.votes.against
                      )
                    )
                  }}
                  {{ symbol }}
                </span>
              </div>
              <div class="row">
                <div
                  class="col-4 tiny-text"
                  :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
                >
                  <span>{{ $t("your_vote") }}</span>
                </div>
                <div class="col-8 font-size-12 text-right voted-box__text">
                  <span
                    class="tiny-text"
                    :class="darkMode ? 'text-body-dark' : 'text-muted-light'"
                  >
                    {{
                      $t("from_voters", {
                        percentage: (
                          (shrinkToken(
                            item.votes.for !== "0"
                              ? item.votes.for
                              : item.votes.against
                          ) /
                            item.totalVotes) *
                          100
                        ).toFixed(2)
                      })
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="font-size-12 font-w500">
            <div class="votes-bar">
              <div
                class="votes-bar__progress"
                :style="{
                  width: `${(100 / item.totalVotes) * item.totalVotesFor}%`
                }"
              />
              <div class="votes-bar__content">
                <span>
                  {{
                    `${$t("for")} ${(
                      (100 / item.totalVotes) * item.totalVotesFor || 0
                    ).toFixed(2)}
                     %`
                  }}
                </span>
                <span>
                  {{
                    `${$t("against")} ${(
                      (100 / item.totalVotes) * item.totalVotesAgainst || 0
                    ).toFixed(2)}
                     %`
                  }}
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
              <div class="col-6">
                <span>
                  {{
                    `${
                      item.voters.filter(v => v.votes.voted === "for").length
                    } ${$t("users")}`
                  }}
                </span>
              </div>
              <div class="col-6 text-right">
                <span>
                  {{
                    `${
                      item.voters.filter(v => v.votes.voted === "against")
                        .length
                    } ${$t("users")}`
                  }}
                </span>
              </div>
            </div>

            <div class="row pt-2">
              <div class="col-6 pt-1">
                {{ `${(item.quorum / 10000).toFixed(2)}% ${$t("quorum")}` }}
              </div>
              <div class="col-6 text-right">
                <b-btn
                  @click="showDetails(item.id)"
                  :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
                  class="block-rounded btn-sm"
                >
                  <span class="btn-breakdown">
                    <font-awesome-icon
                      icon="poll"
                      class="text-muted-light mr-1"
                    />
                    {{ $t("breakdown") }}
                  </span>
                </b-btn>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #tooltip(votes)>
        <div class="pb-2">
          {{ $t("vote.openProposals.tooltip1.p1") }}
        </div>
        <ol class="pl-3">
          <li>
            {{ $t("vote.openProposals.tooltip1.list1") }}
          </li>
          <li>
            {{ $t("vote.openProposals.tooltip1.list2") }}
          </li>
        </ol>
      </template>
    </layout-proposals>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import ContentBlock from "@/components/common/ContentBlock.vue";
import LayoutProposals from "@/components/vote/proposals/LayoutProposals.vue";
import { ViewProposalsField } from "@/types/bancor";
import ProgressBar from "@/components/common/ProgressBar.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import ButtonProgress from "@/components/common/ButtonProgress.vue";
import MainButton from "@/components/common/Button.vue";
import { shortenEthAddress } from "@/api/helpers";
import { Proposal } from "@/store/modules/governance/ethGovernance";
import BigNumber from "bignumber.js";
import ModalNotEnoughTokens from "@/components/modals/ModalNotEnoughTokens.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import ModalVoteDetails from "@/components/modals/ModalVoteDetails.vue";
import { shrinkToken } from "@/api/eth/helpers";

@Component({
  components: {
    ModalVoteDetails,
    ContentBlock,
    ProgressBar,
    RemainingTime,
    LayoutProposals,
    ButtonProgress,
    MainButton,
    ModalNotEnoughTokens
  }
})
export default class OpenProposals extends BaseComponent {
  @Prop() proposals?: Proposal[];

  notEnoughTokensModal = false;
  voteDetailsModal = false;
  opened: number = -1;

  symbol: string = "";
  decimals: number = 0;
  etherscanUrl: string = "";
  currentVotes: BigNumber = new BigNumber(0);

  get items(): Proposal[] {
    return this.proposals ? this.proposals.slice() : [];
  }

  get fields(): ViewProposalsField[] {
    return [
      {
        id: 1,
        label: i18n.tc("id"),
        key: "id",
        minWidth: "16px",
        maxWidth: "16px",
        colAuto: true,
        colRate: 1
      },
      {
        id: 2,
        label: i18n.tc("details"),
        key: "name",
        colAuto: false,
        colRate: 7
      },
      {
        id: 3,
        label: i18n.tc("vote.title"),
        key: "votes",
        minWidth: "200px",
        colAuto: false,
        colRate: 4
      }
    ];
  }

  shrinkToken(amount: string): string {
    return shrinkToken(amount, this.decimals);
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
    this.opened = id === this.opened ? -1 : id;
    this.voteDetailsModal = true;
  }

  hideDetails() {
    this.opened = -1;
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
    this.decimals = await vxm.ethGovernance.getDecimals();
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
  @media (min-width: 992px) {
    border-left: 1px solid $gray-border;
  }
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
  font-size: 0.65rem;

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

.btn-breakdown {
  font-size: 0.75rem;
  font-weight: 500;
}

.tiny-text {
  font-size: 10px;
  line-height: 12px;
  color: #0a2540;
}
</style>
