'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const MapComponent = dynamic(() => import('../../components/Map'), { ssr: false })

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
]

export default function BloodCenters() {
  const [centers, setCenters] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    type: '',
    name: ''
  })
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        () => { }
      )
    }
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.state) params.append('state', filters.state)
      if (filters.district) params.append('district', filters.district)
      if (filters.type) params.append('type', filters.type)
      if (filters.name) params.append('name', filters.name)

      const response = userLocation
        ? await api.get(`/blood-centers/nearest?${params.toString()}&latitude=${userLocation[0]}&longitude=${userLocation[1]}`)
        : await api.get(`/blood-centers?${params.toString()}`)

      setCenters(response.data)
    } catch (error: any) {
      toast.error('Failed to fetch blood centers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold cursive-heading text-red-600 text-center md:text-left">Nearest Blood Bank / Blood Storage Unit</h1>
          <button
            onClick={() => window.location.href = '/add-blood-center'}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition flex items-center whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Register Your Blood Center
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <select
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <input
                type="text"
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                placeholder="Enter district"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
              >
                <option value="">All Types</option>
                <option value="Blood Bank">Blood Bank</option>
                <option value="Blood Storage Unit">Blood Storage Unit</option>
                <option value="Hospital">Hospital</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Blood Bank / Hospital Name</label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                placeholder="Search by name"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              {centers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No blood centers found</div>
              ) : (
                centers.map((center, idx) => (
                  <div key={idx} className="p-6 border-b hover:bg-gray-50">
                    <h3 className="font-semibold text-lg mb-2">{center.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{center.type}</p>
                    <p className="text-sm text-gray-600 mb-2">{center.address}</p>
                    <p className="text-sm text-gray-600 mb-2">{center.city}, {center.district}, {center.state}</p>
                    <p className="text-sm text-gray-600">📞 {center.contactNumber}</p>
                    {center.distance && (
                      <p className="text-sm text-red-600 font-semibold mt-2">📍 {center.distance} km away</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-[600px]">
              <MapComponent
                centers={centers}
                userLocation={userLocation}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

