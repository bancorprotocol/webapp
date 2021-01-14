<template>
  <div
    class="side-bar"
    :class="classSideBar()"
    @mouseover="mouseoverSidebar"
    @mouseleave="mouseoutSidebar"
  >
    <!-- <div class="btn-toggle d-flex" v-if="showMinimize">
      <font-awesome-icon @click="toggleView"
        variant="white"
        class="block-rounded ml-auto m-1" icon="chevron-circle-right" fixed-width />
    </div> -->
    <div class="bancor-icon-wrapper">
      <b-navbar-brand class="pb-1 brand-icon">
        <router-link :to="{ name: 'Data' }">
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
    </div>

    <div class="side-bar-wrapper">
      <div class="side-bar-links">
        <div
          @click="linkClicked(link)"
          v-for="link in links"
          :key="link.key"
          :to="{ name: link.route }"
          class="side-bar-link"
          :class="[
            link.active
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
          <transition name="fade">
            <span v-if="!showMinimize && visibleLabel">{{ link.label }}</span>
          </transition>
          <font-awesome-icon
            v-if="!showMinimize && visibleLabel && link.newTab"
            variant="white"
            class="icon-newtab block-rounded ml-auto"
            icon="external-link-alt"
            fixed-width
          />
        </div>
      </div>
      <div class="middle-space" />
      <p class="tm-text" v-if="!showMinimize && visibleLabel">© Bancor 2020</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue, Emit } from "vue-property-decorator";
import { ViewSideBarLink } from "@/components/layout/SideBar.vue";

@Component
export default class SideBarLeft extends Vue {
  showMinimize: boolean = false;
  visibleLabel: boolean = true;
  @Prop() links!: ViewSideBarLink[];
  @Prop() darkMode!: boolean;

  classSideBar(): string {
    const classNames: string[] = [];
    if (this.darkMode) {
      classNames.push("side-bar-dark");
    }
    if (this.showMinimize) {
      classNames.push("side-bar-minimize");
    }
    return classNames.join(" ");
  }

  mouseoverSidebar() {
    if (this.showMinimize) {
      this.toggleView();
      this.showLabel(true);
    }
  }

  mouseoutSidebar() {
    if (!this.showMinimize) {
      this.toggleView();
      this.showLabel(false);
    }
  }

  showLabel(visible: boolean) {
    let timeout
    if (visible) {
      timeout = setTimeout(() => {
        this.visibleLabel = true;
      }, 250);
    } else {
      this.visibleLabel = false;
      clearTimeout(timeout)
    }
  }

  @Emit("linkClicked")
  linkClicked(link: ViewSideBarLink) {
    return link;
  }

  toggleView() {
    this.showMinimize = !this.showMinimize;
  }

  mounted() {
    const mql = window.matchMedia("(max-width: 1190px)");
    mql.addEventListener("change", e => {
      if (e.matches) {
        this.showMinimize = true;
        this.showLabel(false);
      } else {
        this.showMinimize = false;
        this.showLabel(true);
      }
    });
  }
}
</script>

<style lang="scss">
.side-bar {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  z-index: 10;

  .bancor-icon-wrapper {
    position: absolute;
    width: 230px;
    height: 50px;
    background-color: #fff;
  }

  .side-bar-wrapper {
    width: 230px;
    height: 100%;
    background-color: #e6ebf2;
    margin-top: 60px;

    -moz-transition: width 0.25s;
    -ms-transition: width 0.25s;
    -o-transition: width 0.25s;
    -webkit-transition: width 0.25s;
    transition: width 0.25s ease-in-out;
  }

  .brand-icon {
    margin-top: 10px;
    margin-left: 19px;
    width: 80.9px;
    height: 22px;
    object-fit: contain;
  }
  .side-bar-links {
    margin-top: 20px;

    .icon-newtab {
      font-size: 13px;
      position: absolute;
      right: 10px;
      top: 15px;
    }
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
      height: 43px;
      margin-right: 12px;
    }
    .fade-enter-active {
      transition: opacity .35s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
  }
  .middle-space {
    flex-grow: 1;
  }
  .tm-text {
    position: absolute;
    bottom: 15px;
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
  .btn-toggle {
    cursor: pointer;
  }
}
.side-bar-minimize {
  .side-bar-wrapper {
    min-width: 60px;
    width: 60px !important;
  }
}
.side-bar-link-dark {
  span {
    color: #aaa !important;
  }
}
.side-bar-dark {
  background-color: #1c344e !important;

  .bancor-icon-wrapper {
    background-color: #1c344e;
  }
  .side-bar-wrapper {
    background-color: #0a2540;
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
