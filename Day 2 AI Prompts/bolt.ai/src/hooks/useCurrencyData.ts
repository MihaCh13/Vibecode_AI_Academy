import { useState, useEffect, useCallback } from 'react';
import { currencyService } from '../services/currencyService';
import { ExchangeRates, ConversionResult, HistoricalRate } from '../types/currency';
import { format, subDays } from 'date-fns';

export function useCurrencyData() {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const latestRates = await currencyService.getLatestRates();
      setRates(latestRates);
    } catch (err) {
      setError('Failed to fetch exchange rates');
      console.error('Error fetching rates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    
    // Refresh rates every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchRates]);

  const convertCurrency = useCallback((
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): ConversionResult | null => {
    if (!rates[fromCurrency] || !rates[toCurrency] || isNaN(amount)) {
      return null;
    }

    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    const result = currencyService.convertCurrency(amount, fromRate, toRate);
    const rate = toRate / fromRate;

    return {
      from: fromCurrency,
      to: toCurrency,
      amount,
      result,
      rate
    };
  }, [rates]);

  const getHistoricalData = useCallback(async (
    fromCurrency: string,
    toCurrency: string,
    days: number = 30
  ): Promise<HistoricalRate[]> => {
    try {
      const endDate = format(new Date(), 'yyyy-MM-dd');
      const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
      
      const historicalRates = await currencyService.getHistoricalRates(
        startDate,
        endDate,
        'EUR',
        [fromCurrency, toCurrency]
      );

      return Object.entries(historicalRates).map(([date, dayRates]) => ({
        date,
        rate: dayRates[toCurrency] / dayRates[fromCurrency]
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (err) {
      console.error('Error fetching historical data:', err);
      return [];
    }
  }, []);

  return {
    rates,
    loading,
    error,
    convertCurrency,
    getHistoricalData,
    refetch: fetchRates
  };
}