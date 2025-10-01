import React from 'react';
import { Currency } from '../types/currency';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  label: string;
  disabled?: boolean;
}

export function CurrencySelector({ value, onChange, label, disabled = false }: CurrencySelectorProps) {
  return (
    <div className="flex flex-col space-y-3">
      <label className="text-sm font-semibold text-emerald-800 tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-5 py-4 border-2 border-emerald-200 rounded-xl bg-white focus:ring-4 focus:ring-emerald-300/50 focus:border-emerald-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg text-base font-medium text-gray-800 appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2310b981' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
      >
        {SUPPORTED_CURRENCIES.map((currency: Currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} - {currency.name} ({currency.symbol})
          </option>
        ))}
      </select>
    </div>
  );
}