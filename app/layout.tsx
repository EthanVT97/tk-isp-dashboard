import './globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_Myanmar } from 'next/font/google';
import { LanguageProvider } from '@/lib/contexts/language-context';
import { ToastProvider } from '@/lib/contexts/toast-context';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const notoSansMyanmar = Noto_Sans_Myanmar({ 
  subsets: ['myanmar'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-myanmar'
});

export const metadata: Metadata = {
  title: 'ISP Business Control Dashboard',
  description: 'Professional ISP management platform with Viber bot integration and payment processing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansMyanmar.variable} font-sans antialiased`}>
        <LanguageProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}