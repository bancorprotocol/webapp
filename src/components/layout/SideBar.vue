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
      @moreClicked="showMore = !showMore"
    />

    <div v-if="showMore" class="sidebar-more">
      <side-bar-bottom-more
        :dark-mode="darkMode"
        :links="links"
        @linkClicked="navigateToRoute" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
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
  svgName: string;
}
@Component({
  components: { SideBarBottom, SideBarBottomMore, SideBarLeft }
})
export default class SideBar extends BaseComponent {
  showMore: boolean = false;
  links: ViewSideBarLink[] = [
    {
      route: "DataSummary",
      key: "data",
      label: "Data",
      newTab: false,
      hideMobile: false,
      svgName: "data"
    },
    {
      route: "Swap",
      key: "swap",
      label: "Swap",
      newTab: false,
      hideMobile: false,
      svgName: "swap"
    },
    {
      route: "LiqProtection",
      key: "protection",
      label: "Protection",
      newTab: false,
      hideMobile: false,
      svgName: "liquidity"
    },
    {
      route: "https://gov.bancor.network",
      key: "governance",
      label: "Governance",
      newTab: true,
      hideMobile: false,
      svgName: "governance"
    },
    {
      route: "VotePage",
      key: "vote",
      label: "Vote",
      newTab: false,
      hideMobile: true,
      svgName: "vote"
    },
    {
      route: "https://x.bancor.network/",
      key: "bancorx",
      label: "Bancor X",
      newTab: true,
      hideMobile: true,
      svgName: "bancorx"
    },
    {
      route: "https://wallet.bancor.network/",
      key: "wallet",
      label: "Bancor Wallet",
      newTab: true,
      hideMobile: true,
      svgName: "bancor"
    }
  ];

  openNewTab(url: string) {
    window.open(url, "_blank");
  }

  navigateToRoute(link: ViewSideBarLink) {
    this.showMore = false;
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
