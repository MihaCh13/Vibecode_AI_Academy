<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and create token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'two_factor_code' => 'nullable|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user has 2FA enabled
        if ($user->hasTwoFactorEnabled()) {
            $twoFactorMethod = $user->getEnabledTwoFactorMethod();
            
            // If no 2FA code provided, request it
            if (!$request->has('two_factor_code') || !$request->two_factor_code) {
                return response()->json([
                    'requires_two_factor' => true,
                    'method' => $twoFactorMethod->method,
                    'method_display_name' => $twoFactorMethod->getMethodDisplayName(),
                    'message' => 'Please enter your 2FA code to complete login.',
                ], 200);
            }

            // Verify 2FA code
            $twoFactorService = app(\App\Services\TwoFactorService::class);
            $totpService = app(\App\Services\TotpService::class);
            
            $isValidCode = false;
            if ($twoFactorMethod->method === 'totp') {
                $isValidCode = $totpService->verifyCode($twoFactorMethod->secret, $request->two_factor_code);
            } else {
                $isValidCode = $twoFactorService->verifyCode($user, $request->two_factor_code, $twoFactorMethod->method);
            }

            if (!$isValidCode) {
                throw ValidationException::withMessages([
                    'two_factor_code' => ['Invalid 2FA code.'],
                ]);
            }
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        // Log audit trail
        AuditService::logUserLogin($user);

        return response()->json([
            'user' => $user,
            'token' => $token,
            'role' => $user->role,
            'role_display_name' => $user->getRoleDisplayName(),
            'requires_two_factor' => false,
        ]);
    }

    /**
     * Register new user
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:' . implode(',', array_keys(User::ROLES)),
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        // Log audit trail
        AuditService::logUserRegistered($user);

        return response()->json([
            'user' => $user,
            'token' => $token,
            'role' => $user->role,
            'role_display_name' => $user->getRoleDisplayName(),
        ], 201);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Log audit trail before logout
        if ($user) {
            AuditService::logUserLogout($user);
        }
        
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Get current user
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
            'role' => $request->user()->role,
            'role_display_name' => $request->user()->getRoleDisplayName(),
        ]);
    }

    /**
     * Get available roles
     */
    public function roles()
    {
        return response()->json([
            'roles' => User::ROLES,
        ]);
    }
}
