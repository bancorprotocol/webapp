<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class BaseComponent extends Vue {
  get darkMode(): boolean {
    return vxm.general.darkMode;
  }

  get currentUser(): string {
    return vxm.wallet.currentUser;
  }

  get currentNetwork(): string {
    return vxm.bancor.currentNetwork;
  }
}
</script>
