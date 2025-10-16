import type { Metadata } from "next";
import { defaultMetadata, createOrganizationSchema } from "@/lib/metadata";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Breadcrumbs from "./components/Breadcrumbs";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import ResourceHints from "@/components/ResourceHints";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = createOrganizationSchema();

  return (
    <html lang="es">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo-color.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-color.png" />

        {/* Resource Hints for Performance */}
        <ResourceHints />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-58VSTLZ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <noscript>
          <img
            height="1"
            width="1"
            style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=555544348819002&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Breadcrumbs />
        {children}
        <ThirdPartyScripts />
        <SpeedInsights />
      </body>
    </html>
  );
}
