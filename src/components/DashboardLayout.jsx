'use client'

import Sidebar from './Sidebar'
import InstallPWA from './InstallPWA'
import OfflineIndicator from './OfflineIndicator'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <InstallPWA />
      <OfflineIndicator />
    </div>
  )
}