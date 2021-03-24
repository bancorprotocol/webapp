<template>
  <b-container fluid="xl">
    <content-block
      :no-header="true"
      :px0="true"
      :shadow-light="true"
      :padding="false"
      class="mt-3"
    >
      <div class="d-flex justify-content-between py-2 px-3">
        <h3 class="m-0 p-0 my-2 font-size-14 font-w600">Limit Orders</h3>

        <div class="d-flex">
          <div class="mr-3">
            <b-btn
              @click="cancelAll"
              size="sm"
              class="mr-2"
              :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
            >
              Cancel all orders
            </b-btn>
            <b-btn
              @click="withdrawWeth"
              :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
              size="sm"
            >
              Withdraw WETH
            </b-btn>
          </div>

          <multi-input-field
            v-model="search"
            :clear="true"
            placeholder="Search"
            prepend="search"
          />
        </div>
      </div>
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
          <img
            class="img-avatar img-avatar32 bg-white logo-shadow mr-2"
            :src="value.logo"
            :alt="value.symbol"
          />
          {{ `${prettifyNumber(value.amount)} ${value.symbol}` }}
        </template>

        <template #cell(to)="{ value }">
          <img
            class="img-avatar img-avatar32 bg-white logo-shadow mr-2"
            :src="value.logo"
            :alt="value.symbol"
          />
          {{ `${prettifyNumber(value.amount)} ${value.symbol}` }}
        </template>

        <template #cell(rate)="{ item }">
          {{
            ` 1 ${item.from.symbol} = ${prettifyNumber(
              item.to.amount / item.from.amount
            )} ${item.to.symbol}`
          }}
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

    <modal-cancel-order
      v-model="showCancelModal"
      :limit-order="itemToCancel"
      @onHide="itemToCancel = null"
    />
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
import ModalCancelOrder from "@/components/modals/ModalCancelOrder.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";

@Component({
  components: {
    MultiInputField,
    ModalCancelOrder,
    ModalBase,
    DataTable,
    ContentBlock
  }
})
export default class LimitOrderTable extends BaseComponent {
  search = "";
  showCancelModal = false;
  itemToCancel: ViewLimitOrder | null = null;

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

  get allOrderIds() {
    return this.orders.map(x => x.id);
  }

  async cancelAll() {
    try {
      // await vxm.ethBancor.cancelOrder(this.allOrderIds);
    } catch (e) {
      console.error("failed to cancel all limit orders", e);
    }
  }

  async withdrawWeth() {
    try {
      // await vxm.ethBancor.withdrawWeth({});
    } catch (e) {
      console.error("failed to withdraw weth", e);
    }
  }

  openCancelModal(item: ViewLimitOrder) {
    this.itemToCancel = item;
    this.showCancelModal = true;
  }
}
</script>
