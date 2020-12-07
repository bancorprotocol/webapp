<template>
  <div class="bottom-bar" :class="darkMode ? 'side-bar-dark' : ''">
    <div class="side-bar-links">
      <div
        @click="linkClicked(link)"
        v-for="link in data.links.filter(l => !l.hideMobile)"
        :key="link.key"
        :to="{ name: link.route }"
        class="side-bar-link"
        :class="[
          isRouteActive(link.key)
            ? darkMode
              ? 'clicked-link-dark'
              : 'clicked-link'
            : darkMode
            ? 'side-bar-link-dark'
            : 'side-bar-link'
        ]"
      >
        <img
          class="side-bar-link-icon"
          :src="require(`@/assets/media/icons/${link.svgName}.svg`)"
        />
        <span>{{ link.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue, Emit } from "vue-property-decorator";
import { ViewSideBarLink } from "@/components/layout/SideBar.vue";

@Component
export default class SideBarBottom extends Vue {
  @Prop() data!: any;
  @Prop() darkMode!: boolean;

  isRouteActive(key: string): boolean {
    const fullPath = this.$route.fullPath;
    if (fullPath.includes("swap") || fullPath.includes("pool")) {
      return key === "swap";
    } else if (fullPath.includes("data")) {
      return key === "data";
    } else if (fullPath.includes("protection")) {
      return key === "liquidity";
    } else if (fullPath.includes("vote")) {
      return key === "vote";
    } else return false;
  }

  @Emit("linkClicked")
  linkClicked(link: ViewSideBarLink) {
    return link;
  }
}
</script>

<style lang="scss">
.bottom-bar {
  position: fixed;
  overflow: hidden;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 56px;
  background-color: white;
  border-top: 1px solid #e6ebf2;
  .side-bar-links {
    width: 100%;
    height: 56px;
    align-items: center;
    margin-top: 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .side-bar-link {
    padding-left: 0px;
    display: flex;
    flex-direction: column;
    span {
      height: 40px;
      display: inline-flex;
      font-family: Inter;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #6b7c93;
      align-self: center;
      font-size: 10px;
    }
    .side-bar-link-icon {
      align-self: center;
      width: 24px;
      height: 24px;
      margin-right: 0px;
      margin-top: 22px;
      margin-bottom: 2px;
    }
  }
}
.side-bar-dark {
  background-color: #0a2540;
}
.side-bar-link-dark {
  span {
    color: #aaa !important;
  }
}
.clicked-link-dark {
  span {
    color: #fff !important;
  }
  img {
    filter: invert(0.2) saturate(5) brightness(1);
    color: #0f59d1;
  }
  &::before {
    content: none;
  }
  &::after {
    content: none;
  }
}
.clicked-link {
  span {
    color: #0f59d1 !important;
  }
  img {
    filter: invert(0.6) sepia(1) saturate(5) hue-rotate(195deg) brightness(0.7);
    color: #0f59d1;
  }
}
</style>
