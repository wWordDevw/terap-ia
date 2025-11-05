'use client';

import { useState, useEffect } from 'react';
import { apiClient, type Clinic } from '@/lib/api';

interface ClinicSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  className?: string;
}

export default function ClinicSelect({ value, onChange, error, className = '' }: ClinicSelectProps) {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const data = await apiClient.getActiveClinics();
        setClinics(data);
      } catch (error) {
        console.error('Error al cargar clínicas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  if (loading) {
    return (
      <select 
        disabled 
        className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 ${className}`}
      >
        <option>Cargando clínicas...</option>
      </select>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-300' : 'border-gray-300'
      } ${className}`}
    >
      <option value="">Seleccionar clínica...</option>
      {clinics.map(clinic => (
        <option key={clinic.id} value={clinic.id}>
          {clinic.clinicName}
        </option>
      ))}
    </select>
  );
}
