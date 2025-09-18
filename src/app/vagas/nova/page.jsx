'use client'

import DashboardLayout from '../../../components/DashboardLayout'

export default function NovaVagaPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Nova Vaga
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <p className="text-gray-600">Formulário de nova vaga em desenvolvimento...</p>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}