'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Download, Trash2, FileText, X, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import Dialog from '@/components/ui/dialog';
import { useToast } from '@/components/providers/toast-provider';
import {
  patientDocumentsService,
  DocumentType,
  type PatientDocument,
  type UploadDocumentData,
} from '@/lib/services/patient-documents-service';

interface PatientDocumentsProps {
  patientId: string;
  onDocumentCountChange?: (count: number) => void;
}

export default function PatientDocuments({ patientId, onDocumentCountChange }: PatientDocumentsProps) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.OTHER);
  const [description, setDescription] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; document: PatientDocument | null }>({
    show: false,
    document: null,
  });

  // Cargar documentos
  useEffect(() => {
    loadDocuments();
  }, [patientId]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await patientDocumentsService.getDocuments(patientId);
      setDocuments(docs);
      // Notificar cambio en el contador
      if (onDocumentCountChange) {
        onDocumentCountChange(docs.length);
      }
    } catch (error) {
      console.error('Error al cargar documentos:', error);
      addToast('Error al cargar los documentos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar archivo
    const validation = patientDocumentsService.validateFile(file);
    if (!validation.valid) {
      addToast(validation.error || 'Archivo no válido', 'error');
      return;
    }

    setSelectedFile(file);
    setShowUploadModal(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const data: UploadDocumentData = {
        file: selectedFile,
        documentType,
        description: description.trim() || undefined,
      };

      await patientDocumentsService.uploadDocument(patientId, data);
      addToast('Documento subido exitosamente', 'success');

      // Limpiar y recargar
      setShowUploadModal(false);
      setSelectedFile(null);
      setDescription('');
      setDocumentType(DocumentType.OTHER);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      await loadDocuments();
    } catch (error) {
      console.error('Error al subir documento:', error);
      addToast('Error al subir el documento', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (document: PatientDocument) => {
    try {
      await patientDocumentsService.downloadDocument(document.id, document.documentName);
      addToast('Descargando documento...', 'success');
    } catch (error) {
      console.error('Error al descargar documento:', error);
      addToast('Error al descargar el documento', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.document) return;

    try {
      await patientDocumentsService.deleteDocument(deleteConfirm.document.id);
      addToast('Documento eliminado exitosamente', 'success');
      setDeleteConfirm({ show: false, document: null });
      await loadDocuments();
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      addToast('Error al eliminar el documento', 'error');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con botón de subir */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Documentos ({documents.length})
        </h3>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.txt"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Subir Documento</span>
          </Button>
        </div>
      </div>

      {/* Lista de documentos */}
      {documents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No hay documentos subidos</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Haz clic en "Subir Documento" para agregar archivos
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-3xl">
                    {patientDocumentsService.getFileIcon(doc.mimeType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {doc.documentName}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {patientDocumentsService.getDocumentTypeLabel(doc.documentType)}
                    </p>
                    {doc.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                      <span>{patientDocumentsService.formatFileSize(doc.fileSize)}</span>
                      <span>•</span>
                      <span>{formatDate(doc.uploadedAt)}</span>
                      {doc.uploadedBy && (
                        <>
                          <span>•</span>
                          <span>Subido por: {doc.uploadedBy.fullName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    title="Descargar"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ show: true, document: doc })}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de subida */}
      <Dialog
        isOpen={showUploadModal}
        onClose={() => {
          if (!isUploading) {
            setShowUploadModal(false);
            setSelectedFile(null);
            setDescription('');
            setDocumentType(DocumentType.OTHER);
          }
        }}
        title="Subir Documento"
        size="md"
      >
        <div className="space-y-4">
          {selectedFile && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {patientDocumentsService.getFileIcon(selectedFile.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {patientDocumentsService.formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Documento *
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentType)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isUploading}
            >
              <option value={DocumentType.MASTER_TREATMENT_PLAN}>Plan de Tratamiento</option>
              <option value={DocumentType.ASSESSMENT}>Evaluación</option>
              <option value={DocumentType.MEDICAL_RECORD}>Historia Clínica</option>
              <option value={DocumentType.LAB_RESULT}>Resultado de Laboratorio</option>
              <option value={DocumentType.PRESCRIPTION}>Receta Médica</option>
              <option value={DocumentType.INSURANCE}>Seguro</option>
              <option value={DocumentType.CONSENT_FORM}>Formulario de Consentimiento</option>
              <option value={DocumentType.DISCHARGE_SUMMARY}>Resumen de Alta</option>
              <option value={DocumentType.PROGRESS_NOTE}>Nota de Progreso</option>
              <option value={DocumentType.OTHER}>Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Agrega una descripción del documento..."
              disabled={isUploading}
            />
          </div>

          <div className="flex items-start space-x-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Tamaño máximo: 10MB. Formatos permitidos: PDF, imágenes, documentos de Office.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => {
                setShowUploadModal(false);
                setSelectedFile(null);
                setDescription('');
                setDocumentType(DocumentType.OTHER);
              }}
              variant="outline"
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? 'Subiendo...' : 'Subir Documento'}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, document: null })}
        title="Eliminar Documento"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  ¿Estás seguro de que deseas eliminar este documento?
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Esta acción no se puede deshacer. El archivo será eliminado permanentemente.
                </p>
                {deleteConfirm.document && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
                    {deleteConfirm.document.documentName}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => setDeleteConfirm({ show: false, document: null })}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
