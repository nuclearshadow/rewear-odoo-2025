// src/app/layout.tsx or src/app/providers.tsx (if separate)
import { ToastProvider } from '@/components/ui/ToastProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
        <ToastProvider>
          {children}
        </ToastProvider>
 
  )
}