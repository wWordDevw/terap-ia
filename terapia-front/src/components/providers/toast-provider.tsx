'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../ui/toast';

interface ToastType {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'error';
  duration: number;
  isVisible: boolean;
}

interface ToastContextType {
  toasts: ToastType[];
  addToast: (message: string, type?: 'success' | 'warning' | 'error', duration?: number) => number | null;
  removeToast: (id: number) => void;
  removeAllToasts: () => void;
}

// Contexto para manejar los toasts globalmente
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook para usar el contexto de toasts
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  return context;
};

// Provider de toasts
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'warning' | 'error' = 'success', duration = 3000) => {
    // Validación adicional en el contenedor
    if (!message || (typeof message === 'string' && message.trim() === '')) {
      console.warn('ToastContainer: Prevented empty toast from being added', { message, type, duration });
      return null;
    }

    // Prevenir toasts duplicados del mismo mensaje y tipo
    const existingToast = toasts.find(toast =>
      toast.message === message && toast.type === type
    );

    if (existingToast) {
      console.log('ToastContainer: Prevented duplicate toast', { message, type });
      return existingToast.id; // Retornar el ID del toast existente
    }

    const id = Date.now() + Math.random(); // ID único
    const newToast: ToastType = {
      id,
      message,
      type,
      duration,
      isVisible: true
    };

    setToasts(prevToasts => [...prevToasts, newToast]);

    // No auto-eliminar aquí, dejar que el componente Toast maneje su propio ciclo de vida
    // El Toast llamará a onClose cuando termine su animación

    return id;
  }, [toasts]);

  // Listener para eventos globales de toast
  React.useEffect(() => {
    const handleShowToast = (event: CustomEvent<{ message: string; type?: 'success' | 'warning' | 'error'; duration?: number }>) => {
      const { message, type = 'success', duration = 3000 } = event.detail || {};
      if (message) {
        addToast(message, type, duration);
      }
    };

    window.addEventListener('showToast', handleShowToast as EventListener);

    return () => {
      window.removeEventListener('showToast', handleShowToast as EventListener);
    };
  }, [addToast]);

  const removeToast = useCallback((id: number) => {
    // Simplemente eliminar el toast inmediatamente
    // La animación se maneja en el componente Toast individual
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      removeAllToasts
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Contenedor que renderiza todos los toasts apilados
const ToastContainer: React.FC<{ toasts: ToastType[]; onRemoveToast: (id: number) => void }> = ({ toasts, onRemoveToast }) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-20 z-[9999] space-y-3 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * 10}px)`, // Pequeño desplazamiento para efecto cascada
            zIndex: 9999 - index, // Los más nuevos arriba
          }}
        >
          <Toast
            message={toast.message}
            isVisible={toast.isVisible}
            onClose={() => onRemoveToast(toast.id)}
            duration={toast.duration}
            type={toast.type}
            isStacked={true} // Indicar que está en un stack
          />
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
