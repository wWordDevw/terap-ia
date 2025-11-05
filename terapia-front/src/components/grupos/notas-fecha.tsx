'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, X, FileText, Edit3 } from 'lucide-react';
import Button from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';
import type { Usuario } from '@/lib/types';

interface NotaFecha {
  id: string;
  fecha: string;
  actividad: string;
  notas: string;
  usuarioId: string;
  usuarioNombre: string;
}

interface NotasFechaProps {
  usuariosSeleccionados: Usuario[];
  actividades: Array<{ codigo: string; titulo: string; id?: string }>;
  onNotasChange: (notas: NotaFecha[]) => void;
  className?: string;
}

const NotasFecha: React.FC<NotasFechaProps> = ({
  usuariosSeleccionados,
  actividades,
  onNotasChange,
  className = ''
}) => {
  const [notas, setNotas] = useState<NotaFecha[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [notaEditando, setNotaEditando] = useState<NotaFecha | null>(null);
  const [formData, setFormData] = useState({
    fecha: '',
    actividad: '',
    notas: '',
    usuarioId: ''
  });

  const agregarNota = () => {
    if (!formData.fecha || !formData.actividad || !formData.usuarioId || !formData.notas.trim()) {
      return;
    }

    const usuario = usuariosSeleccionados.find(u => u.id === formData.usuarioId);
    if (!usuario) return;

    const nuevaNota: NotaFecha = {
      id: Date.now().toString(),
      fecha: formData.fecha,
      actividad: formData.actividad,
      notas: formData.notas,
      usuarioId: formData.usuarioId,
      usuarioNombre: usuario.fullName
    };

    const nuevasNotas = [...notas, nuevaNota];
    setNotas(nuevasNotas);
    onNotasChange(nuevasNotas);
    
    // Limpiar formulario
    setFormData({
      fecha: '',
      actividad: '',
      notas: '',
      usuarioId: ''
    });
    setMostrarFormulario(false);
  };

  const editarNota = (nota: NotaFecha) => {
    setNotaEditando(nota);
    setFormData({
      fecha: nota.fecha,
      actividad: nota.actividad,
      notas: nota.notas,
      usuarioId: nota.usuarioId
    });
    setMostrarFormulario(true);
  };

  const actualizarNota = () => {
    if (!notaEditando || !formData.fecha || !formData.actividad || !formData.usuarioId || !formData.notas.trim()) {
      return;
    }

    const usuario = usuariosSeleccionados.find(u => u.id === formData.usuarioId);
    if (!usuario) return;

    const notasActualizadas = notas.map(nota =>
      nota.id === notaEditando.id
        ? {
            ...nota,
            fecha: formData.fecha,
            actividad: formData.actividad,
            notas: formData.notas,
            usuarioId: formData.usuarioId,
            usuarioNombre: usuario.fullName
          }
        : nota
    );

    setNotas(notasActualizadas);
    onNotasChange(notasActualizadas);
    
    // Limpiar formulario
    setFormData({
      fecha: '',
      actividad: '',
      notas: '',
      usuarioId: ''
    });
    setNotaEditando(null);
    setMostrarFormulario(false);
  };

  const eliminarNota = (id: string) => {
    const notasActualizadas = notas.filter(nota => nota.id !== id);
    setNotas(notasActualizadas);
    onNotasChange(notasActualizadas);
  };

  const cancelarEdicion = () => {
    setFormData({
      fecha: '',
      actividad: '',
      notas: '',
      usuarioId: ''
    });
    setNotaEditando(null);
    setMostrarFormulario(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Notas por Fecha</span>
        </h3>
        <Button
          type="button"
          onClick={() => setMostrarFormulario(true)}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Nota</span>
        </Button>
      </div>

      {/* Formulario de nota con animación */}
      <AnimatePresence>
        {mostrarFormulario && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              {notaEditando ? 'Editar Nota' : 'Nueva Nota'}
            </h4>
            <button
              type="button"
              onClick={cancelarEdicion}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Usuario
              </label>
              <select
                value={formData.usuarioId}
                onChange={(e) => setFormData(prev => ({ ...prev, usuarioId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar usuario</option>
                {usuariosSeleccionados.map(usuario => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Actividad
            </label>
            <select
              value={formData.actividad}
              onChange={(e) => setFormData(prev => ({ ...prev, actividad: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar actividad</option>
              {actividades.map((actividad) => (
                <option key={actividad.id || `${actividad.codigo}-${actividad.titulo}`} value={actividad.codigo}>
                  {actividad.codigo} - {actividad.titulo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notas
            </label>
            <Textarea
              value={formData.notas}
              onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
              placeholder="Escribir notas sobre la actividad..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={cancelarEdicion}
              variant="outline"
              size="sm"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={notaEditando ? actualizarNota : agregarNota}
              size="sm"
            >
              {notaEditando ? 'Actualizar' : 'Agregar'} Nota
            </Button>
          </div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de notas */}
      {notas.length > 0 ? (
        <div className="space-y-3">
          {notas
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .map(nota => (
              <div key={nota.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {new Date(nota.fecha).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-sm text-blue-600 dark:text-blue-400">{nota.actividad}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{nota.notas}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Por: {nota.usuarioNombre}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => editarNota(nota)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1"
                      title="Editar nota"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminarNota(nota.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                      title="Eliminar nota"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p>No hay notas registradas</p>
          <p className="text-sm">Agrega la primera nota para comenzar</p>
        </div>
      )}
    </div>
  );
};

export default NotasFecha;
