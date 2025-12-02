'use client'

import { Users, Droplet, Building2, Calendar } from 'lucide-react'

const stats = [
  { icon: Users, label: 'Active Donors', value: '10,000+' },
  { icon: Droplet, label: 'Blood Units Donated', value: '50,000+' },
  { icon: Building2, label: 'Blood Centers', value: '500+' },
  { icon: Calendar, label: 'Camps Organized', value: '1,000+' }
]

export default function Stats() {
  return (
    <section className="py-16 bg-red-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

