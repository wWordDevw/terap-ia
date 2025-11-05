"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Download,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Stethoscope,
  Users,
  Brain,
} from "lucide-react";
import Badge from "@/components/ui/bagde";
import Dialog from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { getPacienteById } from "@/data/mock-pacientes";
import {
  calculateMTPRDates,
  formatDate,
  isToday,
  isPast,
  isFuture,
  calculateDaysInTreatment,
} from "@/lib/utils";
import type { Paciente } from "@/lib/types";

interface MTTPRProgress {
  codigo: string;
  estado: "No progress" | "Minimal progress" | "Moderate progress";
}

interface PreviewState {
  show: boolean;
  tipo: "MTPR" | "Multidisciplinario" | "";
  fecha: string;
  mtprIndex: number | null;
  pacienteId: string;
}

export default function PacienteReviewsPage() {
  const params = useParams();
  const pacienteId = params.id as string;

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [preview, setPreview] = useState<PreviewState>({
    show: false,
    tipo: "",
    fecha: "",
    mtprIndex: null,
    pacienteId: "",
  });

  useEffect(() => {
    const pacienteData = getPacienteById(pacienteId);
    if (pacienteData) {
      setPaciente(pacienteData);
    }
  }, [pacienteId]);

  if (!paciente) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Paciente no encontrado</p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
        >
          Volver a la lista
        </Link>
      </div>
    );
  }

  const fechasMTPR = calculateMTPRDates(paciente.ingreso, paciente.discharge);
  const diasEnTratamiento = calculateDaysInTreatment(
    paciente.ingreso,
    paciente.discharge
  );

  const getMTPRProgress = (index: number): MTTPRProgress[] => {
    const diagnosticos = paciente.diagnosticos;
    return diagnosticos.map((diag, i) => {
      let estado: MTTPRProgress["estado"] = "No progress";

      if (index === 0) {
        estado = "No progress";
      } else if (index === 1) {
        estado =
          i === diagnosticos.length - 1 ? "Minimal progress" : "No progress";
      } else if (index === 2) {
        estado =
          i >= diagnosticos.length - 2 ? "Minimal progress" : "No progress";
      } else if (index === 3) {
        estado =
          i === diagnosticos.length - 1
            ? "Moderate progress"
            : i >= diagnosticos.length - 2
            ? "Minimal progress"
            : "No progress";
      } else {
        estado =
          i >= diagnosticos.length - 2 ? "Moderate progress" : "No progress";
      }

      return { codigo: diag.codigo, estado: "No progress" };
    });
  };

  const abrirPreview = (
    tipo: "MTPR" | "Multidisciplinario",
    fecha: string,
    mtprIndex: number | null = null
  ) => {
    setPreview({ show: true, tipo, fecha, mtprIndex, pacienteId });
  };

  const simularDescarga = () => {
    const filename = `${preview.tipo.toLowerCase()}_${paciente.numeroClinica}_${
      preview.fecha
    }.docx`;
    alert(
      `Descarga simulada: ${filename} generado correctamente\n\nEn la implementación real se generaría un documento Word completo con toda la información del review.`
    );
    setPreview({
      show: false,
      tipo: "",
      fecha: "",
      mtprIndex: null,
      pacienteId: "",
    });
  };

  const getEstadoFecha = (fecha: string) => {
    if (isToday(fecha)) return "hoy";
    if (isPast(fecha)) return "pasado";
    if (isFuture(fecha)) {
      const diffDays = Math.ceil(
        (new Date(fecha).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
      );
      if (diffDays <= 7) return "proximo";
    }
    return "futuro";
  };

  const isActive =
    !paciente.discharge || new Date(paciente.discharge) > new Date();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link
          href={`/pacientes/${paciente.id}`}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Volver al perfil"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reviews - {paciente.nombre}
          </h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-gray-600">#{paciente.numeroClinica}</span>
            <span className="text-gray-400">•</span>
            {isActive ? (
              <Badge variant="success">Activo</Badge>
            ) : (
              <Badge variant="default">Dado de Alta</Badge>
            )}
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              {diasEnTratamiento} días en tratamiento
            </span>
          </div>
        </div>
      </div>

      {/* Alert si hay fechas próximas */}
      {fechasMTPR.some(
        (fecha) =>
          getEstadoFecha(fecha) === "hoy" || getEstadoFecha(fecha) === "proximo"
      ) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">MTPR Próximo</h3>
              <p className="text-blue-700 text-sm">
                Hay fechas de MTPR programadas para esta semana. Verificar
                asistencia antes de generar documentos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Información del paciente */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Información del Paciente
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="text-sm font-medium text-gray-700 block">
              Ingreso:
            </span>
            <div className="text-gray-900">{formatDate(paciente.ingreso)}</div>
          </div>
          {paciente.discharge && (
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Discharge:
              </span>
              <div className="text-gray-900">
                {formatDate(paciente.discharge)}
              </div>
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-gray-700 block">
              Diagnósticos:
            </span>
            <div className="text-gray-900">
              {paciente.diagnosticos.length} códigos ICD-10
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700 block">
              MTPR disponibles:
            </span>
            <div className="text-gray-900">{fechasMTPR.length} fechas</div>
          </div>
        </div>

        {/* Diagnósticos detallados */}
        <div className="mt-4">
          <span className="text-sm font-medium text-gray-700 block mb-2">
            Diagnósticos ICD-10:
          </span>
          <div className="flex flex-wrap gap-2">
            {paciente.diagnosticos.map((diagnostico, index) => (
              <Badge key={diagnostico.codigo || index} variant="info">
                {diagnostico.codigo}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de fechas MTPR */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Fechas de MTPR Disponibles
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Generación de documentos MTPR y Multidisciplinario según calendario
            de tratamiento
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {fechasMTPR.map((fecha, index) => {
            const estado = getEstadoFecha(fecha);
            const progreso = getMTPRProgress(index);
            const totalConProgreso = progreso.filter(
              (p) => p.estado !== "No progress"
            ).length;
            const porcentajeProgreso = Math.round(
              (totalConProgreso / progreso.length) * 100
            );

            return (
              <div
                key={fecha}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  {/* Información de la fecha */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        MTPR #{index + 1}
                      </h3>
                      {estado === "hoy" && <Badge variant="error">Hoy</Badge>}
                      {estado === "proximo" && (
                        <Badge variant="warning">Esta semana</Badge>
                      )}
                      {estado === "pasado" && (
                        <Badge variant="success">Completado</Badge>
                      )}
                      {estado === "futuro" && (
                        <Badge variant="default">Programado</Badge>
                      )}

                      {/* Indicador de progreso */}
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {porcentajeProgreso}% progreso
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(fecha)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          {index === 0
                            ? "Primer MTPR (día 18)"
                            : `${18 + 30 * index} días del ingreso`}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Brain className="w-4 h-4 mr-2" />
                        <span>
                          {totalConProgreso} de {progreso.length} con progreso
                        </span>
                      </div>
                    </div>

                    {/* Preview de progreso para MTPR */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Stethoscope className="w-4 h-4 mr-1" />
                        Vista previa de progreso por diagnóstico:
                      </h4>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {progreso.slice(0, 6).map((item) => (
                          <div
                            key={item.codigo}
                            className="flex items-center justify-between text-xs p-3 bg-gray-50 rounded-md border"
                          >
                            <span className="font-mono text-gray-900 font-medium">
                              {item.codigo}
                            </span>
                            <Badge
                              variant={
                                item.estado.includes("Moderate")
                                  ? "success"
                                  : item.estado.includes("Minimal")
                                  ? "warning"
                                  : "default"
                              }
                              className="text-xs"
                            >
                              {item.estado === "No progress"
                                ? "Sin progreso"
                                : item.estado === "Minimal progress"
                                ? "Progreso mínimo"
                                : "Progreso moderado"}
                            </Badge>
                          </div>
                        ))}
                        {progreso.length > 6 && (
                          <div className="text-xs text-gray-500 p-3 flex items-center">
                            <Users className="w-3 h-3 mr-1" />+
                            {progreso.length - 6} diagnósticos más...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Patrón de progreso explicado */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <h5 className="font-medium text-blue-900 mb-1 text-sm">
                        Patrón de Progreso MTPR #{index + 1}:
                      </h5>
                      <p className="text-sm text-blue-800">
                        {index === 0 &&
                          "Evaluación inicial - todos los diagnósticos sin progreso documentado"}
                        {index === 1 &&
                          "Progreso mínimo en el último diagnóstico de la lista"}
                        {index === 2 &&
                          "Progreso mínimo en los dos últimos diagnósticos"}
                        {index === 3 &&
                          "Progreso moderado en el último, mínimo en el penúltimo diagnóstico"}
                        {index >= 4 &&
                          "Progreso moderado en los dos últimos diagnósticos de la lista"}
                      </p>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col space-y-3 ml-6">
                    <Button
                      onClick={() => abrirPreview("MTPR", fecha, index)}
                      variant="default"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Generar MTPR</span>
                    </Button>
                    <Button
                      onClick={() => abrirPreview("Multidisciplinario", fecha)}
                      variant="secondary"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>Multidisciplinario</span>
                    </Button>
                  </div>
                </div>

                {/* Alertas específicas por estado */}
                {estado === "pasado" && (
                  <div className="mt-4 flex items-center text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Esta fecha ya pasó. Los documentos pueden generarse como
                    registros históricos.
                  </div>
                )}
                {estado === "hoy" && (
                  <div className="mt-4 flex items-center text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-md">
                    <AlertTriangle className="w-4 h-4 text-blue-500 mr-2" />
                    MTPR programado para hoy. Verificar asistencia "Presente"
                    antes de generar.
                  </div>
                )}
                {estado === "proximo" && (
                  <div className="mt-4 flex items-center text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-md">
                    <Calendar className="w-4 h-4 text-amber-500 mr-2" />
                    Próximo MTPR programado esta semana. Preparar documentación
                    necesaria.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-medium text-amber-900 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Reglas de Generación de Documentos
          </h3>
          <ul className="text-sm text-amber-800 space-y-2">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Solo se pueden generar documentos si el paciente estuvo "Presente"
              ese día
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Los MTPR siguen patrones de progreso automáticos por número de
              revisión
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Los documentos incluyen firmas digitales de terapeutas y
              supervisores
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Las fechas de domingo se ajustan automáticamente al lunes
              siguiente
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Tipos de Documento Disponibles
          </h3>
          <div className="space-y-3">
            <div className="text-sm text-blue-800">
              <div className="flex items-center font-medium mb-1">
                <Brain className="w-4 h-4 mr-1" />
                <strong>MTPR (Multi-Treatment Progress Review):</strong>
              </div>
              <p className="text-xs pl-5">
                Revisión de progreso multi-tratamiento con evaluación detallada
                de cada diagnóstico ICD-10 y patrones de progreso automáticos
                según el número de revisión.
              </p>
            </div>
            <div className="text-sm text-blue-800">
              <div className="flex items-center font-medium mb-1">
                <Users className="w-4 h-4 mr-1" />
                <strong>Multidisciplinario:</strong>
              </div>
              <p className="text-xs pl-5">
                Evaluación del equipo completo de tratamiento incluyendo
                perspectivas de terapeutas, psiquiatras, trabajadores sociales y
                especialistas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Vista Previa */}
      <Dialog
        isOpen={preview.show}
        onClose={() =>
          setPreview({
            show: false,
            tipo: "",
            fecha: "",
            mtprIndex: null,
            pacienteId: "",
          })
        }
        title={`Vista Previa - ${preview.tipo}`}
        size="xl"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Header del documento */}
          <div className="border-b pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {preview.tipo} - {paciente.nombre}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Paciente:</span>{" "}
                    {paciente.numeroClinica}
                  </div>
                  <div>
                    <span className="font-medium">Fecha:</span>{" "}
                    {formatDate(preview.fecha)}
                  </div>
                  <div>
                    <span className="font-medium">Tipo:</span> {preview.tipo}
                  </div>
                  <div>
                    <span className="font-medium">Revisión:</span>
                    {preview.tipo === "MTPR" && preview.mtprIndex !== null
                      ? ` #${preview.mtprIndex + 1}`
                      : " N/A"}
                  </div>
                </div>
              </div>
              <Badge variant={preview.tipo === "MTPR" ? "info" : "success"}>
                {preview.tipo}
              </Badge>
            </div>
          </div>

          {/* Contenido específico del MTPR */}
          {preview.tipo === "MTPR" && preview.mtprIndex !== null && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Progreso por Diagnóstico ICD-10:
              </h4>
              <div className="space-y-3">
                {getMTPRProgress(preview.mtprIndex).map((item) => (
                  <div
                    key={item.codigo}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border"
                  >
                    <div>
                      <span className="font-medium text-gray-900 font-mono">
                        {item.codigo}
                      </span>
                      <p className="text-sm text-gray-600">
                        Diagnóstico según clasificación ICD-10
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          item.estado.includes("Moderate")
                            ? "success"
                            : item.estado.includes("Minimal")
                            ? "warning"
                            : "default"
                        }
                      >
                        {item.estado === "No progress"
                          ? "Sin progreso"
                          : item.estado === "Minimal progress"
                          ? "Progreso mínimo"
                          : "Progreso moderado"}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Estado documentado
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  Patrón de Progreso Automático:
                </h5>
                <p className="text-sm text-blue-800">
                  <strong>MTPR #{preview.mtprIndex + 1}:</strong>
                  {preview.mtprIndex === 0 &&
                    " Evaluación inicial - todos los diagnósticos sin progreso documentado según protocolo estándar"}
                  {preview.mtprIndex === 1 &&
                    " Progreso mínimo aplicado al último diagnóstico de la lista según algoritmo terapéutico"}
                  {preview.mtprIndex === 2 &&
                    " Progreso mínimo aplicado a los dos últimos diagnósticos siguiendo patrón establecido"}
                  {preview.mtprIndex === 3 &&
                    " Progreso moderado en el último diagnóstico, mínimo en el penúltimo según evolución"}
                  {preview.mtprIndex >= 4 &&
                    " Progreso moderado en los dos últimos diagnósticos indicando mejora significativa"}
                </p>
              </div>
            </div>
          )}

          {/* Contenido del Multidisciplinario */}
          {preview.tipo === "Multidisciplinario" && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Evaluación del Equipo Multidisciplinario:
              </h4>
              <div className="space-y-4">
                {[
                  {
                    rol: "Terapeuta Principal",
                    especialidad: "Terapia Individual y Grupal",
                  },
                  { rol: "Psiquiatra", especialidad: "Manejo Farmacológico" },
                  {
                    rol: "Trabajador Social",
                    especialidad: "Recursos Comunitarios",
                  },
                  {
                    rol: "Enfermero Especialista",
                    especialidad: "Cuidados de Salud Mental",
                  },
                  {
                    rol: "Coordinador Clínico",
                    especialidad: "Planificación del Tratamiento",
                  },
                ].map((miembro, index) => (
                  <div key={miembro.rol} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">
                        {miembro.rol}
                      </h5>
                      <Badge variant="info">{miembro.especialidad}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      [Evaluación del {miembro.rol.toLowerCase()}] - Esta
                      sección contendrá la evaluación específica desde la
                      perspectiva de {miembro.especialidad.toLowerCase()},
                      incluyendo observaciones clínicas, recomendaciones y plan
                      de coordinación.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plantilla del documento */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Contenido del Documento Generado:
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              [Plantilla de {preview.tipo}] - Este documento será generado
              automáticamente con:
            </p>
            <ul className="text-sm text-gray-700 space-y-2 ml-4">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Información detallada del progreso y evolución del paciente
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Métricas cuantificadas de asistencia y participación en
                tratamiento
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Evaluación terapéutica profesional y recomendaciones específicas
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                Análisis detallado de goals de tratamiento y objetivos
                alcanzados
              </li>
              {preview.tipo === "MTPR" && (
                <>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Revisión específica de cada diagnóstico ICD-10 con progreso
                    cuantificado
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Aplicación de patrones de progreso según protocolo
                    establecido
                  </li>
                </>
              )}
              {preview.tipo === "Multidisciplinario" && (
                <>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Evaluaciones individuales de cada miembro del equipo de
                    tratamiento
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Plan integrado de coordinación interdisciplinaria y
                    continuidad
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Firmas requeridas */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Firmas Digitales Requeridas:
            </h4>
            <div className="space-y-3">
              {[
                "Terapeuta Principal",
                "Psiquiatra/Médico Tratante",
                "Coordinador Clínico",
                ...(preview.tipo === "Multidisciplinario"
                  ? ["Trabajador Social", "Enfermero Especialista"]
                  : []),
              ].map((rol, index) => (
                <div
                  key={rol}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-md bg-white"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {rol}:
                  </span>
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span className="border-b border-dotted border-gray-400 px-8 py-1">
                      Firma digital
                    </span>
                    <span className="border-b border-dotted border-gray-400 px-6 py-1">
                      Fecha
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 flex items-start">
                <AlertTriangle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                Las fechas de firma se completarán automáticamente al momento de
                la firma digital. El documento incluye timestamp de generación y
                trazabilidad completa.
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción del modal */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <Button
            onClick={() =>
              setPreview({
                show: false,
                tipo: "",
                fecha: "",
                mtprIndex: null,
                pacienteId: "",
              })
            }
            variant="secondary"
          >
            Cerrar Vista Previa
          </Button>
          <Button
            onClick={simularDescarga}
            variant="default"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Descargar .docx</span>
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
