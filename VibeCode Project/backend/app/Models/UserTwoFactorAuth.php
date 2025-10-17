<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserTwoFactorAuth extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_two_factor_auth';

    protected $fillable = [
        'user_id',
        'method',
        'secret',
        'telegram_chat_id',
        'is_enabled',
        'last_used_at',
        'verified_at',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'last_used_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    /**
     * Get the user that owns the two-factor authentication.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if 2FA is enabled for this user
     */
    public function isEnabled(): bool
    {
        return $this->is_enabled && $this->method && $this->verified_at;
    }

    /**
     * Get the display name for the 2FA method
     */
    public function getMethodDisplayName(): string
    {
        return match($this->method) {
            'email' => 'Email',
            'telegram' => 'Telegram Bot',
            'totp' => 'Google Authenticator',
            default => 'Unknown'
        };
    }

    /**
     * Scope to get enabled 2FA for a user
     */
    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true)
                    ->whereNotNull('method')
                    ->whereNotNull('verified_at');
    }
}
