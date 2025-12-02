'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function DonorLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/login', formData)
      localStorage.setItem('token', response.data.token)
      toast.success('Login successful!')
      router.push('/donor/profile')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 cursive-heading text-red-600 text-center">Donor Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                required
                pattern="[0-9]{10}"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                placeholder="Enter 10 digit mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600"
                placeholder="Default: Mobile number"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/donor/register" className="text-red-600 hover:underline">
                Register Now
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

