'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import api from '@/lib/api'
import Link from 'next/link'

export default function CompanyDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
  })
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const jobsRes = await api.get('/companies/jobs/me')
      const jobs = jobsRes.data

      const activeJobs = jobs.filter(job => job.status === 'open').length

      // Obtener aplicaciones para todos los jobs
      let totalApplications = 0
      for (const job of jobs) {
        try {
          const appsRes = await api.get(`/companies/jobs/${job.id}/applications`)
          totalApplications += appsRes.data.length
        } catch (err) {
          console.error(`Error al obtener aplicaciones para job ${job.id}:`, err)
        }
      }

      setStats({
        activeJobs,
        totalApplications,
      })

      setRecentJobs(jobs.slice(0, 5))
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="company">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="company">
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg sm:rounded-xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Panel de Control</h2>
          <p className="text-primary-100 text-sm sm:text-base">
            Gestiona tus ofertas de trabajo y encuentra talento creativo
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Ofertas Activas</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.activeJobs}</p>
              </div>
              <div className="bg-primary-100 p-3 sm:p-4 rounded-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Aplicaciones Recibidas</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.totalApplications}</p>
              </div>
              <div className="bg-secondary-100 p-3 sm:p-4 rounded-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Mis Ofertas</h3>
              <Link href="/dashboard/company/jobs" className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base">
                Ver todas →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentJobs.length === 0 ? (
              <div className="p-4 sm:p-6 text-center text-gray-500 text-sm sm:text-base">
                No has creado ofertas de trabajo aún
              </div>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="p-4 sm:p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">{job.title}</h4>
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                          job.status === 'open'
                            ? 'bg-green-100 text-green-700'
                            : job.status === 'closed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {job.status === 'open' ? 'Abierta' : job.status === 'closed' ? 'Cerrada' : 'En progreso'}
                        </span>
                      </div>
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
                        <span className="text-gray-500 text-xs sm:text-sm">
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/company/jobs/${job.id}`}
                      className="w-full sm:w-auto text-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
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
            href="/dashboard/company/jobs/new"
            className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="text-primary-600 mb-3">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">Crear Oferta</h4>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">Publica una nueva oferta de trabajo</p>
          </Link>

          <Link
            href="/dashboard/company/creators"
            className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="text-secondary-600 mb-3">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">Buscar Creadores</h4>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">Encuentra el talento perfecto</p>
          </Link>

          <Link
            href="/dashboard/company/profile"
            className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="text-green-600 mb-3">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">Perfil de Empresa</h4>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">Actualiza tu información</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
