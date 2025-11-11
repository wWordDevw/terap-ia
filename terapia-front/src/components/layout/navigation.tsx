"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, UsersRound, UserCog, LogOut, Menu, X, FileText } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/providers/toast-provider"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Pacientes",
    href: "/pacientes",
    icon: Users,
  },
  {
    name: "Grupos",
    href: "/grupos",
    icon: UsersRound,
  },
  {
    name: "Actividades",
    href: "/actividades",
    icon: FileText,
  },
  {
    name: "Usuarios",
    href: "/usuarios",
    icon: UserCog,
    adminOnly: true,
  },
]

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuthStore()
  const { addToast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const handleLogout = async () => {
    try {
      await logout()
      addToast('Sesión cerrada exitosamente', 'success')
      router.push("/login")
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      addToast('Error al cerrar sesión', 'error')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-sidebar border-b z-50 flex items-center justify-between px-4 transition-all duration-500 ease-in-out">
        <div>
          <h1 className="text-lg font-semibold text-sidebar-foreground">Sistema Terapéutico</h1>
          <p className="text-xs text-muted-foreground">Gestión Clínica</p>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-sidebar-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-sidebar-foreground" />
          )}
        </button>
      </header>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop always visible, Mobile slides in */}
      <aside
        className={cn(
          "fixed top-0 h-screen w-64 glass-sidebar flex flex-col z-50 transition-all duration-500 ease-in-out",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          isMobile && "lg:top-16"
        )}
        style={{
          top: isMobile ? "0" : undefined,
        }}
      >
        {/* Desktop Header */}
        <div className="hidden lg:block p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-semibold text-sidebar-foreground">Sistema Terapéutico</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestión Clínica</p>
        </div>

        {/* Mobile Header (inside sidebar) */}
        <div className="lg:hidden p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-sidebar-foreground">Sistema Terapéutico</h1>
              <p className="text-sm text-muted-foreground mt-1">Gestión Clínica</p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="h-6 w-6 text-sidebar-foreground" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems
            .filter((item) => !item.adminOnly || user?.role === 'admin')
            .map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
        </nav>

        {/* User Info */}
        {user && (
          <div className="p-4 border-t border-sidebar-border space-y-3">
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}
