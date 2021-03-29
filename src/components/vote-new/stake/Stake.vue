<template>
  <content-block title="Stake your vBNT" :shadow-light="true">
    <div>
      <p
        class="mt-4 font-w500 font-size-14"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        In order to participate in Bancor governance activities, you should
        first stake your vBNT tokens.
      </p>

      <b-row class="mt-5">
        <b-col sm="6">
          <b-btn
            @click="stakeModal = true"
            variant="primary"
            size="lg"
            class="btn-rounded btn-block"
          >
            Stake Tokens
          </b-btn>
          <modal-stake v-model="stakeModal" />
        </b-col>
        <b-col sm="6" class="mt-3 mt-sm-0">
          <b-btn
            v-if="lock.for === 0 && votes > 0"
            @click="unstakeModal = true"
            size="lg"
            :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
            class="btn-rounded btn-block"
          >
            Unstake Tokens
          </b-btn>
          <span v-if="lock.till > Date.now()">
            <remaining-time
              class="mb-2"
              variant="unlock"
              :from="Date.now()"
              :to="lock.till"
            />
          </span>
          <modal-unstake v-model="unstakeModal" />
        </b-col>
      </b-row>
      <hr class="my-4" />
      <b-row>
        <b-col sm="6">
          <span
            class="text-uppercase font-size-12 font-w500"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            {{ $t("your_balance") }}
          </span>
          <div
            class="font-size-12 font-w500"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            {{ prettifyNumber(balance.toNumber()) }} {{ symbol }}
          </div>
        </b-col>
        <b-col sm="6" class="mt-3 mt-sm-0">
          <span
            class="text-uppercase font-size-12 font-w500"
            :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
          >
            {{ $t("currently_staked") }}
          </span>
          <div
            class="font-size-12 font-w500"
            :class="darkMode ? 'text-dark' : 'text-light'"
          >
            {{ prettifyNumber(votes.toNumber()) }} {{ symbol }}
          </div>
        </b-col>
      </b-row>
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
