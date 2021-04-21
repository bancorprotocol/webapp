<template>
  <div class="side-bar-bottom-more" :class="darkMode ? 'side-bar-dark' : ''">
    <div class="side-bar-links">
      <div
        @click="linkClicked(link)"
        v-for="link in links.filter(l => l.hideMobile)"
        :key="link.key"
        :to="{ name: link.route }"
        class="side-bar-link"
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
export default class SideBarBottomMore extends Vue {
  @Prop() links!: ViewSideBarLink[];
  @Prop() darkMode!: boolean;

  @Emit("linkClicked")
  linkClicked(link: ViewSideBarLink) {
    return link;
  }
}
</script>

<style lang="scss" scoped>
.side-bar-bottom-more {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 180px;
  background-color: #e6ebf2;
  user-select: none;
  height: 100%;
  z-index: 10;
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
}
.side-bar-link-dark {
  span {
    color: #aaa !important;
  }
}
.side-bar-dark {
  background-color: #0a2540;
}
</style>
