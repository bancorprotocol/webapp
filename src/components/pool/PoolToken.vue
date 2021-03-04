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
      :hidePagination="true"
    >
      <template #cell(name)="{ value }">
        <pool-logos :pool="value" :cursor="false" />
      </template>

      <template #cell(amount)="{ value }">
        {{ prettifyNumber(value) }}
      </template>

      <template #cell(value)="{ value }">
        {{ prettifyNumber(value, true) }}
      </template>

      <template #cell(reserve_breakdown)="{ value }">
        {{ prettifyNumber(value) }}
      </template>

      <template #cell(actions)="{}">
        <b-btn variant="primary" class="table-button mr-3">
          {{ $t("protect") }}
        </b-btn>

        <b-btn
          :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
          class="table-button mr-3"
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
import { ViewTableField } from "@/types/bancor";
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

  get items() {
    return vxm.bancor.poolTokenPositions;
  }

  get fields(): ViewTableField[] {
    return [
      {
        id: 1,
        label: i18n.tc("name"),
        key: "name",
        minWidth: "170px"
      },
      {
        id: 2,
        label: i18n.tc("amount"),
        key: "amount",
        minWidth: "200px"
      },
      {
        id: 3,
        label: i18n.tc("value"),
        key: "value",
        minWidth: "200px"
      },
      {
        id: 4,
        label: i18n.tc("reserve_breakdown"),
        key: "reserve_breakdown",
        minWidth: "80px"
      },
      {
        id: 5,
        label: "",
        key: "actions",
        sortable: false,
        minWidth: "350px",
        maxWidth: "350px"
      }
    ];
  }
}
</script>

<style lang="scss"></style>
