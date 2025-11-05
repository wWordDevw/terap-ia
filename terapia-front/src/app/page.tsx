'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  Activity,
  BarChart3,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/bagde';
import { groupsService } from '@/lib/services/groups-service';
import { patientsService } from '@/lib/services/patients-service';
import { useToast } from '@/components/providers/toast-provider';
import { useAuthStore } from '@/store/auth-store';

// Configuración de animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function DashboardPage() {
  const { addToast } = useToast();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGrupos: 0,
    gruposActivos: 0,
    totalPacientes: 0,
    pacientesActivos: 0,
    asistenciaPromedio: 0,
    notasGeneradas: 0,
    proximasAltas: 0,
    sesionesHoy: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      // No cargar datos si el usuario no está autenticado
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Cargar grupos y pacientes en paralelo
        const [grupos, pacientes] = await Promise.all([
          groupsService.getAll(),
          patientsService.getActive()
        ]);

        // Calcular grupos activos
        const gruposActivos = grupos.filter(g => g.estado === 'Activo').length;

        // Calcular pacientes activos (sin discharge o discharge futuro)
        const today = new Date();
        const pacientesActivos = pacientes.filter(p => {
          if (!p.dischargeDate) return true;
          const dischargeDate = new Date(p.dischargeDate);
          return dischargeDate > today;
        }).length;

        // Calcular pacientes con discharge próximo (próximos 30 días)
        const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        const proximasAltas = pacientes.filter(p => {
          if (!p.dischargeDate) return false;
          const dischargeDate = new Date(p.dischargeDate);
          return dischargeDate >= today && dischargeDate <= in30Days;
        }).length;

        // Contar pacientes únicos en grupos activos
        const pacientesEnGrupos = new Set();
        grupos.filter(g => g.estado === 'Activo').forEach(grupo => {
          if (grupo.pacientesIds) {
            grupo.pacientesIds.forEach(patientId => pacientesEnGrupos.add(patientId));
          }
        });

        setStats({
          totalGrupos: grupos.length,
          gruposActivos,
          totalPacientes: pacientes.length,
          pacientesActivos,
          asistenciaPromedio: 0, // Por implementar cuando haya datos de asistencia
          notasGeneradas: 0, // Por implementar cuando haya endpoint de notas
          proximasAltas,
          sesionesHoy: 0 // Por implementar cuando haya datos de sesiones
        });
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        addToast('Error al cargar estadísticas', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, addToast]);

  const metricCards = [
    {
      title: 'Grupos Activos',
      value: stats.gruposActivos,
      total: stats.totalGrupos,
      icon: Users,
      color: 'blue',
      trend: stats.totalGrupos > 0 ? `${Math.round((stats.gruposActivos / stats.totalGrupos) * 100)}%` : '0%',
      trendUp: true,
      description: 'Total de grupos en operación'
    },
    {
      title: 'Pacientes Activos',
      value: stats.pacientesActivos,
      total: stats.totalPacientes,
      icon: UserCheck,
      color: 'green',
      trend: stats.totalPacientes > 0 ? `${Math.round((stats.pacientesActivos / stats.totalPacientes) * 100)}%` : '0%',
      trendUp: true,
      description: 'Pacientes en tratamiento'
    },
    {
      title: 'Asistencia Promedio',
      value: stats.asistenciaPromedio > 0 ? `${stats.asistenciaPromedio}%` : 'N/A',
      icon: CheckCircle,
      color: 'emerald',
      trend: stats.asistenciaPromedio > 0 ? '+3%' : 'Sin datos',
      trendUp: stats.asistenciaPromedio > 0 ? true : null,
      description: 'Índice de asistencia general'
    },
    {
      title: 'Notas Generadas',
      value: stats.notasGeneradas > 0 ? stats.notasGeneradas : 'N/A',
      icon: FileText,
      color: 'purple',
      trend: stats.notasGeneradas > 0 ? `+${stats.notasGeneradas}` : 'Sin datos',
      trendUp: stats.notasGeneradas > 0 ? true : null,
      description: 'Documentos creados este mes'
    },
    {
      title: 'Sesiones Hoy',
      value: stats.sesionesHoy > 0 ? stats.sesionesHoy : 'N/A',
      icon: Clock,
      color: 'orange',
      trend: stats.sesionesHoy > 0 ? '3 en curso' : 'Sin datos',
      trendUp: null,
      description: 'Sesiones programadas hoy'
    },
    {
      title: 'Próximas Altas',
      value: stats.proximasAltas,
      icon: TrendingUp,
      color: 'indigo',
      trend: 'Próximos 30 días',
      trendUp: null,
      description: 'Pacientes por dar de alta'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Bienvenido al Sistema de Gestión Terapéutica
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link href="/grupos/crear" className="flex-1 sm:flex-none">
            <Button className="w-full flex items-center justify-center gap-2 bg-sidebar-primary hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-sidebar-primary text-white transition-all duration-700 ease-in-out">
              <Plus className="w-4 h-4" />
              <span>Nuevo Grupo</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          const colorClasses = {
            blue: 'bg-blue-500 text-blue-600 bg-blue-50',
            green: 'bg-green-500 text-green-600 bg-green-50',
            emerald: 'bg-emerald-500 text-emerald-600 bg-emerald-50',
            purple: 'bg-purple-500 text-purple-600 bg-purple-50',
            orange: 'bg-orange-500 text-orange-600 bg-orange-50',
            indigo: 'bg-indigo-500 text-indigo-600 bg-indigo-50'
          };

          const [iconBg, textColor, cardBg] = colorClasses[metric.color as keyof typeof colorClasses].split(' ');

          return (
            <motion.div
              key={index}
              className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-200"
              variants={itemVariants}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${cardBg} dark:bg-opacity-20 p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${textColor} dark:text-opacity-80`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                          {metric.value}
                        </span>
                        {metric.total && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">/ {metric.total}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
                    {metric.trend && (
                      <div className={`flex items-center gap-1 text-xs font-medium ${
                        metric.trendUp === true ? 'text-green-600 dark:text-green-400' :
                        metric.trendUp === false ? 'text-red-600 dark:text-red-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {metric.trendUp === true && <ArrowUpRight className="w-3 h-3" />}
                        {metric.trendUp === false && <ArrowDownRight className="w-3 h-3" />}
                        <span>{metric.trend}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info Message when no data */}
      {stats.totalGrupos === 0 && stats.totalPacientes === 0 && (
        <motion.div
          className="glass-card rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800"
          variants={itemVariants}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Comienza a usar el sistema
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                No tienes grupos ni pacientes registrados aún. Comienza creando tu primer grupo para poder agregar pacientes y gestionar las sesiones terapéuticas.
              </p>
              <div className="flex gap-3">
                <Link href="/grupos/crear">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Grupo
                  </Button>
                </Link>
                <Link href="/pacientes/crear">
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Paciente
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        className="glass-card rounded-xl p-6"
        variants={itemVariants}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/grupos">
            <button className="w-full glass rounded-lg p-6 text-left transition-all duration-300 hover:shadow-md hover:scale-105">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-3" />
              <p className="text-base font-medium text-gray-900 dark:text-gray-100">Ver Grupos</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stats.gruposActivos} activos</p>
            </button>
          </Link>
          <Link href="/pacientes">
            <button className="w-full glass rounded-lg p-6 text-left transition-all duration-300 hover:shadow-md hover:scale-105">
              <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400 mb-3" />
              <p className="text-base font-medium text-gray-900 dark:text-gray-100">Ver Pacientes</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stats.pacientesActivos} activos</p>
            </button>
          </Link>
          <Link href="/grupos/crear">
            <button className="w-full glass rounded-lg p-6 text-left transition-all duration-300 hover:shadow-md hover:scale-105">
              <Plus className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-3" />
              <p className="text-base font-medium text-gray-900 dark:text-gray-100">Crear Grupo</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Nuevo grupo terapéutico</p>
            </button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
