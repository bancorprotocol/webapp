import { createModule, mutation, action } from "vuex-class-component";
import {
  NetworkModule,
  TokenBalanceReturn,
  GetBalanceParam,
  TokenBalanceParam,
  TransferParam,
  TokenBalance
} from "@/types/bancor";
import { getBalance, getTokenBalances, compareString, compareToken, assetToDecNumberString } from "@/api/helpers";
import { vxm } from "@/store";

import _ from "lodash";
import { multiContract } from "@/api/eos/multiContractTx";
import wait from "waait";
import { Asset, number_to_asset, Sym } from "eos-common";


const requiredProps = ["balance", "contract", "symbol"];

const pickBalanceReturn = (data: any): TokenBalanceReturn => {
  const res = _.pick(data, requiredProps);
  if (!res.contract || !res.symbol)
    throw new Error("Failed to parse contract or symbol in pickBalanceReturn");
  // @ts-ignore
  return res;
};

const tokenBalanceToTokenBalanceReturn = (
  token: TokenBalance
): TokenBalanceReturn => ({ ...token, balance: token.amount });

const VuexModule = createModule({
  strict: false
});

const includedInTokens = (tokens: TokenBalanceParam[]) => (
  token: TokenBalanceReturn
) => tokens.some(t => compareToken(token, t));

export class EosNetworkModule
  extends VuexModule.With({ namespaced: "eosNetwork/" })
  implements NetworkModule {
  tokenBalances: TokenBalanceReturn[] = [];

  get balances() {
    return this.tokenBalances;
  }

  get balance() {
    return ({ contract, symbol }: { contract: string; symbol: string }) => {
      return this.balances.find(
        x =>
          compareString(x.symbol, symbol) && compareString(x.contract, contract)
      );
    };
  }

  get isAuthenticated() {
    // @ts-ignore
    return this.$store.rootGetters["eosWallet/isAuthenticated"];
  }

  get networkId() {
    return "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906";
  }

  get protocol() {
    return "eosio";
  }

  @action async pingTillChange({
    originalBalances,
    maxPings = 20,
    interval = 1000
  }: {
    originalBalances: TokenBalanceReturn[];
    maxPings?: number;
    interval?: number;
  }) {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < maxPings; i++) {
        const newBalanceArray = await this.getBalances({
          tokens: originalBalances,
          disableSetting: true
        });
        if (!newBalanceArray) return [];
        const allBalancesDifferent = originalBalances.every(
          balance =>
            newBalanceArray.find(b => compareString(b.symbol, balance.symbol))!.balance !== balance.balance
        );
        if (allBalancesDifferent) {
          this.updateTokenBalances(newBalanceArray);
          break;
        } else {
          await wait(interval);
        }
      }
      resolve();
    });
  }

  @action async transfer({ to, amount, id, memo }: TransferParam) {
    if (!this.isAuthenticated) throw new Error("Not authenticated!")
    const symbol = id;
    const dirtyReserve = vxm.eosBancor.relaysList
      .flatMap(relay => relay.reserves)
      .find(reserve => compareString(reserve.symbol, symbol));
    if (!dirtyReserve) throw new Error("Failed finding dirty reserve");

    const { contract, precision } = dirtyReserve;

    const asset = number_to_asset(amount, new Sym(symbol, precision));

    const actions = await multiContract.tokenTransfer(contract, {
      to,
      quantity: asset.to_string(),
      memo
    });

    const originalBalances = await this.getBalances({
      tokens: [{ contract, symbol }]
    });
    await vxm.eosWallet.tx(actions);
    this.pingTillChange({ originalBalances });
  }

  @action async fetchBulkBalances(
    tokens: GetBalanceParam["tokens"]
  ): Promise<TokenBalanceReturn[]> {
    const balances = await Promise.all(
      tokens.map(async token => {
        const balance = await getBalance(token.contract, token.symbol, token.precision);
        return { ...token, balance: assetToDecNumberString(new Asset(balance)) };
      })
    );
    return balances;
  }

  @mutation clearBalances() {
    this.tokenBalances = [];
  }

  @action async resetBalances() {
    this.clearBalances();
  }


  @action public async getBalances(params?: GetBalanceParam) {
    if (!this.isAuthenticated) throw new Error("Not logged in.");

    if (!params || params?.tokens?.length == 0) {
      const tokensToFetch = this.balances;

      const [directTokens, bonusTokens] = await Promise.all([
        this.fetchBulkBalances(tokensToFetch),
        getTokenBalances(this.isAuthenticated).catch(() => ({
          tokens: [] as TokenBalance[]
        }))
      ]);

      const equalisedBalances = bonusTokens.tokens.map(
        tokenBalanceToTokenBalanceReturn
      );
      const merged = _.uniqWith(
        [...directTokens, ...equalisedBalances],
        compareToken
      );
      this.updateTokenBalances(merged);
      return merged
    }

    const tokensAskedFor = params!.tokens;

    if (params?.slow) {
      const bulkTokens = await getTokenBalances(this.isAuthenticated);
      const equalisedBalances = bulkTokens.tokens.map(
        tokenBalanceToTokenBalanceReturn
      );
      this.updateTokenBalances(equalisedBalances);
      const missedTokens = _.differenceWith(
        tokensAskedFor,
        equalisedBalances,
        compareToken
      );
      const remainingBalances = await this.fetchBulkBalances(missedTokens);
      this.updateTokenBalances(remainingBalances);
      return [...equalisedBalances, ...remainingBalances].filter(
        includedInTokens(tokensAskedFor)
      );
    }

    const [directTokens, bonusTokens] = await Promise.all([
      this.fetchBulkBalances(tokensAskedFor),
      getTokenBalances(this.isAuthenticated).catch(() => ({
        tokens: [] as TokenBalance[]
      }))
    ]);

    const allTokensReceived = tokensAskedFor.every(fetchableToken =>
      directTokens.some(fetchedToken =>
        compareToken(fetchableToken, fetchedToken)
      )
    );
    console.assert(
      allTokensReceived,
      "fetch bulk balances failed to return all tokens asked for!"
    );

    const equalisedBalances: TokenBalanceReturn[] = bonusTokens.tokens.map(
      tokenBalanceToTokenBalanceReturn
    );
    const merged = _.uniqWith(
      [...directTokens, ...equalisedBalances],
      compareToken
    );
    if (!params.disableSetting) {
      this.updateTokenBalances(merged);
    }
    return directTokens.filter(includedInTokens(tokensAskedFor));
  }

  @mutation updateTokenBalances(tokens: TokenBalanceReturn[]) {
    const toSet = _.uniqWith(
      [...tokens.map(pickBalanceReturn), ...this.tokenBalances],
      compareToken
    );
    this.tokenBalances = toSet;
  }
}
