<template>
  <div>
    <content-block
      v-for="p in fiatProviders"
      :key="p.id"
      :no-header="true"
      :shadow-light="true"
      :px0="true"
    >
      <b-row class="card-provider px-4 py-2">
        <b-col lg="2">
          <b-row>
            <img
              class="mt-4 mb-3 ml-3 mr-3"
              :src="
                darkMode && p.logoDark
                  ? require(`@/assets/media/logos/${p.logoDark}`)
                  : require(`@/assets/media/logos/${p.logo}`)
              "
              width="135"
            />
          </b-row>
        </b-col>
        <b-col lg="6">
          <div class="name-provider font-size-16 font-w500 mb-2">
            {{ p.name }}
          </div>
          <b-row class="font-size-12 font-w600 ml-0 my-2" align-v="center">
            <div class="txt-available mr-1">available operations:</div>
            <div
              v-if="p.buyUrl"
              class="fiat fiat__in mx-1"
              :class="darkMode ? 'text-body-light' : 'text-light'"
            >
              fiat in
            </div>
            <div
              v-if="p.sellUrl"
              class="fiat fiat__out mx-1"
              :class="darkMode ? 'text-body-light' : 'text-light'"
            >
              fiat out
            </div>
          </b-row>
          <div class="font-size-14 font-w400">
            {{ p.description }}
          </div>
          <div class="mt-3 mb-2">
            <b-btn
              v-if="p.buyUrl"
              variant="primary"
              :href="p.buyUrl"
              target="_blank"
              class="font-size-14 font-w500 px-5 py-2 mr-2"
              >Buy
            </b-btn>
            <b-btn
              v-if="p.sellUrl"
              variant="primary"
              :href="p.sellUrl"
              target="_blank"
              class="font-size-14 font-w500 px-5 py-2 ml-2"
              >Sell
            </b-btn>
          </div>
        </b-col>
        <b-col lg="4" class="container-border">
          <div class="check-header font-size-12 font-w600 mt-2 mb-1">
            DEPOSIT METHODS:
          </div>
          <b-row class="check-list">
            <b-col cols="6" v-for="method in p.depositMethods" :key="method">
              <div class="check-list__item">
                <font-awesome-icon icon="check-circle" />
                {{ method }}
              </div>
            </b-col>
          </b-row>
          <div class="check-header font-size-12 font-w600 mt-2 mb-1">
            JURISDICTIONS:
          </div>
          <b-row class="check-list">
            <b-col
              cols="6"
              v-for="jurisdiction in p.jurisdictions"
              :key="jurisdiction"
            >
              <div class="check-list__item">
                <font-awesome-icon icon="check-circle" />
                {{ jurisdiction }}
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </content-block>
  </div>
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
  get fiatProviders() {
    return [
      {
        id: 1,
        name: "MoonPay",
        logo: "moonpay.svg",
        logoDark: "moonpay-dark.svg",
        description:
          "MoonPay is a financial technology company that builds payments infrastructure for crypto. Our on-and-off-ramp suite of products provides a seamless experience for converting between fiat currencies and cryptocurrencies using all major payment methods.",
        jurisdictions: ["Global"],
        depositMethods: [
          "Wire Transfer",
          "Credit Card",
          "Debit Card",
          "Apple Pay",
          "Google Pay",
          "Samsung Pay"
        ],
        buyUrl:
          "https://buy.moonpay.com/?apiKey=pk_live_qiJRayRj9iKRUWCfaWX5Vo6Sn0rnNsj&defaultCurrencyCode=ETH",
        sellUrl:
          "https://sell.moonpay.com/?apiKey=pk_live_qiJRayRj9iKRUWCfaWX5Vo6Sn0rnNsj&defaultCurrencyCode=ETH"
      },
      {
        id: 2,
        name: "BANXA",
        logo: "banxa.svg",
        logoDark: "banxa-dark.svg",
        description:
          "Banxa is a globally operating fiat-to-crypto on-ramp providing the easiest way for anyone looking to enter the digital asset ecosystem. Banxa users can choose from a variety of the most popular and convenient payment methods.",
        jurisdictions: ["Global"],
        depositMethods: [
          "Credit Card",
          "Debit Card",
          "Apple Pay",
          "iDeal",
          "Interac",
          "SEPA"
        ],
        buyUrl: "https://pay.banxa.com"
      },
      {
        id: 3,
        name: "Simplex",
        logo: "simplex.svg",
        logoDark: "simplex-dark.svg",
        description:
          "Simplex is the industry leader, providing global on/off ramps to the entire fiat to crypto ecosystem. Working with a vast network of partners, Simplex ensures that crypto is safe and accessible to all.",
        jurisdictions: ["Global"],
        depositMethods: [
          "Wire Transfer",
          "Credit Card",
          "Debit Card",
          "Apple Pay"
        ],
        buyUrl: "https://b.buy-crypto-with-simplex.com/?crypto=ETH",
        sellUrl:
          "https://www.simplex.com/account/sell?ref=b1990d7be52dfae9fa894a0d56317f28"
      },
      {
        id: 4,
        name: "Ramp Network",
        logo: "ramp.svg",
        logoDark: "ramp-dark.svg",
        description:
          "Ramp Network provides the ultimate crypto on-boarding flow. This globally accessible product focuses on excellent UX, supports multiple payment options and ensures lowest slippage and transactional fees.",
        jurisdictions: ["Global"],
        depositMethods: [
          "Open Banking",
          "SEPA Instant",
          "Faster Payments",
          "Debit Card",
          "Credit Card",
          "Apple Pay"
        ],
        buyUrl: `https://buy.ramp.network/?hostApiKey=qg4s4spwnm7nahqdxfsjyzsjvtxbbzg8dxnxxrum${
          this.currentUser ? `&userAddress=${this.currentUser}` : ""
        }`
      },
      {
        id: 5,
        name: "Mercuryo",
        logo: "mercuryo.svg",
        logoDark: "mercuryo-dark.svg",
        description:
          "Mercuryo is a cross-boarder payment network providing global access to fast and cheap money transfers. Working together with industry leaders, Mercuryo offers a multi-currency widget that allows purchasing and selling crypto securely with the lowest fees.",
        jurisdictions: ["Global"],
        depositMethods: [
          "Credit Card",
          "Debit Card",
          "Apple Pay",
          "Google Pay"
        ],
        buyUrl:
          "https://exchange.mercuryo.io/?widget_id=d7702dc1-c8ee-4726-a5be-5f18e31849b6&currency=ETH&type=buy",
        sellUrl:
          "https://exchange.mercuryo.io/?widget_id=d7702dc1-c8ee-4726-a5be-5f18e31849b6&currency=ETH&type=sell"
      }
    ];
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/_scss/custom/_variables";

.card-provider {
  .txt-available {
    text-transform: uppercase;
    color: #6e7e94;
    line-height: 15px;
  }

  .fiat {
    width: 70px;
    height: 24px;
    border-radius: 8px;
    background: #d5ffff;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-align: center;

    &__in {
      background: #d5ffff;
    }

    &__out {
      background: #e9f2fd;
    }
  }

  .check-header {
    text-transform: uppercase;
    line-height: 15px;
    color: #6e7e94;
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
