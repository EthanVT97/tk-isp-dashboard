import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Use placeholder values if environment variables are not set
const defaultUrl = 'https://placeholder.supabase.co'
const defaultKey = 'placeholder_anon_key'

const finalUrl = supabaseUrl || defaultUrl
const finalKey = supabaseAnonKey || defaultKey

// Only create client if we have real Supabase credentials
const hasRealCredentials = supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co' && 
                          supabaseAnonKey && supabaseAnonKey !== 'placeholder_anon_key'

export const supabase = hasRealCredentials ? createClient(finalUrl, finalKey) : null

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

// Auth functions - only work with real Supabase
export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUp = async (email: string, password: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  if (!supabase) {
    return { error: { message: 'Supabase not configured' } }
  }

  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  if (!supabase) {
    return null
  }

  const { data: { user } } = await supabase.auth.getUser()
  return user
}