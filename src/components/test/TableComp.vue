<template>
  <div class="table-responsive">
    <div id="r2-1">dfd</div>
    <data-table   
      :items="items"
      :fields="fields"
      default-sort="to"
      :hide-pagination="true"
    >
      <template
        v-for="field in items"
        class="font-w500 font-size-14 aling-rows-cells"          
        >
        <tr
          :key="'r1-' + field.id"
          :id="'r1-' + field.id"
          class="align-rows-cells cursor"
        >
          <td>
            {{ field.id }}
          </td>
          <td style="width: 120px">
            {{ field.name }}
          </td>
          <td class="result">
            {{ field.result }}
          </td>
          <td>
            {{ field.totalVotesFor }}            
          </td>
          <td>            
            {{ field.totalVotesAgainst }}            
          </td>
          <td>
            <button @click="clickAction(field.id)">Click</button>
          </td>  
        </tr>            
        </template>      
    </data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";

import DataTable from "@/components/common/DataTable.vue";
import sort from "fast-sort";

interface ViewTableFields {
  label: string;
  key?: string;
  tooltip?: string;
  minWidth?: string;
  maxWidth?: string;
}

@Component({
  components: {
    DataTable
  }
})
export default class TableComp extends Vue {
  @Prop() private items!: any[];

  get fields(): ViewTableFields[] {
    return [
      {
        label: "ID",
        key: "id",
        minWidth: "16px",
        maxWidth: "16px"
      },
      {
        label: "Name",
        key: "name"
      },
      {
        label: "Result",
        key: "result",
        maxWidth: "120px",
        minWidth: "120px"
      },
      {
        label: "Total Votes for",
        key: "totalVotesFor",
        maxWidth: "140px",
        minWidth: "140px"
      },
      {
        label: "Total Votes against",
        key: "totalVotesAgainst",
        maxWidth: "140px",
        minWidth: "140px"
      }      
    ];    
  }

  @Emit("click")
  clickAction(id: number) {
    return id;
  }
}
</script>

<style lang="scss"></style>
