'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'backend'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-800 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">

      {/* Main container */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 max-w-6xl w-full relative z-10">
        {/* Left Side - Registration Form */}
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
                Create Account
              </h1>
              <p className="text-center text-cyan-100 mb-8 text-base font-medium">
                Join the AI Tools Platform
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="relative z-20">
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-400/40 rounded-xl mb-6 flex items-center gap-3 backdrop-blur-sm">
                  <div className="w-5 h-5 bg-red-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-200 text-sm font-bold">!</span>
                  </div>
                  <div className="text-red-200 text-sm font-semibold">{error}</div>
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-bold text-cyan-100 mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-cyan-300/40 rounded-xl text-white placeholder-cyan-200/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-cyan-400/30 focus:border-cyan-400 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-cyan-300 text-lg">
                    👤
                  </div>
                </div>
              </div>

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
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-cyan-300 text-lg">
                    📧
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-bold text-cyan-100 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-cyan-300/40 rounded-xl text-white placeholder-cyan-200/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-cyan-400/30 focus:border-cyan-400 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-cyan-300 text-lg">
                    🔒
                  </div>
                </div>
                <p className="text-xs text-cyan-200/80 mt-2 font-medium">
                  Minimum 8 characters
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="password_confirmation" className="block text-sm font-bold text-cyan-100 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-cyan-300/40 rounded-xl text-white placeholder-cyan-200/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-cyan-400/30 focus:border-cyan-400 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Confirm your password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-cyan-300 text-lg">
                    🔒
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="role" className="block text-sm font-bold text-cyan-100 mb-3">
                  Role
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-cyan-300/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-cyan-400/30 focus:border-cyan-400 hover:bg-white/15 transition-all duration-300 cursor-pointer appearance-none backdrop-blur-sm"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="backend" className="bg-slate-800 text-white">Backend Developer</option>
                    <option value="frontend" className="bg-slate-800 text-white">Frontend Developer</option>
                    <option value="pm" className="bg-slate-800 text-white">Product Manager</option>
                    <option value="qa" className="bg-slate-800 text-white">QA Engineer</option>
                    <option value="designer" className="bg-slate-800 text-white">Designer</option>
                    <option value="owner" className="bg-slate-800 text-white">Owner (Admin)</option>
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-cyan-300 text-lg">
                    🎭
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
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl">🚀</span>
                    Create Account
                  </div>
                )}
              </button>

              <div className="text-center">
                <p className="text-cyan-200 text-base">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-teal-200 hover:text-white text-base hover:scale-105 transition-all duration-300 font-bold"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Platform Features (Aligned with Registration Form) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white/15 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-6 sm:p-8 w-full max-w-md relative overflow-hidden">
            {/* Enhanced shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />

            {/* Header */}
            <div className="text-center mb-8 relative z-20">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 shadow-2xl shadow-cyan-500/40 w-fit mx-auto mb-6">
                <div className="w-10 h-10 text-white animate-pulse text-3xl">
                  ⭐
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-cyan-100 to-teal-100 bg-clip-text text-transparent drop-shadow-lg">
                Platform Features
              </h2>
              <p className="text-center text-cyan-100 mb-8 text-base font-medium">
                Discover what makes our AI platform special
              </p>
            </div>

            {/* Info Blocks */}
            <div className="space-y-3 sm:space-y-4 relative z-20">
              {/* AI-Powered Tools */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-3 sm:p-4 shadow-lg hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 shadow-md shadow-emerald-500/30 flex-shrink-0">
                    <div className="w-5 h-5 text-white text-lg">
                      🚀
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                      AI-Powered Tools
                    </h3>
                    <p className="text-cyan-100 text-xs leading-relaxed">
                      Access cutting-edge AI tools and automation features designed to enhance your productivity and streamline your workflow.
                    </p>
                  </div>
                </div>
              </div>

              {/* Enterprise Security */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-3 sm:p-4 shadow-lg hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 shadow-md shadow-blue-500/30 flex-shrink-0">
                    <div className="w-5 h-5 text-white text-lg">
                      🔒
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Enterprise Security
                    </h3>
                    <p className="text-cyan-100 text-xs leading-relaxed">
                      Your data is protected with enterprise-grade security, encrypted storage, and role-based access controls.
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Collaboration */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-3 sm:p-4 shadow-lg hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 shadow-md shadow-purple-500/30 flex-shrink-0">
                    <div className="w-5 h-5 text-white text-lg">
                      👥
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                      Team Collaboration
                    </h3>
                    <p className="text-cyan-100 text-xs leading-relaxed">
                      Collaborate seamlessly with your team through shared workspaces, real-time updates, and integrated communication tools.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Analytics */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-3 sm:p-4 shadow-lg hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 shadow-md shadow-amber-500/30 flex-shrink-0">
                    <div className="w-5 h-5 text-white text-lg">
                      📊
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                      Advanced Analytics
                    </h3>
                    <p className="text-cyan-100 text-xs leading-relaxed">
                      Get insights into your workflow performance with detailed analytics, usage reports, and AI-driven recommendations.
                    </p>
                  </div>
                </div>
              </div>

              {/* 24/7 Premium Support */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-3 sm:p-4 shadow-lg hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-400 shadow-md shadow-teal-500/30 flex-shrink-0">
                    <div className="w-5 h-5 text-white text-lg">
                      🎯
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1 bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                      24/7 Premium Support
                    </h3>
                    <p className="text-cyan-100 text-xs leading-relaxed">
                      Access dedicated support from our AI experts and technical team, available around the clock to help you succeed.
                    </p>
                  </div>
                </div>
              </div>
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
          
          .register-panel {
            max-width: 100% !important;
          }
          
          .platform-features {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}