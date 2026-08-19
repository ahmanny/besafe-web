import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/providers/QueryProvider"
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "BeSafe Agency Command — Emergency Dispatch & Response Portal",
  description:
    "Real-time threat triage, high-speed SOS dispatch, anonymous citizen reports, and tactical agency command center.",
  keywords: ["emergency response", "safety app", "threat detection", "dispatch command center", "safe chat"],
  authors: [{ name: "BeSafe Command Team" }],
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
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                background: "#0F172A",
                border: "1px solid #1E293B",
                color: "#F8FAFC",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  )
}
