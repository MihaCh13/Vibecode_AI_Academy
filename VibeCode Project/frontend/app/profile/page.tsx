'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { USER_ROLES } from '@/types';
import { Badge, StatusBadge } from '@/components/UI';
import { useTheme } from '@/lib/theme';
import TwoFactorHorizontal from '@/components/TwoFactor/TwoFactorHorizontal';
import Link from 'next/link';
import { newToolsAPI } from '@/lib/api';
import Layout from '@/components/Layout/Layout';

interface Tool {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
  };
  tags: Array<{
    id: number;
    name: string;
  }>;
}

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [myTools, setMyTools] = useState<Tool[]>([]);
  const [toolsLoading, setToolsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyTools();
    }
  }, [isAuthenticated]);

  const fetchMyTools = async () => {
    try {
      setToolsLoading(true);
      const response = await newToolsAPI.getMyTools();
      if (response.success) {
        setMyTools(response.tools || []);
      }
    } catch (error) {
      console.error('Failed to fetch my tools:', error);
    } finally {
      setToolsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      // Here you would typically call an API to update the user profile
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Profile updated successfully!');
      setMessageType('success');
      setIsEditing(false);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      owner: 'bg-indigo-600 text-white',
      backend: 'bg-blue-600 text-white',
      frontend: 'bg-green-600 text-white',
      pm: 'bg-yellow-500 text-white',
      qa: 'bg-red-600 text-white',
      designer: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white',
    };
    return colors[role] || 'bg-gray-500 text-white';
  };

  const getRoleIcon = (role: string) => {
    const icons: { [key: string]: string } = {
      owner: '👑',
      backend: '⚙️',
      frontend: '🎨',
      pm: '📋',
      qa: '🔍',
      designer: '🎭',
    };
    return icons[role] || '👤';
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-500">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4" />
          <div className="text-xl text-gray-800 dark:text-white font-medium">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout 
      showNavigation={true}
      pageTitle="User Profile"
      pageDescription="Manage your account settings and preferences"
      actionButtons={
        <Link
          href="/profile/edit"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
        >
          Edit Profile
        </Link>
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 dark:shadow-white/5 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl sm:text-3xl font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 w-full">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {user.name}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4">
                      {user.email}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleIcon(user.role)} {USER_ROLES[user.role as keyof typeof USER_ROLES]}
                      </Badge>
                      <StatusBadge status="active" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 sm:gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-cyan-300">{myTools.length}</div>
                      <div className="text-sm text-gray-900 dark:text-white">Tools Added</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-cyan-300">
                        {myTools.filter(tool => tool.status === 'approved').length}
                      </div>
                      <div className="text-sm text-gray-900 dark:text-white">Approved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {myTools.filter(tool => tool.status === 'pending').length}
                      </div>
                      <div className="text-sm text-gray-900 dark:text-white">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Profile Settings */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 dark:shadow-white/5 p-4 sm:p-6 lg:p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h3>
                  {isEditing && (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200 font-medium"
                    >
                      {saving ? (
                        <>
                          <div className="loading-spinner w-4 h-4 mr-2 inline-block" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  )}
                </div>

                {message && (
                  <div className={`mb-6 p-4 rounded-lg ${
                    messageType === 'success' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        messageType === 'success' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <span className={`text-sm ${
                          messageType === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {messageType === 'success' ? '✓' : '⚠'}
                        </span>
                      </div>
                      <div className={`text-sm ${
                        messageType === 'success' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {message}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="p-4 bg-gray-50 dark:bg-white/10 rounded-lg text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                      Email Address
                    </label>
                    <div className="p-4 bg-gray-50 dark:bg-white/10 rounded-lg text-gray-900 dark:text-white">
                      {user.email}
                      <span className="ml-2 text-xs text-gray-500 dark:text-white">(Cannot be changed)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                      Role
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-gray-50 rounded-lg text-gray-900 flex-1">
                        {USER_ROLES[user.role as keyof typeof USER_ROLES]}
                      </div>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleIcon(user.role)}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-white">
                      Role assignments are managed by administrators
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                      Member Since
                    </label>
                    <div className="p-4 bg-gray-50 dark:bg-white/10 rounded-lg text-gray-900 dark:text-white">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication Section */}
              <TwoFactorHorizontal />

              {/* My Tools Section */}
              <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 dark:shadow-white/5 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">My AI Tools</h3>
                  <Link 
                    href="/tools/add"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm"
                  >
                    Add New Tool
                  </Link>
                </div>

                {toolsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="loading-spinner w-8 h-8 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">Loading your tools...</span>
                  </div>
                ) : myTools.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🛠️</span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tools yet</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Start by adding your first AI tool to share with the team.</p>
                    <Link 
                      href="/tools/add"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                    >
                      Add Your First Tool
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myTools.map((tool) => (
                      <div key={tool.id} className="border border-gray-200 dark:border-white/20 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-medium text-gray-900 dark:text-white">{tool.name}</h4>
                              <Badge className={getStatusBadgeStyle(tool.status)}>
                                {getStatusIcon(tool.status)} {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{tool.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>📂 {tool.category.name}</span>
                              <span>📅 {new Date(tool.created_at).toLocaleDateString()}</span>
                              {tool.tags.length > 0 && (
                                <span>🏷️ {tool.tags.map(tag => tag.name).join(', ')}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Link 
                              href={`/tools/edit/${tool.id}`}
                              className="px-3 py-1 text-sm bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-200"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                        
                        {tool.status === 'pending' && (
                          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <span className="text-yellow-600 dark:text-yellow-400">⏳</span>
                              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                                Your tool is pending admin approval. It will be visible to other users once approved.
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {tool.status === 'rejected' && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <span className="text-red-600 dark:text-red-400">❌</span>
                              <span className="text-sm text-red-800 dark:text-red-200">
                                Your tool was rejected. Please review the requirements and submit again.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 dark:shadow-white/5 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Profile Completion</span>
                    <span className="font-medium text-cyan-400 dark:text-cyan-300">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Account Status</span>
                    <StatusBadge status="active" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Last Active</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Just now</span>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 dark:shadow-white/5 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Password</span>
                    <Badge variant="success">Strong</Badge>
                  </div>
                  
                  <button className="w-full px-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg text-gray-700 dark:text-white bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors duration-200 font-medium">
                    Change Password
                  </button>
                </div>
              </div>

              {/* Theme Switcher */}
              <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 dark:shadow-white/5 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Appearance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Theme</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{theme} Mode</span>
                  </div>
                  
                  <button
                    onClick={toggleTheme}
                    className={`relative w-full h-12 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300/20 hover:scale-105 active:scale-95 ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-10 h-10 bg-white rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
                        theme === 'dark' ? 'translate-x-full' : 'translate-x-0'
                      }`}
                    >
                      {theme === 'light' ? (
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center justify-center h-full text-white font-medium text-xs sm:text-sm">
                      {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 dark:shadow-white/5 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Push Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
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
