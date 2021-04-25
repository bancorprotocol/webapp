<template>
  <content-block
    id="vote-stake"
    :no-header="true"
    :shadow-light="true"
    :px0="true"
  >
    <div
      class="d-flex justify-content-between align-items-center py-2 px-3"
      :class="[darkMode ? 'border-bottom-dark' : 'border-bottom-light']"
    >
      <h3
        class="m-0 p-0 my-2 font-size-14 font-w600 w-100 text-left cursor"
        :class="darkMode ? 'text-dark' : 'text-light'"
        @click="opened = !opened"
      >
        {{ $t("stake") }}
        <font-awesome-icon
          class="open-icon"
          :icon="opened ? 'caret-up' : 'caret-down'"
        />
      </h3>
    </div>

    <div v-if="opened">
      <div
        class="p-3"
        :class="darkMode ? 'border-bottom-dark' : 'border-bottom-light'"
      >
        <span
          class="font-size-14 font-w500"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          {{ $t("your_balance") }}
        </span>
        <div
          class="font-size-14 font-w500"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          {{ prettifyNumber(balance.toNumber()) }} {{ symbol }}
        </div>
      </div>

      <div
        class="p-3"
        :class="darkMode ? 'border-bottom-dark' : 'border-bottom-light'"
      >
        <span
          class="font-size-14 font-w500"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          {{ $t("currently_staked") }}
        </span>
        <div
          class="font-size-14 font-w500"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          {{ prettifyNumber(votes.toNumber()) }} {{ symbol }}
        </div>
      </div>

      <div class="p-3 pb-0">
        <main-button
          @click="stakeModal = true"
          :label="$t('stake_tokens')"
          :active="true"
          :large="true"
          :block="true"
          class="font-size-14 mb-3"
        />
        <modal-stake v-model="stakeModal" />

        <div v-if="lock.for === 0 && votes > 0">
          <main-button
            @click="unstakeModal = true"
            :label="$t('unstake_tokens')"
            :active="false"
            :large="true"
            :block="true"
            class="font-size-14 mb-3"
          />
          <modal-unstake v-model="unstakeModal" />
        </div>

        <span v-if="lock.till > Date.now()">
          <remaining-time
            class="mb-2"
            variant="unlock"
            :from="Date.now()"
            :to="lock.till"
          />
        </span>

        <div
          class="font-size-14 font-w400 text-center"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          <div>
            {{ $t("governance_contract") }}
            <a
              :href="getEtherscanUrl(governanceContractAddress)"
              class="font-w500"
              :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
              target="_blank"
            >
              {{ shortAddress(governanceContractAddress) }}
            </a>

            <font-awesome-icon
              class="ml-1 cursor"
              v-if="governanceContractAddress"
              icon="copy"
              @click="() => copy(governanceContractAddress)"
            />
          </div>

          <div>
            {{ $t("governance_token") }}
            <a
              :href="getEtherscanUrl(tokenAddress)"
              class="font-w500"
              :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
              target="_blank"
            >
              {{ shortAddress(tokenAddress) }}
            </a>

            <font-awesome-icon
              class="ml-1 cursor"
              v-if="tokenAddress"
              icon="copy"
              @click="() => copy(tokenAddress)"
            />
          </div>
        </div>
      </div>
    </div>
  </content-block>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import { EthAddress } from "@/types/bancor";
import { shortenEthAddress } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import ModalStake from "@/components/modals/ModalStake.vue";
import ModalUnstake from "@/components/modals/ModalUnstake.vue";
import BigNumber from "bignumber.js";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    ContentBlock,
    MainButton,
    RemainingTime,
    ProgressBar,
    ModalStake,
    ModalUnstake,
    LabelContentSplit
  }
})
export default class Stake extends BaseComponent {
  stakeModal = false;
  unstakeModal = false;

  opened: boolean = true;

  votes: BigNumber = new BigNumber(0);
  balance: BigNumber = new BigNumber(0);
  symbol: string = "";
  etherscanUrl: string = "";

  lock: {
    till: number;
    for: number;
  } = {
    till: 0,
    for: 0
  };

  governanceContractAddress: EthAddress = "";
  tokenAddress: EthAddress = "";

  get lastTransaction() {
    return vxm.ethGovernance.lastTransaction;
  }

  get loaded() {
    return vxm.ethGovernance.isLoaded;
  }

  copy(address: string) {
    navigator.clipboard.writeText(address);
  }

  getEtherscanUrl(token: string) {
    return `${this.etherscanUrl}address/${token}`;
  }

  shortAddress(address: EthAddress) {
    return shortenEthAddress(address);
  }

  @Watch("currentUser")
  @Watch("stakeModal")
  @Watch("unstakeModal")
  @Watch("lastTransaction")
  async update() {
    const [balance, votes, lock, tokenAddress, symbol] = await Promise.all([
      this.currentUser
        ? vxm.ethGovernance.getBalance({
            account: this.currentUser
          })
        : new BigNumber(0),
      this.currentUser
        ? vxm.ethGovernance.getVotes({
            voter: this.currentUser
          })
        : new BigNumber(0),
      this.currentUser
        ? vxm.ethGovernance.getLock({
            account: this.currentUser
          })
        : { till: 0, for: 0 },
      vxm.ethGovernance.getTokenAddress(),
      vxm.ethGovernance.getSymbol()
    ]);

    this.balance = balance;
    this.votes = votes;
    this.lock = lock;
    this.tokenAddress = tokenAddress;
    this.symbol = symbol;
    this.governanceContractAddress = await vxm.ethGovernance.getGovernanceContractAddress();
    this.etherscanUrl = await vxm.ethGovernance.getEtherscanUrl();
  }

  async mounted() {
    await this.update();
  }
}
</script>

<style lang="scss">
#vote-stake {
  min-width: 115px;
}

#vote-stake .open-icon {
  position: absolute;
  right: 30px;
}

#vote-stake .block-content {
  padding-bottom: 0 !important;
}
</style>
