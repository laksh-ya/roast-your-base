import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Roast Your Base',
  description: 'Roast your COC Base!!',
  generator: 'lakshya',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
