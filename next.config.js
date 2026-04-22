/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO & Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
    ],
  },

  // Headers for security, SEO and cache
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      // Cache static assets aggressively
      {
        source: '/logo-color.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache CSS and JS
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects for URL changes
  async redirects() {
    return [
      // ========================================
      // Query param redirects moved to middleware.ts
      // (page_id, trk, p, m, cat, s, layout_sidebar)
      // middleware strips params and does 301
      // ========================================

      // ========================================
      // Old URLs
      // ========================================
      {
        source: '/predictor-unicornio',
        destination: '/predictor',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/crm/login',
        permanent: true,
      },
      // ========================================
      // 404 & redirect error fixes — GSC marzo 2026
      // ========================================
      {
        source: '/labs/predictor-google-ads',
        destination: '/predictor',
        permanent: true,
      },
      {
        source: '/portafolio',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/comparativa',
        destination: '/comparativa-agencias-marketing-digital-chile',
        permanent: true,
      },
      {
        source: '/blog/tiktok-ads-agencia-marketing-digital-chile-2025-2',
        destination: '/blog/tiktok-ads-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/contacto',
        destination: '/#contacto',
        permanent: true,
      },
      {
        source: '/contacto/',
        destination: '/#contacto',
        permanent: true,
      },
      {
        source: '/privacidad',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/terminos',
        destination: '/conditions',
        permanent: true,
      },
      {
        source: '/blog/cuanto-cuesta-agencia-marketing-digital-chile-2025',
        destination: '/cuanto-cuesta-agencia-marketing-digital-chile',
        permanent: true,
      },
      {
        source: '/blog/estudio-performance-marketing-chile-2026',
        destination: '/investigacion/estudio-performance-marketing-chile-2026',
        permanent: true,
      },
      // ========================================
      // Industry page redirects (old /industrias/ URLs)
      // ========================================
      {
        source: '/industrias/ecommerce',
        destination: '/marketing-digital-ecommerce-chile',
        permanent: true,
      },
      {
        source: '/industrias/tecnologia-saas',
        destination: '/marketing-digital-saas-chile',
        permanent: true,
      },
      // ========================================
      // Radar/Clipping → Copilot (abril 2026)
      // ========================================
      {
        source: '/clipping',
        destination: '/copilot',
        permanent: true,
      },
      {
        source: '/clipping/:path*',
        destination: '/copilot/:path*',
        permanent: true,
      },
      {
        source: '/radar/:id((?!industrias).*)',
        destination: '/copilot/dashboard/:id',
        permanent: true,
      },
      // ========================================
      // Trailing slash fixes
      // ========================================
      {
        source: '/labs/',
        destination: '/labs',
        permanent: true,
      },
      {
        source: '/predictor/',
        destination: '/predictor',
        permanent: true,
      },
      {
        source: '/blog/',
        destination: '/blog',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
