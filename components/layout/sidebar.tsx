'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Wifi, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Globe
} from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, key: 'nav.dashboard' },
  { href: '/dashboard/customers', icon: Users, key: 'nav.customers' },
  { href: '/dashboard/payments', icon: CreditCard, key: 'nav.payments' },
  { href: '/dashboard/network', icon: Wifi, key: 'nav.network' },
  { href: '/dashboard/viber', icon: MessageSquare, key: 'nav.viber' },
  { href: '/dashboard/settings', icon: Settings, key: 'nav.settings' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'my' : 'en');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={cn("flex items-center space-x-2", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wifi className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">ISP Control</h1>
              <p className="text-xs text-gray-500">v2.0.1</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 lg:block hidden"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-smooth",
                isActive 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700" 
                  : "text-gray-700 hover:bg-gray-50",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className={cn("font-medium", language === 'my' && "font-myanmar")}>
                  {t(item.key)}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-smooth",
            isCollapsed && "justify-center px-2"
          )}
        >
          <Globe className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-medium">
              {language === 'en' ? 'မြန်မာ' : 'English'}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-700 hover:bg-red-50 transition-smooth",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className={cn("font-medium", language === 'my' && "font-myanmar")}>
              {t('nav.logout')}
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 h-full z-30 transition-smooth",
        isCollapsed ? "w-20" : "w-64"
      )}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 z-50 transform transition-transform lg:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}