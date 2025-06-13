import React from 'react';

// Calcula la media de un tipo de combustible
function calculateAverage(stations, fuelKey) {
  const values = stations
    .map(station => Number(station[fuelKey]?.replace(',', '.')))
    .filter(price => !isNaN(price) && price > 0);

  if (values.length === 0) return null;
  const avg = values.reduce((sum, price) => sum + price, 0) / values.length;
  return avg.toFixed(3);
}

const fuelTypes = [
  { key: 'Precio Gasolina 95 E5', label: 'Gasolina 95 E5' },
  { key: 'Precio Gasoleo A', label: 'Gasóleo A' },
];

export default function AveragePrice({ stations, mode = "card" }) {
  if (mode === "inline") {
    return (
      <div
        style={{
          fontSize: '1em',
          color: '#111',
          fontWeight: 500,
          background: '#f8fafb',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          width: 'fit-content',
          fontFamily: 'inherit'
        }}
      >
        <span style={{
          color: '#194376',
          fontWeight: 500,   // igual que el filtro
          fontSize: '1em',   // igual que el filtro
          letterSpacing: 'normal',
          fontFamily: 'inherit'
        }}>
          Precio medio nacional:
        </span>
        {fuelTypes.map(ft => {
          const avg = calculateAverage(stations, ft.key);
          return (
            <span key={ft.key} style={{ marginLeft: 8 }}>
              {ft.label}: <span style={{ color: '#097138', fontWeight: 600 }}>{avg ? `${avg} €` : 'N/A'}</span>
            </span>
          );
        })}
      </div>
    );
  }

  // Tarjeta vertical clásica, por si la quieres usar en otra vista
  return (
    <div
      style={{
        margin: '2rem auto 1.5rem auto',
        background: 'white',
        borderRadius: '18px',
        maxWidth: 350,
        boxShadow: '0 8px 32px #0002',
        padding: '1.3rem 2rem',
        textAlign: 'center',
        border: '1px solid #e5e5e5',
      }}
    >
      <h3
        style={{
          color: '#194376',
          marginBottom: '1.1rem',
          fontWeight: 700,
          letterSpacing: '.03em',
        }}
      >
        Precio medio nacional
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {fuelTypes.map(ft => {
          const avg = calculateAverage(stations, ft.key);
          return (
            <div key={ft.key} style={{ fontSize: '1.15em', fontWeight: 500 }}>
              <span style={{ color: '#2b3b4d', fontWeight: 700 }}>{ft.label}</span> <br />
              <span style={{ color: '#097138', fontWeight: 700 }}>
                {avg ? `${avg} €` : 'N/A'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
