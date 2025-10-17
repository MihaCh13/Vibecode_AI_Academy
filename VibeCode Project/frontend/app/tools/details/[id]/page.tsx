'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { newToolsAPI } from '@/lib/api';
import Layout from '@/components/Layout/Layout';

interface Category {
  id: number;
  name: string;
  description?: string;
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

export default function ToolDetailsPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [tool, setTool] = useState<Tool | null>(null);
  const [toolLoading, setToolLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchTool();
    }
  }, [isAuthenticated, params.id]);

  const fetchTool = async () => {
    try {
      setToolLoading(true);
      const response = await newToolsAPI.getTool(parseInt(params.id));
      if (response.success) {
        setTool(response.tool);
      } else {
        setError('Tool not found');
      }
    } catch (error) {
      console.error('Error fetching tool:', error);
      setError('Failed to fetch tool details');
    } finally {
      setToolLoading(false);
    }
  };

  const getRoleColor = (roleName: string) => {
    const colors: { [key: string]: string } = {
      owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      backend: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      frontend: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      pm: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      qa: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      designer: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
    };
    return colors[roleName] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getCategoryColor = (categoryName: string) => {
    const colors: { [key: string]: string } = {
      'Machine Learning': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'Data Analysis': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'Development': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'Design': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      'Productivity': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    };
    return colors[categoryName] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  if (loading || toolLoading) {
    return (
      <Layout 
        showNavigation={true}
        pageTitle="Tool Details"
        pageDescription="Loading tool information..."
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <Layout 
        showNavigation={true}
        pageTitle="Tool Details"
        pageDescription="Error loading tool information"
        actionButtons={
          <Link
            href="/tools"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            Back to Tools
          </Link>
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!tool) {
    return (
      <Layout 
        showNavigation={true}
        pageTitle="Tool Details"
        pageDescription="Tool not found"
        actionButtons={
          <Link
            href="/tools"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            Back to Tools
          </Link>
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Tool not found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The tool you're looking for doesn't exist or you don't have access to it.
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              Back to Tools
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      showNavigation={true}
      pageTitle="Tool Details"
      pageDescription={`Detailed information about ${tool.name}`}
      actionButtons={
        <Link
          href="/tools"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
        >
          Back to Tools
        </Link>
      }
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Tool Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {tool.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm rounded-full ${getCategoryColor(tool.category.name)}`}>
                    {tool.category.name}
                  </span>
                  <span className="text-indigo-100 text-sm">
                    By {tool.user.name}
                  </span>
                  <span className="text-indigo-100 text-sm">
                    {new Date(tool.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 font-medium rounded-md hover:bg-indigo-50 transition-colors"
              >
                Visit Tool
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Tool Content */}
          <div className="p-6">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* How to Use */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {tool.how_to_use}
                </p>
              </div>
            </div>

            {/* Examples */}
            {tool.examples && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Examples</h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {tool.examples}
                  </p>
                </div>
              </div>
            )}

            {/* Links */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Links</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-400 mr-3">🔗</span>
                    <span className="text-gray-700 dark:text-gray-300">Main Tool Link</span>
                  </div>
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                  >
                    Visit →
                  </a>
                </div>
                {tool.official_doc_link && (
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-400 mr-3">📚</span>
                      <span className="text-gray-700 dark:text-gray-300">Official Documentation</span>
                    </div>
                    <a
                      href={tool.official_doc_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                    >
                      View Docs →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Tags and Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tags */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Roles */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Recommended Roles</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.roles.map((role) => (
                    <span
                      key={role.id}
                      className={`px-3 py-1 text-sm rounded-full ${getRoleColor(role.name)}`}
                    >
                      {role.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
