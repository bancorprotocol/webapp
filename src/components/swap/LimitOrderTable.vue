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
        <h3
          class="m-0 p-0 my-2 font-size-16 font-w600"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          Limit Orders
        </h3>

        <div class="d-flex">
          <div class="d-flex mr-3">
            <cancel-limit-order ref="cancelModal" />

            <withdraw-weth class="ml-2" />
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
        :items="orders"
        :filter="search"
        default-sort="expiryTime"
      >
        <template #cell(expiryTime)="{ value, item }">
          <span :class="darkMode ? 'text-primary-dark' : 'text-primary-light'">
            {{ dayjs.unix(value).format("DD/MM/YYYY") }}
          </span>
          <span class="ml-3 mr-2">
            {{ dayjs.unix(value).format("h:mm:ss A") }}
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
          <span
            :class="darkMode ? 'text-primary-dark' : 'text-primary-light'"
            >{{ formatPercent(value) }}</span
          >
        </template>

        <template #cell(cancel)="{ item }">
          <font-awesome-icon
            @click="setItemToCancel(item)"
            :icon="['fas', 'times']"
            class="cursor"
          />
        </template>
      </data-table>
    </content-block>
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
import MultiInputField from "@/components/common/MultiInputField.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import WithdrawWeth from "@/components/swap/WithdrawWeth.vue";
import CancelLimitOrder from "@/components/swap/CancelLimitOrder.vue";
import Vue from "vue";

@Component({
  components: {
    CancelLimitOrder,
    WithdrawWeth,
    MultiInputField,
    DataTable,
    ContentBlock
  }
})
export default class LimitOrderTable extends BaseComponent {
  search = "";

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

  get orders() {
    return vxm.ethBancor.limitOrders;
  }

  isExpired(status: OrderStatus) {
    return status === OrderStatus.EXPIRED;
  }

  setItemToCancel(item: ViewLimitOrder) {
    (this.$refs.cancelModal as Vue & {
      cancelById: (item: ViewLimitOrder) => void;
    }).cancelById(item);
  }
}
</script>
