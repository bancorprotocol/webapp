<template>
  <div>
    <content-block title="Liquidity you can protect">
      <div
        class="pb-3 mt-3"
        v-for="item in protectableLiquidity"
        :key="item.poolId"
      >
        <b-row>
          <b-col cols="7">
            <div class="d-flex align-items-start">
              <pool-logos-overlapped :pool-id="item.poolId" size="20" />
              <div class="d-flex flex-column ml-2">
                <span
                  v-text="`${item.amount} ${poolName(item.poolId)}`"
                  class="font-size-14 font-w500"
                  :class="darkMode ? 'text-dark' : 'text-light'"
                />
                <span
                  v-text="`(~$${item.usdValue})`"
                  class="font-size-12 font-w400 text-primary"
                />
                <!-- <span
                  v-text="formatDate(item.unixTime).dateTime"
                  class="font-size-12 font-w400"
                  :class="darkMode ? 'text-muted-dark' : 'text-muted-light'"
                /> -->
              </div>
            </div>
          </b-col>

          <b-col cols="5">
            <main-button
              @click="changePool(item.poolId)"
              label="Add Protection"
              :active="true"
            />
          </b-col>
        </b-row>
      </div>
    </content-block>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";
import ContentBlock from "@/components/common/ContentBlock.vue";
import MainButton from "@/components/common/Button.vue";
import PoolLogosOverlapped from "@/components/common/PoolLogosOverlapped.vue";
import { buildPoolName, formatUnixTime } from "@/api/helpers";

@Component({
  components: {
    PoolLogosOverlapped,
    ContentBlock,
    MainButton
  }
})
export default class ProtectableLiquidity extends Vue {
  get protectableLiquidity() {
    return [
      {
        poolId: "0xC42a9e06cEBF12AE96b11f8BAE9aCC3d6b016237",
        amount: 5.123456,
        usdValue: 6754.85,
        unixTime: 1600646400
      },
      {
        poolId: "0xa88Fd7560efc654d86cF3728785f94a8Bc48BDAe",
        amount: 12345.123456,
        usdValue: 6754.85,
        unixTime: 1600506400
      },
      {
        poolId: "0xEe769CE6B4E2C2A079c5f67081225Af7C89F874C",
        amount: 12345.123456,
        usdValue: 6754.85,
        unixTime: 1600506400
      }
    ];
  }

  changePool(id: string) {
    this.$router.push({ name: "AddLiqProtection", params: { id } });
  }

  poolName(id: string): string {
    return buildPoolName(id);
  }

  formatDate(unixTime: number) {
    return formatUnixTime(unixTime);
  }

  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>

<style scoped lang="scss"></style>
