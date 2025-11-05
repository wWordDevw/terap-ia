'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'therapist' as 'admin' | 'therapist' | 'nurse',
  });

  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  // Redirigir si ya esta autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const errors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    };

    // Validar username
    if (!formData.username) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    // Validar email
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email invalido';
    }

    // Validar password
    if (!formData.password) {
      errors.password = 'La contrasena es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contrasena debe tener al menos 8 caracteres';
    }

    // Validar confirmPassword
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Debes confirmar la contrasena';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contrasenas no coinciden';
    }

    // Validar fullName
    if (!formData.fullName) {
      errors.fullName = 'El nombre completo es requerido';
    }

    setValidationErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      router.push('/');
    } catch (err) {
      console.error('Error al registrar usuario:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error de validacion cuando el usuario escribe
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Crear Cuenta
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">Registrate en el sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de usuario
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={validationErrors.username ? 'border-red-500' : ''}
                placeholder="usuario123"
              />
              {validationErrors.username && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={validationErrors.email ? 'border-red-500' : ''}
                placeholder="tu@email.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre completo
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className={validationErrors.fullName ? 'border-red-500' : ''}
                placeholder="Juan Perez"
              />
              {validationErrors.fullName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rol
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="therapist">Terapeuta</option>
                <option value="nurse">Enfermera</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contrasena
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={validationErrors.password ? 'border-red-500' : ''}
                placeholder="••••••••"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar contrasena
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={validationErrors.confirmPassword ? 'border-red-500' : ''}
                placeholder="••••••••"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Error del servidor */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Boton de submit */}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>

            {/* Link a login */}
            <div className="text-center text-sm pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Ya tienes una cuenta? </span>
              <a href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                Inicia sesion
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
