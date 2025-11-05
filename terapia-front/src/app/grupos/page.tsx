'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Eye, Edit, Archive, Users, AlertTriangle, X } from 'lucide-react';
import Badge from '@/components/ui/bagde';
import Button from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { groupsService } from '@/lib/services/groups-service';
import type { Grupo } from '@/lib/types';
import { useToast } from '@/components/providers/toast-provider';

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

export default function HomePage() {
  const { addToast } = useToast();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalArchivar, setModalArchivar] = useState<{
    isOpen: boolean;
    grupoId: string | null;
    grupoNombre: string;
  }>({
    isOpen: false,
    grupoId: null,
    grupoNombre: ''
  });

  // Cargar grupos desde el backend
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const data = await groupsService.getAll();
      setGrupos(data);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
      addToast('Error al cargar los grupos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchivar = (grupoId: string) => {
    const grupo = grupos.find(g => g.id === grupoId);
    if (grupo) {
      setModalArchivar({
        isOpen: true,
        grupoId,
        grupoNombre: grupo.clinica.nombre || 'Sin nombre'
      });
    }
  };

  const confirmarArchivar = async () => {
    if (modalArchivar.grupoId) {
      try {
        await groupsService.delete(modalArchivar.grupoId);
        addToast('Grupo archivado exitosamente', 'success');
        // Recargar grupos
        loadGroups();
      } catch (error) {
        console.error('Error al archivar grupo:', error);
        addToast('Error al archivar el grupo', 'error');
      }
      setModalArchivar({
        isOpen: false,
        grupoId: null,
        grupoNombre: ''
      });
    }
  };

  const cancelarArchivar = () => {
    setModalArchivar({
      isOpen: false,
      grupoId: null,
      grupoNombre: ''
    });
  };

  // Filtrar grupos activos
  const gruposActivos = grupos.filter(grupo => grupo.estado === 'Activo');
  const gruposArchivados = grupos.filter(grupo => grupo.estado === 'Archivado');

  // Manejar tecla Escape para cerrar modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalArchivar.isOpen) {
        cancelarArchivar();
      }
    };

    if (modalArchivar.isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modalArchivar.isOpen]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        variants={itemVariants}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Grupos Terapéuticos</h1>
        <div className="w-full sm:w-auto">
          <Link href="/grupos/crear" className="w-full sm:w-auto inline-block">
            <Button className="w-full flex items-center justify-center gap-2 bg-sidebar-primary hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-sidebar-primary text-white transition-all duration-700 ease-in-out">
              <Plus className="w-4 h-4" />
              <span>Crear Grupo</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {gruposActivos.map(grupo => (
            <motion.div
              key={grupo.id}
              className="glass-card rounded-lg p-6 hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {grupo.clinica.nombre || 'Sin nombre'}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={grupo.tipo.toLowerCase() as 'php' | 'iop'}>
                      {grupo.tipo}
                    </Badge>
                    <Badge variant="default">{grupo.turno}</Badge>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de inicio:</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(grupo.semanaInicio)}
                  {grupo.fechaCreacion && ` - ${formatDate(grupo.fechaCreacion)}`}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {grupo.pacientesIds?.length || 0} pacientes
                </span>
                <div className="flex space-x-2">
                  <Link
                    href={`/grupos/${grupo.id}`}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                    title="Ver grupo"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/grupos/${grupo.id}/editar`}
                    className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                    title="Editar grupo"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleArchivar(grupo.id)}
                    className="text-orange-600 hover:text-orange-800 p-1 rounded transition-colors"
                    title="Archivar grupo"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {gruposActivos.length === 0 && (
        <motion.div
          className="glass-card text-center py-12 rounded-lg"
          variants={itemVariants}
        >
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No hay grupos todavía</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Comienza creando tu primer grupo terapéutico</p>
          <Link href="/grupos/crear" className="inline-block">
            <Button className="bg-sidebar-primary hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-sidebar-primary text-white transition-all duration-700 ease-in-out">
              <Plus className="w-4 h-4 mr-2" />
              Crear primer grupo
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Sección de grupos archivados */}
      {!isLoading && gruposArchivados.length > 0 && (
        <motion.div
          className="mt-8 sm:mt-12"
          variants={itemVariants}
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center">
            <Archive className="w-5 h-5 mr-2" />
            Grupos Archivados ({gruposArchivados.length})
          </h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {gruposArchivados.map(grupo => (
              <motion.div
                key={grupo.id}
                className="glass rounded-lg p-6 opacity-75"
                variants={itemVariants}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {grupo.clinica.nombre || 'Sin nombre'}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={grupo.tipo.toLowerCase() as 'php' | 'iop'}>
                        {grupo.tipo}
                      </Badge>
                      <Badge variant="default">{grupo.turno}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Creado el {formatDate(grupo.fechaCreacion)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {grupo.pacientesIds?.length || 0} pacientes
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={async () => {
                        try {
                          await groupsService.update(grupo.id, { isActive: true });
                          addToast('Grupo restaurado exitosamente', 'success');
                          loadGroups();
                        } catch (error) {
                          console.error('Error al restaurar grupo:', error);
                          addToast('Error al restaurar el grupo', 'error');
                        }
                      }}
                      className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                      title="Restaurar grupo"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Modal de confirmación para archivar */}
      {modalArchivar.isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={cancelarArchivar}
        >
          <div
            className="glass-card rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Archivar Grupo
                </h3>
              </div>
              <button
                onClick={cancelarArchivar}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                ¿Estás seguro de que quieres archivar el grupo{' '}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  "{modalArchivar.grupoNombre}"
                </span>?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                El grupo se moverá a la sección de grupos archivados y podrás restaurarlo más tarde si es necesario.
              </p>

              {/* Botones del modal */}
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={cancelarArchivar}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </Button>
                <Button
                  onClick={confirmarArchivar}
                  className="bg-orange-600 hover:bg-orange-700 text-white flex items-center space-x-2"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archivar Grupo</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}