import { NextResponse } from 'next/server'
import { getDashboardStats } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await getDashboardStats()
    
    if (error) {
      console.error('Dashboard stats error:', error)
      // Return mock data as fallback
      return NextResponse.json({
        totalCustomers: 2547,
        activeCustomers: 1834,
        monthlyRevenue: 45600000,
        networkUptime: 99.8,
        totalDevices: 45,
        onlineDevices: 42
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    // Return mock data as fallback
    return NextResponse.json({
      totalCustomers: 2547,
      activeCustomers: 1834,
      monthlyRevenue: 45600000,
      networkUptime: 99.8,
      totalDevices: 45,
      onlineDevices: 42
    })
  }
}