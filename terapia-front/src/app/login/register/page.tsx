'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Heart, ArrowLeft } from 'lucide-react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useNotifications } from '@/contexts/notification-context';
import { UserRole } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.THERAPIST,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    } else if (formData.username.trim().length > 50) {
      newErrors.username = 'El nombre de usuario no puede tener más de 50 caracteres';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'El nombre completo debe tener al menos 2 caracteres';
    } else if (formData.fullName.trim().length > 255) {
      newErrors.fullName = 'El nombre completo no puede tener más de 255 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    } else if (formData.email.length > 100) {
      newErrors.email = 'El email no puede tener más de 100 caracteres';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (formData.password.length > 100) {
      newErrors.password = 'La contraseña no puede tener más de 100 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Debe contener mayúsculas, minúsculas y números';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      
      // Mostrar notificación de éxito
      showSuccess(
        '¡Cuenta creada exitosamente!',
        `Bienvenido ${formData.fullName}. Tu cuenta ha sido creada correctamente.`,
        3000
      );
      
      // Redirigir al login después de un breve delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error?.message || 'Error al crear la cuenta';
      
      // Mostrar notificación de error
      showError(
        'Error al crear la cuenta',
        errorMessage,
        5000
      );
      
      setErrors({
        general: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">
            Completa el formulario para registrarte
          </p>
        </div>

        {/* Formulario de registro */}
        <div className="bg-white rounded-lg shadow-lg border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}
            <Input
              label="Nombre de Usuario"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="juan.perez"
              error={!!errors.username}
              helperText={errors.username}
              required
              autoComplete="username"
            />

            <Input
              label="Nombre Completo"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Juan Pérez"
              error={!!errors.fullName}
              helperText={errors.fullName}
              required
              autoComplete="name"
            />

            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              error={!!errors.email}
              helperText={errors.email}
              required
              autoComplete="email"
            />

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-transparent focus:ring-blue-500"
              >
                <option value={UserRole.THERAPIST}>Terapeuta</option>
                <option value={UserRole.COORDINATOR}>Coordinador</option>
                <option value={UserRole.ADMIN}>Administrador</option>
              </select>
            </div>

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={!!errors.password}
              helperText={errors.password || "Mínimo 8 caracteres con mayúsculas, minúsculas y números"}
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Crear Cuenta
            </Button>
          </form>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
            </div>
          </div>

          {/* Link a login */}
          <Link href="/login">
            <Button
              type="button"
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio de sesión
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Al crear una cuenta, aceptas nuestros{' '}
          <Link href="#" className="text-blue-600 hover:underline">
            términos de servicio
          </Link>{' '}
          y{' '}
          <Link href="#" className="text-blue-600 hover:underline">
            política de privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}

