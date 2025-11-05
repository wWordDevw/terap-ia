'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X } from 'lucide-react';
import Button from '@/components/ui/button';
import { getGrupoById } from '@/data/mock-grupos';
import { TIPOS_PROGRAMA } from '@/lib/constants';
import type { Grupo } from '@/lib/types';
import { useToast } from '@/components/providers/toast-provider';

export default function EditarGrupoPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const grupoId = params.id as string;
  
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'PHP' as 'PHP' | 'IOP',
    turno: 'Mañana',
    clinica: {
      nombre: '',
      direccion: '',
      telefono: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const grupoData = getGrupoById(grupoId);
    if (grupoData) {
      setGrupo(grupoData);
      setFormData({
        nombre: grupoData.clinica.nombre,
        tipo: grupoData.tipo,
        turno: grupoData.turno,
        clinica: {
          nombre: grupoData.clinica.nombre,
          direccion: '',
          telefono: ''
        }
      });
    }
  }, [grupoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Aquí iría la lógica real de guardado
      console.log('Guardando grupo:', formData);

      // Mostrar toast de éxito
      addToast('¡Grupo actualizado exitosamente!', 'success');

      // Redirigir con un pequeño delay
      setTimeout(() => {
        router.push(`/grupos/${grupoId}`);
      }, 500);
    } catch (error) {
      console.error('Error al actualizar:', error);
      // Mostrar toast de error
      addToast('Error al actualizar el grupo. Por favor intenta nuevamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/grupos/${grupoId}`);
  };

  if (!grupo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Grupo no encontrado</p>
        <Link href="/" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link 
            href={`/grupos/${grupo.id}`}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Volver al grupo"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Grupo</h1>
            <p className="text-gray-600">{grupo.clinica.nombre}</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Grupo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre de la clínica */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Clínica
              </label>
              <input
                type="text"
                value={formData.clinica.nombre}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  clinica: { ...prev.clinica, nombre: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Tipo de programa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Programa
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  tipo: e.target.value as 'PHP' | 'IOP'
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PHP">PHP</option>
                <option value="IOP">IOP</option>
              </select>
            </div>

            {/* Turno */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Turno
              </label>
              <select
                value={formData.turno}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  turno: e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
              </select>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.clinica.telefono}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  clinica: { ...prev.clinica, telefono: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <textarea
              value={formData.clinica.direccion}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                clinica: { ...prev.clinica, direccion: e.target.value }
              }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={handleCancel}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'Guardando...' : 'Guardar Cambios'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
