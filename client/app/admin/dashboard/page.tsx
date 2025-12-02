'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Users, Droplet, AlertCircle, Building2 } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [donors, setDonors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [adminKeyInput, setAdminKeyInput] = useState('')
  const [adminKey, setAdminKey] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [donorStatusFilter, setDonorStatusFilter] = useState('Pending')
  const [selectedDonor, setSelectedDonor] = useState<any>(null)

  const [centers, setCenters] = useState<any[]>([])

  useEffect(() => {
    const storedKey = typeof window !== 'undefined' ? localStorage.getItem('adminKey') : null
    if (storedKey) {
      setAdminKey(storedKey)
      setIsAuthenticated(true)
      fetchData(storedKey)
    }
  }, [])

  useEffect(() => {
    if (adminKey) {
      if (activeTab === 'donors') fetchDonors(adminKey, donorStatusFilter)
      if (activeTab === 'centers') fetchCenters(adminKey)
    }
  }, [activeTab, donorStatusFilter, adminKey])

  const fetchData = async (key: string) => {
    setLoading(true)
    try {
      const [statsRes, requestsRes] = await Promise.all([
        api.get('/admin/dashboard', { headers: { 'X-Admin-Key': key } }),
        api.get('/admin/requests', { headers: { 'X-Admin-Key': key } })
      ])
      setStats(statsRes.data)
      setRequests(requestsRes.data)
      // Initial donor fetch
      fetchDonors(key, 'Pending')
    } catch (error: any) {
      toast.error('Failed to load dashboard data')
      setIsAuthenticated(false)
      setAdminKey(null)
      localStorage.removeItem('adminKey')
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    if (!adminKey) return

    const interval = setInterval(() => {
      if (activeTab === 'requests') {
        api.get('/admin/requests', { headers: { 'X-Admin-Key': adminKey } })
          .then(res => setRequests(res.data))
          .catch(err => console.error('Auto-refresh failed', err))
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [adminKey, activeTab])

  const fetchDonors = async (key: string, status: string) => {
    try {
      const res = await api.get(`/admin/donors?status=${status}`, { headers: { 'X-Admin-Key': key } })
      setDonors(res.data)
    } catch (error) {
      toast.error('Failed to load donors')
    }
  }

  const fetchCenters = async (key: string) => {
    try {
      const res = await api.get('/blood-centers', { headers: { 'X-Admin-Key': key } })
      setCenters(res.data)
    } catch (error) {
      toast.error('Failed to load blood centers')
    }
  }

  const handleLogin = () => {
    if (!adminKeyInput.trim()) {
      toast.error('Please enter admin key')
      return
    }
    localStorage.setItem('adminKey', adminKeyInput.trim())
    setAdminKey(adminKeyInput.trim())
    setIsAuthenticated(true)
    fetchData(adminKeyInput.trim())
  }

  const handleLogout = () => {
    localStorage.removeItem('adminKey')
    setAdminKey(null)
    setAdminKeyInput('')
    setIsAuthenticated(false)
    setStats(null)
    setRequests([])
    setDonors([])
    setCenters([])
  }

  const updateRequestStatus = async (id: number, status: string) => {
    if (!adminKey) return
    try {
      await api.put(`/admin/requests/${id}`, { status }, { headers: { 'X-Admin-Key': adminKey } })
      toast.success('Request updated')
      const res = await api.get('/admin/requests', { headers: { 'X-Admin-Key': adminKey } })
      setRequests(res.data)
    } catch (error: any) {
      toast.error('Failed to update request')
    }
  }

  const updateDonorStatus = async (id: number, status: string) => {
    if (!adminKey) return
    try {
      await api.put(`/admin/donors/${id}`, { status }, { headers: { 'X-Admin-Key': adminKey } })
      toast.success(`Donor ${status}`)
      fetchDonors(adminKey, donorStatusFilter)
      setSelectedDonor(null)
    } catch (error: any) {
      toast.error('Failed to update donor')
    }
  }

  const updateCenterStatus = async (id: number, isActive: boolean) => {
    if (!adminKey) return
    try {
      await api.put(`/blood-centers/${id}`, { isActive }, { headers: { 'X-Admin-Key': adminKey } })
      toast.success(`Center ${isActive ? 'Approved' : 'Deactivated'}`)
      fetchCenters(adminKey)
    } catch (error: any) {
      toast.error('Failed to update center')
    }
  }

  const getDonorAvailability = (donor: any) => {
    if (donor.status !== 'Approved') return <span className="text-gray-400">-</span>

    if (donor.isActive) {
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Available</span>
    }

    if (!donor.lastDonationDate) return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Available</span>

    const lastDonation = new Date(donor.lastDonationDate)
    const eligibilityMonths = donor.gender === 'Female' ? 4 : 3
    const eligibilityDate = new Date(lastDonation.setMonth(lastDonation.getMonth() + eligibilityMonths))

    return (
      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
        Until {eligibilityDate.toLocaleDateString()}
      </span>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 cursive-heading text-red-600 text-center">Admin Login</h2>
            <input
              type="password"
              value={adminKeyInput}
              onChange={(e) => setAdminKeyInput(e.target.value)}
              placeholder="Enter Admin Key"
              className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-red-600"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold cursive-heading text-red-600">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="self-start md:self-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-4 font-semibold whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('donors')}
            className={`pb-2 px-4 font-semibold whitespace-nowrap ${activeTab === 'donors' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
          >
            Donors
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-2 px-4 font-semibold whitespace-nowrap ${activeTab === 'requests' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab('centers')}
            className={`pb-2 px-4 font-semibold whitespace-nowrap ${activeTab === 'centers' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
          >
            Blood Centers
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <div className="text-3xl font-bold">{stats?.donors?.total || 0}</div>
              <div className="text-gray-600">Total Donors</div>
              <div className="text-sm text-green-600 mt-1">{stats?.donors?.active || 0} Active</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <Droplet className="w-8 h-8 text-red-600 mb-2" />
              <div className="text-3xl font-bold">{stats?.requests?.total || 0}</div>
              <div className="text-gray-600">Total Requests</div>
              <div className="text-sm text-yellow-600 mt-1">{stats?.requests?.pending || 0} Pending</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <AlertCircle className="w-8 h-8 text-orange-600 mb-2" />
              <div className="text-3xl font-bold">{stats?.requests?.emergency || 0}</div>
              <div className="text-gray-600">Emergency Requests</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <Building2 className="w-8 h-8 text-green-600 mb-2" />
              <div className="text-3xl font-bold">{stats?.centers?.total || 0}</div>
              <div className="text-gray-600">Blood Centers</div>
            </div>
          </div>
        )}

        {/* Donors Tab */}
        {activeTab === 'donors' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Donors</h2>
              <div className="flex space-x-2">
                {['Pending', 'Approved', 'Rejected', 'All'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setDonorStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${donorStatusFilter === status
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Blood Group</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Availability</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((donor: any) => (
                    <tr key={donor.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{donor.name}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                          {donor.bloodGroup}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{donor.district}, {donor.state}</td>
                      <td className="p-4">
                        {getDonorAvailability(donor)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${donor.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          donor.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                          {donor.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedDonor(donor)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {donors.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        No donors found with status "{donorStatusFilter}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Requests</h2>
            <div className="space-y-4">
              {requests.map((request: any) => (
                <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{request.patientName}</h3>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                          {request.bloodGroup}
                        </span>
                        {request.isEmergency && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" /> Emergency
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600 mb-4">
                        <p><span className="font-semibold">Hospital:</span> {request.hospitalName}</p>
                        <p><span className="font-semibold">Location:</span> {request.city}, {request.state}</p>
                        <p><span className="font-semibold">Contact:</span> {request.mobile}</p>
                        <p><span className="font-semibold">Units:</span> {request.unitsRequired}</p>
                        <p><span className="font-semibold">Requester:</span> {request.requesterName}</p>
                        <p><span className="font-semibold">Date:</span> {new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>

                      {/* Contacted Donors Section */}
                      {request.requestDonors && request.requestDonors.length > 0 && (
                        <div className="mt-4 border-t pt-4">
                          <h4 className="text-sm font-bold text-gray-700 mb-2">Contacted Donors (SMS Status)</h4>
                          <div className="space-y-2">
                            {request.requestDonors.map((rd: any) => (
                              <div key={rd.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                                <div>
                                  <span className="font-medium">{rd.Donor?.name || 'Unknown Donor'}</span>
                                  <span className="text-gray-500 text-xs ml-2">({rd.Donor?.mobile})</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${rd.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                                  rd.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                  {rd.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 min-w-[150px]">
                      <label className="text-xs font-semibold text-gray-500">Status</label>
                      <select
                        value={request.status}
                        onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                        className={`w-full border rounded px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-600 ${request.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          request.status === 'Accepted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            request.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Centers Tab */}
        {activeTab === 'centers' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Blood Centers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Contact</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {centers.map((center: any) => (
                    <tr key={center.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{center.name}</td>
                      <td className="p-4 text-gray-600">{center.type}</td>
                      <td className="p-4 text-gray-600">{center.city}, {center.state}</td>
                      <td className="p-4 text-gray-600">{center.contactNumber}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${center.isActive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {center.isActive ? 'Active' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        {!center.isActive ? (
                          <button
                            onClick={() => updateCenterStatus(center.id, true)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => updateCenterStatus(center.id, false)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {centers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        No blood centers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Donor Details Modal */}
        {selectedDonor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Donor Details</h3>
                <button
                  onClick={() => setSelectedDonor(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg font-semibold">{selectedDonor.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Blood Group</label>
                    <p className="text-lg font-semibold text-red-600">{selectedDonor.bloodGroup}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Age / Gender</label>
                    <p className="text-lg font-semibold">{selectedDonor.age} / {selectedDonor.gender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Father's Name</label>
                    <p className="text-lg font-semibold">{selectedDonor.fatherName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Mobile</label>
                    <p className="text-lg font-semibold">{selectedDonor.mobile}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg font-semibold">{selectedDonor.email || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Address</label>
                    <p className="text-lg font-semibold">{selectedDonor.address}</p>
                    <p className="text-gray-600">{selectedDonor.district}, {selectedDonor.state} - {selectedDonor.pincode}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Verification Action</h4>
                  <div className="flex gap-4">
                    {selectedDonor.status !== 'Approved' && (
                      <button
                        onClick={() => updateDonorStatus(selectedDonor.id, 'Approved')}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Approve Donor
                      </button>
                    )}
                    {selectedDonor.status !== 'Rejected' && (
                      <button
                        onClick={() => updateDonorStatus(selectedDonor.id, 'Rejected')}
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                      >
                        Reject Donor
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}


