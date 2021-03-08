<template>
  <content-block
    :px0="true"
    :shadow-light="true"
    :title="$t('pool_tokens')"
    :search.sync="search"
  >
    <data-table
      :fields="fields"
      :items="items"
      :filter="search"
      :filterFunction="filter"
      :hidePagination="true"
    >
      <template #cell(relay)="{ value }">
        <pool-logos :pool="value" :cursor="false" />
      </template>

      <template #cell(smartTokenAmount)="{ value }">
        {{ prettifyNumber(value) }}
      </template>

      <template #cell(value)="{ item }">
        {{ prettifyNumber(item.smartTokenAmount * 2, true) }}
      </template>

      <template #cell(reserve_breakdown)="{ item }">
        <span>
          <img
            :key="item.relay.reserves[0].id"
            class="img-avatar img-avatar32 border-colouring bg-white mr-1"
            :src="item.relay.reserves[0].logo"
            :alt="$t('token_logo')"
          />
          {{
            `${item.relay.reserves[0].symbol} ${prettifyNumber(
              item.relay.reserves[0].reserveWeight * item.smartTokenAmount
            )} +`
          }}
          <img
            :key="item.relay.reserves[1].id"
            class="img-avatar img-avatar32 border-colouring bg-white mr-1 ml-1"
            :src="item.relay.reserves[1].logo"
            :alt="$t('token_logo')"
          />
          {{
            `${item.relay.reserves[1].symbol} ${prettifyNumber(
              item.relay.reserves[1].reserveWeight * item.smartTokenAmount
            )}`
          }}
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

  get items() {
    return vxm.bancor.poolTokenPositions.map(x => {
      return { id: x.relay.id, ...x };
    });
  }

  get fields(): ViewTableField[] {
    return [
      {
        id: 1,
        label: i18n.tc("name"),
        key: "relay",
        minWidth: "170px"
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
        key: "reserve_breakdown",
        minWidth: "395px",
        maxWidth: "395px"
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

  filter(row: PoolTokenPosition, filter: string) {
    const symbols = row.relay.reserves.map(reserve =>
      reserve.symbol.toLowerCase()
    );
    return symbols.some(symbol => symbol.includes(filter.toLowerCase()));
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

  async mounted() {
    await this.setDisabledReserves();
  }
}
</script>

<style lang="scss"></style>
