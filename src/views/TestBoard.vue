<template>
  <b-container fluid="xl" class="px-xl-0">
    <h3>TestBoard</h3>
    <simple-comp-with-vuex />
    <simple-comp />
    <table-comp />
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SimpleCompWithVuex from "@/components/test/SimpleCompWithVuex.vue";
import SimpleComp from "@/components/test/SimpleComp.vue";
import TableComp from "@/components/test/TableComp.vue";

@Component({
  components: {
    SimpleCompWithVuex,
    SimpleComp,
    TableComp
  }
})
export default class TestBoard extends Vue {
  
}
</script>

<style lang="scss"></style>
