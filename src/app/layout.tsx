import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FBPixel } from "@/components/FBPixel";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sitemauro.vercel.app'),
  title: "Mauro Consultor | Projetos e Orientação para Construir",
  description: "Encontre o projeto certo para o seu momento com a  orientação de quem entende de financiamento, terreno e obra.",
  verification: {
    other: {
      "facebook-domain-verification": "7veh9tixjfyt61h8s20n063kgasfwi",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className={`${inter.className} min-h-full flex flex-col`} suppressHydrationWarning>
        <Suspense fallback={null}>
          <FBPixel />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
