import Vue from "vue";
import * as Sentry from "@sentry/browser";
import { Vue as VueIntegration } from "@sentry/integrations";
import { Integrations } from "@sentry/tracing";
import App from "./App.vue";
import { router } from "./router";
import { store, vxm } from "./store/";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@/assets/_scss/main.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, fab } from "@/assets/icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { sync } from "vuex-router-sync";
import { firebase } from "@firebase/app";
import "@firebase/analytics";
import VueGtag from "vue-gtag-next";

const appVersion = JSON.parse(
  unescape(escape(JSON.stringify(require("../package.json"))))
).version;

// todo fix sentry on vue 3
/*
const isDev = process.env.NODE_ENV == "development";
!isDev &&
  Sentry.init({
    dsn:
      "https://fc7323571bfc4b8c8aa158e071a9b907@o465012.ingest.sentry.io/5476475",
    debug: isDev,
    environment: isDev ? "development" : "prod/staging",
    release: `swap-${appVersion}`,
    integrations: [
      new VueIntegration({
        Vue,
        tracing: true,
        tracingOptions: {
          trackComponents: false
        }
      }),
      new Integrations.BrowserTracing()
    ],
    sampleRate: 0.1,
    tracesSampleRate: 0.1
  });
*/

const app = Vue.createApp({
  router,
  store,
  // i18n,
  render: (h: any) => h(App)
})

app.use(router);

const firebaseConfig = {
  apiKey: "AIzaSyD4yWnTGa6qj6dR1RLW6Clod0iMn4niflU",
  authDomain: "bancor-v2.firebaseapp.com",
  databaseURL: "https://bancor-v2.firebaseio.com",
  projectId: "bancor-v2",
  storageBucket: "bancor-v2.appspot.com",
  messagingSenderId: "110441058637",
  appId: "1:110441058637:web:72d14dee900e63f6f2a704",
  measurementId: "G-VW13H4KTX3"
};

firebase.initializeApp(firebaseConfig);

app.use(
  VueGtag,
  {
    config: { id: "UA-174155472-1" }
  },
  router
);

app.use(BootstrapVue);

library.add(...fas, ...fab);

app.component("FontAwesomeIcon", FontAwesomeIcon);

sync(store, router, { moduleName: "routeModule" });

app.mixin({
  methods: {
    promptAuth: async function () {
      const currentUser = this.$store.getters["wallet/currentUser"];
      if (currentUser) return;
      const currentNetwork = this.$store.getters["bancor/currentNetwork"];
      if (currentNetwork == "eth") {
        vxm.ethWallet.connect();
      } else if (currentNetwork == "eos") {
        this.$bvModal.show("modal-login");
      }
    }
  }
});

app.mount("#app");
