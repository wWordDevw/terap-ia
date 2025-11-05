import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 200,
  disabled = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setShowTooltip(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setShowTooltip(false);
    setTimeout(() => setIsVisible(false), 150); // Delay para animación
  };

  const handleFocus = () => {
    handleMouseEnter();
  };

  const handleBlur = () => {
    handleMouseLeave();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900',
  };

  const baseClasses = 'relative inline-block';
  const tooltipClasses = `absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded whitespace-nowrap transition-opacity duration-150 ${positionClasses[position]} ${showTooltip ? 'opacity-100' : 'opacity-0'} ${className}`;
  const arrowBaseClasses = `absolute w-0 h-0 border-4 ${arrowClasses[position]}`;

  return (
    <div 
      className={baseClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      
      {isVisible && (
        <div
          className={tooltipClasses}
          role="tooltip"
        >
          {content}
          
          {/* Arrow */}
          <div className={arrowBaseClasses} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;