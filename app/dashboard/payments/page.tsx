'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CreditCard, Smartphone, Building2, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useApi } from '@/hooks/use-api';
import { LoadingTable } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  customer_name: string;
  amount: number;
  method: 'kbz' | 'wave' | 'bank';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  reference: string;
}

export default function PaymentsPage() {
  const { language, t } = useLanguage();
  const { data: transactions, loading, error } = useApi<Transaction[]>('/api/dashboard/payments');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' MMK';
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'kbz':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'wave':
        return <Smartphone className="w-5 h-5 text-purple-600" />;
      case 'bank':
        return <Building2 className="w-5 h-5 text-green-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'kbz':
        return 'KBZ Pay';
      case 'wave':
        return 'Wave Pay';
      case 'bank':
        return 'Bank Transfer';
      default:
        return method;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
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
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate stats from transactions
  const stats = React.useMemo(() => {
    if (!transactions) return { totalRevenue: 0, kbzPayments: 0, wavePayments: 0, bankTransfers: 0 };
    
    const completed = transactions.filter(t => t.status === 'completed');
    const totalRevenue = completed.reduce((sum, t) => sum + t.amount, 0);
    const kbzPayments = completed.filter(t => t.method === 'kbz').reduce((sum, t) => sum + t.amount, 0);
    const wavePayments = completed.filter(t => t.method === 'wave').reduce((sum, t) => sum + t.amount, 0);
    const bankTransfers = completed.filter(t => t.method === 'bank').reduce((sum, t) => sum + t.amount, 0);
    
    return { totalRevenue, kbzPayments, wavePayments, bankTransfers };
  }, [transactions]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className={cn(
            "text-3xl font-bold text-gray-900 mb-2",
            language === 'my' && "font-myanmar"
          )}>
            {t('payments.title')}
          </h1>
          <p className="text-gray-600">
            Monitor payment transactions and revenue
          </p>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-sm text-green-600">+15.3% from last month</p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className={cn(
                    "text-sm font-medium text-gray-600",
                    language === 'my' && "font-myanmar"
                  )}>
                    {t('payments.kbzPay')}
                  </p>
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(stats.kbzPayments)}
                </p>
                <p className="text-sm text-blue-600">
                  {stats.totalRevenue > 0 ? ((stats.kbzPayments / stats.totalRevenue) * 100).toFixed(1) : 0}% of total
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className={cn(
                    "text-sm font-medium text-gray-600",
                    language === 'my' && "font-myanmar"
                  )}>
                    {t('payments.wavePay')}
                  </p>
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(stats.wavePayments)}
                </p>
                <p className="text-sm text-purple-600">
                  {stats.totalRevenue > 0 ? ((stats.wavePayments / stats.totalRevenue) * 100).toFixed(1) : 0}% of total
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className={cn(
                    "text-sm font-medium text-gray-600",
                    language === 'my' && "font-myanmar"
                  )}>
                    {t('payments.bankTransfer')}
                  </p>
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(stats.bankTransfers)}
                </p>
                <p className="text-sm text-green-600">
                  {stats.totalRevenue > 0 ? ((stats.bankTransfers / stats.totalRevenue) * 100).toFixed(1) : 0}% of total
                </p>
              </>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className={cn(
              "text-lg font-semibold text-gray-900",
              language === 'my' && "font-myanmar"
            )}>
              {t('payments.recent')}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('payments.amount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('payments.method')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('payments.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <LoadingTable rows={5} cols={6} />
                ) : (
                  transactions?.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={cn(
                          "text-sm font-medium text-gray-900",
                          language === 'my' && "font-myanmar"
                        )}>
                          {transaction.customer_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPaymentMethodIcon(transaction.method)}
                          <span className="ml-2 text-sm text-gray-900">
                            {getPaymentMethodName(transaction.method)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(transaction.status)}
                          <span className={cn(
                            "ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                            getStatusColor(transaction.status)
                          )}>
                            {transaction.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {transaction.reference}
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