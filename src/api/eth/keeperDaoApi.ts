import axios from "axios";

export interface Token {
  address: string;
  chainId: number;
  decimals: number;
  symbol: string;
}

export interface TokenList {
  keywords: string[];
  logoURI: string;
  name: string;
  timestamp: string;
  tokens: Token[];
  version: [];
}

interface TokenListRes {
  result: TokenList;
  message: string;
}

export const getTokenList = async (): Promise<TokenList> => {
  try {
    const res = await axios.get<TokenListRes>(
      "https://hidingbook.keeperdao.com/api/v1/tokenList"
    );
    return res.data.result;
  } catch (e) {
    console.error("Failed to load token list from keepDao API", e);
    throw new Error(e);
  }
};
