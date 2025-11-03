'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import api from '@/lib/api'
import Link from 'next/link'

export default function JobApplicationsPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        api.get(`/jobs/${params.id}`),
        api.get(`/companies/jobs/${params.id}/applications`)
      ])

      setJob(jobRes.data)
      setApplications(appsRes.data)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      alert('Error al cargar datos')
      router.push('/dashboard/company/jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus })
      loadData()
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      alert('Error al actualizar estado de la aplicación')
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
      <DashboardLayout role="company">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!job) {
    return null
  }

  return (
    <DashboardLayout role="company">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 mt-1">
              Aplicaciones recibidas: {applications.length}
            </p>
          </div>
        </div>

        {/* Job Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información de la Oferta</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {job.category_name && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Categoría</p>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                  {job.category_name}
                </span>
              </div>
            )}
            {job.budget && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Presupuesto</p>
                <p className="text-gray-900 font-semibold">${job.budget}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.status === 'open' ? 'bg-green-100 text-green-700' :
                job.status === 'closed' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {job.status === 'open' ? 'Abierta' :
                 job.status === 'closed' ? 'Cerrada' : 'En Progreso'}
              </span>
            </div>
          </div>
        </div>

        {/* Applications */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay aplicaciones aún</h3>
            <p className="text-gray-600">Los creadores comenzarán a aplicar pronto</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  {app.profile_image && (
                    <img
                      src={app.profile_image}
                      alt={app.creator_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{app.creator_name}</h3>
                        <p className="text-gray-600 text-sm">
                          Aplicó el {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    {app.bio && (
                      <p className="text-gray-700 mb-3">{app.bio}</p>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Carta de presentación:</h4>
                      <p className="text-gray-900 text-sm whitespace-pre-line">{app.cover_letter}</p>
                    </div>

                    {app.proposed_budget && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Presupuesto propuesto:</h4>
                        <p className="text-gray-900 font-semibold">${app.proposed_budget}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/company/creators/${app.creator_id}`}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                      >
                        Ver Perfil
                      </Link>
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app.id, 'accepted')}
                            className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition text-sm font-medium"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, 'rejected')}
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      {app.status === 'accepted' && (
                        <div className="flex items-center text-green-600 text-sm font-medium">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Aplicación aceptada
                        </div>
                      )}
                      {app.status === 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'pending')}
                          className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 transition text-sm font-medium"
                        >
                          Marcar como pendiente
                        </button>
                      )}
                    </div>
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
