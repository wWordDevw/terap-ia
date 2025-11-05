'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Mail,
  Shield,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/bagde';
import { AdminRouteProvider } from '@/components/providers/admin-route-provider';
import { usersService, type User as UserType } from '@/lib/services/users-service';
import { clinicsService, type Clinic } from '@/lib/services/clinics-service';
import { useToast } from '@/components/providers/toast-provider';
import type { UserRole } from '@/lib/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function UsuarioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [usuario, setUsuario] = useState<UserType | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const userId = params.id as string;

        if (!userId) {
          addToast('ID de usuario no válido', 'error');
          router.push('/usuarios');
          return;
        }

        const userData = await usersService.getUser(userId);
        setUsuario(userData);

        // Cargar información de la clínica si existe
        if (userData.clinicId) {
          const clinicData = await clinicsService.getById(userData.clinicId);
          setClinic(clinicData);
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        addToast('Error al cargar el usuario', 'error');
        router.push('/usuarios');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadUser();
    }
  }, [params.id, router, addToast]);

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'therapist':
        return 'success';
      case 'nurse':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'therapist':
        return 'Terapeuta';
      case 'nurse':
        return 'Enfermera/o';
      default:
        return role;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Nunca';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} dia${diffDays > 1 ? 's' : ''}`;

    return formatDate(lastLogin);
  };

  if (isLoading) {
    return (
      <AdminRouteProvider>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando usuario...</p>
          </div>
        </div>
      </AdminRouteProvider>
    );
  }

  if (!usuario) {
    return (
      <AdminRouteProvider>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/usuarios">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
          <div className="glass-card rounded-lg p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Usuario no encontrado</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              El usuario que buscas no existe o fue eliminado.
            </p>
            <Link href="/usuarios">
              <Button>Volver a Usuarios</Button>
            </Link>
          </div>
        </div>
      </AdminRouteProvider>
    );
  }

  return (
    <AdminRouteProvider>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <div className="w-full">
          <Link
            href="/usuarios"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a usuarios
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className={`w-16 h-16 ${
              usuario.role === 'admin'
                ? 'bg-gradient-to-br from-red-500 to-pink-600'
                : usuario.role === 'therapist'
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : 'bg-gradient-to-br from-blue-500 to-cyan-600'
            } rounded-full flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-semibold text-2xl">
                {usuario.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {usuario.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant={getRoleBadgeVariant(usuario.role)}>
                  {getRoleLabel(usuario.role)}
                </Badge>
                <Badge variant={usuario.isActive ? 'success' : 'default'}>
                  {usuario.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <Link href={`/usuarios/${usuario.id}/editar`} className="w-full sm:w-auto inline-block">
            <Button className="w-full flex items-center justify-center gap-2 bg-sidebar-primary hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-sidebar-primary text-white transition-all duration-700 ease-in-out">
              <Edit className="w-4 h-4" />
              <span>Editar Usuario</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Informacion Personal
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nombre Completo</p>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {usuario.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nombre de Usuario</p>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                    @{usuario.username}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </p>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {usuario.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Rol
                  </p>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {getRoleLabel(usuario.role)}
                  </p>
                </div>

                {clinic && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      Clinica
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {clinic.clinicName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Actividad
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Ultimo acceso</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatLastLogin(usuario.lastLogin)}
                  </p>
                </div>
              </div>

              {usuario.createdAt && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Fecha de creacion</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(usuario.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {usuario.updatedAt && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Ultima actualizacion</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(usuario.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Informacion del Sistema
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full ${usuario.isActive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'} flex items-center justify-center`}>
                    {usuario.isActive ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {usuario.isActive ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {usuario.isActive
                      ? 'Puede acceder al sistema'
                      : 'Sin acceso al sistema'}
                  </p>
                </div>
              </div>

              {clinic && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Clinica Asignada</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {clinic.clinicName}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Tipo de Rol</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {getRoleLabel(usuario.role)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </motion.div>
    </AdminRouteProvider>
  );
}
