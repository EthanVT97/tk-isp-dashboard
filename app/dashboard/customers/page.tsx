'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, Users, MessageSquare, Send } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useToast } from '@/lib/contexts/toast-context';
import { useUsers, useBackendApiMutation } from '@/hooks/use-backend-api';
import { getISPCustomers, apiClient } from '@/lib/api-client';
import { LoadingTable } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  package: string;
  status: 'active' | 'inactive' | 'suspended';
  join_date: string;
  last_payment: string;
}

interface BotUser {
  id: string;
  platform: string;
  platformUserId: string;
  username: string;
  displayName: string;
  phoneNumber: string | null;
  languageCode: string;
  isActive: boolean;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export default function CustomersPage() {
  const { language, t } = useLanguage();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'isp' | 'bot'>('isp');

  // Backend API hooks for bot users
  const { data: botUsersData, loading: botUsersLoading, error: botUsersError, refetch: refetchBotUsers } = useUsers();
  const { mutate: updateUserMutate, loading: updateLoading } = useBackendApiMutation();

  // ISP customers (mock data)
  const [ispCustomers, setIspCustomers] = React.useState<Customer[]>([]);
  const [ispLoading, setIspLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchISPCustomers = async () => {
      try {
        const result = await getISPCustomers();
        if (result.data) {
          setIspCustomers(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch ISP customers:', error);
      } finally {
        setIspLoading(false);
      }
    };

    fetchISPCustomers();
  }, []);

  const botUsers = botUsersData?.users || [];

  const filteredISPCustomers = ispCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBotUsers = botUsers.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.platformUserId.includes(searchTerm)
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

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'viber':
        return 'bg-purple-100 text-purple-800';
      case 'telegram':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      addToast({
        title: 'Customer Deleted',
        description: 'Customer has been successfully removed.',
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to delete customer.',
        type: 'error'
      });
    }
  };

  const handleToggleBotUserStatus = async (userId: string, currentStatus: boolean) => {
    const result = await updateUserMutate(
      (data) => apiClient.updateUser(userId, data),
      { isActive: !currentStatus }
    );

    if (result) {
      addToast({
        title: 'User Updated',
        description: `User has been ${!currentStatus ? 'activated' : 'deactivated'}.`,
        type: 'success'
      });
      refetchBotUsers();
    } else {
      addToast({
        title: 'Error',
        description: 'Failed to update user status.',
        type: 'error'
      });
    }
  };

  const handleSendMessage = (userId: string, platform: string) => {
    addToast({
      title: 'Message Feature',
      description: 'Direct messaging feature would be implemented here.',
      type: 'info'
    });
  };

  if (botUsersError) {
    console.error('Bot users error:', botUsersError);
  }

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
              Customer & User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage ISP customers and bot users from all platforms
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span className={language === 'my' ? "font-myanmar" : ""}>
              Add New Customer
            </span>
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('isp')}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm",
                activeTab === 'isp'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              ISP Customers ({ispCustomers.length})
            </button>
            <button
              onClick={() => setActiveTab('bot')}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm",
                activeTab === 'bot'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Bot Users ({botUsers.length})
            </button>
          </nav>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder={activeTab === 'isp' ? 'Search customers...' : 'Search bot users...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* ISP Customers Tab */}
        {activeTab === 'isp' && (
          <>
            {ispLoading ? (
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
                {filteredISPCustomers.map((customer) => (
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
                        <span className="text-sm text-gray-900">{customer.last_payment}</span>
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

            {/* Empty State for ISP */}
            {!ispLoading && filteredISPCustomers.length === 0 && (
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
          </>
        )}

        {/* Bot Users Tab */}
        {activeTab === 'bot' && (
          <>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {botUsersLoading ? (
                      <LoadingTable rows={5} cols={6} />
                    ) : botUsersError ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center">
                          <div className="text-red-600 mb-2">Failed to load bot users</div>
                          <Button onClick={refetchBotUsers} variant="outline" size="sm">
                            Try Again
                          </Button>
                        </td>
                      </tr>
                    ) : filteredBotUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          {searchTerm ? 'No users found matching your search.' : 'No bot users available.'}
                        </td>
                      </tr>
                    ) : (
                      filteredBotUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-gray-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.displayName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @{user.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={cn(
                              "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                              getPlatformColor(user.platform)
                            )}>
                              {user.platform}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={cn(
                              "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                              user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            )}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.languageCode.toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSendMessage(user.id, user.platform)}
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Message
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleBotUserStatus(user.id, user.isActive)}
                              disabled={updateLoading}
                              className={user.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}