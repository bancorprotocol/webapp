import Vue from "vue";
import Router, { Route } from "vue-router";
import Data from "@/views/Data.vue";
import PageNotFound from "@/views/PageNotFound.vue";
import Navigation from "@/components/layout/Navigation.vue";
import { services } from "@/api/helpers";
import PoolHome from "@/components/pool/PoolHome.vue";
import PoolActions from "@/components/pool/PoolActions.vue";
import SwapHome from "@/components/swap/SwapHome.vue";
import CreateHome from "@/views/CreateHome.vue";
import DataDetailsPool from "@/components/data/details/DataDetailsPool.vue";
import DataSummary from "@/components/data/DataSummary.vue";
import DataDetailsToken from "@/components/data/details/DataDetailsToken.vue";
import LiquidityProtectionSummary from "@/views/LiquidityProtectionSummary.vue";
import AddProtectionHome from "@/views/AddProtectionHome.vue";
import ProtectionActions from "@/components/protection/ProtectionActions.vue";
import PrivacyPolicy from "@/views/PrivacyPolicy.vue";
import TermsOfUse from "@/views/TermsOfUse.vue";
import PoolActionsAddHome from "@/components/pool/PoolActionsAddHome.vue";
import Vote from "@/views/Vote.vue";
import AddProtectionSingle from "@/components/protection/AddProtectionSingle.vue";
import AddProtectionDouble from "@/components/protection/AddProtectionDouble.vue";
import WithdrawProtectionSingle from "@/components/protection/WithdrawProtectionSingle.vue";
import WithdrawProtectionDouble from "@/components/protection/WithdrawProtectionDouble.vue";
import WhitelistedPools from "@/components/protection/WhitelistedPools.vue";
import VotePage from "@/components/vote/VotePage.vue";

Vue.use(Router);

const detectSubdomain = () => {
  const hostname = window.location.hostname;
  const splitted = hostname.split(".");
  const withoutStaging = splitted.length == 4 ? splitted.slice(1) : splitted;
  console.log(withoutStaging, "is without staging");
  const subDomain = withoutStaging[0];
  if (subDomain == "localhost") return;
  if (subDomain == "data") {
    return "data";
  } else if (subDomain == "swap") {
    return "swap";
  }
};

export const defaultModule = "eth";
const PREFERRED_SERVICE = "preferredService";

export const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition);
        } else {
          resolve({ x: 0, y: 0 });
        }
      }, 500);
    });
  },
  routes: [
    {
      path: "*",
      redirect: `/404`
    },
    {
      path: "/",
      name: "Root",
      redirect: () => {
        const preferredService = localStorage.getItem(PREFERRED_SERVICE);
        const subdomain = detectSubdomain() || "data";
        if (preferredService) {
          const foundService = services.find(
            service => service.namespace == preferredService
          );
          if (foundService) return `/${foundService.namespace}/${subdomain}`;
        }
        return `/${defaultModule}/${subdomain}`;
      }
    },
    {
      path: "/404",
      name: "404",
      components: {
        Nav: Navigation,
        default: PageNotFound
      }
    },
    {
      path: "/swap",
      redirect: `/${defaultModule}/swap`
    },
    {
      path: "/swap/:service/swap",
      redirect: `/${defaultModule}/swap`
    },
    {
      path: "/data",
      redirect: `/${defaultModule}/data`
    },
    {
      path: "/data/:service/swap",
      redirect: `/${defaultModule}/swap`
    },
    {
      path: "/vote",
      redirect: `/${defaultModule}/vote`
    },
    {
      path: "/:service/pool",
      name: "Pool",
      components: {
        Nav: Navigation,
        Hero: PoolHome
      },
      props: true,
      meta: {
        feature: "Liquidity"
      }
    },
    {
      path: "/:service/pool/create",
      name: "PoolCreate",
      components: {
        Nav: Navigation,
        Hero: CreateHome
      },
      props: true,
      meta: {
        feature: "Liquidity"
      }
    },
    {
      path: "/:service/pool/:id",
      name: "PoolAdd",
      components: {
        Nav: Navigation,
        Hero: PoolActionsAddHome
      },
      props: true,
      meta: {
        feature: "Liquidity"
      }
    },
    {
      path: "/:service/pool/:poolAction/:account",
      name: "PoolAction",
      components: {
        Nav: Navigation,
        Hero: PoolActions
      },
      props: true,
      meta: {
        feature: "Liquidity"
      }
    },
    {
      path: "/:service/protection",
      name: "LiqProtection",
      components: {
        Nav: Navigation,
        default: LiquidityProtectionSummary
      }
    },
    {
      path: "/:service/protection/whitelistedpools",
      name: "WhitelistedPools",
      components: {
        Nav: Navigation,
        default: WhitelistedPools
      }
    },
    {
      path: "/:service/protection/stake",
      name: "ProtectionAction",
      components: {
        Nav: Navigation,
        Hero: ProtectionActions
      },
      props: true,
      children: [
        {
          path: "",
          name: "AddProtectionHome",
          component: AddProtectionHome
        },
        {
          path: "add/single/:id",
          name: "AddProtectionSingle",
          component: AddProtectionSingle
        },
        {
          path: "add/double/:id",
          name: "AddProtectionDouble",
          component: AddProtectionDouble
        },
        {
          path: "withdraw/single/:id",
          name: "WithdrawProtectionSingle",
          component: WithdrawProtectionSingle
        },
        {
          path: "withdraw/double/:id",
          name: "WithdrawProtectionDouble",
          component: WithdrawProtectionDouble
        }
      ]
    },
    {
      path: "/:service/swap",
      name: "Swap",
      components: {
        Nav: Navigation,
        Hero: SwapHome
      },
      props: true,
      meta: {
        feature: "Trade"
      }
    },
    {
      path: "/:service/data",
      name: "Data",
      components: {
        Nav: Navigation,
        default: Data
      },
      props: true,
      children: [
        {
          path: "",
          name: "DataSummary",
          component: DataSummary,
          meta: {
            feature: "Data"
          }
        },
        {
          path: "token/:id",
          name: "DetailsToken",
          redirect: "/404",
          component: DataDetailsToken,
          meta: {
            feature: "Data"
          }
        },
        {
          path: "pool/:id",
          name: "DetailsPool",
          redirect: "/404",
          component: DataDetailsPool,
          meta: {
            feature: "Data"
          }
        }
      ]
    },
    {
      path: "/:service/vote",
      name: "Vote",
      components: {
        Nav: Navigation,
        default: Vote
      },
      props: true,
      children: [
        {
          path: "",
          name: "VotePage",
          component: VotePage,
          meta: {
            feature: "Vote"
          }
        }
      ]
    },
    {
      path: "/:service",
      props: true,
      redirect: (to: Route) => {
        const foundService = services.find(
          service => service.namespace == to.params.service
        );
        return foundService ? `/${foundService.namespace}/swap` : "/404";
      }
    },
    {
      path: "/privacy-policy",
      name: "PrivacyPolicy",
      components: {
        Nav: Navigation,
        default: PrivacyPolicy
      }
    },
    {
      path: "/terms-of-use",
      name: "TermsOfUse",
      components: {
        Nav: Navigation,
        default: TermsOfUse
      }
    },
    {
      path: "*",
      redirect: `/${defaultModule}`
    },
    {
      path: "/",
      redirect: () => {
        const preferredService = localStorage.getItem(PREFERRED_SERVICE);
        if (preferredService) {
          const foundService = services.find(
            service => service.namespace == preferredService
          );
          if (foundService) return `/${foundService.namespace}/swap`;
        }
        return `/${defaultModule}/swap`;
      }
    }
  ]
});

const setPreferredService = (service: string) => {
  localStorage.setItem(PREFERRED_SERVICE, service);
};

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.feature) {
    const service = services.find(
      service => service.namespace == to.params.service
    )!;
    if (!service) {
      next("/404");
      return;
    }
    setPreferredService(service.namespace);
    switch (to.meta.feature) {
      case "Trade":
        if (service.features.includes(0)) next();
        else next("/404");
        break;
      case "Liquidity":
        if (service.features.includes(2)) next();
        else next("/404");
        break;
      default:
        next();
    }
  } else {
    next();
  }
});
