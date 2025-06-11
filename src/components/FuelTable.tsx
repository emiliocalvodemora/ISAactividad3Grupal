import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AveragePrice from './AveragePrice';
import './FuelTable.css';

const PAGE_SIZE = 20;

const FuelTable = ({ stations }: { stations: any[] }) => {
  // Filtros y orden
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [sortField, setSortField] = useState<string>('Precio Gasoleo A');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Provincias y ciudades únicas
  const provinces = useMemo(
    () => Array.from(new Set(stations.map(s => s.Provincia))).sort() as string[],
    [stations]
  );
  const cities = useMemo(
    () =>
      Array.from(
        new Set(
          stations
            .filter(s => !selectedProvince || s.Provincia === selectedProvince)
            .map(s => s.Municipio)
        )
      ).sort() as string[],
    [stations, selectedProvince]
  );

  // Filtrado
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      const matchProvince = !selectedProvince || station.Provincia === selectedProvince;
      const matchCity = !selectedCity || station.Municipio === selectedCity;
      const matchFuel =
        !selectedFuel ||
        (station[selectedFuel] && station[selectedFuel].replace(',', '.') !== '' && station[selectedFuel] !== '-');
      return matchProvince && matchCity && matchFuel;
    });
  }, [stations, selectedProvince, selectedCity, selectedFuel]);

  // Ordenación
  const sortedStations = useMemo(() => {
    if (!selectedFuel) return filteredStations;
    return [...filteredStations].sort((a, b) => {
      const aVal = parseFloat((a[sortField] || '0').replace(',', '.')) || 0;
      const bVal = parseFloat((b[sortField] || '0').replace(',', '.')) || 0;
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filteredStations, sortField, sortOrder, selectedFuel]);

  // Paginación
  const totalPages = Math.ceil(sortedStations.length / PAGE_SIZE);
  const paginatedStations = sortedStations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Cambiar orden
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Reset página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProvince, selectedCity, selectedFuel]);

  // --- CONTENIDO ---
  return (
    <div>
      <h2>Precios de combustibles en gasolineras españolas</h2>
      {/* Contenedor para filtros + resumen alineados horizontalmente */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          gap: '2rem',
          flexWrap: 'nowrap'
        }}
      >
        {/* Filtros en una sola fila */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'nowrap' }}>
          <select
            value={selectedProvince}
            onChange={e => setSelectedProvince(e.target.value)}
            style={{ minWidth: 170, height: 30 }}
          >
            <option value="">Provincia</option>
            {provinces.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            style={{ minWidth: 220, height: 30 }}
          >
            <option value="">Ciudad</option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={selectedFuel}
            onChange={e => setSelectedFuel(e.target.value)}
            style={{ minWidth: 160, height: 30 }}
          >
            <option value="">Tipo de combustible</option>
            <option value="Precio Gasoleo A">Gasóleo A</option>
            <option value="Precio Gasolina 95 E5">Gasolina 95 E5</option>
          </select>
        </div>
        {/* Resumen precios medios a la derecha */}
        <div style={{ flex: '0 0 auto' }}>
          <AveragePrice stations={stations} mode="inline" />
        </div>
      </div>

      {/* TABLA */}
      <table className="fuel-table">
        <thead>
          <tr>
            <th className="gasolinera-col">Gasolinera</th>
            <th className="direccion-col">Dirección</th>
            <th className="municipio-col">Municipio</th>
            <th className="price-col">
              <button
                className="sortable"
                onClick={() => handleSort('Precio Gasoleo A')}
              >
                Gasóleo A {sortField === 'Precio Gasoleo A' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </button>
            </th>
            <th className="price-col">
              <button
                className="sortable"
                onClick={() => handleSort('Precio Gasolina 95 E5')}
              >
                Gasolina 95 E5 {sortField === 'Precio Gasolina 95 E5' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </button>
            </th>
            <th className="detalle-col">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStations.map((station, idx) => (
            <tr key={station.IDEESS || idx}>
              <td className="gasolinera-col">{station['Rótulo']}</td>
              <td className="direccion-col">{station['Dirección']}</td>
              <td className="municipio-col">{station['Municipio']}</td>
              <td className="price-col">{station['Precio Gasoleo A']}</td>
              <td className="price-col">{station['Precio Gasolina 95 E5']}</td>
              <td className="detalle-col">
                <Link
                  to={`/station/${station.IDEESS}`}
                  state={{
                    gobackLink: "/lista"
                  }}
                >
                  Ver detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Paginación */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          {'<<'}
        </button>
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
          {'<'}
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
          {'>'}
        </button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
          {'>>'}
        </button>
      </div>
    </div>
  );
};

export default FuelTable;
