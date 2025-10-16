/**
 * Resource Hints Component
 * Optimizes network connections for critical third-party resources
 * Improves connection establishment time
 */

export default function ResourceHints() {
  return (
    <>
      {/* Preconnect to critical origins - establishes connection early */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://connect.facebook.net" />

      {/* DNS prefetch for less critical resources */}
      <link rel="dns-prefetch" href="https://i.ytimg.com" />
      <link rel="dns-prefetch" href="https://www.youtube.com" />
      <link rel="dns-prefetch" href="https://static.doubleclick.net" />
      <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />

      {/* Preload critical CSS if any */}
      {/* Uncomment if you have critical CSS file */}
      {/* <link rel="preload" href="/styles/critical.css" as="style" /> */}
    </>
  )
}
