'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6 animate-pulse', className)}>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

interface LoadingTableProps {
  rows?: number;
  cols?: number;
}

export function LoadingTable({ rows = 5, cols = 4 }: LoadingTableProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
              <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

interface LoadingChartProps {
  height?: number;
  className?: string;
}

export function LoadingChart({ height = 200, className }: LoadingChartProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className={`bg-gray-200 rounded`} style={{ height: `${height}px` }}></div>
      </div>
    </div>
  );
}

interface FullPageLoadingProps {
  message?: string;
}

export function FullPageLoading({ message = 'Loading...' }: FullPageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}