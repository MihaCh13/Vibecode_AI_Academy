<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use App\Models\Category;
use App\Models\User;
use App\Services\CacheService;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    protected $cacheService;

    public function __construct(CacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    /**
     * Get all tools with filtering options
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tool::with(['user', 'category', 'roles', 'tags']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        // Filter by creator role
        if ($request->has('creator_role') && $request->creator_role !== 'all') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('role', $request->creator_role);
            });
        }

        // Search by name
        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $tools = $query->paginate(15);

        // Get filter options from cache
        $categories = $this->cacheService->getCategories();
        $roles = collect(User::ROLES)->map(function ($displayName, $roleKey) {
            return ['id' => $roleKey, 'name' => $displayName];
        })->values();

        return response()->json([
            'success' => true,
            'data' => $tools,
            'filter_options' => [
                'categories' => $categories,
                'roles' => $roles,
            ]
        ]);
    }

    /**
     * Approve a tool
     */
    public function approve(Tool $tool): JsonResponse
    {
        $tool->update(['status' => 'approved']);

        // Invalidate cache after approving tool
        $this->cacheService->invalidateTools();

        // Log audit trail
        AuditService::logToolApproved($tool->id, $tool->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Tool approved successfully',
            'tool' => $tool->load(['user', 'category'])
        ]);
    }

    /**
     * Reject a tool
     */
    public function reject(Tool $tool): JsonResponse
    {
        $tool->update(['status' => 'rejected']);

        // Invalidate cache after rejecting tool
        $this->cacheService->invalidateTools();

        // Log audit trail
        AuditService::logToolRejected($tool->id, $tool->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Tool rejected successfully',
            'tool' => $tool->load(['user', 'category'])
        ]);
    }

    /**
     * Update tool status
     */
    public function updateStatus(Request $request, Tool $tool): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $tool->update(['status' => $request->status]);

        // Invalidate cache after updating tool status
        $this->cacheService->invalidateTools();

        return response()->json([
            'success' => true,
            'message' => 'Tool status updated successfully',
            'tool' => $tool->load(['user', 'category'])
        ]);
    }

    /**
     * Get tool details
     */
    public function show(Tool $tool): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $tool->load(['user', 'category', 'roles', 'tags'])
        ]);
    }

    /**
     * Get admin dashboard statistics
     */
    public function dashboard(): JsonResponse
    {
        // Get stats from cache
        $stats = $this->cacheService->getAdminStats();

        // Recent tools (not cached as they change frequently)
        $recent_tools = Tool::with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'recent_tools' => $recent_tools,
            'cached' => true
        ]);
    }
}