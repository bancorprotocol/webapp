import axios, { AxiosResponse } from "axios";
import parse from "csv-parse/lib/sync";
import { RawRow, HistoryRow } from "@/types/bancor.d.ts";

const baseUrl = "https://zumzoom.github.io/analytics/";

export interface HistoryItem {
  id: string;
  text: string;
}

export const fetchSmartTokens = async () => {
  const res = await axios.get<{ results: HistoryItem[] }>(
    `${baseUrl}/bancor/data/tokens.json?_type=query`
  );
  return res.data.results;
};

export const fetchSmartTokenHistory = async (smartToken: string) => {
  const res = await axios.get<string>(
    `${baseUrl}/bancor/data/roi/${smartToken}.csv`
  );
  return res.data;
};

const parseSmartTokenHistory = (csvString: string): HistoryRow[] => {
  const data: RawRow[] = parse(csvString, { columns: true });
  return data.map(row => ({
    timestamp: Number(row.timestamp),
    roi: Number(row.ROI),
    tokenPrice: Number(row["Token Price"]),
    tradeVolume: Number(row["Trade Volume"])
  }));
};

export const getSmartTokenHistory = async (smartToken: string) => {
  const csvHistory = await fetchSmartTokenHistory(smartToken);
  const parsedCsv = parseSmartTokenHistory(csvHistory);
  return parsedCsv;
};
