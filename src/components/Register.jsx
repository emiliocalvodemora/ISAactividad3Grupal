import { useState } from 'react';
import './Form.css';

/**
 * Componente de registro de usuarios
 * @returns {JSX.Element} Formulario de registro con validación básica
 */
function Register() {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Valida los campos del formulario
   * @returns {boolean} true si los campos son válidos
   */
  const validateForm = () => {
    if (!form.username.trim()) {
      setMessage({ text: 'El nombre de usuario es requerido', type: 'error' });
      return false;
    }
    if (!form.email.includes('@')) {
      setMessage({ text: 'Ingresa un email válido', type: 'error' });
      return false;
    }
    if (form.password.length < 6) {
      setMessage({ text: 'La contraseña debe tener al menos 6 caracteres', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      setMessage({ 
        text: data.message || '¡Registro exitoso! Por favor inicia sesión', 
        type: 'success' 
      });
      setForm({ username: '', email: '', password: '' }); // Reset form on success
    } catch (error) {
      setMessage({ 
        text: error.message || 'Error al registrar el usuario', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form" data-testid="register-form">
      <h2>Registro de Usuario</h2>
      
      <input
        name="username"
        placeholder="Usuario"
        value={form.username}
        onChange={handleChange}
        required
        minLength={3}
        data-testid="username-input"
      />
      
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        data-testid="email-input"
      />
      
      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        required
        minLength={6}
        data-testid="password-input"
      />
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        data-testid="submit-button"
      >
        {isSubmitting ? 'Registrando...' : 'Registrarse'}
      </button>
      
      {message.text && (
        <p className={`message ${message.type}`} data-testid="message">
          {message.text}
        </p>
      )}
    </form>
  );
}

export default Register;