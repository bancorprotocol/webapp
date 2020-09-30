<template>
  <div class="px-4 pt-4 border-top">
    <b-row>
      <b-col md="6">
        <sub-content-block title="Available to claim">
          <claim-bnt v-for="item in available" :key="item.id" :item="item" />
          <div v-if="!available.length" class="no-claim-results">
            No BNT to claim.
          </div>
        </sub-content-block>
      </b-col>
      <b-col md="6">
        <sub-content-block title="Locked">
          <claim-bnt v-for="item in locked" :key="item.id" :item="item" />
          <div v-if="!locked.length" class="no-claim-results">
            No BNT locked.
          </div>
        </sub-content-block>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SubContentBlock from "@/components/common/SubContentBlock.vue";
import ClaimBnt from "@/components/protection/ClaimBnt.vue";
import moment from "moment";

@Component({
  components: { ClaimBnt, SubContentBlock }
})
export default class Claim extends Vue {
  @Prop({ default: "" }) search!: string;

  now = Date.now() / 1000;

  get available() {
    return this.claim.filter(x => x.lockedUntil < this.now);
  }

  get locked() {
    return this.claim.filter(x => x.lockedUntil > this.now);
  }

  get claim() {
    return [
      {
        id: 0,
        amount: 5480.75438,
        usdValue: 759.69,
        lockedUntil: 1601483050
      },
      {
        id: 1,
        amount: 5480.75438,
        usdValue: 759.69,
        lockedUntil: 1601482000
      },
      {
        id: 2,
        amount: 5480.75438,
        usdValue: 759.69,
        lockedUntil: 1601482000
      },
      {
        id: 3,
        amount: 5480.75438,
        usdValue: 759.69,
        lockedUntil: 1601688926
      },
      {
        id: 4,
        amount: 5480.75438,
        usdValue: 759.69,
        lockedUntil: 1601481618
      },
      {
        id: 5,
        amount: 5480.75438,
        usdValue: 759.69,
        lockedUntil: 1601688926
      }
    ];
  }

  created() {
    setInterval(() => {
      this.now = Date.now() / 1000;
    }, 1000);
  }
}
</script>

<style lang="scss">
.no-claim-results {
  display: flex;
  justify-content: center;
  padding: 25px 10px;
}
</style>
