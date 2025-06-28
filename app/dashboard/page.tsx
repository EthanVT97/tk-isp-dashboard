'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatsCard } from '@/components/dashboard/stats-card';
import { NetworkChart } from '@/components/dashboard/network-chart';
import { Users, Wifi, DollarSign, Activity, AlertTriangle, CheckCircle, MessageSquare, Bot } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useOverviewStats, useHealthCheck } from '@/hooks/use-backend-api';
import { getISPNetworkData } from '@/lib/api-client';
import { LoadingCard, LoadingPage } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface NetworkData {
  networkData: Array<{ time: string; value: number; }>;
  bandwidthData: Array<{ time: string; value: number; }>;
}

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const { data: backendStats, loading: statsLoading, error: statsError } = useOverviewStats();
  const { data: healthData, loading: healthLoading } = useHealthCheck();
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [networkLoading, setNetworkLoading] = useState(true);

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const result = await getISPNetworkData();
        if (result.data) {
          setNetworkData(result.data.metrics);
        }
      } catch (error) {
        console.error('Failed to fetch network data:', error);
      } finally {
        setNetworkLoading(false);
      }
    };

    fetchNetworkData();
  }, []);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'bot', message: 'New Viber message received from customer', time: '2 minutes ago', status: 'success' },
    { id: 2, type: 'connection', message: 'Telegram bot responded automatically', time: '5 minutes ago', status: 'info' },
    { id: 3, type: 'alert', message: 'High message volume detected', time: '10 minutes ago', status: 'warning' },
    { id: 4, type: 'customer', message: 'New user registered on Telegram', time: '15 minutes ago', status: 'success' },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('MMK', 'K');
  };

  // Combine backend stats with ISP mock data
  const combinedStats = {
    totalUsers: backendStats?.stats?.totalUsers || 0,
    totalMessages: backendStats?.stats?.totalMessages || 0,
    messagesToday: backendStats?.stats?.messagesToday || 0,
    activeSessions: backendStats?.stats?.activeSessions || 0,
    // Mock ISP data
    monthlyRevenue: 45600000,
    networkUptime: 99.8,
  };

  // Show error state if backend is completely unreachable
  if (statsError && !backendStats) {
    console.error('Dashboard stats error:', statsError);
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
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
          
          {/* Backend Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              healthData ? "bg-green-500" : healthLoading ? "bg-yellow-500" : "bg-red-500"
            )}></div>
            <span className="text-sm text-gray-600">
              {healthData ? 'Backend Connected' : healthLoading ? 'Connecting...' : 'Backend Offline'}
            </span>
          </div>
        </div>

        {/* Connection Status Banner */}
        {statsError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800">Backend Connection Issue</h3>
                <p className="text-sm text-yellow-700">
                  Unable to connect to backend API. Displaying cached data and ISP features only.
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Error: {statsError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
          ) : (
            <>
              <StatsCard
                title="Total Bot Users"
                value={combinedStats.totalUsers.toLocaleString()}
                icon={Users}
                trend={{ value: 8.2, isPositive: true }}
                color="blue"
                loading={false}
              />
              <StatsCard
                title="Messages Today"
                value={combinedStats.messagesToday.toLocaleString()}
                icon={MessageSquare}
                trend={{ value: 12.5, isPositive: true }}
                color="green"
                loading={false}
              />
              <StatsCard
                title="Total Messages"
                value={combinedStats.totalMessages.toLocaleString()}
                icon={Bot}
                trend={{ value: 15.3, isPositive: true }}
                color="purple"
                loading={false}
              />
              <StatsCard
                title="Active Sessions"
                value={combinedStats.activeSessions.toString()}
                icon={Activity}
                trend={{ value: 0.2, isPositive: true }}
                color="yellow"
                loading={false}
              />
            </>
          )}
        </div>

        {/* Platform Distribution */}
        {backendStats?.stats?.platforms && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className={cn(
              "text-lg font-semibold text-gray-900 mb-4",
              language === 'my' && "font-myanmar"
            )}>
              Platform Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Viber</span>
                  <span className="text-sm text-purple-600">
                    {backendStats.stats.platforms.viber.users} users ({backendStats.stats.platforms.viber.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-smooth"
                    style={{ width: `${backendStats.stats.platforms.viber.percentage}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Telegram</span>
                  <span className="text-sm text-blue-600">
                    {backendStats.stats.platforms.telegram.users} users ({backendStats.stats.platforms.telegram.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-smooth"
                    style={{ width: `${backendStats.stats.platforms.telegram.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NetworkChart
            title="Network Performance"
            data={networkData?.networkData || []}
            color="#3B82F6"
            loading={networkLoading}
          />
          <NetworkChart
            title="Bandwidth Usage"
            data={networkData?.bandwidthData || []}
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

          {/* Backend API Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className={cn(
              "text-lg font-semibold text-gray-900 mb-4",
              language === 'my' && "font-myanmar"
            )}>
              Backend API Status
            </h3>
            <div className="space-y-4">
              {healthLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : healthData ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className="text-sm text-green-600 font-medium">✓ Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Environment:</span>
                    <span className="text-sm text-gray-900">{healthData.environment}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Last Check:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(healthData.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      Backend API is operational and responding normally.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className="text-sm text-red-600 font-medium">✗ Disconnected</span>
                  </div>
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800">
                      Unable to connect to backend API. Some features may be limited.
                    </p>
                    {statsError && (
                      <p className="text-xs text-red-600 mt-2">
                        Error: {statsError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}