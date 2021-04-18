<template>
  <div class="mt-3">
    <label-content-split :label="$t('stake_pool')" class="my-3">
      <pool-logos
        :pool="pool"
        :dropdown="true"
        :cursor="true"
        @click="openPoolSelectModal"
      />
      <modal-pool-select
        @select="selectPool"
        v-model="poolSelectModal"
        :pools="pools"
      />
    </label-content-split>

    <token-input-field
      :label="$t('stake_amount')"
      :token="token"
      v-model="amount"
      :balance="balance"
      :error-msg="inputError"
    />

    <gray-border-block :gray-bg="true" class="my-3">
      <label-content-split :label="$t('space_available')" :loading="loading">
        <span class="cursor" @click="amount = maxStakeAmount">{{
          `${prettifyNumber(maxStakeAmount)} ${maxStakeSymbol}`
        }}</span>
      </label-content-split>
    </gray-border-block>

    <main-button
      :label="actionButtonLabel"
      :active="true"
      :large="true"
      @click="restakeRewards"
      :disabled="disableActionButton"
    />

    <modal-tx-action :tx-meta="txMeta" />
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store/";
import { i18n } from "@/i18n";
import { ViewRelay } from "@/types/bancor";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import TokenInputField from "@/components/common/TokenInputField.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import MainButton from "@/components/common/Button.vue";
import ModalPoolSelect from "@/components/modals/ModalSelects/ModalPoolSelect.vue";
import { compareString } from "@/api/helpers";
import BaseTxAction from "@/components/BaseTxAction.vue";
import ModalTxAction from "@/components/modals/ModalTxAction.vue";
import BigNumber from "bignumber.js";
import { addNotification } from "@/components/compositions/notifications";

@Component({
  components: {
    ModalTxAction,
    ModalPoolSelect,
    PoolLogos,
    LabelContentSplit,
    GrayBorderBlock,
    TokenInputField,
    MainButton
  }
})
export default class RestakeRewards extends BaseTxAction {
  get pool(): ViewRelay {
    const [poolId] = this.$route.params.id.split(":");
    return vxm.bancor.relay(poolId);
  }
  amount: string = "";
  poolSelectModal = false;

  maxStakeAmount: string = "";
  maxStakeSymbol: string = "";
  loading = false;

  disabledPools: string[] = [];

  private interval: any;

  get token() {
    return this.pool.reserves[0]; //BNT
  }

  get balance() {
    return this.pendingRewards.bnt.valueOf();
  }

  get pools() {
    return vxm.bancor.relays.filter(
      x =>
        x.whitelisted &&
        !this.disabledPools.some(disablePoolID => disablePoolID === x.id)
    );
  }

  get pendingRewards() {
    return vxm.rewards.balance.pendingRewards;
  }

  get actionButtonLabel() {
    if (this.amount) return i18n.t("stake_protect");
    return i18n.t("enter_amount");
  }

  get disableActionButton() {
    if (!this.amount) return true;
    else if (this.loading) return true;
    else return !!this.inputError;
  }

  get inputError() {
    if (this.amount == "") return "";

    const amount = new BigNumber(this.amount);

    if (this.pendingRewards.bnt.lt(amount))
      return i18n.t("insufficient_rewards_balance");
    if (amount.gt(this.maxStakeAmount))
      return i18n.t("insufficient_space_available");
    if (parseFloat(this.amount) === 0) return i18n.t("amount_not_zero");
    else return "";
  }

  openPoolSelectModal() {
    this.poolSelectModal = true;
  }

  async restakeRewards() {
    this.txMeta.txBusy = true;
    this.txMeta.showTxModal = true;

    try {
      this.txMeta.success = await vxm.rewards.stakeRewards({
        maxAmount: this.amount,
        poolId: this.pool.id,
        onUpdate: this.onUpdate
      });
      this.txMeta.showTxModal = false;
      addNotification({
        title: this.$tc("notifications.add.restake.title"),
        description: this.$tc("notifications.add.restake.description", 0, {
          amount: this.prettifyNumber(this.amount),
          pool: this.pool.name
        }),
        txHash: this.txMeta.success.txId
      });
    } catch (e) {
      this.txMeta.txError = e.message;
    } finally {
      this.txMeta.txBusy = false;
    }
  }

  async selectPool(id: string) {
    if (this.pool.id === id) return;

    await this.$router.replace({
      name: "RewardsRestake",
      params: { id }
    });

    await this.loadData();
  }

  async loadMaxStakes() {
    const result = await vxm.ethBancor.getMaxStakesView({
      poolId: this.pool.id
    });
    let stake = result.filter(x => x.token === this.token.symbol);
    if (stake.length === 1) {
      this.maxStakeAmount = stake[0].amount;
      this.maxStakeSymbol = stake[0].token;
    }
  }

  async loadData() {
    this.loading = true;
    try {
      await Promise.all([
        new Promise(r => setTimeout(r, 1000)),
        this.loadMaxStakes(),
        vxm.rewards.fetchAndSetPendingRewards(),
        this.pools.forEach(async x => {
          const disabledReserves = await vxm.ethBancor.fetchDisabledReserves(
            x.id
          );
          if (
            disabledReserves.some(reserveId =>
              compareString(reserveId, this.token.id)
            )
          )
            this.disabledPools.push(x.id);
        })
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  async mounted() {
    await this.loadData();
    this.interval = setInterval(async () => {
      await this.loadData();
    }, 30000);
  }

  destroyed() {
    clearInterval(this.interval);
  }
}
</script>

<style scoped lang="scss"></style>
