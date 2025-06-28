import './globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/contexts/language-context';
import { ToastProvider } from '@/lib/contexts/toast-context';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Myanmar:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}