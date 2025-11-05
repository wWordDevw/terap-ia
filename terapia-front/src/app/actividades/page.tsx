'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Clock, Search } from 'lucide-react';
import { useToast } from '@/components/providers/toast-provider';
import { activitiesService, type Activity } from '@/lib/services/activities-service';
import ActivityForm from '@/components/activities/activity-form';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/bagde';

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
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function ActividadesPage() {
  const { addToast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Cargar actividades
  const loadActivities = async () => {
    try {
      setIsLoading(true);
      const data = await activitiesService.getAll();
      setActivities(data);
      setFilteredActivities(data);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      addToast('Error al cargar las actividades', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  // Filtrar actividades
  useEffect(() => {
    if (!searchTerm) {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter(activity =>
        activity.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredActivities(filtered);
    }
  }, [searchTerm, activities]);

  const handleCreate = () => {
    setEditingActivity(null);
    setShowForm(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDelete = async (activity: Activity) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la actividad "${activity.activityName}"?`)) {
      return;
    }

    try {
      await activitiesService.delete(activity.id);
      addToast('Actividad eliminada exitosamente', 'success');
      loadActivities();
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      addToast('Error al eliminar la actividad', 'error');
    }
  };

  const handleFormSuccess = (activity: Activity) => {
    setShowForm(false);
    setEditingActivity(null);
    loadActivities();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando actividades...</p>
        </div>
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
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Gestión de Actividades
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Administra las actividades terapéuticas disponibles
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Actividad
        </Button>
      </motion.div>

      {/* Búsqueda */}
      <motion.div variants={itemVariants}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar actividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Lista de actividades */}
      <motion.div variants={itemVariants}>
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm ? 'No se encontraron actividades' : 'No hay actividades registradas'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Crea tu primera actividad para comenzar'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Actividad
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                className="glass-card rounded-lg p-6 hover:shadow-lg transition-shadow"
                variants={itemVariants}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {activity.activityName}
                      </h3>
                      <Badge 
                        variant={activity.isActive ? 'green' : 'gray'}
                        size="sm"
                      >
                        {activity.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    
                    {activity.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {activity.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {activity.defaultTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Hora: {activity.defaultTime}</span>
                        </div>
                      )}
                      <span>
                        Creada: {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(activity)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(activity)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <ActivityForm
              activity={editingActivity || undefined}
              isEditing={!!editingActivity}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
