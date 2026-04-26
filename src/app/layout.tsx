import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://micaela-vulcano.com.ar"),
  title: {
    default: "Lic. Micaela Vulcano — Psicóloga | Terapia ACT Virtual",
    template: "%s | Lic. Micaela Vulcano",
  },
  description:
    "Psicóloga especializada en Terapia de Aceptación y Compromiso (ACT). Atención virtual para adolescentes y adultos. Sesiones online, seguras y con compromiso real.",
  keywords: [
    "psicóloga",
    "terapia ACT",
    "terapia online",
    "salud mental",
    "adolescentes",
    "adultos",
    "Micaela Vulcano",
    "aceptación y compromiso",
  ],
  authors: [{ name: "Lic. Micaela Vulcano" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Lic. Micaela Vulcano — Psicóloga",
    title: "Lic. Micaela Vulcano — Psicóloga | Terapia ACT Virtual",
    description:
      "Psicóloga especializada en Terapia de Aceptación y Compromiso (ACT). Atención virtual para adolescentes y adultos.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lic. Micaela Vulcano — Psicóloga",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lic. Micaela Vulcano — Psicóloga | Terapia ACT Virtual",
    description:
      "Psicóloga especializada en Terapia de Aceptación y Compromiso (ACT). Atención virtual.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-warm-50 text-warm-900">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
