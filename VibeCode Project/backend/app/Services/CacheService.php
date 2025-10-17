<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Tool;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CacheService
{
    /**
     * Cache TTL in minutes
     */
    const CACHE_TTL = 15;

    /**
     * Cache key prefixes
     */
    const CATEGORIES_KEY = 'categories:all';
    const CATEGORY_COUNTS_KEY = 'categories:counts';
    const TOOL_COUNTS_KEY = 'tools:counts';
    const ADMIN_STATS_KEY = 'admin:stats';
    const ROLE_STATS_KEY = 'role:stats';

    /**
     * Get all categories from cache or database
     */
    public function getCategories()
    {
        return Cache::remember(self::CATEGORIES_KEY, self::CACHE_TTL, function () {
            Log::info('Cache miss: Fetching categories from database');
            return Category::orderBy('name')->get();
        });
    }

    /**
     * Get category with tool counts from cache or database
     */
    public function getCategoriesWithCounts()
    {
        return Cache::remember(self::CATEGORY_COUNTS_KEY, self::CACHE_TTL, function () {
            Log::info('Cache miss: Fetching categories with counts from database');
            return Category::withCount(['aiTools' => function ($query) {
                $query->where('status', 'approved');
            }])->orderBy('name')->get();
        });
    }

    /**
     * Get tool counts by status from cache or database
     */
    public function getToolCounts()
    {
        return Cache::remember(self::TOOL_COUNTS_KEY, self::CACHE_TTL, function () {
            Log::info('Cache miss: Fetching tool counts from database');
            return [
                'total' => Tool::count(),
                'pending' => Tool::where('status', 'pending')->count(),
                'approved' => Tool::where('status', 'approved')->count(),
                'rejected' => Tool::where('status', 'rejected')->count(),
            ];
        });
    }

    /**
     * Get admin dashboard stats from cache or database
     */
    public function getAdminStats()
    {
        return Cache::remember(self::ADMIN_STATS_KEY, self::CACHE_TTL, function () {
            Log::info('Cache miss: Fetching admin stats from database');
            return [
                'total_tools' => Tool::count(),
                'pending_tools' => Tool::where('status', 'pending')->count(),
                'approved_tools' => Tool::where('status', 'approved')->count(),
                'rejected_tools' => Tool::where('status', 'rejected')->count(),
                'total_categories' => Category::count(),
                'total_users' => User::count(),
            ];
        });
    }

    /**
     * Get role-specific stats from cache or database
     */
    public function getRoleStats($role = null)
    {
        $cacheKey = $role ? self::ROLE_STATS_KEY . ":{$role}" : self::ROLE_STATS_KEY . ':all';
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($role) {
            Log::info("Cache miss: Fetching role stats for {$role} from database");
            
            $query = Tool::query();
            
            if ($role) {
                $query->whereHas('roles', function ($q) use ($role) {
                    $q->where('name', $role);
                });
            }
            
            return [
                'total_tools' => $query->count(),
                'approved_tools' => $query->clone()->where('status', 'approved')->count(),
                'pending_tools' => $query->clone()->where('status', 'pending')->count(),
                'rejected_tools' => $query->clone()->where('status', 'rejected')->count(),
                'role' => $role ?? 'all',
            ];
        });
    }

    /**
     * Invalidate all cache entries
     */
    public function invalidateAll()
    {
        Log::info('Invalidating all cache entries');
        
        $keys = [
            self::CATEGORIES_KEY,
            self::CATEGORY_COUNTS_KEY,
            self::TOOL_COUNTS_KEY,
            self::ADMIN_STATS_KEY,
        ];

        // Invalidate role-specific stats for all roles
        $roles = array_keys(User::ROLES);
        foreach ($roles as $role) {
            $keys[] = self::ROLE_STATS_KEY . ":{$role}";
        }
        $keys[] = self::ROLE_STATS_KEY . ':all';

        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }

    /**
     * Invalidate categories cache
     */
    public function invalidateCategories()
    {
        Log::info('Invalidating categories cache');
        Cache::forget(self::CATEGORIES_KEY);
        Cache::forget(self::CATEGORY_COUNTS_KEY);
        Cache::forget(self::ADMIN_STATS_KEY);
    }

    /**
     * Invalidate tool-related cache
     */
    public function invalidateTools()
    {
        Log::info('Invalidating tools cache');
        Cache::forget(self::TOOL_COUNTS_KEY);
        Cache::forget(self::CATEGORY_COUNTS_KEY);
        Cache::forget(self::ADMIN_STATS_KEY);
        
        // Invalidate role-specific stats
        $roles = array_keys(User::ROLES);
        foreach ($roles as $role) {
            Cache::forget(self::ROLE_STATS_KEY . ":{$role}");
        }
        Cache::forget(self::ROLE_STATS_KEY . ':all');
    }

    /**
     * Invalidate user-related cache
     */
    public function invalidateUsers()
    {
        Log::info('Invalidating users cache');
        Cache::forget(self::ADMIN_STATS_KEY);
    }

    /**
     * Warm up cache with fresh data
     */
    public function warmUp()
    {
        Log::info('Warming up cache');
        
        try {
            $this->getCategories();
            $this->getCategoriesWithCounts();
            $this->getToolCounts();
            $this->getAdminStats();
            $this->getRoleStats();
            
            // Warm up role-specific stats
            $roles = array_keys(User::ROLES);
            foreach ($roles as $role) {
                $this->getRoleStats($role);
            }
            
            Log::info('Cache warmed up successfully');
        } catch (\Exception $e) {
            Log::error('Failed to warm up cache: ' . $e->getMessage());
        }
    }

    /**
     * Get cache statistics
     */
    public function getCacheStats()
    {
        $stats = [
            'categories_cached' => Cache::has(self::CATEGORIES_KEY),
            'category_counts_cached' => Cache::has(self::CATEGORY_COUNTS_KEY),
            'tool_counts_cached' => Cache::has(self::TOOL_COUNTS_KEY),
            'admin_stats_cached' => Cache::has(self::ADMIN_STATS_KEY),
            'role_stats_cached' => Cache::has(self::ROLE_STATS_KEY . ':all'),
        ];

        // Check role-specific caches
        $roles = array_keys(User::ROLES);
        foreach ($roles as $role) {
            $stats["role_{$role}_stats_cached"] = Cache::has(self::ROLE_STATS_KEY . ":{$role}");
        }

        return $stats;
    }
}
