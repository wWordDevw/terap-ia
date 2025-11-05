import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly apiKey: string;
  private readonly model: string;
  private genAI: GoogleGenerativeAI | null = null;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY') || 
                  this.configService.get<string>('OPENAI_API_KEY') || '';
    this.model = this.configService.get<string>('GEMINI_MODEL', 'gemini-1.5-flash');
    
    if (this.apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.logger.log('Gemini API initialized successfully');
      } catch (error) {
        this.logger.error(`Error initializing Gemini API: ${error.message}`);
        this.genAI = null;
      }
    } else {
      this.logger.warn('GEMINI_API_KEY not configured, will use fallback responses');
    }
  }

  /**
   * Genera una respuesta de cliente usando OpenAI
   * @deprecated Use generateClientResponseForActivity() instead
   */
  async generateClientResponse(
    patientName: string,
    activityName: string,
    objectiveName: string,
    context: string,
  ): Promise<string> {
    return this.generateClientResponseForActivity(patientName, activityName, objectiveName, context);
  }

  /**
   * Genera una respuesta de cliente con formato específico para terapia grupal
   * Incluye cita del cliente y la intervención del terapeuta
   */
  async generateClientResponseForActivity(
    patientName: string,
    activityName: string,
    subactivityName: string,
    paragraph: string,
    isIOP: boolean = false,
    selectedGoalNumber?: number,
    selectedGoalText?: string,
  ): Promise<string> {
    try {
      if (!this.apiKey || !this.genAI) {
        this.logger.warn('Gemini API key not configured, using fallback response');
        return this.getFallbackClientResponse();
      }

      const prompt = this.buildClientResponsePrompt(patientName, activityName, subactivityName, paragraph, isIOP, selectedGoalNumber, selectedGoalText);
      
      this.logger.log(`🤖 Generating client response for ${patientName} - ${activityName} using Gemini`);
      console.log(`🤖 [GEMINI] Generating client response for ${patientName} - ${activityName}`);
      
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();
      
      if (generatedText && generatedText.trim()) {
        this.logger.log(`✅ Successfully generated client response for ${patientName} (${generatedText.length} chars)`);
        console.log(`✅ [GEMINI] Successfully generated client response for ${patientName} (${generatedText.length} chars)`);
        return generatedText.trim();
      } else {
        this.logger.warn('⚠️ Gemini returned empty response, using fallback');
        console.warn('⚠️ [GEMINI] Returned empty response, using fallback');
        return this.getFallbackClientResponse();
      }
      
    } catch (error) {
      this.logger.error(`❌ Error generating client response with Gemini: ${error.message}`);
      console.error(`❌ [GEMINI] Error: ${error.message}`);
      console.error(`❌ [GEMINI] Stack: ${error.stack}`);
      return this.getFallbackClientResponse();
    }
  }

  /**
   * Genera un resumen de progreso del cliente
   */
  async generateProgressSummary(
    patientName: string,
    activities: Array<{ name: string; description: string }>,
  ): Promise<string> {
    try {
      if (!this.apiKey || !this.genAI) {
        this.logger.warn('Gemini API key not configured, using fallback progress summary');
        return this.getFallbackProgressSummary(patientName, activities);
      }

      const prompt = this.buildProgressSummaryPrompt(patientName, activities);
      
      this.logger.log(`🤖 Generating progress summary for ${patientName} using Gemini`);
      console.log(`🤖 [GEMINI] Generating progress summary for ${patientName}`);
      
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();
      
      if (generatedText && generatedText.trim()) {
        let summary = generatedText.trim();
        
        // Asegurar que el resumen tenga entre 480 y 560 caracteres
        const currentLength = summary.length;
        if (currentLength >= 480 && currentLength <= 560) {
          this.logger.log(`✅ Successfully generated progress summary for ${patientName} (${currentLength} chars)`);
          console.log(`✅ [GEMINI] Successfully generated progress summary for ${patientName} (${currentLength} chars)`);
          return summary;
        }
        
        // Si es más largo, truncar a 560 caracteres
        if (currentLength > 560) {
          this.logger.warn(`⚠️ Progress summary too long (${currentLength} chars), truncating to 560`);
          console.warn(`⚠️ [GEMINI] Summary too long (${currentLength} chars), truncating`);
          return summary.substring(0, 557) + '...';
        }
        
        // Si es más corto, expandir ligeramente
        if (currentLength < 480) {
          this.logger.warn(`⚠️ Progress summary too short (${currentLength} chars), using fallback`);
          console.warn(`⚠️ [GEMINI] Summary too short (${currentLength} chars), using fallback`);
          return this.getFallbackProgressSummary(patientName, activities);
        }
        
        return summary;
      } else {
        this.logger.warn('⚠️ Gemini returned empty response, using fallback');
        console.warn('⚠️ [GEMINI] Returned empty response, using fallback');
        return this.getFallbackProgressSummary(patientName, activities);
      }
      
    } catch (error) {
      this.logger.error(`❌ Error generating progress summary with Gemini: ${error.message}`);
      console.error(`❌ [GEMINI] Error generating progress summary: ${error.message}`);
      console.error(`❌ [GEMINI] Stack: ${error.stack}`);
      return this.getFallbackProgressSummary(patientName, activities);
    }
  }

  /**
   * Construye el prompt para respuesta de cliente
   */
  private buildClientResponsePrompt(
    patientName: string,
    activityName: string,
    subactivityName: string,
    paragraph: string,
    isIOP: boolean = false,
    selectedGoalNumber?: number,
    selectedGoalText?: string,
  ): string {
    const therapistType = isIOP ? 'IOP Therapist' : 'PHP Therapist';
    let prompt = `Generate a Client Response entry for a group therapy note. Include: 1) A quoted statement from the client (1-2 sentences) expressing a challenge, reflection, or emotional reaction. 2) The therapist's intervention (2-3 sentences) explaining how the clinician guided the client toward insight, cognitive reframing, or behavioral change. Tone: Clinical, empathetic, third-person, past tense.

Activity: ${activityName}
Subactivity: ${subactivityName}
Context: ${paragraph}`;

    if (selectedGoalNumber && selectedGoalText) {
      prompt += `\n\nTreatment Goal: ${selectedGoalText}
The client's statement MUST be directly related to this treatment goal.`;
    }

    prompt += `\n\nResponse format:
"[Client statement]" ${therapistType} [therapist intervention].

Response:`;

    return prompt;
  }

  /**
   * Construye el prompt para resumen de progreso
   */
  private buildProgressSummaryPrompt(
    patientName: string,
    activities: Array<{ name: string; description: string }>,
  ): string {
    const activitiesList = activities.map(a => `${a.name}: ${a.description}`).join('\n- ');
    
    return `Write the explanatory paragraph for 'Progress was Minimal.' Include: 1) The insight or understanding the client gained during the session. 2) Ongoing barriers (e.g., avoidance, emotional suppression, difficulty applying skills). 3) The recommended therapeutic focus for next sessions. Tone: Professional, clinical, third-person, past tense, 5-7 sentences. IMPORTANT: The summary must be between 480 and 560 characters to fit on a single page.

Patient: ${patientName}
Activities:
- ${activitiesList}

Response:`;
  }

  /**
   * Respuesta de fallback para respuestas de cliente
   */
  private getFallbackClientResponse(): string {
    const responses = [
      `"I usually stay quiet when something bothers me because I don't want to cause conflict." The therapist helped the client identify this as emotional avoidance and practiced using "I" statements to express discomfort respectfully.`,
      `"I tend to overthink every decision and then get paralyzed by anxiety." The therapist explored cognitive distortions related to perfectionism and introduced the concept of "good enough" decision-making to reduce distress.`,
      `"When I'm stressed, I isolate myself from everyone and then feel even worse." The therapist acknowledged the cycle and supported the client in identifying specific social connections that feel safe and accessible during low mood periods.`,
      `"I have a hard time trusting people because I've been hurt before." The therapist validated the client's protective instincts while exploring how past experiences may be preventing current healthy relationships from developing.`,
      `"I get overwhelmed by my responsibilities and end up doing nothing." The therapist helped the client break down tasks into manageable steps and introduced time-blocking techniques to reduce procrastination and emotional dysregulation.`,
      `"I feel guilty whenever I take time for myself because there's always more to do." The therapist addressed the internalized pressure and guided the client to recognize self-care as a necessary component of sustainability, not selfishness.`,
      `"I worry constantly about what others think of me and it drains my energy." The therapist explored the role of external validation seeking and introduced self-compassion exercises to strengthen the client's internal sense of worth.`,
      `"When I'm sad, I don't eat properly and then feel even more physically rundown." The therapist connected emotional and physical health, supporting the client in creating a basic care plan that prioritizes regular meals regardless of mood.`,
      `"I avoid difficult conversations because I'm afraid of making things worse." The therapist practiced assertive communication skills and helped the client identify manageable steps to address conflicts while protecting relationships.`,
      `"I don't know how to set boundaries without feeling selfish or mean." The therapist explained healthy boundaries as self-protection, not punishment, and role-played scenarios where the client could practice boundary setting with compassionate firmness.`,
      `"When I accomplish something, I immediately discount it and focus on what I haven't done." The therapist challenged this cognitive pattern and guided the client to practice acknowledging small achievements as evidence of progress, not inadequacy.`,
      `"I get anxious before group because I'm worried I'll say the wrong thing." The therapist normalized social anxiety and introduced grounding techniques to help the client feel safer while expressing themselves in group settings.`,
      `"I compare myself to others constantly and always come up short in my mind." The therapist explored how comparison serves as emotional self-punishment and helped the client identify unique strengths and values they contribute beyond external achievements.`,
      `"When life feels out of control, I stop taking my medication because it feels like the only choice I have." The therapist examined the symbolic meaning of medication and collaborated with the client to identify other areas of agency and control while maintaining treatment consistency.`,
      `"I feel like I'm always giving to others and have nothing left for myself." The therapist helped the client recognize patterns of emotional depletion and guided them to create a personalized self-care plan that doesn't require permission from others.`,
    ];

    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  /**
   * Resumen de progreso de fallback
   * IMPORTANTE: El resumen debe tener entre 480 y 560 caracteres para que todo quepa en una sola hoja
   */
  private getFallbackProgressSummary(patientName: string, activities: Array<{ name: string; description: string }>): string {
    const summaries = [
      `During the group session, the client demonstrated understanding of how executive dysfunction, poor medication adherence, and unhealthy lifestyle habits can serve as early indicators or contributors to a depressive mood. The discussion of ${activities[0]?.name || 'life skills'} highlighted how avoidance behaviors and cognitive overload can trigger emotional dysregulation. Similarly, psychoeducation on ${activities[1]?.name || 'health management'} allowed the client to recognize the connection between inconsistent medication use and mood instability. The exploration of dietary patterns during ${activities[2]?.name || 'healthy living'} revealed how impulsive food choices, especially during periods of anxiety, may perpetuate emotional lows. The client needs to continue working on ${activities[3]?.name || 'self-esteem'}, as internalized guilt and difficulty prioritizing personal needs are likely interfering with the implementation of consistent preventative behaviors.`,
      `During the group session, the client showed initial awareness of how disorganized routines and task avoidance can signal early signs of mood decline. The client identified key areas of functional impairment including difficulty with task initiation, medication management, and lifestyle choices. While the client demonstrated interest in developing more structured daily routines, ongoing barriers include perfectionistic thinking and emotional avoidance. The client should continue working on developing consistent self-care practices and identifying early warning signs to prevent mood deterioration.`,
      `Through participation in the group sessions, the client gained insight into the relationship between lifestyle factors and emotional regulation. The client acknowledged how poor nutrition, lack of routine, and medication non-adherence can exacerbate symptoms of depression and anxiety. However, the client continues to struggle with applying these insights consistently outside of the therapeutic environment. Future sessions should focus on developing concrete, time-limited action plans that make self-care more accessible during periods of low motivation.`,
      `The client demonstrated understanding of cognitive-behavioral patterns that contribute to emotional distress, particularly regarding avoidance and all-or-nothing thinking. During group discussions, the client showed awareness of how black-and-white interpretations of self and others can amplify anxiety and interfere with problem-solving. Despite this awareness, the client continues to have difficulty modifying these cognitive patterns in real-time. The therapeutic focus should remain on developing cognitive flexibility and distress tolerance skills through continued practice and reinforcement.`,
      `During the sessions, the client explored the connection between physical health, medication adherence, and mood stability. The client recognized that inconsistent self-care routines and medication management may serve as early warning signs of an impending depressive episode. While the client expressed motivation to implement more consistent preventative strategies, barriers include guilt associated with self-care and difficulty maintaining routines during periods of stress. Ongoing support is needed to help the client develop sustainable self-care practices that feel manageable rather than overwhelming.`,
    ];

    const randomIndex = Math.floor(Math.random() * summaries.length);
    let summary = summaries[randomIndex];
    
    // Asegurar que el resumen tenga entre 480 y 560 caracteres
    const currentLength = summary.length;
    if (currentLength >= 480 && currentLength <= 560) {
      return summary;
    }
    
    // Si es más largo, truncar a 560 caracteres
    if (currentLength > 560) {
      return summary.substring(0, 557) + '...';
    }
    
    // Si es más corto, expandir ligeramente para llegar a al menos 480
    if (currentLength < 480) {
      const additionalText = ' Additionally, the client should continue developing skills to recognize early warning signs and implement proactive coping strategies.';
      const expanded = summary + additionalText;
      return expanded.length <= 560 ? expanded : summary.substring(0, 557) + '...';
    }
    
    return summary;
  }
}