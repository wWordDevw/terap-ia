'use client';

import { AlertTriangle, Users, CheckCircle } from 'lucide-react';
import { useActiveGroups } from '@/hooks/use-active-groups';
import Badge from '@/components/ui/bagde';

interface ActiveGroupsCounterProps {
  className?: string;
  showAlert?: boolean;
}

export default function ActiveGroupsCounter({ 
  className = '', 
  showAlert = true 
}: ActiveGroupsCounterProps) {
  const { 
    activeGroupsCount, 
    maxActiveGroups, 
    canCreateNew, 
    isLoading, 
    error 
  } = useActiveGroups();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
        <span className="text-sm text-gray-500">Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-red-600 ${className}`}>
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  const isNearLimit = activeGroupsCount >= maxActiveGroups - 1;
  const isAtLimit = !canCreateNew;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Users className="w-4 h-4 text-sidebar-foreground" />
      
      <span className="text-sm font-medium text-sidebar-foreground">
        Grupos Activos: {activeGroupsCount}/{maxActiveGroups}
      </span>

      {isAtLimit ? (
        <Badge variant="red" size="sm">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Límite alcanzado
        </Badge>
      ) : isNearLimit ? (
        <Badge variant="yellow" size="sm">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Casi al límite
        </Badge>
      ) : (
        <Badge variant="green" size="sm">
          <CheckCircle className="w-3 h-3 mr-1" />
          Disponible
        </Badge>
      )}

      {showAlert && isAtLimit && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800 dark:text-red-200">
              <p className="font-medium">Límite de grupos alcanzado</p>
              <p className="mt-1">
                No puedes crear más grupos activos. Debes desactivar un grupo existente 
                antes de crear uno nuevo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
