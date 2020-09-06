<template>
  <div>
    <b-table
      :dark="darkMode"
      :fields="fields"
      :items="getTx"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :filter="filter"
    >
      <template v-slot:cell(description)="data">
        <router-link to="/eth/swap">{{ data.value }}</router-link>
      </template>

      <template v-slot:cell(account)="data">
        <router-link to="/eth/swap">{{ data.value }}</router-link>
      </template>

      <template v-slot:cell()="data">
        <span>{{ data.value }}</span>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      hide-goto-end-buttons
      align="center"
      limit="3"
    >
      <template v-slot:prev-text="{ page, index, disabled }">
        <font-awesome-icon
          icon="long-arrow-alt-left"
          :class="iconClass(disabled)"
        />
      </template>
      <template v-slot:next-text="{ page, index, disabled }">
        <font-awesome-icon
          icon="long-arrow-alt-right"
          :class="iconClass(disabled)"
        />
      </template>
    </b-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import { ViewTableTxSwap } from "@/components/data/transactiontables/TableTransactions.vue";

@Component({
  components: {}
})
export default class TableTransactionsNew extends Vue {
  @Prop() filter!: string;
  @Prop() txType!: "all" | "swap" | "add" | "remove";

  sortBy = "time";
  sortDesc = false;

  perPage = 5;
  currentPage = 1;

  fields = [
    {
      key: "description",
      label: "Description",
      thStyle: { "min-width": "260px" },
      sortable: true
    },
    {
      key: "totalValue",
      label: "Total Value",
      thStyle: { "min-width": "180px" },
      sortable: true
    },
    {
      key: "tokenAmountFrom",
      label: "Amount From",
      thStyle: { "min-width": "200px" },
      sortable: true
    },
    {
      key: "tokenAmountTo",
      label: "Amount To",
      thStyle: { "min-width": "200px" },
      sortable: true
    },
    {
      key: "account",
      label: "Account",
      thStyle: { "min-width": "160px" },
      sortable: true
    },
    {
      key: "time",
      label: "Time",
      thStyle: { "min-width": "120px" },
      sortable: true
    }
  ];

  get totalRows() {
    return this.getTx.length;
  }

  iconClass(disabled: boolean) {
    return disabled
      ? this.darkMode
        ? "text-muted-dark"
        : "text-muted-light"
      : "text-primary";
  }

  get getTx() {
    switch (this.txType) {
      case "swap":
        return this.txSwap;
      case "add":
        return this.txAdd;
      case "remove":
        return this.txRemove;
      case "all":
        return this.txSwap.concat(this.txAdd).concat(this.txRemove);
      default:
        return [];
    }
  }

  get txSwap(): ViewTableTxSwap[] {
    return [
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        account: "0x9021…87ab",
        time: "1 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        account: "0x8021…86cb",
        time: "2 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 12345.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        account: "0x7024…86ab",
        time: "7 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        account: "0x6021…87ab",
        time: "2 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        account: "0x5421…86ab",
        time: "5 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 12345.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        account: "0x3224…86ab",
        time: "9 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        account: "0x1221…67ab",
        time: "7 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        account: "0x8021…16ab",
        time: "3 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 12345.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        account: "0x9024…26ab",
        time: "5 hours ago"
      }
    ];
  }

  get txAdd(): ViewTableTxSwap[] {
    return [
      {
        type: "add",
        description: "Add Liquidity to COMP V1",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 BNT",
        account: "0x9021…87af",
        time: "3 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to DAPP V2",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 DAPP",
        tokenAmountTo: "",
        account: "0x7721…86ab",
        time: "6 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to DAPP V2",
        totalValue: 12345.67,
        tokenAmountFrom: "1001.33345 DAPP",
        tokenAmountTo: "",
        account: "0x3324…86ab",
        time: "2 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to COMP V1",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 BNT",
        account: "0x9d21…87af",
        time: "3 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to DAPP V2",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 DAPP",
        tokenAmountTo: "",
        account: "0x7f21…86ab",
        time: "8 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to DAPP V2",
        totalValue: 12345.67,
        tokenAmountFrom: "1001.33345 DAPP",
        tokenAmountTo: "",
        account: "0x2s24…86ab",
        time: "2 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to COMP V1",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 BNT",
        account: "0x9j21…87af",
        time: "6 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to DAPP V2",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 DAPP",
        tokenAmountTo: "",
        account: "0x7h21…86ab",
        time: "4 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to DAPP V2",
        totalValue: 12345.67,
        tokenAmountFrom: "1001.33345 DAPP",
        tokenAmountTo: "",
        account: "0x3g24…86ab",
        time: "1 hours ago"
      }
    ];
  }

  get txRemove(): ViewTableTxSwap[] {
    return [
      {
        type: "remove",
        description: "Remove Liquidity from REN V2",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "",
        account: "0x9021…87ab",
        time: "4 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from LINK V1",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 LINK",
        tokenAmountTo: "46.88767 BNT",
        account: "0x8021…86ab",
        time: "3 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from BNB V2",
        totalValue: 765.67,
        tokenAmountFrom: "71.4456 BNB",
        tokenAmountTo: "",
        account: "0x9024…86ab",
        time: "4 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from REN V2",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "",
        account: "0x9s21…87ab",
        time: "8 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from LINK V1",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 LINK",
        tokenAmountTo: "46.88767 BNT",
        account: "0x8u21…86ab",
        time: "3 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from BNB V2",
        totalValue: 765.67,
        tokenAmountFrom: "71.4456 BNB",
        tokenAmountTo: "",
        account: "0x9k24…86ab",
        time: "6 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from REN V2",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "",
        account: "0x902g…87ab",
        time: "1 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from LINK V1",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 LINK",
        tokenAmountTo: "46.88767 BNT",
        account: "0x802s…86ab",
        time: "8 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from BNB V2",
        totalValue: 765.67,
        tokenAmountFrom: "71.4456 BNB",
        tokenAmountTo: "",
        account: "0x902d…86ab",
        time: "5 hours ago"
      }
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
