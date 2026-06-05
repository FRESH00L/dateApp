import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix Vite + Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng)
    },
  })
  return null
}

export default function MapPicker({ onSelect }) {
  const [position, setPosition] = useState(null)
  const center = [50.2649, 19.0238] // Katowice

  const handleSelect = latlng => setPosition(latlng)

  return (
    <div className="mappicker">
      <h2 className="dp-title">Wybierz miejsce 📍</h2>
      <p className="map-hint">Kliknij na mapie żeby postawić pinezkę</p>

      <div className="map-wrap">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelect={handleSelect} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>

      {position ? (
        <button className="btn btn-yes" onClick={() => onSelect(position)}>
          Dalej →
        </button>
      ) : (
        <div className="map-placeholder-btn" />
      )}
    </div>
  )
}
