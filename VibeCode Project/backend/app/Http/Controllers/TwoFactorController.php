<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserTwoFactorAuth;
use App\Services\TwoFactorService;
use App\Services\TotpService;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TwoFactorController extends Controller
{
    protected TwoFactorService $twoFactorService;
    protected TotpService $totpService;
    protected TelegramService $telegramService;

    public function __construct(
        TwoFactorService $twoFactorService,
        TotpService $totpService,
        TelegramService $telegramService
    ) {
        $this->twoFactorService = $twoFactorService;
        $this->totpService = $totpService;
        $this->telegramService = $telegramService;
    }

    /**
     * Get user's 2FA status
     */
    public function status(Request $request)
    {
        $user = $request->user();
        $enabledMethod = $user->getEnabledTwoFactorMethod();

        return response()->json([
            'has_two_factor' => $user->hasTwoFactorEnabled(),
            'method' => $enabledMethod ? $enabledMethod->method : null,
            'method_display_name' => $enabledMethod ? $enabledMethod->getMethodDisplayName() : null,
            'last_used_at' => $enabledMethod ? $enabledMethod->last_used_at : null,
        ]);
    }

    /**
     * Enable 2FA with email method
     */
    public function enableEmail(Request $request)
    {
        $user = $request->user();

        if ($user->hasTwoFactorEnabled()) {
            return response()->json([
                'success' => false,
                'message' => '2FA is already enabled. Please disable it first to change methods.'
            ], 400);
        }

        $result = $this->twoFactorService->enableTwoFactor($user, 'email');
        
        if ($result['success']) {
            // Generate and send verification code
            $codeResult = $this->twoFactorService->generateCode($user, 'email', $request->ip());
            
            if ($codeResult['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Verification code sent to your email address.',
                    'data' => $result['data']
                ]);
            }
        }

        return response()->json($result, 400);
    }

    /**
     * Enable 2FA with Telegram method
     */
    public function enableTelegram(Request $request)
    {
        $user = $request->user();

        if ($user->hasTwoFactorEnabled()) {
            return response()->json([
                'success' => false,
                'message' => '2FA is already enabled. Please disable it first to change methods.'
            ], 400);
        }

        // Check if Telegram service is configured
        if (!$this->telegramService->isConfigured()) {
            return response()->json([
                'success' => false,
                'message' => 'Telegram service is not configured. Please contact your administrator to set up TELEGRAM_BOT_TOKEN and TELEGRAM_BOT_USERNAME in the environment.'
            ], 400);
        }

        $result = $this->twoFactorService->enableTwoFactor($user, 'telegram');
        
        return response()->json($result);
    }

    /**
     * Enable 2FA with TOTP method
     */
    public function enableTotp(Request $request)
    {
        $user = $request->user();

        if ($user->hasTwoFactorEnabled()) {
            return response()->json([
                'success' => false,
                'message' => '2FA is already enabled. Please disable it first to change methods.'
            ], 400);
        }

        $secret = $this->totpService->generateSecret();
        $qrCodeUrl = $this->totpService->generateQrCodeUrl($user->email, $secret);

        $result = $this->twoFactorService->enableTwoFactor($user, 'totp', [
            'secret' => $secret
        ]);

        return response()->json([
            'success' => true,
            'message' => 'TOTP setup initiated. Please scan the QR code with your authenticator app.',
            'data' => [
                'method' => 'totp',
                'secret' => $secret,
                'qr_code_url' => $qrCodeUrl,
            ]
        ]);
    }

    /**
     * Verify 2FA setup
     */
    public function verify(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|size:6',
            'method' => 'required|in:email,telegram,totp',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $code = $request->input('code');
        $method = $request->input('method');

        // For TOTP, verify against the secret
        if ($method === 'totp') {
            $twoFactorAuth = $user->twoFactorAuth()->where('method', 'totp')->first();
            
            if (!$twoFactorAuth || !$twoFactorAuth->secret) {
                return response()->json([
                    'success' => false,
                    'message' => 'No TOTP setup found.'
                ], 400);
            }

            if (!$this->totpService->verifyCode($twoFactorAuth->secret, $code)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid TOTP code.'
                ], 400);
            }

            // Enable 2FA
            $twoFactorAuth->update([
                'is_enabled' => true,
                'verified_at' => now(),
                'last_used_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => '2FA has been successfully enabled with Google Authenticator.'
            ]);
        }

        // For email and telegram, use the standard verification
        $result = $this->twoFactorService->verifyTwoFactor($user, $code);
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Disable 2FA
     */
    public function disable(Request $request)
    {
        $user = $request->user();

        if (!$user->hasTwoFactorEnabled()) {
            return response()->json([
                'success' => false,
                'message' => '2FA is not enabled.'
            ], 400);
        }

        $this->twoFactorService->disableTwoFactor($user);

        return response()->json([
            'success' => true,
            'message' => '2FA has been successfully disabled.'
        ]);
    }

    /**
     * Generate a new verification code
     */
    public function generateCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'method' => 'required|in:email,telegram',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid method.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $method = $request->input('method');

        $result = $this->twoFactorService->generateCode($user, $method, $request->ip());
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Connect Telegram account
     */
    public function connectTelegram(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'telegram_chat_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $telegramChatId = $request->input('telegram_chat_id');

        // Update the telegram chat ID in the pending 2FA setup
        $twoFactorAuth = $user->twoFactorAuth()->where('method', 'telegram')->where('is_enabled', false)->first();
        
        if (!$twoFactorAuth) {
            return response()->json([
                'success' => false,
                'message' => 'No pending Telegram 2FA setup found.'
            ], 400);
        }

        $twoFactorAuth->update(['telegram_chat_id' => $telegramChatId]);

        // Send verification code
        $result = $this->twoFactorService->generateCode($user, 'telegram', $request->ip());

        return response()->json([
            'success' => true,
            'message' => 'Telegram account connected. Verification code sent.',
            'data' => $result
        ]);
    }

    /**
     * Get Telegram bot info
     */
    public function getTelegramBotInfo()
    {
        $botInfo = $this->telegramService->getBotInfo();
        
        return response()->json([
            'success' => true,
            'data' => [
                'username' => $botInfo['username'] ?? config('services.telegram.bot_username'),
                'first_name' => $botInfo['first_name'] ?? 'AI Tools 2FA Bot',
            ]
        ]);
    }
}
