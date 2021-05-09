import Vue from "vue";
import Router, { Route } from "vue-router";
import Data from "@/views/Data.vue";
import PageNotFound from "@/views/PageNotFound.vue";
import Navigation from "@/components/layout/Navigation.vue";
import { services } from "@/api/helpers";
import PoolActions from "@/components/pool/PoolActions.vue";
import SwapHome from "@/components/swap/SwapHome.vue";
import CreateHome from "@/views/CreateHome.vue";
import DataSummary from "@/components/data/DataSummary.vue";
import Portfolio from "@/views/Portfolio.vue";
import AddProtectionHome from "@/views/AddProtectionHome.vue";
import ProtectionActions from "@/components/protection/ProtectionActions.vue";
import PrivacyPolicy from "@/views/PrivacyPolicy.vue";
import TermsOfUse from "@/views/TermsOfUse.vue";
import PoolActionsAddHome from "@/components/pool/PoolActionsAddHome.vue";
import Vote from "@/views/Vote.vue";
import Fiat from "@/views/Fiat.vue";
import AddProtectionSingle from "@/components/protection/AddProtectionSingle.vue";
import WithdrawProtectionSingle from "@/components/protection/WithdrawProtectionSingle.vue";
import WhitelistedPools from "@/components/protection/WhitelistedPools.vue";
import VotePage from "@/components/vote-new/VotePage.vue";
import FiatPage from "@/components/fiat/FiatPage.vue";
import RestakeRewards from "@/components/rewards/RestakeRewards.vue";
import WithdrawRewards from "@/components/rewards/WithdrawRewards.vue";
import LimitOrderTable from "@/components/swap/LimitOrderTable.vue";
import VoteLegacy from "@/components/vote/VoteLegacy.vue";
import { sendGTMPath } from "@/gtm";
import { vxm } from "@/store";

Vue.use(Router);

const detectSubdomain = () => {
  const hostname = window.location.hostname;
  const splitted = hostname.split(".");
  const withoutStaging = splitted.length == 4 ? splitted.slice(1) : splitted;
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
      path: "/:service/pool/create",
      name: "PoolCreate",
      components: {
        Nav: Navigation,
        Hero: CreateHome
      },
      props: true,
      meta: {
        key: "data",
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
        key: "swap",
        feature: "Liquidity"
      }
    },
    {
      path: "/:service/protection",
      redirect: "/:service/portfolio"
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
        key: "swap",
        feature: "Liquidity"
      }
    },
    {
      path: "/:service/portfolio",
      name: "Portfolio",
      components: {
        Nav: Navigation,
        default: Portfolio
      },
      meta: {
        key: "portfolio",
        feature: "Portfolio"
      }
    },
    {
      path: "/:service/portfolio/whitelistedpools",
      name: "WhitelistedPools",
      meta: {
        key: "portfolio"
      },
      components: {
        Nav: Navigation,
        default: WhitelistedPools
      }
    },
    {
      path: "/:service/portfolio/stake",
      components: {
        Nav: Navigation,
        Hero: ProtectionActions
      },
      props: true,
      meta: {
        key: "portfolio"
      },
      children: [
        {
          path: "",
          name: "ProtectionAction",
          component: AddProtectionHome
        },
        {
          path: "add/single/:id",
          name: "AddProtectionSingle",
          component: AddProtectionSingle
        },
        {
          path: "withdraw/single/:id",
          name: "WithdrawProtectionSingle",
          component: WithdrawProtectionSingle
        },
        {
          path: "rewards/restake/:id",
          name: "RewardsRestake",
          component: RestakeRewards
        },
        {
          path: "rewards/withdraw",
          name: "RewardsWithdraw",
          component: WithdrawRewards
        }
      ]
    },
    {
      path: "/:service/swap",
      components: {
        Nav: Navigation,
        Hero: SwapHome,
        default: LimitOrderTable
      },
      props: true,
      meta: {
        key: "swap",
        feature: "Trade"
      },
      name: "Swap"
    },
    {
      path: "/:service/data",
      components: {
        Nav: Navigation,
        default: Data
      },
      props: true,
      children: [
        {
          path: "",
          name: "Data",
          component: DataSummary,
          meta: {
            key: "data",
            feature: "Data"
          }
        }
      ]
    },
    {
      path: "/:service/vote",
      components: {
        Nav: Navigation,
        default: Vote
      },
      props: true,
      children: [
        {
          path: "",
          name: "Vote",
          component: VotePage,
          meta: {
            key: "vote",
            feature: "Vote"
          }
        }
      ]
    },
    {
      path: "/:service/vote-legacy",
      components: {
        Nav: Navigation,
        default: Vote
      },
      props: true,
      children: [
        {
          path: "",
          name: "VoteLegacy",
          component: VoteLegacy,
          meta: {
            key: "vote",
            feature: "Vote"
          }
        }
      ]
    },
    {
      path: "/:service/fiat",
      name: "Fiat",
      components: {
        Nav: Navigation,
        default: Fiat
      },
      props: true,
      children: [
        {
          path: "",
          name: "FiatPage",
          component: FiatPage,
          meta: {
            key: "fiat",
            feature: "Fiat"
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
  if (from.path !== to.path) {
    sendGTMPath(from.path, to.path, vxm.general.darkMode);
  }
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
