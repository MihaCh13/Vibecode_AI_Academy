<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Response;

class AuditController extends Controller
{
    /**
     * Display a listing of audit logs with filtering
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with(['user:id,name,email,role'])
            ->orderBy('created_at', 'desc');

        // Filter by user
        if ($request->has('user_id') && $request->user_id !== 'all') {
            $query->where('user_id', $request->user_id);
        }

        // Filter by action
        if ($request->has('action') && $request->action !== 'all') {
            $query->where('action', $request->action);
        }

        // Filter by target type
        if ($request->has('target_type') && $request->target_type !== 'all') {
            $query->where('target_type', $request->target_type);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Search in description
        if ($request->has('search') && !empty($request->search)) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        // Pagination
        $perPage = min($request->get('per_page', 15), 100); // Max 100 per page
        $logs = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $logs,
            'filters' => $request->only(['user_id', 'action', 'target_type', 'start_date', 'end_date', 'search'])
        ]);
    }

    /**
     * Display the specified audit log
     */
    public function show(AuditLog $auditLog): JsonResponse
    {
        $auditLog->load(['user:id,name,email,role']);

        return response()->json([
            'success' => true,
            'data' => $auditLog
        ]);
    }

    /**
     * Get audit statistics
     */
    public function stats(): JsonResponse
    {
        $stats = AuditService::getStats();

        return response()->json([
            'success' => true,
            'stats' => $stats
        ]);
    }

    /**
     * Export audit logs to CSV
     */
    public function export(Request $request)
    {
        $query = AuditLog::with(['user:id,name,email,role'])
            ->orderBy('created_at', 'desc');

        // Apply same filters as index
        if ($request->has('user_id') && $request->user_id !== 'all') {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('action') && $request->action !== 'all') {
            $query->where('action', $request->action);
        }

        if ($request->has('target_type') && $request->target_type !== 'all') {
            $query->where('target_type', $request->target_type);
        }

        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        if ($request->has('search') && !empty($request->search)) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $logs = $query->get();

        $csvData = "ID,User,Action,Target Type,Target ID,Description,IP Address,User Agent,Created At\n";

        foreach ($logs as $log) {
            $csvData .= sprintf(
                "%d,%s,%s,%s,%d,\"%s\",%s,\"%s\",%s\n",
                $log->id,
                $log->user ? $log->user->name : 'Unknown',
                $log->action,
                $log->target_type,
                $log->target_id,
                str_replace('"', '""', $log->description ?? ''),
                $log->ip_address,
                str_replace('"', '""', $log->user_agent ?? ''),
                $log->created_at->format('Y-m-d H:i:s')
            );
        }

        $filename = 'audit_logs_' . now()->format('Y-m-d_H-i-s') . '.csv';

        return Response::make($csvData, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Get filter options for the audit logs
     */
    public function filterOptions(): JsonResponse
    {
        $actions = AuditLog::ACTIONS;
        $targetTypes = AuditLog::TARGET_TYPES;
        
        $users = User::select('id', 'name', 'email', 'role')
            ->whereIn('id', AuditLog::distinct('user_id')->pluck('user_id'))
            ->orderBy('name')
            ->get();

        $dateRange = [
            'earliest' => AuditLog::min('created_at'),
            'latest' => AuditLog::max('created_at'),
        ];

        return response()->json([
            'success' => true,
            'options' => [
                'actions' => $actions,
                'target_types' => $targetTypes,
                'users' => $users,
                'date_range' => $dateRange,
            ]
        ]);
    }
}
