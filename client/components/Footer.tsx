'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 cursive-heading">Lifelink</h3>
            <p className="text-gray-400">Saving lives through blood donation</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/blood-availability" className="hover:text-white">Blood Availability</Link></li>
              <li><Link href="/blood-centers" className="hover:text-white">Blood Centers</Link></li>
              <li><Link href="/camps" className="hover:text-white">Camps</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Information</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/faqs" className="hover:text-white">FAQs</Link></li>
              <li><Link href="/gallery" className="hover:text-white">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +91 1234567890
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                info@lifelink.in
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Lifelink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

