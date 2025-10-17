<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'target_type',
        'target_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'description',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Available actions
     */
    const ACTIONS = [
        'created' => 'Created',
        'updated' => 'Updated',
        'deleted' => 'Deleted',
        'approved' => 'Approved',
        'rejected' => 'Rejected',
        'login' => 'Login',
        'logout' => 'Logout',
    ];

    /**
     * Available target types
     */
    const TARGET_TYPES = [
        'tool' => 'Tool',
        'category' => 'Category',
        'user' => 'User',
        'system' => 'System',
    ];

    /**
     * Get the user who performed the action
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the target entity
     */
    public function target()
    {
        switch ($this->target_type) {
            case 'tool':
                return $this->belongsTo(Tool::class, 'target_id');
            case 'category':
                return $this->belongsTo(Category::class, 'target_id');
            case 'user':
                return $this->belongsTo(User::class, 'target_id');
            default:
                return null;
        }
    }

    /**
     * Get action display name
     */
    public function getActionDisplayName(): string
    {
        return self::ACTIONS[$this->action] ?? ucfirst($this->action);
    }

    /**
     * Get target type display name
     */
    public function getTargetTypeDisplayName(): string
    {
        return self::TARGET_TYPES[$this->target_type] ?? ucfirst($this->target_type);
    }

    /**
     * Get formatted description
     */
    public function getFormattedDescription(): string
    {
        if ($this->description) {
            return $this->description;
        }

        $userName = $this->user ? $this->user->name : 'Unknown User';
        $action = $this->getActionDisplayName();
        $targetType = $this->getTargetTypeDisplayName();
        $targetId = $this->target_id;

        return "{$userName} {$action} {$targetType} #{$targetId}";
    }

    /**
     * Scope for filtering by action
     */
    public function scopeByAction($query, $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope for filtering by target type
     */
    public function scopeByTargetType($query, $targetType)
    {
        return $query->where('target_type', $targetType);
    }

    /**
     * Scope for filtering by user
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for filtering by date range
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Scope for recent logs
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
