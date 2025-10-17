<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditService
{
    /**
     * Log an action to the audit trail
     */
    public static function log(
        string $action,
        string $targetType,
        int $targetId,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $description = null,
        ?Request $request = null
    ): void {
        $request = $request ?? request();
        $user = Auth::user();

        if (!$user) {
            return; // Don't log if no authenticated user
        }

        AuditLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request ? $request->ip() : null,
            'user_agent' => $request ? $request->userAgent() : null,
            'description' => $description,
        ]);
    }

    /**
     * Log tool creation
     */
    public static function logToolCreated(int $toolId, array $toolData): void
    {
        self::log(
            'created',
            'tool',
            $toolId,
            null,
            $toolData,
            "Tool '{$toolData['name']}' was created",
            null
        );
    }

    /**
     * Log tool update
     */
    public static function logToolUpdated(int $toolId, array $oldValues, array $newValues): void
    {
        $toolName = $newValues['name'] ?? $oldValues['name'] ?? "Tool #{$toolId}";
        
        self::log(
            'updated',
            'tool',
            $toolId,
            $oldValues,
            $newValues,
            "Tool '{$toolName}' was updated",
            null
        );
    }

    /**
     * Log tool deletion
     */
    public static function logToolDeleted(int $toolId, array $toolData): void
    {
        $toolName = $toolData['name'] ?? "Tool #{$toolId}";
        
        self::log(
            'deleted',
            'tool',
            $toolId,
            $toolData,
            null,
            "Tool '{$toolName}' was deleted",
            null
        );
    }

    /**
     * Log tool approval
     */
    public static function logToolApproved(int $toolId, array $toolData): void
    {
        $toolName = $toolData['name'] ?? "Tool #{$toolId}";
        
        self::log(
            'approved',
            'tool',
            $toolId,
            null,
            $toolData,
            "Tool '{$toolName}' was approved",
            null
        );
    }

    /**
     * Log tool rejection
     */
    public static function logToolRejected(int $toolId, array $toolData): void
    {
        $toolName = $toolData['name'] ?? "Tool #{$toolId}";
        
        self::log(
            'rejected',
            'tool',
            $toolId,
            null,
            $toolData,
            "Tool '{$toolName}' was rejected",
            null
        );
    }

    /**
     * Log category creation
     */
    public static function logCategoryCreated(int $categoryId, array $categoryData): void
    {
        self::log(
            'created',
            'category',
            $categoryId,
            null,
            $categoryData,
            "Category '{$categoryData['name']}' was created",
            null
        );
    }

    /**
     * Log category update
     */
    public static function logCategoryUpdated(int $categoryId, array $oldValues, array $newValues): void
    {
        $categoryName = $newValues['name'] ?? $oldValues['name'] ?? "Category #{$categoryId}";
        
        self::log(
            'updated',
            'category',
            $categoryId,
            $oldValues,
            $newValues,
            "Category '{$categoryName}' was updated",
            null
        );
    }

    /**
     * Log category deletion
     */
    public static function logCategoryDeleted(int $categoryId, array $categoryData): void
    {
        $categoryName = $categoryData['name'] ?? "Category #{$categoryId}";
        
        self::log(
            'deleted',
            'category',
            $categoryId,
            $categoryData,
            null,
            "Category '{$categoryName}' was deleted",
            null
        );
    }

    /**
     * Log user login
     */
    public static function logUserLogin(User $user): void
    {
        self::log(
            'login',
            'user',
            $user->id,
            null,
            ['email' => $user->email, 'role' => $user->role],
            "User '{$user->name}' logged in",
            null
        );
    }

    /**
     * Log user logout
     */
    public static function logUserLogout(User $user): void
    {
        self::log(
            'logout',
            'user',
            $user->id,
            null,
            ['email' => $user->email, 'role' => $user->role],
            "User '{$user->name}' logged out",
            null
        );
    }

    /**
     * Log user registration
     */
    public static function logUserRegistered(User $user): void
    {
        self::log(
            'created',
            'user',
            $user->id,
            null,
            ['name' => $user->name, 'email' => $user->email, 'role' => $user->role],
            "New user '{$user->name}' registered with role '{$user->role}'",
            null
        );
    }

    /**
     * Get audit statistics
     */
    public static function getStats(): array
    {
        $totalLogs = AuditLog::count();
        $logsToday = AuditLog::whereDate('created_at', today())->count();
        $logsThisWeek = AuditLog::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count();
        $logsThisMonth = AuditLog::whereMonth('created_at', now()->month)->count();

        $actionsCount = AuditLog::selectRaw('action, COUNT(*) as count')
            ->groupBy('action')
            ->pluck('count', 'action')
            ->toArray();

        $targetTypesCount = AuditLog::selectRaw('target_type, COUNT(*) as count')
            ->groupBy('target_type')
            ->pluck('count', 'target_type')
            ->toArray();

        $topUsers = AuditLog::selectRaw('user_id, COUNT(*) as count')
            ->with('user:id,name,email')
            ->groupBy('user_id')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'user' => $item->user,
                    'count' => $item->count,
                ];
            });

        return [
            'total_logs' => $totalLogs,
            'logs_today' => $logsToday,
            'logs_this_week' => $logsThisWeek,
            'logs_this_month' => $logsThisMonth,
            'actions_count' => $actionsCount,
            'target_types_count' => $targetTypesCount,
            'top_users' => $topUsers,
        ];
    }
}
