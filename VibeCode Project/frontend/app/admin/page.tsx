'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CacheManagement from '@/components/Admin/CacheManagement';
import CacheStatusIndicator from '@/components/UI/CacheStatusIndicator';
import AuditLogs from '@/components/Admin/AuditLogs';
import { statsAPI } from '@/lib/api';
import { AdminStatsResponse } from '@/types';
import Layout from '@/components/Layout/Layout';
import Cookies from 'js-cookie';

interface Tool {
  id: number;
  name: string;
  link: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  category: {
    id: number;
    name: string;
  };
  roles?: Array<{
    id: number;
    name: string;
  }>;
}

interface Category {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

interface AdminStats {
  total_tools: number;
  pending_tools: number;
  approved_tools: number;
  rejected_tools: number;
  total_categories: number;
  total_users: number;
}

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    category_id: 'all',
    creator_role: 'all',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  // Pagination
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'owner')) {
      router.push('/dashboard');
      return;
    }

    if (isAuthenticated && user?.role === 'owner') {
      loadData();
    }
  }, [isAuthenticated, user, loading]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      setError('');

      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });
      queryParams.append('page', pagination.current_page.toString());

      const response = await fetch(`http://localhost:8000/api/admin/tools?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('auth_token') || ''}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch tools:', response.status, errorText);
        throw new Error(`Failed to fetch tools: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setTools(data.data.data);
      setCategories(data.filter_options?.categories || []);
      setRoles(data.filter_options?.roles || []);
      
      setPagination({
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total
      });

      // Load cached stats
      try {
        const statsData = await statsAPI.getAdminStats();
        setStats(statsData.stats);
      } catch (statsError) {
        console.error('Failed to load cached stats:', statsError);
        // Fallback to regular dashboard endpoint
        const statsResponse = await fetch('http://localhost:8000/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${Cookies.get('auth_token') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'owner') {
      loadData();
    }
  }, [filters, pagination.current_page]);

  const handleStatusChange = async (toolId: number, newStatus: 'approved' | 'rejected') => {
    try {
      setActionLoading(toolId);
      setError('');

      const response = await fetch(`http://localhost:8000/api/admin/tools/${toolId}/${newStatus}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('auth_token') || ''}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to ${newStatus === 'approved' ? 'approve' : 'reject'} tool:`, response.status, errorText);
        throw new Error(`Failed to ${newStatus === 'approved' ? 'approve' : 'reject'} tool: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setSuccess(`Tool ${newStatus} successfully`);
      
      // Update the tool in the list
      setTools(prev => prev.map(tool => 
        tool.id === toolId ? { ...tool, status: newStatus } : tool
      ));

      // Update stats
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          [`${newStatus}_tools`]: prev[`${newStatus}_tools`] + 1,
          pending_tools: prev.pending_tools - 1
        } : null);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'owner') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">You need Owner role to access this page.</p>
          <Link href="/dashboard" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      showNavigation={true}
      pageTitle="Admin Panel"
      pageDescription="Manage AI tools and approvals"
      actionButtons={
        <CacheStatusIndicator />
      }
    >
      <div className="container mx-auto px-4 py-8">

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Total Tools</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_tools}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 text-xl">🔧</span>
                </div>
              </div>
            </div>

            <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending_tools}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 dark:text-yellow-300 text-xl">⏳</span>
                </div>
              </div>
            </div>

            <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved_tools}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-300 text-xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Rejected</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected_tools}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-300 text-xl">❌</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cache Management */}
        <div className="mb-8">
          <CacheManagement />
        </div>

        {/* Audit Logs */}
        <div className="mb-8">
          <AuditLogs />
        </div>

        {/* Messages */}
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

        {/* Filters */}
        <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={filters.category_id}
                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.length > 0 ? (
                  categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))
                ) : (
                  <option disabled>Loading categories...</option>
                )}
              </select>
            </div>

            {/* Creator Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Creator Role</label>
              <select
                value={filters.creator_role}
                onChange={(e) => handleFilterChange('creator_role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Roles</option>
                {roles.length > 0 ? (
                  roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))
                ) : (
                  <option disabled>Loading roles...</option>
                )}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by name..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Tools Table */}
        <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/40 dark:border-white/40 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Tools Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Review and approve pending AI tools submitted by users</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/20">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Tool Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Creator</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool) => (
                  <tr key={tool.id} className="border-b border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{tool.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">{tool.description}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        {tool.category.name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{tool.user.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{tool.user.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tool.status === 'approved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : tool.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      }`}>
                        {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(tool.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        {tool.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleStatusChange(tool.id, 'approved')}
                              disabled={actionLoading === tool.id}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
                            >
                              {actionLoading === tool.id ? '⏳ Processing...' : '✅ Approve'}
                            </button>
                            <button
                              onClick={() => handleStatusChange(tool.id, 'rejected')}
                              disabled={actionLoading === tool.id}
                              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
                            >
                              {actionLoading === tool.id ? '⏳ Processing...' : '❌ Reject'}
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tool.status === 'approved' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                            }`}>
                              {tool.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                            </span>
                            {tool.status === 'rejected' && (
                              <button
                                onClick={() => handleStatusChange(tool.id, 'approved')}
                                disabled={actionLoading === tool.id}
                                className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
                              >
                                {actionLoading === tool.id ? 'Processing...' : 'Approve'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-white/20 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg ${
                        page === pagination.current_page
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-3 py-1 border border-gray-300 dark:border-white/20 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
