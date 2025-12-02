'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import api from '@/lib/api'
import toast from 'react-hot-toast'

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

export default function BloodRequest() {
  const router = useRouter()
  const [requestId, setRequestId] = useState<number | null>(null)
  const [acceptedDonor, setAcceptedDonor] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [matchingDonors, setMatchingDonors] = useState<any[]>([])
  const [requestSubmitted, setRequestSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    requesterName: '',
    patientName: '',
    hospitalName: '',
    mobile: '',
    bloodGroup: '',
    state: '',
    city: '',
    area: '',
    pincode: '',
    isEmergency: false,
    unitsRequired: 1
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  // Poll for status updates
  // Poll for status updates
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (requestSubmitted && requestId && !acceptedDonor) {
      interval = setInterval(async () => {
        try {
          const response = await api.get(`/blood-requests/${requestId}`)
          if (response.data.status === 'Accepted' && response.data.donor) {
            setAcceptedDonor(response.data.donor)
            toast.success('A donor has accepted your request!')
            clearInterval(interval)
          }
        } catch (error) {
          console.error('Error polling status:', error)
        }
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [requestSubmitted, requestId, acceptedDonor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/blood-requests', formData)
      toast.success('Blood request submitted successfully!')

      if (response.data.matchingDonors) {
        setMatchingDonors(response.data.matchingDonors)
      }
      if (response.data.request && response.data.request.id) {
        setRequestId(response.data.request.id)
      }
      setRequestSubmitted(true)
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'Request failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  if (requestSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${acceptedDonor ? 'bg-green-100' : 'bg-yellow-100'}`}>
                {acceptedDonor ? (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
              </div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">
                {acceptedDonor ? 'Request Accepted!' : 'Request Submitted Successfully'}
              </h2>
              <p className="text-gray-600">
                {acceptedDonor
                  ? `Good news! A donor has accepted your request.`
                  : matchingDonors.length > 0
                    ? `We found ${matchingDonors.length} donors near your location matching your requirements.`
                    : 'No matching donors found nearby at the moment. Your request has been broadcasted to our network.'}
              </p>
            </div>

            {acceptedDonor && (
              <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">Accepted Donor Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-lg">{acceptedDonor.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="font-semibold text-lg">{acceptedDonor.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      {acceptedDonor.bloodGroup}
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    <a
                      href={`tel:${acceptedDonor.mobile}`}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      Call Donor
                    </a>
                  </div>
                </div>
              </div>
            )}

            {!acceptedDonor && matchingDonors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-4 font-semibold text-gray-600">Name</th>
                      <th className="p-4 font-semibold text-gray-600">Blood Group</th>
                      <th className="p-4 font-semibold text-gray-600">Distance</th>
                      <th className="p-4 font-semibold text-gray-600">Mobile</th>
                      <th className="p-4 font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchingDonors.map((donor) => (
                      <tr key={donor.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">{donor.name}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                            {donor.bloodGroup}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{donor.distance} km</td>
                        <td className="p-4 text-gray-600">{donor.mobile}</td>
                        <td className="p-4">
                          <a
                            href={`tel:${donor.mobile}`}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            Call
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : !acceptedDonor && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-yellow-800 font-medium">
                  Don't worry! We have notified our admin team and other nearby donors.
                  You will receive a notification as soon as a donor accepts your request.
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                  <span className="ml-2 text-yellow-700">Waiting for donor response...</span>
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 cursive-heading text-red-600 text-center">Blood Request Form</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name *</label>
                <input
                  type="text"
                  name="requesterName"
                  required
                  value={formData.requesterName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Patient Name *</label>
                <input
                  type="text"
                  name="patientName"
                  required
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hospital Name *</label>
                <input
                  type="text"
                  name="hospitalName"
                  required
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  pattern="[0-9]{10}"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Blood Group *</label>
                <select
                  name="bloodGroup"
                  required
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                >
                  <option value="">Select</option>
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
                <label className="block text-sm font-medium mb-1">Units Required *</label>
                <input
                  type="number"
                  name="unitsRequired"
                  required
                  min="1"
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">State *</label>
                <select
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Area *</label>
                <input
                  type="text"
                  name="area"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  pattern="[0-9]{6}"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isEmergency"
                checked={formData.isEmergency}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-600"
              />
              <label className="ml-2 text-sm font-medium">Mark as Emergency (Will send SMS to nearby donors)</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

