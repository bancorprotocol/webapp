<template>
  <div>
    <template v-for="option in stakeOptions">
      <gray-border-block
        :key="option.id"
        :class="option.id <= stakeOptions.length ? 'mb-3' : ''"
        v-if="!option.hide"
      >
        <h5
          class="font-size-14 font-w600 my-2"
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
            v-for="(amount, index) in maxStakes"
            :key="index"
            :label="!index ? $t('space_available') : ''"
            :value="amount"
            :loading="loadingMaxStakes"
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
import { Component, Prop, Emit } from "vue-property-decorator";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import MainButton from "@/components/common/Button.vue";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import wait from "waait";

@Component({
  components: { LabelContentSplit, GrayBorderBlock, MainButton }
})
export default class StakeButtons extends BaseComponent {
  @Prop({ default: false }) showAddLiquidity!: boolean;

  maxStakes: string[] = [];

  loadingMaxStakes = false;

  private interval: any;

  get poolId(): string | null {
    return this.$route.params.id ?? null;
  }

  get stakeOptions() {
    return [
      {
        id: 0,
        title: i18n.t("single_sided_protection"),
        desc: i18n.t("liquidity_with_exposure"),
        buttonTxt: i18n.t("stake_protect"),
        buttonActive: true,
        buttonEnabled: true,
        hide: false,
        maxAllowed: this.poolId ? true : false
      },
      {
        id: 1,
        title: i18n.t("dual_sided_protection"),
        desc: i18n.t("stake_pools_tokens"),
        buttonTxt: i18n.t("stake_protect"),
        buttonActive: true,
        buttonEnabled: true,
        hide: this.showAddLiquidity,
        maxAllowed: false
      },
      {
        id: 2,
        title: i18n.t("dual_sided_liquidity"),
        desc: i18n.t("stake_with_two"),
        buttonTxt: i18n.t("add_dual_liquidity"),
        buttonActive: true,
        buttonEnabled: true,
        hide: !this.showAddLiquidity,
        maxAllowed: false
      }
    ];
  }

  async loadMaxStakes() {
    if (this.loadingMaxStakes || !this.poolId) return;
    this.loadingMaxStakes = true;
    try {
      const [result] = await Promise.all([
        vxm.ethBancor.getMaxStakesView({
          poolId: this.poolId
        }),
        wait(1000)
      ]);

      this.maxStakes = result.map(x => {
        return `${this.prettifyNumber(x.amount)} ${x.token}`;
      });
    } catch (e) {
      console.error(e);
    } finally {
      this.loadingMaxStakes = false;
    }
  }

  async mounted() {
    await this.loadMaxStakes();
    this.interval = setInterval(async () => {
      await this.loadMaxStakes();
    }, 30000);
  }

  destroyed() {
    clearInterval(this.interval);
  }

  @Emit("click")
  click(id: number) {
    return id;
  }
}
</script>

<style lang="scss"></style>
