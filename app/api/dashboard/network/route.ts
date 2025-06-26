import { NextResponse } from 'next/server'
import { getNetworkDevices, getNetworkMetrics } from '@/lib/supabase'

export async function GET() {
  try {
    const [devicesResult, metricsResult] = await Promise.all([
      getNetworkDevices(),
      getNetworkMetrics(24)
    ])
    
    if (devicesResult.error || metricsResult.error) {
      console.error('Network API error:', devicesResult.error || metricsResult.error)
      // Return mock data as fallback
      return NextResponse.json({
        devices: [
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
          },
          {
            id: 'RTR002',
            name: 'Secondary Router - Mandalay',
            type: 'router',
            status: 'online',
            location: 'Mandalay Branch',
            uptime: '32 days, 8 hours',
            connected_users: 89,
            bandwidth: 67,
            last_seen: '2024-12-15 14:29'
          },
          {
            id: 'AP001',
            name: 'Access Point - Downtown',
            type: 'access_point',
            status: 'warning',
            location: 'Downtown Area',
            uptime: '12 days, 3 hours',
            connected_users: 45,
            bandwidth: 92,
            last_seen: '2024-12-15 14:25'
          }
        ],
        metrics: generateMockMetrics()
      })
    }

    return NextResponse.json({
      devices: devicesResult.data,
      metrics: metricsResult.data
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch network data' },
      { status: 500 }
    )
  }
}

function generateMockMetrics() {
  const now = new Date()
  const networkData = []
  const bandwidthData = []
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    networkData.push({
      time: `${time.getHours()}:00`,
      value: Math.floor(Math.random() * 20) + 70 + Math.sin(i / 4) * 10
    })
    bandwidthData.push({
      time: `${time.getHours()}:00`,
      value: Math.floor(Math.random() * 30) + 40 + Math.cos(i / 3) * 15
    })
  }
  
  return { networkData, bandwidthData }
}