'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Target,
  Calendar,
  Activity,
  Award,
  BarChart3,
  Download
} from 'lucide-react';
import Badge from '@/components/ui/bagde';
import Button from '@/components/ui/button';
import { attendanceService, type AttendanceStats } from '@/lib/services/attendance-service';
import { notesService, type GeneratedNote } from '@/lib/services/notes-service';
import { mtprService, type MTPRDate } from '@/lib/services/mtpr-service';
import type { Patient } from '@/lib/services/patients-service';

interface PatientHistoryProps {
  patient: Patient;
}

export default function PatientHistory({ patient }: PatientHistoryProps) {
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    dischargeDays: 0,
    attendanceRate: 0
  });
  const [notes, setNotes] = useState<GeneratedNote[]>([]);
  const [mtprNotes, setMtprNotes] = useState<MTPRDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'timeline' | 'stats' | 'documents'>('timeline');

  useEffect(() => {
    loadHistoryData();
  }, [patient.id]);

  const loadHistoryData = async () => {
    setIsLoading(true);
    try {
      // Cargar estadísticas de asistencia
      const stats = await attendanceService.getPatientStats(patient.id);
      setAttendanceStats(stats);

      // Cargar notas generadas
      const patientNotes = await notesService.getNotesByPatient(patient.id);
      setNotes(patientNotes);

      // MTPR no tiene método de API, solo cálculos locales
      // Usar el servicio para calcular las fechas de MTPR
      const mtprDates = mtprService.calculateMTPRDates(new Date(patient.admissionDate), 12);
      setMtprNotes(mtprDates);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDaysInProgram = () => {
    const start = new Date(patient.admissionDate);
    const end = patient.dischargeDate ? new Date(patient.dischargeDate) : new Date();
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getGoalProgress = () => {
    // Simular progreso de objetivos basado en asistencia
    return patient.goals?.map((goal, index) => ({
      ...goal,
      progress: Math.min(100, attendanceStats.attendanceRate + (index * 5))
    })) || [];
  };

  const timelineEvents = [
    {
      date: patient.admissionDate,
      type: 'admission',
      title: 'Ingreso al Programa',
      description: `Inicio del tratamiento en ${new Date(patient.admissionDate).toLocaleDateString('es-ES')}`,
      icon: Activity,
      color: 'blue'
    },
    ...notes.map(note => ({
      date: note.noteDate,
      type: 'note',
      title: 'Nota Generada',
      description: `Objetivo ${note.goalNumber}: ${note.goalText}`,
      icon: FileText,
      color: 'purple'
    })),
    ...mtprNotes.filter(mtpr => mtpr.isGenerated).map(mtpr => ({
      date: mtpr.dueDate.toISOString(),
      type: 'mtpr',
      title: `MTPR #${mtpr.mtprNumber}`,
      description: 'Plan de Tratamiento Mensual',
      icon: Award,
      color: 'green'
    })),
    ...(patient.dischargeDate ? [{
      date: patient.dischargeDate,
      type: 'discharge',
      title: 'Alta Programada',
      description: `Fecha estimada: ${new Date(patient.dischargeDate).toLocaleDateString('es-ES')}`,
      icon: CheckCircle,
      color: 'gray'
    }] : [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveView('timeline')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeView === 'timeline'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Timeline
        </button>
        <button
          onClick={() => setActiveView('stats')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeView === 'stats'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Estadísticas
        </button>
        <button
          onClick={() => setActiveView('documents')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeView === 'documents'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Documentos
        </button>
      </div>

      {/* Timeline View */}
      {activeView === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Línea de Tiempo del Tratamiento
            </h3>
            <Badge variant="default" className="bg-blue-600">
              {calculateDaysInProgram()} días en programa
            </Badge>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

            <div className="space-y-6">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon;
                return (
                  <div key={index} className="relative flex gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                      event.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                      event.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      event.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{event.title}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(event.date).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Stats View */}
      {activeView === 'stats' && (
        <div className="space-y-6">
          {/* Attendance Stats */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Estadísticas de Asistencia
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Días</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{attendanceStats.totalDays}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Días Presentes</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{attendanceStats.presentDays}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ausencias</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{attendanceStats.absentDays}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">% Asistencia</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{attendanceStats.attendanceRate?.toFixed(1) ?? 0}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tasa de Asistencia</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{attendanceStats.attendanceRate?.toFixed(1) ?? 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${attendanceStats.attendanceRate ?? 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Goals Progress */}
          {patient.goals && patient.goals.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                Progreso en Objetivos
              </h3>

              <div className="space-y-4">
                {getGoalProgress().map((goal, index) => (
                  <div key={goal.id || index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Objetivo {goal.goalNumber}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{goal.goalText}</p>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        {goal.progress}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Documents View */}
      {activeView === 'documents' && (
        <div className="space-y-6">
          {/* Generated Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Notas Generadas ({notes.length})
            </h3>

            {notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            Nota Objetivo {note.goalNumber}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(note.noteDate).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => note.fileName && notesService.downloadAndSave(note.id, note.fileName)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">No hay notas generadas aún</p>
              </div>
            )}
          </div>

          {/* MTPR Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
              Planes de Tratamiento (MTPR) ({mtprNotes.filter(m => m.isGenerated).length})
            </h3>

            {mtprNotes.filter(m => m.isGenerated).length > 0 ? (
              <div className="space-y-3">
                {mtprNotes.filter(m => m.isGenerated).map((mtpr) => (
                  <div key={mtpr.mtprNumber} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            MTPR #{mtpr.mtprNumber}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Fecha: {mtpr.dueDate.toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Award className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">No hay planes MTPR generados aún</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
