'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Check } from 'lucide-react';
import { getUsuariosActivos } from '@/data/mock-usuarios';
import type { Usuario } from '@/lib/types';

interface UsuarioSelectorProps {
  usuariosSeleccionados: string[];
  onUsuariosChange: (usuariosIds: string[]) => void;
  className?: string;
}

const UsuarioSelector: React.FC<UsuarioSelectorProps> = ({
  usuariosSeleccionados,
  onUsuariosChange,
  className = ''
}) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const usuariosData = getUsuariosActivos();
    setUsuarios(usuariosData);
  }, []);

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.fullName.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.username.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.role.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleUsuario = (usuarioId: string) => {
    if (usuariosSeleccionados.includes(usuarioId)) {
      onUsuariosChange(usuariosSeleccionados.filter(id => id !== usuarioId));
    } else {
      onUsuariosChange([...usuariosSeleccionados, usuarioId]);
    }
  };

  const getUsuariosSeleccionados = () => {
    return usuarios.filter(usuario => usuariosSeleccionados.includes(usuario.id));
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Usuarios del Sistema
      </label>

      {/* Input de búsqueda y selección */}
      <div>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              {usuariosSeleccionados.length === 0
                ? 'Seleccionar usuarios...'
                : `${usuariosSeleccionados.length} usuario(s) seleccionado(s)`
              }
            </span>
          </div>
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>

        {/* Dropdown con animación - ahora empuja el contenido hacia abajo */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden"
            >
              {/* Búsqueda */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  placeholder="Buscar por nombre, username, email o rol..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>

              {/* Lista de usuarios */}
              <div className="max-h-48 overflow-y-auto">
                {usuariosFiltrados.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                    No se encontraron usuarios
                  </div>
                ) : (
                  usuariosFiltrados.map(usuario => (
                    <div
                      key={usuario.id}
                      onClick={() => toggleUsuario(usuario.id)}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{usuario.fullName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {usuario.role} • @{usuario.username}
                        </div>
                      </div>
                      {usuariosSeleccionados.includes(usuario.id) && (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Usuarios seleccionados */}
      {usuariosSeleccionados.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3"
        >
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Usuarios seleccionados:
          </div>
          <div className="flex flex-wrap gap-2">
            {getUsuariosSeleccionados().map(usuario => (
              <motion.div
                key={usuario.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
              >
                <span>{usuario.fullName}</span>
                <button
                  onClick={() => toggleUsuario(usuario.id)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UsuarioSelector;
