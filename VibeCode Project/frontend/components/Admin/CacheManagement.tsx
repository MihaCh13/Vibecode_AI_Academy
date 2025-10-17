'use client';

import { useState, useEffect } from 'react';
import { statsAPI } from '@/lib/api';
import { CacheStats } from '@/types';

export default function CacheManagement() {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchCacheStats();
  }, []);

  const fetchCacheStats = async () => {
    try {
      setLoading(true);
      const response = await statsAPI.getCacheStats();
      setCacheStats(response.cache_stats);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to fetch cache stats' });
    } finally {
      setLoading(false);
    }
  };

  const handleWarmCache = async () => {
    try {
      setActionLoading(true);
      const response = await statsAPI.warmCache();
      setMessage({ type: 'success', text: response.message });
      await fetchCacheStats(); // Refresh stats
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to warm cache' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setActionLoading(true);
      const response = await statsAPI.clearCache();
      setMessage({ type: 'success', text: response.message });
      await fetchCacheStats(); // Refresh stats
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to clear cache' });
    } finally {
      setActionLoading(false);
    }
  };

  const getCacheStatusColor = (cached: boolean) => {
    return cached 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const getCacheStatusIcon = (cached: boolean) => {
    return cached ? '✅' : '❌';
  };

  if (loading) {
    return (
      <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 dark:shadow-white/5 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cache Management</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 dark:shadow-white/5 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cache Management</h3>
        <button
          onClick={fetchCacheStats}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cacheStats && Object.entries(cacheStats).map(([key, cached]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/10 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
              <span className={`text-sm font-semibold ${getCacheStatusColor(cached)}`}>
                {getCacheStatusIcon(cached)} {cached ? 'Cached' : 'Not Cached'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleWarmCache}
          disabled={actionLoading}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
        >
          {actionLoading ? '⏳ Warming...' : '🔥 Warm Cache'}
        </button>
        <button
          onClick={handleClearCache}
          disabled={actionLoading}
          className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
        >
          {actionLoading ? '⏳ Clearing...' : '🗑️ Clear Cache'}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Cache TTL: 15 minutes | Auto-refresh: On data changes</p>
      </div>
    </div>
  );
}
