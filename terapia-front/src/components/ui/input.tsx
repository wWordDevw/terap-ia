import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, helperText, label, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          type={type}
          id={inputId}
          ref={ref}
          className={cn(
            // Base styles
            'flex w-full rounded-md border px-3 py-2 text-sm transition-colors',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            // Default state
            'border-gray-300 bg-white text-gray-900',
            'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100',
            'focus:border-transparent focus:ring-blue-500',
            // Error state
            error && 'border-red-300 focus:ring-red-500',
            className
          )}
          {...props}
        />
        
        {helperText && (
          <p className={cn(
            'text-xs',
            error ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;