<template>
    <div>
    <b-table   
        fixed
        :items="items" 
        :fields="fields"
        responsive
        :filter="filter"
        :per-page="perPage"
        :current-page="currentPage"
    >  
        <template  v-slot:cell(Price_USD)="data">
            {{new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
            }).format(data.item.Price_USD)}}
        </template>
        <template  v-slot:cell(Liquidity_Depth)="data">
        {{new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
            }).format(data.item.Liquidity_Depth)}}
        </template>
        <template  v-slot:cell(Actions)="data">
            <table-action-buttons :token="data" />
        </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      hide-goto-end-buttons
      align="center"
      limit="1"
    >
        <template v-slot:prev-text>
            <font-awesome-icon
            icon="long-arrow-alt-left"
            :class="iconClass(disabled)"
            />
        </template>
        <template v-slot:next-text>
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
import { ViewToken } from "@/types/bancor";
import TableActionButtons from "@/components/common/TableActionButtons.vue";

@Component({
  components: {
    TableActionButtons
  }
})
export default class TableTokensNew extends Vue{
    @Prop() filter!: string;
    modifiedTokens: ViewToken[] = [];
    numeral = numeral;
    sortBy = "unixTime";
    sortDesc = true;
    perPage = 5;
    currentPage = 1;

    fields=['Name','24h Change','Price_USD','24h Volume','Liquidity_Depth','Actions'];

    get allTokens() {
        return vxm.bancor.tokens;
    }

    get totalRows() {
        return this.items.length;
    }

    get items(){
        const tokens = vxm.bancor.tokens;
        const filteredTokens = tokens.map((token: ViewToken, index: any) => {
            return {Name: token.name,
                    '24h Change':'N/A',
                    'Price_USD': token.price,
                    '24h Volume': '0.00',
                    'Liquidity_Depth':token.liqDepth, 
                    Actions: token
            }
        });

        return filteredTokens;
    }

    get darkMode() {
        return vxm.general.darkMode;
    }

    mounted(){
        console.log(vxm.bancor.tokens);
    }

    iconClass(disabled: boolean) {
    return disabled
      ? this.darkMode
        ? "text-muted-dark"
        : "text-muted-light"
      : "text-primary";
  }
}
</script>

<style lang="scss"></style>

