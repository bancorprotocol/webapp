<template>
  <div class="bottom-bar" :class="darkMode ? 'side-bar-dark ' : ''">
    <div class="side-bar-links" ref="barRef" @scroll="handleScroll">
      <div
        @click="linkClicked(link)"
        v-for="link in links"
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
          :src="require(`@/assets/media/icons/${link.icon}`)"
        />
        <div>{{ link.label }}</div>
      </div>
    </div>
    <div class="blur-backdoor-left" v-show="visibleBlurLeft"></div>
    <div class="blur-backdoor-right" v-show="visibleBlurRight"></div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue, Emit } from "vue-property-decorator";
import { ViewSideBarLink } from "@/components/layout/SideBar.vue";

@Component
export default class SideBarBottom extends Vue {
  @Prop() links!: ViewSideBarLink[];
  @Prop() darkMode!: boolean;

  visibleBlurLeft: boolean = false;
  visibleBlurRight: boolean = true;

  $refs!: {
    barRef: HTMLElement;
  };

  isRouteActive(key: string): boolean {
    return this.$route.matched.some(
      (m: { meta: { key: string } }) => m.meta.key === key
    );
  }

  @Emit("linkClicked")
  linkClicked(link: ViewSideBarLink) {
    return link;
  }

  @Emit("moreClicked")
  moreClicked() {
    return true;
  }

  handleScroll(e: any) {
    const scrollEnd =
      this.$refs.barRef.scrollWidth - this.$refs.barRef.clientWidth;
    const scrollPos = this.$refs.barRef.scrollLeft;

    if (scrollPos === 0) {
      this.visibleBlurLeft = false;
    } else if (scrollPos === scrollEnd) {
      this.visibleBlurRight = false;
    } else {
      this.visibleBlurLeft = true;
      this.visibleBlurRight = true;
    }
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
  border-top: 1px solid #1f3a55;

  .side-bar-links {
    width: 100%;
    height: 56px;
    align-items: center;
    margin-top: 0px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
  }

  .side-bar-link {
    padding-left: 0px;
    display: inline-block;
    width: calc(100% / 4.7);
    height: 100%;
    text-align: center;
    cursor: pointer;
    div {
      height: 40px;
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
      margin-top: 10px;
      margin-bottom: 2px;
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
      filter: invert(0.6) sepia(1) saturate(5) hue-rotate(195deg)
        brightness(0.7);
      color: #0f59d1;
    }
  }
  .btn-more {
    cursor: pointer;

    span {
      font-size: 14px;
    }
  }
  .blur-backdoor-left {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 20px;
    height: 100%;
    line-height: 60px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0.4)
    );
    filter: blur(2px);
  }
  .blur-backdoor-right {
    position: absolute;
    right: 0px;
    bottom: 0px;
    width: 20px;
    height: 100%;
    line-height: 60px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 1)
    );
    filter: blur(2px);
  }
}
.side-bar-dark {
  .blur-backdoor-left {
    background: linear-gradient(
      to right,
      rgba(28, 52, 78, 1),
      rgba(28, 52, 78, 0.7)
    );
  }
  .blur-backdoor-right {
    background: linear-gradient(
      to right,
      rgba(28, 52, 78, 0.7),
      rgba(28, 52, 78, 1)
    );
  }
}
.side-bar-link-dark {
  span {
    color: #aaa !important;
  }
}
</style>
