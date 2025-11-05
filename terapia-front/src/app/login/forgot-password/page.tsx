'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Heart, ArrowLeft, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

// Configuración para deshabilitar pre-renderizado estático
export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('El email es requerido');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email inválido');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setLoading(true);

    try {
      await forgotPassword({ email });
      setEmailSent(true);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setError(error?.message || 'Error al enviar el email de recuperación');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Email Enviado
            </h1>
            <p className="text-gray-600">
              Revisa tu bandeja de entrada
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg border p-8">
            <p className="text-gray-700 mb-6 text-center">
              Hemos enviado un enlace de recuperación a{' '}
              <span className="font-semibold text-gray-900">{email}</span>
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Nota:</strong> Si no ves el correo en unos minutos, revisa tu carpeta de spam o correo no deseado.
              </p>
            </div>

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

            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                ¿No recibiste el correo? Intenta de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-gray-600">
            Te enviaremos un enlace para restablecerla
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-lg border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
              </p>
            </div>

            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="tu@email.com"
              error={!!error}
              helperText={error}
              required
              autoComplete="email"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar enlace de recuperación
            </Button>
          </form>

          {/* Link de regreso */}
          <div className="mt-6">
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
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Necesitas ayuda?{' '}
          <Link href="#" className="text-blue-600 hover:underline">
            Contacta con soporte
          </Link>
        </p>
      </div>
    </div>
  );
}

