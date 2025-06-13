import { useState } from 'react';
import './Form.css';
import React from 'react';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMsg('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    setError('');

    if (!form.username || !form.email || !form.password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error en el registro');

      setMsg(data.message);
      setForm({ username: '', email: '', password: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='register-form'>
      <h2>Registro de Usuario</h2>
      <input name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
      <button type="submit">Registrarse</button>
      {msg && <p className="success">{msg}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default Register;
