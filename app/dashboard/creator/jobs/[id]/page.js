'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import api from '@/lib/api'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    proposed_budget: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadJob()
  }, [params.id])

  const loadJob = async () => {
    try {
      const response = await api.get(`/jobs/${params.id}`)
      setJob(response.data)
    } catch (error) {
      console.error('Error al cargar oferta:', error)
      alert('Error al cargar la oferta')
      router.push('/dashboard/creator/jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.post('/applications', {
        job_opening_id: parseInt(params.id),
        cover_letter: applicationData.cover_letter,
        proposed_budget: applicationData.proposed_budget ? parseFloat(applicationData.proposed_budget) : null
      })

      alert('¡Aplicación enviada exitosamente!')
      router.push('/dashboard/creator/applications')
    } catch (error) {
      console.error('Error al aplicar:', error)
      alert(error.response?.data?.error || 'Error al enviar la aplicación')
      setSubmitting(false)
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

  if (!job) {
    return null
  }

  return (
    <DashboardLayout role="creator">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{job.title}</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">{job.company_name}</p>
          </div>
          <span className="bg-green-100 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm whitespace-nowrap">
            Abierta
          </span>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            {job.logo_url && (
              <img src={job.logo_url} alt={job.company_name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{job.company_name}</h2>
              {job.company_description && (
                <p className="text-gray-600 mt-2 text-sm sm:text-base">{job.company_description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Detalles de la Oferta</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Descripción</h3>
              <p className="text-gray-900 whitespace-pre-line text-sm sm:text-base">{job.description}</p>
            </div>

            {job.requirements && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Requisitos</h3>
                <p className="text-gray-900 whitespace-pre-line text-sm sm:text-base">{job.requirements}</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
              {job.category_name && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Categoría</h3>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs sm:text-sm inline-block">
                    {job.category_name}
                  </span>
                </div>
              )}

              {job.budget && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Presupuesto</h3>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base">${job.budget}</p>
                </div>
              )}

              {job.deadline && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Fecha Límite</h3>
                  <p className="text-gray-900 text-sm sm:text-base">{new Date(job.deadline).toLocaleDateString()}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Publicado</h3>
                <p className="text-gray-900 text-sm sm:text-base">{new Date(job.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">¿Interesado en este proyecto?</h3>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Envía tu aplicación y propuesta</p>
            </div>
            <button
              onClick={() => setShowApplyModal(true)}
              className="w-full sm:w-auto bg-primary-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-primary-700 transition font-semibold text-sm sm:text-base"
            >
              Aplicar Ahora
            </button>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 sm:mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 pr-2">Aplicar a {job.title}</h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carta de Presentación *
                </label>
                <textarea
                  required
                  value={applicationData.cover_letter}
                  onChange={(e) => setApplicationData({ ...applicationData, cover_letter: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Explica por qué eres el candidato ideal para este proyecto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presupuesto Propuesto (opcional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={applicationData.proposed_budget}
                    onChange={(e) => setApplicationData({ ...applicationData, proposed_budget: e.target.value })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {job.budget && `Presupuesto de la empresa: $${job.budget}`}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Consejos para tu aplicación:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Destaca tu experiencia relevante</li>
                      <li>Menciona proyectos similares que hayas realizado</li>
                      <li>Sé claro sobre tus disponibilidad y plazos</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 sm:py-3 rounded-lg hover:bg-gray-300 transition font-semibold text-sm sm:text-base"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary-600 text-white px-4 py-2.5 sm:py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 font-semibold text-sm sm:text-base"
                >
                  {submitting ? 'Enviando...' : 'Enviar Aplicación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
