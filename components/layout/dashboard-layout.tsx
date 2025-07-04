'use client';

import React from 'react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/lib/contexts/toast-context';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="lg:ml-64 transition-smooth">
        <Navbar />
        <div className="p-4 lg:p-8">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}