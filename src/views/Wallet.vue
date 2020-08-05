<template>
  <div>
    <hero-wallet account="" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeroWallet from "@/components/hero/HeroWallet.vue";

const numeral = require("numeral");

@Component({
  components: {
    HeroWallet
  }
})
export default class Wallet extends Vue {}
</script>

<style scoped lang="scss"></style>
