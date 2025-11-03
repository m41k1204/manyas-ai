'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import api from '@/lib/api'

export default function CreatorProfilePage() {
  const [profile, setProfile] = useState({
    bio: '',
    phone: '',
    location: '',
    portfolio_description: '',
    profile_image: ''
  })
  const [categories, setCategories] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [myCategories, setMyCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [profileRes, categoriesRes] = await Promise.all([
        api.get('/auth/profile'),
        api.get('/categories')
      ])

      const profileData = profileRes.data.profile || {}
      setProfile({
        bio: profileData.bio || '',
        phone: profileData.phone || '',
        location: profileData.location || '',
        portfolio_description: profileData.portfolio_description || '',
        profile_image: profileData.profile_image || ''
      })

      setAllCategories(categoriesRes.data)

      // Cargar las categorías del creador
      if (profileData.id) {
        try {
          const creatorRes = await api.get(`/creators/${profileData.id}`)
          setMyCategories(creatorRes.data.categories || [])
        } catch (err) {
          console.error('Error al cargar categorías del creador:', err)
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await api.put('/creators/profile', profile)
      alert('Perfil actualizado exitosamente')
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      alert(error.response?.data?.error || 'Error al actualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleAddCategory = async (categoryId) => {
    try {
      await api.post('/creators/categories', { category_id: categoryId })
      loadData()
    } catch (error) {
      console.error('Error al agregar categoría:', error)
      alert(error.response?.data?.error || 'Error al agregar categoría')
    }
  }

  const handleRemoveCategory = async (categoryId) => {
    try {
      await api.delete(`/creators/categories/${categoryId}`)
      loadData()
    } catch (error) {
      console.error('Error al eliminar categoría:', error)
      alert('Error al eliminar categoría')
    }
  }

  const isCategorySelected = (categoryId) => {
    return myCategories.some(cat => cat.id === categoryId)
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
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Actualiza tu información y categorías</p>
        </div>

        {/* Información del perfil */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Información Personal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografía
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="+51 999 999 999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Lima, Perú"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Portafolio
              </label>
              <textarea
                value={profile.portfolio_description}
                onChange={(e) => setProfile({ ...profile, portfolio_description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe tu portafolio y experiencia..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Foto de Perfil
              </label>
              <input
                type="url"
                value={profile.profile_image}
                onChange={(e) => setProfile({ ...profile, profile_image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto bg-primary-600 text-white px-6 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 font-semibold text-sm sm:text-base"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>

        {/* Categorías */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Mis Categorías</h2>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Selecciona las industrias en las que trabajas</p>

          {myCategories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Categorías seleccionadas:</h3>
              <div className="flex flex-wrap gap-2">
                {myCategories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    <span>{category.name}</span>
                    <button
                      onClick={() => handleRemoveCategory(category.id)}
                      className="hover:bg-primary-200 rounded-full p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Todas las categorías:</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {allCategories.map((category) => {
                const isSelected = isCategorySelected(category.id)
                return (
                  <button
                    key={category.id}
                    onClick={() => isSelected ? handleRemoveCategory(category.id) : handleAddCategory(category.id)}
                    className={`p-3 sm:p-4 rounded-lg border-2 text-left transition ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{category.name}</h4>
                        {category.description && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
                        )}
                      </div>
                      {isSelected && (
                        <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
