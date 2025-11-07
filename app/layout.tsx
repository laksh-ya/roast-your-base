import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Roast Your Base - COC AI Roaster",
  description:
    "Get your Clash of Clans base absolutely destroyed by AI! The ultimate AI-powered COC base roasting experience.",
  keywords: ["Clash of Clans", "COC", "Base Roast", "AI", "Gemini", "Gaming"],
  authors: [
    { name: "Lakshya", url: "https://github.com/laksh-ya" },
    { name: "Harsh", url: "https://github.com/harshtripathi272" },
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "Roast Your Base - COC AI Roaster",
    description: "Get your Clash of Clans base absolutely destroyed by AI! 🔥",
    type: "website",
    images: [
      {
        url: "/icon-192.png",
        width: 192,
        height: 192,
        alt: "Roast Your Base - COC AI Roaster",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast Your Base - COC AI Roaster",
    description: "Get your Clash of Clans base absolutely destroyed by AI! 🔥",
    images: ["/icon-192.png"],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
