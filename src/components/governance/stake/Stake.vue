<template>
  <content-block title="Stake" :shadow-light="true">
    <div>
      <main-button
        @click="stakeModal = true"
        label="Open stake modal"
        :active="true"
        :block="true"
        class="font-size-14"
      />
      <modal-stake v-model="stakeModal" />
    </div>

    <div>
      <span
        class="text-uppercase font-size-12 font-w600"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        Your Balance
      </span>
      <div>{{ balance }} {{ symbol }}</div>
    </div>

    <div>
      <span
        class="text-uppercase font-size-12 font-w600"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
      >
        Currently Staked
      </span>
      <div>{{ votes }} {{ symbol }}</div>
    </div>

    <main-button
      @click="stake"
      label="Stake Tokens"
      :active="true"
      :block="true"
      class="font-size-14"
    />

    <main-button
      @click="unstake"
      v-if="lock.for === 0 && votes > 0"
      label="Unstake Tokens"
      :active="false"
      :block="true"
      class="font-size-14"
    />

    <span v-if="lock.for > 0">
      <remaining-time type="warn" :from="Date.now()" :to="lockedTill()" />
    </span>

    <span
      class="font-size-12"
      :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
    >
      Contract address: {{ contractAddress }}
    </span>
  </content-block>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import { EthAddress } from "@/types/bancor";
import { governanceContractAddress } from "@/store/modules/governance/ethGovernance";
import { formatNumber, shortenEthAddress } from "@/api/helpers";
import MainButton from "@/components/common/Button.vue";
import RemainingTime from "@/components/common/RemainingTime.vue";
import ProgressBar from "@/components/common/ProgressBar.vue";
import ModalStake from "@/components/modals/ModalStake.vue";
import { blockTime } from "@/store/modules/governance/ethGovernance";
import { expandToken } from "@/api/eth/helpers";

@Component({
  components: {
    ContentBlock,
    MainButton,
    RemainingTime,
    ProgressBar,
    ModalStake
  }
})
export default class Stake extends Vue {
  stakeModal = true;

  votes: string = "";
  balance: string = "";
  symbol: string = "";

  lock: {
    till: number;
    now: number;
    for: number;
  } = {
    till: 0,
    now: 0,
    for: 0
  };

  contractAddress: EthAddress = shortenEthAddress(governanceContractAddress);

  get isEth() {
    return this.$route.params.service === "eth";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  stake() {
    vxm.ethGovernance
      .stake({
        account: vxm.ethWallet.isAuthenticated,
        amount: expandToken(2.2, 18)
      })
      .then(() => {
        this.updateBalances();
      });
  }

  unstake() {
    vxm.ethGovernance
      .unstake({
        account: vxm.ethWallet.isAuthenticated,
        amount: expandToken(2.2, 18)
      })
      .then(() => {
        this.updateBalances();
      });
  }

  lockedTill(): number {
    const till = Date.now() + this.lock.for * blockTime * 1000;

    console.log("lock", Date.now(), till);
    return till;
  }

  async updateBalances() {
    this.balance = formatNumber(
      await vxm.ethGovernance.getBalance({
        account: vxm.ethWallet.isAuthenticated
      })
    );

    this.votes = formatNumber(
      await vxm.ethGovernance.getVotes({
        voter: vxm.ethWallet.isAuthenticated
      })
    );

    this.lock = await vxm.ethGovernance.getLock({
      account: vxm.ethWallet.isAuthenticated
    });
  }

  async mounted() {
    await this.updateBalances();

    this.symbol = await vxm.ethGovernance.getSymbol();
  }
}
</script>

<style lang="scss"></style>
