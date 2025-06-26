import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  package: string
  status: 'active' | 'inactive' | 'suspended'
  join_date: string
  last_payment: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  customer_id: string
  customer_name: string
  amount: number
  method: 'kbz' | 'wave' | 'bank'
  status: 'completed' | 'pending' | 'failed'
  date: string
  reference: string
  created_at: string
}

export interface NetworkDevice {
  id: string
  name: string
  type: 'router' | 'switch' | 'access_point'
  status: 'online' | 'offline' | 'warning'
  location: string
  uptime: string
  connected_users: number
  bandwidth: number
  last_seen: string
  created_at: string
}

export interface NetworkMetric {
  id: string
  timestamp: string
  bandwidth_usage: number
  network_performance: number
  active_connections: number
  created_at: string
}

// Auth functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

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