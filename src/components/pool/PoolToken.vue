<template>
  <content-block
    :px0="true"
    :padding="false"
    :shadow-light="true"
    :title="$t('pool_tokens')"
    :search.sync="search"
  >
    <data-table
      :fields="fields"
      :items="items"
      :filter="search"
      :filter-functions="[filter]"
      :hidePagination="true"
    >
      <template #cell(relay)="{ value }">
        <pool-logos :pool="value" :cursor="false" />
      </template>

      <template #cell(smartTokenAmount)="{ value }">
        {{ prettifyNumber(value) }}
      </template>

      <template #cell(value)="{ item }">
        {{ prettifyNumber(item.value, true) }}
      </template>

      <template #cell(reserve_breakdown)="{ item }">
        <span>
          <img
            :key="item.relay.reserves[0].id"
            class="img-avatar img-avatar32 border-colouring bg-white mr-1"
            :src="item.relay.reserves[0].logo"
            :alt="$t('token_logo')"
          />
          {{ `${item.relay.reserves[0].symbol} ${prettifyNumber(item.bnt)} +` }}
          <img
            :key="item.relay.reserves[1].id"
            class="img-avatar img-avatar32 border-colouring bg-white mr-1 ml-1"
            :src="item.relay.reserves[1].logo"
            :alt="$t('token_logo')"
          />
          {{ `${item.relay.reserves[1].symbol} ${prettifyNumber(item.tkn)}` }}
        </span>
      </template>

      <template #cell(actions)="{ item }">
        <b-btn
          variant="primary"
          class="table-button mr-3"
          style="width: 100px; height: 40px"
          :disabled="poolDisabled(item)"
          @click="add(item.relay)"
        >
          {{ $t("add") }}
        </b-btn>

        <b-btn
          :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
          class="table-button mr-3"
          style="width: 100px; height: 40px"
          @click="remove(item.relay)"
        >
          {{ $t("remove") }}
        </b-btn>
      </template>
    </data-table>
  </content-block>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import { i18n } from "@/i18n";
import { PoolTokenPosition, ViewRelay, ViewTableField } from "@/types/bancor";
import DataTable from "@/components/common/DataTable.vue";
import PoolLogos from "@/components/common/PoolLogos.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
import BigNumber from "bignumber.js";

@Component({
  components: {
    DataTable,
    PoolLogos,
    ContentBlock
  }
})
export default class PoolToken extends BaseComponent {
  search = "";
  disabledPools: string[] = [];
  items: {
    bnt: BigNumber;
    tkn: BigNumber;
    relay: ViewRelay;
    smartTokenAmount?: string | undefined;
    value: string;
    poolTokens?:
      | {
          reserveId: string;
          balance: string;
        }[]
      | undefined;
    id: string;
  }[] = [];

  get fields(): ViewTableField[] {
    return [
      {
        id: 1,
        label: i18n.tc("name"),
        key: "relay",
        minWidth: "150px"
      },
      {
        id: 2,
        label: i18n.tc("amount"),
        key: "smartTokenAmount",
        minWidth: "150px"
      },
      {
        id: 3,
        label: i18n.tc("value"),
        key: "value",
        minWidth: "150px"
      },
      {
        id: 4,
        label: i18n.tc("reserve_breakdown"),
        key: "reserve_breakdown"
      },
      {
        id: 5,
        label: "",
        key: "actions",
        sortable: false,
        minWidth: "265px",
        maxWidth: "265px"
      }
    ];
  }

  filter(row: PoolTokenPosition) {
    const symbols = row.relay.reserves.map(reserve =>
      reserve.symbol.toLowerCase()
    );
    return symbols.some(symbol => symbol.includes(this.search.toLowerCase()));
  }

  add(pool: ViewRelay) {
    if (pool && pool.addProtectionSupported) {
      this.$router.push({
        name: "AddProtectionSingle",
        params: { id: pool!.id }
      });
    } else {
      this.$router.push({
        name: "PoolAction",
        params: { poolAction: "add", account: pool!.id }
      });
    }
  }

  remove(pool: ViewRelay) {
    this.$router.push({
      name: "PoolAction",
      params: {
        poolAction: "remove",
        account: pool.id
      }
    });
  }

  poolDisabled(item: PoolTokenPosition) {
    return this.disabledPools.some(x => x === item.relay.id);
  }

  async setDisabledReserves() {
    this.items.map(async pool => {
      const poolID = pool.relay.id;
      const disabledReserves = await vxm.ethBancor.fetchDisabledReserves(
        poolID
      );
      if (disabledReserves.length > 1) this.disabledPools.push(poolID);
    });
  }

  async getAllBalances() {
    return Promise.all(
      vxm.bancor.poolTokenPositions.map(async x => {
        const res = await vxm.bancor.getUserBalances(x.relay.id);
        let bnt, tkn;
        const res1 = res.maxWithdrawals[0];
        const res2 = res.maxWithdrawals[1];
        const tokenRes1 = vxm.bancor.token(res1.id);
        const tokenRes2 = vxm.bancor.token(res2.id);
        const res1Amount = new BigNumber(res1.amount);
        const res2Amount = new BigNumber(res2.amount);
        if (x.relay.reserves[0].id === res1.id) {
          bnt = res1Amount;
          tkn = res2Amount;
        } else {
          bnt = res2Amount;
          tkn = res1Amount;
        }
        const value =
          tokenRes1.price && tokenRes2.price
            ? res1Amount
                .times(tokenRes1.price)
                .plus(res2Amount.times(tokenRes2.price))
                .toString()
            : "";
        return {
          id: x.relay.id,
          ...x,
          bnt,
          tkn,
          value
        };
      })
    );
  }

  async mounted() {
    await this.setDisabledReserves();
    this.items = await this.getAllBalances();
  }
}
</script>

<style lang="scss"></style>
