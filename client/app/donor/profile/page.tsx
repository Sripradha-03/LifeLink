'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function DonorProfile() {
  const router = useRouter()
  const [donor, setDonor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>({})

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/donor/login')
      return
    }

    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/donors/profile')
      setDonor(response.data)
      setEditForm(response.data)
    } catch (error: any) {
      toast.error('Failed to load profile')
      if (error.response?.status === 401) {
        router.push('/donor/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDonationUpdate = async () => {
    if (!confirm('Are you sure you donated blood today? This will mark you as unavailable for the next few months.')) {
      return
    }

    setUpdating(true)
    try {
      const response = await api.post('/donors/donation', { donationDate: new Date() })
      toast.success(response.data.message)
      setDonor(response.data.donor)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update donation')
    } finally {
      setUpdating(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const response = await api.put('/donors/profile', editForm)
      toast.success(response.data.message)
      setDonor(response.data.donor)
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const getAvailabilityStatus = () => {
    if (donor.status === 'Pending') return { status: 'Pending Verification', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (donor.status === 'Rejected') return { status: 'Registration Rejected', color: 'text-red-600', bg: 'bg-red-100' }

    if (!donor.lastDonationDate) return { status: 'Available', color: 'text-green-600', bg: 'bg-green-100' }

    const lastDonation = new Date(donor.lastDonationDate)
    const eligibilityMonths = donor.gender === 'Female' ? 4 : 3
    const eligibilityDate = new Date(lastDonation.setMonth(lastDonation.getMonth() + eligibilityMonths))
    const now = new Date()

    if (now >= eligibilityDate) {
      return { status: 'Available', color: 'text-green-600', bg: 'bg-green-100' }
    } else {
      return {
        status: `Unavailable until ${eligibilityDate.toLocaleDateString()}`,
        color: 'text-red-600',
        bg: 'bg-red-100'
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!donor) {
    return null
  }

  const availability = getAvailabilityStatus()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold cursive-heading text-red-600">Donor Profile</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Availability Status Card */}
            {!isEditing && (
              <div className={`p-4 rounded-lg ${availability.bg} border border-opacity-20 mb-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Status</h3>
                    <p className={`font-bold ${availability.color}`}>{availability.status}</p>
                  </div>
                  {availability.status === 'Available' && (
                    <button
                      onClick={handleDonationUpdate}
                      disabled={updating}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {updating ? 'Updating...' : 'I Donated Today'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={editForm.age}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Gender</label>
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={editForm.bloodGroup}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Mobile</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={editForm.mobile}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">State</label>
                    <input
                      type="text"
                      name="state"
                      value={editForm.state}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">District</label>
                    <input
                      type="text"
                      name="district"
                      value={editForm.district}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={editForm.address}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={editForm.pincode}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg font-semibold">{donor.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Age</label>
                  <p className="text-lg font-semibold">{donor.age}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-lg font-semibold">{donor.gender}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Blood Group</label>
                  <p className="text-lg font-semibold text-red-600">{donor.bloodGroup || 'Not specified'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Mobile</label>
                  <p className="text-lg font-semibold">{donor.mobile}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg font-semibold">{donor.email || 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">State</label>
                  <p className="text-lg font-semibold">{donor.state}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">District</label>
                  <p className="text-lg font-semibold">{donor.district}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600">Address</label>
                  <p className="text-lg font-semibold">{donor.address}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Pincode</label>
                  <p className="text-lg font-semibold">{donor.pincode}</p>
                </div>

                {donor.lastDonationDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Last Donation</label>
                    <p className="text-lg font-semibold">
                      {new Date(donor.lastDonationDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!isEditing && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    localStorage.removeItem('token')
                    router.push('/donor/login')
                  }}
                  className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
