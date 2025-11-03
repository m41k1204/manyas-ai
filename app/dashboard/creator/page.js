'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import api from '@/lib/api'
import Link from 'next/link'

export default function CreatorDashboard() {
  const [stats, setStats] = useState({
    applications: 0,
    portfolioItems: 0,
  })
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [applicationsRes, portfolioRes, jobsRes] = await Promise.all([
        api.get('/applications/me'),
        api.get('/creators/portfolio/me'),
        api.get('/jobs?status=open'),
      ])

      setStats({
        applications: applicationsRes.data.length,
        portfolioItems: portfolioRes.data.length,
      })

      setRecentJobs(jobsRes.data.slice(0, 5))
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="creator">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="creator">
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">¡Bienvenido de vuelta!</h2>
          <p className="text-primary-100 text-sm sm:text-base">
            Explora nuevas oportunidades y gestiona tu portafolio
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Aplicaciones Activas</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.applications}</p>
              </div>
              <div className="bg-primary-100 p-3 sm:p-4 rounded-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Items en Portafolio</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.portfolioItems}</p>
              </div>
              <div className="bg-secondary-100 p-3 sm:p-4 rounded-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Ofertas Recientes</h3>
              <Link href="/dashboard/creator/jobs" className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base">
                Ver todas →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentJobs.length === 0 ? (
              <div className="p-4 sm:p-6 text-center text-gray-500">
                No hay ofertas disponibles en este momento
              </div>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="p-4 sm:p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                    <div className="flex-1 w-full sm:w-auto">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">{job.company_name}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
                        {job.category_name && (
                          <span className="bg-primary-100 text-primary-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                            {job.category_name}
                          </span>
                        )}
                        {job.budget && (
                          <span className="text-gray-600 text-xs sm:text-sm">
                            Presupuesto: ${job.budget}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/creator/jobs/${job.id}`}
                      className="w-full sm:w-auto text-center bg-primary-600 text-white px-4 sm:px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link
            href="/dashboard/creator/portfolio"
            className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="text-primary-600 mb-3">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">Agregar al Portafolio</h4>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">Sube tus mejores trabajos</p>
          </Link>

          <Link
            href="/dashboard/creator/jobs"
            className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="text-secondary-600 mb-3">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">Buscar Trabajos</h4>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">Encuentra proyectos perfectos para ti</p>
          </Link>

          <Link
            href="/dashboard/creator/profile"
            className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="text-green-600 mb-3">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">Actualizar Perfil</h4>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">Mantén tu información al día</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
