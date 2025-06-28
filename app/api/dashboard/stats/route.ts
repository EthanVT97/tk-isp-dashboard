import { NextResponse } from 'next/server'
import { apiClient } from '@/lib/api-client'

export async function GET() {
  try {
    // Try to get stats from backend API first
    const backendStats = await apiClient.getOverviewStats()
    
    if (backendStats.data) {
      // Combine backend stats with ISP mock data
      return NextResponse.json({
        totalCustomers: 2547, // ISP customers (mock)
        activeCustomers: 1834, // ISP active customers (mock)
        monthlyRevenue: 45600000, // ISP revenue (mock)
        networkUptime: 99.8, // ISP network uptime (mock)
        totalDevices: 45, // ISP devices (mock)
        onlineDevices: 42, // ISP online devices (mock)
        // Backend bot stats
        botUsers: backendStats.data.stats.totalUsers,
        botMessages: backendStats.data.stats.totalMessages,
        botMessagesToday: backendStats.data.stats.messagesToday,
        botActiveSessions: backendStats.data.stats.activeSessions,
        platforms: backendStats.data.stats.platforms
      })
    }
    
    // Fallback to mock data if backend is unavailable
    return NextResponse.json({
      totalCustomers: 2547,
      activeCustomers: 1834,
      monthlyRevenue: 45600000,
      networkUptime: 99.8,
      totalDevices: 45,
      onlineDevices: 42,
      botUsers: 0,
      botMessages: 0,
      botMessagesToday: 0,
      botActiveSessions: 0,
      platforms: {
        viber: { users: 0, percentage: 0 },
        telegram: { users: 0, percentage: 0 }
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    // Return mock data as fallback
    return NextResponse.json({
      totalCustomers: 2547,
      activeCustomers: 1834,
      monthlyRevenue: 45600000,
      networkUptime: 99.8,
      totalDevices: 45,
      onlineDevices: 42,
      botUsers: 0,
      botMessages: 0,
      botMessagesToday: 0,
      botActiveSessions: 0,
      platforms: {
        viber: { users: 0, percentage: 0 },
        telegram: { users: 0, percentage: 0 }
      }
    })
  }
}