'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette,
  Save,
  Eye,
  EyeOff,
  Bot,
  Webhook,
  Database,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useToast } from '@/lib/contexts/toast-context';
import { useHealthCheck, useWebhookSetup } from '@/hooks/use-backend-api';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { language, t } = useLanguage();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'bot' | 'system'>('profile');

  // Backend API hooks
  const { data: healthData, loading: healthLoading, refetch: refetchHealth } = useHealthCheck();
  const { mutate: setupWebhooks, loading: webhookLoading } = useWebhookSetup();

  const [settings, setSettings] = useState({
    // Profile Settings
    companyName: 'ISP Control Myanmar',
    adminName: 'Admin User',
    email: 'admin@ispcontrol.com',
    phone: '+95 9 123 456 789',
    
    // Security Settings
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    viberNotifications: true,
    paymentAlerts: true,
    networkAlerts: true,
    
    // System Settings
    language: 'en',
    timezone: 'Asia/Yangon',
    currency: 'MMK',
    dateFormat: 'DD/MM/YYYY',
    
    // Bot Settings
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    viberBotToken: process.env.VIBER_BOT_TOKEN || '',
    autoResponseEnabled: true,
    responseDelay: 2,
    webhookUrl: 'https://mmlink-backend.onrender.com',
    
    // Payment Settings
    kbzPayEnabled: true,
    wavePayEnabled: true,
    bankTransferEnabled: true,
    
    // Network Settings
    monitoringInterval: 5,
    alertThreshold: 80,
    autoRestart: false
  });

  const handleSave = (section: string) => {
    addToast({
      title: 'Settings Saved',
      description: `${section} settings have been updated successfully.`,
      type: 'success'
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWebhookSetup = async () => {
    const result = await setupWebhooks(undefined, {});
    
    if (result) {
      addToast({
        title: 'Webhooks Configured',
        description: 'Bot webhooks have been set up successfully.',
        type: 'success'
      });
      refetchHealth();
    } else {
      addToast({
        title: 'Webhook Setup Failed',
        description: 'Failed to configure webhooks. Please check your bot tokens.',
        type: 'error'
      });
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'bot', label: 'Bot Configuration', icon: Bot },
    { id: 'system', label: 'System', icon: Settings }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className={cn(
            "text-3xl font-bold text-gray-900",
            language === 'my' && "font-myanmar"
          )}>
            {t('nav.settings')}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your system preferences and bot configurations
          </p>
        </div>

        {/* Backend Status Banner */}
        <div className={cn(
          "p-4 rounded-lg border",
          healthData 
            ? "bg-green-50 border-green-200" 
            : "bg-red-50 border-red-200"
        )}>
          <div className="flex items-center space-x-3">
            {healthData ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <div>
              <h3 className="font-medium text-gray-900">
                Backend API Status: {healthData ? 'Connected' : 'Disconnected'}
              </h3>
              <p className="text-sm text-gray-600">
                {healthData 
                  ? `Environment: ${healthData.environment} | Last check: ${new Date(healthData.timestamp).toLocaleString()}`
                  : 'Unable to connect to backend API. Some features may be limited.'
                }
              </p>
            </div>
            {!healthData && (
              <Button 
                onClick={refetchHealth} 
                disabled={healthLoading}
                variant="outline" 
                size="sm"
              >
                {healthLoading ? 'Checking...' : 'Retry'}
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2",
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <Input
                      value={settings.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Name
                    </label>
                    <Input
                      value={settings.adminName}
                      onChange={(e) => handleInputChange('adminName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input
                      value={settings.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <Button onClick={() => handleSave('Profile')} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={settings.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={settings.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      value={settings.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                    <button
                      onClick={() => handleInputChange('twoFactorEnabled', !settings.twoFactorEnabled)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        settings.twoFactorEnabled ? "bg-blue-600" : "bg-gray-200"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          settings.twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  
                  <Button onClick={() => handleSave('Security')} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Update Security
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Bot Configuration */}
          {activeTab === 'bot' && (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Bot className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Bot Configuration</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telegram Bot Token
                    </label>
                    <Input
                      type="password"
                      value={settings.telegramBotToken}
                      onChange={(e) => handleInputChange('telegramBotToken', e.target.value)}
                      placeholder="Enter Telegram bot token"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Viber Bot Token
                    </label>
                    <Input
                      type="password"
                      value={settings.viberBotToken}
                      onChange={(e) => handleInputChange('viberBotToken', e.target.value)}
                      placeholder="Enter Viber bot token"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Webhook URL
                    </label>
                    <Input
                      value={settings.webhookUrl}
                      onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                      placeholder="https://your-backend.com"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Auto Response</span>
                    <button
                      onClick={() => handleInputChange('autoResponseEnabled', !settings.autoResponseEnabled)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        settings.autoResponseEnabled ? "bg-blue-600" : "bg-gray-200"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          settings.autoResponseEnabled ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Response Delay (seconds)
                    </label>
                    <Input
                      type="number"
                      value={settings.responseDelay}
                      onChange={(e) => handleInputChange('responseDelay', parseInt(e.target.value))}
                      min="0"
                      max="10"
                    />
                  </div>
                  
                  <Button onClick={() => handleSave('Bot')} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Bot Settings
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Webhook className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Webhook Management</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Backend API:</span>
                        <span className={cn(
                          "text-sm font-medium",
                          healthData ? "text-green-600" : "text-red-600"
                        )}>
                          {healthData ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Webhook URL:</span>
                        <span className="text-sm text-gray-900 font-mono">
                          {settings.webhookUrl}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleWebhookSetup}
                    disabled={webhookLoading}
                    className="w-full"
                  >
                    <Webhook className="w-4 h-4 mr-2" />
                    {webhookLoading ? 'Setting up...' : 'Setup Webhooks'}
                  </Button>
                  
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">This will configure webhooks for:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Telegram Bot API</li>
                      <li>Viber REST API</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="my">မြန်မာ</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Asia/Yangon">Asia/Yangon</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MMK">Myanmar Kyat (MMK)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                  
                  <Button onClick={() => handleSave('System')} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save System Settings
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Database className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Database & API</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Connection Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Backend API:</span>
                        <span className={cn(
                          "text-sm font-medium",
                          healthData ? "text-green-600" : "text-red-600"
                        )}>
                          {healthData ? '✓ Connected' : '✗ Disconnected'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Database:</span>
                        <span className="text-sm font-medium text-green-600">
                          ✓ PostgreSQL
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bot Tokens:</span>
                        <span className="text-sm font-medium text-green-600">
                          ✓ Configured
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Backend Features:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Real-time message processing</li>
                      <li>User management</li>
                      <li>Statistics tracking</li>
                      <li>Webhook handling</li>
                      <li>Broadcast messaging</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}