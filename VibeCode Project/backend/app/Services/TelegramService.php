<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class TelegramService
{
    protected ?string $botToken;
    protected ?string $botUsername;
    protected ?string $apiUrl;

    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token');
        $this->botUsername = config('services.telegram.bot_username');
        $this->apiUrl = $this->botToken ? "https://api.telegram.org/bot{$this->botToken}" : null;
    }

    /**
     * Check if Telegram service is properly configured
     */
    public function isConfigured(): bool
    {
        return !empty($this->botToken) && !empty($this->botUsername);
    }

    /**
     * Send a message to a Telegram chat
     */
    public function sendMessage(string $chatId, string $message): bool
    {
        if (!$this->isConfigured()) {
            Log::warning('Telegram service not configured');
            return false;
        }

        try {
            $response = Http::post("{$this->apiUrl}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML'
            ]);

            if ($response->successful()) {
                return true;
            }

            Log::error('Telegram API error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('Telegram service error', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get bot information
     */
    public function getBotInfo(): array
    {
        if (!$this->isConfigured()) {
            Log::warning('Telegram service not configured');
            return [];
        }

        try {
            $response = Http::get("{$this->apiUrl}/getMe");
            
            if ($response->successful()) {
                return $response->json('result', []);
            }

            return [];
        } catch (\Exception $e) {
            Log::error('Failed to get Telegram bot info', [
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Set webhook for receiving updates
     */
    public function setWebhook(string $webhookUrl): bool
    {
        if (!$this->isConfigured()) {
            Log::warning('Telegram service not configured');
            return false;
        }

        try {
            $response = Http::post("{$this->apiUrl}/setWebhook", [
                'url' => $webhookUrl
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Failed to set Telegram webhook', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Handle incoming webhook updates
     */
    public function handleWebhook(array $update): array
    {
        if (!isset($update['message'])) {
            return ['success' => false, 'message' => 'No message found'];
        }

        $message = $update['message'];
        $chatId = $message['chat']['id'];
        $text = $message['text'] ?? '';

        // Handle /start command
        if ($text === '/start') {
            return $this->handleStartCommand($chatId, $message);
        }

        return ['success' => false, 'message' => 'Unknown command'];
    }

    /**
     * Handle /start command
     */
    private function handleStartCommand(string $chatId, array $message): array
    {
        $user = $message['from'] ?? [];
        $firstName = $user['first_name'] ?? 'User';

        $responseText = "Hello {$firstName}! 👋\n\n";
        $responseText .= "I'm the AI Tools Platform 2FA bot. ";
        $responseText .= "To link your account, please use the link sent to your email address.";

        $this->sendMessage($chatId, $responseText);

        return [
            'success' => true,
            'message' => 'Start command handled',
            'chat_id' => $chatId,
            'user_info' => $user
        ];
    }

    /**
     * Send a link message to connect Telegram account
     */
    public function sendConnectionLink(string $chatId, string $connectionToken): bool
    {
        if (!$this->isConfigured()) {
            Log::warning('Telegram service not configured');
            return false;
        }

        $message = "🔗 <b>Connect Your Account</b>\n\n";
        $message .= "Click the link below to connect your Telegram account for 2FA:\n\n";
        $message .= "<a href=\"" . config('app.frontend_url') . "/profile/2fa/telegram/connect?token={$connectionToken}\">Connect Account</a>\n\n";
        $message .= "This link will expire in 10 minutes.";

        return $this->sendMessage($chatId, $message);
    }

    /**
     * Generate a connection token for linking Telegram account
     */
    public function generateConnectionToken(string $userId): string
    {
        return hash('sha256', $userId . now()->timestamp . Str::random(32));
    }
}
