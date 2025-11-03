'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import api from '@/lib/api'
import Link from 'next/link'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const response = await api.get('/applications/me')
      setApplications(response.data)
    } catch (error) {
      console.error('Error al cargar aplicaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (applicationId) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta aplicación?')) return

    try {
      await api.delete(`/applications/${applicationId}`)
      loadApplications()
    } catch (error) {
      console.error('Error al cancelar aplicación:', error)
      alert('Error al cancelar aplicación')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente' },
      accepted: { bg: 'bg-green-100', text: 'text-green-700', label: 'Aceptada' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rechazada' }
    }
    const badge = badges[status] || badges.pending
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-medium`}>
        {badge.label}
      </span>
    )
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
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mis Aplicaciones</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Revisa el estado de tus aplicaciones</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No tienes aplicaciones</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Comienza a aplicar a ofertas de trabajo</p>
            <Link
              href="/dashboard/creator/jobs"
              className="inline-block bg-primary-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
            >
              Ver Ofertas
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4">
                  <div className="flex-1 w-full sm:w-auto">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{app.job_title}</h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">{app.company_name}</p>
                    {app.category_name && (
                      <span className="inline-block mt-2 bg-primary-100 text-primary-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                        {app.category_name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  {app.cover_letter && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Tu carta de presentación:</h4>
                      <p className="text-gray-900 text-xs sm:text-sm bg-gray-50 p-3 rounded-lg">{app.cover_letter}</p>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {app.proposed_budget && (
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-700">Tu propuesta</h4>
                        <p className="text-gray-900 font-semibold text-sm sm:text-base">${app.proposed_budget}</p>
                      </div>
                    )}
                    {app.job_budget && (
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-700">Presupuesto del job</h4>
                        <p className="text-gray-900 text-sm sm:text-base">${app.job_budget}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-700">Fecha de aplicación</h4>
                      <p className="text-gray-900 text-sm sm:text-base">{new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 pt-3">
                    <Link
                      href={`/dashboard/creator/jobs/${app.job_opening_id}`}
                      className="bg-primary-100 text-primary-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-200 transition text-xs sm:text-sm font-medium"
                    >
                      Ver Oferta
                    </Link>
                    {app.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(app.id)}
                        className="bg-red-100 text-red-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-200 transition text-xs sm:text-sm font-medium"
                      >
                        Cancelar Aplicación
                      </button>
                    )}
                    {app.status === 'accepted' && (
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        ¡Felicidades! Tu aplicación fue aceptada
                      </div>
                    )}
                    {app.status === 'rejected' && (
                      <div className="flex items-center text-red-600 text-sm">
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Lo sentimos, esta aplicación fue rechazada
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
