'use client';

import { useState, useEffect } from 'react';
import { Search, User as UserIcon, Check } from 'lucide-react';
import { usersService, type User } from '@/lib/services/users-service';

interface TerapeutaSelectorProps {
  terapeutaSeleccionado: string | null;
  onTerapeutaChange: (terapeutaId: string | null) => void;
  className?: string;
}

export default function TerapeutaSelector({
  terapeutaSeleccionado,
  onTerapeutaChange,
  className = ''
}: TerapeutaSelectorProps) {
  const [terapeutas, setTerapeutas] = useState<User[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarTerapeutas = async () => {
      try {
        setIsLoading(true);
        // Obtener todos los usuarios y filtrar terapeutas
        const usuarios = await usersService.getUsers();
        const terapeutasData = usuarios.filter(
          u => u.role === 'therapist' && u.isActive
        );
        setTerapeutas(terapeutasData);
      } catch (error) {
        console.error('Error al cargar terapeutas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarTerapeutas();
  }, []);

  const terapeutasFiltrados = terapeutas.filter(terapeuta =>
    terapeuta.fullName.toLowerCase().includes(busqueda.toLowerCase()) ||
    terapeuta.username.toLowerCase().includes(busqueda.toLowerCase()) ||
    terapeuta.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const terapeutaSeleccionadoData = terapeutas.find(
    t => t.id === terapeutaSeleccionado
  );

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Terapeuta a Cargo <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer flex items-center justify-between hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {isLoading ? (
              <span className="text-gray-500 dark:text-gray-400">Cargando terapeutas...</span>
            ) : terapeutaSeleccionadoData ? (
              <>
                <UserIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{terapeutaSeleccionadoData.fullName}</span>
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Seleccionar terapeuta</span>
            )}
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-64 overflow-hidden">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar terapeuta..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto">
              {terapeutasFiltrados.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No se encontraron terapeutas
                </div>
              ) : (
                terapeutasFiltrados.map(terapeuta => (
                  <div
                    key={terapeuta.id}
                    onClick={() => {
                      onTerapeutaChange(terapeuta.id);
                      setIsOpen(false);
                      setBusqueda('');
                    }}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{terapeuta.fullName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {terapeuta.email}
                      </div>
                    </div>
                    {terapeutaSeleccionado === terapeuta.id && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {terapeutaSeleccionadoData && (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="text-sm text-blue-800 dark:text-blue-300">
            Terapeuta seleccionado: <strong>{terapeutaSeleccionadoData.fullName}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

