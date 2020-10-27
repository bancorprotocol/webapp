<template>
  <div class="px-4 pt-4 border-top">
    <div>
      {{ jsonDump }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SubContentBlock from "@/components/common/SubContentBlock.vue";
import ClaimBnt from "@/components/protection/ClaimBnt.vue";
import moment from "moment";
import { vxm } from "@/store";
import ModalBase from "@/components/modals/ModalBase.vue";
import ActionModalStatus from "@/components/common/ActionModalStatus.vue";
import MainButton from "@/components/common/Button.vue";
import { TxResponse } from "@/types/bancor";

@Component({
  components: {
    ActionModalStatus,
    ModalBase,
    ClaimBnt,
    SubContentBlock,
    MainButton
  }
})
export default class WhitelistedPools extends Vue {
  get relays() {
    return vxm.ethBancor.relays.filter(x => x.whitelisted);
  }

  get jsonDump() {
    return JSON.stringify(this.relays, null, 10);
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
