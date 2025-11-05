import { useState, useEffect } from 'react';
import { groupsService } from '@/lib/services/groups-service';
import type { Grupo } from '@/lib/types';

export interface UseActiveGroupsReturn {
  activeGroups: Grupo[];
  activeGroupsCount: number;
  maxActiveGroups: number;
  canCreateNew: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useActiveGroups(): UseActiveGroupsReturn {
  const [activeGroups, setActiveGroups] = useState<Grupo[]>([]);
  const [activeGroupsCount, setActiveGroupsCount] = useState(0);
  const [maxActiveGroups, setMaxActiveGroups] = useState(2);
  const [canCreateNew, setCanCreateNew] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener grupos activos
      const groups = await groupsService.getActiveGroups();
      setActiveGroups(groups);
      setActiveGroupsCount(groups.length);

      // Obtener información de límite
      const limitInfo = await groupsService.getActiveGroupsCount();
      setMaxActiveGroups(limitInfo.maxActiveGroups);
      setCanCreateNew(limitInfo.canCreateNew);
    } catch (err) {
      console.error('Error al cargar grupos activos:', err);
      setError('Error al cargar información de grupos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    activeGroups,
    activeGroupsCount,
    maxActiveGroups,
    canCreateNew,
    isLoading,
    error,
    refresh
  };
}
