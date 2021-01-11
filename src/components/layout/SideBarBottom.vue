<template>
  <div class="bottom-bar" :class="darkMode ? 'side-bar-dark' : ''">
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
          :src="require(`@/assets/media/icons/${link.svgName}.svg`)"
        />
        <div>{{ link.label }}</div>
      </div>

      <!-- <div
        @click="moreClicked(link)"
        class="btn-more"
        :class="darkMode ? 'side-bar-link-dark': ''"
      >
        <span>More</span>
        <font-awesome-icon icon="chevron-circle-right" class="ml-1" />
      </div> -->
    </div>
    <div class="arrow-backdoor-left" v-show="visibleArrowLeft">
      <font-awesome-icon
        variant="white"
        class="block-rounded mt-3" icon="angle-double-left" fixed-width />
    </div>
    <div class="arrow-backdoor-right" v-show="visibleArrowRight">
      <font-awesome-icon
        variant="white"
        class="block-rounded mr-3" icon="angle-double-right" fixed-width />
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue, Emit } from "vue-property-decorator";
import { ViewSideBarLink } from "@/components/layout/SideBar.vue";

@Component
export default class SideBarBottom extends Vue {
  @Prop() links!: ViewSideBarLink[];
  @Prop() darkMode!: boolean;

  visibleArrowLeft: boolean = false;
  visibleArrowRight: boolean = true;

  $refs!: {
    barRef: HTMLElement
  }

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

  handleScroll (e: any) {
    const scrollEnd = this.$refs.barRef.scrollWidth - this.$refs.barRef.clientWidth;
    const scrollPos = this.$refs.barRef.scrollLeft;

    if (scrollPos === 0) {
      this.visibleArrowLeft = false;
    } else if (scrollPos === scrollEnd) {
      this.visibleArrowRight = false;
    } else {
      this.visibleArrowLeft = true;
      this.visibleArrowRight = true;
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
  border-top: 1px solid #e6ebf2;

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
    width: 100px;
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
  .arrow-backdoor-left {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 16px;
    height: 100%;
    line-height: 60px;
    background: rgba($color: #fff, $alpha: 0.3)
  }
  .arrow-backdoor-right {
    position: absolute;
    right: 0px;
    bottom: 0px;
    width: 16px;
    height: 100%;
    line-height: 60px;
    background: rgba($color: #fff, $alpha: 0.3)
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
</style>
