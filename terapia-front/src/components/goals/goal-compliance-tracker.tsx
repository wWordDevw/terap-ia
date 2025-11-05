'use client';

import { useEffect, useState } from 'react';
import { goalTrackingService } from '@/lib/services';
import type { GoalComplianceReport, GoalInfo, ProgressLevel } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, TrendingDown, TrendingUp, Clock } from 'lucide-react';

interface GoalComplianceTrackerProps {
  patientId: string;
  patientName?: string;
}

/**
 * Componente para visualizar el cumplimiento de objetivos de un paciente
 */
export function GoalComplianceTracker({ patientId, patientName }: GoalComplianceTrackerProps) {
  const [complianceReport, setComplianceReport] = useState<GoalComplianceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComplianceReport();
  }, [patientId]);

  const loadComplianceReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const report = await goalTrackingService.getPatientCompliance(patientId);
      setComplianceReport(report);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el reporte de cumplimiento');
      console.error('Error loading compliance report:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (level: ProgressLevel): string => {
    return goalTrackingService.getProgressColor(level);
  };

  const getProgressBadgeVariant = (level: ProgressLevel): 'default' | 'destructive' | 'secondary' | 'outline' => {
    if (level === 'Achieved') return 'default';
    if (level === 'Regression' || level === 'No Progress') return 'destructive';
    if (level === 'Not Started') return 'secondary';
    return 'outline';
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cumplimiento de Objetivos</CardTitle>
          <CardDescription>Cargando información...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !complianceReport) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cumplimiento de Objetivos</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'No se pudo cargar el reporte'}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas generales */}
      <Card>
        <CardHeader>
          <CardTitle>Cumplimiento de Objetivos</CardTitle>
          <CardDescription>
            {patientName || complianceReport.patientName}
            {complianceReport.lastReviewDate && (
              <> • Última revisión: {formatDate(complianceReport.lastReviewDate)}</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progreso general */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progreso General</span>
              <span className="text-sm font-bold">{complianceReport.overallCompletionPercentage}%</span>
            </div>
            <Progress value={complianceReport.overallCompletionPercentage} className="h-3" />
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {complianceReport.goalsAchieved}
              </div>
              <div className="text-xs text-gray-500">Logrados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {complianceReport.goalsInProgress}
              </div>
              <div className="text-xs text-gray-500">En Progreso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">
                {complianceReport.goalsNotStarted}
              </div>
              <div className="text-xs text-gray-500">Sin Iniciar</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {complianceReport.goalsWithRegression}
              </div>
              <div className="text-xs text-gray-500">Con Regresión</div>
            </div>
          </div>

          {/* Alertas y recomendaciones */}
          {complianceReport.needsAttention && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Requiere Atención</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {complianceReport.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm">{rec}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {!complianceReport.needsAttention && (
            <Alert className="mb-4">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Todo en Orden</AlertTitle>
              <AlertDescription>
                Los objetivos están siendo monitoreados adecuadamente.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Detalles por objetivo */}
      <div className="space-y-4">
        {complianceReport.goals.map((goal: GoalInfo) => (
          <Card key={goal.goalId}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-base">
                    Objetivo #{goal.goalNumber}
                  </CardTitle>
                  <CardDescription className="mt-1">{goal.goalText}</CardDescription>
                </div>
                <Badge variant={getProgressBadgeVariant(goal.currentProgress)}>
                  {goalTrackingService.getProgressLabel(goal.currentProgress)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Barra de progreso */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Completitud</span>
                  <span className="text-sm font-bold">{goal.percentageComplete}%</span>
                </div>
                <Progress
                  value={goal.percentageComplete}
                  className="h-2"
                  style={{
                    backgroundColor: '#e5e7eb',
                  }}
                />
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Última evaluación: {formatDate(goal.lastAssessmentDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {goal.currentProgress === 'Regression' ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-gray-600">
                    {goal.totalAssessments} evaluación(es)
                  </span>
                </div>
                <div>
                  {!goal.hasRecentAssessment && (
                    <Badge variant="outline" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Sin evaluación reciente
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
