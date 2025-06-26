'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Bot, 
  Users, 
  Send, 
  Settings, 
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useApi } from '@/hooks/use-api';
import { cn } from '@/lib/utils';

interface ViberMessage {
  id: string;
  customer_name: string;
  message: string;
  response: string;
  timestamp: string;
  status: 'pending' | 'responded' | 'escalated';
  is_auto_response: boolean;
}

interface ViberStats {
  total_messages: number;
  auto_responses: number;
  manual_responses: number;
  response_time: number;
  satisfaction: number;
}

interface ViberData {
  messages: ViberMessage[];
  stats: ViberStats;
}

export default function ViberPage() {
  const { language, t } = useLanguage();
  const { data, loading, error } = useApi<ViberData>('/api/dashboard/viber');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'responded':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'escalated':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
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
              {t('nav.viber')}
            </h1>
            <p className="text-gray-600 mt-1">
              Manage Viber bot conversations and automated responses
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Bot Settings</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.stats?.total_messages?.toLocaleString() || '0'}
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Auto Responses</p>
                  <Bot className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.stats?.auto_responses?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-green-600">
                  {data?.stats?.total_messages ? 
                    ((data.stats.auto_responses / data.stats.total_messages) * 100).toFixed(1) : 0}% automated
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Manual Responses</p>
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.stats?.manual_responses?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-purple-600">
                  {data?.stats?.total_messages ? 
                    ((data.stats.manual_responses / data.stats.total_messages) * 100).toFixed(1) : 0}% manual
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <Activity className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.stats?.response_time || 0}min
                </p>
                <p className="text-sm text-green-600">-15% from last week</p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.stats?.satisfaction || 0}/5.0
                </p>
                <p className="text-sm text-green-600">+0.3 from last month</p>
              </>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className={cn(
              "text-lg font-semibold text-gray-900",
              language === 'my' && "font-myanmar"
            )}>
              Recent Messages
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-6 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              data?.messages?.map((message) => (
                <div key={message.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className={cn(
                          "font-medium text-gray-900",
                          language === 'my' && "font-myanmar"
                        )}>
                          {message.customer_name}
                        </h4>
                        <span className="text-sm text-gray-500">{message.timestamp}</span>
                        {message.is_auto_response && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Bot className="w-3 h-3 mr-1" />
                            Auto
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className={cn(
                            "text-sm text-gray-800",
                            language === 'my' && "font-myanmar"
                          )}>
                            <strong>Customer:</strong> {message.message}
                          </p>
                        </div>
                        
                        {message.response && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className={cn(
                              "text-sm text-blue-800",
                              language === 'my' && "font-myanmar"
                            )}>
                              <strong>Response:</strong> {message.response}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {getStatusIcon(message.status)}
                      <span className={cn(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        getStatusColor(message.status)
                      )}>
                        {message.status}
                      </span>
                      
                      {message.status === 'pending' && (
                        <Button size="sm" className="ml-2">
                          <Send className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Response Templates */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className={cn(
            "text-lg font-semibold text-gray-900 mb-4",
            language === 'my' && "font-myanmar"
          )}>
            Quick Response Templates
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Internet Issues</h4>
              <p className="text-sm text-gray-600 mb-3">
                Standard response for connectivity problems
              </p>
              <Button variant="outline" size="sm">Use Template</Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Payment Inquiry</h4>
              <p className="text-sm text-gray-600 mb-3">
                Information about payment methods and billing
              </p>
              <Button variant="outline" size="sm">Use Template</Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Package Upgrade</h4>
              <p className="text-sm text-gray-600 mb-3">
                Details about available packages and upgrades
              </p>
              <Button variant="outline" size="sm">Use Template</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}