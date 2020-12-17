<template>
  <div class="bar-container">
    <side-bar-left
      class="d-none d-md-flex"
      :dark-mode="darkMode"
      :data="dataObject"
      @linkClicked="navigateToRoute"
    />
    <side-bar-bottom
      class="d-md-none"
      :dark-mode="darkMode"
      :data="dataObject"
      @linkClicked="navigateToRoute"
    />
  </div>
</template>

<script lang="ts">
import { Watch } from "vue-property-decorator";
import SideBarLeft from "@/components/layout/SideBarLeft.vue";
import SideBarBottom from "@/components/layout/SideBarBottom.vue";
import BaseComponent from "@/components/BaseComponent.vue";
import { Options } from "vue-class-component/dist/vue-class-component"

export interface ViewSideBarLink {
  route: string;
  key: string;
  label: string;
  newTab: boolean;
  hideMobile: boolean;
  svgName: string;
}

@Options({
  components: { SideBarBottom, SideBarLeft }
})
export default class SideBar extends BaseComponent {
  selectedLink = "swap";
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
      key: "liquidity",
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
      hideMobile: false,
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

  get dataObject() {
    return {
      selectedLink: this.selectedLink,
      links: this.links
    };
  }
  async created() {
    this.onRouteChange();
  }

  openNewTab(url: string) {
    window.open(url, "_blank");
  }

  navigateToRoute(link: ViewSideBarLink) {
    if (!link.newTab) {
      this.$router.push({ name: link.route });
      this.selectedLink = link.route;
    } else {
      this.openNewTab(link.route);
    }
  }

  @Watch("$route")
  async onRouteChange() {
    const path = this.$route.fullPath;
    if (path.includes("swap")) this.selectedLink = "swap";
    if (path.includes("pool")) this.selectedLink = "swap";
    if (path.includes("data")) this.selectedLink = "data";
    if (path.includes("protection")) this.selectedLink = "liquidity";
  }
}
</script>

<style lang="scss"></style>
