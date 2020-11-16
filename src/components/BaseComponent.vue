<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "@/store";

@Component
export default class BaseComponent extends Vue {
  get darkMode() {
    return vxm.general.darkMode;
  }
}
</script>
