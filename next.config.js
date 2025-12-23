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
      // WordPress legacy URLs (cleanup for SEO)
      // ========================================
      {
        source: '/',
        has: [{ type: 'query', key: 'page_id' }],
        destination: '/',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'm' }],
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'trk' }],
        destination: '/',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'p' }],
        destination: '/',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'cat' }],
        destination: '/blog',
        permanent: true,
      },
      // ========================================
      // Old URLs
      // ========================================
      {
        source: '/predictor-unicornio',
        destination: '/predictor',
        permanent: true,
      },
      // Fix 404s
      {
        source: '/login',
        destination: '/crm/login',
        permanent: true,
      },
      {
        source: '/recursos',
        destination: '/recursos/ebook-marketing-datos-2025',
        permanent: false, // temporary until we create recursos hub page
      },
      {
        source: '/contacto',
        destination: '/#contact',
        permanent: true,
      },
      {
        source: '/contacto/',
        destination: '/#contact',
        permanent: true,
      },
      {
        source: '/blog/cuanto-cuesta-agencia-marketing-digital-chile-2025',
        destination: '/blog',
        permanent: false, // temporary, could create this blog post later
      },
      {
        source: '/privacidad',
        destination: '/#contact', // or create a privacy page
        permanent: false,
      },
      {
        source: '/terminos',
        destination: '/#contact', // or create a terms page
        permanent: false,
      },
      // Fix trailing slashes
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
    ]
  }
}

module.exports = nextConfig
