import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className = '', 
    error, 
    helperText, 
    label, 
    resize = 'vertical',
    id,
    ...props 
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    const baseClasses = 'flex w-full rounded-md border px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]';
    const resizeClass = resizeClasses[resize];
    const stateClasses = error 
      ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
      : 'border-gray-300 bg-white text-gray-900 focus:border-transparent focus:ring-blue-500';

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={textareaId} 
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          id={textareaId}
          ref={ref}
          className={`${baseClasses} ${resizeClass} ${stateClasses} ${className}`}
          {...props}
        />
        
        {helperText && (
          <p className={`text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;