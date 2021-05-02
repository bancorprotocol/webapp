<template>
  <div class="mt-3">
    <b-row>
      <b-col
        cols="12"
        class="d-flex align-items-center justify-content-between"
      >
        <span
          class="font-size-12 font-w500"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          {{ $t("your_liquidity") }}
        </span>
        <router-link :to="{ name: 'Portfolio' }" class="font-size-12 font-w500">
          {{ $t("view_protected_tokens") }}
        </router-link>
      </b-col>
      <b-col cols="12">
        <multi-input-field
          v-model="search"
          :clear="true"
          :placeholder="$t('search')"
          prepend="search"
          class="my-2"
        />
      </b-col>
    </b-row>

    <div v-if="positions.length">
      <div v-for="(pool, index) in positions" :key="pool.id" class="mt-2 mb-1">
        <gray-border-block v-b-toggle="'collapse-' + `${index}`">
          <div class="d-flex justify-content-between align-items-center">
            <pool-logos :pool="pool.relay" />
            <div>
              <font-awesome-icon
                icon="caret-down"
                :class="darkMode ? 'text-white' : 'text-primary'"
              />
            </div>
          </div>
        </gray-border-block>
        <b-collapse :id="'collapse-' + index" accordion="liquidityPools">
          <div class="my-3">
            <label-content-split
              v-if="!pool.relay.v2"
              :label="$t('pool_token_balance')"
              :value="formattedBalance(pool.smartTokenAmount.toString())"
            />
            <div v-else-if="pool.poolTokens">
              <label-content-split
                v-for="token in pool.poolTokens"
                :key="token.reserveId"
                :label="`${$t('pool_token')}: `"
                :value="formattedBalance(token.balance.toString())"
              />
            </div>
          </div>
          <b-row>
            <b-col cols="6" class="pr-1">
              <main-button
                @click="goToAdd(pool.relay.id)"
                :label="$t('add_liquidity')"
                :active="true"
              />
            </b-col>
            <b-col cols="6" class="pl-1">
              <main-button
                @click="goToRemove(pool.relay.id)"
                :label="$t('remove_liquidity')"
              />
            </b-col>
          </b-row>
        </b-collapse>
      </div>
    </div>
    <div v-else class="font-size-14 font-w600 mt-3 text-center">
      <span>{{ noLiquidityFoundMsg }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import LabelContentSplit from "@/components/common/LabelContentSplit.vue";
import { PoolTokenPosition, ViewReserve } from "@/types/bancor";
import MainButton from "@/components/common/Button.vue";
import { formatNumber } from "@/api/helpers";
import MultiInputField from "@/components/common/MultiInputField.vue";
import GrayBorderBlock from "@/components/common/GrayBorderBlock.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
    PoolLogos,
    GrayBorderBlock,
    MultiInputField,
    LabelContentSplit,
    MainButton
  }
})
export default class YourLiquidity extends BaseComponent {
  search = "";

  get positions(): PoolTokenPosition[] {
    return vxm.bancor.poolTokenPositions.filter((x: PoolTokenPosition) =>
      this.getPoolLabel(x.relay.reserves).includes(this.search.toUpperCase())
    );
  }

  get noLiquidityFoundMsg() {
    if (!this.currentUser) return i18n.t("connect_wallet_liq");
    return `${
      this.search ? i18n.t("no_res_found") : i18n.t("no_liquidity_yet")
    }.`;
  }

  formattedBalance(amount: string) {
    return formatNumber(parseFloat(amount), 6);
  }

  getPoolLabel(reserves: ViewReserve[]) {
    return `${reserves[0].symbol}/${reserves[1].symbol}`;
  }

  goToAdd(id: string) {
    const { whitelisted, v2 } = vxm.bancor.relay(id);
    if (whitelisted && !v2) {
      this.$router.push({
        name: "PoolAdd",
        params: { id }
      });
    } else {
      this.$router.push({
        name: "PoolAction",
        params: {
          poolAction: "add",
          account: id
        }
      });
    }
  }

  goToRemove(id: string) {
    this.$router.push({
      name: "PoolAction",
      params: {
        poolAction: "remove",
        account: id
      }
    });
  }
}
</script>

<style scoped lang="scss"></style>
