<template>
  <div :class="sideBarParentClasses()">
    <div :class="sideBarClasses()" @click="toggleClass(classShow)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-[16px] text-white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </div>
    <div class="sidebar-wrap">
      <div class="bancor-icon-wrapper">
        <b-navbar-brand class="pb-1 brand-icon mb-1">
          <router-link
            :to="{
              name: 'Data',
              params: { service: currentService }
            }"
          >
            <img :src="imgLogo()" height="40px" />
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
            <span class="side-bar-link-icon">
              <img
                width="14"
                height="14"
                :src="require(`@/assets/media/icons/${link.icon}`)"
              />
            </span>
            <transition name="fade">
              <span>{{ link.label }}</span>
            </transition>
            <font-awesome-icon
              v-if="link.newTab"
              variant="white"
              class="icon-newtab block-rounded ml-auto"
              icon="external-link-alt"
              fixed-width
            />
          </div>
        </div>
        <div />
        <div
          class="font-size-14 font-w500 text-center"
          :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
        >
          © Bancor 2021
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { ViewSideBarLink } from "@/components/layout/SideBar.vue";

@Component
export default class SideBarLeft extends Vue {
  @Prop() links!: ViewSideBarLink[];
  @Prop() darkMode!: boolean;


  data(): any {
    return {
      classShow: false
    };
  }

  sideBarClasses(): string {
    return this.$data.classShow ? "sidebar-toggle rotate-180": "sidebar-toggle"
  }
  sideBarParentClasses(): string {
    return this.$data.classShow ? `side-bar ${this.$props.darkMode ? 'side-bar-dark' : '' }`: `side-bar sidebar-collapse ${this.$props.darkMode ? 'side-bar-dark' : '' }`
  }

  get currentService() {
    return this.$route.params.service ?? "eth";
  }

  classSideBar(): string {
    const classNames: string[] = [];
    if (this.darkMode) {
      classNames.push("side-bar-dark");
    }
    return classNames.join(" ");
  }
  
  toggleClass(): void {
    this.$data.classShow = !this.$data.classShow
  }

  imgLogo(): string {
    if (this.darkMode) return require("@/assets/media/logos/bancor-white.png");
    else return require("@/assets/media/logos/bancor-white.png");
  }

  @Emit("linkClicked")
  linkClicked(link: ViewSideBarLink) {
    return link;
  }
}
</script>

<style lang="scss">
.sidebar-collapse {
    width: 230px !important;
}
.side-bar {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  z-index: 10;
  background: #141418;
  border-radius: 20px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  position: relative;
  width: 58px;
  transition: 0.4s ease all;
  .side-bar-link:hover {
    border-color: #516bb2;
  }
  .sidebar-wrap {
    position: relative;
    width: 100%;
    display: block;
    overflow: hidden;
  }
  .bancor-icon-wrapper {
    position: absolute;
    width: 230px;
    height: 60px;
    background-color: transparent;
  }

  .side-bar-wrapper {
    display: grid;
    grid-template-rows: auto 1fr 30px;
    width: 230px;
    height: 100%;
    background-color: transparent;
    margin-top: 60px;
    -moz-transition: width 0.25s;
    -ms-transition: width 0.25s;
    -o-transition: width 0.25s;
    -webkit-transition: width 0.25s;
    transition: width 0.25s ease-in-out;
  }
  .sidebar-toggle {
      width: 25px;
      height: 25px;
      border: 1px solid #ddd;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
      position: absolute;
      right: -10px;
      z-index: 10;
      background: #516bb2;
      transition: 0.7s ease all;
      top: 60px;
      transform: rotate(180deg);
      cursor: pointer;

    }
    .sidebar-toggle.rotate-180 {
      transform: rotate(0deg);
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
    display: flex;
    align-items: center;
    padding-left: 1.50rem;
    width: 100%;
    height: 50px;
    cursor: pointer;
    position: relative;
    border-left: 3px solid #141418;
    span {
      font-family: Inter;
      font-size: 16px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #fff;
    }
    .side-bar-link-icon {
      align-self: center;
      width: 14px;
      margin-right: 1.25rem;
    }
    .fade-enter-active {
      transition: opacity 0.35s;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }
  .clicked-link {
    background-color: #141418;
    border-left: 2px solid #516bb2;
    span {
      color: #516bb2;
    }
    img {
      filter: invert(0.6) sepia(1) saturate(5) hue-rotate(195deg)
        brightness(0.7);
      color: #516bb2;
    }
    &::before {
      content: "";
      position: absolute;
      left: 202px;
      top: -26px;
      width: 26px;
      height: 26px;
      background-color: transparent;
      border-bottom-right-radius: 14px;
      box-shadow: 0 11px 0 0 transparent;

      -moz-transition: left 0.25s;
      -ms-transition: left 0.25s;
      -o-transition: left 0.25s;
      -webkit-transition: left 0.25s;
      transition: left 0.25s ease-in-out;
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
      box-shadow: 0 -11px 0 0 transparent;

      -moz-transition: left 0.25s;
      -ms-transition: left 0.25s;
      -o-transition: left 0.25s;
      -webkit-transition: left 0.25s;
      transition: left 0.25s ease-in-out;
    }
  }
  .btn-toggle {
    cursor: pointer;
  }
}

.side-bar-link-dark {
  span {
    color: #aaa !important;
  }
}
.side-bar-dark {
  background-color: #141418 !important;

  .bancor-icon-wrapper {
    background-color: transparent;
  }
  .side-bar-wrapper {
    background-color: transparent;
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
    background-color: transparent;
    border-left: 2px solid #516bb2;
    &::before {
      content: "";
      position: absolute;
      left: 202px;
      top: -26px;
      width: 26px;
      height: 26px;
      background-color: transparent;
      border-bottom-right-radius: 14px;
      box-shadow: 0 11px 0 0 transparent;

      -moz-transition: left 0.25s;
      -ms-transition: left 0.25s;
      -o-transition: left 0.25s;
      -webkit-transition: left 0.25s;
      transition: left 0.25s ease-in-out;
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
      box-shadow: 0 -11px 0 0 transparent;

      -moz-transition: left 0.25s;
      -ms-transition: left 0.25s;
      -o-transition: left 0.25s;
      -webkit-transition: left 0.25s;
      transition: left 0.25s ease-in-out;
    }
  }
}
</style>
