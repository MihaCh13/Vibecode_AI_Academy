<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserTwoFactorAuth;
use App\Models\TwoFactorCode;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TwoFactorService
{
    /**
     * Enable 2FA for a user with the specified method
     */
    public function enableTwoFactor(User $user, string $method, array $options = []): array
    {
        // Disable any existing 2FA first
        $this->disableTwoFactor($user);

        $twoFactorAuth = UserTwoFactorAuth::create([
            'user_id' => $user->id,
            'method' => $method,
            'secret' => $options['secret'] ?? null,
            'telegram_chat_id' => $options['telegram_chat_id'] ?? null,
            'is_enabled' => false, // Will be enabled after verification
        ]);

        return [
            'success' => true,
            'message' => '2FA setup initiated. Please verify to complete setup.',
            'data' => $this->getSetupData($twoFactorAuth, $method)
        ];
    }

    /**
     * Verify and enable 2FA
     */
    public function verifyTwoFactor(User $user, string $code): array
    {
        $twoFactorAuth = $user->twoFactorAuth()->where('is_enabled', false)->first();
        
        if (!$twoFactorAuth) {
            return [
                'success' => false,
                'message' => 'No pending 2FA setup found.'
            ];
        }

        $isValid = $this->verifyCode($user, $code, $twoFactorAuth->method);
        
        if ($isValid) {
            $twoFactorAuth->update([
                'is_enabled' => true,
                'verified_at' => now(),
                'last_used_at' => now(),
            ]);

            return [
                'success' => true,
                'message' => '2FA has been successfully enabled.'
            ];
        }

        return [
            'success' => false,
            'message' => 'Invalid verification code.'
        ];
    }

    /**
     * Disable 2FA for a user
     */
    public function disableTwoFactor(User $user): bool
    {
        $user->twoFactorAuth()->delete();
        $user->twoFactorCodes()->delete();
        
        return true;
    }

    /**
     * Generate and send a 2FA code
     */
    public function generateCode(User $user, string $method, string $ipAddress = null): array
    {
        $twoFactorAuth = $user->getEnabledTwoFactorMethod();
        
        if (!$twoFactorAuth || $twoFactorAuth->method !== $method) {
            return [
                'success' => false,
                'message' => '2FA method not enabled for this user.'
            ];
        }

        $code = $this->generateRandomCode();
        $expiresAt = now()->addMinutes(5); // 5 minute expiry

        TwoFactorCode::create([
            'user_id' => $user->id,
            'code' => Hash::make($code),
            'method' => $method,
            'expires_at' => $expiresAt,
            'ip_address' => $ipAddress,
        ]);

        // Send the code via the appropriate method
        $sent = $this->sendCode($user, $code, $method, $twoFactorAuth);

        if ($sent) {
            return [
                'success' => true,
                'message' => 'Verification code sent successfully.'
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to send verification code.'
        ];
    }

    /**
     * Verify a 2FA code
     */
    public function verifyCode(User $user, string $code, string $method): bool
    {
        $twoFactorCode = TwoFactorCode::forUser($user->id)
            ->where('method', $method)
            ->valid()
            ->first();

        if (!$twoFactorCode) {
            return false;
        }

        if (Hash::check($code, $twoFactorCode->code)) {
            $twoFactorCode->markAsUsed();
            
            // Update last used timestamp
            $user->twoFactorAuth()
                ->where('method', $method)
                ->update(['last_used_at' => now()]);

            return true;
        }

        return false;
    }

    /**
     * Get setup data for different 2FA methods
     */
    private function getSetupData(UserTwoFactorAuth $twoFactorAuth, string $method): array
    {
        switch ($method) {
            case 'totp':
                return $this->getTotpSetupData($twoFactorAuth);
            case 'telegram':
                return $this->getTelegramSetupData($twoFactorAuth);
            case 'email':
                return ['method' => 'email', 'email' => $twoFactorAuth->user->email];
            default:
                return [];
        }
    }

    /**
     * Get TOTP setup data (QR code, secret)
     */
    private function getTotpSetupData(UserTwoFactorAuth $twoFactorAuth): array
    {
        $secret = $twoFactorAuth->secret;
        $qrCodeUrl = $this->generateQrCodeUrl($twoFactorAuth->user, $secret);
        
        return [
            'method' => 'totp',
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl,
        ];
    }

    /**
     * Get Telegram setup data
     */
    private function getTelegramSetupData(UserTwoFactorAuth $twoFactorAuth): array
    {
        return [
            'method' => 'telegram',
            'bot_username' => config('services.telegram.bot_username'),
            'instructions' => 'Send /start to the bot to link your account.',
        ];
    }

    /**
     * Generate a random 6-digit code
     */
    private function generateRandomCode(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Generate QR code URL for TOTP
     */
    private function generateQrCodeUrl(User $user, string $secret): string
    {
        $issuer = config('app.name');
        $label = $user->email;
        
        return "otpauth://totp/{$label}?secret={$secret}&issuer={$issuer}";
    }

    /**
     * Send code via the specified method
     */
    private function sendCode(User $user, string $code, string $method, UserTwoFactorAuth $twoFactorAuth): bool
    {
        try {
            switch ($method) {
                case 'email':
                    return $this->sendEmailCode($user, $code);
                case 'telegram':
                    return $this->sendTelegramCode($user, $code, $twoFactorAuth->telegram_chat_id);
                case 'totp':
                    return true; // TOTP codes are generated by the app
                default:
                    return false;
            }
        } catch (\Exception $e) {
            Log::error('Failed to send 2FA code', [
                'user_id' => $user->id,
                'method' => $method,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Send code via email
     */
    private function sendEmailCode(User $user, string $code): bool
    {
        try {
            Mail::send('emails.two-factor-code', [
                'user' => $user,
                'code' => $code,
            ], function ($message) use ($user) {
                $message->to($user->email)
                       ->subject('Your Two-Factor Authentication Code');
            });
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send email 2FA code', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Send code via Telegram
     */
    private function sendTelegramCode(User $user, string $code, string $chatId): bool
    {
        try {
            $telegramService = app(TelegramService::class);
            return $telegramService->sendMessage($chatId, "Your 2FA code is: {$code}\n\nThis code expires in 5 minutes.");
        } catch (\Exception $e) {
            Log::error('Failed to send Telegram 2FA code', [
                'user_id' => $user->id,
                'chat_id' => $chatId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}
