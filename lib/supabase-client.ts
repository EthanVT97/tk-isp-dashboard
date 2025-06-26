import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

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