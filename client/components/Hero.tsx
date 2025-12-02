'use client'

import Link from 'next/link'
import { Droplet, Heart, AlertCircle } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-4 cursive-heading">Save Lives, Donate Blood</h2>
            <p className="text-xl mb-6">Your one donation can save up to three lives. Join Lifelink and make a difference today.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/blood-request" className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Need Blood
              </Link>
              <Link href="/donor/register" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Donate Blood
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
              <Droplet className="w-32 h-32 mx-auto mb-4 text-white" />
              <h3 className="text-2xl font-bold mb-2">Every Drop Counts</h3>
              <p className="text-lg">Be a hero, donate blood and save lives</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

