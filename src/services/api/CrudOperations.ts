import { apiClient } from "./apiClient";

export interface CrudConfig {
  baseEndpoint: string; // e.g., "/timelines"
  getEndpoint?: string; // e.g., "/get/timeline"
  getAllEndpoint?: string; // e.g., "/get/timelines"
  createEndpoint?: string; // e.g., "/post/timeline"
  updateEndpoint?: string; // e.g., "/put/timeline"
  deleteEndpoint?: string; // e.g., "/delete/timeline"
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
}

export interface QueryParams extends Record<string, any> {
  id?: string;
}

export function createCrudService<T>(config: CrudConfig) {
  const {
    baseEndpoint,
    getEndpoint = `${baseEndpoint}/get`,
    getAllEndpoint = `${baseEndpoint}/get`,
    createEndpoint = `${baseEndpoint}/post`,
    updateEndpoint = `${baseEndpoint}/put`,
    deleteEndpoint = `${baseEndpoint}/delete`,
  } = config;

  return {
    async getById(id: string, additionalParams?: QueryParams): Promise<T> {
      const queryParams = apiClient.buildQueryString({
        id,
        ...additionalParams,
      });
      return apiClient.get<T>(`${getEndpoint}${queryParams}`);
    },

    async getAll(params?: PaginationParams & QueryParams): Promise<T[]> {
      const queryParams = params ? apiClient.buildQueryString(params) : "";
      return apiClient.get<T[]>(`${getAllEndpoint}${queryParams}`);
    },

    async create(data: Partial<T>): Promise<T> {
      return apiClient.post<T>(createEndpoint, data);
    },

    async update(id: string, data: Partial<T>): Promise<T> {
      return apiClient.put<T>(updateEndpoint, { id, ...data });
    },

    async delete(id: string): Promise<{ message: string; id: string }> {
      const queryParams = apiClient.buildQueryString({ id });
      return apiClient.delete<{ message: string; id: string }>(
        `${deleteEndpoint}${queryParams}`
      );
    },
  };
}

export class CrudOperations<T> {
  private baseEndpoint: string;
  private getEndpoint: string;
  private getAllEndpoint: string;
  private createEndpoint: string;
  private updateEndpoint: string;
  private deleteEndpoint: string;

  constructor(config: CrudConfig) {
    this.baseEndpoint = config.baseEndpoint;
    this.getEndpoint = config.getEndpoint || `${config.baseEndpoint}/get`;
    this.getAllEndpoint = config.getAllEndpoint || `${config.baseEndpoint}/get`;
    this.createEndpoint =
      config.createEndpoint || `${config.baseEndpoint}/post`;
    this.updateEndpoint = config.updateEndpoint || `${config.baseEndpoint}/put`;
    this.deleteEndpoint =
      config.deleteEndpoint || `${config.baseEndpoint}/delete`;
  }

  async getById(id: string, additionalParams?: QueryParams): Promise<T> {
    const queryParams = apiClient.buildQueryString({
      id,
      ...additionalParams,
    });
    return apiClient.get<T>(`${this.getEndpoint}${queryParams}`);
  }

  async getAll(params?: PaginationParams & QueryParams): Promise<T[]> {
    const queryParams = params ? apiClient.buildQueryString(params) : "";
    return apiClient.get<T[]>(`${this.getAllEndpoint}${queryParams}`);
  }

  async create(data: Partial<T>): Promise<T> {
    return apiClient.post<T>(this.createEndpoint, data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return apiClient.put<T>(this.updateEndpoint, { id, ...data });
  }

  async delete(id: string): Promise<{ message: string; id: string }> {
    const queryParams = apiClient.buildQueryString({ id });
    return apiClient.delete<{ message: string; id: string }>(
      `${this.deleteEndpoint}${queryParams}`
    );
  }
}
