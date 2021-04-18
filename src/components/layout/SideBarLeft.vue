<template>
  <div class="side-bar" :class="darkMode ? ' side-bar-dark' : ''">
    <div class="bancor-icon-wrapper">
      <b-navbar-brand class="pb-1 brand-icon mb-1">
        <router-link
          :to="{
            name: 'Data',
            params: { service: currentService }
          }"
        >
          <img :src="imgLogo()" height="35px" />
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
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { ViewSideBarLink } from "@/components/layout/SideBar.vue";

@Component
export default class SideBarLeft extends Vue {
  @Prop() links!: ViewSideBarLink[];
  @Prop() darkMode!: boolean;

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

  imgLogo(): string {
    if (this.darkMode) return require("@/assets/media/logos/bancor-white.png");
    else return require("@/assets/media/logos/bancor-black.png");
  }

  @Emit("linkClicked")
  linkClicked(link: ViewSideBarLink) {
    return link;
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
    background-color: #f8f9fd;
  }

  .side-bar-wrapper {
    overflow: auto;
    display: grid;
    grid-template-rows: auto 1fr 30px;
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
    display: flex;
    align-items: center;
    padding-left: 25px;
    width: 100%;
    height: 40px;
    cursor: pointer;
    position: relative;
    span {
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
      margin-right: 12px;
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
      box-shadow: 0 -11px 0 0 #f8f9fd;

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
      box-shadow: 0 -11px 0 0 #1c344e;

      -moz-transition: left 0.25s;
      -ms-transition: left 0.25s;
      -o-transition: left 0.25s;
      -webkit-transition: left 0.25s;
      transition: left 0.25s ease-in-out;
    }
  }
}
</style>
