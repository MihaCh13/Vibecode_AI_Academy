<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\CacheService;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    protected $cacheService;

    public function __construct(CacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    /**
     * Display a listing of categories.
     */
    public function index(): JsonResponse
    {
        $categories = $this->cacheService->getCategories();

        return response()->json([
            'success' => true,
            'categories' => $categories,
            'cached' => true
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Invalidate cache after creating category
        $this->cacheService->invalidateCategories();

        // Log audit trail
        AuditService::logCategoryCreated($category->id, $category->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'category' => $category
        ], 201);
    }

    /**
     * Display the specified category.
     */
    public function show(Category $category): JsonResponse
    {
        $category->load('aiTools');

        return response()->json([
            'success' => true,
            'category' => $category
        ]);
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Store old values for audit trail
        $oldValues = $category->toArray();
        
        $category->update($request->only(['name', 'description']));

        // Invalidate cache after updating category
        $this->cacheService->invalidateCategories();

        // Log audit trail
        AuditService::logCategoryUpdated($category->id, $oldValues, $category->fresh()->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'category' => $category
        ]);
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Category $category): JsonResponse
    {
        // Store category data for audit trail before deletion
        $categoryData = $category->toArray();
        
        $category->delete();

        // Invalidate cache after deleting category
        $this->cacheService->invalidateCategories();

        // Log audit trail
        AuditService::logCategoryDeleted($category->id, $categoryData);

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }
}