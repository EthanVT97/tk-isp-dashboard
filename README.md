# ISP Business Control Dashboard

A comprehensive ISP (Internet Service Provider) management platform built with Next.js 14, featuring customer management, payment processing, network monitoring, and Viber bot integration.

## 🚀 Features

### Core Functionality
- **Dashboard Overview**: Real-time statistics and analytics
- **Customer Management**: Complete customer lifecycle management
- **Payment Processing**: Multi-method payment tracking (KBZ Pay, Wave Pay, Bank Transfer)
- **Network Monitoring**: Real-time network device monitoring and performance metrics
- **Viber Bot Integration**: Automated customer support with message management
- **Multi-language Support**: English and Myanmar (Burmese) languages

### Technical Features
- **Modern Stack**: Next.js 14 with App Router, TypeScript, TailwindCSS
- **Database**: Supabase/PostgreSQL with real-time subscriptions
- **Authentication**: Secure user authentication with Supabase Auth
- **Responsive Design**: Mobile-first responsive design
- **Error Handling**: Comprehensive error boundaries and fallback UI
- **Loading States**: Skeleton loading and progressive enhancement
- **API Integration**: RESTful API with proper error handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, Radix UI Components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **State Management**: React Context API
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd isp-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Create the following tables in your Supabase database:

   ```sql
   -- Customers table
   CREATE TABLE customers (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     phone TEXT NOT NULL,
     email TEXT NOT NULL,
     address TEXT NOT NULL,
     package TEXT NOT NULL,
     status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
     join_date DATE NOT NULL,
     last_payment DATE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Payments table
   CREATE TABLE payments (
     id TEXT PRIMARY KEY,
     customer_id TEXT REFERENCES customers(id),
     customer_name TEXT NOT NULL,
     amount INTEGER NOT NULL,
     method TEXT CHECK (method IN ('kbz', 'wave', 'bank')) NOT NULL,
     status TEXT CHECK (status IN ('completed', 'pending', 'failed')) DEFAULT 'pending',
     date TIMESTAMP WITH TIME ZONE NOT NULL,
     reference TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Network devices table
   CREATE TABLE network_devices (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     type TEXT CHECK (type IN ('router', 'switch', 'access_point')) NOT NULL,
     status TEXT CHECK (status IN ('online', 'offline', 'warning')) DEFAULT 'offline',
     location TEXT NOT NULL,
     uptime TEXT,
     connected_users INTEGER DEFAULT 0,
     bandwidth INTEGER DEFAULT 0,
     last_seen TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Network metrics table
   CREATE TABLE network_metrics (
     id SERIAL PRIMARY KEY,
     timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
     bandwidth_usage INTEGER NOT NULL,
     network_performance INTEGER NOT NULL,
     active_connections INTEGER NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   └── dashboard/     # Dashboard API endpoints
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable components
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/           # Layout components
│   └── ui/               # UI components (shadcn/ui)
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── contexts/         # React contexts
│   ├── supabase.ts       # Supabase client and utilities
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Set up the database schema using the SQL provided above
3. Configure Row Level Security (RLS) policies as needed
4. Add your Supabase URL and anon key to `.env.local`

### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: (Optional) For server-side operations

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify Deployment

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Configure environment variables

## 📱 Features Overview

### Dashboard
- Real-time statistics display
- Network performance charts
- Recent activity feed
- Top packages analytics

### Customer Management
- Customer listing with search and filters
- Customer profile management
- Package assignment and status tracking
- Payment history per customer

### Payment Processing
- Multi-method payment support (KBZ Pay, Wave Pay, Bank Transfer)
- Transaction history and status tracking
- Revenue analytics and reporting
- Payment method statistics

### Network Monitoring
- Real-time device status monitoring
- Bandwidth usage tracking
- Network performance metrics
- Device configuration management

### Viber Bot Integration
- Automated message responses
- Customer inquiry management
- Response templates
- Performance analytics

## 🌐 Multi-language Support

The application supports:
- **English**: Default language
- **Myanmar (Burmese)**: Full translation support

Language switching is available in the sidebar navigation.

## 🔒 Security Features

- **Authentication**: Secure user authentication with Supabase
- **Authorization**: Role-based access control
- **Input Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error boundaries
- **CSRF Protection**: Built-in Next.js CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: admin@ispcontrol.com
- Phone: +95 9 123 456 789

## 🔄 Version History

- **v2.0.1**: Current version with full API integration
- **v2.0.0**: Major update with Supabase integration
- **v1.0.0**: Initial release with static data

---

Built with ❤️ for ISP businesses in Myanmar and beyond.