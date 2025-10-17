<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Role;
use App\Services\CacheService;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ToolControllerNew extends Controller
{
    protected $cacheService;

    public function __construct(CacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    /**
     * Display a listing of tools with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $query = Tool::with(['user', 'category', 'roles', 'tags']);

            // Handle "My Tools" filter - show user's own tools regardless of status
            if ($request->has('my_tools') && $user) {
                $query->where('user_id', $user->id);
            } else {
                // Standard visibility rules
                // Filter by role (user's role must have access to the tool)
                if ($request->has('role')) {
                    $roleName = $request->get('role');
                    $query->whereHas('roles', function($q) use ($roleName) {
                        $q->where('name', $roleName);
                    });
                } else if ($user) {
                    // If no role filter, only show tools accessible by user's role
                    $query->whereHas('roles', function($q) use ($user) {
                        $q->where('name', $user->role);
                    });
                }
                // If no user, show all tools (for testing)
                
                // Only show approved tools unless user is admin/owner
                if (!$user || !$user->hasRole('owner')) {
                    $query->where('status', 'approved');
                }
            }
            
            // Filter by category
            if ($request->has('category')) {
                $categoryId = $request->get('category');
                $query->where('category_id', $categoryId);
            }
            
            // Filter by name (partial match)
            if ($request->has('name')) {
                $name = $request->get('name');
                $query->where('name', 'LIKE', "%{$name}%");
            }
            
            // Filter by tags
            if ($request->has('tags')) {
                $tags = is_array($request->get('tags')) ? $request->get('tags') : explode(',', $request->get('tags'));
                $query->whereHas('tags', function($q) use ($tags) {
                    $q->whereIn('name', $tags);
                });
            }
            
            // Order by creation date (newest first)
            $tools = $query->orderBy('created_at', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'tools' => $tools,
                'total' => $tools->count(),
                'filters_applied' => $request->only(['role', 'category', 'name', 'tags'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created tool.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'link' => 'required|url|max:255',
            'official_doc_link' => 'nullable|url|max:255',
            'description' => 'required|string',
            'how_to_use' => 'required|string',
            'examples' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'role_ids' => 'nullable|array',
            'role_ids.*' => 'string|exists:roles,name',
            'tag_names' => 'nullable|array',
            'tag_names.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create the tool
            $tool = Tool::create([
                'name' => $request->name,
                'link' => $request->link,
                'official_doc_link' => $request->official_doc_link,
                'description' => $request->description,
                'how_to_use' => $request->how_to_use,
                'examples' => $request->examples,
                'category_id' => $request->category_id,
                'user_id' => $request->user()->id,
                'status' => 'pending', // New tools start as pending
            ]);

            // Attach roles if provided (convert role names to IDs)
            if ($request->has('role_ids') && is_array($request->role_ids)) {
                $roleIds = [];
                foreach ($request->role_ids as $roleName) {
                    $role = Role::where('name', $roleName)->first();
                    if ($role) {
                        $roleIds[] = $role->id;
                    }
                }
                if (!empty($roleIds)) {
                    $tool->roles()->attach($roleIds);
                }
            }

            // Handle tags
            if ($request->has('tag_names') && is_array($request->tag_names)) {
                $tagIds = [];
                foreach ($request->tag_names as $tagName) {
                    $tag = Tag::firstOrCreate(['name' => $tagName]);
                    $tagIds[] = $tag->id;
                }
                if (!empty($tagIds)) {
                    $tool->tags()->attach($tagIds);
                }
            }

            // Handle image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('tool_images', 'public');
                    $tool->images()->create(['path' => $path]);
                }
            }

            DB::commit();

            // Invalidate cache after creating tool
            $this->cacheService->invalidateTools();

            // Log audit trail
            AuditService::logToolCreated($tool->id, $tool->toArray());

            // Load relationships for response
            $tool->load(['user', 'category', 'roles', 'tags']);

            return response()->json([
                'success' => true,
                'message' => 'AI tool created successfully',
                'data' => $tool
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create tool',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's own tools (regardless of status).
     */
    public function myTools(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            $tools = Tool::where('user_id', $user->id)
                         ->with(['category', 'roles', 'tags'])
                         ->orderBy('created_at', 'desc')
                         ->get();
            
            return response()->json([
                'success' => true,
                'tools' => $tools,
                'total' => $tools->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified tool.
     */
    public function show(Tool $tool): JsonResponse
    {
        // Load all relationships
        $tool->load(['user', 'category', 'roles', 'tags']);
        
        return response()->json([
            'success' => true,
            'tool' => $tool
        ]);
    }

    /**
     * Update the specified tool.
     */
    public function update(Request $request, Tool $tool): JsonResponse
    {
        $user = $request->user();

        // Only the creator or owner can edit
        if ($tool->user_id !== $user->id && $user->role !== 'owner') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. You can only edit tools you created.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'link' => 'sometimes|url|max:255',
            'official_doc_link' => 'nullable|url|max:255',
            'description' => 'sometimes|string',
            'how_to_use' => 'sometimes|string',
            'examples' => 'nullable|string',
            'category_id' => 'sometimes|exists:categories,id',
            'role_ids' => 'nullable|array',
            'role_ids.*' => 'string|exists:roles,name',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
            'tag_names' => 'nullable|array',
            'tag_names.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Store old values for audit trail
            $oldValues = $tool->toArray();

            // Update the tool
            $tool->update($request->only([
                'name', 'link', 'official_doc_link', 'description', 
                'how_to_use', 'examples', 'category_id'
            ]));

            // Update roles if provided
            if ($request->has('role_ids')) {
                $tool->roles()->sync($request->role_ids);
            }

            // Update tags if provided
            if ($request->has('tag_ids') || $request->has('tag_names')) {
                $tagIds = [];
                
                // Add existing tags by ID
                if ($request->has('tag_ids') && is_array($request->tag_ids)) {
                    $tagIds = array_merge($tagIds, $request->tag_ids);
                }
                
                // Create and add new tags by name
                if ($request->has('tag_names') && is_array($request->tag_names)) {
                    foreach ($request->tag_names as $tagName) {
                        $tag = Tag::firstOrCreate(['name' => $tagName]);
                        $tagIds[] = $tag->id;
                    }
                }
                
                // Sync all tags
                $tool->tags()->sync(array_unique($tagIds));
            }

            DB::commit();

            // Invalidate cache after updating tool
            $this->cacheService->invalidateTools();

            // Log audit trail
            $newValues = $tool->fresh()->toArray();
            AuditService::logToolUpdated($tool->id, $oldValues, $newValues);

            // Load relationships for response
            $tool->load(['user', 'category', 'roles', 'tags']);

            return response()->json([
                'success' => true,
                'message' => 'Tool updated successfully',
                'tool' => $tool
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update tool',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified tool.
     */
    public function destroy(Tool $tool): JsonResponse
    {
        $user = request()->user();

        // Only the creator or owner can delete
        if ($tool->user_id !== $user->id && $user->role !== 'owner') {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. You can only delete tools you created.'
            ], 403);
        }

        try {
            // Store tool data for audit trail before deletion
            $toolData = $tool->toArray();
            
            $tool->delete();

            // Invalidate cache after deleting tool
            $this->cacheService->invalidateTools();

            // Log audit trail
            AuditService::logToolDeleted($tool->id, $toolData);

            return response()->json([
                'success' => true,
                'message' => 'Tool deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete tool',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
