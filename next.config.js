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
      {
        source: '/industrias/b2b-servicios',
        destination: '/marketing-digital-b2b-chile',
        permanent: true,
      },
      // ========================================
      // Blog -2026 → -2025 redirects — GSC agosto 2026
      // (posts generados con año incorrecto, redirigir a versión real)
      // ========================================
      {
        source: '/blog/inbound-marketing-agencia-marketing-digital-chile-2026',
        destination: '/blog/inbound-marketing-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/marketing-inmobiliario-agencia-marketing-digital-chile-2026',
        destination: '/blog/marketing-inmobiliario-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/retargeting-agencia-marketing-digital-chile-2026',
        destination: '/blog/retargeting-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/email-marketing-agencia-marketing-digital-chile-2026',
        destination: '/blog/email-marketing-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/tiktok-ads-agencia-marketing-digital-chile-2026',
        destination: '/blog/tiktok-ads-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/seo-ia-agencia-marketing-digital-chile-2026',
        destination: '/blog/seo-ia-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/roi-roas-agencia-marketing-digital-chile-2026',
        destination: '/blog/roi-roas-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/marketing-contenidos-agencia-marketing-digital-chile-2026',
        destination: '/blog/marketing-contenidos-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/seo-agencia-marketing-digital-chile-2026',
        destination: '/blog/seo-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/marketing-automation-agencia-marketing-digital-chile-2026',
        destination: '/blog/marketing-automation-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/marketing-salud-agencia-marketing-digital-chile-2026',
        destination: '/blog/marketing-salud-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/marketing-b2b-agencia-marketing-digital-chile-2026',
        destination: '/blog/marketing-b2b-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/youtube-ads-agencia-marketing-digital-chile-2026',
        destination: '/blog/youtube-ads-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/customer-journey-agencia-marketing-digital-chile-2026',
        destination: '/blog/customer-journey-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/email-marketing-ia-agencia-marketing-digital-chile-2026',
        destination: '/blog/email-marketing-ia-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/dashboards-agencia-marketing-digital-chile-2026',
        destination: '/blog/dashboards-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/marketing-saas-agencia-marketing-digital-chile-2026',
        destination: '/blog/marketing-saas-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/benchmarking-agencia-marketing-digital-chile-2026',
        destination: '/blog/benchmarking-agencia-marketing-digital-chile-2025',
        permanent: true,
      },
      {
        source: '/blog/google-ads-vs-seo-chile-2026',
        destination: '/blog/google-ads-vs-seo-chile-2025',
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
