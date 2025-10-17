'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toolsAPI, categoriesAPI, rolesAPI, newToolsAPI } from '@/lib/api';
import { Badge, CategoryBadge, FilterDropdown, ToolCard, ToolCardCompact } from '@/components/UI';
import { useTheme } from '@/lib/theme';
import Layout from '@/components/Layout/Layout';

interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Role {
  id: number;
  name: string;
}

interface Tool {
  id: number;
  name: string;
  link: string;
  official_doc_link?: string;
  description: string;
  how_to_use: string;
  examples?: string;
  category_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: User;
  category: Category;
  roles: Role[];
  tags: Tag[];
}

interface Filters {
  role?: string;
  category?: number;
  name?: string;
  tags?: string[];
}

export default function ToolsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [toolsLoading, setToolsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTools();
    }
  }, [isAuthenticated, filters]);

  const fetchInitialData = async () => {
    try {
      const [categoriesResponse, rolesResponse] = await Promise.all([
        categoriesAPI.getCategories(),
        rolesAPI.getRoles()
      ]);

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.categories);
      }
      if (rolesResponse.success) {
        setRoles(rolesResponse.roles);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchTools = async () => {
    try {
      setToolsLoading(true);
      const currentFilters = { ...filters };
      if (searchQuery.trim()) {
        currentFilters.name = searchQuery.trim();
      }
      
      const response = await newToolsAPI.getTools(currentFilters);
      if (response.success) {
        setTools(response.tools);
        
        // Extract all unique tags for filter options
        const tags = new Set<string>();
        response.tools.forEach((tool: Tool) => {
          tool.tags.forEach(tag => tags.add(tag.name));
        });
        setAllTags(Array.from(tags));
      } else {
        setError('Failed to fetch tools');
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
      setError('Failed to fetch tools');
    } finally {
      setToolsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Debounce search - only update filters after user stops typing
    setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        name: value.trim() || undefined
      }));
    }, 500);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const handleDeleteTool = async (toolId: number, toolName: string) => {
    if (!confirm(`Are you sure you want to delete "${toolName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await newToolsAPI.deleteTool(toolId);
      // Refresh the tools list
      fetchTools();
      // Show success message (you could add a toast notification here)
      console.log(`Tool "${toolName}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting tool:', error);
      alert('Failed to delete tool. Please try again.');
    }
  };

  const getRoleColor = (roleName: string) => {
    const colors: { [key: string]: string } = {
      owner: 'bg-ai-primary text-white',
      backend: 'bg-ai-info text-white',
      frontend: 'bg-ai-success text-white',
      pm: 'bg-ai-warning text-white',
      qa: 'bg-ai-error text-white',
      designer: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white',
    };
    return colors[roleName] || 'bg-ai-gray-500 text-white';
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
          <div className="text-2xl text-gray-800 dark:text-white font-semibold mb-2">Loading AI Tools...</div>
          <div className="text-lg text-gray-600 dark:text-gray-300">Preparing your tools library...</div>
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
      pageTitle="Tools"
      pageDescription="Browse and manage AI tools library"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="py-4 sm:py-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  AI Tools Library
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                  Discover and manage AI tools shared by your team
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
                
                <Link href="/tools/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg">
                  <span className="text-lg">🛠️</span>
                  <span>Add Tool</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white/95 dark:bg-white/15 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 dark:border-white/30 dark:shadow-[0_0_20px_rgba(59,130,246,0.2)] p-4 sm:p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white/80">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 dark:text-white/70 hover:text-indigo-700 dark:hover:text-white/90 font-medium transition-colors duration-200"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                    Search by Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Search tools..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white/10 dark:bg-white/10 text-gray-800 dark:text-white/80 placeholder-gray-500 dark:placeholder-white/40"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white/60">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Role Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                    Filter by Role
                  </label>
                  <FilterDropdown
                    options={[
                      { value: '', label: 'All Roles', icon: '👥' },
                      { value: 'Owner', label: 'Owner', icon: '👑' },
                      { value: 'Frontend', label: 'Frontend', icon: '🎨' },
                      { value: 'Backend', label: 'Backend', icon: '⚙️' },
                      { value: 'Designer', label: 'Designer', icon: '🎭' },
                      { value: 'QA', label: 'QA', icon: '🔍' },
                      { value: 'Product Manager', label: 'Product Manager', icon: '📋' },
                      // Include any additional roles from API that aren't in the hardcoded list
                      ...roles
                        .filter(role => !['Owner', 'Frontend', 'Backend', 'Designer', 'QA', 'Product Manager'].includes(role.name))
                        .map((role) => ({
                          value: role.name,
                          label: role.name,
                          icon: '🔑'
                        }))
                    ]}
                    selectedValue={filters.role || ''}
                    onSelect={(value) => handleFilterChange('role', value || undefined)}
                    placeholder="All Roles"
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                    Filter by Category
                  </label>
                  <FilterDropdown
                    options={[
                      { value: '', label: 'All Categories', icon: '📂' },
                      ...categories.map((category) => ({
                        value: category.id.toString(),
                        label: category.name,
                        icon: '🏷️'
                      }))
                    ]}
                    selectedValue={filters.category?.toString() || ''}
                    onSelect={(value) => handleFilterChange('category', value ? parseInt(value) : undefined)}
                    placeholder="All Categories"
                  />
                </div>

                {/* Tags Filter */}
                {allTags.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                      Filter by Tags
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {allTags.map((tag) => (
                        <label key={tag} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-white/10 rounded-lg transition-colors duration-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.tags?.includes(tag) || false}
                            onChange={(e) => {
                              const currentTags = filters.tags || [];
                              const newTags = e.target.checked
                                ? [...currentTags, tag]
                                : currentTags.filter(t => t !== tag);
                              handleFilterChange('tags', newTags.length > 0 ? newTags : undefined);
                            }}
                            className="rounded border-gray-300 dark:border-white/30 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-white/80">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results Count */}
                <div className="text-sm text-gray-500 dark:text-white/70 bg-gray-50 dark:bg-white/10 rounded-lg p-4">
                  {toolsLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="loading-spinner w-4 h-4" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{tools.length} tools found</span>
                      {(filters.role || filters.category || filters.tags || searchQuery) && (
                        <button
                          onClick={clearFilters}
                          className="text-indigo-600 dark:text-white/80 hover:text-indigo-700 dark:hover:text-white text-xs font-medium"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tools Content */}
            <div className="lg:w-3/4">
              {error && (
                <div className="bg-white rounded-xl shadow-lg border border-red-200 bg-red-50 mb-6 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-lg">⚠️</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-red-800 mb-2">
                        Error Loading Tools
                      </h3>
                      <div className="text-sm text-red-700">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {toolsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="loading-spinner w-12 h-12 mx-auto mb-6" />
                    <div className="text-gray-600 dark:text-white/70 text-lg">Loading AI tools...</div>
                  </div>
                </div>
              ) : tools.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white/95 dark:bg-white/20 backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/40 dark:shadow-[0_0_25px_rgba(99,102,241,0.3)] p-8 max-w-lg mx-auto">
                    <div className="w-24 h-24 bg-white/80 dark:bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-4xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      No tools found
                    </h3>
                    <p className="text-gray-600 dark:text-white/80 mb-8 max-w-md mx-auto">
                      Try adjusting your filters or add a new tool to get started.
                    </p>
                    <Link href="/tools/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg inline-flex">
                      <span className="text-lg">🛠️</span>
                      <span>Add Your First Tool</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Tools Grid/List */}
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' : 'space-y-4'}>
                    {tools.map((tool) => (
                      viewMode === 'grid' ? (
                        <ToolCard
                          key={tool.id}
                          tool={{
                            id: tool.id,
                            name: tool.name,
                            description: tool.description,
                            icon: '🛠️',
                            category: tool.category,
                            tags: tool.tags,
                            accessLevel: tool.roles.map(r => r.name).join(', '),
                            usageCount: Math.floor(Math.random() * 1000), // Mock data
                            lastUpdated: tool.updated_at,
                            isActive: true,
                            url: tool.link,
                            documentation: tool.official_doc_link,
                            created_at: tool.created_at,
                            updated_at: tool.updated_at,
                          }}
                          onSelect={(selectedTool) => {
                            router.push(`/tools/details/${selectedTool.id}`);
                          }}
                        />
                      ) : (
                        <ToolCardCompact
                          key={tool.id}
                          tool={{
                            id: tool.id,
                            name: tool.name,
                            description: tool.description,
                            icon: '🛠️',
                            category: tool.category,
                            tags: tool.tags,
                            accessLevel: tool.roles.map(r => r.name).join(', '),
                            usageCount: Math.floor(Math.random() * 1000), // Mock data
                            lastUpdated: tool.updated_at,
                            isActive: true,
                            url: tool.link,
                            documentation: tool.official_doc_link,
                            created_at: tool.created_at,
                            updated_at: tool.updated_at,
                          }}
                          onSelect={(selectedTool) => {
                            router.push(`/tools/details/${selectedTool.id}`);
                          }}
                        />
                      )
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}