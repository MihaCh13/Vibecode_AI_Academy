'use client';

import { useState, useEffect } from 'react';
import { statsAPI } from '@/lib/api';
import { CacheStats } from '@/types';

interface CacheStatusIndicatorProps {
  className?: string;
}

export default function CacheStatusIndicator({ className = '' }: CacheStatusIndicatorProps) {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCacheStats = async () => {
      try {
        setLoading(true);
        const response = await statsAPI.getCacheStats();
        setCacheStats(response.cache_stats);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch cache stats');
      } finally {
        setLoading(false);
      }
    };

    fetchCacheStats();
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        <span className="text-gray-600 dark:text-gray-400">Cache Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        <span className="text-red-600 dark:text-red-400">Cache Error</span>
      </div>
    );
  }

  if (!cacheStats) return null;

  // Calculate cache health percentage
  const totalCaches = Object.keys(cacheStats).length;
  const cachedCount = Object.values(cacheStats).filter(Boolean).length;
  const cacheHealth = Math.round((cachedCount / totalCaches) * 100);

  // Determine status color
  const getStatusColor = () => {
    if (cacheHealth >= 80) return 'bg-green-500';
    if (cacheHealth >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (cacheHealth >= 80) return 'Cache Healthy';
    if (cacheHealth >= 60) return 'Cache Partial';
    return 'Cache Cold';
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-gray-600 dark:text-gray-400">
        {getStatusText()} ({cacheHealth}%)
      </span>
    </div>
  );
}
