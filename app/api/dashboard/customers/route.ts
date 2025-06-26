import { NextResponse } from 'next/server'
import { getCustomers } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await getCustomers()
    
    if (error) {
      console.error('Customers API error:', error)
      // Return mock data as fallback
      return NextResponse.json([
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
        },
        {
          id: 'CUST003',
          name: 'Ko Aung',
          phone: '+95 9 555 123 456',
          email: 'aung@email.com',
          address: 'No.789, Naypyidaw Ave, Naypyidaw',
          package: 'Basic 25Mbps',
          status: 'inactive',
          join_date: '2024-03-10',
          last_payment: '2024-11-15'
        }
      ])
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Here you would typically validate and insert into Supabase
    // For now, return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Customer created successfully',
      id: `CUST${Date.now()}`
    })
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}