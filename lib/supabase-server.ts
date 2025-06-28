import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Fallback to anon key if service role key is not available
const supabaseKey = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Use placeholder values if environment variables are not set
const defaultUrl = 'https://placeholder.supabase.co'
const defaultKey = 'placeholder_key'

const finalUrl = supabaseUrl || defaultUrl
const finalKey = supabaseKey || defaultKey

// Only create client if we have real Supabase credentials
const hasRealCredentials = supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co' && 
                          supabaseKey && supabaseKey !== 'placeholder_anon_key' && supabaseKey !== 'placeholder_key'

export const supabase = hasRealCredentials ? createClient(finalUrl, finalKey) : null

// Database functions with fallback to mock data
export const getCustomers = async () => {
  if (!supabase) {
    // Return mock data when Supabase is not configured
    return {
      data: [
        {
          id: 'CUST001',
          name: 'မောင်ရဲမင်း',
          phone: '+95 9 123 456 789',
          email: 'ye.min@email.com',
          address: 'No.123, Yangon Road, Yangon',
          package: 'Premium 100Mbps',
          status: 'active',
          join_date: '2024-01-15',
          last_payment: '2024-12-01'
        },
        {
          id: 'CUST002',
          name: 'Daw Thida',
          phone: '+95 9 987 654 321',
          email: 'thida@email.com',
          address: 'No.456, Mandalay Street, Mandalay',
          package: 'Standard 50Mbps',
          status: 'active',
          join_date: '2024-02-20',
          last_payment: '2024-12-01'
        }
      ],
      error: null
    }
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  } catch (error) {
    console.error('Supabase error:', error)
    return { data: null, error }
  }
}

export const getPayments = async () => {
  if (!supabase) {
    return {
      data: [
        {
          id: 'TXN001',
          customer_name: 'မောင်ရဲမင်း',
          amount: 50000,
          method: 'kbz',
          status: 'completed',
          date: '2024-12-15 14:30',
          reference: 'KBZ-2024-001'
        }
      ],
      error: null
    }
  }

  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    
    return { data, error }
  } catch (error) {
    console.error('Supabase error:', error)
    return { data: null, error }
  }
}

export const getNetworkDevices = async () => {
  if (!supabase) {
    return {
      data: [
        {
          id: 'RTR001',
          name: 'Main Router - Yangon',
          type: 'router',
          status: 'online',
          location: 'Yangon Central Office',
          uptime: '45 days, 12 hours',
          connected_users: 156,
          bandwidth: 85,
          last_seen: '2024-12-15 14:30'
        }
      ],
      error: null
    }
  }

  try {
    const { data, error } = await supabase
      .from('network_devices')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  } catch (error) {
    console.error('Supabase error:', error)
    return { data: null, error }
  }
}

export const getNetworkMetrics = async (hours: number = 24) => {
  if (!supabase) {
    // Generate mock metrics
    const mockData = []
    for (let i = 23; i >= 0; i--) {
      const time = new Date(Date.now() - i * 60 * 60 * 1000)
      mockData.push({
        timestamp: time.toISOString(),
        bandwidth_usage: Math.floor(Math.random() * 30) + 40,
        network_performance: Math.floor(Math.random() * 20) + 70,
        active_connections: Math.floor(Math.random() * 50) + 100
      })
    }
    return { data: mockData, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('network_metrics')
      .select('*')
      .gte('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true })
    
    return { data, error }
  } catch (error) {
    console.error('Supabase error:', error)
    return { data: null, error }
  }
}

export const getDashboardStats = async () => {
  if (!supabase) {
    return {
      data: {
        totalCustomers: 2547,
        activeCustomers: 1834,
        monthlyRevenue: 45600000,
        networkUptime: 99.8,
        totalDevices: 45,
        onlineDevices: 42
      },
      error: null
    }
  }

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
    console.error('Supabase error:', error)
    return { 
      data: {
        totalCustomers: 2547,
        activeCustomers: 1834,
        monthlyRevenue: 45600000,
        networkUptime: 99.8,
        totalDevices: 45,
        onlineDevices: 42
      }, 
      error 
    }
  }
}