<template>
  <b-row>
    <b-col lg="4">
      <img
        class="provider-icon"
        :src="require(`@/assets/media/logos/black-mp-logo.png`)"
      />
    </b-col>
    <b-col lg="4">
      <div class="font-size-12 font-w400">
        MoonPay
      </div>
      <div class="font-size-11 font-w300">
        AVAILABLE OPERATIONS: 
        <span>fiat in</span>
        <span>fiat out</span>
      </div>
      <div class="font-size-11 font-w400">
        MoonPay is a financial technology company that builds payments infrastructure for crypto. 
        Our on-and-off-ramp suite of products provides a seamless experience 
        for converting between fiat currencies and cryptocurrencies using all major payment methods.
      </div>
      <b-btn
        variant="primary"
        @click="click"
        class="font-size-14 font-w500 px-4"
        >Buy</b-btn>
      <b-btn
        variant="primary"
        @click="click"
        class="font-size-14 font-w500 px-4"
        >Sell</b-btn>
    </b-col>
    <b-col lg="4">
      <div class="font-size-11 font-w300">
        DEPOSIT METHODS:
      </div>
      <b-row>
        <b-col>
          <div>Wire Transfer</div>
          <div>Credit Card</div>
          <div>Debit Card</div>
          <div>Apple Pay</div>
        </b-col>
        <b-col>
          <div>Google Pay</div>
          <div>Samsung Pay</div>
        </b-col>
      </b-row>
      <div class="font-size-11 font-w300">
        JURISDICTIONS:
        <div>Global</div>
      </div>
    </b-col>
  </b-row>
</template>

<script lang="ts">

</script>
<style lang="scss"></style>
