import React from 'react';
import { Heart, X, TrendingUp } from 'lucide-react';
import { FavoritePair } from '../types/currency';
import { SUPPORTED_CURRENCIES } from '../constants/currencies';

interface FavoritesListProps {
  favorites: FavoritePair[];
  onRemove: (id: string) => void;
  onSelect: (from: string, to: string) => void;
  currentPair: { from: string; to: string };
}

export function FavoritesList({ favorites, onRemove, onSelect, currentPair }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-emerald-200/20 backdrop-blur-xl">
        <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent flex items-center">
          <Heart className="w-6 h-6 mr-3 text-red-500" />
          Favorite Currency Pairs
        </h3>
        <p className="text-gray-600 text-center py-12 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-dashed border-emerald-200">
          No favorite pairs yet. Start converting currencies to add your most-used pairs!
        </p>
      </div>
    );
  }

  const getCurrencyName = (code: string) => {
    return SUPPORTED_CURRENCIES.find(c => c.code === code)?.name || code;
  };

  return (
    <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-emerald-200/20 backdrop-blur-xl">
      <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent flex items-center">
        <Heart className="w-6 h-6 mr-3 text-red-500" />
        Favorite Currency Pairs
      </h3>
      <div className="space-y-3">
        {favorites.map((favorite) => {
          const isActive = currentPair.from === favorite.from && currentPair.to === favorite.to;

          return (
            <div
              key={favorite.id}
              className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-2 border-emerald-400 shadow-lg'
                  : 'bg-white hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 border-2 border-emerald-100 shadow-md hover:shadow-lg'
              }`}
              onClick={() => onSelect(favorite.from, favorite.to)}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-200' : 'bg-green-100'}`}>
                  <TrendingUp className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base">
                    {favorite.from} → {favorite.to}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getCurrencyName(favorite.from)} to {getCurrencyName(favorite.to)}
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(favorite.id);
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 transform hover:scale-110"
                title="Remove from favorites"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}