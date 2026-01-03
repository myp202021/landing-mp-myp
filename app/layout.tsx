import type { Metadata } from "next";
import Script from "next/script";
import { defaultMetadata, createOrganizationSchema } from "@/lib/metadata";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Breadcrumbs from "./components/Breadcrumbs";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import ResourceHints from "@/components/ResourceHints";
import ChatBotWrapper from "@/components/ChatBot/ChatBotWrapper";
import PopupBalance2025 from "@/components/PopupBalance2025";
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

        {/* Google Ads Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17056298226"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17056298226');
          `}
        </Script>
      </head>
      <body>
        <Breadcrumbs />
        {children}
        <PopupBalance2025 />
        <ChatBotWrapper />
        <ThirdPartyScripts />
        <SpeedInsights />
      </body>
    </html>
  );
}
