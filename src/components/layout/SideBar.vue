<template>
  <div class="bar-container">
    <side-bar-left
      class="d-none d-md-flex"
      :dark-mode="darkMode"
      :links="links"
      @linkClicked="navigateToRoute"
    />
    <side-bar-bottom
      class="d-md-none"
      :dark-mode="darkMode"
      :links="links"
      @linkClicked="navigateToRoute"
    />

    <div class="sidebar-more">
      <side-bar-bottom-more
        :dark-mode="darkMode"
        :links="links"
        @linkClicked="navigateToRoute"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { i18n } from "@/i18n";
import { Component } from "vue-property-decorator";
import SideBarLeft from "@/components/layout/SideBarLeft.vue";
import SideBarBottom from "@/components/layout/SideBarBottom.vue";
import SideBarBottomMore from "@/components/layout/SideBarBottomMore.vue";
import BaseComponent from "@/components/BaseComponent.vue";

export interface ViewSideBarLink {
  route: string;
  key: string;
  label: string;
  newTab: boolean;
  hideMobile: boolean;
  icon: string;
  active: boolean;
}

@Component({
  components: { SideBarBottom, SideBarBottomMore, SideBarLeft }
})
export default class SideBar extends BaseComponent {
  get links() {
    const currentKeys = this.$route.matched.map(
      match => match.meta.key as string
    );
    return [
      {
        route: "Data",
        key: "data",
        label: i18n.t("data"),
        newTab: false,
        hideMobile: false,
        icon: "data.svg"
      },
      {
        route: "Swap",
        key: "swap",
        label: i18n.t("swap"),
        newTab: false,
        hideMobile: false,
        icon: "swap.svg"
      },
      {
        route: "LiqProtection",
        key: "protection",
        label: i18n.t("protection"),
        newTab: false,
        hideMobile: false,
        icon: "liquidity.svg"
      },
      {
        route: "https://gov.bancor.network",
        key: "governance",
        label: i18n.t("governance"),
        newTab: true,
        hideMobile: false,
        icon: "governance.svg"
      },
      {
        route: "Vote",
        key: "vote",
        label: i18n.t("vote.title"),
        newTab: false,
        hideMobile: true,
        icon: "vote.svg"
      },
      {
        route: "FiatPage",
        key: "fiat",
        label: "Fiat",
        newTab: false,
        hideMobile: true,
        icon: "fiat.svg",
        svgName: "fiat"
      },
      {
        route: "https://x.bancor.network/",
        key: "bancorx",
        label: "Bancor X",
        newTab: true,
        hideMobile: true,
        icon: "bancorx.svg"
      },
      {
        route: "https://wallet.bancor.network/",
        key: "wallet",
        label: "Bancor Wallet",
        newTab: true,
        hideMobile: true,
        icon: "bancor.svg"
      },
      {
        route: "https://www.bntee.shop/",
        key: "bntee",
        label: "BNTEE Shop",
        newTab: true,
        hideMobile: false,
        icon: "bntee.png"
      },
      {
        route: "https://duneanalytics.com/Bancor/bancor_1",
        key: "analytics",
        label: "Bancor Analytics",
        newTab: true,
        hideMobile: false,
        icon: "analytics.svg",
        svgName: "bancor"
      }
    ].map(link => ({
      ...link,
      active: currentKeys.some(key => link.key === key)
    })) as ViewSideBarLink[];
  }

  openNewTab(url: string) {
    window.open(url, "_blank");
  }

  navigateToRoute(link: ViewSideBarLink) {
    if (!link.newTab) {
      this.$router.push({ name: link.route });
    } else {
      this.openNewTab(link.route);
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-toggle {
  position: absolute;
  top: 60px;
  left: 15px;
  z-index: 999;
}

.sidebar-more {
  position: absolute;
  right: 10px;
  bottom: 60px;
  z-index: 300;
}
</style>
