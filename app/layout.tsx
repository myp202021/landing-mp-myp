import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muller y Pérez - Marketing & Performance",
  description: "Performance Marketing con Datos Reales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
