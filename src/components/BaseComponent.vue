<script lang="ts">
import { State, Getter } from "vuex-class";
import { prettifyNumber } from "@/api/pureHelpers";
import { Vue } from "vue-class-component/dist/vue-class-component"

export default class BaseComponent extends Vue {
  @Getter("currentNetwork", {namespace: "bancor"})
  currentNetwork!: string;

  @State("darkMode", {namespace: "general"})
  darkMode!: boolean;

  @Getter("currentUser", {namespace: "wallet"})
  currentUser!: string;

  prettifyNumber = prettifyNumber;
}
</script>