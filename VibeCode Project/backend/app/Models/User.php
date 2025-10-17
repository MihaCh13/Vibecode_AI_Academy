<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
// use Laravel\Fortify\TwoFactorAuthenticatable; // Using custom 2FA implementation
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Available roles
     */
    const ROLES = [
        'owner' => 'Owner (Admin)',
        'backend' => 'Backend Developer',
        'frontend' => 'Frontend Developer',
        'pm' => 'Product Manager',
        'qa' => 'QA Engineer',
        'designer' => 'Designer',
    ];

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user is owner (admin)
     */
    public function isOwner(): bool
    {
        return $this->hasRole('owner');
    }

    /**
     * Check if user is admin (alias for owner)
     */
    public function isAdmin(): bool
    {
        return $this->isOwner();
    }

    /**
     * Get role display name
     */
    public function getRoleDisplayName(): string
    {
        return self::ROLES[$this->role] ?? 'Unknown';
    }

    /**
     * Get the AI tools created by this user.
     */
    public function aiTools(): HasMany
    {
        return $this->hasMany(AiTool::class, 'created_by');
    }

    /**
     * Get the tools created by this user.
     */
    public function tools(): HasMany
    {
        return $this->hasMany(Tool::class);
    }

    /**
     * Get AI tools accessible by this user's role.
     */
    public function accessibleAiTools()
    {
        return AiTool::whereIn('id', function($query) {
            $query->select('ai_tool_id')
                ->from('ai_tool_role')
                ->where('role', $this->role);
        })->get();
    }

    /**
     * Check if this user can access a specific AI tool.
     */
    public function canAccessAiTool(AiTool $aiTool): bool
    {
        return DB::table('ai_tool_role')
            ->where('ai_tool_id', $aiTool->id)
            ->where('role', $this->role)
            ->exists();
    }

    /**
     * Get the user's two-factor authentication settings.
     */
    public function twoFactorAuth(): HasMany
    {
        return $this->hasMany(UserTwoFactorAuth::class);
    }

    /**
     * Get the user's two-factor authentication codes.
     */
    public function twoFactorCodes(): HasMany
    {
        return $this->hasMany(TwoFactorCode::class);
    }

    /**
     * Check if user has 2FA enabled
     */
    public function hasTwoFactorEnabled(): bool
    {
        return $this->twoFactorAuth()->enabled()->exists();
    }

    /**
     * Get the enabled 2FA method for this user
     */
    public function getEnabledTwoFactorMethod(): ?UserTwoFactorAuth
    {
        return $this->twoFactorAuth()->enabled()->first();
    }
}
