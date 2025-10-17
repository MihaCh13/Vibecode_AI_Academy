'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TwoFactorVerification from '@/components/TwoFactor/TwoFactorVerification';
import { AuthResponse } from '@/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // 2FA state
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'email' | 'telegram' | 'totp'>('email');
  const [twoFactorMethodDisplayName, setTwoFactorMethodDisplayName] = useState('');
  const [twoFactorMessage, setTwoFactorMessage] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response: AuthResponse = await login(email, password);
      
      if (response.requires_two_factor) {
        setTwoFactorMethod(response.method || 'email');
        setTwoFactorMethodDisplayName(response.method_display_name || 'Email');
        setTwoFactorMessage(response.message || 'Please enter your 2FA code to complete login.');
        setRequiresTwoFactor(true);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (code: string) => {
    try {
      const response: AuthResponse = await login(email, password, code);
      
      if (response.requires_two_factor) {
        throw new Error('Invalid 2FA code');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Invalid 2FA code');
    }
  };

  const handleTwoFactorCancel = () => {
    setRequiresTwoFactor(false);
    setTwoFactorMethod('email');
    setTwoFactorMethodDisplayName('');
    setTwoFactorMessage('');
  };

  // Show 2FA verification if required
  if (requiresTwoFactor) {
    return (
      <TwoFactorVerification
        method={twoFactorMethod}
        methodDisplayName={twoFactorMethodDisplayName}
        message={twoFactorMessage}
        onSuccess={(code) => handleTwoFactorSubmit(code)}
        onCancel={handleTwoFactorCancel}
      />
    );
  }

  const handleTestAccountClick = (testEmail: string, role: string) => {
    setEmail(testEmail);
    setPassword('password');
    setError('');
    setSelectedAccount(testEmail);
    
    // Add visual feedback
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    if (emailInput && passwordInput) {
      // Trigger focus and blur to show the values
      emailInput.focus();
      emailInput.blur();
      passwordInput.focus();
      passwordInput.blur();
    }
  };

  const testAccounts = [
    { 
      email: 'ivan@admin.local', 
      role: 'Owner', 
      name: 'Ivan Ivanov',
      gradient: 'from-violet-400/40 to-purple-500/50',
      icon: '👑',
      width: 'w-36',
      height: 'h-20'
    },
    { 
      email: 'petar@backend.local', 
      role: 'Backend', 
      name: 'Petar Georgiev',
      gradient: 'from-sky-400/40 to-blue-500/50',
      icon: '⚙️',
      width: 'w-40',
      height: 'h-18'
    },
    { 
      email: 'elena@frontend.local', 
      role: 'Frontend', 
      name: 'Elena Petrova',
      gradient: 'from-emerald-400/40 to-teal-500/50',
      icon: '🎨',
      width: 'w-38',
      height: 'h-20'
    },
    { 
      email: 'maria@pm.local', 
      role: 'PM', 
      name: 'Maria Dimitrov',
      gradient: 'from-amber-400/40 to-orange-500/50',
      icon: '📋',
      width: 'w-32',
      height: 'h-18'
    },
    { 
      email: 'nikolay@qa.local', 
      role: 'QA', 
      name: 'Nikolay Stoyanov',
      gradient: 'from-rose-400/40 to-red-500/50',
      icon: '🔍',
      width: 'w-34',
      height: 'h-18'
    },
    { 
      email: 'sofia@designer.local', 
      role: 'Designer', 
      name: 'Sofia Vasileva',
      gradient: 'from-pink-400/40 to-fuchsia-500/50',
      icon: '🎭',
      width: 'w-36',
      height: 'h-20'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-800 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">

      {/* Main container */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 max-w-6xl w-full relative z-10">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white/15 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-6 sm:p-8 w-full max-w-md relative overflow-hidden">
            {/* Enhanced shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />

            {/* Header */}
            <div className="text-center mb-8 relative z-20">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 shadow-2xl shadow-cyan-500/40 w-fit mx-auto mb-6">
                <div className="w-10 h-10 text-white animate-pulse text-3xl">
                  ✨
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-cyan-100 to-teal-100 bg-clip-text text-transparent drop-shadow-lg">
                Welcome Back
              </h1>
              <p className="text-center text-cyan-100 mb-8 text-base font-medium">
                Sign in to access your AI Tools Platform
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="relative z-20">
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-400/40 rounded-xl mb-6 flex items-center gap-3 backdrop-blur-sm">
                  <div className="w-5 h-5 bg-red-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-200 text-sm font-bold">!</span>
                  </div>
                  <div className="text-red-200 text-sm font-semibold">{error}</div>
                </div>
              )}

              {selectedAccount && (
                <div className="p-4 bg-green-500/20 border border-green-400/40 rounded-xl mb-6 flex items-center gap-3 backdrop-blur-sm">
                  <div className="w-5 h-5 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-200 text-sm font-bold">✓</span>
                  </div>
                  <div className="text-green-200 text-sm font-semibold">
                    Test account selected! Ready to sign in.
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-bold text-cyan-100 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-cyan-300/40 rounded-xl text-white placeholder-cyan-200/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-cyan-400/30 focus:border-cyan-400 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-cyan-300 text-lg">
                    📧
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="password" className="block text-sm font-bold text-cyan-100 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-cyan-300/40 rounded-xl text-white placeholder-cyan-200/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-cyan-400/30 focus:border-cyan-400 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-cyan-300 text-lg">
                    🔒
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white font-bold rounded-xl shadow-2xl shadow-cyan-500/40 hover:scale-[1.02] hover:from-cyan-600 hover:via-teal-600 hover:to-emerald-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mb-6 text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl">🚀</span>
                    Sign In
                  </div>
                )}
              </button>

              <div className="text-center">
                <p className="text-cyan-200 text-base">
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    className="text-teal-200 hover:text-white text-base hover:scale-105 transition-all duration-300 font-bold"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Test Accounts */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white/15 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-6 sm:p-8 w-full max-w-md relative overflow-hidden">
            {/* Enhanced shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />

            {/* Header */}
            <div className="text-center mb-8 relative z-20">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 shadow-2xl shadow-cyan-500/40 w-fit mx-auto mb-6">
                <div className="w-10 h-10 text-white animate-pulse text-3xl">
                  🔑
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-cyan-100 to-teal-100 bg-clip-text text-transparent drop-shadow-lg">
                Test Accounts
              </h2>
              <p className="text-center text-cyan-100 mb-8 text-base font-medium">
                Click any account to auto-fill credentials
              </p>
            </div>

            {/* Enhanced responsive button grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-3 justify-center items-start relative z-20">
              {testAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => handleTestAccountClick(account.email, account.role)}
                  className={`${account.width} ${account.height} bg-gradient-to-br ${account.gradient} backdrop-blur-xl border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 relative overflow-hidden hover:-translate-y-2 hover:scale-110 hover:shadow-2xl shadow-xl ${
                    selectedAccount === account.email 
                      ? 'border-cyan-400 shadow-2xl shadow-cyan-400/50 scale-105' 
                      : 'border-white/30 hover:border-white/50'
                  }`}
                >
                  {/* Enhanced glass overlay effect */}
                  <div className="absolute inset-0 bg-white/12 backdrop-blur-sm rounded-2xl" />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                    <div className="text-2xl mb-2 drop-shadow-lg">
                      {account.icon}
                    </div>
                    
                    <div className="text-sm font-bold text-white mb-1 drop-shadow-lg">
                      {account.role}
                    </div>
                    
                    <div className="text-xs text-white/90 font-semibold drop-shadow-sm">
                      {account.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-5 bg-white/10 rounded-2xl border border-white/20 text-center backdrop-blur-xl shadow-xl relative z-20">
              <p className="text-sm text-cyan-200 font-medium">
                💡 All test accounts use <strong className="text-cyan-200">"password"</strong> as the password
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for responsive design */}
      <style jsx>{`
        
        @media (max-width: 768px) {
          .main-container {
            flex-direction: column !important;
            gap: 32px !important;
            padding: 16px !important;
          }
          
          .login-panel {
            max-width: 100% !important;
          }
          
          .test-accounts {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}