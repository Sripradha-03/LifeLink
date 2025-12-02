'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function MapController({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

export default function Map({ centers, userLocation }: { centers: any[]; userLocation: [number, number] | null }) {
  const defaultCenter: [number, number] = [20.5937, 78.9629] // India center
  const center = userLocation || defaultCenter

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {centers.map((center, idx) => {
        if (center.latitude && center.longitude) {
          return (
            <Marker
              key={idx}
              position={[parseFloat(center.latitude), parseFloat(center.longitude)]}
            >
              <Popup>
                <div>
                  <strong>{center.name}</strong><br />
                  {center.type}<br />
                  {center.address}<br />
                  📞 {center.contactNumber}
                  {center.distance && <><br />📍 {center.distance} km away</>}
                </div>
              </Popup>
            </Marker>
          )
        }
        return null
      })}

      <MapController center={center} />
    </MapContainer>
  )
}

