import './globals.css';
import { ConfirmProvider } from "@/components/ui/ConfirmProvider";
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/layout/Layout';

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
