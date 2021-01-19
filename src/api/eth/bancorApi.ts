interface TokenMeta {
  id: string;
  image: string;
  contract: string;
  symbol: string;
  name: string;
  precision?: number;
}

import axios from "axios";

export interface WelcomeData {
  total_liquidity: BntPrice;
  total_volume_24h: BntPrice;
  bnt_price_24h_ago: BntPrice;
  bnt_price: BntPrice;
  bnt_supply: string;
  swaps: Swap[];
  pools: Pool[];
  tokens: Token[];
}

export interface BntPrice {
  usd: null | string;
}

export interface Pool {
  reserves: Reserve[];
  pool_dlt_id: string;
  name: string;
  liquidity: BntPrice;
  volume_24h: BntPrice;
  fees_24h: BntPrice;
  fee: string;
  version: number;
  supply: string;
}

export interface Reserve {
  address: string;
  weight: string;
  balance: string;
}

export interface Swap {
  source_token_dlt_id: string;
  target_token_dlt_id: string;
  tx_hash: string;
  input_amount: string;
  output_amount: string;
  amount: BntPrice;
  timestamp: number;
  wallet_dlt_id: string;
}

export interface Token {
  symbol: string;
  dlt_id: string;
  liquidity: BntPrice;
  rate: BntPrice;
  rate_24h_ago: BntPrice;
  precision: number;
}

interface TokenMetaWithReserve extends TokenMeta {
  reserveWeight: number;
  decBalance: string;
}

export interface NewPool extends Pool {
  reserveTokens: TokenMetaWithReserve[];
  decFee: number;
}

export const getWelcomeData = async (): Promise<WelcomeData> => {
  const res = await axios.get<WelcomeData>(
    "https://bancor-api.nw.r.appspot.com/welcome"
  );

  console.log(res.data, "is the new API data");
  return res.data;
};
