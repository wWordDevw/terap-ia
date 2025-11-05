'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  X
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/bagde';
import Input from '@/components/ui/input';
import { patientsService, type Patient } from '@/lib/services/patients-service';
import { useToast } from '@/components/providers/toast-provider';

type FilterStatus = 'all' | 'activos' | 'alta' | 'proxima-alta';

// Configuración de animaciones
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

export default function PacientesPage() {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<string>('all');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar pacientes desde la API
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setIsLoading(true);
        const data = await patientsService.getAll();
        setPatients(data);
      } catch (error) {
        console.error('Error al cargar pacientes:', error);
        addToast('Error al cargar los pacientes', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, [addToast]);

  // Calcular estadísticas de los pacientes reales
  const estadisticas = useMemo(() => {
    const activos = patients.filter(p => !p.dischargeDate).length;
    const conAlta = patients.filter(p => p.dischargeDate).length;
    const conDocumentos = patients.filter(p => p.documents && p.documents.length > 0).length;

    return {
      total: patients.length,
      activos,
      conAlta,
      conDocumentos
    };
  }, [patients]);

  // Obtener lista única de seguros
  const segurosUnicos = useMemo(() => {
    // Por ahora, retornar solo 'all' ya que el modelo Patient no tiene campo seguro
    return ['all'];
  }, []);

  // Filtrar pacientes
  const pacientesFiltrados = useMemo(() => {
    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    return patients.filter(patient => {
      // Filtro de búsqueda
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      const matchSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        patient.patientNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.diagnoses && patient.diagnoses.some(d =>
          d.icd10Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.diagnosisDescription.toLowerCase().includes(searchTerm.toLowerCase())
        ));

      if (!matchSearch) return false;

      // Filtro de estado
      if (filterStatus === 'activos') {
        return !patient.dischargeDate || new Date(patient.dischargeDate) > today;
      } else if (filterStatus === 'alta') {
        return patient.dischargeDate && new Date(patient.dischargeDate) <= today;
      } else if (filterStatus === 'proxima-alta') {
        if (!patient.dischargeDate) return false;
        const dischargeDate = new Date(patient.dischargeDate);
        return dischargeDate >= today && dischargeDate <= in30Days;
      }

      return true;
    });
  }, [searchTerm, filterStatus, patients]);

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const calcularDiasPrograma = (fechaIngreso: string) => {
    const hoy = new Date();
    const ingreso = new Date(fechaIngreso);
    const diff = hoy.getTime() - ingreso.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getEstadoPaciente = (patient: Patient) => {
    if (!patient.dischargeDate) return { label: 'Activo', color: 'green' };
    const dischargeDate = new Date(patient.dischargeDate);
    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (dischargeDate <= today) {
      return { label: 'Alta', color: 'gray' };
    } else if (dischargeDate <= in30Days) {
      return { label: 'Próxima Alta', color: 'orange' };
    }
    return { label: 'Activo', color: 'green' };
  };

  const statsCards = [
    {
      title: 'Total Pacientes',
      value: estadisticas.total,
      icon: Users,
      color: 'blue',
      description: 'En el sistema'
    },
    {
      title: 'Pacientes Activos',
      value: estadisticas.activos,
      icon: CheckCircle,
      color: 'green',
      description: 'En tratamiento'
    },
    {
      title: 'Con Documentos',
      value: estadisticas.conDocumentos,
      icon: FileText,
      color: 'purple',
      description: 'Archivos adjuntos'
    },
    {
      title: 'Dados de Alta',
      value: estadisticas.conAlta,
      icon: AlertCircle,
      color: 'gray',
      description: 'Completados'
    }
  ];

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Pacientes</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Gestión de pacientes del sistema
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link href="/pacientes/crear" className="flex-1 sm:flex-none">
            <Button className="w-full flex items-center justify-center gap-2 bg-sidebar-primary hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-sidebar-primary text-white transition-all duration-700 ease-in-out">
              <Plus className="w-4 h-4" />
              <span>Nuevo Paciente</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
            gray: 'bg-gray-50 text-gray-600'
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

      {/* Filters and Search */}
      <motion.div
        className="glass-card rounded-lg p-4"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, número clínica o diagnóstico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Filter Toggle Button */}
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

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'Todos' },
                    { value: 'activos', label: 'Activos' },
                    { value: 'proxima-alta', label: 'Próxima Alta' },
                    { value: 'alta', label: 'Dados de Alta' }
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

              {/* Insurance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Seguro
                </label>
                <select
                  value={selectedInsurance}
                  onChange={(e) => setSelectedInsurance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {segurosUnicos.map((seguro) => (
                    <option key={seguro} value={seguro}>
                      {seguro === 'all' ? 'Todos los seguros' : seguro}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Results Counter */}
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando <span className="font-semibold">{pacientesFiltrados.length}</span> de{' '}
          <span className="font-semibold">{patients.length}</span> pacientes
        </p>
        {pacientesFiltrados.length > 0 && (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        )}
      </motion.div>

      {/* Patients List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <motion.div
            className="glass-card rounded-lg p-8 text-center"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Cargando pacientes...</p>
          </motion.div>
        ) : pacientesFiltrados.length === 0 ? (
          <motion.div
            className="glass-card rounded-lg p-8 text-center"
            variants={itemVariants}
          >
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No se encontraron pacientes</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {searchTerm || filterStatus !== 'all' || selectedInsurance !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Agrega tu primer paciente para comenzar'}
            </p>
            {!searchTerm && filterStatus === 'all' && selectedInsurance === 'all' && (
              <Link href="/pacientes/crear">
                <Button className="mt-4 bg-sidebar-primary hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-sidebar-primary text-white transition-all duration-700 ease-in-out">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Paciente
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          pacientesFiltrados.map((patient) => {
            const estado = getEstadoPaciente(patient);
            const edad = calcularEdad(patient.dateOfBirth);
            const diasPrograma = calcularDiasPrograma(patient.admissionDate);
            const diagnosticoPrimario = patient.diagnoses?.find(d => d.isPrimary);

            const fullName = `${patient.firstName} ${patient.lastName}`;
            const initials = `${patient.firstName[0]}${patient.lastName[0]}`;

            return (
              <motion.div
                key={patient.id}
                className="glass-card rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all"
                variants={itemVariants}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {initials}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {fullName}
                          </h3>
                          <Badge
                            variant={
                              estado.color === 'green' ? 'success' :
                              estado.color === 'orange' ? 'warning' :
                              'default'
                            }
                            className="text-xs"
                          >
                            {estado.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{patient.patientNumber}</span>
                          <span>•</span>
                          <span>{edad} años</span>
                          <span>•</span>
                          <span>{diasPrograma} días en programa</span>
                        </div>
                        {diagnosticoPrimario && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-medium">
                              {diagnosticoPrimario.icd10Code} - {diagnosticoPrimario.diagnosisDescription}
                            </span>
                          </div>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Ingreso: {new Date(patient.admissionDate).toLocaleDateString('es-ES')}
                          </span>
                          {patient.dischargeDate && (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Alta: {new Date(patient.dischargeDate).toLocaleDateString('es-ES')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-2">
                    <Link href={`/pacientes/${patient.id}`} className="flex-1 lg:flex-none">
                      <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Ver</span>
                      </Button>
                    </Link>
                    <Link href={`/pacientes/${patient.id}/editar`} className="flex-1 lg:flex-none">
                      <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Editar</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
