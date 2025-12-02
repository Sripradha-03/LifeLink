'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Bell, User, Shield } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <h1 className="cursive-heading text-3xl text-red-600">Lifelink</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-red-600 transition">Home</Link>
            <Link href="/blood-availability" className="text-gray-700 hover:text-red-600 transition">Blood Availability</Link>
            <Link href="/blood-centers" className="text-gray-700 hover:text-red-600 transition">Blood Centers</Link>
            <Link href="/camps" className="text-gray-700 hover:text-red-600 transition">Camps</Link>
            <Link href="/notifications" className="text-gray-700 hover:text-red-600 transition flex items-center">
              <Bell className="w-4 h-4 mr-1" />
              Notifications
            </Link>
            <Link href="/admin/dashboard" className="text-gray-700 hover:text-red-600 transition flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Admin
            </Link>
            <Link href="/donor/login" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
              <User className="w-4 h-4 mr-1" />
              Donor Login
            </Link>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            <Link href="/" className="block py-2 text-gray-700 hover:text-red-600">Home</Link>
            <Link href="/blood-availability" className="block py-2 text-gray-700 hover:text-red-600">Blood Availability</Link>
            <Link href="/blood-centers" className="block py-2 text-gray-700 hover:text-red-600">Blood Centers</Link>
            <Link href="/camps" className="block py-2 text-gray-700 hover:text-red-600">Camps</Link>
            <Link href="/notifications" className="block py-2 text-gray-700 hover:text-red-600">Notifications</Link>
            <Link href="/admin/dashboard" className="block py-2 text-gray-700 hover:text-red-600">Admin</Link>
            <Link href="/donor/login" className="block py-2 bg-red-600 text-white rounded-lg text-center">Donor Login</Link>
          </nav>
        )}
      </div>
    </header>
  )
}

