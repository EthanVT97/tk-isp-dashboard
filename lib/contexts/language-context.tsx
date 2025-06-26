'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'my';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.customers': 'Customers',
    'nav.payments': 'Payments',
    'nav.network': 'Network Monitor',
    'nav.viber': 'Viber Bot',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'ISP Control Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.totalCustomers': 'Total Customers',
    'dashboard.activeConnections': 'Active Connections',
    'dashboard.monthlyRevenue': 'Monthly Revenue',
    'dashboard.networkUptime': 'Network Uptime',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.topPackages': 'Popular Packages',
    
    // Customers
    'customers.title': 'Customer Management',
    'customers.addNew': 'Add New Customer',
    'customers.search': 'Search customers...',
    'customers.name': 'Name',
    'customers.phone': 'Phone',
    'customers.package': 'Package',
    'customers.status': 'Status',
    'customers.actions': 'Actions',
    
    // Payments
    'payments.title': 'Payment Management',
    'payments.kbzPay': 'KBZ Pay',
    'payments.wavePay': 'Wave Pay',
    'payments.bankTransfer': 'Bank Transfer',
    'payments.recent': 'Recent Transactions',
    'payments.amount': 'Amount',
    'payments.method': 'Method',
    'payments.date': 'Date',
    
    // Network
    'network.title': 'Network Monitoring',
    'network.devices': 'Connected Devices',
    'network.bandwidth': 'Bandwidth Usage',
    'network.uptime': 'Uptime',
    'network.alerts': 'Alerts',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.online': 'Online',
    'common.offline': 'Offline',
  },
  my: {
    // Navigation
    'nav.dashboard': 'ထိန်းချုပ်မှုပြားကွက်',
    'nav.customers': 'ဖောက်သည်များ',
    'nav.payments': 'ငွေပေးချေမှု',
    'nav.network': 'ကွန်ယက်စောင့်ကြည့်မှု',
    'nav.viber': 'Viber Bot',
    'nav.settings': 'ဆက်တင်များ',
    'nav.logout': 'ထွက်မည်',
    
    // Dashboard
    'dashboard.title': 'ISP ထိန်းချုပ်မှုပြားကွက်',
    'dashboard.overview': 'ခြုံငုံကြည့်ရှုမှု',
    'dashboard.totalCustomers': 'စုစုပေါင်းဖောက်သည်',
    'dashboard.activeConnections': 'အသုံးပြုနေသောချိတ်ဆက်မှု',
    'dashboard.monthlyRevenue': 'လစဉ်ဝင်ငွေ',
    'dashboard.networkUptime': 'ကွန်ယက်အလုပ်လုပ်ချိန်',
    'dashboard.recentActivity': 'လတ်တလောလှုပ်ရှားမှုများ',
    'dashboard.topPackages': 'လူကြိုက်များသောပက်ကေ့ဂျ်များ',
    
    // Customers
    'customers.title': 'ဖောက်သည်စီမံခန့်ခွဲမှု',
    'customers.addNew': 'ဖောက်သည်အသစ်ထည့်မည်',
    'customers.search': 'ဖောက်သည်ရှာရန်...',
    'customers.name': 'အမည်',
    'customers.phone': 'ဖုန်းနံပါတ်',
    'customers.package': 'ပက်ကေ့ဂျ်',
    'customers.status': 'အခြေအနေ',
    'customers.actions': 'လုပ်ဆောင်ချက်များ',
    
    // Payments
    'payments.title': 'ငွေပေးချေမှုစီမံခန့်ခွဲမှု',
    'payments.kbzPay': 'KBZ Pay',
    'payments.wavePay': 'Wave Pay',
    'payments.bankTransfer': 'ဘဏ်လွှဲပြောင်းမှု',
    'payments.recent': 'လတ်တလောအရောင်းအဝယ်များ',
    'payments.amount': 'ပမာណ',
    'payments.method': 'နည်းလမ်း',
    'payments.date': 'ရက်စွဲ',
    
    // Network
    'network.title': 'ကွန်ယက်စောင့်ကြည့်မှု',
    'network.devices': 'ချိတ်ဆက်ထားသောကိရိယာများ',
    'network.bandwidth': 'Bandwidth အသုံးပြုမှု',
    'network.uptime': 'အလုပ်လုပ်ချိန်',
    'network.alerts': 'သတိပေးချက်များ',
    
    // Common
    'common.loading': 'ခေတ္တစောင့်ပါ...',
    'common.save': 'သိမ်းမည်',
    'common.cancel': 'ပယ်ဖျက်မည်',
    'common.edit': 'ပြင်ဆင်မည်',
    'common.delete': 'ဖျက်မည်',
    'common.active': 'အသုံးပြုနေသော',
    'common.inactive': 'အသုံးမပြုသော',
    'common.online': 'အွန်လိုင်းရှိ',
    'common.offline': 'အွန်လိုင်းမရှိ',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'my')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}