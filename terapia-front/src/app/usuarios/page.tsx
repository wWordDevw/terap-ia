'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AdminRouteProvider } from '@/components/providers/admin-route-provider';
import {
  UserCog,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  Shield,
  Eye,
  Edit,
  UserX,
  UserCheck,
  Download,
  X
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/bagde';
import Input from '@/components/ui/input';
import { usersService, type User } from '@/lib/services/users-service';
import { clinicsService, type Clinic } from '@/lib/services/clinics-service';
import { useToast } from '@/components/providers/toast-provider';
import type { UserRole } from '@/lib/types';

type FilterStatus = 'all' | 'active' | 'inactive';
type FilterRole = 'all' | UserRole;

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

export default function UsuariosPage() {
  const { addToast } = useToast();
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterRole, setFilterRole] = useState<FilterRole>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<string>('all');

  // Cargar usuarios y clínicas
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [usersData, clinicsData] = await Promise.all([
        usersService.getUsers(),
        clinicsService.getAll()
      ]);
      setUsuarios(usersData);
      setClinics(clinicsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      addToast('Error al cargar los datos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const estadisticas = useMemo(() => {
    const total = usuarios.length;
    const activos = usuarios.filter(u => u.isActive).length;
    const admins = usuarios.filter(u => u.role === 'admin' && u.isActive).length;
    const therapists = usuarios.filter(u => u.role === 'therapist' && u.isActive).length;
    const nurses = usuarios.filter(u => u.role === 'nurse' && u.isActive).length;

    return {
      total,
      activos,
      admins,
      therapists,
      nurses
    };
  }, [usuarios]);

  const clinicasUnicas = useMemo(() => {
    return clinics;
  }, [clinics]);

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(usuario => {
      const matchSearch =
        usuario.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (filterStatus === 'active' && !usuario.isActive) return false;
      if (filterStatus === 'inactive' && usuario.isActive) return false;

      if (filterRole !== 'all' && usuario.role !== filterRole) return false;

      if (selectedClinic !== 'all' && usuario.clinicId !== selectedClinic) {
        return false;
      }

      return true;
    });
  }, [usuarios, searchTerm, filterStatus, filterRole, selectedClinic]);

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await usersService.updateUser(userId, { isActive: !currentStatus });
      addToast(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`, 'success');
      loadData();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      addToast('Error al actualizar el usuario', 'error');
    }
  };

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

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statsCards = [
    {
      title: 'Total Usuarios',
      value: estadisticas.total,
      icon: UserCog,
      color: 'blue',
      description: 'En el sistema'
    },
    {
      title: 'Usuarios Activos',
      value: estadisticas.activos,
      icon: CheckCircle,
      color: 'green',
      description: 'Pueden acceder'
    },
    {
      title: 'Terapeutas',
      value: estadisticas.therapists,
      icon: Shield,
      color: 'purple',
      description: 'Rol terapeuta'
    },
    {
      title: 'Administradores',
      value: estadisticas.admins,
      icon: AlertCircle,
      color: 'red',
      description: 'Acceso completo'
    }
  ];

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
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Gestion de Usuarios</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link href="/usuarios/crear" className="flex-1 sm:flex-none">
            <Button className="w-full flex items-center justify-center gap-2 bg-sidebar-primary hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-sidebar-primary text-white transition-all duration-700 ease-in-out">
              <Plus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
            green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
            purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
            red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
          };

          return (
            <motion.div
              key={index}
              className="glass-card rounded-lg p-4 hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <div className={`inline-flex p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="glass-card rounded-lg p-4"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, usuario o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            {showFilters && <X className="w-4 h-4" />}
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'Todos' },
                    { value: 'active', label: 'Activos' },
                    { value: 'inactive', label: 'Inactivos' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilterStatus(option.value as FilterStatus)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        filterStatus === option.value
                          ? 'bg-sidebar-primary text-white border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rol
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as FilterRole)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">Todos los roles</option>
                  <option value="admin">Administrador</option>
                  <option value="therapist">Terapeuta</option>
                  <option value="nurse">Enfermera/o</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Clinica
                </label>
                <select
                  value={selectedClinic}
                  onChange={(e) => setSelectedClinic(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">Todas las clinicas</option>
                  {clinicasUnicas.map((clinica) => (
                    <option key={clinica.id} value={clinica.id}>
                      {clinica.clinicName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando <span className="font-semibold">{usuariosFiltrados.length}</span> de{' '}
          <span className="font-semibold">{usuarios.length}</span> usuarios
        </p>
        {usuariosFiltrados.length > 0 && (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <motion.div
            className="glass-card rounded-lg p-8 text-center"
            variants={itemVariants}
          >
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Cargando usuarios...</p>
          </motion.div>
        ) : usuariosFiltrados.length === 0 ? (
          <motion.div
            className="glass-card rounded-lg p-8 text-center"
            variants={itemVariants}
          >
            <UserCog className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No se encontraron usuarios</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all' || filterRole !== 'all' || selectedClinic !== 'all'
                ? 'Intenta ajustar los filtros de busqueda'
                : 'Agrega tu primer usuario para comenzar'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterRole === 'all' && selectedClinic === 'all' && (
              <Link href="/usuarios/crear">
                <Button className="mt-4 bg-sidebar-primary hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-sidebar-primary text-white transition-all duration-700 ease-in-out">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Usuario
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          usuariosFiltrados.map((usuario) => {
            return (
              <motion.div
                key={usuario.id}
                className="glass-card rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all"
                variants={itemVariants}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 ${
                          usuario.role === 'admin'
                            ? 'bg-gradient-to-br from-red-500 to-pink-600'
                            : usuario.role === 'therapist'
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                            : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        } rounded-full flex items-center justify-center`}>
                          <span className="text-white font-semibold text-lg">
                            {usuario.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {usuario.fullName}
                          </h3>
                          <Badge
                            variant={getRoleBadgeVariant(usuario.role)}
                            className="text-xs"
                          >
                            {getRoleLabel(usuario.role)}
                          </Badge>
                          <Badge
                            variant={usuario.isActive ? 'success' : 'default'}
                            className="text-xs"
                          >
                            {usuario.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">@{usuario.username}</span>
                          <span>"</span>
                          <span>{usuario.email}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                          {usuario.createdAt && (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Creado: {new Date(usuario.createdAt).toLocaleDateString('es-ES')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2">
                    <Link href={`/usuarios/${usuario.id}`} className="flex-1 lg:flex-none">
                      <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Ver</span>
                      </Button>
                    </Link>
                    <Link href={`/usuarios/${usuario.id}/editar`} className="flex-1 lg:flex-none">
                      <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Editar</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(usuario.id, usuario.isActive)}
                      className={`flex-1 lg:flex-none flex items-center justify-center gap-2 ${
                        usuario.isActive
                          ? 'text-red-600 hover:text-red-700 hover:border-red-600'
                          : 'text-green-600 hover:text-green-700 hover:border-green-600'
                      }`}
                    >
                      {usuario.isActive ? (
                        <>
                          <UserX className="w-4 h-4" />
                          <span className="hidden sm:inline">Desactivar</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span className="hidden sm:inline">Activar</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      </motion.div>
    </AdminRouteProvider>
  );
}
