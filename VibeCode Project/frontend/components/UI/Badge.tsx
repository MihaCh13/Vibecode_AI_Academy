'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  removable = false,
  onRemove,
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-cyan-600 text-white shadow-sm hover:shadow-md',
    success: 'bg-green-600 text-white shadow-sm hover:shadow-md',
    warning: 'bg-yellow-500 text-white shadow-sm hover:shadow-md',
    error: 'bg-red-600 text-white shadow-sm hover:shadow-md',
    info: 'bg-blue-600 text-white shadow-sm hover:shadow-md',
    outline: 'border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50',
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <span className={classes}>
      {icon && (
        <span className="mr-1 flex items-center">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 transition-colors duration-ai-fast"
          aria-label="Remove badge"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
}

// Specialized badge variants for common use cases
export function StatusBadge({ 
  status, 
  className = '' 
}: { 
  status: 'active' | 'inactive' | 'pending' | 'error';
  className?: string;
}) {
  const statusConfig = {
    active: { variant: 'success' as const, icon: '✓', label: 'Active' },
    inactive: { variant: 'outline' as const, icon: '○', label: 'Inactive' },
    pending: { variant: 'warning' as const, icon: '⏳', label: 'Pending' },
    error: { variant: 'error' as const, icon: '⚠', label: 'Error' },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      size="sm"
      icon={<span className="text-xs">{config.icon}</span>}
      className={className}
    >
      {config.label}
    </Badge>
  );
}

export function PriorityBadge({ 
  priority, 
  className = '' 
}: { 
  priority: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}) {
  const priorityConfig = {
    low: { variant: 'info' as const, icon: '↓', label: 'Low' },
    medium: { variant: 'primary' as const, icon: '→', label: 'Medium' },
    high: { variant: 'warning' as const, icon: '↑', label: 'High' },
    critical: { variant: 'error' as const, icon: '🚨', label: 'Critical' },
  };

  const config = priorityConfig[priority];

  return (
    <Badge
      variant={config.variant}
      size="sm"
      icon={<span className="text-xs">{config.icon}</span>}
      className={className}
    >
      {config.label}
    </Badge>
  );
}

export function CategoryBadge({ 
  category, 
  className = '' 
}: { 
  category: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      size="sm"
      className={`hover:bg-indigo-600 hover:text-white hover:border-indigo-600 ${className}`}
    >
      {category}
    </Badge>
  );
}

export function CountBadge({ 
  count, 
  max = 99, 
  className = '' 
}: { 
  count: number;
  max?: number;
  className?: string;
}) {
  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      variant="error"
      size="sm"
      className={`min-w-[1.25rem] justify-center ${className}`}
    >
      {displayCount}
    </Badge>
  );
}