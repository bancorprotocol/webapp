<template>
  <div class="side-bar" :class="darkMode ? 'side-bar-dark' : ''">
    <b-navbar-brand class="pb-1 brand-icon">
      <router-link :to="{ name: 'Swap' }">
        <img
          v-if="darkMode"
          src="@/assets/media/logos/bancor-white.png"
          height="35px"
          class="mb-1"
        />
        <img
          v-else
          src="@/assets/media/logos/bancor-black.png"
          height="35px"
          class="mb-1"
        />
      </router-link>
    </b-navbar-brand>
    <div class="side-bar-links">
      <router-link
        tag="div"
        v-for="link in data.links"
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
            : 'side-bar-link',
          link.hideMobile ? 'hide-on-mobile' : ''
        ]"
      >
        <img
          class="side-bar-link-icon"
          :src="require(`@/assets/media/icons/${link.svgName}.svg`)"
        />
        <span>{{ link.label }}</span>
      </router-link>
    </div>
    <div class="middle-space" />
    <p class="tm-text">© Bancor 2020</p>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue, Emit } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class SideBarLeft extends Vue {
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

  @Emit("sideLinkClicked")
  sideLinkClicked(key: string) {
    return key;
  }
}
</script>

<style lang="scss">
.side-bar {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 230px;
  background-color: #e6ebf2;
  height: 100%;
  z-index: 10;
  .brand-icon {
    margin-top: 18px;
    margin-left: 25px;
    width: 80.9px;
    height: 22px;
    object-fit: contain;
  }
  .side-bar-links {
    margin-top: 28px;
  }
  .side-bar-link {
    padding-left: 25px;
    width: 100%;
    cursor: pointer;
    height: 40px;
    position: relative;
    span {
      height: 40px;
      display: inline-flex;
      align-items: center;
      font-family: Inter;
      font-size: 14px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #6b7c93;
    }
    .side-bar-link-icon {
      align-self: center;
      width: 14px;
      height: 14px;
      margin-right: 12px;
    }
  }
  .middle-space {
    flex-grow: 1;
  }
  .tm-text {
    width: 88px;
    height: 15px;
    font-family: Inter;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #97a5b8;
    margin-left: 25px;
  }
  .clicked-link {
    span {
      color: #0f59d1;
    }
    img {
      filter: invert(0.6) sepia(1) saturate(5) hue-rotate(195deg)
        brightness(0.7);
      color: #0f59d1;
    }
    background-color: #f8f9fd;
    border-left: 2px solid #0f59d1;
    &::before {
      content: "";
      position: absolute;
      left: 202px;
      top: -26px;
      width: 26px;
      height: 26px;
      background-color: transparent;
      border-bottom-right-radius: 14px;
      box-shadow: 0 11px 0 0 #f8f9fd;
    }
    &::after {
      content: "";
      position: absolute;
      left: 202px;
      top: 40px;
      width: 26px;
      height: 26px;
      background-color: transparent;
      border-top-right-radius: 14px;
      box-shadow: 0 -11px 0 0 #f8f9fd;
    }
  }
}
.side-bar-link-dark {
  span {
    color: #aaa !important;
  }
}
.side-bar-dark {
  background-color: #0a2540;
}

.clicked-link-dark {
  span {
    color: #fff !important;
  }
  img {
    filter: invert(0.2) saturate(5) brightness(1);
    color: #0f59d1;
  }
  @media (min-width: 450px) {
    background-color: #1c344e;
    border-left: 2px solid #0f59d1;
    &::before {
      content: "";
      position: absolute;
      left: 202px;
      top: -26px;
      width: 26px;
      height: 26px;
      background-color: transparent;
      border-bottom-right-radius: 14px;
      box-shadow: 0 11px 0 0 #1c344e;
    }
    &::after {
      content: "";
      position: absolute;
      left: 202px;
      top: 40px;
      width: 26px;
      height: 26px;
      background-color: transparent;
      border-top-right-radius: 14px;
      box-shadow: 0 -11px 0 0 #1c344e;
    }
  }
}
</style>
