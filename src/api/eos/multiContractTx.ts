import { vxm } from "@/store/";
import { multiContractAction, SemiAction } from "@/contracts/multi";
import { TokenAmount } from "@/api/eos/eosBancorCalc";
import { Asset } from "eos-common";

type TxResponse = any;

interface Auth {
  actor: string;
  permission: string;
}

type GetAuth = () => Auth[];

class MultiContractTx {
  contractName: string;
  getAuth: GetAuth;
  triggerTx: any;

  constructor(contractName: string, getAuth: GetAuth) {
    this.contractName = contractName;
    this.getAuth = getAuth;
  }

  async tx(actions: SemiAction[]) {
    const authedActions = actions.map((action: SemiAction) => ({
      ...action,
      authorization: this.getAuth()
    }));
    return authedActions;
  }

  openActions(contract: string, symbol: string, owner: string, payer = owner) {
    return this.tx([
      {
        account: contract,
        name: "open",
        data: {
          owner,
          symbol,
          ram_payer: payer
        }
      }
    ]);
  }

  deleteReserve(symbolCode: string, currency: string): Promise<TxResponse> {
    const action = multiContractAction.delreserve(
      symbolCode,
      currency
    ) as SemiAction;
    return this.tx([action]);
  }

  setReserveAction(
    symbolCode: string,
    symbol: string,
    tokenContract: string,
    ratio: number
  ): SemiAction {
    const adjustedRatio = ratio * 10000;
    const action = multiContractAction.setreserve(
      symbolCode,
      symbol,
      tokenContract,
      adjustedRatio
    ) as SemiAction;
    return action;
  }

  setReserve(
    symbolCode: string,
    symbol: string,
    tokenContract: string,
    saleEnabled: boolean,
    ratio: number
  ): Promise<TxResponse> {
    const action = this.setReserveAction(
      symbolCode,
      symbol,
      tokenContract,
      ratio
    ) as SemiAction;
    return this.tx([action]);
  }

  convert(tokenContract: string, amount: Asset, memo: string) {
    const action = {
      account: tokenContract,
      name: "transfer",
      data: {
        from: this.getAuth()[0].actor,
        to: process.env.VUE_APP_NETWORKCONTRACT,
        quantity: amount.to_string(),
        memo
      }
    };
    return this.tx([action]);
  }

  nukeRelayAction(symbolName: string, reserves: string[]) {
    const deleteReserveActions = reserves.map(reserveSymbolCode =>
      multiContractAction.delreserve(symbolName, reserveSymbolCode)
    ) as SemiAction[];
    const deleteRelayAction = multiContractAction.delconverter(symbolName);
    return [...deleteReserveActions, deleteRelayAction];
  }

  updateFeeAction(symbolCode: string, decimalPercent: number): any {
    return multiContractAction.updatefee(symbolCode, decimalPercent * 1000000);
  }

  updateOwnerAction(symbolCode: string, owner: string): any {
    const action = multiContractAction.updateowner(
      symbolCode,
      owner
    ) as SemiAction;
    return action;
  }

  fund(quantity: string) {
    const action = multiContractAction.fund(
      this.getAuth()[0].actor,
      quantity
    ) as SemiAction;
    return this.tx([action]);
  }

  enableConversionAction(symbolCode: string, enabled: boolean) {
    const action = multiContractAction.enablecnvrt(
      symbolCode,
      enabled
    ) as SemiAction;
    return action;
  }

  createRelay(symbol: string, initialSupply: number): Promise<TxResponse> {
    const owner = this.getAuth()[0].actor;
    const action = multiContractAction.create(
      owner,
      symbol,
      initialSupply
    ) as SemiAction;
    return this.tx([action]);
  }

  setupTransfer(
    tokenContract: string,
    amountString: string,
    symbolCode: string
  ) {
    return this.tx([
      {
        account: tokenContract,
        name: "transfer",
        data: {
          from: this.getAuth()[0].actor,
          to: this.contractName,
          quantity: amountString,
          memo: `setup;${symbolCode}`
        }
      }
    ]);
  }

  // Creates a relay, adds liquidity and immediately
  // hits enableconvrt action regardless of whether or not it should run
  // purely to put it in 'launched' mode to ensure further liquidity is
  // correctly imbursed
  kickStartRelay(
    symbolCode: string,
    reserves: TokenAmount[],
    initialSupply: number,
    fee: number
  ) {
    if (reserves.length !== 2)
      throw new Error("Reserves of two is only supported with this method");
    if (fee < 0) throw new Error("Fee cannot be less than zero");
    const createRelayAction = multiContractAction.create(
      this.getAuth()[0].actor,
      symbolCode,
      initialSupply
    ) as SemiAction;

    const setReserveActions = reserves.map((reserve: TokenAmount) =>
      this.setReserveAction(
        symbolCode,
        `${reserve.amount.symbol.precision()},${reserve.amount.symbol
          .code()
          .to_string()}`,
        reserve.contract,
        50
      )
    );
    const addLiquidityActions = this.addLiquidityActions(symbolCode, reserves);

    const actions: any[] = [
      createRelayAction,
      ...setReserveActions,
      ...addLiquidityActions
    ];

    if (fee > 0) {
      actions.push(this.updateFeeAction(symbolCode, fee));
    }

    return this.tx(actions);
  }

  withdrawAction(symbolCode: string, amount: Asset) {
    const owner = this.getAuth()[0].actor;

    const action = multiContractAction.withdraw(
      owner,
      amount.to_string(),
      symbolCode
    ) as SemiAction;
    return action;
  }

  withdraw(symbolCode: string, amount: Asset) {
    return this.tx([this.withdrawAction(symbolCode, amount)]);
  }

  addLiquidity(symbolCode: string, tokens: TokenAmount[]) {
    return this.tx(this.addLiquidityActions(symbolCode, tokens));
  }

  removeLiquidityAction(quantity: Asset) {
    return {
      account: process.env.VUE_APP_SMARTTOKENCONTRACT!,
      name: "transfer",
      data: {
        from: this.getAuth()[0].actor,
        to: this.contractName,
        quantity: quantity.to_string(),
        memo: "liquidate;"
      }
    };
  }

  addLiquidityActions(symbolCode: string, tokens: TokenAmount[]) {
    return tokens.map((token: TokenAmount) => ({
      account: token.contract,
      name: `transfer`,
      data: {
        from: this.getAuth()[0].actor,
        to: this.contractName,
        // @ts-ignore
        quantity: token.amount.to_string(),
        memo: `fund;${symbolCode}`
      }
    }));
  }

  fundTransfer(
    tokenContract: string,
    amountString: string,
    symbolCode: string
  ) {
    return this.tx([
      {
        account: tokenContract,
        name: `transfer`,
        data: {
          from: this.getAuth()[0].actor,
          to: this.contractName,
          quantity: amountString,
          memo: `fund;${symbolCode}`
        }
      }
    ]);
  }

  tokenTransfer(
    tokenContract: string,
    transferParams: {
      to: string;
      quantity: string;
      memo?: string;
    }
  ) {
    return this.tx([
      {
        account: tokenContract,
        name: "transfer",
        data: {
          from: this.getAuth()[0].actor,
          to: transferParams.to,
          quantity: transferParams.quantity,
          memo: transferParams.memo || ""
        }
      }
    ]);
  }
}

const getAuth: GetAuth = () => {
  const wallet = vxm.eosWallet.wallet;
  return [
    {
      // @ts-ignore
      actor: wallet.auth.accountName,
      // @ts-ignore
      permission: wallet.auth.permission
    }
  ];
};

export const multiContract = new MultiContractTx(
  process.env.VUE_APP_MULTICONTRACT!,
  getAuth
);
