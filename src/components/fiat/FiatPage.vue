<template>
  <b-row>
    <b-col cols="12">
      <div>
        <span
          class="font-size-20 font-w600"
          :class="darkMode ? 'text-dark' : 'text-light'"
        >
          {{ `Crypto \<> Fiat Gateway Providers` }}
        </span>
      </div>

      <p
        class="font-size-14 font-w400 my-3"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        Below is a list of popular crypto<>fiat gateways that can be used to buy
        or sell crypto with a credit card, bank transfer & more.
      </p>
    </b-col>

    <b-col cols="12">
      <alert-block class="my-2">
        Crypto<>fiat gateway services on Bancor are provided by third-parties.
        Bancor is not associated with, responsible or liable for the performance
        of these third-party services. Any claims and questions should be
        addressed with the selected provider directly.
      </alert-block>
    </b-col>

    <b-col cols="12">
      <gateway-providers class="mx-0 my-2" />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import BaseComponent from "@/components/BaseComponent.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import GatewayProviders from "@/components/fiat/GatewayProviders.vue";

@Component({
  components: {
    AlertBlock,
    GatewayProviders
  }
})
export default class FiatPage extends BaseComponent {
  get isEth() {
    return this.$route.params.service === "eth";
  }

  async mounted() {}
}
</script>

<style lang="scss" scoped></style>
