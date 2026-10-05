import './globals.css';
import { ConfirmProvider } from "@/components/ui/ConfirmProvider";
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/layout/Layout';

export const metadata = {
  title: '2Crown Clothing & Printing',
  description: 'Premium custom clothing and printing services in Nigeria',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ConfirmProvider>
          <Toaster position="top-right" />
          {children}
        </ConfirmProvider>
      </body>
    </html>
  )
}
