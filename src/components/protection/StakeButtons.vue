<template>
  <div>
    <template v-for="option in stakeOptions">
      <gray-border-block
        :key="option.id"
        :class="option.id <= stakeOptions.length ? 'mb-3' : ''"
        v-if="!option.hide"
      >
        <h5
          class="font-size-14 font-w600 text-uppercase my-2"
          :class="darkMode ? 'text-white' : 'text-primary'"
        >
          {{ option.title }}
        </h5>
        <p class="font-size-14 font-w400 mb-3">
          {{ option.desc }}
        </p>

        <gray-border-block
          v-if="option.maxAllowed"
          :gray-bg="true"
          class="my-3"
        >
          <label-content-split
            label="Available Space"
            :loading="loadingMaxStakes"
            :value="maxStakesTkn + ' ' + tknSymbol"
          />
          <label-content-split
            label=""
            :value="loadingMaxStakes ? '' : maxStakesBnt + ' BNT'"
          />
        </gray-border-block>

        <main-button
          @click="click(option.id)"
          :label="option.buttonTxt"
          :active="option.buttonActive"
          :large="true"
          :disabled="!option.buttonEnabled"
          class="mb-2 font-size-14"
        />
      </gray-border-block>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import MainButton from "@/components/common/Button.vue";
import {vxm} from "@/store";
import {prettifyNumber} from "@/api/helpers";
import {ViewRelay} from "@/types/bancor";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";

@Component({
  components: {LabelContentSplit, GrayBorderBlock, MainButton }
})
export default class StakeButtons extends Vue {
  @Prop({ default: false }) showAddLiquidity!: boolean;

  maxStakesBnt: any = 0;
  maxStakesTkn: any = 0;

  loadingMaxStakes = false;

  get poolId(): string | null {
    return this.$route.params.id ?? null
  }

  get pool(): ViewRelay {
    return vxm.bancor.relay(this.poolId)
  }

  get tknSymbol() {
    return this.pool.reserves[1].symbol
  }

  get stakeOptions() {
    return [
      {
        id: 0,
        title: `Single-Sided Protection`,
        desc:
          "Add liquidity with exposure to one token and protect it from impermanent loss.",
        buttonTxt: "Stake and Protect",
        buttonActive: true,
        buttonEnabled: true,
        hide: false,
        maxAllowed: this.poolId ? true : false
      },
      {
        id: 1,
        title: "Dual-Sided Protection",
        desc:
          "Stake pools tokens of any 50/50 pool holding BNT to protect them from impermanent loss.",
        buttonTxt: "Stake and Protect",
        buttonActive: true,
        buttonEnabled: true,
        hide: this.showAddLiquidity,
        maxAllowed: false
      },
      {
        id: 2,
        title: "Dual-Sided Liquidity",
        desc: "Stake with two tokens and receive pool tokens in return.",
        buttonTxt: "Add Dual Sided Liquidity",
        buttonActive: true,
        buttonEnabled: true,
        hide: !this.showAddLiquidity,
        maxAllowed: false
      }
    ];
  }

  async loadMaxStakes() {
    if (this.loadingMaxStakes || !this.poolId) return
    this.loadingMaxStakes = true;
    try {
      const result = await vxm.ethBancor.getMaxStakes({
        poolId: this.poolId
      });
      const maxStakes = result.maxStakesConverted
      this.maxStakesBnt = prettifyNumber(maxStakes[Object.keys(maxStakes)[0]]);
      this.maxStakesTkn = prettifyNumber(maxStakes[Object.keys(maxStakes)[1]]);
    } catch (e) {
      console.log(e);
    } finally {
      this.loadingMaxStakes = false;
    }
  }

  async created() {
    await this.loadMaxStakes()
  }

  get darkMode() {
    return vxm.general.darkMode
  }

  @Emit("click")
  click(id: number) {
    return id;
  }
}
</script>

<style lang="scss"></style>
