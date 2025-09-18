/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações de produção
  swcMinify: true,
  
  // Configuração de variáveis de ambiente
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qdzrldxubcofobqmynab.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://repositoriodevagas.vercel.app',
  },
  
  
  // Configuração de headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Configuração de imagens
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuração experimental (compatível com Next.js 14)
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
  },
}

module.exports = nextConfig