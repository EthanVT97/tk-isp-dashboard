'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatsCard } from '@/components/dashboard/stats-card';
import { NetworkChart } from '@/components/dashboard/network-chart';
import { Users, Wifi, DollarSign, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useApi } from '@/hooks/use-api';
import { LoadingCard } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  monthlyRevenue: number;
  networkUptime: number;
  totalDevices: number;
  onlineDevices: number;
}

interface NetworkData {
  networkData: Array<{ time: string; value: number; }>;
  bandwidthData: Array<{ time: string; value: number; }>;
}

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const { data: stats, loading: statsLoading, error: statsError } = useApi<DashboardStats>('/api/dashboard/stats');
  const { data: networkData, loading: networkLoading } = useApi<{ metrics: NetworkData }>('/api/dashboard/network');

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'payment', message: 'Payment received from Customer #1234', time: '2 minutes ago', status: 'success' },
    { id: 2, type: 'connection', message: 'New device connected: Router-001', time: '5 minutes ago', status: 'info' },
    { id: 3, type: 'alert', message: 'High bandwidth usage detected', time: '10 minutes ago', status: 'warning' },
    { id: 4, type: 'customer', message: 'New customer registration', time: '15 minutes ago', status: 'success' },
  ]);

  const [topPackages, setTopPackages] = useState([
    { name: 'Premium 100Mbps', customers: 856, revenue: 25680000, growth: 12.5 },
    { name: 'Standard 50Mbps', customers: 723, revenue: 14460000, growth: 8.3 },
    { name: 'Basic 25Mbps', customers: 612, revenue: 9180000, growth: 5.7 },
    { name: 'Enterprise 1Gbps', customers: 45, revenue: 13500000, growth: 15.2 }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('MMK', 'K');
  };

  if (statsError) {
    console.error('Dashboard stats error:', statsError);
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className={cn(
            "text-3xl font-bold text-gray-900 mb-2",
            language === 'my' && "font-myanmar"
          )}>
            {t('dashboard.title')}
          </h1>
          <p className={cn(
            "text-gray-600",
            language === 'my' && "font-myanmar"
          )}>
            {t('dashboard.overview')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
          ) : (
            <>
              <StatsCard
                title={t('dashboard.totalCustomers')}
                value={stats?.totalCustomers?.toLocaleString() || '0'}
                icon={Users}
                trend={{ value: 8.2, isPositive: true }}
                color="blue"
                loading={false}
              />
              <StatsCard
                title={t('dashboard.activeConnections')}
                value={stats?.activeCustomers?.toLocaleString() || '0'}
                icon={Wifi}
                trend={{ value: 12.5, isPositive: true }}
                color="green"
                loading={false}
              />
              <StatsCard
                title={t('dashboard.monthlyRevenue')}
                value={formatCurrency(stats?.monthlyRevenue || 0)}
                icon={DollarSign}
                trend={{ value: 15.3, isPositive: true }}
                color="purple"
                loading={false}
              />
              <StatsCard
                title={t('dashboard.networkUptime')}
                value={`${stats?.networkUptime || 0}%`}
                icon={Activity}
                trend={{ value: 0.2, isPositive: true }}
                color="yellow"
                loading={false}
              />
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NetworkChart
            title="Network Performance"
            data={networkData?.metrics?.networkData || []}
            color="#3B82F6"
            loading={networkLoading}
          />
          <NetworkChart
            title="Bandwidth Usage"
            data={networkData?.metrics?.bandwidthData || []}
            color="#10B981"
            loading={networkLoading}
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className={cn(
              "text-lg font-semibold text-gray-900 mb-4",
              language === 'my' && "font-myanmar"
            )}>
              {t('dashboard.recentActivity')}
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    activity.status === 'success' && "bg-green-100",
                    activity.status === 'warning' && "bg-yellow-100",
                    activity.status === 'info' && "bg-blue-100"
                  )}>
                    {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {activity.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    {activity.status === 'info' && <Activity className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Packages */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className={cn(
              "text-lg font-semibold text-gray-900 mb-4",
              language === 'my' && "font-myanmar"
            )}>
              {t('dashboard.topPackages')}
            </h3>
            <div className="space-y-4">
              {topPackages.map((pkg, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{pkg.name}</span>
                    <span className="text-sm text-green-600">+{pkg.growth}%</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{pkg.customers} customers</span>
                    <span>{formatCurrency(pkg.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-smooth"
                      style={{ width: `${(pkg.customers / 1000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}