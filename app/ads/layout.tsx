import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ResourceHints from "@/components/ResourceHints";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import "../globals.css";

export const metadata: Metadata = {
  title: 'Agencia de Marketing Digital y Performance | Muller y Pérez',
  description: 'Agencia de marketing digital en Chile. Equipo dedicado, métricas de negocio reales, sin contrato de permanencia.',
};

export default function AdsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ThirdPartyScripts />
      <SpeedInsights />
    </>
  );
}
