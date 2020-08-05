<template>
  <div class="mt-3">
    <label-content-split label="Your Liquidity" />
    <div v-if="positions.length">
      <div v-for="(pool, index) in positions" :key="pool.id" class="mt-2 mb-1">
        <main-button
          v-b-toggle="'collapse-' + `${index}`"
          :label="getPoolLabel(pool.relay.reserves)"
        />
        <b-collapse :id="'collapse-' + index" accordion="liquidityPools">
          <div class="my-3">
            <label-content-split
              v-if="!pool.relay.v2"
              label="Pool Token Balance"
              :value="formattedBalance(pool.smartTokenAmount.toString())"
            />
            <div v-else-if="pool.poolTokens">
              <label-content-split
                v-for="token in pool.poolTokens"
                :key="token.reserveId"
                :label="`Pool Token: `"
                :value="formattedBalance(token.balance.toString())"
              />
            </div>
          </div>
          <b-row>
            <b-col cols="6" class="pr-1">
              <main-button
                @click.native="goToAdd(pool.relay)"
                label="Add Liquidity"
                :active="true"
              />
            </b-col>
            <b-col cols="6" class="pl-1">
              <main-button
                @click.native="goToRemove(pool.relay)"
                label="Remove Liquidity"
              />
            </b-col>
          </b-row>
        </b-collapse>
      </div>
    </div>
    <div v-else class="font-size-14 font-w600 mt-3 text-center">
      <span>{{
        isAuthenticated
          ? "You dont have any Liquidity yet"
          : "Connect Wallet to see your Liquidity"
      }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import LabelContentSplit from "@/components/common-v2/LabelContentSplit.vue";
import { PoolTokenPosition, ViewRelay, ViewReserve } from "@/types/bancor";
import MainButton from "@/components/common/Button.vue";
import numeral from "numeral";

@Component({
  components: { LabelContentSplit, MainButton }
})
export default class YourLiquidity extends Vue {
  get positions(): PoolTokenPosition[] {
    return vxm.bancor.poolTokenPositions;
  }

  get isAuthenticated() {
    return vxm.wallet.isAuthenticated;
  }

  formattedBalance(amount: string) {
    const balance = parseFloat(amount);
    if (!balance || balance === 0) return "0";
    else if (balance < 0.000001) return "< 0.000001";
    else if (balance > 1000) return "~" + numeral(balance).format("0,0.0000");
    else return "~" + numeral(balance).format("0,0.000000");
  }

  getPoolLabel(reserves: ViewReserve[]) {
    return `${reserves[0].symbol}/${reserves[1].symbol}`;
  }

  goToAdd(pool: ViewRelay) {
    this.$router.push({
      name: "PoolAction",
      params: {
        poolAction: "add",
        account: pool.id
      }
    });
  }

  goToRemove(pool: ViewRelay) {
    this.$router.push({
      name: "PoolAction",
      params: {
        poolAction: "remove",
        account: pool.id
      }
    });
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
