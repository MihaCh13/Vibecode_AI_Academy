import React from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { ConversionResult as ConversionResultType } from '../types/currency';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';

interface ConversionResultProps {
  result: ConversionResultType;
  loading: boolean;
  onRefresh: () => void;
}

export function ConversionResult({ result, loading, onRefresh }: ConversionResultProps) {
  const getSymbol = (code: string) => {
    return SUPPORTED_CURRENCIES.find(c => c.code === code)?.symbol || code;
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-yellow-50 p-8 rounded-2xl border-2 border-yellow-200/50 shadow-2xl relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
            Conversion Result
          </h3>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 text-emerald-600 hover:text-emerald-800 bg-white hover:bg-emerald-50 rounded-full transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:scale-110"
            title="Refresh rates"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center justify-between text-2xl font-bold text-gray-900 bg-white/70 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <span className="text-emerald-700">{getSymbol(result.from)}</span>
            <span className="text-gray-800">{result.amount.toLocaleString()}</span>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-lg">
              {result.from}
            </span>
          </div>

          <ArrowRight className="w-7 h-7 text-yellow-600 mx-4 animate-pulse" />

          <div className="flex items-center space-x-3 text-green-700">
            <span>{getSymbol(result.to)}</span>
            <span>{result.result.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6
            })}</span>
            <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-lg">
              {result.to}
            </span>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-700 bg-white/50 rounded-lg p-4 backdrop-blur-sm">
          <p className="font-medium">
            Exchange Rate: <span className="font-bold text-emerald-700">1 {result.from} = {result.rate.toFixed(6)} {result.to}</span>
          </p>
          <p className="text-xs text-gray-600 mt-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Rates updated automatically every 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
}