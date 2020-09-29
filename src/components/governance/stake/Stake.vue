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
        {{ balance }} {{ symbol }}
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
        {{ votes }} {{ symbol }}
      </div>
    </div>

    <div class="p-3 pb-0">
      <main-button
        @click="stakeModal = true"
        label="Stake Tokens"
        :active="true"
        :large="true"
        :block="true"
        class="font-size-14 mb-3"
      />
      <modal-stake v-model="stakeModal" />

      <div v-if="lock.for === 0 && votes > 0">
        <main-button
          @click="unstakeModal = true"
          label="Unstake Tokens"
          :active="false"
          :large="true"
          :block="true"
          class="font-size-14 mb-3"
        />
        <modal-unstake v-model="unstakeModal" />
      </div>

      <span v-if="lock.till > Date.now()">
        <remaining-time type="warn" :from="Date.now()" :to="lock.till" />
      </span>

      <div
        class="font-size-12 font-w400 text-center"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        <div>
          Government contract
          <a
            :href="getEtherscanUrl(governanceContractAddress)"
            class="font-w500"
            target="_blank"
          >
            {{ shortAddress(governanceContractAddress) }}
          </a>
        </div>

        <div>
          Government token
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
import {
  etherscanUrl,
  governanceContractAddress
} from "@/store/modules/governance/ethGovernance";
import { shortenEthAddress } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import ModalStake from "@/components/modals/ModalStake.vue";
import ModalUnstake from "@/components/modals/ModalUnstake.vue";

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

  votes: number = 0;
  balance: number = 0;
  symbol: string = "";

  lock: {
    till: number;
    for: number;
  } = {
    till: 0,
    for: 0
  };

  governanceContractAddress: EthAddress = governanceContractAddress;
  tokenAddress: EthAddress = "";

  get isEth() {
    return this.$route.params.service === "eth";
  }

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
    return `${etherscanUrl}address/${token}`;
  }

  shortAddress(address: EthAddress) {
    return shortenEthAddress(address);
  }

  @Watch("isAuthenticated")
  @Watch("stakeModal")
  @Watch("unstakeModal")
  async update() {
    this.balance = await vxm.ethGovernance.getBalance({
      account: this.isAuthenticated
    });

    this.votes = await vxm.ethGovernance.getVotes({
      voter: this.isAuthenticated
    });

    this.lock = await vxm.ethGovernance.getLock({
      account: this.isAuthenticated
    });

    this.tokenAddress = await vxm.ethGovernance.getTokenAddress();
    this.symbol = await vxm.ethGovernance.getSymbol();
  }

  async mounted() {
    await this.update();
  }
}
</script>

<style lang="scss"></style>
