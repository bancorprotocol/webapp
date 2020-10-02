<template>
  <data-table
    v-if="proposals.length > 0"
    :items="proposals"
    :fields="fields"
    default-sort="to"
    :hidePagination="true"
  >
    <tr
      v-for="proposal in proposals"
      :key="proposal.id"
      class="font-w500 font-size-14 align-rows-cells"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
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
                proposal.metadata.payload.metadata.discourse) ||
                '#'
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
                proposal.metadata.payload.metadata.github) ||
                '#'
            "
          >
            <font-awesome-icon :icon="['fab', 'github']" />
            GitHub
          </a>
        </div>

        <b-row>
          <b-col cols="6">
            <div class="pb-1">
              <span class="font-size-12 text-muted-light">
                Vote Start
              </span>
              <span class="font-size-12 font-w500 pl-1 pr-1">
                {{ formatDate(proposal.start) }}
              </span>
              <span class="font-size-12 font-w500 text-muted-light">
                {{ formatTime(proposal.start) }}
              </span>
            </div>
            <div>
              <span class="font-size-12 text-muted-light">
                Vote End
              </span>
              <span class="font-size-12 font-w500 pl-1 pr-1">
                {{ formatDate(proposal.end) }}
              </span>
              <span class="font-size-12 font-w500 text-muted-light">
                {{ formatTime(proposal.end) }}
              </span>
            </div>
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
            :from="proposal.start"
            :to="proposal.end"
          />
        </div>
      </td>
      <td>
        <div class="pl-3 container-border">
          <div
            v-if="!proposal.votes.voted && proposal.end > Date.now()"
            class="d-flex align-items-center"
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
              @click="() => voteAgainst(proposal.id.toString())"
              label="Vote against"
              :large="true"
              :active="true"
              :block="true"
              class="font-size-14 font-w400 mt-0 text-uppercase button-vote button-vote--against"
            />
          </div>

          <div v-if="proposal.votes.voted" class="switch-on-hover">
            <div
              class="switch-on-hover__visible votes-bar votes-bar--empty"
              :class="'votes-bar--' + proposal.votes.voted"
            >
              <div class="votes-bar__content">
                <span
                  >Your Vote:
                  <span class="text-uppercase">{{
                    proposal.votes.voted
                  }}</span></span
                >
                <span>
                  {{ proposal.votes.for || proposal.votes.against }}
                  {{ symbol }}
                </span>
              </div>
            </div>

            <div class="voted-box switch-on-hover__hidden">
              <div class="voted-box__row">
                <div class="font-size-12 font-w500 text-muted-light">
                  <span
                    class="square"
                    :class="'square--' + proposal.votes.voted"
                  />
                  <span class="text-uppercase">
                    {{ proposal.votes.voted }}
                    {{
                      (
                        (100 / proposal.totalVotes) *
                          (proposal.votes.voted === "for"
                            ? proposal.totalVotesFor
                            : proposal.totalVotesAgainst) || 0
                      ).toFixed(1)
                    }}%
                  </span>
                </div>
              </div>
              <div class="voted-box__row">
                <div class="font-size-12 font-w500 text-muted-light">
                  Voted Amount
                </div>
                <div class="font-size-12 font-w500">
                  {{ proposal.votes.for || proposal.votes.against }}
                  {{ symbol }}
                </div>
              </div>
              <div class="voted-box__row">
                <div class="font-size-12 font-w500 text-muted-light">
                  Percentage from Total
                </div>
                <div class="font-size-12 font-w500">
                  {{
                    (
                      ((proposal.votes.for || proposal.votes.against) /
                        proposal.totalVotes) *
                      100
                    ).toFixed(2)
                  }}%
                </div>
              </div>
            </div>
          </div>

          <div class="font-size-12 font-w500 text-uppercase pt-3">
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
                      (100 / proposal.totalVotes) * proposal.totalVotesFor || 0
                    ).toFixed(1)
                  }}%
                </span>
                <span>
                  Against
                  {{
                    (
                      (100 / proposal.totalVotes) *
                        proposal.totalVotesAgainst || 0
                    ).toFixed(1)
                  }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </data-table>

  <div v-else>
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
import { shortenEthAddress } from "@/api/helpers";
import {
  etherscanUrl,
  Proposal
} from "@/store/modules/governance/ethGovernance";

@Component({
  components: {
    ContentBlock,
    ProgressBar,
    RemainingTime,
    DataTable,
    ButtonProgress,
    MainButton,
    PieChart
  }
})
export default class OpenProposals extends Vue {
  @Prop() proposals?: Proposal[];
  @Prop() update?: any;
  symbol: string = "";

  get fields(): ViewTableFields[] {
    console.log("proposals", this.proposals);
    return [
      {
        label: ""
      },
      {
        label: "Proposal ID",
        key: "id",
        minWidth: "450px",
        maxWidth: "500px"
      },
      {
        label: "Vote",
        maxWidth: "320px",
        minWidth: "320px"
      }
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  generateChartData(proposal: Proposal) {
    return {
      datasets: [
        {
          backgroundColor: ["#3ec8c8", "#de4a5c"],
          borderWidth: 0,
          data:
            proposal.totalVotesFor === 0 && proposal.totalVotesAgainst === 0
              ? [1, 1]
              : [proposal.totalVotesFor, proposal.totalVotesAgainst]
        }
      ]
    };
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
    return `${etherscanUrl}address/${address}`;
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

  async mounted() {
    this.symbol = await vxm.ethGovernance.getSymbol();
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
  padding: 8px 16px;
  border-radius: 8px;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 16px + 8px;
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

.switch-on-hover {
  &:hover &__visible,
  &:not(:hover) &__hidden {
    display: none;
  }
}
</style>
