"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Navigation from "./navigation"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Páginas que no necesitan el layout principal
  const publicPages = ["/login", "/register"]
  const isPublicPage = publicPages.includes(pathname)

  // Si es una página pública, renderizar solo el contenido sin layout
  if (isPublicPage) {
    return <>{children}</>
  }

  // Layout normal para páginas autenticadas
  return (
    <div className="min-h-screen bg-background transition-all duration-500 ease-in-out">
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background pt-16 lg:pt-0 lg:ml-64 transition-all duration-500 ease-in-out">
        <div className="w-full max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
