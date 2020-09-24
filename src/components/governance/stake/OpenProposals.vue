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
          {{ proposal.name }}
        </div>

        <div class="font-size-14 font-w500 text-muted-light pb-3 pt-2">
          More about proposal:
          <a target="_blank" class="font-size-14 font-w500 fix-a pl-2">
            <font-awesome-icon icon="external-link-alt" />
            Disscussion Forum
          </a>
          <a target="_blank" class="font-size-14 font-w500 fix-a pl-2">
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
                {{ formatDate(proposal.startDate) }}
              </span>
              <span class="font-size-12 font-w500 text-muted-light">
                {{ formatTime(proposal.startDate) }}
              </span>
            </div>
            <div>
              <span class="font-size-12 text-muted-light">
                Vote End
              </span>
              <span class="font-size-12 font-w500 pl-1 pr-1">
                {{ formatDate(proposal.endDate) }}
              </span>
              <span class="font-size-12 font-w500 text-muted-light">
                {{ formatTime(proposal.endDate) }}
              </span>
            </div>
          </b-col>
          <b-col cols="6">
            <div
              class="font-size-12 pb-1"
              :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
            >
              Proposed by
              <a target="_blank" class="font-size-12 font-w500 fix-a">
                {{ shortAddress(proposal.proposer) }}
              </a>
            </div>
            <div
              class="font-size-12"
              :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
            >
              Executed by
              <a target="_blank" class="font-size-12 font-w500 fix-a">
                {{ shortAddress(proposal.executor) }}
              </a>
            </div>
          </b-col>
        </b-row>

        <div class="pt-2">
          <remaining-time
            type="warn"
            :from="proposal.startDate"
            :to="proposal.endDate"
          />
        </div>
      </td>
      <td>
        <div class="pl-3 container-border">
          <div v-if="!proposal.votes.voted">
            <main-button
              @click="() => voteFor(proposal.id.toString())"
              label="Vote for"
              :large="true"
              :active="true"
              :block="true"
              class="font-size-14 font-w400 mb-2 text-uppercase button-vote button-vote--for"
            />

            <main-button
              @click="() => voteAgainst(proposal.id.toString())"
              label="Vote against"
              :large="true"
              :active="true"
              :block="true"
              class="font-size-14 font-w400 text-uppercase button-vote button-vote--against"
            />
          </div>

          <div v-if="proposal.votes.voted">
            <div class="voted-box">
              <div class="voted-box__row">
                <div class="font-size-12 font-w500 text-muted-light">My vote</div>
                <div class="font-size-12 font-w500">
                  <span class="vote-chip" :class="'vote-chip--' + proposal.votes.voted"></span>
                  <a v-show="false" target="_blank" class="font-size-12 font-w500 fix-a ml-2">Unvote</a>
                </div>
              </div>
              <div class="voted-box__row">
                <div class="font-size-12 font-w500 text-muted-light">Staked Amount</div>
                <div class="font-size-12 font-w500">{{proposal.votes.for || proposal.votes.against}} gBTN</div>
              </div>
              <div class="voted-box__row">
                <div class="font-size-12 font-w500 text-muted-light">Percentage from Total</div>
                <div class="font-size-12 font-w500">{{(proposal.votes.for || proposal.votes.against) / proposal.totalVotes * 100}}%</div>
              </div>
            </div>
          </div>

          <div class="font-size-12 font-w500 text-uppercase pt-3">
            <span class="mini-pie-wrapper">
              <pie-chart
                class="fix-pie"
                width="16"
                height="16"
                :ratio="proposal.totalVotesFor / proposal.totalVotes"
                :stroke-width="10"
                :opacity="1"
                color="#3ec8c8"
              />
            </span>
            <span>
              <span class="square square--for"></span>
              <span
                >For
                {{
                  (
                    (100 / proposal.totalVotes) * proposal.totalVotesFor || 0
                  ).toFixed(1)
                }}%</span
              >
            </span>
            <span>
              <span class="square square--against"></span>
              <span
                >Against
                {{
                  (
                    (100 / proposal.totalVotes) * proposal.totalVotesAgainst ||
                    0
                  ).toFixed(1)
                }}%</span
              >
            </span>
          </div>
        </div>
      </td>
    </tr>
  </data-table>

  <span v-else>
    Loading ...
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import PieChart from "vue-pie-chart";
import ContentBlock from "@/components/common/ContentBlock.vue";
import DataTable from "@/components/deprecated/DataTable.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import ButtonProgress from "@/components/common/ButtonProgress.vue";
import MainButton from "@/components/common/Button.vue";
import { ViewTableFields } from "@/components/common/TableHeader.vue";
import { shortenEthAddress } from "@/api/helpers";
import { Proposal } from "@/store/modules/governance/ethGovernance";

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

  get fields(): ViewTableFields[] {
    console.log('proposals', this.proposals)
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
  margin-left: 16px;
}

.mini-pie-wrapper {
  height: 16px;
  width: 16px;
  background: #de4a5c;
  border-radius: 8px;
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
    height: 24px + 8px;

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
      content: 'For';
    }
  }
  &--against {
    color: #de4a5c;

    &:before {
      content: 'Against';
    }
  }
}
</style>
