<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get all ai_tools data
        $aiTools = DB::table('ai_tools')->get();
        
        foreach ($aiTools as $aiTool) {
            // Find the first category for this tool from ai_tool_category table
            $categoryId = null;
            $categoryRelation = DB::table('ai_tool_category')
                ->where('ai_tool_id', $aiTool->id)
                ->first();
            
            if ($categoryRelation) {
                $category = DB::table('categories')->where('id', $categoryRelation->category_id)->first();
                if ($category) {
                    $categoryId = $category->id;
                }
            }
            
            // If no category, create a default one
            if (!$categoryId) {
                $categoryId = DB::table('categories')->insertGetId([
                    'name' => 'General',
                    'description' => 'General AI tools',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            
            // Insert into tools table
            $toolId = DB::table('tools')->insertGetId([
                'name' => $aiTool->name,
                'link' => $aiTool->link ?: 'https://example.com',
                'official_doc_link' => $aiTool->official_documentation,
                'description' => $aiTool->description ?: 'No description available',
                'how_to_use' => $aiTool->how_to_use ?: 'No usage instructions available',
                'examples' => $aiTool->real_examples,
                'category_id' => $categoryId,
                'user_id' => $aiTool->created_by,
                'created_at' => $aiTool->created_at,
                'updated_at' => $aiTool->updated_at,
            ]);
            
            // Handle roles - get roles from ai_tool_role table
            $roleIds = DB::table('ai_tool_role')
                ->where('ai_tool_id', $aiTool->id)
                ->pluck('role')
                ->toArray();
            
            // Convert role names to role IDs
            $newRoleIds = [];
            foreach ($roleIds as $roleName) {
                $role = DB::table('roles')->where('name', $roleName)->first();
                if ($role) {
                    $newRoleIds[] = $role->id;
                }
            }
            
            // Attach roles to the new tool
            foreach ($newRoleIds as $roleId) {
                DB::table('role_tool')->insert([
                    'role_id' => $roleId,
                    'tool_id' => $toolId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            
            // Handle tags if they exist
            if ($aiTool->tags) {
                $tags = json_decode($aiTool->tags, true);
                if (is_array($tags)) {
                    foreach ($tags as $tagName) {
                        // Find or create tag
                        $tag = DB::table('tags')->where('name', $tagName)->first();
                        if (!$tag) {
                            $tagId = DB::table('tags')->insertGetId([
                                'name' => $tagName,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        } else {
                            $tagId = $tag->id;
                        }
                        
                        // Attach tag to tool
                        DB::table('tag_tool')->insert([
                            'tag_id' => $tagId,
                            'tool_id' => $toolId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is not reversible as it transforms data
        // If you need to reverse, you would need to implement the reverse logic
    }
};