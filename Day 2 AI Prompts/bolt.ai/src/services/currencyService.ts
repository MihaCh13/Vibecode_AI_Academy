import { ApiResponse, HistoricalApiResponse, ExchangeRates } from '../types/currency';

const API_KEY = '00085638be23cc54177e25f3893d9aee';
const BASE_URL = 'https://api.exchangeratesapi.io/v1';

class CurrencyService {
  async getLatestRates(base: string = 'EUR'): Promise<ExchangeRates> {
    try {
      const response = await fetch(
        `${BASE_URL}/latest?access_key=${API_KEY}&base=${base}&format=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error('API request failed');
      }
      
      return data.rates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Fallback rates for demonstration
      return this.getFallbackRates();
    }
  }

  async getHistoricalRates(
    startDate: string,
    endDate: string,
    base: string = 'EUR',
    symbols: string[] = []
  ): Promise<{ [date: string]: ExchangeRates }> {
    try {
      const symbolsParam = symbols.length > 0 ? `&symbols=${symbols.join(',')}` : '';
      const response = await fetch(
        `${BASE_URL}/timeseries?access_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}&base=${base}${symbolsParam}&format=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: HistoricalApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error('API request failed');
      }
      
      return data.rates;
    } catch (error) {
      console.error('Error fetching historical rates:', error);
      return this.getFallbackHistoricalRates(startDate, endDate);
    }
  }

  convertCurrency(amount: number, fromRate: number, toRate: number): number {
    return (amount / fromRate) * toRate;
  }

  private getFallbackRates(): ExchangeRates {
    return {
      EUR: 1,
      USD: 1.0842,
      GBP: 0.8403,
      JPY: 163.47,
      CAD: 1.5089,
      AUD: 1.6253,
      CHF: 0.9721,
      CNY: 7.8543,
      SEK: 11.6421,
      NZD: 1.7845,
      BGN: 1.9558
    };
  }

  private getFallbackHistoricalRates(startDate: string, endDate: string): { [date: string]: ExchangeRates } {
    const rates: { [date: string]: ExchangeRates } = {};
    const start = new Date(startDate);
    const end = new Date(endDate);
    const baseRates = this.getFallbackRates();
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const variation = 0.95 + Math.random() * 0.1; // ±5% variation
      
      rates[dateStr] = Object.keys(baseRates).reduce((acc, currency) => {
        acc[currency] = baseRates[currency] * variation;
        return acc;
      }, {} as ExchangeRates);
    }
    
    return rates;
  }
}

export const currencyService = new CurrencyService();