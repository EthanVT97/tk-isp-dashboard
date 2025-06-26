'use client';

import React from 'react';
import { Sidebar } from './sidebar';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/lib/contexts/toast-context';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="lg:ml-64 transition-smooth">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
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