import { createModule, action, mutation } from "vuex-class-component";
import {
  ProposedConvertTransaction,
  LiquidityParams,
  OpposingLiquidParams,
  ModalChoice,
  NetworkChoice,
  FeeParams,
  NewOwnerParams,
  HistoryRow,
  ProposedToTransaction,
  ProposedFromTransaction,
  ModuleParam,
  UserPoolBalances,
  OpposingLiquid,
  PoolTokenPosition,
  ViewRelay,
  ViewToken,
  LiquidityModule,
  ConvertReturn
} from "@/types/bancor";
import { vxm, store } from "@/store";
import {
  compareString,
  updateArray,
  fetchBinanceUsdPriceOfBnt
} from "@/api/helpers";
import { defaultModule } from "@/router";

interface BntPrice {
  price: null | number;
  lastChecked: number;
}

const VuexModule = createModule({
  strict: false
});

interface RootParam {
  initialModuleParam?: ModuleParam;
  initialChain?: string;
}

const moduleIds: { label: string; id: string }[] = [
  {
    label: "EOS",
    id: "eos"
  },
  {
    label: "ETH",
    id: "eth"
  }
];

interface Module {
  id: string;
  label: string;
  loading: boolean;
  loaded: boolean;
  error: boolean;
}

const slippageTolerance = "SLIPPAGE_TOLERANCE";
export class BancorModule extends VuexModule.With({
  namespaced: "bancor/"
}) {
  usdPriceOfBnt: BntPrice = {
    price: null,
    lastChecked: 0
  };
  modules: Module[] = moduleIds.map(({ id, label }) => ({
    id,
    label,
    loading: false,
    loaded: false,
    error: false
  }));

  slippageTolerance = 0.005;

  @mutation setTolerance(tolerance: number) {
    this.slippageTolerance = tolerance;
  }

  @action async setSlippageTolerance(tolerance: number) {
    this.setTolerance(tolerance);
    localStorage.setItem(slippageTolerance, String(tolerance));
  }

  get currentNetwork() {
    // @ts-ignore
    if (
      // @ts-ignore
      store.state.routeModule &&
      // @ts-ignore
      store.state.routeModule.params &&
      // @ts-ignore
      store.state.routeModule.params.service
    ) {
      // @ts-ignore
      return store.state.routeModule.params.service;
    } else {
      return defaultModule;
    }
  }

  get liquidityHistory(): LiquidityModule["liquidityHistory"] {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["liquidityHistory"];
  }

  get tokens(): ViewToken[] {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["tokens"];
  }

  get supportedFeatures() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["supportedFeatures"];
  }

  get token(): (tokenId: string) => ViewToken {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["token"];
  }

  get relays(): ViewRelay[] {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["relays"];
  }

  get moreTokensAvailable() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["moreTokensAvailable"];
  }

  get tokenBalance() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["tokenBalance"];
  }

  get loadingTokens() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["loadingTokens"];
  }

  get newPoolTokenChoices(): (networkTokenSymbol: string) => ModalChoice[] {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["newPoolTokenChoices"];
  }

  get newNetworkTokenChoices(): NetworkChoice[] {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["newNetworkTokenChoices"];
  }

  get relay() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["relay"];
  }

  get primaryReserveChoices() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["primaryReserveChoices"];
  }

  get secondaryReserveChoices() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["secondaryReserveChoices"];
  }

  get morePoolsAvailable() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["morePoolsAvailable"];
  }

  get loadingPools() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["loadingPools"];
  }

  get wallet() {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["wallet"];
  }

  get stats(): LiquidityModule["stats"] {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["stats"];
  }

  get poolTokenPositions(): PoolTokenPosition[] {
    // @ts-ignore
    return vxm[`${this.currentNetwork}Bancor`]["poolTokenPositions"];
  }

  @mutation updateModule({
    id,
    updater
  }: {
    id: string;
    updater: (module: Module) => Module;
  }) {
    const newModules = updateArray(
      this.modules,
      module => compareString(id, module.id),
      updater
    );
    this.modules = newModules;
  }

  @action async moduleInitialised(id: string) {
    this.updateModule({
      id,
      updater: module => ({
        ...module,
        loaded: true,
        loading: false,
        error: false
      })
    });
  }

  @action async moduleThrown(id: string) {
    this.updateModule({
      id,
      updater: module => ({
        ...module,
        loaded: false,
        loading: false,
        error: true
      })
    });
  }

  @action async moduleInitalising(id: string) {
    this.updateModule({
      id,
      updater: module => ({ ...module, loading: true })
    });
  }

  @action async initialiseModule({
    moduleId,
    params,
    resolveWhenFinished = false
  }: {
    moduleId: string;
    params?: ModuleParam;
    resolveWhenFinished: boolean;
  }) {
    this.moduleInitalising(moduleId);
    const tolerance = localStorage.getItem(slippageTolerance);
    if (tolerance) {
      this.setTolerance(Number(tolerance));
    }
    if (resolveWhenFinished) {
      try {
        await this.$store.dispatch(`${moduleId}Bancor/init`, params || null, {
          root: true
        });
        this.moduleInitialised(moduleId);
      } catch (e) {
        this.moduleThrown(moduleId);
      }
    } else {
      try {
        this.$store
          .dispatch(`${moduleId}Bancor/init`, params || null, {
            root: true
          })
          .then(() => this.moduleInitialised(moduleId));
      } catch (e) {
        this.moduleThrown(moduleId);
      }
    }
  }

  @action async init(param?: RootParam) {
    if (param && param.initialChain && param.initialModuleParam) {
      return this.initialiseModule({
        moduleId: param.initialChain,
        params: param.initialModuleParam,
        resolveWhenFinished: true
      });
    } else {
      return Promise.all(
        this.modules
          .map(module => module.id)
          .map(moduleId =>
            this.initialiseModule({
              moduleId,
              resolveWhenFinished: moduleId == "eth"
            })
          )
      );
    }
  }

  @action async getUsdPrice() {
    try {
      const usdPrice = await fetchBinanceUsdPriceOfBnt();
      this.setUsdPriceOfBnt({
        price: usdPrice,
        lastChecked: Date.now()
      });
      return usdPrice;
    } catch (e) {
      throw new Error(
        `Failed to find USD Price of BNT from External API & Relay ${e.message}`
      );
    }
  }

  @action async fetchUsdPriceOfBnt() {
    const timeNow = new Date().getTime();
    const millisecondGap = 5000;
    const makeNetworkRequest =
      !this.usdPriceOfBnt.lastChecked ||
      this.usdPriceOfBnt.lastChecked + millisecondGap < timeNow;
    return makeNetworkRequest
      ? this.getUsdPrice()
      : (this.usdPriceOfBnt.price as number);
  }

  @mutation setUsdPriceOfBnt(usdPriceOfBnt: BntPrice) {
    this.usdPriceOfBnt = usdPriceOfBnt;
  }

  @action async fetchHistoryData(relayId: string): Promise<HistoryRow[]> {
    return this.dispatcher(["fetchHistoryData", relayId]);
  }

  @action async convert(tx: ProposedConvertTransaction) {
    return this.dispatcher(["convert", tx]);
  }

  @action async updateFee(fee: FeeParams) {
    return this.dispatcher(["updateFee", fee]);
  }

  @action async loadMorePools() {
    return this.dispatcher(["loadMorePools"]);
  }

  @action async removeRelay(symbolName: string) {
    return this.dispatcher(["removeRelay", symbolName]);
  }

  @action async updateOwner(owner: NewOwnerParams) {
    return this.dispatcher(["updateOwner", owner]);
  }

  @action async getUserBalances(relayId: string): Promise<UserPoolBalances> {
    return this.dispatcher(["getUserBalances", relayId]);
  }

  @action async createPool(newPoolParams: any): Promise<string> {
    return this.dispatcher(["createPool", newPoolParams]);
  }

  @action async getCost(proposedTransaction: ProposedToTransaction) {
    return this.dispatcher(["getCost", proposedTransaction]);
  }

  @action async getReturn(
    proposedTransaction: ProposedFromTransaction
  ): Promise<ConvertReturn> {
    return this.dispatcher(["getReturn", proposedTransaction]) as Promise<
      ConvertReturn
    >;
  }

  @action async addLiquidity(addLiquidityParams: LiquidityParams) {
    return this.dispatcher(["addLiquidity", addLiquidityParams]);
  }

  @action async removeLiquidity(removeLiquidityParams: LiquidityParams) {
    return this.dispatcher(["removeLiquidity", removeLiquidityParams]);
  }

  @action async calculateOpposingDeposit(
    opposingDeposit: OpposingLiquidParams
  ) {
    return this.dispatcher(["calculateOpposingDeposit", opposingDeposit]);
  }

  @action async calculateOpposingWithdraw(
    opposingWithdraw: OpposingLiquidParams
  ): Promise<OpposingLiquid> {
    return this.dispatcher(["calculateOpposingWithdraw", opposingWithdraw]);
  }

  @action async focusSymbol(symbolName: string) {
    return this.dispatcher(["focusSymbol", symbolName]);
  }

  @action async dispatcher([methodName, params]: [string, any?]) {
    return params
      ? this.$store.dispatch(
          `${this.currentNetwork}Bancor/${methodName}`,
          params,
          { root: true }
        )
      : this.$store.dispatch(
          `${this.currentNetwork}Bancor/${methodName}`,
          null,
          { root: true }
        );
  }

  @action async refreshBalances(symbols: string[] = []) {
    if (vxm.wallet.currentUser) {
      return this.dispatcher(["refreshBalances", symbols]);
    }
  }

  @action async checkPriceDeviationTooHigh({
    relayId,
    selectedTokenAddress
  }: {
    relayId: string;
    selectedTokenAddress: string;
  }) {
    return this.dispatcher([
      "checkPriceDeviationTooHigh",
      { relayId, selectedTokenAddress }
    ]);
  }
}
