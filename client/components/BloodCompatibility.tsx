'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const compatibility = {
  'A+': { canGive: ['A+', 'AB+'], canReceive: ['A+', 'A-', 'O+', 'O-'] },
  'A-': { canGive: ['A+', 'A-', 'AB+', 'AB-'], canReceive: ['A-', 'O-'] },
  'B+': { canGive: ['B+', 'AB+'], canReceive: ['B+', 'B-', 'O+', 'O-'] },
  'B-': { canGive: ['B+', 'B-', 'AB+', 'AB-'], canReceive: ['B-', 'O-'] },
  'AB+': { canGive: ['AB+'], canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  'AB-': { canGive: ['AB+', 'AB-'], canReceive: ['A-', 'B-', 'AB-', 'O-'] },
  'O+': { canGive: ['A+', 'B+', 'AB+', 'O+'], canReceive: ['O+', 'O-'] },
  'O-': { canGive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], canReceive: ['O-'] },
}

export default function BloodCompatibility() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 cursive-heading text-red-600">Blood Group Compatibility</h2>
          <p className="text-gray-600 text-lg">Select your blood type to see compatibility</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {bloodGroups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`p-4 rounded-lg border-2 transition ${
                selectedGroup === group
                  ? 'border-red-600 bg-red-50 text-red-600'
                  : 'border-gray-300 hover:border-red-400'
              }`}
            >
              <div className="text-2xl font-bold">{group}</div>
            </button>
          ))}
        </div>

        {selectedGroup && (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-red-600 mb-2">Blood Group {selectedGroup}</h3>
              <div className="flex items-center justify-center text-gray-600">
                <Info className="w-5 h-5 mr-2" />
                <span>Compatibility Information</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3 text-lg">You can give to:</h4>
                <div className="flex flex-wrap gap-2">
                  {compatibility[selectedGroup as keyof typeof compatibility].canGive.map((bg) => (
                    <span key={bg} className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold">
                      {bg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3 text-lg">You can receive from:</h4>
                <div className="flex flex-wrap gap-2">
                  {compatibility[selectedGroup as keyof typeof compatibility].canReceive.map((bg) => (
                    <span key={bg} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-semibold">
                      {bg}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

