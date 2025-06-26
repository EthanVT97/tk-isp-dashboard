'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatsCard } from '@/components/dashboard/stats-card';
import { NetworkChart } from '@/components/dashboard/network-chart';
import { Button } from '@/components/ui/button';
import { 
  Wifi, 
  Router, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Signal,
  Zap,
  Globe,
  Settings
} from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { cn } from '@/lib/utils';

interface NetworkDevice {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'access_point';
  status: 'online' | 'offline' | 'warning';
  location: string;
  uptime: string;
  connectedUsers: number;
  bandwidth: number;
  lastSeen: string;
}

export default function NetworkPage() {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [networkData, setNetworkData] = useState<Array<{ time: string; value: number; }>>([]);
  const [bandwidthData, setBandwidthData] = useState<Array<{ time: string; value: number; }>>([]);

  const [stats, setStats] = useState({
    totalDevices: 45,
    onlineDevices: 42,
    totalBandwidth: 1000,
    usedBandwidth: 650,
    networkUptime: 99.8,
    activeAlerts: 3
  });

  useEffect(() => {
    // Mock data
    const mockDevices: NetworkDevice[] = [
      {
        id: 'RTR001',
        name: 'Main Router - Yangon',
        type: 'router',
        status: 'online',
        location: 'Yangon Central Office',
        uptime: '45 days, 12 hours',
        connectedUsers: 156,
        bandwidth: 85,
        lastSeen: '2024-12-15 14:30'
      },
      {
        id: 'RTR002',
        name: 'Secondary Router - Mandalay',
        type: 'router',
        status: 'online',
        location: 'Mandalay Branch',
        uptime: '32 days, 8 hours',
        connectedUsers: 89,
        bandwidth: 67,
        lastSeen: '2024-12-15 14:29'
      },
      {
        id: 'AP001',
        name: 'Access Point - Downtown',
        type: 'access_point',
        status: 'warning',
        location: 'Downtown Area',
        uptime: '12 days, 3 hours',
        connectedUsers: 45,
        bandwidth: 92,
        lastSeen: '2024-12-15 14:25'
      },
      {
        id: 'SW001',
        name: 'Core Switch - HQ',
        type: 'switch',
        status: 'online',
        location: 'Headquarters',
        uptime: '67 days, 15 hours',
        connectedUsers: 234,
        bandwidth: 78,
        lastSeen: '2024-12-15 14:30'
      },
      {
        id: 'RTR003',
        name: 'Backup Router - Naypyidaw',
        type: 'router',
        status: 'offline',
        location: 'Naypyidaw Office',
        uptime: '0 days, 0 hours',
        connectedUsers: 0,
        bandwidth: 0,
        lastSeen: '2024-12-14 09:15'
      }
    ];

    // Generate mock network data
    const generateNetworkData = () => {
      const now = new Date();
      const data = [];
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          time: `${time.getHours()}:00`,
          value: Math.floor(Math.random() * 20) + 70 + Math.sin(i / 4) * 10
        });
      }
      return data;
    };

    const generateBandwidthData = () => {
      const now = new Date();
      const data = [];
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          time: `${time.getHours()}:00`,
          value: Math.floor(Math.random() * 30) + 40 + Math.cos(i / 3) * 15
        });
      }
      return data;
    };

    setTimeout(() => {
      setDevices(mockDevices);
      setNetworkData(generateNetworkData());
      setBandwidthData(generateBandwidthData());
      setLoading(false);
    }, 1000);
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'router':
        return <Router className="w-5 h-5" />;
      case 'switch':
        return <Globe className="w-5 h-5" />;
      case 'access_point':
        return <Wifi className="w-5 h-5" />;
      default:
        return <Router className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'offline':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className={cn(
              "text-3xl font-bold text-gray-900",
              language === 'my' && "font-myanmar"
            )}>
              {t('network.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor network devices and performance in real-time
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Network Settings</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Devices"
            value={stats.totalDevices.toString()}
            icon={Router}
            trend={{ value: 2.1, isPositive: true }}
            color="blue"
            loading={loading}
          />
          <StatsCard
            title="Online Devices"
            value={stats.onlineDevices.toString()}
            icon={CheckCircle}
            trend={{ value: 1.2, isPositive: true }}
            color="green"
            loading={loading}
          />
          <StatsCard
            title="Bandwidth Usage"
            value={`${stats.usedBandwidth}/${stats.totalBandwidth} Mbps`}
            icon={Signal}
            trend={{ value: 5.3, isPositive: false }}
            color="purple"
            loading={loading}
          />
          <StatsCard
            title="Network Uptime"
            value={`${stats.networkUptime}%`}
            icon={Activity}
            trend={{ value: 0.1, isPositive: true }}
            color="yellow"
            loading={loading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NetworkChart
            title="Network Performance"
            data={networkData}
            color="#3B82F6"
            loading={loading}
          />
          <NetworkChart
            title="Bandwidth Usage"
            data={bandwidthData}
            color="#10B981"
            loading={loading}
          />
        </div>

        {/* Devices List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className={cn(
              "text-lg font-semibold text-gray-900",
              language === 'my' && "font-myanmar"
            )}>
              Network Devices
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bandwidth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uptime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-6 py-4 whitespace-nowrap">
                          <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  devices.map((device) => (
                    <tr key={device.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getDeviceIcon(device.type)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {device.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {device.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(device.status)}
                          <span className={cn(
                            "ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                            getStatusColor(device.status)
                          )}>
                            {device.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {device.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {device.connectedUsers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={cn(
                                "h-2 rounded-full",
                                device.bandwidth > 80 ? "bg-red-500" : 
                                device.bandwidth > 60 ? "bg-yellow-500" : "bg-green-500"
                              )}
                              style={{ width: `${device.bandwidth}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">{device.bandwidth}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {device.uptime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Configure
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}