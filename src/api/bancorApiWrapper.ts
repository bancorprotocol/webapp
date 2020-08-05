import axios, { AxiosInstance } from "axios";
import {
  TokenPrice,
  IntegerAmount,
  TokenDetail,
  BancorAPIResponseToken
} from "@/types/bancor";

function chunk(array: any, size: number) {
  const chunked = [];
  let index = 0;

  while (index < array.length) {
    chunked.push(array.slice(index, index + size));
    index += size;
  }
  return chunked;
}

export interface BancorWrapper {
  getTokens(): Promise<TokenPrice[]>;
  getToken(symbol: string): Promise<TokenDetail>;
  getTokenTicker?(symbol: string): Promise<any>;
  calculateCost(
    fromId: string,
    toId: string,
    amount: any
  ): Promise<IntegerAmount>;
  calculateReturn(
    fromId: string,
    toId: string,
    amount: any
  ): Promise<IntegerAmount>;
}

export interface ConvertPayload {
  format?: string;
  fromCurrencyId: string;
  toCurrencyId: string;
  amount: string;
  minimumReturn: string;
  ownerAddress: string;
}

enum Blockchain {
  EOS,
  ETH
}

export class BancorApi implements BancorWrapper {
  instance: AxiosInstance;
  photoBaseUrl: string;
  blockchain: Blockchain;

  constructor(blockchain: Blockchain) {
    this.instance = axios.create({
      baseURL: "https://api.bancor.network/0.1/"
    });
    this.photoBaseUrl = `https://storage.googleapis.com/bancor-prod-file-store/images/communities/`;
    this.blockchain = blockchain;
  }

  private async request(endpoint: string, params: any = {}) {
    const res = await this.instance.get(endpoint, {
      params
    });
    return res.data;
  }

  private async post(endpoint: string, params: any) {
    const res = await this.instance.post(endpoint, params);
    return res.data;
  }

  public async getToken(symbol: string) {
    const endpoint = "currencies/" + symbol;
    const res = await this.request(endpoint, {});
    return {
      ...res.data.currency,
      primaryCommunityImageName:
        this.photoBaseUrl + res.data.currency.primaryCommunityImageName
    };
  }

  public async convert(payload: ConvertPayload) {
    const final = {
      ...payload,
      blockchainType: this.blockchain == Blockchain.EOS ? "eos" : "ethereum",
      ...(this.blockchain == Blockchain.EOS && { format: "json" })
    };
    const res = await this.post("currencies/convert", final);

    if (res.errorCode) {
      throw new Error(res.errorCode);
    }
    return res;
  }

  public async getPath(fromId: string, toId: string) {
    const endpoint = `transactions/conversionPath?fromCurrencyId=${fromId}&toCurrencyId=${toId}`;
    const res = await this.request(endpoint);
    return res;
  }

  public async getPathBySymbol(
    fromSymbol: string,
    toSymbol: string
  ): Promise<any[]> {
    const res = await this.request(
      `transactions/conversionPath?fromCurrencyCode=${fromSymbol}&toCurrencyCode=${toSymbol}`
    );
    return chunk(res.data, 2);
  }

  public async getTokens(): Promise<TokenPrice[]> {
    const res = await this.request("currencies/tokens", {
      blockchainType: this.blockchain == Blockchain.EOS ? "eos" : "ethereum",
      fromCurrencyCode: "USD",
      includeTotal: true,
      limit: 150,
      orderBy: "volume24h",
      skip: 0,
      sortOrder: "desc"
    });
    return res.data.page.map((token: TokenPrice) => ({
      ...token,
      primaryCommunityImageName:
        this.photoBaseUrl + token.primaryCommunityImageName
    }));
  }

  public async getTokenTicker(symbol: string): Promise<BancorAPIResponseToken> {
    const endpoint = "currencies/" + symbol + "/ticker";
    const params = {
      displayCurrencyCode: "USD"
    };
    const res = await this.request(endpoint, params);
    return res.data;
  }

  private async priceDiscovery(
    tokenId: string,
    params: any
  ): Promise<IntegerAmount> {
    const endpoint = "currencies/" + tokenId + "/value";
    const res = await this.request(endpoint, params);
    return res.data;
  }

  public async calculateCost(
    fromId: string,
    toId: string,
    amount: IntegerAmount
  ): Promise<IntegerAmount> {
    return this.priceDiscovery(fromId, {
      toCurrencyId: toId,
      toAmount: amount,
      streamId: "loadDefaultConversionRateValue"
    });
  }

  public async calculateReturn(
    fromId: string,
    toId: string,
    amount: IntegerAmount
  ): Promise<IntegerAmount> {
    return this.priceDiscovery(fromId, {
      toCurrencyId: toId,
      fromAmount: amount,
      streamId: "loadValue"
    });
  }

  public async getRate(
    toCurrency: string,
    fromCurrency: string
  ): Promise<string> {
    const res = await this.request(`currencies/rate`, {
      toCurrencyCode: toCurrency,
      fromCurrencyCode: fromCurrency
    });
    return res.data;
  }
}

export const bancorApi = new BancorApi(Blockchain.EOS);
export const ethBancorApi = new BancorApi(Blockchain.ETH);
