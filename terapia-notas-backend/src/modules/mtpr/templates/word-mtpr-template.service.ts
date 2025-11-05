import { Injectable } from '@nestjs/common';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Table,
  TableCell,
  TableRow,
  WidthType,
  BorderStyle,
} from 'docx';
import { GeneratedMtpr } from '../entities/generated-mtpr.entity';
import { PatientGoal } from '../../patients/entities/patient-goal.entity';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Servicio para generar documentos Word de MTPR
 * RF-018 a RF-027: Master Treatment Plan Review
 */
@Injectable()
export class WordMtprTemplateService {
  /**
   * Genera un documento Word para un MTPR
   */
  async generateMtpr(mtpr: GeneratedMtpr, goals: PatientGoal[]): Promise<Buffer> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header - Logo (placeholder)
            new Paragraph({
              text: '[LOGO DE LA CLÍNICA]',
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),

            // Title
            new Paragraph({
              text: 'MASTER TREATMENT PLAN REVIEW (MTPR)',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),

            // Patient Information
            new Paragraph({
              children: [
                new TextRun({ text: 'Patient: ', bold: true }),
                new TextRun(
                  mtpr.patient
                    ? `${mtpr.patient.firstName} ${mtpr.patient.lastName}`
                    : 'N/A',
                ),
                new TextRun({ text: ' | Number: ', bold: true }),
                new TextRun(mtpr.patient?.patientNumber || 'N/A'),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Review Number: ', bold: true }),
                new TextRun(`#${mtpr.reviewNumber}`),
                new TextRun({ text: ' | Review Date: ', bold: true }),
                new TextRun(this.formatDate(mtpr.reviewDate)),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Period: ', bold: true }),
                new TextRun(
                  `${this.formatDate(mtpr.periodStartDate)} to ${this.formatDate(mtpr.periodEndDate)}`,
                ),
              ],
              spacing: { after: 300 },
            }),

            // Attendance Summary
            new Paragraph({
              text: 'ATTENDANCE SUMMARY:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Attendance Percentage: ', bold: true }),
                new TextRun(`${mtpr.attendancePercentage.toFixed(2)}%`),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Days Attended: ', bold: true }),
                new TextRun(`${mtpr.totalDaysAttended} / ${mtpr.totalDaysScheduled}`),
              ],
              spacing: { after: 300 },
            }),

            // Mental Status
            new Paragraph({
              text: 'MENTAL STATUS:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),

            new Paragraph({
              text: mtpr.mentalStatus,
              spacing: { after: 300 },
            }),

            // Current Medications
            new Paragraph({
              text: 'CURRENT MEDICATIONS:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),

            ...this.createMedicationsList(mtpr.currentMedications),

            // Treatment Interventions
            new Paragraph({
              text: 'TREATMENT INTERVENTIONS:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),

            new Paragraph({
              text: mtpr.treatmentInterventions,
              spacing: { after: 300 },
            }),

            // Goals Progress
            new Paragraph({
              text: 'PROGRESS ON TREATMENT GOALS:',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { before: 400, after: 300 },
            }),

            // Goal 1
            ...this.createGoalSection(goals[0], mtpr.goal1Progress, 1),

            // Goal 2
            ...this.createGoalSection(goals[1], mtpr.goal2Progress, 2),

            // Goal 3
            ...this.createGoalSection(goals[2], mtpr.goal3Progress, 3),

            // Goal 4
            ...this.createGoalSection(goals[3], mtpr.goal4Progress, 4),

            // Barriers to Treatment
            new Paragraph({
              text: 'BARRIERS TO TREATMENT:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 },
            }),

            new Paragraph({
              text: mtpr.barriers || 'None reported',
              spacing: { after: 300 },
            }),

            // Plan for Next 90 Days
            new Paragraph({
              text: 'PLAN FOR NEXT 90 DAYS:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 },
            }),

            new Paragraph({
              text: mtpr.planNextPeriod,
              spacing: { after: 300 },
            }),

            // Discharge Planning
            ...(mtpr.dischargePlanning
              ? [
                  new Paragraph({
                    text: 'DISCHARGE PLANNING:',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                  }),
                  new Paragraph({
                    text: mtpr.dischargePlanning,
                    spacing: { after: 300 },
                  }),
                ]
              : []),

            // Signatures
            new Paragraph({
              text: '',
              spacing: { before: 500 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Therapist Signature: ', bold: true }),
                new TextRun('_____________________________'),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Date: ', bold: true }),
                new TextRun('_____________________________'),
              ],
              spacing: { after: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Psychiatrist Signature: ', bold: true }),
                new TextRun('_____________________________'),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Date: ', bold: true }),
                new TextRun('_____________________________'),
              ],
            }),
          ],
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Crea lista de medicamentos
   */
  private createMedicationsList(medications: any): Paragraph[] {
    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return [
        new Paragraph({
          text: 'None',
          spacing: { after: 300 },
        }),
      ];
    }

    const paragraphs: Paragraph[] = [];

    medications.forEach((med, index) => {
      const isLast = index === medications.length - 1;
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${index + 1}. `, bold: true }),
            new TextRun({ text: `${med.name} - `, bold: true }),
            new TextRun(med.dosage),
            ...(med.frequency ? [new TextRun(` (${med.frequency})`)] : []),
          ],
          spacing: { after: isLast ? 300 : 100 },
        }),
      );
    });

    return paragraphs;
  }

  /**
   * Crea sección de un goal
   */
  private createGoalSection(
    goal: PatientGoal,
    progress: string,
    goalNumber: number,
  ): Paragraph[] {
    return [
      new Paragraph({
        text: `GOAL ${goalNumber}:`,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Goal Description: ', bold: true }),
          new TextRun(goal?.goalText || `Goal ${goalNumber} not configured`),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Progress: ', bold: true }), new TextRun(progress)],
        spacing: { after: 200 },
      }),
    ];
  }

  /**
   * Formatea una fecha
   */
  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Guarda el documento en el sistema de archivos
   */
  async saveDocument(buffer: Buffer, fileName: string): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads', 'mtpr');

    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    return filePath;
  }

  /**
   * Genera nombre de archivo único
   */
  generateFileName(patientId: string, reviewNumber: number): string {
    const timestamp = Date.now();
    return `mtpr_${patientId}_review${reviewNumber}_${timestamp}.docx`;
  }
}
