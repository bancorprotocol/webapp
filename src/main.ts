import Vue from "vue";
import App from "./App.vue";
import { router } from "./router";
import { store, vxm } from "./store/";
import i18n from "./i18n";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@/assets/_scss/main.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from "@fortawesome/vue-fontawesome";
// @ts-ignore
import Ripple from "vue-ripple-directive";
// @ts-ignore
import VueFuse from "vue-fuse";
import ImageFallback from "vue-image-fallback";
import { sync } from "vuex-router-sync";

import * as firebase from "firebase/app";
import "firebase/analytics";
// @ts-ignore
import VueGtag from "vue-gtag";

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
// firebase.analytics();

// Vue.prototype.$analytics = firebase.analytics();

Vue.use(
  VueGtag,
  {
    config: { id: "UA-174155472-1" }
  },
  router
);

Vue.use(VueFuse);

Ripple.color = "rgba(255, 255, 255, 0.35)";
Ripple.zIndex = 1055;
Vue.directive("ripple", Ripple);

Vue.use(BootstrapVue);
Vue.use(ImageFallback);

library.add(fas, far, fab);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("font-awesome-layers", FontAwesomeLayers);
Vue.component("font-awesome-layers-text", FontAwesomeLayersText);

Vue.config.productionTip = false;

sync(store, router, { moduleName: "routeModule" });

Vue.mixin({
  methods: {
    promptAuth: async function() {
      const isAuthenticated = this.$store.getters["wallet/isAuthenticated"];
      if (isAuthenticated) return;
      const currentNetwork = this.$store.getters["bancor/currentNetwork"];
      if (currentNetwork == "eth") {
        vxm.ethWallet.connect();
      } else if (currentNetwork == "eos") {
        this.$bvModal.show("modal-login");
      }
    }
  }
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
