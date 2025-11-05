import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'default',
    size = 'default',
    loading = false,
    disabled,
    children,
    ...props
  }, ref) => {
    // Check if custom background classes are provided
    const hasCustomBg = className && /bg-\w+/.test(className);

    const variants = {
      default: 'bg-sidebar-primary text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-sidebar-primary',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-200 dark:hover:bg-gray-800',
      link: 'text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500 dark:text-blue-400',
    };

    const sizes = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-8 px-3 py-1 text-xs',
      lg: 'h-12 px-6 py-3 text-base',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          // Only apply variant styles if no custom background is provided
          !hasCustomBg && variants[variant],
          // Size styles
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className={cn(
            'animate-spin',
            size === 'sm' ? 'w-3 h-3' : 'w-4 h-4',
            children ? 'mr-2' : ''
          )} />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;