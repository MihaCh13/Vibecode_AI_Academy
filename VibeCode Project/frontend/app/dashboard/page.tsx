'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { USER_ROLES } from '@/types';
import { toolsAPI } from '@/lib/api';
import { useTheme } from '@/lib/theme';
import Layout from '@/components/Layout/Layout';

// Role-based permissions configuration
const ROLE_PERMISSIONS = {
  owner: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '👑',
    features: [
      { name: 'User Management', description: 'Manage all users and roles', action: 'manage-users' },
      { name: 'System Settings', description: 'Configure platform settings', action: 'system-settings' },
      { name: 'Analytics Dashboard', description: 'View platform analytics', action: 'analytics' },
      { name: 'Backup & Restore', description: 'System backup operations', action: 'backup' },
    ],
    quickActions: [
      { name: 'Add User', icon: '👤', action: 'add-user' },
      { name: 'View Reports', icon: '📊', action: 'reports' },
      { name: 'System Health', icon: '🏥', action: 'health' },
    ]
  },
  backend: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '⚙️',
    features: [
      { name: 'API Management', description: 'Manage API endpoints and documentation', action: 'api-management' },
      { name: 'Database Tools', description: 'Database administration and queries', action: 'database' },
      { name: 'Server Monitoring', description: 'Monitor server performance', action: 'monitoring' },
      { name: 'Code Repository', description: 'Access to code repositories', action: 'repositories' },
    ],
    quickActions: [
      { name: 'API Docs', icon: '📚', action: 'api-docs' },
      { name: 'Database', icon: '🗄️', action: 'database' },
      { name: 'Logs', icon: '📋', action: 'logs' },
    ]
  },
  frontend: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '🎨',
    features: [
      { name: 'UI Components', description: 'Access to design system and components', action: 'ui-components' },
      { name: 'Prototype Tools', description: 'Prototyping and wireframing tools', action: 'prototype' },
      { name: 'Asset Library', description: 'Design assets and resources', action: 'assets' },
      { name: 'User Testing', description: 'Conduct user testing sessions', action: 'user-testing' },
    ],
    quickActions: [
      { name: 'Design System', icon: '🎨', action: 'design-system' },
      { name: 'Components', icon: '🧩', action: 'components' },
      { name: 'Assets', icon: '🖼️', action: 'assets' },
    ]
  },
  pm: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '📋',
    features: [
      { name: 'Project Planning', description: 'Create and manage project plans', action: 'project-planning' },
      { name: 'Team Management', description: 'Manage team members and assignments', action: 'team-management' },
      { name: 'Progress Tracking', description: 'Track project progress and milestones', action: 'progress-tracking' },
      { name: 'Client Communication', description: 'Manage client communications', action: 'client-communication' },
    ],
    quickActions: [
      { name: 'Projects', icon: '📁', action: 'projects' },
      { name: 'Timeline', icon: '📅', action: 'timeline' },
      { name: 'Reports', icon: '📈', action: 'reports' },
    ]
  },
  qa: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '🔍',
    features: [
      { name: 'Test Management', description: 'Create and manage test cases', action: 'test-management' },
      { name: 'Bug Tracking', description: 'Track and manage bugs', action: 'bug-tracking' },
      { name: 'Automated Testing', description: 'Run automated test suites', action: 'automated-testing' },
      { name: 'Quality Reports', description: 'Generate quality reports', action: 'quality-reports' },
    ],
    quickActions: [
      { name: 'Test Cases', icon: '✅', action: 'test-cases' },
      { name: 'Bugs', icon: '🐛', action: 'bugs' },
      { name: 'Reports', icon: '📊', action: 'reports' },
    ]
  },
  designer: {
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    icon: '🎭',
    features: [
      { name: 'Design Tools', description: 'Access to design software and tools', action: 'design-tools' },
      { name: 'Brand Guidelines', description: 'Brand standards and guidelines', action: 'brand-guidelines' },
      { name: 'Asset Creation', description: 'Create and manage design assets', action: 'asset-creation' },
      { name: 'Collaboration', description: 'Design collaboration tools', action: 'collaboration' },
    ],
    quickActions: [
      { name: 'Design Tools', icon: '🖌️', action: 'design-tools' },
      { name: 'Brand Kit', icon: '🎨', action: 'brand-kit' },
      { name: 'Templates', icon: '📐', action: 'templates' },
    ]
  },
};

export default function DashboardPage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [toolsExist, setToolsExist] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      checkToolsExist();
    }
  }, [isAuthenticated]);

  const checkToolsExist = async () => {
    try {
      const data = await toolsAPI.getTools();
      setToolsExist(data.success && data.tools && data.tools.length > 0);
    } catch (error) {
      console.error('Failed to fetch tools:', error);
      setToolsExist(false);
    }
  };


  // Handle role-based actions
  const handleAction = (action: string) => {
    // This is where you would implement actual functionality
    // For now, we'll just show an alert
    alert(`Action: ${action} - This feature will be implemented soon!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden transition-all duration-500">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative z-10 text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-6" />
          <div className="text-2xl text-gray-800 dark:text-white font-semibold mb-2">
            Welcome back! 👋
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-300">
            Preparing your personalized dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get role configuration
  const roleConfig = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || ROLE_PERMISSIONS.frontend;

  return (
    <Layout 
      showNavigation={true}
      pageTitle="Dashboard"
      pageDescription="Your personalized dashboard with role-specific tools and features"
    >
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          {/* Welcome Section */}
          <div className="bg-white/90 dark:bg-white/20 backdrop-blur-lg overflow-hidden shadow-2xl rounded-2xl mb-6 sm:mb-8 border border-white/30 dark:border-white/40 dark:shadow-[0_0_20px_rgba(100,200,255,0.15)]">
            <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl sm:text-3xl">{roleConfig.icon}</span>
                  </div>
                  <div className="text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      Welcome, {user.name}!
                    </h1>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${roleConfig.color}`}>
                        {roleConfig.icon} {USER_ROLES[user.role as keyof typeof USER_ROLES]}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                        ✓ Active
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-xl text-gray-600 dark:text-white max-w-2xl mx-auto leading-relaxed">
                  Access your personalized dashboard with role-specific tools and features designed for your workflow.
                </p>
              </div>
            </div>
          </div>

          {/* AI Tools Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🛠️</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Share Your AI Tools</h3>
                      <p className="text-white/90 text-lg">
                        Add new AI tools to help your team work more efficiently
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {toolsExist === null ? (
                    // Loading state - show both buttons as secondary
                    <>
                      <Link
                        href="/tools/add"
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>🛠️</span>
                        <span>Add AI Tool</span>
                      </Link>
                      <Link
                        href="/tools"
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>📂</span>
                        <span>View My Tools</span>
                      </Link>
                    </>
                  ) : toolsExist ? (
                    // Tools exist - View My Tools is primary, Add AI Tool is secondary
                    <>
                      <Link
                        href="/tools"
                        className="bg-white text-indigo-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <span>📂</span>
                        <span>View My Tools</span>
                      </Link>
                      <Link
                        href="/tools/add"
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>🛠️</span>
                        <span>Add AI Tool</span>
                      </Link>
                    </>
                  ) : (
                    // No tools exist - Add AI Tool is primary, View My Tools is secondary
                    <>
                      <Link
                        href="/tools/add"
                        className="bg-white text-indigo-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <span>🛠️</span>
                        <span>Add AI Tool</span>
                      </Link>
                      <Link
                        href="/tools"
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>📂</span>
                        <span>View My Tools</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {roleConfig.quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleAction(action.action)}
                  className={`bg-white/90 dark:bg-white/20 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/30 dark:border-white/40 hover:border-indigo-400 group text-left ${
                    index % 3 === 0 ? 'dark:shadow-[0_0_15px_rgba(100,200,255,0.2)] dark:hover:bg-blue-500/25 dark:hover:border-blue-300' :
                    index % 3 === 1 ? 'dark:shadow-[0_0_15px_rgba(147,51,234,0.2)] dark:hover:bg-purple-500/25 dark:hover:border-purple-300' :
                    'dark:shadow-[0_0_15px_rgba(34,197,94,0.2)] dark:hover:bg-emerald-500/25 dark:hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                      <span className="text-white text-2xl">{action.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                        {action.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Quick access to {action.name.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Role-based Features */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {roleConfig.features.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white/90 dark:bg-white/20 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/30 dark:border-white/40 hover:border-indigo-400 cursor-pointer group ${
                    index % 4 === 0 ? 'dark:shadow-[0_0_15px_rgba(147,51,234,0.2)] dark:hover:bg-purple-500/25 dark:hover:border-purple-300' :
                    index % 4 === 1 ? 'dark:shadow-[0_0_15px_rgba(100,200,255,0.2)] dark:hover:bg-cyan-500/25 dark:hover:border-cyan-300' :
                    index % 4 === 2 ? 'dark:shadow-[0_0_15px_rgba(34,197,94,0.2)] dark:hover:bg-emerald-500/25 dark:hover:border-emerald-300' :
                    'dark:shadow-[0_0_15px_rgba(139,92,246,0.2)] dark:hover:bg-violet-500/25 dark:hover:border-violet-300'
                  }`}
                  onClick={() => handleAction(feature.action)}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-white text-lg">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 mb-2">
                        {feature.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-cyan-400 dark:text-cyan-300 text-sm font-medium">
                      <span>Access Feature</span>
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      ↑ Medium
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="mt-12 bg-white/90 dark:bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-white/40 p-6 dark:shadow-[0_0_20px_rgba(147,51,234,0.15)]">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white text-2xl">💡</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Extensible Role System
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  This dashboard is built with extensibility in mind. New roles can be easily added by:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Adding role configuration to <code className="bg-gray-100 dark:bg-blue-400/20 px-2 py-1 rounded text-xs font-mono text-gray-900 dark:text-white">ROLE_PERMISSIONS</code>
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Defining role-specific features and actions
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Implementing functionality in <code className="bg-gray-100 dark:bg-purple-400/20 px-2 py-1 rounded text-xs font-mono text-gray-900 dark:text-white">handleAction</code>
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Adding new pages or components as needed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}