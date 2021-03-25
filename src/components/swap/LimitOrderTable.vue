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
          <div class="d-flex mr-3">
            <div>
              <b-btn
                @click="openCancelModal(null)"
                size="sm"
                class="mr-2"
                :variant="darkMode ? 'outline-gray-dark' : 'outline-gray'"
              >
                Cancel all orders
              </b-btn>
            </div>

            <withdraw-weth />
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
        <template #cell(expiryTime)="{ value, item }">
          <span class="text-primary">
            {{ dayjs(value).format("DD/MM/YYYY") }}
          </span>
          <span class="ml-3 mr-2">
            {{ dayjs(value).format("h:mm:ss A") }}
          </span>
          <span v-b-popover.hover="$t('tooltip.order_expired')">
            <font-awesome-icon
              v-if="isExpired(item.status)"
              icon="comment-exclamation"
              class="text-danger"
            />
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

    <modal-cancel-order v-model="showCancelModal" :limit-order="itemToCancel" />
  </b-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import DataTable from "@/components/common/DataTable.vue";
import { ViewLimitOrder } from "@/store/modules/swap/ethBancor";
import { OrderStatus } from "@/api/observables/keeperDao";
import { ViewTableField } from "@/types/bancor";
import dayjs from "dayjs";
import { formatPercent } from "@/api/helpers";
import ModalCancelOrder from "@/components/modals/ModalCancelOrder.vue";
import MultiInputField from "@/components/common/MultiInputField.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import WithdrawWeth from "@/components/swap/WithdrawWeth.vue";

@Component({
  components: {
    WithdrawWeth,
    MultiInputField,
    ModalCancelOrder,
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
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          symbol: "BNT"
        },
        to: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/aea83e97-13a3-4fe7-b682-b2a82299cdf2.png",
          symbol: "ETH",
          id: "33",
          amount: "12.44"
        },
        orderHash: "12344555",
        id: "1",
        percentFilled: 0.6,
        status: OrderStatus.FILLABLE
      },
      {
        expiryTime: Date.now(),
        seller: "1234567",
        from: {
          id: "22",
          amount: "55.33333",
          logo:
            "https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/logos/bancor.png",
          symbol: "BNT"
        },
        to: {
          logo:
            "https://storage.googleapis.com/bancor-prod-file-store/images/communities/aea83e97-13a3-4fe7-b682-b2a82299cdf2.png",
          symbol: "ETH",
          id: "33",
          amount: "12.44"
        },
        orderHash: "12344555",
        id: "1",
        percentFilled: 0.6,
        status: OrderStatus.EXPIRED
      }
    ];
  }
  get orders() {
    return vxm.ethBancor.limitOrders;
  }

  get allOrderIds() {
    return this.orders.map(x => x.id);
  }

  isExpired(status: OrderStatus) {
    return status === OrderStatus.EXPIRED;
  }

  openCancelModal(item: ViewLimitOrder | null) {
    this.itemToCancel = item;
    this.showCancelModal = true;
  }
}
</script>
