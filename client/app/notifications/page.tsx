'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Bell, AlertTriangle, Calendar, Droplet } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

type NotificationType = 'emergency' | 'update' | 'campaign'

interface NotificationItem {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: string
  location?: string
}

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
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data)
    } catch (error) {
      console.error('Failed to fetch notifications', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

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
            className={`px-4 py-2 rounded-full border transition ${activeFilter === 'all'
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
              className={`px-4 py-2 rounded-full border transition flex items-center ${activeFilter === type
                  ? `border-red-600 bg-red-50 text-red-600`
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
              {typeConfig[type].icon}
              {typeConfig[type].label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notifications...</p>
          </div>
        ) : (
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
        )}

        <div className="mt-12 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About Notifications</h3>
          <p className="text-gray-600">
            This feed updates automatically with the latest blood requests, stock updates from blood centers, and new donation camps in your network.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}


