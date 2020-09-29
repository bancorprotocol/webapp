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

Vue.use(Router);

export const defaultModule = "eth";
const PREFERRED_SERVICE = "preferredService";

export const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
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
        if (preferredService) {
          const foundService = services.find(
            service => service.namespace == preferredService
          );
          if (foundService) return `/${foundService.namespace}/swap`;
        }
        return `/${defaultModule}/swap`;
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
      path: "/:service/liquidity-protection",
      name: "LiqProtection",
      components: {
        Nav: Navigation,
        default: LiquidityProtectionSummary
      }
    },
    {
      path: "/:service/liquidity-protection/add",
      name: "AddProtection",
      components: {
        Nav: Navigation,
        Hero: AddProtectionHome
      }
    },
    {
      path: "/:service/liquidity-protection/:action/:id",
      name: "ProtectionAction",
      components: {
        Nav: Navigation,
        Hero: ProtectionActions
      },
      props: true
    },
    // {
    //   path: "/:service/liquidity-protection/add/:id",
    //   name: "AddLiqProtection",
    //   components: {
    //     Nav: Navigation,
    //     Hero: AddLiqProtection
    //   },
    //   props: true
    // },
    {
      path: "/:service/pool/create/",
      name: "PoolCreate",
      components: {
        Nav: Navigation,
        Hero: CreateHome
      },
      props: true
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
          component: DataSummary
        },
        {
          path: "token/:id",
          name: "DetailsToken",
          component: DataDetailsToken
        },
        {
          path: "pool/:id",
          name: "DetailsPool",
          component: DataDetailsPool
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
