import React from 'react';

interface AmountInputProps {
  value: number;
  onChange: (amount: number) => void;
  currency: string;
  label: string;
  disabled?: boolean;
}

export function AmountInput({ value, onChange, currency, label, disabled = false }: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onChange(newValue);
  };

  return (
    <div className="flex flex-col space-y-3">
      <label className="text-sm font-semibold text-emerald-800 tracking-wide">{label}</label>
      <div className="relative group">
        <input
          type="number"
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="w-full px-5 py-4 pr-20 border-2 border-emerald-200 rounded-xl bg-white focus:ring-4 focus:ring-emerald-300/50 focus:border-emerald-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg text-lg font-semibold text-gray-800"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-700 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-lg">
          {currency}
        </span>
      </div>
    </div>
  );
}