'use client'

import { useState } from 'react'
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

export default function AddBloodCenter() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        type: 'Blood Bank',
        contactNumber: '',
        email: '',
        state: '',
        district: '',
        city: '',
        address: '',
        pincode: '',
        latitude: '',
        longitude: '',
        username: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            // Remove confirmPassword before sending
            const { confirmPassword, ...dataToSend } = formData
            await api.post('/blood-centers', dataToSend)
            toast.success('Blood center submitted for verification!')
            router.push('/')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit blood center')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold mb-6 cursive-heading text-red-600 text-center">Register Blood Center</h2>
                    <p className="text-center text-gray-600 mb-8">
                        Register your blood bank, hospital, or storage unit.
                        Your submission will be verified by our admin team before appearing in search results.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Center Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                                    placeholder="e.g. City Civil Hospital Blood Bank"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Type *</label>
                                <select
                                    name="type"
                                    required
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                                >
                                    <option value="Blood Bank">Blood Bank</option>
                                    <option value="Hospital">Hospital</option>
                                    <option value="Blood Storage Unit">Blood Storage Unit</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Contact Number *</label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    required
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                                />
                            </div>

                            <div className="md:col-span-2 border-t pt-6 mt-2">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Account Details (For Login)</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Username *</label>
                                        <input
                                            type="text"
                                            name="username"
                                            required
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                                            placeholder="Choose a username"
                                        />
                                    </div>
                                    <div></div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Password *</label>
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                                            placeholder="Min 6 characters"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Confirm Password *</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                                        />
                                    </div>
                                </div>
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
                                <label className="block text-sm font-medium mb-1">District *</label>
                                <input
                                    type="text"
                                    name="district"
                                    required
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                                />
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
                                <label className="block text-sm font-medium mb-1">Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    required
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Address *</label>
                                <textarea
                                    name="address"
                                    required
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                                    placeholder="Full address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Latitude (Optional)</label>
                                <input
                                    type="number"
                                    step="any"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                                    placeholder="e.g. 12.9716"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Longitude (Optional)</label>
                                <input
                                    type="number"
                                    step="any"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                                    placeholder="e.g. 77.5946"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Register Blood Center'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}
