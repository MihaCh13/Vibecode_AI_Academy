<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    protected $cacheService;

    public function __construct(CacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    /**
     * Get statistics for the current user's role
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user ? $user->role : null;

        // Get role-specific stats from cache
        $roleStats = $this->cacheService->getRoleStats($role);
        
        // Get general tool counts from cache
        $toolCounts = $this->cacheService->getToolCounts();
        
        // Get categories with counts from cache
        $categories = $this->cacheService->getCategoriesWithCounts();

        return response()->json([
            'success' => true,
            'stats' => [
                'role' => $role,
                'role_display_name' => $user ? $user->getRoleDisplayName() : 'Guest',
                'tool_counts' => $toolCounts,
                'role_stats' => $roleStats,
                'categories' => $categories,
            ],
            'cached' => true,
            'timestamp' => now()->toISOString(),
        ]);
    }

    /**
     * Get admin statistics (owner role only)
     */
    public function admin(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user || !$user->isOwner()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Owner role required.'
            ], 403);
        }

        // Get admin stats from cache
        $adminStats = $this->cacheService->getAdminStats();
        
        // Get categories with counts from cache
        $categories = $this->cacheService->getCategoriesWithCounts();

        return response()->json([
            'success' => true,
            'stats' => $adminStats,
            'categories' => $categories,
            'cached' => true,
            'timestamp' => now()->toISOString(),
        ]);
    }

    /**
     * Get cache statistics and health
     */
    public function cache(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user || !$user->isOwner()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Owner role required.'
            ], 403);
        }

        $cacheStats = $this->cacheService->getCacheStats();
        
        return response()->json([
            'success' => true,
            'cache_stats' => $cacheStats,
            'cache_ttl' => CacheService::CACHE_TTL . ' minutes',
            'timestamp' => now()->toISOString(),
        ]);
    }

    /**
     * Manually warm up cache (owner role only)
     */
    public function warmCache(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user || !$user->isOwner()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Owner role required.'
            ], 403);
        }

        try {
            $this->cacheService->warmUp();
            
            return response()->json([
                'success' => true,
                'message' => 'Cache warmed up successfully',
                'timestamp' => now()->toISOString(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to warm up cache: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clear cache (owner role only)
     */
    public function clearCache(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user || !$user->isOwner()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Owner role required.'
            ], 403);
        }

        try {
            $this->cacheService->invalidateAll();
            
            return response()->json([
                'success' => true,
                'message' => 'Cache cleared successfully',
                'timestamp' => now()->toISOString(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear cache: ' . $e->getMessage(),
            ], 500);
        }
    }
}
