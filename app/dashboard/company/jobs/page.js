'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import api from '@/lib/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CompanyJobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const response = await api.get('/companies/jobs/me')
      setJobs(response.data)
    } catch (error) {
      console.error('Error al cargar ofertas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta oferta?')) return

    try {
      await api.delete(`/companies/jobs/${jobId}`)
      loadJobs()
    } catch (error) {
      console.error('Error al eliminar oferta:', error)
      alert('Error al eliminar oferta')
    }
  }

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      // Primero obtenemos los datos actuales del job
      const jobResponse = await api.get(`/jobs/${jobId}`)
      const job = jobResponse.data

      await api.put(`/companies/jobs/${jobId}`, {
        ...job,
        status: newStatus
      })
      loadJobs()
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      alert('Error al actualizar estado')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      open: { bg: 'bg-green-100', text: 'text-green-700', label: 'Abierta' },
      closed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cerrada' },
      in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En Progreso' }
    }
    const badge = badges[status] || badges.open
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

  return (
    <DashboardLayout role="company">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Ofertas de Trabajo</h1>
            <p className="text-gray-600 mt-1">Gestiona tus proyectos y ofertas</p>
          </div>
          <Link
            href="/dashboard/company/jobs/new"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Oferta
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes ofertas creadas</h3>
            <p className="text-gray-600 mb-6">Crea tu primera oferta de trabajo</p>
            <Link
              href="/dashboard/company/jobs/new"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              Crear Oferta
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      {getStatusBadge(job.status)}
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      {job.category_name && (
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          {job.category_name}
                        </span>
                      )}
                      {job.budget && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ${job.budget}
                        </div>
                      )}
                      {job.deadline && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(job.deadline).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex items-center text-gray-500 text-sm">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/company/jobs/${job.id}`}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-medium"
                      >
                        Ver Aplicaciones
                      </Link>
                      <Link
                        href={`/dashboard/company/jobs/${job.id}/edit`}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                      >
                        Editar
                      </Link>
                      {job.status === 'open' && (
                        <button
                          onClick={() => handleStatusChange(job.id, 'closed')}
                          className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 transition text-sm font-medium"
                        >
                          Cerrar
                        </button>
                      )}
                      {job.status === 'closed' && (
                        <button
                          onClick={() => handleStatusChange(job.id, 'open')}
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition text-sm font-medium"
                        >
                          Reabrir
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                      >
                        Eliminar
                      </button>
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
