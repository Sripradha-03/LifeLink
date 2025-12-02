'use client'

import { MapPin, Search, Bell, Users, Calendar, Shield } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'Geolocation Based',
    description: 'Find nearest blood banks and donors using advanced geolocation technology'
  },
  {
    icon: Search,
    title: 'Live Blood Search',
    description: 'Search for available blood units in real-time across all blood banks'
  },
  {
    icon: Bell,
    title: 'Emergency Response',
    description: 'Instant SMS notifications to nearby donors during emergency blood requests'
  },
  {
    icon: Users,
    title: 'Donor Management',
    description: 'Comprehensive donor registration and management system'
  },
  {
    icon: Calendar,
    title: 'Camp Schedule',
    description: 'View and register for blood donation camps in your area'
  },
  {
    icon: Shield,
    title: 'Secure & Safe',
    description: 'Your data is protected with industry-standard security measures'
  }
]

export default function Features() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 cursive-heading text-red-600">Features</h2>
          <p className="text-gray-600 text-lg">Everything you need for blood donation management</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition">
              <feature.icon className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

