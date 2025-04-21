import type { Metadata } from 'next'
import '@/styles/globals.css'
import '@/styles/themes.css'
import { Geist, Geist_Mono } from 'next/font/google'
import ThemeProvider from '@/components/providers/theme-provider'
import ToasterProvider from '@/components/providers/toaster-provider'
import { AuthProvider } from '@/hooks/use-auth'
import { PermissionProvider } from '@/hooks/use-permission'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Makera Community',
  description: 'A community platform for makers and creators'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="theme-violet" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <PermissionProvider>
              {children}
              <Toaster />
              <ToasterProvider />
            </PermissionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
