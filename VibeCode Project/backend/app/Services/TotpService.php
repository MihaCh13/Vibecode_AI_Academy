<?php

namespace App\Services;

use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Str;

class TotpService
{
    protected Google2FA $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Generate a new TOTP secret
     */
    public function generateSecret(): string
    {
        return $this->google2fa->generateSecretKey();
    }

    /**
     * Generate QR code URL for Google Authenticator
     */
    public function generateQrCodeUrl(string $email, string $secret, string $issuer = null): string
    {
        $issuer = $issuer ?? config('app.name');
        return $this->google2fa->getQRCodeUrl($issuer, $email, $secret);
    }

    /**
     * Verify a TOTP code
     */
    public function verifyCode(string $secret, string $code, int $window = 2): bool
    {
        try {
            return $this->google2fa->verifyKey($secret, $code, $window);
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get the current TOTP code for a secret (for testing purposes)
     */
    public function getCurrentCode(string $secret): string
    {
        return $this->google2fa->getCurrentOtp($secret);
    }

    /**
     * Check if the secret is valid
     */
    public function isValidSecret(string $secret): bool
    {
        return $this->google2fa->verifyKey($secret, $this->getCurrentCode($secret), 1);
    }
}
