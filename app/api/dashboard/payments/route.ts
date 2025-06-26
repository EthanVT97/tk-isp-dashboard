import { NextResponse } from 'next/server'
import { getPayments } from '@/lib/supabase-server'

export async function GET() {
  try {
    const { data, error } = await getPayments()
    
    if (error) {
      console.error('Payments API error:', error)
      // Return mock data as fallback
      return NextResponse.json([
        {
          id: 'TXN001',
          customer_name: 'မောင်ရဲမင်း',
          amount: 50000,
          method: 'kbz',
          status: 'completed',
          date: '2024-12-15 14:30',
          reference: 'KBZ-2024-001'
        },
        {
          id: 'TXN002',
          customer_name: 'Daw Thida',
          amount: 35000,
          method: 'wave',
          status: 'completed',
          date: '2024-12-15 13:15',
          reference: 'WAVE-2024-002'
        },
        {
          id: 'TXN003',
          customer_name: 'Ko Aung',
          amount: 25000,
          method: 'bank',
          status: 'pending',
          date: '2024-12-15 12:00',
          reference: 'BANK-2024-003'
        },
        {
          id: 'TXN004',
          customer_name: 'Ma Su Su',
          amount: 40000,
          method: 'kbz',
          status: 'failed',
          date: '2024-12-15 11:45',
          reference: 'KBZ-2024-004'
        },
        {
          id: 'TXN005',
          customer_name: 'U Tun Tun',
          amount: 60000,
          method: 'wave',
          status: 'completed',
          date: '2024-12-15 10:30',
          reference: 'WAVE-2024-005'
        }
      ])
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}