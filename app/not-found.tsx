'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="w-24 h-24 bg-blue-600 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
          <Wifi className="w-12 h-12 text-white" />
        </div>

        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-2">
            The page you're looking for doesn't exist.
          </p>
          <p className="text-sm text-gray-500 font-myanmar">
            သင်ရှာနေသော စာမျက်နှာကို ရှာမတွေ့ပါ။
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/dashboard">
            <Button className="w-full flex items-center justify-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Need Help?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            If you believe this is an error, please contact our support team.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div>📧 support@ispcontrol.com</div>
            <div>📞 +95 9 123 456 789</div>
            <div className="font-myanmar">📞 +၉၅ ၉ ၁၂၃ ၄၅၆ ၇၈၉</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-400">
          <p>&copy; 2024 ISP Control Dashboard. All rights reserved.</p>
          <p className="font-myanmar">© ၂၀၂၄ ISP ထိန်းချုပ်မှုပြားကွက်။ မူပိုင်ခွင့်အားလုံးရရှိထားသည်။</p>
        </div>
      </div>
    </div>
  );
}