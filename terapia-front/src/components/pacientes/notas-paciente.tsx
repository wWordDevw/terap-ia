'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, Calendar, User, Tag } from 'lucide-react';
import Button from '@/components/ui/button';
import { useNotifications } from '@/contexts/notification-context';
import { apiClient, type PatientNote, type CreatePatientNoteDto, type UpdatePatientNoteDto } from '@/lib/api';

interface NotasPacienteProps {
  pacienteId: string;
}

export default function NotasPaciente({ pacienteId }: NotasPacienteProps) {
  const { showSuccess, showError } = useNotifications();
  const [notas, setNotas] = useState<PatientNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNota, setEditingNota] = useState<PatientNote | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroPrivacidad, setFiltroPrivacidad] = useState<string>('todos');

  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    tipo: 'general' as 'general' | 'medica' | 'terapeutica' | 'administrativa',
    privacidad: 'publica' as 'publica' | 'privada' | 'confidencial',
    tags: '',
  });

  // Cargar notas del paciente
  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getNotes(pacienteId);
      setNotas(data);
    } catch (error) {
      console.error('Error al cargar notas:', error);
      showError('Error', 'No se pudieron cargar las notas del paciente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [pacienteId]);

  const tiposNota = [
    { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
    { value: 'medica', label: 'Médica', color: 'bg-red-100 text-red-800' },
    { value: 'terapeutica', label: 'Terapéutica', color: 'bg-blue-100 text-blue-800' },
    { value: 'administrativa', label: 'Administrativa', color: 'bg-green-100 text-green-800' },
  ];

  const nivelesPrivacidad = [
    { value: 'publica', label: 'Pública', icon: Eye, color: 'text-green-600' },
    { value: 'privada', label: 'Privada', icon: EyeOff, color: 'text-yellow-600' },
    { value: 'confidencial', label: 'Confidencial', icon: EyeOff, color: 'text-red-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo.trim() || !formData.contenido.trim()) {
      showError('Error', 'Título y contenido son requeridos');
      return;
    }

    try {
      const noteData: CreatePatientNoteDto = {
        titulo: formData.titulo,
        contenido: formData.contenido,
        tipo: formData.tipo,
        privacidad: formData.privacidad,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      };

      if (editingNota) {
        // Editar nota existente
        await apiClient.updateNote(pacienteId, editingNota.id, noteData);
        showSuccess('Nota actualizada', 'La nota se ha actualizado correctamente');
      } else {
        // Crear nueva nota
        await apiClient.createNote(pacienteId, noteData);
        showSuccess('Nota creada', 'La nota se ha creado correctamente');
      }

      // Recargar notas
      await loadNotes();

      // Limpiar formulario
      setFormData({
        titulo: '',
        contenido: '',
        tipo: 'general',
        privacidad: 'publica',
        tags: '',
      });
      setShowForm(false);
      setEditingNota(null);
    } catch (error) {
      console.error('Error al guardar nota:', error);
      showError('Error', 'No se pudo guardar la nota');
    }
  };

  const handleEdit = (nota: PatientNote) => {
    setEditingNota(nota);
    setFormData({
      titulo: nota.titulo,
      contenido: nota.contenido,
      tipo: nota.tipo,
      privacidad: nota.privacidad,
      tags: nota.tags?.join(', ') || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (notaId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      try {
        await apiClient.deleteNote(pacienteId, notaId);
        await loadNotes();
        showSuccess('Nota eliminada', 'La nota se ha eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar nota:', error);
        showError('Error', 'No se pudo eliminar la nota');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      titulo: '',
      contenido: '',
      tipo: 'general',
      privacidad: 'publica',
      tags: '',
    });
    setShowForm(false);
    setEditingNota(null);
  };

  const notasFiltradas = notas.filter(nota => {
    const cumpleTipo = filtroTipo === 'todos' || nota.tipo === filtroTipo;
    const cumplePrivacidad = filtroPrivacidad === 'todos' || nota.privacidad === filtroPrivacidad;
    return cumpleTipo && cumplePrivacidad;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Cargando notas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notas del Paciente</h3>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {notas.length}
          </span>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Nota
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos</option>
            {tiposNota.map(tipo => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Privacidad</label>
          <select
            value={filtroPrivacidad}
            onChange={(e) => setFiltroPrivacidad(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos</option>
            {nivelesPrivacidad.map(nivel => (
              <option key={nivel.value} value={nivel.value}>
                {nivel.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Formulario de Nota */}
      {showForm && (
        <div className="bg-white rounded-lg border p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {editingNota ? 'Editar Nota' : 'Nueva Nota'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Título de la nota"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tiposNota.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.contenido}
                onChange={(e) => setFormData(prev => ({ ...prev, contenido: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe el contenido de la nota..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Privacidad</label>
                <select
                  value={formData.privacidad}
                  onChange={(e) => setFormData(prev => ({ ...prev, privacidad: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {nivelesPrivacidad.map(nivel => (
                    <option key={nivel.value} value={nivel.value}>
                      {nivel.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-xs text-gray-500 mt-1">Separa los tags con comas</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingNota ? 'Actualizar' : 'Crear'} Nota
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Notas */}
      <div className="space-y-4">
        {notasFiltradas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay notas para mostrar</p>
            <p className="text-sm">Crea la primera nota para este paciente</p>
          </div>
        ) : (
          notasFiltradas.map(nota => {
            const tipoInfo = tiposNota.find(t => t.value === nota.tipo);
            const privacidadInfo = nivelesPrivacidad.find(p => p.value === nota.privacidad);
            const PrivacidadIcon = privacidadInfo?.icon || Eye;

            return (
              <div key={nota.id} className="bg-white rounded-lg border p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-md font-semibold text-gray-900">{nota.titulo}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoInfo?.color}`}>
                        {tipoInfo?.label}
                      </span>
                      <div className="flex items-center space-x-1">
                        <PrivacidadIcon className={`h-4 w-4 ${privacidadInfo?.color}`} />
                        <span className="text-xs text-gray-500">{privacidadInfo?.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{nota.autor}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(nota.fecha).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(nota)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(nota.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{nota.contenido}</p>
                
                {nota.tags && nota.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {nota.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
