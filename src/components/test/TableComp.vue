<template>
  <div class="table-responsive">
    <data-table   
      :items="proposals"
      :fields="fields"
      default-sort="to"
      :hide-pagination="true"
    >
      <template
        v-for="field in fields"
        class="font-w500 font-size-14 aling-rows-cells"          
        >
        <tr
          :key="'r1-' + field.id"
          class="align-rows-cells cursor"
        >
          <td>
            {{ field.id }}
          </td>
          <td class="font-size-14 font-w500">
            {{ field.name }}
          </td>
          <td
          class="result"                
          >
            Approved
          </td>
          <td>
            {{ field.totalVotesFor }}            
          </td>
          <td>            
            {{ field.totalVotesAgainst }}            
          </td>                        
        </tr>            
        </template>      
    </data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import {
  ViewTableFields
} from "@/components/common/TableHeader.vue";
import DataTable from "@/components/deprecated/DataTable.vue";
import { VModel } from "@/api/helpers";
import sort from "fast-sort";

@Component({
  components: {
    DataTable
  }
})
export default class TableComp extends Vue {
  get fields(): ViewTableFields[] {
    return [
      {
        label: "ID",
        key: "id",
        minWidth: "16px",
        maxWidth: "16px"
      },
      {
        label: "Details",
        key: ""
      },
      {
        label: "Result",
        key: "",
        maxWidth: "120px",
        minWidth: "120px"
      },
      {
        label: "Votes for",
        key: "votesFor",
        maxWidth: "140px",
        minWidth: "140px"
      },
      {
        label: "Votes against",
        key: "votesAgainst",
        maxWidth: "140px",
        minWidth: "140px"
      },
      {
        label: "Vote start",
        key: "startDate",
        maxWidth: "120px",
        minWidth: "120px"
      },
      {
        label: "",
        key: "",
        maxWidth: "10px"
      }
    ];
  }
}
</script>

<style lang="scss"></style>
