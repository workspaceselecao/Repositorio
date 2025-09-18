import { createClient } from '@supabase/supabase-js'

// Configuração simplificada e robusta
const supabaseUrl = 'https://qdzrldxubcofobqmynab.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w'

// Log apenas em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Supabase Client - Modo Desenvolvimento')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseAnonKey ? 'Definida' : 'Não definida')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})