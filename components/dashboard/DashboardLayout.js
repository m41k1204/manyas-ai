'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardLayout({ children, role }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user && user.role !== role) {
      router.push(`/dashboard/${user.role}`)
    }
  }, [user, loading, role, router])

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user || user.role !== role) {
    return null
  }

  const isCreator = role === 'creator'
  const dashboardPath = `/dashboard/${role}`

  const isActive = (path) => pathname === path

  const navLinks = isCreator ? [
    { href: dashboardPath, label: 'Inicio', icon: '🏠' },
    { href: `${dashboardPath}/portfolio`, label: 'Portafolio', icon: '📁' },
    { href: `${dashboardPath}/jobs`, label: 'Ofertas', icon: '💼' },
    { href: `${dashboardPath}/applications`, label: 'Aplicaciones', icon: '📝' },
    { href: `${dashboardPath}/profile`, label: 'Perfil', icon: '👤' },
  ] : [
    { href: dashboardPath, label: 'Inicio', icon: '🏠' },
    { href: `${dashboardPath}/jobs`, label: 'Ofertas', icon: '💼' },
    { href: `${dashboardPath}/creators`, label: 'Creadores', icon: '🎨' },
    { href: `${dashboardPath}/profile`, label: 'Perfil', icon: '🏢' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary-600">Manyas AI</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  {isCreator ? 'Panel de Creador' : 'Panel de Empresa'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-sm sm:text-base text-gray-700 hidden sm:inline truncate max-w-[150px]">{user.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">Salir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-4 px-1 border-b-2 font-medium transition ${
                    isActive(link.href)
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-primary-600">Manyas AI</h2>
                  <p className="text-xs text-gray-600">
                    {isCreator ? 'Panel de Creador' : 'Panel de Empresa'}
                  </p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-gray-700 mb-4 truncate">{user.name}</p>
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive(link.href)
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  )
}
