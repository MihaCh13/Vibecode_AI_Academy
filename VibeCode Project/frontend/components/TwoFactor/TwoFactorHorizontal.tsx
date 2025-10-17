'use client';

import { useState, useEffect } from 'react';
import { twoFactorAPI } from '@/lib/api';
import { TwoFactorAuth } from '@/types';
import { useAuth } from '@/lib/auth';

interface TwoFactorHorizontalProps {
  onUpdate?: () => void;
}

export default function TwoFactorHorizontal({ onUpdate }: TwoFactorHorizontalProps) {
  const [status, setStatus] = useState<TwoFactorAuth | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'telegram' | 'totp' | null>(null);
  const [setupData, setSetupData] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [telegramBotInfo, setTelegramBotInfo] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadStatus();
    loadTelegramBotInfo();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await twoFactorAPI.getStatus();
      setStatus(response);
    } catch (err: any) {
      setError('Failed to load 2FA status');
    } finally {
      setLoading(false);
    }
  };

  const loadTelegramBotInfo = async () => {
    try {
      const response = await twoFactorAPI.getTelegramBotInfo();
      setTelegramBotInfo(response.data);
    } catch (err: any) {
      console.warn('Failed to load Telegram bot info:', err);
    }
  };

  const handleEnableMethod = async (method: 'email' | 'telegram' | 'totp') => {
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      switch (method) {
        case 'email':
          response = await twoFactorAPI.enableEmail();
          break;
        case 'telegram':
          response = await twoFactorAPI.enableTelegram();
          break;
        case 'totp':
          response = await twoFactorAPI.enableTotp();
          break;
      }

      if (response.success) {
        setSelectedMethod(method);
        setSetupData(response.data);
        setShowSetup(true);
        
        if (method === 'email') {
          setSuccess('Verification code sent to your email address.');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to enable 2FA');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (!selectedMethod || !verificationCode) return;

    setVerificationLoading(true);
    setError('');

    try {
      const response = await twoFactorAPI.verify(verificationCode, selectedMethod);
      
      if (response.success) {
        setSuccess('2FA has been successfully enabled!');
        setShowSetup(false);
        setSelectedMethod(null);
        setSetupData(null);
        setVerificationCode('');
        await loadStatus();
        onUpdate?.();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await twoFactorAPI.disable();
      
      if (response.success) {
        setSuccess('2FA has been disabled.');
        await loadStatus();
        onUpdate?.();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSetup = () => {
    setShowSetup(false);
    setSelectedMethod(null);
    setSetupData(null);
    setVerificationCode('');
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 p-6">
        <div className="flex items-center justify-center">
          <div className="loading-spinner w-6 h-6 mr-3" />
          <span className="text-gray-600 dark:text-gray-300">Loading 2FA settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
          status?.has_two_factor 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-gray-100 text-gray-800 border-gray-200'
        }`}>
          {status?.has_two_factor ? '🔒 Enabled' : '🔓 Disabled'}
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
        </div>
      )}

      {/* Current Status */}
      {status?.has_two_factor ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-300 text-xl">
                  {status.method === 'email' ? '📧' : status.method === 'telegram' ? '📱' : '🔐'}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  {status.method_display_name}
                </h4>
                <p className="text-sm text-green-700 dark:text-green-200">
                  {status.last_used_at 
                    ? `Last used: ${new Date(status.last_used_at).toLocaleDateString()}`
                    : 'Never used'
                  }
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleDisable}
            disabled={actionLoading}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            {actionLoading ? 'Disabling...' : 'Disable 2FA'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>

          {/* Horizontal Method Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Email Option */}
            <button
              onClick={() => handleEnableMethod('email')}
              disabled={actionLoading}
              className="group flex flex-col items-center p-4 sm:p-6 border border-gray-200 dark:border-white/20 rounded-xl hover:border-blue-300 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-lg bg-white/50 dark:bg-white/5 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <span className="text-blue-600 dark:text-blue-300 text-2xl">📧</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Email</h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">Receive codes via email</p>
            </button>

            {/* Telegram Option */}
            <button
              onClick={() => handleEnableMethod('telegram')}
              disabled={actionLoading}
              className="group flex flex-col items-center p-4 sm:p-6 border border-gray-200 dark:border-white/20 rounded-xl hover:border-cyan-300 dark:hover:border-cyan-400 transition-all duration-200 hover:shadow-lg bg-white/50 dark:bg-white/5 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <span className="text-cyan-600 dark:text-cyan-300 text-2xl">📱</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Telegram</h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
                {telegramBotInfo?.username ? `@${telegramBotInfo.username}` : 'Receive codes via Telegram'}
              </p>
            </button>

            {/* Google Authenticator Option */}
            <button
              onClick={() => handleEnableMethod('totp')}
              disabled={actionLoading}
              className="group flex flex-col items-center p-4 sm:p-6 border border-gray-200 dark:border-white/20 rounded-xl hover:border-green-300 dark:hover:border-green-400 transition-all duration-200 hover:shadow-lg bg-white/50 dark:bg-white/5 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <span className="text-green-600 dark:text-green-300 text-2xl">🔐</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Authenticator</h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">Use Google Authenticator</p>
            </button>
          </div>
        </div>
      )}

      {/* Setup Modal */}
      {showSetup && selectedMethod && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Setup {selectedMethod === 'email' ? 'Email' : selectedMethod === 'telegram' ? 'Telegram' : 'Google Authenticator'} 2FA
            </h3>

            {selectedMethod === 'totp' && setupData && (
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Scan this QR code with your Google Authenticator app:
                </p>
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <div className="text-gray-500 text-sm">
                    QR Code would be displayed here
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Secret: {setupData.secret}
                  </p>
                </div>
              </div>
            )}

            {selectedMethod === 'telegram' && (
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  To connect your Telegram account:
                </p>
                <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                  <li>1. Open Telegram and search for <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                    {telegramBotInfo?.username ? `@${telegramBotInfo.username}` : 'the bot'}
                  </code></li>
                  <li>2. Send <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">/start</code> to the bot</li>
                  <li>3. Click the connection link sent by the bot</li>
                  <li>4. Enter the verification code below</li>
                </ol>
                {telegramBotInfo?.first_name && (
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-3">
                    <p className="text-cyan-800 dark:text-cyan-200 text-sm">
                      <strong>Bot Name:</strong> {telegramBotInfo.first_name}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  maxLength={6}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleVerifySetup}
                  disabled={verificationLoading || verificationCode.length !== 6}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  {verificationLoading ? 'Verifying...' : 'Verify & Enable'}
                </button>
                <button
                  onClick={handleCancelSetup}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
