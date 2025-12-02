'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Bell, AlertTriangle, Calendar, Droplet } from 'lucide-react'

type NotificationType = 'emergency' | 'update' | 'campaign'

interface NotificationItem {
  id: number
  title: string
  message: string
  type: NotificationType
  timestamp: string
  location?: string
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    title: 'Emergency Blood Needed',
    message: 'A+ blood required urgently at Apollo Hospital, Indore. 2 units needed for emergency surgery.',
    type: 'emergency',
    timestamp: '2024-05-12T10:23:00Z',
    location: 'Indore, Madhya Pradesh'
  },
  {
    id: 2,
    title: 'New Blood Donation Camp Approved',
    message: 'SVVV NSS is organizing a blood donation camp on 20th May 2024. Register now to participate.',
    type: 'campaign',
    timestamp: '2024-05-11T16:45:00Z',
    location: 'SVVV Campus, Indore'
  },
  {
    id: 3,
    title: 'Blood Stock Updated',
    message: 'Red Cross Blood Bank updated O+ stock availability. 15 units available.',
    type: 'update',
    timestamp: '2024-05-11T09:12:00Z',
    location: 'Bhopal, Madhya Pradesh'
  },
  {
    id: 4,
    title: 'Emergency Response Needed',
    message: 'B- donor required for patient at Fortis Hospital, Jaipur. 1 unit needed within 6 hours.',
    type: 'emergency',
    timestamp: '2024-05-10T21:30:00Z',
    location: 'Jaipur, Rajasthan'
  },
  {
    id: 5,
    title: 'Upcoming Mega Donation Drive',
    message: 'Join the state-level mega donation drive on 5th June 2024. Coordinated by the Health Department.',
    type: 'campaign',
    timestamp: '2024-05-09T14:05:00Z',
    location: 'Mumbai, Maharashtra'
  }
]

const typeConfig: Record<NotificationType, { label: string; icon: JSX.Element; color: string }> = {
  emergency: {
    label: 'Emergency',
    icon: <AlertTriangle className="w-4 h-4 mr-1" />,
    color: 'bg-red-100 text-red-700 border-red-200'
  },
  update: {
    label: 'Updates',
    icon: <Droplet className="w-4 h-4 mr-1" />,
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  campaign: {
    label: 'Campaigns',
    icon: <Calendar className="w-4 h-4 mr-1" />,
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  }
}

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all')

  const filteredNotifications =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((notification) => notification.type === activeFilter)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold cursive-heading text-red-600 flex items-center gap-3">
              <Bell className="w-8 h-8 text-red-600" />
              Notifications
            </h1>
            <p className="text-gray-600 mt-2">
              Stay updated with live alerts for emergency requests, donor updates, and upcoming donation camps.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full border transition ${
              activeFilter === 'all'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {(Object.keys(typeConfig) as NotificationType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-2 rounded-full border transition flex items-center ${
                activeFilter === type
                  ? `border-red-600 bg-red-50 text-red-600`
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {typeConfig[type].icon}
              {typeConfig[type].label}
            </button>
          ))}
        </div>

        <div className="grid gap-6">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500">
              No notifications found for the selected filter.
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center text-sm font-medium px-3 py-1 rounded-full border ${typeConfig[notification.type].color}`}
                      >
                        {typeConfig[notification.type].icon}
                        {typeConfig[notification.type].label}
                      </span>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {formatDate(notification.timestamp)}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mt-3">{notification.title}</h2>
                    <p className="text-gray-600 mt-2 leading-relaxed">{notification.message}</p>
                    {notification.location && (
                      <p className="text-sm text-gray-500 mt-2">📍 {notification.location}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-600">
            Real-time notifications will appear here once the admin publishes updates or when emergency blood requests
            are raised. You will also receive SMS alerts for emergency events if you opt-in as a donor.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}


