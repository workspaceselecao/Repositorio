/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações de produção
  swcMinify: true,
  
  
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