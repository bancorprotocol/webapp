<template>
  <b-row>
    <b-col cols="12">
      <div>
        <span
          class="font-size-20 font-w600"
          :class="darkMode ? 'text-dark' : 'text-light'"
         >
          Crypto/Fiat gateway providers
        </span>
      </div>

      <p
        class="font-size-14 font-w400 my-3"
        :class="darkMode ? 'text-dark' : 'text-light'"
      >
        Here is a list of popular crypto/fiat gateways that can be used to buy crypto with credit card,  
        wire transfer, and more. Some also offer crypto to fiat off-ramp solutions.
      </p>
    </b-col>

    <b-col cols="12">
      <alert-block
        class="my-2"
      >
        Disclaimer: The services are provided by the different service providers as is. 
        Bancor is not associated, responsible or liable to the performance of the services. 
        Any claims and questions, should be addressed with the selected partner directly.
      </alert-block>  
    </b-col>

    <b-col cols="12">
      <gateway-providers />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { vxm } from "@/store";
import BaseComponent from "@/components/BaseComponent.vue";
import AlertBlock from "@/components/common/AlertBlock.vue";
import GatewayProviders from "@/components/fiat/GatewayProviders"

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

  async mounted() {
  }
}
</script>

<style lang="scss" scoped></style>
