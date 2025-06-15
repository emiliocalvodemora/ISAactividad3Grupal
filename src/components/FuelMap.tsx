import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import './FuelMap.css'
import { useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

import { getDistanceKm } from '@/apis/utils';
import React from 'react';

// Importa el resumen visual de precios medios (tu componente)
import AveragePrice from './AveragePrice';

const icon = new L.Icon({
  iconUrl: './gas-pump.png',
  iconAnchor: [12, 41],
});

const userIcon = new L.Icon({
  iconUrl: './driver.png',
  iconAnchor: [12, 41],
});

/**
 * Mapa de estaciones de servicio
 */
function FuelMap({ stations }) {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [filterRotulo, setFilterRotulo] = useState('');
  const [radius, setRadius] = useState(5); // Nuevo estado para el radio
  const markerRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setUserLocation([40.4168, -3.7038]) // fallback: Madrid
      );
    } else {
      setUserLocation([40.4168, -3.7038]); // fallback: Madrid
    }
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          // @ts-ignore
          setUserLocation([marker.getLatLng().lat, marker.getLatLng().lng]);
        }
      },
    }),
    [],
  );

  // Filtrar estaciones a radius km de la ubicación del usuario
  const filteredStations = userLocation
    ? stations.filter(station => {
      const lat = parseFloat(station['Latitud'].replace(',', '.'));
      const lon = parseFloat(station['Longitud (WGS84)'].replace(',', '.'));
      const inRadius = getDistanceKm(userLocation[0], userLocation[1], lat, lon) <= radius;
      const matchRotulo = station['Rótulo']
        .toLowerCase()
        .includes(filterRotulo.toLowerCase());
      return inRadius && matchRotulo;
    })
    : [];

  if (!userLocation) {
    return <div>Obteniendo ubicación...</div>;
  }

  return (
    <>
      {/* Filtros y resumen de precio medio en la misma línea */}
      <div style={{
        margin: '1rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <label htmlFor="filtro-rotulo">Filtrar por rótulo:</label>
            <input
              type="text"
              name="filtro-rotulo"
              id="filtro-rotulo"
              placeholder="Filtrar por rótulo"
              value={filterRotulo}
              onChange={e => setFilterRotulo(e.target.value)}
              style={{ padding: '0.5rem', width: '250px', borderRadius: '4px', border: '1px solid #1976d2', marginLeft: '0.5rem' }}
            />
          </div>
          <div>
            <label htmlFor="radius-slider">Radio: {radius} km</label>
            <input
              type="range"
              id="radius-slider"
              min={1}
              max={30}
              value={radius}
              onChange={e => setRadius(Number(e.target.value))}
              style={{ marginLeft: '1rem', verticalAlign: 'middle' }}
            />
          </div>
        </div>
        {/* Componente de precio medio en modo inline */}
        <AveragePrice stations={stations} mode="inline" />
      </div>

      <MapContainer center={userLocation} zoom={14} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          url="http://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        />
        <Marker
          position={userLocation}
          icon={userIcon}
          draggable={true}
          ref={markerRef}
          eventHandlers={eventHandlers}
        >
          <Tooltip>Tu ubicación</Tooltip>
        </Marker>
        {filteredStations.map((station, idx) => (
          <Marker
            key={idx}
            position={[
              parseFloat(station['Latitud'].replace(',', '.')),
              parseFloat(station['Longitud (WGS84)'].replace(',', '.'))
            ]}
            icon={icon}
            eventHandlers={{
              click: () => navigate(`/station/${station.IDEESS}`, {
                state: {
                  gobackLink: "/mapa"
                }
              })
            }}
          >
            <Tooltip>
              <strong>{station['Rótulo']}</strong><br />
              {station['Dirección']}<br />
              {station['Municipio']}<br />
              {/* Precios añadidos */}
              Gasóleo A: <b>{station['Precio Gasoleo A']}</b> €<br />
              Gasolina 95 E5: <b>{station['Precio Gasolina 95 E5']}</b> €
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

export default FuelMap;
