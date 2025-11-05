import type React from "next"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./global.css"
import AppShell from "@/components/layout/app-shell"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ToastProvider } from "@/components/providers/toast-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Gestión Terapéutica",
  description: "Aplicación para la gestión de grupos terapéuticos PHP/IOP, pacientes y documentación clínica",
  keywords: ["terapia", "PHP", "IOP", "salud mental", "gestión clínica"],
  authors: [{ name: "Sistema Terapéutico" }],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          enableColorScheme
        >
          <ToastProvider>
            <AuthProvider>
              <AppShell>{children}</AppShell>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
