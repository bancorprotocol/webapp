import { createModule, mutation, action } from "vuex-class-component";
import {
  NetworkModule,
  TokenBalanceReturn,
  GetBalanceParam,
  TokenBalanceParam,
  TransferParam
} from "@/types/bancor";
import {
  compareString,
  compareToken,
  assetToDecNumberString
} from "@/api/helpers";
import { vxm } from "@/store";
import _, { differenceWith } from "lodash";
import { multiContract } from "@/api/eos/multiContractTx";
import wait from "waait";
import { Asset, number_to_asset, Sym } from "eos-common";
import { dfuseClient, rpc } from "@/api/eos/rpc";

export const getTokenBalancesDfuse = async (
  accountName: string
): Promise<TokenBalanceReturn[]> => {
  try {
    const res = await dfuseClient.graphql<{
      accountBalances: {
        edges: {
          node: {
            account: string;
            contract: string;
            symbol: string;
            precision: number;
            balance: string;
          };
        }[];
      };
    }>(
      `
      query($account: String!, $limit: Uint32, $opts: [ACCOUNT_BALANCE_OPTION!]) {
        accountBalances(account: $account,limit: $limit, options: $opts) {
          edges {
            node {
              account
              contract
              symbol
              precision
              balance
            }
          }
        }
      }`,
      {
        variables: {
          account: accountName,
          opts: ["EOS_INCLUDE_STAKED"],
          limit: 90
        }
      }
    );
    const tokens = res.data.accountBalances.edges.map(item => item.node);
    const userTokens = tokens.filter(token =>
      compareString(token.account, accountName)
    );

    return userTokens.map(token => ({
      balance: assetToDecNumberString(new Asset(token.balance)),
      contract: token.contract,
      symbol: token.symbol,
      precision: token.precision
    }));
  } catch (e) {
    throw new Error("Failed to fetch tokens dFuse");
  }
};

const requiredProps = ["balance", "contract", "symbol"];

const pickBalanceReturn = (data: any): TokenBalanceReturn => {
  const res = _.pick(data, requiredProps);
  if (!res.contract || !res.symbol)
    throw new Error("Failed to parse contract or symbol in pickBalanceReturn");
  // @ts-ignore
  return res;
};

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

  get currentUser() {
    // @ts-ignore
    return this.$store.rootGetters["eosWallet/currentUser"];
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
    return new Promise<void>(async resolve => {
      for (let i = 0; i < maxPings; i++) {
        const newBalanceArray = await this.getBalances({
          tokens: originalBalances,
          disableSetting: true
        });
        if (!newBalanceArray) return [];
        const allBalancesDifferent = originalBalances.every(
          balance =>
            newBalanceArray.find(b => compareString(b.symbol, balance.symbol))!
              .balance !== balance.balance
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
    if (!this.currentUser) throw new Error("Not authenticated!");
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

  @action async getTokenBalancesRpc({
    tokens,
    currentUser
  }: {
    tokens: TokenBalanceParam[];
    currentUser: string;
  }): Promise<TokenBalanceReturn[]> {
    const res = await Promise.all(
      tokens.map(
        async (token): Promise<TokenBalanceReturn | false> => {
          try {
            const response = (await rpc.get_table_rows({
              json: true,
              code: token.contract,
              table: "accounts",
              scope: currentUser
            })) as { rows: any[] };
            console.log(response, "was response");
            const foundToken = response.rows[0];
            if (!foundToken) {
              if (token.precision) {
                return {
                  ...token,
                  precision: token.precision!,
                  balance: number_to_asset(
                    0,
                    new Sym(token.symbol, token.precision)
                  ).to_string()
                };
              } else {
                return false;
              }
            }
            const asset = new Asset(foundToken.balance);
            return {
              ...token,
              balance: foundToken.balance,
              precision: asset.symbol.precision()
            };
          } catch (e) {
            console.error(`Error in fetching rpc ${e}`);
            return false;
          }
        }
      )
    );

    return res.filter(Boolean) as TokenBalanceReturn[];
  }

  @action async fetchBulkBalances(
    tokens: GetBalanceParam["tokens"]
  ): Promise<TokenBalanceReturn[]> {
    const currentUser = this.currentUser;
    const bulkBalances = await getTokenBalancesDfuse(currentUser).catch(
      () => [] as TokenBalanceReturn[]
    );

    const missingTokens = differenceWith(tokens, bulkBalances, compareToken);

    if (missingTokens.length == 0) return bulkBalances;

    let extraBalances: TokenBalanceReturn[] = [];
    try {
      const bulkRequested = await dfuseClient.stateTablesForAccounts<{
        balance: string;
      }>(
        missingTokens.map(x => x.contract),
        currentUser,
        "accounts"
      );
      const dfuseParsed = bulkRequested.tables
        .filter(table => table.rows.length > 0)
        .flatMap(table => ({
          contract: table.account,
          balance: table.rows[0].json!.balance
        }));
      extraBalances = dfuseParsed.map(
        (json): TokenBalanceReturn => {
          const asset = new Asset(json.balance);
          return {
            balance: assetToDecNumberString(asset),
            contract: json.contract,
            symbol: asset.symbol.code().to_string(),
            precision: asset.symbol.precision()
          };
        }
      );
    } catch (e) {}

    const missingTokensTwo = differenceWith(
      extraBalances,
      missingTokens,
      compareToken
    );

    const extraBalancesRpc = await this.getTokenBalancesRpc({
      tokens: missingTokensTwo,
      currentUser
    });

    return [...bulkBalances, ...extraBalances, ...extraBalancesRpc];
  }

  @mutation clearBalances() {
    this.tokenBalances = [];
  }

  @action async resetBalances() {
    this.clearBalances();
  }

  @action public async getBalances(params?: GetBalanceParam) {
    if (!this.currentUser) throw new Error("Not logged in.");

    if (!params || params?.tokens?.length == 0) {
      const tokensToFetch = this.balances;

      const fetchedTokens = await this.fetchBulkBalances(tokensToFetch);
      this.updateTokenBalances(fetchedTokens);
      return fetchedTokens;
    }

    const tokensAskedFor = params!.tokens;

    const directTokens = await this.fetchBulkBalances(tokensAskedFor);

    const allTokensReceived = tokensAskedFor.every(fetchableToken =>
      directTokens.some(fetchedToken =>
        compareToken(fetchableToken, fetchedToken)
      )
    );
    console.assert(
      allTokensReceived,
      "fetch bulk balances failed to return all tokens asked for!"
    );

    if (!params.disableSetting) {
      this.updateTokenBalances(directTokens);
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
