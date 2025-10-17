<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TwoFactorController;
use App\Http\Controllers\Api\ToolController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ToolControllerNew;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\AuditController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*
|--------------------------------------------------------------------------
| Public Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/roles', [AuthController::class, 'roles']);

// Public category routes (for dropdowns and public access)
Route::get('/categories', [CategoryController::class, 'index']);

// Public tools routes (for testing - should be protected in production)
Route::get('/tools-new', [ToolControllerNew::class, 'index'])->name('tools-new.index');

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum Authentication Required)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    
    /*
    |--------------------------------------------------------------------------
    | User Management Routes
    |--------------------------------------------------------------------------
    */
    
    // Get authenticated user information
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // User logout
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Get current user profile
    Route::get('/me', [AuthController::class, 'me']);
    
    /*
    |--------------------------------------------------------------------------
    | Two-Factor Authentication Routes
    |--------------------------------------------------------------------------
    |
    | Routes for managing two-factor authentication settings and verification.
    | All routes require authentication via Sanctum middleware.
    |
    */
    
    // GET /api/2fa/status - Get user's 2FA status
    Route::get('/2fa/status', [TwoFactorController::class, 'status']);
    
    // POST /api/2fa/enable/email - Enable 2FA with email
    Route::post('/2fa/enable/email', [TwoFactorController::class, 'enableEmail']);
    
    // POST /api/2fa/enable/telegram - Enable 2FA with Telegram
    Route::post('/2fa/enable/telegram', [TwoFactorController::class, 'enableTelegram']);
    
    // POST /api/2fa/enable/totp - Enable 2FA with TOTP (Google Authenticator)
    Route::post('/2fa/enable/totp', [TwoFactorController::class, 'enableTotp']);
    
    // POST /api/2fa/verify - Verify 2FA setup
    Route::post('/2fa/verify', [TwoFactorController::class, 'verify']);
    
    // DELETE /api/2fa/disable - Disable 2FA
    Route::delete('/2fa/disable', [TwoFactorController::class, 'disable']);
    
    // POST /api/2fa/generate-code - Generate new verification code
    Route::post('/2fa/generate-code', [TwoFactorController::class, 'generateCode']);
    
    // POST /api/2fa/connect-telegram - Connect Telegram account
    Route::post('/2fa/connect-telegram', [TwoFactorController::class, 'connectTelegram']);
    
    // GET /api/2fa/telegram-bot-info - Get Telegram bot information
    Route::get('/2fa/telegram-bot-info', [TwoFactorController::class, 'getTelegramBotInfo']);
    
    /*
    |--------------------------------------------------------------------------
    | Statistics & Analytics Routes
    |--------------------------------------------------------------------------
    |
    | Routes for getting cached statistics and analytics data.
    | All routes require authentication via Sanctum middleware.
    |
    */
    
    // GET /api/stats - Get role-specific statistics
    Route::get('/stats', [StatsController::class, 'index']);
    
    // GET /api/stats/admin - Get admin statistics (owner only)
    Route::get('/stats/admin', [StatsController::class, 'admin']);
    
    // GET /api/stats/cache - Get cache statistics (owner only)
    Route::get('/stats/cache', [StatsController::class, 'cache']);
    
    // POST /api/stats/warm-cache - Warm up cache (owner only)
    Route::post('/stats/warm-cache', [StatsController::class, 'warmCache']);
    
    // POST /api/stats/clear-cache - Clear cache (owner only)
    Route::post('/stats/clear-cache', [StatsController::class, 'clearCache']);
    
    /*
    |--------------------------------------------------------------------------
    | Audit Logs Routes (Owner Only)
    |--------------------------------------------------------------------------
    |
    | Routes for viewing and managing audit logs.
    | All routes require Owner role access.
    |
    */
    
    // GET /api/audit-logs - Get audit logs with filtering (owner only)
    Route::get('/audit-logs', [AuditController::class, 'index']);
    
    // GET /api/audit-logs/filter-options - Get filter options (owner only)
    Route::get('/audit-logs/filter-options', [AuditController::class, 'filterOptions'])
        ->middleware('owner');
    
    // GET /api/audit-logs/stats - Get audit statistics (owner only)
    Route::get('/audit-logs/stats', [AuditController::class, 'stats']);
    
    // GET /api/audit-logs/export - Export audit logs to CSV (owner only)
    Route::get('/audit-logs/export', [AuditController::class, 'export']);
    
    // GET /api/audit-logs/{id} - Get specific audit log (owner only) - MUST BE LAST
    Route::get('/audit-logs/{auditLog}', [AuditController::class, 'show']);
    
    /*
    |--------------------------------------------------------------------------
    | AI Tools RESTful API Routes
    |--------------------------------------------------------------------------
    |
    | Full CRUD operations for AI tools with role-based access control.
    | All routes require authentication via Sanctum middleware.
    |
    */
    
    // GET /api/tools - List all AI tools accessible by user's role
    Route::get('/tools', [ToolController::class, 'index'])
        ->name('tools.index')
        ->middleware('auth:sanctum');
    
    // POST /api/tools - Create a new AI tool
    Route::post('/tools', [ToolController::class, 'store'])
        ->name('tools.store')
        ->middleware('auth:sanctum');
    
    // GET /api/tools/{id} - Show specific AI tool
    Route::get('/tools/{tool}', [ToolController::class, 'show'])
        ->name('tools.show')
        ->middleware('auth:sanctum');
    
    // PUT/PATCH /api/tools/{id} - Update specific AI tool
    Route::put('/tools/{tool}', [ToolController::class, 'update'])
        ->name('tools.update')
        ->middleware('auth:sanctum');
    Route::patch('/tools/{tool}', [ToolController::class, 'update']);
    
    // DELETE /api/tools/{id} - Delete specific AI tool
    Route::delete('/tools/{tool}', [ToolController::class, 'destroy'])
        ->name('tools.destroy')
        ->middleware('auth:sanctum');
    
    /*
    |--------------------------------------------------------------------------
    | Categories RESTful API Routes
    |--------------------------------------------------------------------------
    |
    | Category management with role-based access control.
    | - Public read access for dropdowns
    | - Owner-only write access for management
    |
    */
    
    // GET /api/categories - List all categories (already defined above as public)
    // This route is accessible without authentication for dropdown usage
    
    // POST /api/categories - Create a new category (Owner only)
    Route::post('/categories', [CategoryController::class, 'store'])
        ->name('categories.store')
        ->middleware(['auth:sanctum', 'role:owner']);
    
    // GET /api/categories/{id} - Show specific category (Owner only)
    Route::get('/categories/{category}', [CategoryController::class, 'show'])
        ->name('categories.show')
        ->middleware(['auth:sanctum', 'role:owner']);
    
    // PUT/PATCH /api/categories/{id} - Update specific category (Owner only)
    Route::put('/categories/{category}', [CategoryController::class, 'update'])
        ->name('categories.update')
        ->middleware(['auth:sanctum', 'role:owner']);
    Route::patch('/categories/{category}', [CategoryController::class, 'update']);
    
    // DELETE /api/categories/{id} - Delete specific category (Owner only)
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
        ->name('categories.destroy')
        ->middleware(['auth:sanctum', 'role:owner']);
    
    /*
    |--------------------------------------------------------------------------
    | Alternative Resource Route Definitions
    |--------------------------------------------------------------------------
    |
    | Uncomment these lines if you prefer using Laravel's resource routes
    | instead of individual route definitions above.
    |
    */
    
    // AI Tools resource routes (full CRUD)
    // Route::apiResource('tools', ToolController::class)
    //     ->middleware('auth:sanctum');
    
    // Categories resource routes (Owner only, except index)
    // Route::middleware(['auth:sanctum', 'role:owner'])->group(function () {
    //     Route::apiResource('categories', CategoryController::class)->except(['index']);
    // });
    
    /*
    |--------------------------------------------------------------------------
    | New Tool API Routes (Tool Model)
    |--------------------------------------------------------------------------
    |
    | RESTful API routes for the new Tool model with enhanced filtering
    | and relationship management.
    |
    */
    
    
    // POST /api/tools-new - Create a new tool
    Route::post('/tools-new', [ToolControllerNew::class, 'store'])
        ->name('tools-new.store')
        ->middleware('auth:sanctum');
    
    // GET /api/tools-new/my-tools - Get user's own tools
    Route::get('/tools-new/my-tools', [ToolControllerNew::class, 'myTools'])
        ->name('tools-new.my-tools')
        ->middleware('auth:sanctum');
    
    // GET /api/tools-new/{id} - Get detailed tool info
    Route::get('/tools-new/{tool}', [ToolControllerNew::class, 'show'])
        ->name('tools-new.show')
        ->middleware('auth:sanctum');
    
    // PUT/PATCH /api/tools-new/{id} - Edit tool
    Route::put('/tools-new/{tool}', [ToolControllerNew::class, 'update'])
        ->name('tools-new.update')
        ->middleware('auth:sanctum');
    Route::patch('/tools-new/{tool}', [ToolControllerNew::class, 'update']);
    
    // DELETE /api/tools-new/{id} - Delete tool
    Route::delete('/tools-new/{tool}', [ToolControllerNew::class, 'destroy'])
        ->name('tools-new.destroy')
        ->middleware('auth:sanctum');
    
    /*
    |--------------------------------------------------------------------------
    | Admin Panel Routes (Owner Only)
    |--------------------------------------------------------------------------
    |
    | Admin panel routes for managing tools approval workflow.
    | All routes require Owner role via OwnerMiddleware.
    |
    */
    
    Route::middleware('owner')->prefix('admin')->group(function () {
        // GET /api/admin/tools - List all tools with filtering
        Route::get('/tools', [AdminController::class, 'index'])
            ->name('admin.tools.index');
        
        // GET /api/admin/tools/{tool} - Get tool details
        Route::get('/tools/{tool}', [AdminController::class, 'show'])
            ->name('admin.tools.show');
        
        // POST /api/admin/tools/{tool}/approve - Approve tool
        Route::post('/tools/{tool}/approve', [AdminController::class, 'approve'])
            ->name('admin.tools.approve');
        
        // POST /api/admin/tools/{tool}/approved - Approve tool (alias for frontend compatibility)
        Route::post('/tools/{tool}/approved', [AdminController::class, 'approve'])
            ->name('admin.tools.approved');
        
        // POST /api/admin/tools/{tool}/reject - Reject tool
        Route::post('/tools/{tool}/reject', [AdminController::class, 'reject'])
            ->name('admin.tools.reject');
        
        // POST /api/admin/tools/{tool}/rejected - Reject tool (alias for frontend compatibility)
        Route::post('/tools/{tool}/rejected', [AdminController::class, 'reject'])
            ->name('admin.tools.rejected');
        
        // PUT /api/admin/tools/{tool}/status - Update tool status
        Route::put('/tools/{tool}/status', [AdminController::class, 'updateStatus'])
            ->name('admin.tools.update-status');
        
        // GET /api/admin/dashboard - Get admin dashboard stats
        Route::get('/dashboard', [AdminController::class, 'dashboard'])
            ->name('admin.dashboard');
    });
    
});

/*
|--------------------------------------------------------------------------
| Route Documentation
|--------------------------------------------------------------------------
|
| AI Tools API Endpoints:
|
| GET    /api/tools              - List all tools accessible by user's role
| POST   /api/tools              - Create a new AI tool
| GET    /api/tools/{id}         - Get specific AI tool details
| PUT    /api/tools/{id}         - Update AI tool (creator or owner only)
| DELETE /api/tools/{id}         - Delete AI tool (creator or owner only)
|
| Categories API Endpoints:
|
| GET    /api/categories         - List all categories (public access)
| POST   /api/categories         - Create new category (owner only)
| GET    /api/categories/{id}    - Get specific category (owner only)
| PUT    /api/categories/{id}    - Update category (owner only)
| DELETE /api/categories/{id}    - Delete category (owner only)
|
| Authentication:
|
| POST   /api/login              - User login
| POST   /api/register           - User registration
| POST   /api/logout             - User logout (authenticated)
| GET    /api/me                 - Get current user (authenticated)
| GET    /api/roles              - Get available user roles
| GET    /api/user               - Get authenticated user info
|
| Middleware Protection:
|
| - auth:sanctum                 - Requires valid Sanctum token
| - role:owner                   - Requires owner role (for category management)
|
*/
