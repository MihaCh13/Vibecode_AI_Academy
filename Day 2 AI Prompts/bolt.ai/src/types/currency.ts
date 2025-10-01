export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

export interface FavoritePair {
  id: string;
  from: string;
  to: string;
  createdAt: string;
}

export interface ApiResponse {
  success: boolean;
  rates: ExchangeRates;
  base: string;
  date: string;
}

export interface HistoricalApiResponse {
  success: boolean;
  historical: boolean;
  base: string;
  rates: {
    [date: string]: ExchangeRates;
  };
}