'use client'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center">
          Repositório de Vagas
        </h1>
        <p className="text-center mt-4 text-gray-600">
          Sistema de comparação de vagas de emprego
        </p>
        <div className="text-center mt-8">
          <a 
            href="/login" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Entrar
          </a>
        </div>
      </div>
    </main>
  )
}