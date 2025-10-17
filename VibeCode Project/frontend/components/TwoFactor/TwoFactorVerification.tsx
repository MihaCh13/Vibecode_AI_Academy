'use client';

import { useState } from 'react';
import { useTheme } from '@/lib/theme';

interface TwoFactorVerificationProps {
  method: 'email' | 'telegram' | 'totp';
  methodDisplayName: string;
  message?: string;
  onSuccess: (code: string) => void;
  onCancel: () => void;
  onResendCode?: () => void;
}

export default function TwoFactorVerification({
  method,
  methodDisplayName,
  message,
  onSuccess,
  onCancel,
  onResendCode
}: TwoFactorVerificationProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Pass the code to the parent component for verification
      onSuccess(code);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!onResendCode) return;
    
    setResendLoading(true);
    try {
      await onResendCode();
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const getMethodIcon = () => {
    switch (method) {
      case 'email':
        return '📧';
      case 'telegram':
        return '📱';
      case 'totp':
        return '🔐';
      default:
        return '🔑';
    }
  };

  const getMethodInstructions = () => {
    switch (method) {
      case 'email':
        return 'Check your email for the 6-digit verification code.';
      case 'telegram':
        return 'Check your Telegram messages for the 6-digit verification code.';
      case 'totp':
        return 'Enter the 6-digit code from your authenticator app.';
      default:
        return 'Enter the 6-digit verification code.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-500">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-white text-2xl">{getMethodIcon()}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {getMethodInstructions()}
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white/95 dark:bg-white/15 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 dark:border-white/40 p-8">
          {/* Method Display */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
              method === 'email' ? 'bg-blue-100 text-blue-800 border-blue-200' :
              method === 'telegram' ? 'bg-cyan-100 text-cyan-800 border-cyan-200' :
              'bg-green-100 text-green-800 border-green-200'
            }`}>
              {getMethodIcon()} {methodDisplayName}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-blue-800 dark:text-blue-200 text-sm">{message}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Code Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                  setError('');
                }}
                placeholder="000000"
                className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                Enter the 6-digit code sent to your {methodDisplayName.toLowerCase()}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-spinner w-4 h-4" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Code'
              )}
            </button>
          </form>

          {/* Resend Code */}
          {onResendCode && (method === 'email' || method === 'telegram') && (
            <div className="mt-6 text-center">
              <button
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : "Didn't receive the code? Resend"}
              </button>
            </div>
          )}

          {/* Cancel Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onCancel}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🔒 This adds an extra layer of security to your account
          </p>
        </div>
      </div>
    </div>
  );
}
