'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, Users } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useToast } from '@/lib/contexts/toast-context';
import { cn } from '@/lib/utils';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  package: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastPayment: string;
}

export default function CustomersPage() {
  const { language, t } = useLanguage();
  const { addToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: 'CUST001',
        name: 'မောင်ရဲမင်း',
        phone: '+95 9 123 456 789',
        email: 'ye.min@email.com',
        address: 'No.123, Yangon Road, Yangon',
        package: 'Premium 100Mbps',
        status: 'active',
        joinDate: '2024-01-15',
        lastPayment: '2024-12-01'
      },
      {
        id: 'CUST002',
        name: 'Daw Thida',
        phone: '+95 9 987 654 321',
        email: 'thida@email.com',
        address: 'No.456, Mandalay Street, Mandalay',
        package: 'Standard 50Mbps',
        status: 'active',
        joinDate: '2024-02-20',
        lastPayment: '2024-12-01'
      },
      {
        id: 'CUST003',
        name: 'Ko Aung',
        phone: '+95 9 555 123 456',
        email: 'aung@email.com',
        address: 'No.789, Naypyidaw Ave, Naypyidaw',
        package: 'Basic 25Mbps',
        status: 'inactive',
        joinDate: '2024-03-10',
        lastPayment: '2024-11-15'
      }
    ];

    setTimeout(() => {
      setCustomers(mockCustomers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
    addToast({
      title: 'Customer Deleted',
      description: 'Customer has been successfully removed.',
      type: 'success'
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
              {t('customers.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your customers and their subscriptions
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span className={language === 'my' ? "font-myanmar" : ""}>
              {t('customers.addNew')}
            </span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder={t('customers.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-smooth">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={cn(
                      "text-lg font-semibold text-gray-900",
                      language === 'my' && "font-myanmar"
                    )}>
                      {customer.name}
                    </h3>
                    <p className="text-sm text-gray-500">{customer.id}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getStatusColor(customer.status)
                  )}>
                    {customer.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {customer.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {customer.address}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Package:</span>
                    <span className="text-sm text-blue-600 font-medium">{customer.package}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">Last Payment:</span>
                    <span className="text-sm text-gray-900">{customer.lastPayment}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first customer'}
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}