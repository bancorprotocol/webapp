<template>
  <content-block title="Stake" :shadow-light="true" :px0="true">
    <div
      class="p-3"
      :class="darkMode ? 'border-bottom-dark' : 'border-bottom-light'"
    >
      <span
        class="text-uppercase font-size-12 font-w500"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        Your Balance
      </span>
      <div
        class="font-size-12 font-w500"
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
        class="text-uppercase font-size-12 font-w500"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        Currently Staked
      </span>
      <div
        class="font-size-12 font-w500"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        {{ prettifyNumber(votes.toNumber()) }} {{ symbol }}
      </div>
    </div>

    <div class="p-3 pb-0">
      <main-button
        label="Stake Tokens"
        :active="true"
        :large="true"
        :block="true"
        class="font-size-14 mb-3"
        @click="stakeModal = true"
      />
      <modal-stake v-model="stakeModal" />

      <div v-if="lock.for === 0 && votes > 0">
        <main-button
          label="Unstake Tokens"
          :active="false"
          :large="true"
          :block="true"
          class="font-size-14 mb-3"
          @click="unstakeModal = true"
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
        class="font-size-12 font-w400 text-center"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        <div>
          Governance contract
          <a
            :href="getEtherscanUrl(governanceContractAddress)"
            class="font-w500"
            target="_blank"
          >
            {{ shortAddress(governanceContractAddress) }}
          </a>
        </div>

        <div>
          Governance token
          <a
            :href="getEtherscanUrl(tokenAddress)"
            class="font-w500"
            target="_blank"
          >
            {{ shortAddress(tokenAddress) }}
          </a>
        </div>
      </div>
    </div>
  </content-block>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import { EthAddress } from "@/types/bancor";
import { prettifyNumber, shortenEthAddress } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import ModalStake from "@/components/modals/ModalStake.vue";
import ModalUnstake from "@/components/modals/ModalUnstake.vue";
import BigNumber from "bignumber.js";

@Component({
  components: {
    ContentBlock,
    MainButton,
    RemainingTime,
    ProgressBar,
    ModalStake,
    ModalUnstake
  }
})
export default class Stake extends Vue {
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

  get darkMode() {
    return vxm.general.darkMode;
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  get loaded() {
    return vxm.ethGovernance.isLoaded;
  }

  getEtherscanUrl(token: string) {
    return `${this.etherscanUrl}address/${token}`;
  }

  shortAddress(address: EthAddress) {
    return shortenEthAddress(address);
  }

  prettifyNumber(number: string | number): string {
    return prettifyNumber(number);
  }

  @Watch("isAuthenticated")
  @Watch("stakeModal")
  @Watch("unstakeModal")
  async update() {
    const [balance, votes, lock, tokenAddress, symbol] = await Promise.all([
      vxm.ethGovernance.getBalance({
        account: this.isAuthenticated
      }),
      vxm.ethGovernance.getVotes({
        voter: this.isAuthenticated
      }),
      vxm.ethGovernance.getLock({
        account: this.isAuthenticated
      }),
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

<style lang="scss"></style>
