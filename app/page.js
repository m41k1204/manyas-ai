'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'creator') {
        router.push('/dashboard/creator')
      } else if (user.role === 'company') {
        router.push('/dashboard/company')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold text-primary-600">Manyas AI</div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="text-gray-700 hover:text-primary-600 transition text-sm sm:text-base">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="bg-primary-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-primary-700 transition text-sm sm:text-base">
              Registrarse
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Conecta Marcas y Creadores
            <br />
            <span className="text-primary-600">en Latinoamérica</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-10 max-w-3xl mx-auto px-4">
            Manyas AI es el primer marketplace de User Generated Content (UGC) con inteligencia artificial
            entrenada para entender el lenguaje, las tendencias y la cultura de los consumidores latinoamericanos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Link href="/register?role=creator" className="bg-primary-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-primary-700 transition shadow-lg">
              Soy Creador
            </Link>
            <Link href="/register?role=company" className="bg-secondary-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-secondary-700 transition shadow-lg">
              Soy Empresa
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 sm:mt-24 lg:mt-32 grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Para Empresas</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Publica ofertas de trabajo, encuentra creadores de contenido talentosos y gestiona proyectos UGC de forma eficiente.
            </p>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎨</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Para Creadores</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Muestra tu portafolio, aplica a proyectos que se ajusten a tu perfil y conecta con marcas de Latinoamérica.
            </p>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg sm:col-span-2 md:col-span-1">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🤖</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">IA Contextual</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Matching inteligente entre marcas y creadores basado en IA entrenada con contexto cultural latinoamericano.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 sm:mt-20 py-6 sm:py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p className="text-sm sm:text-base">&copy; 2025 Manyas AI. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
