<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\DB;

class AiTool extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'link',
        'documentation_url',
        'official_documentation',
        'video_demo',
        'tags',
        'difficulty_level',
        'how_to_use',
        'real_examples',
        'images',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'tags' => 'array',
        'images' => 'array',
    ];

    /**
     * Get the user who created this AI tool.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * The categories that belong to the AI tool.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'ai_tool_category');
    }

    /**
     * The roles that can access this AI tool.
     * This uses a custom pivot table with string roles.
     */
    public function roles()
    {
        return $this->belongsToMany(
            User::class, 
            'ai_tool_role', 
            'ai_tool_id', 
            'role'
        )->withPivot('role');
    }

    /**
     * Get the role strings for this AI tool.
     */
    public function getRoleStrings()
    {
        return DB::table('ai_tool_role')
            ->where('ai_tool_id', $this->id)
            ->pluck('role')
            ->toArray();
    }

    /**
     * Attach roles to this AI tool.
     */
    public function attachRoles(array $roles)
    {
        foreach ($roles as $role) {
            DB::table('ai_tool_role')->updateOrInsert([
                'ai_tool_id' => $this->id,
                'role' => $role
            ], [
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }

    /**
     * Detach roles from this AI tool.
     */
    public function detachRoles(array $roles)
    {
        DB::table('ai_tool_role')
            ->where('ai_tool_id', $this->id)
            ->whereIn('role', $roles)
            ->delete();
    }

    /**
     * Sync roles for this AI tool.
     */
    public function syncRoles(array $roles)
    {
        // Remove all existing roles
        DB::table('ai_tool_role')->where('ai_tool_id', $this->id)->delete();
        
        // Add new roles
        $this->attachRoles($roles);
    }

    /**
     * Check if this AI tool is accessible by a specific role.
     */
    public function isAccessibleByRole(string $role): bool
    {
        return DB::table('ai_tool_role')
            ->where('ai_tool_id', $this->id)
            ->where('role', $role)
            ->exists();
    }
}