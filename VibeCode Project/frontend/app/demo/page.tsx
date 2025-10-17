'use client';

import React, { useState } from 'react';
import { 
  Badge, 
  StatusBadge, 
  PriorityBadge, 
  CategoryBadge,
  Dropdown,
  Modal,
  ConfirmModal,
  LoadingModal,
  InfoModal,
  ToastContainer,
  useToast,
  ThemeToggle,
  ToolCard,
  ToolCardCompact
} from '@/components/UI';
import { Tool, Category, Tag } from '@/types';
import Layout, { PageLayout } from '@/components/Layout/Layout';

// Demo data
const demoCategory: Category = {
  id: 1,
  name: 'AI Development',
  description: 'Tools for AI development and machine learning',
  color: '#6366f1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const demoTags: Tag[] = [
  { id: 1, name: 'Machine Learning', color: '#10b981', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, name: 'NLP', color: '#f59e0b', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, name: 'Computer Vision', color: '#ef4444', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const demoTool: Tool = {
  id: 1,
  name: 'GPT-4 Assistant',
  description: 'Advanced AI assistant for code generation, debugging, and technical documentation. Supports multiple programming languages and frameworks.',
  icon: '🤖',
  category: demoCategory,
  tags: demoTags,
  accessLevel: 'Premium',
  usageCount: 1247,
  lastUpdated: new Date().toISOString(),
  isActive: true,
  url: 'https://openai.com/gpt-4',
  documentation: 'https://platform.openai.com/docs',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function DemoPage() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { toasts, success, error, warning, info, removeToast } = useToast();

  const dropdownItems = [
    {
      id: 'edit',
      label: 'Edit Tool',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
      onClick: () => console.log('Edit clicked'),
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
      onClick: () => console.log('Duplicate clicked'),
    },
    {
      id: 'divider-1',
      label: '',
      divider: true,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
      onClick: () => console.log('Delete clicked'),
    },
  ];

  const handleConfirmDelete = () => {
    console.log('Confirmed delete');
    setShowConfirmModal(false);
    success('Success', 'Tool deleted successfully');
  };

  return (
    <PageLayout
      title="AI Tools Platform - UI Demo"
      description="Showcase of the enhanced premium UI components and design system"
      actions={
        <div className="flex items-center space-x-ai-md">
          <ThemeToggle />
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Show Modal
          </button>
        </div>
      }
    >
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Toast Demo Buttons */}
      <div className="card">
        <h3 className="text-lg font-semibold text-ai-gray-900 mb-ai-md">Toast Notifications</h3>
        <div className="flex flex-wrap gap-ai-md">
          <button
            onClick={() => success('Success!', 'Your action was completed successfully.')}
            className="btn-primary"
          >
            Success Toast
          </button>
          <button
            onClick={() => error('Error!', 'Something went wrong. Please try again.')}
            className="btn-secondary bg-ai-error hover:bg-ai-error border-ai-error"
          >
            Error Toast
          </button>
          <button
            onClick={() => warning('Warning!', 'Please check your input before proceeding.')}
            className="btn-secondary bg-ai-warning hover:bg-ai-warning border-ai-warning"
          >
            Warning Toast
          </button>
          <button
            onClick={() => info('Info', 'Here is some useful information for you.')}
            className="btn-secondary bg-ai-info hover:bg-ai-info border-ai-info"
          >
            Info Toast
          </button>
        </div>
      </div>

      {/* Badge Components */}
      <div className="card">
        <h3 className="text-lg font-semibold text-ai-gray-900 mb-ai-md">Badge Components</h3>
        <div className="space-y-ai-md">
          <div>
            <h4 className="text-sm font-medium text-ai-gray-700 mb-ai-sm">Basic Badges</h4>
            <div className="flex flex-wrap gap-ai-sm">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-ai-gray-700 mb-ai-sm">Status & Priority Badges</h4>
            <div className="flex flex-wrap gap-ai-sm">
              <StatusBadge status="active" />
              <StatusBadge status="inactive" />
              <StatusBadge status="pending" />
              <StatusBadge status="error" />
              <PriorityBadge priority="low" />
              <PriorityBadge priority="medium" />
              <PriorityBadge priority="high" />
              <PriorityBadge priority="critical" />
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Component */}
      <div className="card">
        <h3 className="text-lg font-semibold text-ai-gray-900 mb-ai-md">Dropdown Component</h3>
        <div className="flex flex-wrap gap-ai-md">
          <Dropdown
            trigger={
              <button className="btn-secondary">
                Actions ▼
              </button>
            }
            items={dropdownItems}
            placement="bottom-left"
          />
          
          <Dropdown
            trigger={
              <button className="btn-ghost">
                More Options ▼
              </button>
            }
            items={dropdownItems}
            placement="bottom-right"
          />
        </div>
      </div>

      {/* Modal Components */}
      <div className="card">
        <h3 className="text-lg font-semibold text-ai-gray-900 mb-ai-md">Modal Components</h3>
        <div className="flex flex-wrap gap-ai-md">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Basic Modal
          </button>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="btn-secondary bg-ai-error hover:bg-ai-error border-ai-error"
          >
            Confirm Modal
          </button>
          <button
            onClick={() => {
              setShowLoadingModal(true);
              setTimeout(() => setShowLoadingModal(false), 3000);
            }}
            className="btn-secondary"
          >
            Loading Modal
          </button>
          <button
            onClick={() => setShowInfoModal(true)}
            className="btn-ghost"
          >
            Info Modal
          </button>
        </div>
      </div>

      {/* Tool Card Components */}
      <div className="card">
        <h3 className="text-lg font-semibold text-ai-gray-900 mb-ai-md">Tool Card Components</h3>
        <div className="space-y-ai-lg">
          <div>
            <h4 className="text-sm font-medium text-ai-gray-700 mb-ai-sm">Standard Tool Card</h4>
            <ToolCard
              tool={demoTool}
              onSelect={(tool) => console.log('Selected tool:', tool.name)}
            />
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-ai-gray-700 mb-ai-sm">Compact Tool Card</h4>
            <div className="space-y-ai-sm">
              <ToolCardCompact
                tool={demoTool}
                onSelect={(tool) => console.log('Selected compact tool:', tool.name)}
              />
              <ToolCardCompact
                tool={{ ...demoTool, name: 'TensorFlow Lite', icon: '🧠', isActive: false }}
                onSelect={(tool) => console.log('Selected compact tool:', tool.name)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Glass Morphism Demo */}
      <div className="card-glass">
        <h3 className="text-lg font-semibold text-ai-gray-900 mb-ai-md">Glass Morphism Effect</h3>
        <p className="text-ai-gray-600">
          This card demonstrates the premium glass morphism effect with backdrop blur and subtle transparency.
          Perfect for overlays and modern UI elements.
        </p>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Demo Modal"
        description="This is a demonstration of the premium modal component."
        size="lg"
      >
        <div className="space-y-ai-lg">
          <p className="text-ai-gray-600">
            This modal showcases the enhanced AI Tools Platform design system with smooth animations,
            proper focus management, and accessibility features.
          </p>
          <div className="flex justify-end space-x-ai-md">
            <button
              onClick={() => setShowModal(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="btn-primary"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Tool"
        message="Are you sure you want to delete this tool? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      <LoadingModal
        isOpen={showLoadingModal}
        title="Processing..."
        message="Please wait while we process your request."
      />

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Information"
        message="This is an informational modal to display important information to users."
        icon="ℹ️"
      />
    </PageLayout>
  );
}
