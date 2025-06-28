// Backend API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mmlink-backend.onrender.com'

// API Client Class for Backend Integration
class APIClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.loadToken()
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`
      }

      console.log(`Making API request to: ${url}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error?.message || errorData.message || errorMessage
        } catch {
          // If not JSON, use the text as error message
          if (errorText) {
            errorMessage = errorText
          }
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log(`API response from ${endpoint}:`, data)
      return { data, error: null }
    } catch (error) {
      console.error('API Request Error:', error)
      
      let errorMessage = 'Unknown error occurred'
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout - please check your connection'
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to server - please check if the backend is running'
        } else {
          errorMessage = error.message
        }
      }
      
      return { 
        data: null, 
        error: errorMessage
      }
    }
  }

  // Health Check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string; environment: string }>('/api/health')
  }

  // User Management
  async getUsers(params: { limit?: number; offset?: number; platform?: string } = {}) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.append(key, value.toString())
    })
    
    return this.request<{
      users: Array<{
        id: string
        platform: string
        platformUserId: string
        username: string
        displayName: string
        phoneNumber: string | null
        languageCode: string
        isActive: boolean
        metadata: any
        createdAt: string
        updatedAt: string
      }>
      total: number
    }>(`/api/users?${query}`)
  }

  async getUser(id: string) {
    return this.request<{
      user: {
        id: string
        platform: string
        platformUserId: string
        username: string
        displayName: string
        phoneNumber: string | null
        languageCode: string
        isActive: boolean
        metadata: any
        createdAt: string
        updatedAt: string
      }
    }>(`/api/users/${id}`)
  }

  async createUser(userData: {
    platform: string
    platformUserId: string
    username: string
    displayName: string
    languageCode?: string
    metadata?: any
  }) {
    return this.request<{ user: any }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id: string, userData: Partial<{
    displayName: string
    isActive: boolean
    phoneNumber: string
    metadata: any
  }>) {
    return this.request<{ user: any }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  // Message Management
  async getMessages(params: { limit?: number } = {}) {
    const query = new URLSearchParams()
    if (params.limit) query.append('limit', params.limit.toString())
    
    return this.request<{
      messages: Array<{
        id: string
        userId: string
        platform: string
        messageType: string
        content: string
        mediaUrl: string | null
        metadata: any
        direction: 'in' | 'out'
        status: string
        createdAt: string
        user?: {
          id: string
          username: string
          displayName: string
          platform: string
        }
      }>
    }>(`/api/messages?${query}`)
  }

  async getUserMessages(userId: string, params: { limit?: number } = {}) {
    const query = new URLSearchParams()
    if (params.limit) query.append('limit', params.limit.toString())
    
    return this.request<{
      messages: Array<{
        id: string
        userId: string
        platform: string
        messageType: string
        content: string
        mediaUrl: string | null
        metadata: any
        direction: 'in' | 'out'
        status: string
        createdAt: string
      }>
    }>(`/api/messages/user/${userId}?${query}`)
  }

  async createMessage(messageData: {
    userId: string
    platform: string
    messageType: string
    content: string
    direction: 'in' | 'out'
    status: string
  }) {
    return this.request<{ message: any }>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  }

  // Bot Operations
  async broadcastMessage(data: {
    text: string
    platform?: string
  }) {
    return this.request<{
      success: boolean
      message: string
    }>('/api/bot/broadcast', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Statistics
  async getOverviewStats() {
    return this.request<{
      stats: {
        totalUsers: number
        messagesToday: number
        totalMessages: number
        activeSessions: number
        platforms: {
          viber: { users: number; percentage: number }
          telegram: { users: number; percentage: number }
        }
      }
    }>('/api/stats/overview')
  }

  // Webhook Management
  async setupWebhooks() {
    return this.request<{
      success: boolean
      results: {
        telegram: { success: boolean; url: string }
        viber: { success: boolean; url: string }
      }
    }>('/api/webhooks/setup', {
      method: 'POST',
    })
  }

  // Authentication
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }
}

// Create singleton instance
export const apiClient = new APIClient()

// ISP-specific data functions (mock data for ISP features)
export const getISPCustomers = async () => {
  // Mock ISP customer data since backend is for bot management
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
      },
      {
        id: 'CUST004',
        name: 'Ma Su Su',
        phone: '+95 9 777 888 999',
        email: 'susu@email.com',
        address: 'No.321, Bagan Street, Bagan',
        package: 'Premium 100Mbps',
        status: 'active',
        join_date: '2024-04-05',
        last_payment: '2024-12-01'
      },
      {
        id: 'CUST005',
        name: 'U Tun Tun',
        phone: '+95 9 444 555 666',
        email: 'tuntun@email.com',
        address: 'No.654, Mawlamyine Road, Mawlamyine',
        package: 'Standard 50Mbps',
        status: 'suspended',
        join_date: '2024-05-12',
        last_payment: '2024-11-20'
      }
    ],
    error: null
  }
}

export const getISPPayments = async () => {
  // Mock ISP payment data
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
        amount: 50000,
        method: 'kbz',
        status: 'failed',
        date: '2024-12-15 11:45',
        reference: 'KBZ-2024-004'
      },
      {
        id: 'TXN005',
        customer_name: 'U Tun Tun',
        amount: 35000,
        method: 'wave',
        status: 'completed',
        date: '2024-12-15 10:30',
        reference: 'WAVE-2024-005'
      }
    ],
    error: null
  }
}

export const getISPNetworkData = async () => {
  // Mock network data
  return {
    data: {
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
      metrics: {
        networkData: generateMockMetrics(),
        bandwidthData: generateMockMetrics()
      }
    },
    error: null
  }
}

function generateMockMetrics() {
  const now = new Date()
  const data = []
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: `${time.getHours()}:00`,
      value: Math.floor(Math.random() * 20) + 70 + Math.sin(i / 4) * 10
    })
  }
  
  return data
}

export default apiClient