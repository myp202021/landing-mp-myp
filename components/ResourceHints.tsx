/**
 * Resource Hints Component
 * Optimizes network connections for critical third-party resources
 * Improves connection establishment time
 */

export default function ResourceHints() {
  return (
    <>
      {/* Preconnect to critical origins with crossorigin */}
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />

      {/* DNS prefetch for less critical resources */}
      <link rel="dns-prefetch" href="https://i.ytimg.com" />
      <link rel="dns-prefetch" href="https://www.youtube.com" />
      <link rel="dns-prefetch" href="https://static.doubleclick.net" />
      <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />
    </>
  )
}
