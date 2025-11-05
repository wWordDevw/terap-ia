import { Injectable } from '@nestjs/common';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
} from 'docx';
import { GeneratedMultidisciplinaryNote } from '../entities/generated-multidisciplinary-note.entity';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Servicio para generar documentos Word de juntas multidisciplinarias
 * RF-031 a RF-033
 */
@Injectable()
export class WordMultidisciplinaryTemplateService {
  /**
   * Genera un documento Word para una nota multidisciplinaria
   */
  async generateNote(note: GeneratedMultidisciplinaryNote): Promise<Buffer> {
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
              text: 'MULTIDISCIPLINARY TEAM MEETING NOTE',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),

            // Patient Information
            new Paragraph({
              children: [
                new TextRun({ text: 'Patient: ', bold: true }),
                new TextRun(
                  note.patient
                    ? `${note.patient.firstName} ${note.patient.lastName}`
                    : 'N/A',
                ),
                new TextRun({ text: ' | Number: ', bold: true }),
                new TextRun(note.patient?.patientNumber || 'N/A'),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Meeting Date: ', bold: true }),
                new TextRun(this.formatDate(note.meetingDate)),
                new TextRun({ text: ' | Review #: ', bold: true }),
                new TextRun(note.reviewNumber.toString()),
              ],
              spacing: { after: 300 },
            }),

            // Participants
            new Paragraph({
              text: 'MEETING PARTICIPANTS:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),

            ...this.createParticipantsList(note.participants),

            // Case Summary
            new Paragraph({
              text: 'CASE SUMMARY:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 },
            }),

            new Paragraph({
              text: note.caseSummary,
              spacing: { after: 300 },
            }),

            // Current Status
            new Paragraph({
              text: 'CURRENT STATUS:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 },
            }),

            new Paragraph({
              text: note.currentStatus,
              spacing: { after: 300 },
            }),

            // Team Discussion
            new Paragraph({
              text: 'TEAM DISCUSSION:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 },
            }),

            new Paragraph({
              text: note.teamDiscussion,
              spacing: { after: 300 },
            }),

            // Recommendations
            new Paragraph({
              text: 'RECOMMENDATIONS:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 },
            }),

            new Paragraph({
              text: note.recommendations,
              spacing: { after: 300 },
            }),

            // Action Plan
            new Paragraph({
              text: 'ACTION PLAN:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 200 },
            }),

            new Paragraph({
              text: note.actionPlan,
              spacing: { after: 300 },
            }),

            // Follow-up Plan (if exists)
            ...(note.followUpPlan
              ? [
                  new Paragraph({
                    text: 'FOLLOW-UP PLAN:',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                  }),
                  new Paragraph({
                    text: note.followUpPlan,
                    spacing: { after: 300 },
                  }),
                ]
              : []),

            // Next Meeting
            ...(note.nextMeetingDate
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Next Meeting Date: ', bold: true }),
                      new TextRun(this.formatDate(note.nextMeetingDate)),
                    ],
                    spacing: { before: 300, after: 400 },
                  }),
                ]
              : []),

            // Signatures Section
            new Paragraph({
              text: 'SIGNATURES:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 500, after: 300 },
            }),

            ...this.createSignatureSection(note.participants),
          ],
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Crea lista de participantes
   */
  private createParticipantsList(
    participants: Array<{ name: string; role: string; signature?: string }>,
  ): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    participants.forEach((participant, index) => {
      const isLast = index === participants.length - 1;
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${index + 1}. `, bold: true }),
            new TextRun({ text: participant.name, bold: true }),
            new TextRun({ text: ` - ${participant.role}` }),
          ],
          spacing: { after: isLast ? 300 : 100 },
        }),
      );
    });

    return paragraphs;
  }

  /**
   * Crea sección de firmas
   */
  private createSignatureSection(
    participants: Array<{ name: string; role: string; signature?: string }>,
  ): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    participants.forEach((participant) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${participant.name} (${participant.role})`, bold: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Signature: ' }),
            new TextRun('_____________________________'),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Date: ' }),
            new TextRun('_____________________________'),
          ],
          spacing: { after: 300 },
        }),
      );
    });

    return paragraphs;
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
    const uploadDir = path.join(process.cwd(), 'uploads', 'multidisciplinary');

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
    return `multidisciplinary_${patientId}_review${reviewNumber}_${timestamp}.docx`;
  }
}
