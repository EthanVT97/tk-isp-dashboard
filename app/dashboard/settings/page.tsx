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
  EyeOff
} from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useToast } from '@/lib/contexts/toast-context';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { language, t } = useLanguage();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
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
    
    // Viber Bot Settings
    viberBotToken: '',
    autoResponseEnabled: true,
    responseDelay: 2,
    
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
            Manage your system preferences and configurations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
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

          {/* Security Settings */}
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

          {/* Notification Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications' },
                { key: 'smsNotifications', label: 'SMS Notifications' },
                { key: 'viberNotifications', label: 'Viber Notifications' },
                { key: 'paymentAlerts', label: 'Payment Alerts' },
                { key: 'networkAlerts', label: 'Network Alerts' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <button
                    onClick={() => handleInputChange(key, !settings[key as keyof typeof settings])}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      settings[key as keyof typeof settings] ? "bg-blue-600" : "bg-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        settings[key as keyof typeof settings] ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              ))}
              
              <Button onClick={() => handleSave('Notification')} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Notifications
              </Button>
            </div>
          </div>

          {/* System Settings */}
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
        </div>
      </div>
    </DashboardLayout>
  );
}