<template>
  <b-container fluid="xl" class="px-xl-0">
    <h3>TestBoard</h3>
    <simple-comp-with-vuex />
    <simple-comp />
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SimpleCompWithVuex from "@/components/test/SimpleCompWithVuex.vue";
import SimpleComp from "@/components/test/SimpleComp.vue";

@Component({
  components: {
    SimpleCompWithVuex,
    SimpleComp
  }
})
export default class TestBoard extends Vue {
  
}
</script>

<style lang="scss"></style>
