# Diagnósticos Disponibles (ICD-10)

Esta lista contiene todos los códigos ICD-10 disponibles en el sistema para asignar a pacientes durante su creación.

## 🧠 Trastornos del Estado de Ánimo (Mood Disorders - F30–F39)

| Código | Diagnóstico |
|--------|-------------|
| F32.0 | Major depressive disorder, single episode, mild |
| F32.1 | Major depressive disorder, single episode, moderate |
| F32.2 | Major depressive disorder, single episode, severe, without psychotic features |
| F32.3 | Major depressive disorder, single episode, severe, with psychotic features |
| F33.0 | Major depressive disorder, recurrent, mild |
| F33.1 | Major depressive disorder, recurrent, moderate |
| F33.2 | Major depressive disorder, recurrent, severe without psychotic symptoms |
| F33.3 | Major depressive disorder, recurrent, severe with psychotic symptoms |
| F34.1 | Dysthymic disorder (Persistent depressive disorder) |
| F31.9 | Bipolar disorder, unspecified |

## 😰 Trastornos de Ansiedad y Relacionados con el Estrés (Anxiety Disorders - F40–F48)

| Código | Diagnóstico |
|--------|-------------|
| F40.00 | Agoraphobia, unspecified |
| F40.10 | Social phobia, unspecified |
| F41.0 | Panic disorder (episodic paroxysmal anxiety) |
| F41.1 | Generalized anxiety disorder |
| F41.9 | Anxiety disorder, unspecified |
| F42.9 | Obsessive-compulsive disorder, unspecified |
| F43.10 | Post-traumatic stress disorder, unspecified |
| F43.11 | Post-traumatic stress disorder, acute |
| F43.12 | Post-traumatic stress disorder, chronic |
| F43.21 | Adjustment disorder with depressed mood |
| F43.22 | Adjustment disorder with anxiety |
| F43.23 | Adjustment disorder with mixed anxiety and depressed mood |

## 🌙 Trastornos Relacionados con el Sueño (Sleep Disorders - G47.xx / F51.xx)

| Código | Diagnóstico |
|--------|-------------|
| G47.00 | Insomnia, unspecified |
| G47.01 | Insomnia due to medical condition |
| G47.09 | Other insomnia |
| F51.01 | Primary insomnia |
| F51.02 | Adjustment insomnia |
| F51.03 | Paradoxical insomnia |

## 💬 Trastornos Somatomorfos y Disociativos (Somatoform & Dissociative Disorders)

| Código | Diagnóstico |
|--------|-------------|
| F44.81 | Depersonalization-derealization disorder |
| F45.1 | Somatization disorder |
| F48.2 | Neurasthenia |

## 👨‍👩‍👧 Factores Psicosociales y Ambientales (Psychosocial & Environmental Factors - Z-codes)

| Código | Diagnóstico |
|--------|-------------|
| Z63.4 | Disappearance and death of family member |
| Z63.5 | Disruption of family by separation and divorce |
| Z63.8 | Other specified problems related to primary support group |
| Z72.820 | Sleep deprivation |
| Z60.0 | Problems of adjustment to life-cycle transitions |

## ⚡ Otros Códigos Frecuentemente Usados en Salud Mental (Other Frequently Used Mental Health Codes)

| Código | Diagnóstico |
|--------|-------------|
| F50.00 | Anorexia nervosa, unspecified |
| F50.2 | Bulimia nervosa |
| F52.8 | Other sexual dysfunction not due to substance or known physiological condition |
| F60.3 | Borderline personality disorder |
| F60.5 | Obsessive-compulsive personality disorder |
| F90.0 | ADHD, predominantly inattentive type |
| F90.2 | ADHD, combined type |
| F91.3 | Oppositional defiant disorder |

---

## 📋 Formato JSON para Frontend

Para facilitar el consumo desde el frontend, aquí está la lista en formato JSON:

```json
{
  "Mood Disorders": [
    { "code": "F32.0", "diagnosis": "Major depressive disorder, single episode, mild" },
    { "code": "F32.1", "diagnosis": "Major depressive disorder, single episode, moderate" },
    { "code": "F32.2", "diagnosis": "Major depressive disorder, single episode, severe, without psychotic features" },
    { "code": "F32.3", "diagnosis": "Major depressive disorder, single episode, severe, with psychotic features" },
    { "code": "F33.0", "diagnosis": "Major depressive disorder, recurrent, mild" },
    { "code": "F33.1", "diagnosis": "Major depressive disorder, recurrent, moderate" },
    { "code": "F33.2", "diagnosis": "Major depressive disorder, recurrent, severe without psychotic symptoms" },
    { "code": "F33.3", "diagnosis": "Major depressive disorder, recurrent, severe with psychotic symptoms" },
    { "code": "F34.1", "diagnosis": "Dysthymic disorder (Persistent depressive disorder)" },
    { "code": "F31.9", "diagnosis": "Bipolar disorder, unspecified" }
  ],
  "Anxiety Disorders": [
    { "code": "F40.00", "diagnosis": "Agoraphobia, unspecified" },
    { "code": "F40.10", "diagnosis": "Social phobia, unspecified" },
    { "code": "F41.0", "diagnosis": "Panic disorder (episodic paroxysmal anxiety)" },
    { "code": "F41.1", "diagnosis": "Generalized anxiety disorder" },
    { "code": "F41.9", "diagnosis": "Anxiety disorder, unspecified" },
    { "code": "F42.9", "diagnosis": "Obsessive-compulsive disorder, unspecified" },
    { "code": "F43.10", "diagnosis": "Post-traumatic stress disorder, unspecified" },
    { "code": "F43.11", "diagnosis": "Post-traumatic stress disorder, acute" },
    { "code": "F43.12", "diagnosis": "Post-traumatic stress disorder, chronic" },
    { "code": "F43.21", "diagnosis": "Adjustment disorder with depressed mood" },
    { "code": "F43.22", "diagnosis": "Adjustment disorder with anxiety" },
    { "code": "F43.23", "diagnosis": "Adjustment disorder with mixed anxiety and depressed mood" }
  ],
  "Sleep Disorders": [
    { "code": "G47.00", "diagnosis": "Insomnia, unspecified" },
    { "code": "G47.01", "diagnosis": "Insomnia due to medical condition" },
    { "code": "G47.09", "diagnosis": "Other insomnia" },
    { "code": "F51.01", "diagnosis": "Primary insomnia" },
    { "code": "F51.02", "diagnosis": "Adjustment insomnia" },
    { "code": "F51.03", "diagnosis": "Paradoxical insomnia" }
  ],
  "Dissociative Disorders": [
    { "code": "F44.81", "diagnosis": "Depersonalization-derealization disorder" }
  ],
  "Somatoform Disorders": [
    { "code": "F45.1", "diagnosis": "Somatization disorder" },
    { "code": "F48.2", "diagnosis": "Neurasthenia" }
  ],
  "Psychosocial Factors": [
    { "code": "Z63.4", "diagnosis": "Disappearance and death of family member" },
    { "code": "Z63.5", "diagnosis": "Disruption of family by separation and divorce" },
    { "code": "Z63.8", "diagnosis": "Other specified problems related to primary support group" },
    { "code": "Z72.820", "diagnosis": "Sleep deprivation" },
    { "code": "Z60.0", "diagnosis": "Problems of adjustment to life-cycle transitions" }
  ],
  "Eating Disorders": [
    { "code": "F50.00", "diagnosis": "Anorexia nervosa, unspecified" },
    { "code": "F50.2", "diagnosis": "Bulimia nervosa" }
  ],
  "Sexual Disorders": [
    { "code": "F52.8", "diagnosis": "Other sexual dysfunction not due to substance or known physiological condition" }
  ],
  "Personality Disorders": [
    { "code": "F60.3", "diagnosis": "Borderline personality disorder" },
    { "code": "F60.5", "diagnosis": "Obsessive-compulsive personality disorder" }
  ],
  "Neurodevelopmental Disorders": [
    { "code": "F90.0", "diagnosis": "ADHD, predominantly inattentive type" },
    { "code": "F90.2", "diagnosis": "ADHD, combined type" }
  ],
  "Disruptive Disorders": [
    { "code": "F91.3", "diagnosis": "Oppositional defiant disorder" }
  ]
}
```

## 🔌 API Endpoint

### Obtener Diagnósticos Disponibles

**Endpoint:** `GET /api/v1/patients/diagnoses/available`

**Autenticación:** Requerida (JWT Token)
**Roles permitidos:** ADMIN, THERAPIST, NURSE

### Descripción

Este endpoint retorna todos los diagnósticos ICD-10 disponibles en el sistema, agrupados por categoría. Está diseñado para ser usado durante la creación de pacientes en el frontend, permitiendo que el usuario seleccione diagnósticos de una lista predefinida.

### Respuesta Exitosa

**Status Code:** `200 OK`

**Response Body:**
```json
{
  "categories": {
    "Mood Disorders": [
      {
        "id": "uuid-del-diagnostico",
        "code": "F32.0",
        "diagnosis": "Major depressive disorder, single episode, mild",
        "category": "Mood Disorders"
      },
      {
        "id": "uuid-del-diagnostico",
        "code": "F32.1",
        "diagnosis": "Major depressive disorder, single episode, moderate",
        "category": "Mood Disorders"
      }
      // ... más diagnósticos
    ],
    "Anxiety Disorders": [
      {
        "id": "uuid-del-diagnostico",
        "code": "F41.1",
        "diagnosis": "Generalized anxiety disorder",
        "category": "Anxiety Disorders"
      }
      // ... más diagnósticos
    ]
    // ... más categorías
  }
}
```

### Ejemplo de uso en frontend (TypeScript/React):

```typescript
import { useEffect, useState } from 'react';

interface Diagnosis {
  id: string;
  code: string;
  diagnosis: string;
  category: string;
}

interface DiagnosesResponse {
  categories: Record<string, Diagnosis[]>;
}

// Hook personalizado para obtener diagnósticos
function useAvailableDiagnoses() {
  const [diagnoses, setDiagnoses] = useState<DiagnosesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const token = localStorage.getItem('token'); // O tu método de obtener token
        
        const response = await fetch('http://localhost:3002/api/v1/patients/diagnoses/available', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: DiagnosesResponse = await response.json();
        setDiagnoses(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, []);

  return { diagnoses, loading, error };
}

// Uso en componente
function DiagnosisSelector() {
  const { diagnoses, loading, error } = useAvailableDiagnoses();

  if (loading) return <div>Cargando diagnósticos...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!diagnoses) return null;

  // Acceder a diagnósticos por categoría
  const moodDisorders = diagnoses.categories['Mood Disorders'] || [];
  const anxietyDisorders = diagnoses.categories['Anxiety Disorders'] || [];

  return (
    <select>
      <option value="">Seleccionar diagnóstico</option>
      {Object.entries(diagnoses.categories).map(([category, diagnosesList]) => (
        <optgroup key={category} label={category}>
          {diagnosesList.map((diag) => (
            <option key={diag.id} value={diag.code}>
              {diag.code} - {diag.diagnosis}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
```

### Ejemplo de uso con React Hook Form:

```typescript
import { useForm } from 'react-hook-form';
import { useAvailableDiagnoses } from './hooks/useAvailableDiagnoses';

function PatientForm() {
  const { diagnoses, loading } = useAvailableDiagnoses();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    // data.diagnoses contiene los códigos ICD-10 seleccionados
    console.log('Diagnósticos seleccionados:', data.diagnoses);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Selector de múltiples diagnósticos */}
      <select {...register('diagnoses')} multiple>
        {diagnoses && Object.entries(diagnoses.categories).map(([category, diagnosesList]) => (
          <optgroup key={category} label={category}>
            {diagnosesList.map((diag) => (
              <option key={diag.id} value={diag.code}>
                {diag.code} - {diag.diagnosis}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      
      <button type="submit">Enviar</button>
    </form>
  );
}
```

### Resumen de categorías disponibles:

- **Mood Disorders**: 10 diagnósticos
- **Anxiety Disorders**: 12 diagnósticos
- **Sleep Disorders**: 6 diagnósticos
- **Dissociative Disorders**: 1 diagnóstico
- **Somatoform Disorders**: 2 diagnósticos
- **Psychosocial Factors**: 5 diagnósticos
- **Eating Disorders**: 2 diagnósticos
- **Sexual Disorders**: 1 diagnóstico
- **Personality Disorders**: 2 diagnósticos
- **Neurodevelopmental Disorders**: 2 diagnósticos
- **Disruptive Disorders**: 1 diagnóstico

**Total: 44 diagnósticos disponibles**

### Manejo de Errores

Si el endpoint retorna un error, revisa:

1. **401 Unauthorized**: El token JWT es inválido o ha expirado
2. **403 Forbidden**: El usuario no tiene permisos (debe ser ADMIN, THERAPIST o NURSE)
3. **500 Internal Server Error**: Error en el servidor

### Notas Importantes

- Los diagnósticos están almacenados en la tabla `available_diagnoses` de la base de datos
- Solo se retornan diagnósticos activos (`is_active = true`)
- Los diagnósticos están ordenados por categoría y luego por código ICD-10
- El endpoint puede ser usado tanto para selección única como múltiple de diagnósticos
- Para asignar un diagnóstico a un paciente, usa el código (`code`) y la descripción (`diagnosis`) del objeto retornado

### Integración con la Creación de Pacientes

Cuando crees un paciente usando `POST /api/v1/patients`, puedes incluir múltiples diagnósticos en el array `diagnoses`:

```typescript
const newPatient = {
  patientNumber: 'P0123',
  firstName: 'John',
  lastName: 'Doe',
  // ... otros campos
  diagnoses: [
    {
      icd10Code: 'F33.2', // código del diagnóstico seleccionado
      diagnosisDescription: 'Major depressive disorder, recurrent, severe without psychotic symptoms',
      isPrimary: true
    },
    {
      icd10Code: 'F41.1',
      diagnosisDescription: 'Generalized anxiety disorder',
      isPrimary: false
    }
  ]
};

// POST /api/v1/patients
fetch('/api/v1/patients', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newPatient)
});
```

