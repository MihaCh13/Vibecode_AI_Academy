'use client';

import React from 'react';
import NavigationMenu from '../Navigation/NavigationMenu';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  actionButtons?: React.ReactNode;
}

export default function Layout({ children, showNavigation = true, pageTitle, pageDescription, actionButtons }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 transition-all duration-500">
      {/* Premium Header with AI-themed styling */}
      {showNavigation && (
        <header className="sticky top-0 z-50">
          <NavigationMenu 
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            actionButtons={actionButtons}
          />
        </header>
      )}
      
      {/* Main Content Area */}
      <main className="flex-1 relative">
        {/* Subtle background pattern for depth */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-ai-primary/10 via-transparent to-ai-secondary/10" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)]" />
        </div>
        
        {/* Content wrapper with proper spacing */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
      
      {/* Premium Footer */}
      <footer className="border-t border-ai-gray-200 bg-white/80 backdrop-blur-ai">
        <div className="max-w-7xl mx-auto px-ai-lg py-ai-xl">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-ai-md md:space-y-0">
            <div className="flex items-center space-x-ai-md">
              <div className="w-8 h-8 bg-ai-gradient-primary rounded-ai-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-ai-gray-600 font-medium">AI Tools Platform</span>
            </div>
            
            <div className="flex items-center space-x-ai-lg text-sm text-ai-gray-500">
              <span>© 2024 AI Tools Platform</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Internal Platform</span>
            </div>
            
            <div className="flex items-center space-x-ai-md">
              <div className="flex items-center space-x-ai-sm">
                <div className="w-2 h-2 bg-ai-success rounded-full animate-ai-pulse" />
                <span className="text-xs text-ai-gray-500">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Specialized layout variants for different pages
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ai-gradient-surface relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-ai-primary/10 rounded-full blur-3xl animate-ai-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-ai-secondary/10 rounded-full blur-3xl animate-ai-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10 w-full max-w-md mx-auto px-ai-lg">
        <div className="card-glass">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout showNavigation={true}>
      <div className="max-w-7xl mx-auto px-ai-lg py-ai-xl">
        {children}
      </div>
    </Layout>
  );
}

export function PageLayout({ 
  children, 
  title, 
  description,
  actions 
}: { 
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-ai-lg py-ai-xl">
        {/* Page Header */}
        {(title || description || actions) && (
          <div className="mb-ai-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-ai-md md:space-y-0">
              <div className="space-y-ai-sm">
                {title && (
                  <h1 className="text-3xl font-bold text-ai-gray-900 text-gradient">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-lg text-ai-gray-600 max-w-2xl">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center space-x-ai-md">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Page Content */}
        <div className="space-y-ai-xl">
          {children}
        </div>
      </div>
    </Layout>
  );
}