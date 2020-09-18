<template>
  <content-block title="Stake" :shadow-light="true">
    <span
        class="text-uppercase font-size-12 font-w600"
        :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
    >
      Your Balance
    </span>

    {{ balance }} {{symbol}}
    {{ votes }}

    {{ lockedTill }}

    <main-button
        @click="stake"
        label="Stake Tokens"
        :active="true"
        :block="true"
        class="font-size-14"
    />
    <main-button
        @click="unstake"
        label="Unstake Tokens"
        :active="false"
        :block="true"
        class="font-size-14"
    />

    {{ contractAddress }}
  </content-block>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import { EthAddress } from "@/types/bancor"
import { governanceContractAddress } from "@/store/modules/governance/ethGovernance"
import { shortenEthAddress } from '@/api/helpers'
import MainButton from "@/components/common/Button.vue"

@Component({
  components: {
    ContentBlock,
    MainButton
  }
})
export default class Stake extends Vue {
  votes: string = ""
  balance: string = ""
  symbol: string = ""

  lockedTill: number = 0
  contractAddress: EthAddress = shortenEthAddress(governanceContractAddress)

  get isEth() {
    return this.$route.params.service === "eth";
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  stake() {
    vxm.ethGovernance.stake({
      account: vxm.ethWallet.isAuthenticated,
      amount: 2 * 1e18
    })
        .then(() => {
          this.updateBalances();
        })
  }

  unstake() {
    vxm.ethGovernance.unstake({
      account: vxm.ethWallet.isAuthenticated,
      amount: 2 * 1e18
    })
        .then(() => {
          this.updateBalances();
        })
  }

  async updateBalances() {
    this.balance = await vxm.ethGovernance.getBalance({
      account: vxm.ethWallet.isAuthenticated
    });

    this.votes = await vxm.ethGovernance.getVotes({
      voter: vxm.ethWallet.isAuthenticated
    });

    this.lockedTill = await vxm.ethGovernance.getLock({
      account: vxm.ethWallet.isAuthenticated
    });
  }

  async mounted() {
    await this.updateBalances()

    this.symbol = await vxm.ethGovernance.getSymbol();

  }
}
</script>

<style lang="scss"></style>
