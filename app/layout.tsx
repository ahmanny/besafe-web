import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/providers/QueryProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "BeSafe — Modern Emergency Response & Safe Reporting Platform",
  description:
    "Real-time threat detection, discreet SOS triggers, anonymous Safe Chat reporting, and intelligent emergency agency dispatching.",
  keywords: ["emergency response", "safety app", "threat detection", "dispatch command center", "safe chat"],
  authors: [{ name: "BeSafe Team" }],
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] antialiased selection:bg-[var(--primary)] selection:text-white">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
