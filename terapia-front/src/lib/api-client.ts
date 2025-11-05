/**
 * Cliente HTTP para interactuar con el backend
 */

import { API_CONFIG } from './api-config';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Obtener el token de autenticacion
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  /**
   * Realizar peticion HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = false, headers = {}, ...restOptions } = options;

    const config: RequestInit = {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    // Agregar token si es necesario
    if (requiresAuth) {
      const token = this.getToken();
      if (token) {
        (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      // Manejar errores HTTP
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'Error desconocido',
        }));
        throw new Error(error.message || `HTTP Error: ${response.status}`);
      }

      // Si la respuesta es 204 No Content, no hay body para parsear
      if (response.status === 204) {
        return undefined as T;
      }

      // Verificar si la respuesta tiene contenido antes de parsear
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0' || contentLength === null) {
        const text = await response.text();
        if (!text || text.trim() === '') {
          return null as T;
        }
      }

      // Intentar parsear JSON
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de red');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      requiresAuth,
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      requiresAuth,
    });
  }

  /**
   * POST request con FormData (para subida de archivos)
   */
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    requiresAuth = false
  ): Promise<T> {
    const token = requiresAuth ? this.getToken() : null;

    const config: RequestInit = {
      method: 'POST',
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'Error desconocido',
        }));
        throw new Error(error.message || `HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de red');
    }
  }

  /**
   * GET request para descargar archivos (blob)
   */
  async getBlob(endpoint: string, requiresAuth = false): Promise<Blob> {
    const token = requiresAuth ? this.getToken() : null;

    const config: RequestInit = {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de red');
    }
  }
}

// Exportar instancia del cliente
export const apiClient = new ApiClient(API_CONFIG.baseURL);
