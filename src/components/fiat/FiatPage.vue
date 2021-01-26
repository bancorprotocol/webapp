<template>
  <b-row>
    <b-col class="col-12" sm="3" lg="2">
      Fiat
    </b-col>
    <b-col class="col-12" sm="9" lg="10">
      
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import BaseComponent from "@/components/BaseComponent.vue";

@Component({
  components: {
  }
})
export default class FiatPage extends BaseComponent {
  get isEth() {
    return this.$route.params.service === "eth";
  }

  async mounted() {
  }
}
</script>

<style lang="scss" scoped></style>
