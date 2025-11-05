import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 
    | 'default' 
    | 'php' 
    | 'iop' 
    | 'presente' 
    | 'ausente' 
    | 'discharge'
    | 'success' 
    | 'warning' 
    | 'error' 
    | 'info'
    | 'blue'
    | 'green'
    | 'yellow'
    | 'red'
    | 'purple'
    | 'gray'
    | 'indigo';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full border transition-colors';
    
    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base'
    };

    const variantStyles = {
      default: 'bg-gray-100 text-gray-900 border-gray-200',
      
      // Variantes específicas del dominio
      php: 'bg-blue-100 text-blue-900 border-blue-200',
      iop: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      
      // Variantes de asistencia
      presente: 'bg-green-100 text-green-900 border-green-200',
      ausente: 'bg-red-100 text-red-900 border-red-200',
      discharge: 'bg-purple-100 text-purple-900 border-purple-200',
      
      // Variantes semánticas
      success: 'bg-green-100 text-green-900 border-green-200',
      warning: 'bg-yellow-100 text-yellow-900 border-yellow-200',
      error: 'bg-red-100 text-red-900 border-red-200',
      info: 'bg-blue-100 text-blue-900 border-blue-200',
      
      // Variantes de colores
      blue: 'bg-blue-100 text-blue-900 border-blue-200',
      green: 'bg-green-100 text-green-900 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-900 border-yellow-200',
      red: 'bg-red-100 text-red-900 border-red-200',
      purple: 'bg-purple-100 text-purple-900 border-purple-200',
      gray: 'bg-gray-100 text-gray-900 border-gray-200',
      indigo: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;