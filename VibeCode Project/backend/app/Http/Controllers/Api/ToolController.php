<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiTool;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ToolController extends Controller
{
    /**
     * Display a listing of AI tools.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Get AI tools accessible by user's role
        $tools = AiTool::whereIn('id', function($query) use ($user) {
            $query->select('ai_tool_id')
                ->from('ai_tool_role')
                ->where('role', $user->role);
        })
        ->with(['categories', 'creator'])
        ->orderBy('created_at', 'desc')
        ->get();

        // Add role information to each tool
        $tools->each(function ($tool) {
            $tool->roles = $tool->getRoleStrings();
        });

        return response()->json([
            'success' => true,
            'tools' => $tools
        ]);
    }

    /**
     * Store a newly created AI tool.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'link' => 'required|url|max:255',
            'documentation_url' => 'nullable|url|max:255',
            'official_documentation' => 'nullable|url|max:255',
            'video_demo' => 'nullable|url|max:255',
            'how_to_use' => 'required|string',
            'real_examples' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'difficulty_level' => 'nullable|string|in:beginner,intermediate,advanced,expert',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id',
            'roles' => 'nullable|array',
            'roles.*' => 'in:owner,backend,frontend,pm,qa,designer',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:5120', // 5MB max per image
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

            // Handle image uploads
            $imagePaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('ai-tool-images', 'public');
                    $imagePaths[] = $path;
                }
            }

            // Create the AI tool
            $tool = AiTool::create([
                'name' => $request->name,
                'description' => $request->description,
                'link' => $request->link,
                'documentation_url' => $request->documentation_url,
                'official_documentation' => $request->official_documentation,
                'video_demo' => $request->video_demo,
                'how_to_use' => $request->how_to_use,
                'real_examples' => $request->real_examples,
                'tags' => $request->tags,
                'difficulty_level' => $request->difficulty_level,
                'images' => $imagePaths,
                'created_by' => $request->user()->id,
            ]);

            // Attach categories if provided
            if ($request->has('categories') && is_array($request->categories)) {
                $tool->categories()->attach($request->categories);
            }

            // Attach roles if provided
            if ($request->has('roles') && is_array($request->roles)) {
                $tool->attachRoles($request->roles);
            }

            DB::commit();

            // Load relationships for response
            $tool->load(['categories', 'creator']);

            return response()->json([
                'success' => true,
                'message' => 'AI Tool created successfully',
                'tool' => $tool
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create AI tool',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified AI tool.
     */
    public function show(Request $request, AiTool $tool): JsonResponse
    {
        $user = $request->user();

        // Check if user can access this tool
        if (!$user->canAccessAiTool($tool)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        $tool->load(['categories', 'creator']);
        
        // Add role information
        $tool->roles = $tool->getRoleStrings();

        return response()->json([
            'success' => true,
            'tool' => $tool
        ]);
    }

    /**
     * Update the specified AI tool.
     */
    public function update(Request $request, AiTool $tool): JsonResponse
    {
        $user = $request->user();

        // Only the creator or owner can edit
        if ($tool->created_by !== $user->id && !$user->isOwner()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'link' => 'nullable|url|max:255',
            'documentation_url' => 'nullable|url|max:255',
            'official_documentation' => 'nullable|url|max:255',
            'video_demo' => 'nullable|url|max:255',
            'how_to_use' => 'sometimes|string',
            'real_examples' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'difficulty_level' => 'nullable|string|in:beginner,intermediate,advanced,expert',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id',
            'roles' => 'nullable|array',
            'roles.*' => 'in:owner,backend,frontend,pm,qa,designer',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:5120',
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

            // Handle image uploads
            $imagePaths = $tool->images ?? [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('ai-tool-images', 'public');
                    $imagePaths[] = $path;
                }
            }

            // Update the AI tool
            $tool->update(array_merge(
                $request->only(['name', 'description', 'link', 'documentation_url', 'official_documentation', 'video_demo', 'how_to_use', 'real_examples', 'tags', 'difficulty_level']),
                ['images' => $imagePaths]
            ));

            // Sync categories if provided
            if ($request->has('categories')) {
                $tool->categories()->sync($request->categories);
            }

            // Sync roles if provided
            if ($request->has('roles')) {
                $tool->syncRoles($request->roles);
            }

            DB::commit();

            // Load relationships for response
            $tool->load(['categories', 'creator']);
            
            // Add role information
            $tool->roles = $tool->getRoleStrings();

            return response()->json([
                'success' => true,
                'message' => 'AI Tool updated successfully',
                'tool' => $tool
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update AI tool',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified AI tool.
     */
    public function destroy(Request $request, AiTool $tool): JsonResponse
    {
        $user = $request->user();

        // Only the creator or owner can delete
        if ($tool->created_by !== $user->id && !$user->isOwner()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        try {
            $tool->delete();

            return response()->json([
                'success' => true,
                'message' => 'AI Tool deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete AI tool',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}