'use client';

import React, { useState, useEffect, useRef } from 'react';
import { signatureService, Signature } from '@/lib/services/signature-service';
import Button from '@/components/ui/button';
import { Upload, Trash2, Edit, CheckCircle } from 'lucide-react';

export default function SignatureManager() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<Signature['signatureType']>('therapist');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSignatures();
  }, []);

  const loadSignatures = async () => {
    try {
      const sigs = await signatureService.getMySignatures();
      setSignatures(sigs);
    } catch (error) {
      console.error('Error loading signatures:', error);
      alert('Error al cargar las firmas');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const signature = await signatureService.uploadSignature(file, selectedType);
      setSignatures(prev => {
        // Reemplazar firma del mismo tipo si existe
        const filtered = prev.filter(sig => sig.signatureType !== selectedType);
        return [...filtered, signature];
      });

      alert('Firma cargada exitosamente');

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading signature:', error);
      alert(`Error al cargar firma: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta firma?')) {
      return;
    }

    try {
      await signatureService.deleteSignature(id);
      setSignatures(prev => prev.filter(sig => sig.id !== id));
      alert('Firma eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting signature:', error);
      alert('Error al eliminar firma');
    }
  };

  const handleUpdate = async (id: string) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert('Por favor seleccione un archivo primero');
      return;
    }

    try {
      setUploading(true);
      const updated = await signatureService.updateSignature(id, file);
      setSignatures(prev => prev.map(sig => sig.id === id ? updated : sig));
      alert('Firma actualizada exitosamente');

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error updating signature:', error);
      alert('Error al actualizar firma');
    } finally {
      setUploading(false);
    }
  };

  const getSignatureByType = (type: Signature['signatureType']) => {
    return signatures.find(sig => sig.signatureType === type);
  };

  const typeLabels: Record<Signature['signatureType'], string> = {
    therapist: 'Terapeuta',
    supervisor: 'Supervisor Clínico',
    medical_director: 'Director Médico'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Gestión de Firmas
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Suba sus firmas digitales para usarlas en documentos MTPR y otros reportes.
          Solo se permite una firma por tipo. Formatos aceptados: PNG, JPEG (máx. 2MB).
        </p>

        {/* Upload Section */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Subir Nueva Firma</h4>

          <div className="space-y-4">
            {/* Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Firma:
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as Signature['signatureType'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={uploading}
              >
                <option value="therapist">Terapeuta</option>
                <option value="supervisor">Supervisor Clínico</option>
                <option value="medical_director">Director Médico</option>
              </select>
            </div>

            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo de Firma:
              </label>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PNG o JPEG, máximo 2MB
              </p>
            </div>

            {/* Upload Button */}
            {getSignatureByType(selectedType) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  Ya existe una firma de tipo "{typeLabels[selectedType]}".
                  Al subir una nueva, se reemplazará la anterior.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Signatures List */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Firmas Guardadas</h4>

          {signatures.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No hay firmas guardadas</p>
              <p className="text-sm text-gray-500 mt-1">
                Suba su primera firma usando el formulario de arriba
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {signatures.map(sig => (
                <div
                  key={sig.id}
                  className="border-2 border-gray-300 rounded-lg p-4 bg-white hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        {typeLabels[sig.signatureType]}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(sig.uploadedAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </div>

                  {/* Signature Image */}
                  <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3 flex items-center justify-center h-24">
                    <img
                      src={sig.imageUrl}
                      alt={`Firma ${typeLabels[sig.signatureType]}`}
                      className="max-h-20 max-w-full object-contain"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(sig.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">
          Información sobre Firmas
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Las firmas se usan automáticamente en documentos MTPR</li>
          <li>• Solo puede tener una firma activa por tipo</li>
          <li>• Las firmas se guardan de forma segura en su navegador</li>
          <li>• Puede actualizar o eliminar sus firmas en cualquier momento</li>
        </ul>
      </div>
    </div>
  );
}
