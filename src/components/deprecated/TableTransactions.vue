<template>
  <data-table
    v-model="modifiedTransactions"
    :items="getTx"
    :fields="fields"
    :filter="filter"
    filter-by="description"
    default-sort="time"
    default-order="asc"
  >
    <tr
      v-for="tx in modifiedTransactions"
      :key="tx.tx"
      class="font-w500 font-size-14"
      :class="darkMode ? 'text-dark' : 'text-light'"
    >
      <td scope="row" class="text-primary">
        {{ tx.description }}
      </td>
      <td>${{ tx.totalValue }}</td>
      <td>{{ tx.tokenAmountFrom }}</td>
      <td>{{ tx.tokenAmountTo }}</td>
      <td class="text-primary">{{ tx.tx }}</td>
      <td>{{ tx.time }}</td>
    </tr>
  </data-table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { vxm } from "@/store";
import DataTable from "@/components/common/DataTable.vue";
import { ViewTableFields } from "@/components/common/TableHeader.vue";

export interface ViewTableTxSwap {
  type: "swap" | "add" | "remove";
  description: string;
  totalValue: number;
  tokenAmountFrom: string;
  tokenAmountTo: string;
  tx?: string;
  account?: string;
  time: string;
}
@Component({
  components: {
    DataTable
  }
})
export default class TableTransactions extends Vue {
  @Prop() filter!: string;
  @Prop() txType!: "all" | "swap" | "add" | "remove";

  modifiedTransactions: ViewTableTxSwap[] = [];

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
        tx: "0x9021…87ab",
        time: "1 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        tx: "0x8021…86cb",
        time: "2 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 12345.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        tx: "0x7024…86ab",
        time: "7 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        tx: "0x6021…87ab",
        time: "2 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        tx: "0x5421…86ab",
        time: "5 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 12345.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        tx: "0x3224…86ab",
        time: "9 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        tx: "0x1221…67ab",
        time: "7 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        tx: "0x8021…16ab",
        time: "3 hours ago"
      },
      {
        type: "swap",
        description: "Swap COMP for ETH",
        totalValue: 12345.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 ETH",
        tx: "0x9024…26ab",
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
        tx: "0x9021…87af",
        time: "3 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to DAPP V2",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 DAPP",
        tokenAmountTo: "",
        tx: "0x7721…86ab",
        time: "6 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to DAPP V2",
        totalValue: 12345.67,
        tokenAmountFrom: "1001.33345 DAPP",
        tokenAmountTo: "",
        tx: "0x3324…86ab",
        time: "2 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to COMP V1",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 BNT",
        tx: "0x9d21…87af",
        time: "3 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to DAPP V2",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 DAPP",
        tokenAmountTo: "",
        tx: "0x7f21…86ab",
        time: "8 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to DAPP V2",
        totalValue: 12345.67,
        tokenAmountFrom: "1001.33345 DAPP",
        tokenAmountTo: "",
        tx: "0x2s24…86ab",
        time: "2 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to COMP V1",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "46.88767 BNT",
        tx: "0x9j21…87af",
        time: "6 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to DAPP V2",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 DAPP",
        tokenAmountTo: "",
        tx: "0x7h21…86ab",
        time: "4 hours ago"
      },
      {
        type: "add",
        description: "Add Liquidity to DAPP V2",
        totalValue: 12345.67,
        tokenAmountFrom: "1001.33345 DAPP",
        tokenAmountTo: "",
        tx: "0x3g24…86ab",
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
        tx: "0x9021…87ab",
        time: "4 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from LINK V1",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 LINK",
        tokenAmountTo: "46.88767 BNT",
        tx: "0x8021…86ab",
        time: "3 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from BNB V2",
        totalValue: 765.67,
        tokenAmountFrom: "71.4456 BNB",
        tokenAmountTo: "",
        tx: "0x9024…86ab",
        time: "4 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from REN V2",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "",
        tx: "0x9s21…87ab",
        time: "8 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from LINK V1",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 LINK",
        tokenAmountTo: "46.88767 BNT",
        tx: "0x8u21…86ab",
        time: "3 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from BNB V2",
        totalValue: 765.67,
        tokenAmountFrom: "71.4456 BNB",
        tokenAmountTo: "",
        tx: "0x9k24…86ab",
        time: "6 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from REN V2",
        totalValue: 45.67,
        tokenAmountFrom: "1001.33345 COMP",
        tokenAmountTo: "",
        tx: "0x902g…87ab",
        time: "1 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from LINK V1",
        totalValue: 345.67,
        tokenAmountFrom: "1001.33345 LINK",
        tokenAmountTo: "46.88767 BNT",
        tx: "0x802s…86ab",
        time: "8 hours ago"
      },
      {
        type: "remove",
        description: "Remove Liquidity from BNB V2",
        totalValue: 765.67,
        tokenAmountFrom: "71.4456 BNB",
        tokenAmountTo: "",
        tx: "0x902d…86ab",
        time: "5 hours ago"
      }
    ];
  }

  get fields(): ViewTableFields[] {
    return [
      {
        label: "Description",
        key: "description"
      },
      {
        label: "Total Value",
        key: "totalValue"
        // minWidth: "160px"
      },
      {
        label: "Amount From",
        key: "tokenAmountFrom"
        // minWidth: "80px"
      },
      {
        label: "Amount To",
        key: "tokenAmountTo"
        // minWidth: "80px"
      },
      {
        label: "Transaction",
        key: "tx"
        // minWidth: "310px",
        // maxWidth: "310px"
      },
      {
        label: "Time",
        key: "time"
        // minWidth: "80px"
      }
    ];
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style lang="scss"></style>
