<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class BaseComponent extends Vue {
  get currentNetwork() {
    return vxm.bancor.currentNetwork;
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  get currentUser() {
    return vxm.wallet.currentUser;
  }
}
</script>
