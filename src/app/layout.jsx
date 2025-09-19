import './globals.css'
import { AuthProvider  } from '../contexts/AuthContext'
import { DataProvider  } from '../contexts/DataContext'
import { ErrorBoundary  } from '../components/ErrorBoundary'
import { EnvironmentCheck  } from '../components/EnvironmentCheck'
import NavigationDebug from '../components/NavigationDebug'
import { FocusProvider, FocusIndicator } from '../components/FocusManager'
import { ThemeProvider } from '../components/ui/theme-provider'
import { Toaster } from '../components/ui/toaster'

export const metadata = {
  title: 'Repositório de Vagas',
  description: 'Sistema de comparação de vagas de emprego',
  manifest: '/manifest.json',
  themeColor: '#2563eb',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Repositório de Vagas'
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml'
  }
}

export default function RootLayout({
  children
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <EnvironmentCheck>
              <FocusProvider>
                <AuthProvider>
                  <DataProvider>
                    {children}
                    <NavigationDebug />
                    <FocusIndicator />
                    <Toaster />
                  </DataProvider>
                </AuthProvider>
              </FocusProvider>
            </EnvironmentCheck>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}