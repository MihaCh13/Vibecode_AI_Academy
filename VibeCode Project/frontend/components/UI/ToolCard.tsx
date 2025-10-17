'use client';

import React from 'react';
import { Tool, Tag } from '@/types';

interface ToolCardProps {
  tool: Tool;
  onSelect?: (tool: Tool) => void;
  className?: string;
}

export default function ToolCard({ tool, onSelect, className = '' }: ToolCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(tool);
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-indigo-300 transition-all duration-200 cursor-pointer group ${className}`}
      onClick={handleClick}
    >
      {/* Tool Header */}
      <div className="flex items-start justify-between mb-4 p-4 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200 flex-shrink-0">
            <span className="text-white text-lg sm:text-xl">{tool.icon || '🛠️'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 truncate">
              {tool.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {tool.category?.name || 'Uncategorized'}
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex flex-col items-end space-y-2 flex-shrink-0">
          {tool.isActive ? (
            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
              Inactive
            </span>
          )}
        </div>
      </div>

      {/* Tool Description */}
      <div className="mb-4 px-4 sm:px-6">
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {tool.description || 'No description available'}
        </p>
      </div>

      {/* Tool Tags */}
      {tool.tags && tool.tags.length > 0 && (
        <div className="mb-4 px-4 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {tool.tags.slice(0, 3).map((tag: Tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
              >
                {tag.name}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                +{tool.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tool Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 px-4 sm:px-6 mb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-4">
          {tool.accessLevel && (
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>{tool.accessLevel}</span>
            </div>
          )}
          
          {tool.usageCount !== undefined && (
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{tool.usageCount} uses</span>
            </div>
          )}
        </div>
        
        {tool.lastUpdated && (
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{new Date(tool.lastUpdated).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between px-6 pb-6">
        <div className="flex items-center space-x-2">
          <button className="text-gray-600 hover:text-indigo-600 text-xs py-1 px-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
            View Details
          </button>
          <button className="text-gray-600 hover:text-indigo-600 text-xs py-1 px-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
            Share
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-all duration-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-all duration-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Compact version for lists
export function ToolCardCompact({ tool, onSelect, className = '' }: ToolCardProps) {
  return (
    <div 
      className={`flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer group ${className}`}
      onClick={() => onSelect?.(tool)}
    >
      <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
        <span className="text-white text-sm">{tool.icon || '🛠️'}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 truncate">
          {tool.name}
        </h4>
        <p className="text-sm text-gray-500 truncate">
          {tool.category?.name || 'Uncategorized'}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        {tool.isActive ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            Inactive
          </span>
        )}
        
        <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}