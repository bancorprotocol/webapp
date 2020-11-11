<template>
  <div class="bar-container">
    <side-bar-left
      class="d-none d-md-flex"
      :dark-mode="darkMode"
      :data="dataObject"
      @sideLinkClicked="sideLinkClicked"
    />
    <side-bar-bottom
      class="d-md-none"
      :dark-mode="darkMode"
      :data="dataObject"
      @sideLinkClicked="sideLinkClicked"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { vxm } from "@/store";
import SideBarLeft from "@/components/layout/SideBarLeft.vue";
import SideBarBottom from "@/components/layout/SideBarBottom.vue";
@Component({
  components: { SideBarBottom, SideBarLeft }
})
export default class SideBar extends Vue {
  selectedLink = "swap";
  links = [
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

  openUrl(url: string) {
    window.open(url, "_blank");
  }
  get darkMode() {
    return vxm.general.darkMode;
  }

  sideLinkClicked(newSelected: string) {
    if (this.selectedLink == newSelected) return;
    const link = this.links.find(x => x.key === newSelected);
    if (link && !link.newTab) {
      this.$router.push({ name: link.route });
      this.selectedLink = newSelected;
    } else if (link) {
      this.openUrl(link.route);
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
