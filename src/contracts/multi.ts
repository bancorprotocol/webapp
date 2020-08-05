export interface BareAction {
  name: string;
  data: any;
}

export interface SemiAction extends BareAction {
  account: string;
}

class MultiContractAction {
  contractName?: string;

  constructor(contractName?: string) {
    this.contractName = contractName;
  }

  addAccountProperty(action: BareAction): BareAction | SemiAction {
    return this.contractName
      ? {
          ...action,
          account: this.contractName
        }
      : action;
  }

  delreserve(converter: string, reserve: string): BareAction | SemiAction {
    return this.addAccountProperty({
      name: "delreserve",
      data: {
        converter,
        reserve
      }
    });
  }

  setreserve(
    converter_currency_code: string,
    currency: string,
    contract: string,
    ratio: number
  ): BareAction | SemiAction {
    return this.addAccountProperty({
      name: "setreserve",
      data: {
        converter_currency_code,
        currency,
        contract,
        ratio
      }
    });
  }

  withdraw(sender: string, quantity: string, converter_currency_code: string) {
    return this.addAccountProperty({
      name: "withdraw",
      data: {
        sender,
        quantity,
        converter_currency_code
      }
    });
  }

  updateowner(currency: string, owner: string): BareAction | SemiAction {
    return this.addAccountProperty({
      name: "updateowner",
      data: {
        currency,
        new_owner: owner
      }
    });
  }

  delconverter(converter_currency_code: string) {
    return this.addAccountProperty({
      name: "delconverter",
      data: { converter_currency_code }
    });
  }

  fund(sender: string, quantity: string): BareAction | SemiAction {
    return this.addAccountProperty({
      name: "fund",
      data: {
        sender,
        quantity
      }
    });
  }

  enablecnvrt(currency: string, enabled: boolean): BareAction | SemiAction {
    return this.addAccountProperty({
      name: "enablecnvrt",
      data: {
        currency,
        enabled
      }
    });
  }

  updatefee(currency: string, fee: number) {
    return this.addAccountProperty({
      name: "updatefee",
      data: {
        currency,
        fee
      }
    });
  }

  create(
    owner: string,
    token_code: string,
    initial_supply: number
  ): BareAction | SemiAction {
    return this.addAccountProperty({
      name: "create",
      data: {
        owner,
        token_code,
        initial_supply: String(initial_supply)
      }
    });
  }
}

export const multiContractAction = new MultiContractAction(
  process.env.VUE_APP_MULTICONTRACT!
);
