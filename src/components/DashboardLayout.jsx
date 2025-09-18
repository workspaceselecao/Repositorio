'use client'

import { ProtectedRoute  } from './ProtectedRoute'
import Sidebar from './Sidebar'
import InstallPWA from './InstallPWA'
import OfflineIndicator from './OfflineIndicator'



export default function DashboardLayout({ children, requiredRole }) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <InstallPWA />
      <OfflineIndicator />
    </ProtectedRoute>
  )
}