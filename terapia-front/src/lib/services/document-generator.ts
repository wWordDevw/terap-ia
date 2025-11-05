/**
 * Servicio de Generación de Documentos .docx
 *
 * Este servicio maneja la generación de notas terapéuticas en formato .docx
 * usando templates predefinidos y reemplazando campos dinámicos.
 */

import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, PageBreak } from 'docx';
import { MTPRData } from './mtpr-service';
import { MultidisciplinaryData } from '@/components/mtpr/multidisciplinary-editor';

export interface PatientData {
  nombre: string;
  numeroExpediente: string;
  fechaNacimiento: string;
  metas: string[];
  diagnosticos: string[];
}

export interface ActivityData {
  codigo: string;
  titulo: string;
  descripcion?: string;
  parrafo: string;
  respuestaPaciente: string;
}

export interface NotaData {
  paciente: PatientData;
  fecha: string;
  actividades: ActivityData[];
  asistencia: 'P' | 'A' | 'D';
  justificacionAusencia?: {
    tipo: 'medical_appointment' | 'family_trip' | 'hospitalized';
    notas?: string;
    fechaInicio?: string;
    fechaFin?: string;
  };
  terapeuta: {
    nombre: string;
    firma?: string;
  };
  tipoPrograma: 'PHP' | 'IOP';
  diaSemana: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';
}

class DocumentGeneratorService {
  /**
   * Generar documento .docx desde un template
   */
  async generarNota(notaData: NotaData): Promise<void> {
    try {
      // Determinar qué template usar basado en el día de la semana
      const templateName = this.getTemplateName(notaData.tipoPrograma, notaData.diaSemana);

      // Cargar el template
      const templateBlob = await this.loadTemplate(templateName);
      const templateArrayBuffer = await templateBlob.arrayBuffer();

      // Crear instancia de PizZip con el template
      const zip = new PizZip(templateArrayBuffer);

      // Crear instancia de Docxtemplater
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Preparar los datos para el template
      const templateData = this.prepareTemplateData(notaData);

      // Rellenar el template con los datos
      doc.render(templateData);

      // Generar el documento
      const generatedDoc = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      // Descargar el documento
      const fileName = this.generateFileName(notaData);
      saveAs(generatedDoc, fileName);

    } catch (error) {
      console.error('Error al generar documento:', error);
      throw new Error('No se pudo generar el documento. Por favor intenta nuevamente.');
    }
  }

  /**
   * Determinar el nombre del template según el tipo de programa y día
   */
  private getTemplateName(tipoPrograma: 'PHP' | 'IOP', diaSemana: string): string {
    if (tipoPrograma === 'PHP') {
      switch (diaSemana) {
        case 'lunes':
          return 'PHP 1.docx';
        case 'martes':
          return 'PHP 2.docx';
        case 'miercoles':
          return 'PHP 1.docx'; // Reutilizando template
        case 'jueves':
          return 'PHP 4.docx';
        case 'viernes':
          return 'PHP 5.docx'; // Viernes tiene doble nota
        default:
          return 'PHP 1.docx';
      }
    } else {
      // IOP: lunes a jueves
      switch (diaSemana) {
        case 'lunes':
          return 'PHP 1.docx';
        case 'martes':
          return 'PHP 2.docx';
        case 'miercoles':
          return 'PHP 4.docx';
        case 'jueves':
          return 'PHP 5.docx'; // Jueves tiene doble nota en IOP
        default:
          return 'PHP 1.docx';
      }
    }
  }

  /**
   * Cargar template desde /public/templates
   */
  private async loadTemplate(templateName: string): Promise<Blob> {
    const response = await fetch(`/templates/${templateName}`);
    if (!response.ok) {
      throw new Error(`No se pudo cargar el template: ${templateName}`);
    }
    return await response.blob();
  }

  /**
   * Preparar datos para el template
   * Los campos deben coincidir con los placeholders en el .docx
   * Formato: {nombreCampo} en el Word
   */
  private prepareTemplateData(notaData: NotaData): any {
    const { paciente, fecha, actividades, asistencia, terapeuta } = notaData;

    return {
      // Datos del paciente
      nombrePaciente: paciente.nombre,
      numeroExpediente: paciente.numeroExpediente,
      fechaNacimiento: paciente.fechaNacimiento,
      metas: paciente.metas.join('\n'), // Unir metas con saltos de línea
      diagnosticos: paciente.diagnosticos.join(', '),

      // Fecha de la nota
      fechaNota: this.formatDate(fecha),
      diaSemana: notaData.diaSemana,

      // Asistencia
      asistencia: asistencia === 'P' ? 'Presente' : asistencia === 'A' ? 'Ausente' : 'Alta',
      justificacion: notaData.justificacionAusencia ?
        this.formatJustificacion(notaData.justificacionAusencia) : '',

      // Actividades - Crear un array para iterar en el template
      actividades: actividades.map((act, index) => ({
        numero: index + 1,
        codigo: act.codigo,
        titulo: act.titulo,
        parrafo: act.parrafo,
        respuestaPaciente: act.respuestaPaciente,
      })),

      // Datos del terapeuta
      nombreTerapeuta: terapeuta.nombre,
      firmaTerapeuta: terapeuta.firma || '',

      // Tipo de programa
      tipoPrograma: notaData.tipoPrograma,
    };
  }

  /**
   * Formatear fecha a formato legible
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  }

  /**
   * Formatear justificación de ausencia
   */
  private formatJustificacion(justificacion: NotaData['justificacionAusencia']): string {
    if (!justificacion) return '';

    const tipos = {
      'medical_appointment': 'Cita Médica',
      'family_trip': 'Viaje Familiar',
      'hospitalized': 'Hospitalizado',
    };

    let texto = `Justificación: ${tipos[justificacion.tipo]}`;

    if (justificacion.fechaInicio && justificacion.fechaFin) {
      texto += ` (${this.formatDate(justificacion.fechaInicio)} - ${this.formatDate(justificacion.fechaFin)})`;
    }

    if (justificacion.notas) {
      texto += `\nNotas: ${justificacion.notas}`;
    }

    return texto;
  }

  /**
   * Generar nombre de archivo para descargar
   */
  private generateFileName(notaData: NotaData): string {
    const { paciente, fecha, tipoPrograma, diaSemana } = notaData;
    const fechaFormateada = fecha.replace(/\//g, '-');
    const nombreLimpio = paciente.nombre.replace(/\s+/g, '_');

    return `${tipoPrograma}_${nombreLimpio}_${diaSemana}_${fechaFormateada}.docx`;
  }

  /**
   * Generar múltiples notas (toda una semana)
   */
  async generarNotasSemana(notasSemana: NotaData[]): Promise<void> {
    for (const nota of notasSemana) {
      await this.generarNota(nota);
      // Pequeño delay entre generaciones para no saturar
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  /**
   * Generar documento MTPR (Master Treatment Plan Review)
   */
  async generateMTPR(mtprData: MTPRData): Promise<void> {
    try {
      const { patient, mtprNumber, progress, goals, dueDate } = mtprData;

      // Crear el documento
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Título del documento
            new Paragraph({
              text: 'MASTER TREATMENT PLAN REVIEW (MTPR)',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 }
            }),

            // Número de MTPR
            new Paragraph({
              children: [
                new TextRun({
                  text: `MTPR #${mtprNumber}`,
                  bold: true,
                  size: 32
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 }
            }),

            // Fecha
            new Paragraph({
              children: [
                new TextRun({
                  text: `Fecha: ${this.formatDate(dueDate.toISOString())}`,
                  size: 24
                })
              ],
              spacing: { after: 400 }
            }),

            // Información del paciente
            new Paragraph({
              text: 'INFORMACIÓN DEL PACIENTE',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Nombre: ',
                  bold: true
                }),
                new TextRun({
                  text: patient.nombre || 'N/A'
                })
              ],
              spacing: { after: 150 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Número de Expediente: ',
                  bold: true
                }),
                new TextRun({
                  text: patient.numeroExpediente || 'N/A'
                })
              ],
              spacing: { after: 150 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Fecha de Nacimiento: ',
                  bold: true
                }),
                new TextRun({
                  text: patient.fechaNacimiento || 'N/A'
                })
              ],
              spacing: { after: 150 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Fecha de Admisión: ',
                  bold: true
                }),
                new TextRun({
                  text: patient.admisionDate ? this.formatDate(patient.admisionDate) : 'N/A'
                })
              ],
              spacing: { after: 400 }
            }),

            // Diagnósticos con Progreso
            new Paragraph({
              text: 'DIAGNÓSTICOS Y PROGRESO',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),

            // Tabla de diagnósticos
            this.createDiagnosisTable(progress),

            new Paragraph({
              text: '',
              spacing: { after: 400 }
            }),

            // Metas del tratamiento
            new Paragraph({
              text: 'METAS DEL TRATAMIENTO',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),

            ...this.createGoalsParagraphs(goals),

            new Paragraph({
              text: '',
              spacing: { after: 600 }
            }),

            // Firmas
            new Paragraph({
              text: 'FIRMAS',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 600, after: 300 }
            }),

            new Paragraph({
              text: '',
              spacing: { after: 400 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '_'.repeat(50)
                })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Firma del Terapeuta',
                  italics: true
                })
              ],
              spacing: { after: 400 }
            }),

            new Paragraph({
              text: '',
              spacing: { after: 400 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: '_'.repeat(50)
                })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: 'Fecha',
                  italics: true
                })
              ]
            })
          ]
        }]
      });

      // Generar el blob del documento
      const blob = await Packer.toBlob(doc);

      // Guardar el archivo
      const fileName = this.generateMTPRFileName(patient, mtprNumber, dueDate);
      saveAs(blob, fileName);

    } catch (error) {
      console.error('Error al generar MTPR:', error);
      throw new Error('No se pudo generar el documento MTPR. Por favor intenta nuevamente.');
    }
  }

  /**
   * Crear tabla de diagnósticos con progreso
   */
  private createDiagnosisTable(progress: MTPRData['progress']): Table {
    const headerRow = new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({
            text: 'Código',
            alignment: AlignmentType.CENTER
          })],
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: 'D9D9D9' }
        }),
        new TableCell({
          children: [new Paragraph({
            text: 'Diagnóstico',
            alignment: AlignmentType.CENTER
          })],
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { fill: 'D9D9D9' }
        }),
        new TableCell({
          children: [new Paragraph({
            text: 'Progreso',
            alignment: AlignmentType.CENTER
          })],
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { fill: 'D9D9D9' }
        })
      ]
    });

    const dataRows = progress.map(diag => new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({
            text: diag.codigo,
            alignment: AlignmentType.CENTER
          })],
          width: { size: 20, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph({ text: diag.descripcion })],
          width: { size: 50, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph({
            text: diag.progress,
            alignment: AlignmentType.CENTER
          })],
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: {
            fill: diag.progress === 'Moderate Progress' ? 'C6EFCE' :
                  diag.progress === 'Minimal Progress' ? 'FFEB9C' : 'FFC7CE'
          }
        })
      ]
    }));

    return new Table({
      rows: [headerRow, ...dataRows],
      width: { size: 100, type: WidthType.PERCENTAGE }
    });
  }

  /**
   * Crear párrafos para las metas
   */
  private createGoalsParagraphs(goals: string[]): Paragraph[] {
    if (!goals || goals.length === 0) {
      return [new Paragraph({
        children: [
          new TextRun({
            text: 'No se han definido metas específicas.',
            italics: true
          })
        ]
      })];
    }

    return goals.map((goal, index) => new Paragraph({
      children: [
        new TextRun({
          text: `${index + 1}. `,
          bold: true
        }),
        new TextRun({
          text: goal
        })
      ],
      spacing: { after: 150 }
    }));
  }

  /**
   * Generar nombre de archivo para MTPR
   */
  private generateMTPRFileName(patient: any, mtprNumber: number, dueDate: Date): string {
    const nombreLimpio = patient.nombre?.replace(/\s+/g, '_') || 'Paciente';
    const fechaFormateada = dueDate.toISOString().split('T')[0];
    return `MTPR_${mtprNumber}_${nombreLimpio}_${fechaFormateada}.docx`;
  }

  /**
   * Generar documento Multidisciplinario
   * Similar a MTPR pero enfocado en objetivos medibles por goal
   * Se genera en las mismas fechas que MTPR
   */
  async generateMultidisciplinary(data: MultidisciplinaryData): Promise<void> {
    try {
      const { patient, mtprNumber, dueDate, goalsWithObjectives } = data;

      // Crear secciones - una por cada goal (máximo 1 página por goal)
      const sections = goalsWithObjectives.map((goalObj, index) => {
        const children: any[] = [
          // Header
          new Paragraph({
            text: 'MULTIDISCIPLINARY TREATMENT PLAN',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),

          // Document Number
          new Paragraph({
            children: [
              new TextRun({
                text: `Document #${mtprNumber}`,
                bold: true,
                size: 28
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),

          // Fecha
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${this.formatDate(dueDate.toISOString())}`,
                size: 24
              })
            ],
            spacing: { after: 400 }
          }),

          // Patient Info
          new Paragraph({
            text: 'PATIENT INFORMATION',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Name: ',
                bold: true
              }),
              new TextRun({
                text: patient.nombre || 'N/A'
              })
            ],
            spacing: { after: 150 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Record #: ',
                bold: true
              }),
              new TextRun({
                text: patient.numeroExpediente || 'N/A'
              })
            ],
            spacing: { after: 400 }
          }),

          // Goal
          new Paragraph({
            text: `TREATMENT GOAL ${index + 1}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: goalObj.goal,
                italics: true,
                size: 24
              })
            ],
            spacing: { after: 300 }
          }),

          // Progress Level
          new Paragraph({
            children: [
              new TextRun({
                text: 'Overall Progress: ',
                bold: true
              }),
              new TextRun({
                text: goalObj.progress,
                color: goalObj.progress === 'Moderate Progress' ? '008000' :
                       goalObj.progress === 'Minimal Progress' ? 'FFA500' : 'FF0000'
              })
            ],
            spacing: { after: 400 }
          }),

          // Objectives Section
          new Paragraph({
            text: 'MEASURABLE OBJECTIVES',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),

          // Objectives Table
          this.createObjectivesTable(goalObj.objectives)
        ];

        return {
          properties: {
            page: {
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720
              }
            }
          },
          children
        };
      });

      // Crear el documento
      const doc = new Document({
        sections
      });

      // Generar el blob del documento
      const blob = await Packer.toBlob(doc);

      // Guardar el archivo
      const fileName = this.generateMultidisciplinaryFileName(patient, mtprNumber, dueDate);
      saveAs(blob, fileName);

    } catch (error) {
      console.error('Error al generar documento multidisciplinario:', error);
      throw new Error('No se pudo generar el documento multidisciplinario. Por favor intenta nuevamente.');
    }
  }

  /**
   * Crear tabla de objetivos para documento multidisciplinario
   */
  private createObjectivesTable(objectives: MultidisciplinaryData['goalsWithObjectives'][0]['objectives']): Table {
    const headerRow = new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({
            text: '#',
            alignment: AlignmentType.CENTER
          })],
          width: { size: 5, type: WidthType.PERCENTAGE },
          shading: { fill: '4472C4' }
        }),
        new TableCell({
          children: [new Paragraph({
            text: 'Objective Description',
            alignment: AlignmentType.CENTER
          })],
          width: { size: 40, type: WidthType.PERCENTAGE },
          shading: { fill: '4472C4' }
        }),
        new TableCell({
          children: [new Paragraph({
            text: 'Status',
            alignment: AlignmentType.CENTER
          })],
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { fill: '4472C4' }
        }),
        new TableCell({
          children: [new Paragraph({
            text: 'Target Date',
            alignment: AlignmentType.CENTER
          })],
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { fill: '4472C4' }
        }),
        new TableCell({
          children: [new Paragraph({
            text: 'Notes',
            alignment: AlignmentType.CENTER
          })],
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: '4472C4' }
        })
      ]
    });

    const dataRows = objectives.map((obj, index) => {
      // Color de fondo según el estado
      let statusColor = 'FFC7CE'; // Not Started - rojo claro
      if (obj.status === 'In Progress') statusColor = 'FFEB9C'; // amarillo claro
      if (obj.status === 'Achieved') statusColor = 'C6EFCE'; // verde claro

      return new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              text: `${index + 1}`,
              alignment: AlignmentType.CENTER
            })],
            width: { size: 5, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: obj.description })],
            width: { size: 40, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({
              text: obj.status,
              alignment: AlignmentType.CENTER
            })],
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: statusColor }
          }),
          new TableCell({
            children: [new Paragraph({
              text: obj.targetDate ? new Date(obj.targetDate).toLocaleDateString('es-ES') : 'N/A',
              alignment: AlignmentType.CENTER
            })],
            width: { size: 15, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: obj.notes || '' })],
            width: { size: 25, type: WidthType.PERCENTAGE }
          })
        ]
      });
    });

    return new Table({
      rows: [headerRow, ...dataRows],
      width: { size: 100, type: WidthType.PERCENTAGE }
    });
  }

  /**
   * Generar nombre de archivo para documento multidisciplinario
   */
  private generateMultidisciplinaryFileName(patient: any, mtprNumber: number, dueDate: Date): string {
    const nombreLimpio = patient.nombre?.replace(/\s+/g, '_') || 'Paciente';
    const fechaFormateada = dueDate.toISOString().split('T')[0];
    return `Multidisciplinary_${mtprNumber}_${nombreLimpio}_${fechaFormateada}.docx`;
  }
}

export const documentGeneratorService = new DocumentGeneratorService();
