import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock Viber bot data
    const mockMessages = [
      {
        id: 'MSG001',
        customer_name: 'မောင်ရဲမင်း',
        message: 'ကျွန်တော့်အင်တာနက်နှေးနေပါတယ်။ ဘာလုပ်ရမလဲ?',
        response: 'သင့်အင်တာနက်ပြဿနာအတွက် စိတ်မကောင်းပါဘူး။ Router ကို restart လုပ်ကြည့်ပါ။',
        timestamp: '2024-12-15 14:30',
        status: 'responded',
        is_auto_response: true
      },
      {
        id: 'MSG002',
        customer_name: 'Daw Thida',
        message: 'How can I upgrade my internet package?',
        response: 'You can upgrade your package through our website or call our customer service.',
        timestamp: '2024-12-15 13:45',
        status: 'responded',
        is_auto_response: true
      },
      {
        id: 'MSG003',
        customer_name: 'Ko Aung',
        message: 'ငွေပေးချေမှုအတွက် ဘယ်လိုလုပ်ရမလဲ?',
        response: '',
        timestamp: '2024-12-15 13:20',
        status: 'pending',
        is_auto_response: false
      }
    ]

    const mockStats = {
      total_messages: 1247,
      auto_responses: 892,
      manual_responses: 355,
      response_time: 2.3,
      satisfaction: 4.2
    }

    return NextResponse.json({
      messages: mockMessages,
      stats: mockStats
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Viber data' },
      { status: 500 }
    )
  }
}