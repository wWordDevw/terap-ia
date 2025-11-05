import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'warning' | 'error';
  isStacked?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onClose,
  duration = 3000,
  type = 'success',
  isStacked = false
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const remainingTimeRef = useRef(duration);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validar el mensaje al inicio del componente
  const validMessage = message && typeof message === 'string' && message.trim() ? message.trim() : null;

  const handleClose = () => {
    if (isExiting) return; // Evitar múltiples llamadas

    setIsExiting(true);

    // Esperar a que termine la animación de salida antes de llamar onClose
    exitTimeoutRef.current = setTimeout(() => {
      onClose();
    }, 300); // Duración de la animación de salida
  };

  useEffect(() => {
    if (!isVisible && !isExiting) {
      // Si no es visible y no está saliendo, activar la animación de salida
      handleClose();
      return;
    }

    if (!isVisible) {
      return; // Si ya está en proceso de salida, no hacer nada más
    }

    if (isPaused) {
      // Si está pausado, no hacer nada
      return;
    }

    // Iniciar el temporizador
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current!;
      const remaining = remainingTimeRef.current - elapsed;
      const newProgress = Math.max(0, (remaining / duration) * 100);

      if (newProgress <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        handleClose();
      } else {
        setProgress(newProgress);
      }
    }, 50); // Actualizar cada 50ms en lugar de 10ms

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isVisible, isPaused]); // Removemos duration y onClose de las dependencias

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      const elapsed = Date.now() - startTimeRef.current!;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (isVisible) {
      setIsPaused(false);
    }
  };

  // Si no hay mensaje válido, no mostrar el toast y evitar logs innecesarios
  if (!validMessage) {
    // Solo ejecutar onClose si es visible para limpiar el estado
    if (isVisible && onClose) {
      onClose();
    }
    return null;
  }

  // No retornar null inmediatamente, permitir que la animación de salida se complete
  if (!isVisible && !isExiting) return null;

  // Mejorar la configuración de colores con mejor contraste
  const colorClasses = {
    success: {
      bg: 'bg-green-500',
      border: 'bg-green-600',
      progress: 'bg-green-300',
      iconBg: 'bg-green-600',
      iconColor: 'text-white'
    },
    warning: {
      bg: 'bg-amber-500',
      border: 'bg-amber-600',
      progress: 'bg-amber-300',
      iconBg: 'bg-amber-600',
      iconColor: 'text-white'
    },
    error: {
      bg: 'bg-red-500',
      border: 'bg-red-600',
      progress: 'bg-red-300',
      iconBg: 'bg-red-600',
      iconColor: 'text-white'
    }
  };

  const colors = colorClasses[type] || colorClasses.success;

  // Iconos mejorados con mejor diseño
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`${isStacked ? 'relative' : 'fixed right-4 top-20'} ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}`}
      style={{
        ...(isStacked ? {} : {
          right: '1rem',
          left: 'auto',
          zIndex: 99999,
          position: 'fixed'
        }),
        animation: isExiting ? 'slideOut 0.3s ease-in forwards' : 'slideIn 0.3s ease-out'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`${colors.bg} text-white rounded-lg shadow-xl overflow-hidden min-w-[320px] max-w-md`}>
        <div className="px-4 py-4 flex items-center gap-3">
          {/* Contenedor del icono con fondo mejorado */}
          <div className={`flex-shrink-0 ${colors.iconBg} p-2 rounded-full ${colors.iconColor} shadow-inner`}>
            {getIcon()}
          </div>

          {/* Mensaje con mejor tipografía */}
          <span className="font-medium text-base flex-1 pr-2">
            {validMessage}
          </span>

          {/* Botón de cierre con animación de rotación */}
          <motion.button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              handleClose();
            }}
            className="ml-auto p-1 rounded-full hover:bg-white/20 transition-all duration-200 group"
            aria-label="Cerrar notificación"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </div>

        {/* Barra de progreso mejorada */}
        <div className={`h-1 ${colors.border} relative`}>
          <div
            className={`h-full ${colors.progress} transition-all duration-100 ease-linear relative`}
            style={{ width: `${progress}%` }}
          >
            {/* Efecto de brillo en la barra de progreso */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
            max-height: 200px;
            margin-bottom: 12px;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
            max-height: 0;
            margin-bottom: 0;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        .animate-slide-out {
          animation: slideOut 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;
