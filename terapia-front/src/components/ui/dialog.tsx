import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  // Manejar la apertura y cierre con animación
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // Duración de la animación
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // Manejar escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay con efecto Glass UI */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
        style={{
          animation: isClosing ? 'fadeOut 0.2s ease-out' : 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Dialog container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl',
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: isClosing
              ? 'slideDownFadeOut 0.3s ease-out forwards'
              : 'slideUpFadeIn 0.3s ease-out'
          }}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-8">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-colors"
                aria-label="Cerrar dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className={cn(
            'p-4',
            !title && 'pt-12' // Más padding top si no hay título
          )}>
            {!title && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-colors z-10"
                aria-label="Cerrar dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para el footer del dialog
export const DialogFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn(
    'flex justify-end space-x-3 px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg',
    className
  )}>
    {children}
  </div>
);

// Componente para el contenido del dialog
export const DialogContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('space-y-4', className)}>
    {children}
  </div>
);

export default Dialog;