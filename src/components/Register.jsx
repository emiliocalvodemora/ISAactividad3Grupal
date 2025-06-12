import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// === Componente Register ===
export function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  // Manejador del cambio en inputs
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejador del envío del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMsg(data.message || 'Registro exitoso');
    } catch (error) {
      setMsg('Error de conexión con el servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="register-form">
      <h2>Registro de Usuario</h2>
      <input
        name="username"
        placeholder="Usuario"
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        onChange={handleChange}
        required
      />
      <button type="submit">Registrarse</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}

// === Pruebas unitarias ===
describe('Register Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ message: 'Usuario registrado con éxito' }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza todos los campos y el botón', () => {
    render(<Register />);
    expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  test('envía el formulario correctamente y muestra mensaje de éxito', async () => {
    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText('Usuario'), {
      target: { value: 'juan' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'juan@correo.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() =>
      expect(
        screen.getByText('Usuario registrado con éxito')
      ).toBeInTheDocument()
    );
  });

  test('muestra mensaje de error si falla el fetch', async () => {
    global.fetch = jest.fn(() => Promise.reject('Error de red'));

    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText('Usuario'), {
      target: { value: 'ana' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'ana@correo.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'abcdef' },
    });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() =>
      expect(
        screen.getByText('Error de conexión con el servidor')
      ).toBeInTheDocument()
    );
  });
});

