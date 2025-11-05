'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

// Configuración para deshabilitar pre-renderizado estático
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // Validar token al cargar la página
    if (!token) {
      setTokenValid(false);
    }
    // Aquí podrías hacer una validación real del token con tu backend
  }, [token]);

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
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

    if (!token) {
      setErrors({ password: 'Token de recuperación no válido' });
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        token,
        password: formData.password,
      });
      setSuccess(true);

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      setErrors({
        password: error?.message || 'Error al restablecer la contraseña',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Si el token no es válido
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enlace Inválido
            </h1>
            <p className="text-gray-600">
              El enlace de recuperación no es válido o ha expirado
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg border p-8">
            <p className="text-gray-700 mb-6 text-center">
              Por favor, solicita un nuevo enlace de recuperación de contraseña.
            </p>

            <Link href="/login/forgot-password">
              <Button className="w-full">
                Solicitar nuevo enlace
              </Button>
            </Link>

            <div className="text-center mt-4">
              <Link 
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si la contraseña se restableció exitosamente
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Contraseña Restablecida!
            </h1>
            <p className="text-gray-600">
              Tu contraseña ha sido actualizada exitosamente
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg border p-8">
            <p className="text-gray-700 mb-6 text-center">
              Ahora puedes iniciar sesión con tu nueva contraseña.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 text-center">
                Serás redirigido al inicio de sesión en unos segundos...
              </p>
            </div>

            <Link href="/login">
              <Button className="w-full">
                Ir al inicio de sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de restablecimiento de contraseña
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Restablecer Contraseña
          </h1>
          <p className="text-gray-600">
            Ingresa tu nueva contraseña
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-lg border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Crea una contraseña segura con al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.
              </p>
            </div>

            <Input
              label="Nueva Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={!!errors.password}
              helperText={errors.password}
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirmar Nueva Contraseña"
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

            {/* Indicadores de fortaleza de contraseña */}
            {formData.password && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Requisitos de contraseña:</p>
                <div className="space-y-1">
                  <div className="flex items-center text-xs">
                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                      formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {formData.password.length >= 8 && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={formData.password.length >= 8 ? 'text-green-700' : 'text-gray-600'}>
                      Al menos 8 caracteres
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                      /(?=.*[A-Z])/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {/(?=.*[A-Z])/.test(formData.password) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-700' : 'text-gray-600'}>
                      Una letra mayúscula
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                      /(?=.*[a-z])/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {/(?=.*[a-z])/.test(formData.password) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-700' : 'text-gray-600'}>
                      Una letra minúscula
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                      /(?=.*\d)/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {/(?=.*\d)/.test(formData.password) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={/(?=.*\d)/.test(formData.password) ? 'text-green-700' : 'text-gray-600'}>
                      Un número
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              <Lock className="w-4 h-4 mr-2" />
              Restablecer Contraseña
            </Button>
          </form>

          {/* Link de regreso */}
          <div className="text-center mt-6">
            <Link 
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

