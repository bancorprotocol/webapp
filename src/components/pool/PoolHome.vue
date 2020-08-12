<template>
  <div>
    <content-block class="mb-3" :shadow="true">
      <template slot="header">
        <sub-navigation />
      </template>

      <div>
        <main-button
          @click.native="$bvModal.show('modal-join-pool')"
          label="Join a Pool"
          :active="true"
          :large="true"
        />

        <your-liquidity />
      </div>
    </content-block>
    <div v-if="false" class="d-flex justify-content-center">
      <router-link
        :to="{ name: 'PoolCreate' }"
        class="cursor font-w700 mb-3"
        :class="darkMode ? 'text-body-dark' : 'text-body-light'"
      >
        <font-awesome-icon icon="plus" class="mr-2" />Create Pool
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import SubNavigation from "@/components/layout/SubNavigation.vue";
import MainButton from "@/components/common/Button.vue";
import YourLiquidity from "@/components/pool/YourLiquidity.vue";

@Component({
  components: {
    YourLiquidity,
    MainButton,
    SubNavigation,
    ContentBlock
  }
})
export default class PoolHome extends Vue {
  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
