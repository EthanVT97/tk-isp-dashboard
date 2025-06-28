'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Bot, 
  Users, 
  Send, 
  Settings, 
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Smartphone,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useToast } from '@/lib/contexts/toast-context';
import { useMessages, useUsers, useOverviewStats, useBackendApiMutation } from '@/hooks/use-backend-api';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

export default function ViberPage() {
  const { language, t } = useLanguage();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'viber' | 'telegram'>('all');

  // Backend API hooks
  const { data: messagesData, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useMessages({ limit: 20 });
  const { data: usersData, loading: usersLoading } = useUsers();
  const { data: statsData, loading: statsLoading } = useOverviewStats();
  const { mutate: broadcastMutate, loading: broadcastLoading } = useBackendApiMutation();

  const messages = messagesData?.messages || [];
  const users = usersData?.users || [];
  const stats = statsData?.stats;

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'viber':
        return <Smartphone className="w-4 h-4 text-purple-600" />;
      case 'telegram':
        return <Send className="w-4 h-4 text-blue-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      addToast({
        title: 'Error',
        description: 'Please enter a message to broadcast.',
        type: 'error'
      });
      return;
    }

    const payload = {
      text: broadcastMessage,
      ...(selectedPlatform !== 'all' && { platform: selectedPlatform })
    };

    const result = await broadcastMutate(
      (data) => apiClient.broadcastMessage(data),
      payload
    );

    if (result) {
      addToast({
        title: 'Broadcast Sent',
        description: 'Message has been sent to all users successfully.',
        type: 'success'
      });
      setBroadcastMessage('');
      refetchMessages();
    } else {
      addToast({
        title: 'Broadcast Failed',
        description: 'Failed to send broadcast message. Please try again.',
        type: 'error'
      });
    }
  };

  const handleReplyToMessage = async (messageId: string, userId: string, platform: string) => {
    // This would open a reply modal or interface
    addToast({
      title: 'Reply Feature',
      description: 'Reply functionality would be implemented here.',
      type: 'info'
    });
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
              Bot Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage Viber and Telegram bot conversations and automated responses
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
            {statsLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalUsers?.toLocaleString() || '0'}
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {statsLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalMessages?.toLocaleString() || '0'}
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {statsLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Messages Today</p>
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.messagesToday?.toLocaleString() || '0'}
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {statsLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.activeSessions?.toLocaleString() || '0'}
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {statsLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Bot Status</p>
                  <Bot className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">Online</p>
              </>
            )}
          </div>
        </div>

        {/* Platform Distribution */}
        {stats?.platforms && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Viber</span>
                  </div>
                  <span className="text-sm text-purple-600">
                    {stats.platforms.viber.users} users ({stats.platforms.viber.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-smooth"
                    style={{ width: `${stats.platforms.viber.percentage}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Send className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Telegram</span>
                  </div>
                  <span className="text-sm text-blue-600">
                    {stats.platforms.telegram.users} users ({stats.platforms.telegram.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-smooth"
                    style={{ width: `${stats.platforms.telegram.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Broadcast Message */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Broadcast Message</h3>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as 'all' | 'viber' | 'telegram')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Platforms</option>
                <option value="viber">Viber Only</option>
                <option value="telegram">Telegram Only</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <Input
                placeholder="Enter your broadcast message..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleBroadcast}
                disabled={broadcastLoading || !broadcastMessage.trim()}
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{broadcastLoading ? 'Sending...' : 'Broadcast'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search Messages */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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
            {messagesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-6 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : messagesError ? (
              <div className="p-6 text-center">
                <div className="text-red-600 mb-2">Failed to load messages</div>
                <Button onClick={refetchMessages} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm ? 'No messages found matching your search.' : 'No messages available.'}
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div key={message.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getPlatformIcon(message.platform)}
                        <h4 className={cn(
                          "font-medium text-gray-900",
                          language === 'my' && "font-myanmar"
                        )}>
                          {message.user?.displayName || message.user?.username || 'Unknown User'}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                        <span className={cn(
                          "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                          message.direction === 'in' ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        )}>
                          {message.direction === 'in' ? 'Incoming' : 'Outgoing'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className={cn(
                            "text-sm text-gray-800",
                            language === 'my' && "font-myanmar"
                          )}>
                            {message.content}
                          </p>
                        </div>
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
                      
                      {message.direction === 'in' && (
                        <Button 
                          size="sm" 
                          className="ml-2"
                          onClick={() => handleReplyToMessage(message.id, message.userId, message.platform)}
                        >
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
              <h4 className="font-medium text-gray-900 mb-2">Welcome Message</h4>
              <p className="text-sm text-gray-600 mb-3">
                Greeting for new users joining the bot
              </p>
              <Button variant="outline" size="sm">Use Template</Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Support Response</h4>
              <p className="text-sm text-gray-600 mb-3">
                Standard response for support inquiries
              </p>
              <Button variant="outline" size="sm">Use Template</Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Service Information</h4>
              <p className="text-sm text-gray-600 mb-3">
                Details about available services and packages
              </p>
              <Button variant="outline" size="sm">Use Template</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}