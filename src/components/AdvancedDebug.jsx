'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function AdvancedDebug() {
  const [debugInfo, setDebugInfo] = useState({})
  const [isClient, setIsClient] = useState(false)
  const [testResults, setTestResults] = useState({})
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Coletar informações detalhadas
    const info = {
      // Variáveis de ambiente
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      nodeEnv: process.env.NODE_ENV,
      
      // Informações do navegador
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
      origin: typeof window !== 'undefined' ? window.location.origin : 'N/A',
      href: typeof window !== 'undefined' ? window.location.href : 'N/A',
      
      // Informações do Supabase
      supabaseUrlFromClient: supabase.supabaseUrl,
      supabaseKeyFromClient: supabase.supabaseKey ? 'Definida' : 'Não definida',
      
      // Timestamp
      timestamp: new Date().toISOString()
    }
    
    setDebugInfo(info)
  }, [])

  const runAdvancedTest = async () => {
    setIsTesting(true)
    const results = {}
    
    try {
      // Teste 1: Verificar configuração do cliente
      console.log('🔍 Teste 1: Configuração do Cliente')
      results.clientConfig = {
        url: supabase.supabaseUrl,
        key: supabase.supabaseKey ? 'Definida' : 'Não definida',
        status: supabase.supabaseUrl && supabase.supabaseKey ? 'OK' : 'ERRO'
      }
      
      // Teste 2: Verificar sessão atual
      console.log('🔍 Teste 2: Sessão Atual')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      results.currentSession = {
        hasSession: !!session,
        error: sessionError?.message || null,
        status: sessionError ? 'ERRO' : 'OK'
      }
      
      // Teste 3: Tentar login
      console.log('🔍 Teste 3: Login')
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'roberio.gomes@atento.com',
        password: 'admin123'
      })
      
      results.login = {
        success: !loginError,
        error: loginError?.message || null,
        status: loginError ? 'ERRO' : 'OK',
        userId: loginData?.user?.id || null
      }
      
      // Teste 4: Verificar se consegue acessar dados
      if (!loginError) {
        console.log('🔍 Teste 4: Acesso a Dados')
        const { data: vagas, error: vagasError } = await supabase
          .from('vagas')
          .select('*')
          .limit(1)
        
        results.dataAccess = {
          success: !vagasError,
          error: vagasError?.message || null,
          status: vagasError ? 'ERRO' : 'OK',
          count: vagas?.length || 0
        }
        
        // Fazer logout
        await supabase.auth.signOut()
      }
      
      // Teste 5: Verificar headers da requisição
      console.log('🔍 Teste 5: Headers da Requisição')
      try {
        const response = await fetch(`${supabase.supabaseUrl}/rest/v1/`, {
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json'
          }
        })
        
        results.headers = {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        }
      } catch (headerError) {
        results.headers = {
          error: headerError.message,
          status: 'ERRO'
        }
      }
      
    } catch (error) {
      results.generalError = error.message
    } finally {
      setIsTesting(false)
    }
    
    setTestResults(results)
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">🔧 Debug Avançado</h3>
      
      <div className="space-y-2 text-xs">
        <div className="font-semibold">📋 Informações do Sistema:</div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Supabase URL:</span>
            <span className={debugInfo.supabaseUrl ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.supabaseUrl ? '✅' : '❌'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Supabase Key:</span>
            <span className={debugInfo.supabaseKey ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.supabaseKey ? '✅' : '❌'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>App URL:</span>
            <span className={debugInfo.appUrl ? 'text-green-600' : 'text-yellow-600'}>
              {debugInfo.appUrl ? '✅' : '⚠️'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Node ENV:</span>
            <span className="text-blue-600">{debugInfo.nodeEnv || 'undefined'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Origin:</span>
            <span className="text-blue-600">{debugInfo.origin}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <button
            onClick={runAdvancedTest}
            disabled={isTesting}
            className="w-full bg-purple-500 text-white text-xs px-2 py-1 rounded hover:bg-purple-600 disabled:bg-gray-400"
          >
            {isTesting ? 'Testando...' : 'Teste Avançado'}
          </button>
        </div>
        
        {Object.keys(testResults).length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <div className="font-semibold">🧪 Resultados dos Testes:</div>
            <div className="space-y-1">
              {Object.entries(testResults).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}:</span>
                  <span className={value.status === 'OK' ? 'text-green-600' : 'text-red-600'}>
                    {value.status || (value.success ? '✅' : '❌')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <div>Timestamp: {debugInfo.timestamp}</div>
            <div>User Agent: {debugInfo.userAgent?.substring(0, 50)}...</div>
          </div>
        </div>
      </div>
    </div>
  )
}
