'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { categoriesAPI, newToolsAPI, authAPI } from '@/lib/api';
import { Badge, LoadingModal } from '@/components/UI';
import { useTheme } from '@/lib/theme';
import Layout from '@/components/Layout/Layout';

interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface ToolFormData {
  name: string;
  description: string;
  link: string;
  documentation_url: string;
  official_documentation: string;
  video_demo: string;
  how_to_use: string;
  real_examples: string;
  tags: string[];
  difficulty_level: string;
  categories: number[];
  roles: string[];
  images: File[];
}

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', icon: '🌱', description: 'Easy to use, minimal setup' },
  { value: 'intermediate', label: 'Intermediate', icon: '🚀', description: 'Some technical knowledge required' },
  { value: 'advanced', label: 'Advanced', icon: '⚡', description: 'Technical expertise needed' },
  { value: 'expert', label: 'Expert', icon: '🎯', description: 'Professional-level complexity' },
];

interface Role {
  value: string;
  label: string;
}

export default function AddToolPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [formData, setFormData] = useState<ToolFormData>({
    name: '',
    description: '',
    link: '',
    documentation_url: '',
    official_documentation: '',
    video_demo: '',
    how_to_use: '',
    real_examples: '',
    tags: [],
    difficulty_level: '',
    categories: [],
    roles: [],
    images: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    fetchCategories();
    fetchRoles();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await authAPI.getRoles();
      // Convert the roles object to array format
      const rolesArray = Object.entries(data.roles).map(([value, label]) => ({
        value,
        label: label as string
      }));
      setRoles(rolesArray);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    } finally {
      setRolesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError('Some files were invalid. Only JPG/PNG files under 5MB are allowed.');
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
  };

  const handleImageRemove = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('link', formData.link);
      submitData.append('official_doc_link', formData.official_documentation);
      submitData.append('how_to_use', formData.how_to_use);
      submitData.append('examples', formData.real_examples);
      
      // Append single category (backend expects category_id, not array)
      if (formData.categories.length > 0) {
        submitData.append('category_id', formData.categories[0].toString());
      }
      
      // Append roles as role_ids (backend expects role_ids[])
      formData.roles.forEach(role => {
        submitData.append('role_ids[]', role);
      });
      
      // Append tags as tag_names (backend expects tag_names[])
      formData.tags.forEach(tag => {
        submitData.append('tag_names[]', tag);
      });
      
      // Append images
      formData.images.forEach(image => {
        submitData.append('images[]', image);
      });

      const data = await newToolsAPI.createTool(submitData);

      if (data.success) {
        setSuccess('AI Tool submitted successfully! It will be reviewed by an admin before becoming visible to other users. You can track its status in your profile.');
        // Reset form
        setFormData({
          name: '',
          description: '',
          link: '',
          documentation_url: '',
          official_documentation: '',
          video_demo: '',
          how_to_use: '',
          real_examples: '',
          tags: [],
          difficulty_level: '',
          categories: [],
          roles: [],
          images: [],
        });
        // Redirect to profile page after 3 seconds to show the new tool
        setTimeout(() => {
          router.push('/profile');
        }, 3000);
      } else {
        setError(data.message || 'Failed to add AI tool');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors).map(([field, messages]) => {
          return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
        }).join('\n');
        setError(`Validation failed:\n${errorMessages}`);
      } else {
        setError(error.response?.data?.message || 'Network error. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
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
          <div className="text-2xl text-gray-800 dark:text-white font-semibold mb-2">Loading...</div>
          <div className="text-lg text-gray-600 dark:text-gray-300">Preparing the form...</div>
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
      pageTitle="Add Tool"
      pageDescription="Create and add new AI tools to the library"
    >
      <main className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Add New AI Tool
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                  Share a new AI tool with your team to boost productivity
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/tools" className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                  <span className="text-lg">📂</span>
                  <span>View Tools</span>
                </Link>
                <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg">
                  <span className="text-lg">🏠</span>
                  <span>Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
          <LoadingModal isOpen={submitting} title="Adding AI Tool..." message="Please wait while we save your tool..." />
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 dark:border-white/20 dark:shadow-white/5 p-4 sm:p-6 lg:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-lg">❌</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-red-800 mb-2">
                        Error
                      </h3>
                      <div className="text-sm text-red-700">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-lg">✅</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-green-800 mb-2">
                        Success
                      </h3>
                      <div className="text-sm text-green-700">
                        {success}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📝</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tool Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter the name of the AI tool"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Describe what this AI tool does and how it can be used"
                      />
                    </div>

                    <div>
                      <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tool Link *
                      </label>
                      <input
                        type="url"
                        id="link"
                        name="link"
                        required
                        value={formData.link}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="https://example.com/tool"
                      />
                    </div>

                    <div>
                      <label htmlFor="official_documentation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Official Documentation
                      </label>
                      <input
                        type="url"
                        id="official_documentation"
                        name="official_documentation"
                        value={formData.official_documentation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="https://docs.example.com"
                      />
                    </div>
                  </div>
            </div>

                {/* Usage Instructions */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📖</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Usage Instructions</h2>
                  </div>

                  <div>
                    <label htmlFor="how_to_use" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      How to Use *
                    </label>
                    <textarea
                      id="how_to_use"
                      name="how_to_use"
                      required
                      rows={4}
                      value={formData.how_to_use}
                      onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Provide step-by-step instructions on how to use this AI tool"
                    />
                  </div>

                  <div>
                    <label htmlFor="real_examples" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Real Examples
                    </label>
                    <textarea
                      id="real_examples"
                      name="real_examples"
                      rows={4}
                      value={formData.real_examples}
                      onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Share real-world examples or use cases for this AI tool"
                    />
                  </div>
                </div>

                {/* Additional Resources */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🔗</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Resources</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="documentation_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Documentation URL
                      </label>
                      <input
                        type="url"
                        id="documentation_url"
                        name="documentation_url"
                        value={formData.documentation_url}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="https://docs.example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="video_demo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Video Demo URL
                      </label>
                      <input
                        type="url"
                        id="video_demo"
                        name="video_demo"
                        value={formData.video_demo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🏷️</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tags</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleTagAdd();
                          }
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={handleTagAdd}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                      >
                        Add
                      </button>
                    </div>
                    
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="primary"
                            removable
                            onRemove={() => handleTagRemove(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🖼️</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Images</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-colors duration-200"
                      />
                      <p className="mt-2 text-sm text-gray-800 dark:text-white">
                        Upload screenshots or examples (JPG/PNG, max 5MB each)
                      </p>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleImageRemove(index)}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              {(image.size / 1024 / 1024).toFixed(1)}MB
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Difficulty Level */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">⚡</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Difficulty Level</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {DIFFICULTY_LEVELS.map((level) => (
                      <label
                        key={level.value}
                        className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md backdrop-blur-sm ${
                          level.value === 'beginner' 
                            ? 'border-white/40 bg-green-500/20 hover:bg-green-500/30' 
                          : level.value === 'intermediate'
                            ? 'border-white/40 bg-yellow-500/20 hover:bg-yellow-500/30'
                          : level.value === 'advanced'
                            ? 'border-white/40 bg-pink-500/20 hover:bg-pink-500/30'
                          : 'border-white/40 bg-red-500/20 hover:bg-red-500/30'
                        } ${
                          formData.difficulty_level === level.value
                            ? 'ring-2 ring-indigo-400 ring-opacity-50'
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="difficulty_level"
                          value={level.value}
                          checked={formData.difficulty_level === level.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">{level.icon}</div>
                          <div className="font-medium text-gray-900 dark:text-white mb-1">{level.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{level.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📂</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Categories</h2>
                  </div>

                  {categoriesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="loading-spinner w-8 h-8 mr-4" />
                      <span className="text-gray-500 dark:text-gray-400">Loading categories...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md backdrop-blur-sm ${
                            formData.categories.includes(category.id)
                              ? 'border-white/40 bg-white/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                              : 'border-white/40 bg-white/10 hover:bg-white/15 hover:border-white/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 rounded border-gray-300 flex items-center justify-center">
                              {formData.categories.includes(category.id) && (
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {category.name}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Roles */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">👥</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Accessible by Roles</h2>
                  </div>

                  {rolesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="loading-spinner w-8 h-8 mr-4" />
                      <span className="text-gray-500 dark:text-gray-400">Loading roles...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {roles.map((role) => (
                        <label
                          key={role.value}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md backdrop-blur-sm ${
                            formData.roles.includes(role.value)
                              ? 'border-white/40 bg-white/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                              : 'border-white/40 bg-white/10 hover:bg-white/15 hover:border-white/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.roles.includes(role.value)}
                            onChange={() => handleRoleChange(role.value)}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 rounded border-gray-300 flex items-center justify-center">
                              {formData.roles.includes(role.value) && (
                                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {role.label}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <Link href="/tools" className="text-gray-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 flex items-center space-x-2">
                      <span className="text-lg">📂</span>
                      <span>View Existing Tools</span>
                    </Link>
                    <Link href="/dashboard" className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                      Cancel
                    </Link>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg"
                  >
                    {submitting ? (
                      <>
                        <div className="loading-spinner w-4 h-4" />
                        <span>Adding Tool...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">🚀</span>
                        <span>Add AI Tool</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}