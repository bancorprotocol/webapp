<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class"

const general = namespace("general");
const bancor = namespace("bancor");
const wallet = namespace("wallet");

@Component
export default class BaseComponent extends Vue {
  @bancor.State currentNetwork!: string;
  @general.State darkMode!: boolean;
  @wallet.State currentUser!: string;
}
</script>
