// Párrafos base que se rotan para evitar repeticiones en las notas diarias
// Se alternan automáticamente y solo se repiten cuando se agoten todos

export const parrafosRotativos: string[] = [
  // Párrafo 1 - Enfoque en participación grupal
  "During today's group session, participants engaged actively in therapeutic discussions focused on emotional regulation and interpersonal skills development. The group demonstrated increased willingness to share personal experiences and provide mutual support. Structured activities facilitated meaningful interactions between group members, promoting a sense of community and shared understanding.",

  // Párrafo 2 - Enfoque en técnicas terapéuticas
  "The session emphasized cognitive behavioral techniques and mindfulness practices to enhance coping strategies and self-awareness among group members. Participants practiced identifying negative thought patterns and implementing evidence-based interventions. The therapeutic framework encouraged participants to develop practical skills for managing daily challenges and stressors effectively.",

  // Párrafo 3 - Enfoque en comprensión y insight
  "Participants demonstrated increased understanding of therapeutic concepts through interactive exercises and peer support activities during the group session. The structured format allowed for exploration of personal insights while maintaining appropriate therapeutic boundaries. Group members showed improved ability to process emotions and communicate effectively with their peers.",

  // Párrafo 4 - Enfoque en desarrollo de habilidades
  "Today's therapeutic activities focused on building resilience and developing practical skills for managing daily challenges and stressors effectively. The group engaged in skill-building exercises that promoted emotional regulation and interpersonal effectiveness. Participants demonstrated commitment to implementing learned strategies in their daily lives and recovery process.",

  // Párrafo 5 - Enfoque en proceso terapéutico
  "The group therapy session facilitated meaningful exploration of therapeutic themes while maintaining a supportive and structured environment for all participants. Members demonstrated increased capacity for self-reflection and emotional processing throughout the scheduled activities. The collaborative approach encouraged active participation and mutual support among group members.",

  // Párrafo 6 - Enfoque en integración de aprendizaje
  "Participants actively integrated therapeutic concepts into practical applications during today's structured group activities and discussions. The session provided opportunities for skill development while fostering a supportive environment for personal growth. Group members demonstrated improved understanding of recovery principles and their application to individual circumstances.",

  // Párrafo 7 - Enfoque en comunicación y conexión
  "The therapeutic session emphasized effective communication strategies and the development of healthy interpersonal relationships within the group setting. Participants engaged in structured exercises designed to improve social skills and emotional intelligence. The group dynamic facilitated meaningful connections and provided opportunities for practicing newly learned communication techniques.",

  // Párrafo 8 - Enfoque en motivación y compromiso
  "Group members demonstrated strong motivation and commitment to their therapeutic goals throughout today's structured activities and peer interactions. The session incorporated evidence-based interventions that promoted active participation and skill development. Participants showed increased awareness of their recovery process and commitment to implementing positive behavioral changes.",

  // Párrafo 9 - Enfoque en mindfulness y conciencia
  "Today's group session integrated mindfulness practices and self-awareness exercises to enhance participants' emotional regulation and stress management capabilities. The structured format encouraged present-moment awareness while providing practical tools for managing anxiety and negative emotions. Group members demonstrated improved ability to identify triggers and implement appropriate coping strategies.",

  // Párrafo 10 - Enfoque en apoyo mutuo
  "The therapeutic group provided a supportive environment where participants shared experiences and offered mutual encouragement throughout the scheduled activities. Members demonstrated increased empathy and understanding toward their peers while maintaining appropriate therapeutic boundaries. The collaborative approach fostered a sense of community and shared commitment to recovery goals.",

  // Párrafo 11 - Enfoque en procesamiento emocional
  "Participants engaged in meaningful emotional processing and therapeutic exploration during today's structured group activities and peer discussions. The session provided a safe space for expressing difficult emotions while learning healthy coping mechanisms. Group members demonstrated improved ability to regulate emotions and respond effectively to challenging situations.",

  // Párrafo 12 - Enfoque en planificación y objetivos
  "The group session focused on goal setting and treatment planning while incorporating peer support and collaborative problem-solving approaches. Participants demonstrated increased clarity regarding their recovery objectives and developed practical strategies for achieving therapeutic goals. The structured format encouraged accountability and mutual support among group members.",

  // Párrafo 13 - Enfoque en educación terapéutica
  "Today's session incorporated psychoeducational elements and skill-building activities designed to enhance participants' understanding of mental health and recovery processes. Group members actively participated in learning activities while providing peer support and sharing relevant personal experiences. The educational approach promoted increased awareness and practical application of therapeutic principles.",

  // Párrafo 14 - Enfoque en creatividad y expresión
  "The therapeutic session utilized creative and expressive modalities to facilitate emotional processing and interpersonal connection among group participants. Members engaged in structured activities that encouraged self-expression while maintaining therapeutic focus and group cohesion. The creative approach provided alternative avenues for communication and emotional exploration.",

  // Párrafo 15 - Enfoque en resolución de problemas
  "Participants demonstrated improved problem-solving abilities and critical thinking skills during today's collaborative group activities and therapeutic discussions. The session emphasized practical application of learned strategies while encouraging peer consultation and mutual support. Group members showed increased confidence in addressing personal challenges and implementing effective solutions."
];

// Párrafos finales para el progreso (se alternan para evitar repetición textual)
export const parrafosProgresoMinimal: string[] = [
  "Progress was Minimal across all therapeutic domains. Patient continues to engage in treatment activities and demonstrate understanding of core concepts. Continued focus on skill development and practical application remains essential for therapeutic advancement.",
  
  "Progress was Minimal throughout the therapeutic session. Patient shows consistent participation in group activities while working toward established treatment goals. Ongoing reinforcement of learned skills and strategies continues to be beneficial for recovery process.",
  
  "Progress was Minimal during today's therapeutic interventions. Patient maintains active engagement in treatment programming and demonstrates commitment to recovery objectives. Continued therapeutic support and skill-building activities remain important for sustained progress.",
  
  "Progress was Minimal across therapeutic activities and interventions. Patient participates consistently in group programming while developing understanding of treatment concepts. Ongoing focus on practical skill application and emotional regulation continues to be therapeutically beneficial."
];

export const parrafosProgresoModerate: string[] = [
  "Progress was Moderate across all therapeutic domains with notable improvements in emotional regulation and interpersonal functioning. Patient demonstrates significant engagement in treatment activities and shows strong preparation for discharge transition. Continued therapeutic gains indicate readiness for step-down level of care.",
  
  "Progress was Moderate throughout therapeutic programming with observable advances in coping skills and recovery-oriented behaviors. Patient exhibits increased insight and motivation while preparing for successful community reintegration. Therapeutic improvements support transition planning and aftercare coordination.",
  
  "Progress was Moderate during treatment interventions with meaningful gains in personal recovery and functional improvement. Patient demonstrates enhanced emotional stability and effective utilization of learned therapeutic strategies. Positive therapeutic response indicates appropriate preparation for discharge and community-based services.",
  
  "Progress was Moderate across all treatment domains with significant therapeutic improvements and increased functional capacity. Patient shows substantial gains in recovery skills while demonstrating readiness for less intensive level of care. Notable progress supports transition planning and continued outpatient therapeutic engagement."
];

// Respuestas base para clientes (estas deben ser editables y únicas por paciente/actividad)
export const respuestasClienteBase: string[] = [
  "Client demonstrated progress in emotional regulation skills during structured therapeutic activities and peer interactions.",
  "Client showed improved understanding of coping strategies and their practical application to daily challenges and stressors.",
  "Client exhibited increased motivation and engagement in therapeutic processes while working toward established treatment goals.",
  "Client displayed enhanced interpersonal skills and effective communication with peers throughout the group session.",
  "Client demonstrated improved insight and self-awareness regarding personal triggers and appropriate response strategies.",
  "Client showed notable progress in implementing learned therapeutic techniques for managing anxiety and emotional distress.",
  "Client exhibited increased confidence and assertiveness while maintaining appropriate boundaries in interpersonal interactions.",
  "Client demonstrated effective problem-solving abilities and critical thinking skills during collaborative group activities.",
  "Client showed improved emotional stability and regulation throughout challenging therapeutic discussions and processing.",
  "Client displayed increased understanding of recovery principles and their personal application to individual circumstances.",
  "Client demonstrated enhanced mindfulness and present-moment awareness during structured therapeutic interventions.",
  "Client showed progress in developing healthy coping mechanisms for managing stress and negative emotional states.",
  "Client exhibited improved social skills and peer interaction abilities throughout group therapeutic activities.",
  "Client demonstrated increased commitment to treatment goals and active participation in recovery-oriented programming.",
  "Client showed notable gains in emotional processing abilities and effective expression of thoughts and feelings."
];

// ==================== TRACKING DE PÁRRAFOS USADOS ====================
// Sistema avanzado para evitar repetición de párrafos hasta que se usen todos

// Tracking separado por actividad para rotación independiente
const parrafosUsadosPorActividad = new Map<number, Set<number>>();
const progresoUsado = new Map<'Minimal' | 'Moderate', Set<number>>();

// Inicializar sets si no existen
const getParrafosUsados = (actIndex: number): Set<number> => {
  if (!parrafosUsadosPorActividad.has(actIndex)) {
    parrafosUsadosPorActividad.set(actIndex, new Set());
  }
  return parrafosUsadosPorActividad.get(actIndex)!;
};

const getProgresoUsado = (tipo: 'Minimal' | 'Moderate'): Set<number> => {
  if (!progresoUsado.has(tipo)) {
    progresoUsado.set(tipo, new Set());
  }
  return progresoUsado.get(tipo)!;
};

// ==================== FUNCIONES PRINCIPALES ====================

/**
 * Obtiene el siguiente párrafo rotativo sin repetir hasta usar todos
 * @param actIndex Índice de la actividad (para tracking independiente)
 * @returns Párrafo rotativo seleccionado
 */
export const getNextParrafoRotativo = (actIndex: number = 0): string => {
  const usados = getParrafosUsados(actIndex);
  const totalParrafos = parrafosRotativos.length;

  // Si ya usamos todos, resetear para este índice
  if (usados.size >= totalParrafos) {
    usados.clear();
  }

  // Encontrar un párrafo no usado
  let parrafoIndex: number;
  let intentos = 0;
  do {
    parrafoIndex = Math.floor(Math.random() * totalParrafos);
    intentos++;
    // Prevenir bucle infinito (aunque no debería pasar)
    if (intentos > totalParrafos * 2) {
      usados.clear();
      break;
    }
  } while (usados.has(parrafoIndex));

  // Marcar como usado
  usados.add(parrafoIndex);

  return parrafosRotativos[parrafoIndex];
};

/**
 * Obtiene el siguiente párrafo de progreso sin repetir
 * @param tipo 'Minimal' o 'Moderate'
 * @returns Párrafo de progreso seleccionado
 */
export const getNextParrafoProgreso = (tipo: 'Minimal' | 'Moderate'): string => {
  const usados = getProgresoUsado(tipo);
  const parrafos = tipo === 'Minimal' ? parrafosProgresoMinimal : parrafosProgresoModerate;
  const total = parrafos.length;

  // Si ya usamos todos, resetear
  if (usados.size >= total) {
    usados.clear();
  }

  // Encontrar un párrafo no usado
  let index: number;
  let intentos = 0;
  do {
    index = Math.floor(Math.random() * total);
    intentos++;
    if (intentos > total * 2) {
      usados.clear();
      break;
    }
  } while (usados.has(index));

  // Marcar como usado
  usados.add(index);

  return parrafos[index];
};

/**
 * Obtiene una respuesta base aleatoria para el cliente
 * IMPORTANTE: Esta debe ser editada por el usuario y ser única
 */
export const getRespuestaClienteBase = (): string => {
  const randomIndex = Math.floor(Math.random() * respuestasClienteBase.length);
  return respuestasClienteBase[randomIndex];
};

/**
 * Reinicia todos los tracking de párrafos usados
 */
export const resetParrafosRotativos = (): void => {
  parrafosUsadosPorActividad.clear();
  progresoUsado.clear();
};

/**
 * Obtiene un párrafo por índice específico (para consistencia/debugging)
 * @param index Índice del párrafo
 * @returns Párrafo en ese índice
 */
export const getParrafoPorIndice = (index: number): string => {
  return parrafosRotativos[index % parrafosRotativos.length];
};

/**
 * Obtiene párrafo secuencial basado en semana y actividad
 * Útil para tener rotación predecible
 */
export const getParrafoSecuencial = (actIndex: number, weekNumber: number): string => {
  const totalParrafos = parrafosRotativos.length;
  const index = (actIndex + (weekNumber - 1) * 3) % totalParrafos;
  return parrafosRotativos[index];
};

/**
 * Obtiene estadísticas de uso de párrafos
 */
export const getEstadisticasParrafos = () => {
  const stats: any = {
    totalParrafos: parrafosRotativos.length,
    porActividad: {} as Record<number, { usados: number; restantes: number }>,
    progresoMinimal: {
      total: parrafosProgresoMinimal.length,
      usados: progresoUsado.get('Minimal')?.size || 0,
      restantes: parrafosProgresoMinimal.length - (progresoUsado.get('Minimal')?.size || 0)
    },
    progresoModerate: {
      total: parrafosProgresoModerate.length,
      usados: progresoUsado.get('Moderate')?.size || 0,
      restantes: parrafosProgresoModerate.length - (progresoUsado.get('Moderate')?.size || 0)
    }
  };

  // Estadísticas por actividad
  parrafosUsadosPorActividad.forEach((usados, actIndex) => {
    stats.porActividad[actIndex] = {
      usados: usados.size,
      restantes: parrafosRotativos.length - usados.size
    };
  });

  return stats;
};