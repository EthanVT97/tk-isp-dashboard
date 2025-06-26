'use client';

import React from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface NetworkChartProps {
  title: string;
  data: Array<{ time: string; value: number; }>;
  color?: string;
  loading?: boolean;
}

export function NetworkChart({ title, data, color = '#3B82F6', loading = false }: NetworkChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 chart-animate">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Activity className="w-4 h-4 mr-1" />
          Real-time
        </div>
      </div>
      
      <div className="relative h-40">
        <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={i * 40}
              x2="400"
              y2={i * 40}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Chart line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 400;
              const y = 160 - ((point.value - minValue) / range) * 160;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 400;
            const y = 160 - ((point.value - minValue) / range) * 160;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                className="opacity-80"
              />
            );
          })}
        </svg>
        
        {/* Current value indicator */}
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <div className="flex items-center">
            {data[data.length - 1]?.value > data[data.length - 2]?.value ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className="text-lg font-bold text-gray-900 ml-1">
              {data[data.length - 1]?.value}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Time labels */}
      <div className="flex justify-between mt-4 text-xs text-gray-500">
        {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map((point, index) => (
          <span key={index}>{point.time}</span>
        ))}
      </div>
    </div>
  );
}