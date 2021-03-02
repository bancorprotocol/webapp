<template>
  <content-block
    :no-header="true"
    :shadow-light="true"
    :px0="true">
    <b-row class="card-provider px-4 py-2">
      <b-col lg="2">
        <b-row>
          <img
            class="mt-4 mb-3 ml-3 mr-3"
            :src="require(`@/assets/media/logos/black-mp-logo.png`)"
          />
        </b-row>
      </b-col>
      <b-col lg="6">
        <div class="name-provider font-size-16 font-w500 mb-2">
          MoonPay
        </div>
        <b-row class="font-size-12 font-w600 ml-0 my-2" align-v="center">
          <div class="txt-available mr-1">availble operations: </div>
          <div class="fiat fiat__in mx-1" :class="darkMode ? 'text-body-light' : 'text-light'">fiat in</div>
          <div class="fiat fiat__out mx-1" :class="darkMode ? 'text-body-light' : 'text-light'">fiat out</div>
        </b-row>
        <div class="font-size-14 font-w400">
          MoonPay is a financial technology company that builds payments infrastructure for crypto. 
          Our on-and-off-ramp suite of products provides a seamless experience 
          for converting between fiat currencies and cryptocurrencies using all major payment methods.
        </div>
        <div class="mt-3 mb-2">
          <b-btn
            variant="primary"
            @click="buy"
            class="font-size-14 font-w500 px-5 py-2 mr-2"
            >Buy</b-btn>
          <b-btn
            variant="primary"
            @click="sell"
            class="font-size-14 font-w500 px-5 py-2 ml-2"
            >Sell</b-btn>
        </div>
      </b-col>
      <b-col lg="4" class="container-border">
        <div class="check-header font-size-12 font-w600 mt-2 mb-1">
          DEPOSIT METHODS:
        </div>
        <b-row class="check-list">
          <b-col>
            <div class="check-list__item"><font-awesome-icon icon="check-circle" /> Wire Transfer</div>
            <div class="check-list__item"><font-awesome-icon icon="check-circle" /> Credit Card</div>
            <div class="check-list__item"><font-awesome-icon icon="check-circle" /> Debit Card</div>
            <div class="check-list__item"><font-awesome-icon icon="check-circle" /> Apple Pay</div>
          </b-col>
          <b-col>
            <div class="check-list__item"><font-awesome-icon icon="check-circle" /> Google Pay</div>
            <div class="check-list__item"><font-awesome-icon icon="check-circle" /> Samsung Pay</div>
          </b-col>
        </b-row>
        <div class="check-header font-size-12 font-w600 mt-2 mb-1">
          JURISDICTIONS:
        </div>
        <b-row class="check-list">
          <b-col>
            <div class="check-list__item"><font-awesome-icon icon="check-circle" /> Global</div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </content-block>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/BaseComponent.vue";
import ContentBlock from "@/components/common/ContentBlock.vue";

@Component({
  components: {
    ContentBlock
  }
})
export default class GatewayProviders extends BaseComponent {

  buy() {
    window.open("https://buy.moonpay.com/?apiKey=pk_live_qiJRayRj9iKRUWCfaWX5Vo6Sn0rnNsj&currencyCode=ETH", "_blank");
  }

  sell() {
    window.open("https://sell.moonpay.com/?apiKey=pk_live_qiJRayRj9iKRUWCfaWX5Vo6Sn0rnNsj", "_blank");
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/_scss/custom/_variables";

.card-provider {
  .txt-available {
    text-transform: uppercase;
    color: #6E7E94;
    line-height: 15px;
  }

  .fiat {
    width: 70px;
    height: 24px;
    border-radius: 8px;
    background: #D5FFFF;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-align: center;

    &__in {
      background: #D5FFFF;
    }

    &__out {
      background: #E9F2FD;
    }
  }

  .check-header {
    text-transform: uppercase;
    line-height: 15px;
    color: #6E7E94;
  }

  .check-list {
    &__item {
      margin-bottom: 5px;
      margin-top: 5px;
      margin-left: 3px;
      font-weight: 500;
      font-size: 14px;
      line-height: 24px;
    }
  }

  .container-border {
    @media (min-width: 992px) {
      border-left: 1px solid $gray-border;
    }
  }
}

</style>
