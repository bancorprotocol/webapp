<template>
  <b-modal
    id="modal-select"
    scrollable
    :visible="value"
    size="md"
    @change="onChange"
    centered
    hide-header
    hide-footer
    :content-class="darkMode ? 'bg-block-dark' : 'bg-block-light'"
  >
    <div>
      <b-row>
        <b-col class="d-flex justify-content-between mb-3">
          <h5
            class="m-0"
            :class="darkMode ? 'text-body-dark' : 'text-body-light'"
          >
            Select Token
          </h5>
          <span
            @click="onChange(false)"
            class="cursor font-size-sm font-w400 d-flex align-items-center"
            :class="darkMode ? 'text-body-dark' : 'text-body-light'"
          >
            Cancel
            <font-awesome-icon icon="times" size="2x" class="ml-2" />
          </span>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="px-4">
          <b-input-group>
            <b-form-input
              v-model="tokenSearch"
              placeholder="Search"
              class="form-control-alt"
            ></b-form-input>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mx-0 mb-4">
        <b-col
          md="6"
          sm="12"
          v-if="filterable"
          lg="4"
          class="d-flex align-items-center py-2"
        >
          <span class="mr-2">Filter:</span>
          <b-dropdown size="sm" id="dropdown-1" :text="filter" class="m-md-2">
            <b-dropdown-item @click="setFilter('All')">All</b-dropdown-item>
            <b-dropdown-item @click="setFilter('Tokens')"
              >Tokens</b-dropdown-item
            >
            <b-dropdown-item @click="setFilter('Relays')"
              >Relays</b-dropdown-item
            >
          </b-dropdown>
        </b-col>
      </b-row>
      <b-row class="d-flex align-items-center mx-0">
        <b-col
          sm="12"
          md="6"
          lg="6"
          v-for="token in searchedTokens"
          :key="token.id"
          @click="setToken(token.id)"
        >
          <token-balance-block
            :dark="darkMode"
            :symbol="token.symbol"
            :balance="token.balance"
            :img="token.img"
            :v2="token.v2"
          />
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue, Emit } from "vue-property-decorator";
import { vxm } from "@/store/";
import { TokenPrice } from "@/types/bancor";
import TokenBalanceBlock from "@/components/common/TokenBalanceBlock.vue";
const debounce = require("lodash.debounce");

@Component({
  components: { TokenBalanceBlock }
})
export default class ModalSelect extends Vue {
  @Prop(Boolean) value!: boolean;
  @Prop(Array) tokens!: any[];
  @Prop(Boolean) filterable!: boolean;

  onChange(value: boolean) {
    this.$emit("input", value);
  }

  get darkMode() {
    return vxm.general.darkMode;
  }

  private tokenSearch: String = "";
  private searchOptions = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 24,
    minMatchCharLength: 1,
    keys: ["symbol"]
  };
  searchResults: any = [];
  private searchState: string = "search";
  public debouncedGetSearch: any;
  filter: string = "All";
  relayBalances: any[] = [];

  get searchedTokens() {
    return this.tokenSearch
      ? this.tokens.filter(token =>
          token.symbol.toLowerCase().includes(this.tokenSearch.toLowerCase())
        )
      : this.tokens;
  }

  @Emit("onSelect")
  setToken(id: string) {
    return id;
  }

  searchTokens() {
    // @ts-ignore
    this.$search(this.tokenSearch, this.relayBalances, this.searchOptions).then(
      (results: any) => {
        this.searchResults = results;
        if (this.tokenSearch === "") this.searchState = "search";
        else this.searchState = "check";
      }
    );
  }

  setFilter(f: string) {
    this.filter = f;
  }

  @Watch("tokenSearch")
  async onSearchChange(val: any, oldVal: any) {
    if (val !== "") {
      this.searchState = "keyboard";
      this.debouncedGetSearch();
    } else {
      this.searchTokens();
    }
  }

  created() {
    this.debouncedGetSearch = debounce(() => {
      this.searchTokens();
    }, 500);
  }
}
</script>
<style lang="scss" scoped>
#select-token {
  margin-right: 12px;
}

.modal-content {
  // min-height: 49vh;
  // height: 50vh;
  // max-height: 51vh;
  // overflow: scroll;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.ffs {
  display: flex;
  width: 100%;
  justify-content: space-between;
  min-height: 65px;
  height: 65px;
}
// min-height: 65px;

.left {
  display: flex;
  align-items: baseline;
}

@keyframes fa-blink {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 0.25;
  }
  50% {
    opacity: 0.5;
  }
  75% {
    opacity: 0.75;
  }
  100% {
    opacity: 0;
  }
}
.fa-blink {
  -webkit-animation: fa-blink 0.55s linear infinite;
  -moz-animation: fa-blink 0.55s linear infinite;
  -ms-animation: fa-blink 0.55s linear infinite;
  -o-animation: fa-blink 0.55s linear infinite;
  animation: fa-blink 0.55s linear infinite;
}
</style>
