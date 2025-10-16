'use client'

/**
 * Third Party Scripts Component
 * Loads analytics and tracking scripts after page interaction or after 5s
 * Improves Initial Load Performance significantly
 */

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function ThirdPartyScripts() {
  const [shouldLoadScripts, setShouldLoadScripts] = useState(false)

  useEffect(() => {
    // Load scripts after user interaction OR after 5 seconds
    const timeoutId = setTimeout(() => {
      setShouldLoadScripts(true)
    }, 5000)

    const handleInteraction = () => {
      setShouldLoadScripts(true)
      clearTimeout(timeoutId)
    }

    // Listen for any user interaction
    const events = ['mousedown', 'touchstart', 'keydown', 'scroll']
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true })
    })

    return () => {
      clearTimeout(timeoutId)
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction)
      })
    }
  }, [])

  if (!shouldLoadScripts) {
    return null
  }

  return (
    <>
      {/* Facebook Pixel */}
      <Script
        id="facebook-pixel"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '555544348819002');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-58VSTLZ');
          `,
        }}
      />

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-QV8Y7X4ZC2"
        strategy="lazyOnload"
      />
      <Script
        id="gtag-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QV8Y7X4ZC2', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
