import React, { useState, useEffect } from 'react';
import { Heart, ArrowUpDown } from 'lucide-react';
import { useCurrencyData } from '../hooks/useCurrencyData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FavoritePair } from '../types/currency';
import { CurrencySelector } from './CurrencySelector';
import { AmountInput } from './AmountInput';
import { ConversionResult } from './ConversionResult';
import { HistoricalChart } from './HistoricalChart';
import { FavoritesList } from './FavoritesList';

export function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [favorites, setFavorites] = useLocalStorage<FavoritePair[]>('currency-favorites', []);
  
  const { rates, loading, error, convertCurrency, refetch } = useCurrencyData();

  const conversionResult = convertCurrency(amount, fromCurrency, toCurrency);
  const currentPairId = `${fromCurrency}-${toCurrency}`;
  const isFavorite = favorites.some(fav => fav.from === fromCurrency && fav.to === toCurrency);

  useEffect(() => {
    // Save last conversion to localStorage
    if (conversionResult) {
      localStorage.setItem('last-conversion', JSON.stringify({
        amount,
        fromCurrency,
        toCurrency,
        timestamp: new Date().toISOString()
      }));
    }
  }, [amount, fromCurrency, toCurrency, conversionResult]);

  useEffect(() => {
    // Load last conversion on startup
    const lastConversion = localStorage.getItem('last-conversion');
    if (lastConversion) {
      try {
        const parsed = JSON.parse(lastConversion);
        setAmount(parsed.amount);
        setFromCurrency(parsed.fromCurrency);
        setToCurrency(parsed.toCurrency);
      } catch (error) {
        console.error('Error loading last conversion:', error);
      }
    }
  }, []);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter(fav => !(fav.from === fromCurrency && fav.to === toCurrency)));
    } else {
      const newFavorite: FavoritePair = {
        id: currentPairId,
        from: fromCurrency,
        to: toCurrency,
        createdAt: new Date().toISOString()
      };
      setFavorites([...favorites, newFavorite]);
    }
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  const handleSelectFavorite = (from: string, to: string) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 flex items-center justify-center p-4">
        <div className="glass-effect p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-emerald-200/20">
          <div className="text-red-500 mb-6">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Connection Error</h3>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 mb-3 drop-shadow-lg">
            Currency Converter
          </h1>
          <p className="text-emerald-100 text-lg">Real-time exchange rates with historical data and favorites</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Converter */}
          <div className="space-y-6">
            <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-emerald-200/20 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                  Convert Currency
                </h2>
                <button
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                    isFavorite
                      ? 'text-red-500 bg-red-50 hover:bg-red-100 shadow-lg'
                      : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="space-y-4">
                <AmountInput
                  value={amount}
                  onChange={setAmount}
                  currency={fromCurrency}
                  label="Amount"
                  disabled={loading}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <CurrencySelector
                    value={fromCurrency}
                    onChange={setFromCurrency}
                    label="From"
                    disabled={loading}
                  />

                  <div className="flex items-end justify-between">
                    <CurrencySelector
                      value={toCurrency}
                      onChange={setToCurrency}
                      label="To"
                      disabled={loading}
                    />
                    <button
                      onClick={handleSwapCurrencies}
                      disabled={loading}
                      className="ml-2 p-3 text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-180 disabled:opacity-50 shadow-md"
                      title="Swap currencies"
                    >
                      <ArrowUpDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {conversionResult && (
              <ConversionResult
                result={conversionResult}
                loading={loading}
                onRefresh={refetch}
              />
            )}
          </div>

          {/* Favorites */}
          <div>
            <FavoritesList
              favorites={favorites}
              onRemove={handleRemoveFavorite}
              onSelect={handleSelectFavorite}
              currentPair={{ from: fromCurrency, to: toCurrency }}
            />
          </div>
        </div>

        {/* Historical Chart */}
        <div className="mt-8">
          <HistoricalChart
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
          />
        </div>
      </div>
    </div>
  );
}