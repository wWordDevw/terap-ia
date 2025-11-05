import { Injectable } from '@nestjs/common';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel } from 'docx';

@Injectable()
export class WordTemplateService {
  
  /**
   * Genera un documento Word para una nota diaria de grupo siguiendo el formato exacto de 0701.docx
   */
  async generateGroupDayDocument(data: any): Promise<Buffer> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Generar header con información del grupo y día
          ...this.createDocumentHeader(data),
          // Generar sección para cada paciente presente
          ...this.createPatientSections(data.patients, data.activities, data.date),
        ],
      }],
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Crea el header del documento con información de la clínica, fecha y grupo
   */
  private createDocumentHeader(data: any): Paragraph[] {
    const sections: Paragraph[] = [];
    const clinicName = data.group?.clinic || 'FAMILY UNITED HEALTH COMMUNITY';
    const dayName = this.getDayOfWeek(data.date);
    const formattedDate = this.formatDate(data.date);
    
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: clinicName,
            size: 24,
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'DAILY PROGRESS NOTE / GROUP THERAPY – PARTIAL HOSPITALIZATION PROGRAM',
            size: 20,
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `SERVICE DAY/DATE: ${dayName} ${formattedDate}`,
            size: 18,
          }),
        ],
        spacing: { after: 300 },
      }),
    );
    
    return sections;
  }

  /**
   * Obtiene el día de la semana como string
   */
  private getDayOfWeek(date: string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dateObj = new Date(date);
    return days[dateObj.getDay()];
  }

  /**
   * Formatea la fecha como MM/DD/YYYY
   */
  private formatDate(date: string): string {
    const dateObj = new Date(date);
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /**
   * Crea las secciones individuales para cada paciente siguiendo el formato exacto
   */
  private createPatientSections(patients: any[], activities: any[], date: string): Paragraph[] {
    const sections: Paragraph[] = [];

    patients.forEach((patient, index) => {
      if (!patient.isPresent) return; // Solo incluir pacientes presentes

      // Información del cliente - compatibilidad con diferentes formatos de datos
      const patientName = patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim().toUpperCase();
      
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Client Name:  ${patientName}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Total Units: 4`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Client ID #: ${patient.patientNumber}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `ICD-10 Code: ${patient.diagnosis || 'F33.2'}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Goals/Objective Addressed from Client treatment Plan:`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        }),
      );

      // Objetivos del plan de tratamiento (4 objetivos con checkboxes)
      const goals = patient.goals || this.getDefaultGoals();
      goals.forEach((goal, goalIndex) => {
        const isSelected = goalIndex === 1; // Solo el segundo objetivo está seleccionado por defecto
        const checkbox = isSelected ? '☒' : '☐';
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${checkbox}GOAL#${goalIndex + 1}: ${goal.description}`,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          }),
        );
      });

      // Sección de respuesta del cliente
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `CLIENT RESPONSE TO ACTIVITIES/PROGRESS TOWARD MEETING TREATMENT PLAN GOALS AND OBJECTIVES/PLAN FOR CONTINUED DEVELOPMENT`,
              size: 20,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
      );

      // Métricas del cliente con checkboxes
      const metrics = this.getClientMetrics();
      Object.entries(metrics).forEach(([metric, options]) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: metric,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          }),
        );

        options.forEach((option, optionIndex) => {
          // Para ATTITUDE, siempre seleccionar la tercera opción (Fluctuations)
          // Para otras métricas, seleccionar la segunda opción (Minor)
          const isSelected = metric === 'ATTITUDE' ? optionIndex === 2 : optionIndex === 1;
          const checkbox = isSelected ? '☒' : '☐';
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${checkbox} ${option}`,
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            }),
          );
        });
      });

      // Habilidades/Actividades del facilitador
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `SKILL SETS ADDRESSED/ACTIVITIES PROVIDED BY FACILITATOR TO BUILD CLIENT SKILLS:`,
              size: 20,
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
      );

      // Actividades del grupo (desde la base de datos o por defecto si no hay)
      const activitiesForDocument = activities && activities.length > 0 
        ? activities 
        : this.getDefaultActivities();
      
      activitiesForDocument.slice(0, 4).forEach((activity, activityIndex) => {
        const activityText = activity.description 
          ? `Group ${activityIndex + 1}: ${activity.name}: ${activity.description}`
          : `Group ${activityIndex + 1}: ${activity.name}`;
          
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: activityText,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          }),
        );
      });

      // Respuestas del cliente por grupo
      activitiesForDocument.slice(0, 4).forEach((activity, activityIndex) => {
        const response = this.generateClientResponse(patient.name, activity.name, activity.objective || activity.name, activity.paragraph || activity.name, index);
        const goalRef = activityIndex === 1 ? ' (Goal#2/Obj2B)' : '';
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Group ${activityIndex + 1} Client Response${goalRef}: "${response}" PHP Therapist ${this.generateTherapistResponse(activity.name, activityIndex)}`,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          }),
        );
      });

      // Progreso hacia objetivos
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Progress towards meeting goals and objectives: (Significant progress, Moderate Progress, Minimal Progress, No Progress, Regression, Decompensating, Unable to determine currently) Please explain: Progress was Minimal. ${this.generateProgressExplanation(patient.name, activitiesForDocument)}`,
              size: 20,
            }),
          ],
          spacing: { before: 200, after: 200 },
        }),
      );

      // Separador entre pacientes (excepto el último)
      if (index < patients.filter(p => p.isPresent).length - 1) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '',
                size: 20,
              }),
            ],
            spacing: { after: 200 },
          }),
        );
      }
    });

    return sections;
  }

  /**
   * Obtiene las métricas del cliente con las opciones correctas
   */
  private getClientMetrics(): Record<string, string[]> {
    return {
      'COOPERATION': ['Moderate', 'Minor', 'Poor'],
      'MOTIVATION': ['Moderate', 'Minor', 'Poor'],
      'CONCENTRATION & FOCUS': ['Moderate', 'Minor', 'Poor'],
      'PEER INTERACTION': ['Moderate', 'Minor', 'Poor'],
      'ATTITUDE': ['Positive', 'Negative', 'Fluctuations'],
    };
  }

  /**
   * Obtiene objetivos por defecto si no hay objetivos específicos
   */
  private getDefaultGoals(): Array<{ description: string }> {
    return [
      { description: 'Client will identify and resolve the underlying causes of depression, thus elevating mood and interest/pleasure in life.' },
      { description: 'Client will significantly reduce the overall frequency and intensity of the anxiety symptoms so that daily functioning is improved.' },
      { description: 'Client will feel refreshed and energetic during wakeful hours.' },
      { description: 'Client will reach a personal balance between solitary time and interpersonal interaction with others.' },
    ];
  }

  /**
   * Genera una respuesta del cliente usando respuestas diferenciadas por paciente
   */
  private generateClientResponse(patientName: string, activityName: string, objective: string, paragraph: string, patientIndex: number): string {
    const responsesByActivity = [
      ["I leave most chores unfinished because I get overwhelmed just thinking about them.", "I usually wait until the mess gets out of control before I do anything.", "If I don't make a list, I forget everything and end up doing nothing.", "I try to clean everything at once, and then I feel overwhelmed and give up."],
      ["When I try to do something for myself, I feel selfish and end up quitting.", "I tend to put everyone else's needs before mine, even when I feel burned out.", "When I try to rest, I feel like I'm being lazy.", "I feel guilty when I relax, like I'm avoiding responsibilities."],
      ["Sometimes I skip my meds if I think they're making me too tired or foggy.", "I didn't want to say anything about the side effects because I thought I was just being difficult.", "Sometimes I avoid taking my meds because I'm afraid they'll make me feel worse.", "I always assume side effects mean something serious, even if it's minor."],
      ["I eat a lot of junk food when I'm anxious—it's just easier than cooking.", "I crash in the afternoons after eating heavy meals.", "I get anxious when I skip meals, but I also forget to eat when I'm stressed.", "If I eat anything unhealthy, I feel like I've failed and give up trying to eat better."],
    ];

    const activityResponses = responsesByActivity[patientIndex % 4] || responsesByActivity[0];
    return activityResponses[patientIndex % activityResponses.length] || "No response recorded.";
  }

  /**
   * Genera la respuesta del terapeuta basada en la actividad
   */
  private generateTherapistResponse(activityName: string, activityIndex: number): string {
    const responses = [
      "acknowledged how anticipatory anxiety can impair task initiation and provided the client with a visual task breakdown chart to reduce cognitive load and increase follow-through.",
      "helped the client recognize this as an internalized belief that reinforces anxiety and poor self-worth. The client was supported in developing a basic self-care routine with simple, time-limited actions to promote emotional regulation and reduce guilt.",
      "explored the anxiety-driven avoidance of side effects and emphasized the importance of consistent communication with prescribers. The client was encouraged to track symptoms and medication responses in a journal for review.",
      "explained how nutritional choices can worsen anxiety symptoms and guided the client in identifying two small, manageable food swaps to implement over the next week.",
    ];
    return responses[activityIndex % responses.length];
  }

  /**
   * Obtiene actividades por defecto si no hay configuradas
   */
  private getDefaultActivities(): any[] {
    return [
      { 
        name: 'Life Skills', 
        description: 'Managing Household Task: PHP Therapist conducted a skills-training session emphasizing the role of executive functioning in successful household task management.',
        objective: 'Improve executive functioning',
        paragraph: 'Task management skills'
      },
      { 
        name: 'Self-Esteem', 
        description: 'Practice Self-Care: PHP Therapist introduced the session by defining self-care as an essential component of self-esteem maintenance and resilience.',
        objective: 'Build self-esteem',
        paragraph: 'Self-care practices'
      },
      { 
        name: 'Health Management', 
        description: 'Drug Interactions, Side Effects, Risks: PHP Therapist led a group discussion examining common side effects of psychotropic medications.',
        objective: 'Medication management',
        paragraph: 'Side effects awareness'
      },
      { 
        name: 'Healthy Living', 
        description: 'Nutrition, Exercise, and Lifestyle Changes: PHP Therapist conducted a session highlighting the link between gut health and psychological functioning.',
        objective: 'Healthy lifestyle',
        paragraph: 'Nutrition education'
      },
    ];
  }

  /**
   * Genera la explicación del progreso basada en las actividades reales
   */
  private generateProgressExplanation(patientName: string, activities: any[]): string {
    const activityNames = activities && activities.length > 0
      ? activities.slice(0, 4).map(a => a.name.toLowerCase()).join(', ')
      : 'group activities';
    
    const firstActivity = activities?.[0]?.name?.toLowerCase() || 'life skills';
    const secondActivity = activities?.[1]?.name?.toLowerCase() || 'self-esteem';
    
    return `During the group session, the client was able to understand how difficulties in managing household tasks, medication adherence, and lifestyle habits can signal the onset of mood changes and interfere with emotional stability. The client recognized how disorganized routines and avoidance behaviors contribute to feelings of helplessness and internal distress. The connection between nutrition, movement, and emotional regulation was acknowledged as the client explored how these factors impact overall well-being. The client must continue working on ${secondActivity} through practicing self-care, as underlying beliefs about worthiness continue to interfere with the ability to implement consistent, protective behaviors.`;
  }

}