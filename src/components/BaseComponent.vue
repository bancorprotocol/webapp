<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Getter } from "vuex-class";
import { prettifyNumber } from "@/api/pureHelpers";

@Component
export default class BaseComponent extends Vue {
  @Getter("currentNetwork", { namespace: "bancor" })
  currentNetwork!: string;

  @State("darkMode", { namespace: "general" })
  darkMode!: boolean;

  @Getter("currentUser", { namespace: "wallet" })
  currentUser!: string;

  prettifyNumber = prettifyNumber;
}
</script>
