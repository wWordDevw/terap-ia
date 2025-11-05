// API configuration and types for backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Types matching your backend DTOs
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  clinicId?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export enum UserRole {
  ADMIN = 'admin',
  COORDINATOR = 'coordinator',
  THERAPIST = 'therapist',
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  clinicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Clinic types
export interface Clinic {
  id: string; // Cambio: era 'clinicId'
  clinicName: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

export interface CreateClinicDto {
  clinicName: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface UpdateClinicDto extends Partial<CreateClinicDto> {
  isActive?: boolean;
}

// Patient Note types
export interface PatientNote {
  id: string;
  fecha: string; // Fecha de la nota
  autor: string; // Nombre del autor
  autorRol: string; // Rol del autor
  titulo: string; // Título de la nota
  contenido: string; // Contenido de la nota
  tipo: 'general' | 'medica' | 'terapeutica' | 'administrativa';
  privacidad: 'publica' | 'privada' | 'confidencial';
  tags?: string[]; // Array de etiquetas
  patientId: string; // ID del paciente
  createdAt: string; // Fecha de creación
  updatedAt: string; // Fecha de actualización
}

export interface CreatePatientNoteDto {
  titulo: string;
  contenido: string;
  tipo?: 'general' | 'medica' | 'terapeutica' | 'administrativa';
  privacidad?: 'publica' | 'privada' | 'confidencial';
  tags?: string[];
}

export interface UpdatePatientNoteDto extends Partial<CreatePatientNoteDto> {}

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(data: RegisterDto): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(data: ForgotPasswordDto): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.request<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints (usando /auth/profile según tu controlador)
  async getProfile(): Promise<User> {
    return this.request<User>('/auth/profile');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Clinic endpoints
  async getActiveClinics(): Promise<Clinic[]> {
    return this.request<Clinic[]>('/clinics/public');
  }

  async getClinic(id: string): Promise<Clinic> {
    return this.request<Clinic>(`/clinics/${id}`);
  }

  async createClinic(data: CreateClinicDto): Promise<Clinic> {
    return this.request<Clinic>('/clinics', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClinic(id: string, data: UpdateClinicDto): Promise<Clinic> {
    return this.request<Clinic>(`/clinics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClinic(id: string): Promise<void> {
    return this.request<void>(`/clinics/${id}`, {
      method: 'DELETE',
    });
  }

  // Patient Note endpoints
  async getNotes(patientId: string): Promise<PatientNote[]> {
    return this.request<PatientNote[]>(`/patients/${patientId}/notes`);
  }

  async createNote(patientId: string, data: CreatePatientNoteDto): Promise<PatientNote> {
    return this.request<PatientNote>(`/patients/${patientId}/notes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNote(patientId: string, noteId: string): Promise<PatientNote> {
    return this.request<PatientNote>(`/patients/${patientId}/notes/${noteId}`);
  }

  async updateNote(patientId: string, noteId: string, data: UpdatePatientNoteDto): Promise<PatientNote> {
    return this.request<PatientNote>(`/patients/${patientId}/notes/${noteId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteNote(patientId: string, noteId: string): Promise<void> {
    return this.request<void>(`/patients/${patientId}/notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  // Patient endpoints
  async updatePatient(patientId: string, data: any): Promise<any> {
    return this.request<any>(`/patients/${patientId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
