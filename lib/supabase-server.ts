import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Database functions
export const getCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const getPayments = async () => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  
  return { data, error }
}

export const getNetworkDevices = async () => {
  const { data, error } = await supabase
    .from('network_devices')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const getNetworkMetrics = async (hours: number = 24) => {
  const { data, error } = await supabase
    .from('network_metrics')
    .select('*')
    .gte('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true })
  
  return { data, error }
}

export const getDashboardStats = async () => {
  try {
    const [customersResult, paymentsResult, devicesResult, metricsResult] = await Promise.all([
      supabase.from('customers').select('*', { count: 'exact' }),
      supabase.from('payments').select('amount, status').eq('status', 'completed'),
      supabase.from('network_devices').select('status', { count: 'exact' }),
      supabase.from('network_metrics').select('*').order('created_at', { ascending: false }).limit(1)
    ])

    const totalCustomers = customersResult.count || 0
    const activeCustomers = customersResult.data?.filter(c => c.status === 'active').length || 0
    const monthlyRevenue = paymentsResult.data?.reduce((sum, p) => sum + p.amount, 0) || 0
    const totalDevices = devicesResult.count || 0
    const onlineDevices = devicesResult.data?.filter(d => d.status === 'online').length || 0
    const latestMetric = metricsResult.data?.[0]
    const networkUptime = latestMetric?.network_performance || 99.8

    return {
      data: {
        totalCustomers,
        activeCustomers,
        monthlyRevenue,
        networkUptime,
        totalDevices,
        onlineDevices
      },
      error: null
    }
  } catch (error) {
    return { data: null, error }
  }
}