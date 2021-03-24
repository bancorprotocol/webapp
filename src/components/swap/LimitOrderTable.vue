<template>
  <b-container fluid="xl">
    <content-block
      title="Active Orders"
      :px0="true"
      :shadow-light="true"
      :search.sync="search"
      class="mt-3"
    >
      <data-table
        :fields="fields"
        :items="mockOrders"
        :filter="search"
        default-sort="expiryTime"
      >
        <template #cell(expiryTime)="{ value }">
          <span class="text-primary">
            {{ dayjs(value).format("DD/MM/YYYY") }}
          </span>
          <span class="ml-3">
            {{ dayjs(value).format("h:mm:ss A") }}
          </span>
        </template>

        <template #cell(from)="{ value }">
          {{ prettifyNumber(value.amount) }}
        </template>

        <template #cell(to)="{ value }">
          {{ prettifyNumber(value.amount) }}
        </template>

        <template #cell(rate)="{ item }">
          1 TKN = {{ prettifyNumber(item.from.amount / item.to.amount) }}
        </template>

        <template #cell(percentFilled)="{ value }">
          <span class="text-primary">{{ formatPercent(value) }}</span>
        </template>

        <template #cell(cancel)="{ item }">
          <font-awesome-icon
            @click="openCancelModal(item)"
            :icon="['fas', 'times']"
            class="cursor"
          />
        </template>
      </data-table>
    </content-block>

    <modal-base v-model="showCancelModal" size="sm"> cancel </modal-base>
  </b-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import BaseComponent from "@/components/BaseComponent.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";
import DataTable from "@/components/common/DataTable.vue";
import { ViewLimitOrder } from "@/store/modules/swap/ethBancor";
import { OrderStatus } from "@/api/observables/keeperDao";
import { ViewTableField } from "@/types/bancor";
import dayjs from "dayjs";
import { formatPercent } from "@/api/helpers";
import ModalBase from "@/components/modals/ModalBase.vue";

@Component({
  components: { ModalBase, DataTable, ContentBlock }
})
export default class LimitOrderTable extends BaseComponent {
  search = "";
  showCancelModal = false;

  dayjs = dayjs;
  formatPercent = formatPercent;

  get fields(): ViewTableField[] {
    return [
      {
        id: 1,
        key: "expiryTime",
        label: "Expiration"
      },
      {
        id: 2,
        key: "from",
        label: "You pay"
      },
      {
        id: 3,
        key: "to",
        label: "You get"
      },
      {
        id: 4,
        key: "rate",
        label: "Rate"
      },
      {
        id: 5,
        key: "percentFilled",
        label: "Filled"
      },
      {
        id: 6,
        key: "cancel",
        label: "",
        maxWidth: "40px"
      }
    ];
  }

  get mockOrders(): ViewLimitOrder[] {
    return [
      {
        expiryTime: Date.now(),
        seller: "1234567",
        from: {
          id: "22",
          amount: "55.33333",
          logo: "",
          symbol: "BNT"
        },
        to: {
          logo: "",
          symbol: "ETH",
          id: "33",
          amount: "12.44"
        },
        orderHash: "12344555",
        id: "1",
        percentFilled: 0.6,
        status: OrderStatus.FILLABLE
      }
    ];
  }
  get orders() {
    return vxm.ethBancor.limitOrders;
  }

  openCancelModal(item: ViewLimitOrder) {
    this.showCancelModal = true;
  }
}
</script>
