'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import type { Activity } from '@/lib/services/activities-service';

interface ActivitySearchProps {
  activities: Activity[];
  onSelect: (activity: Activity) => void;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function ActivitySearch({
  activities,
  onSelect,
  value = '',
  onChange,
  placeholder = 'Buscar actividad...',
  disabled = false,
  className = ''
}: ActivitySearchProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredActivities = activities.filter(activity =>
    activity.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
    onChange?.(newValue);
  };

  const handleSelect = (activity: Activity) => {
    setSearchTerm(activity.activityName);
    setIsOpen(false);
    onSelect(activity);
    onChange?.(activity.activityName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredActivities.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredActivities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredActivities.length) {
          handleSelect(filteredActivities[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
    onChange?.('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-2 text-sm border rounded-md dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } border-gray-300 dark:border-gray-600`}
        />
        {searchTerm && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && searchTerm && filteredActivities.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {filteredActivities.map((activity, index) => (
            <div
              key={activity.id}
              onClick={() => handleSelect(activity)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`p-3 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {activity.activityName}
              </div>
              {activity.description && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {activity.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isOpen && searchTerm && filteredActivities.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-3 text-sm text-gray-500 dark:text-gray-400">
          No se encontraron actividades
        </div>
      )}
    </div>
  );
}

