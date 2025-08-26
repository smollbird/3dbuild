// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// 响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message?: string;
  error?: string;
}

// 数据模型接口
export interface Vehicle {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  components?: Component[];
}

export interface Component {
  id: number;
  name: string;
  vehicleId: number;
  createdAt: string;
  updatedAt: string;
  parts?: Part[];
}

export interface Part {
  id: number;
  name: string;
  componentId: number;
  material?: string;
  mass?: number;
  createdAt: string;
  updatedAt: string;
}

// HTTP 客户端类
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API请求失败:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  }

  // GET 请求
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 请求
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 请求
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 请求
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// 创建API客户端实例
const apiClient = new ApiClient(API_BASE_URL);

// 车辆API服务
export const vehicleApi = {
  // 获取所有车辆
  async getAll(): Promise<ApiResponse<Vehicle[]>> {
    return apiClient.get<Vehicle[]>('/api/vehicles');
  },

  // 根据ID获取车辆
  async getById(id: number): Promise<ApiResponse<Vehicle>> {
    return apiClient.get<Vehicle>(`/api/vehicles/${id}`);
  },

  // 创建车辆
  async create(vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Vehicle>> {
    return apiClient.post<Vehicle>('/api/vehicles', vehicleData);
  },

  // 更新车辆
  async update(id: number, vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> {
    return apiClient.put<Vehicle>(`/api/vehicles/${id}`, vehicleData);
  },

  // 删除车辆
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/vehicles/${id}`);
  },
};

// 组件API服务
export const componentApi = {
  // 获取所有组件
  async getAll(): Promise<ApiResponse<Component[]>> {
    return apiClient.get<Component[]>('/api/components');
  },

  // 根据ID获取组件
  async getById(id: number): Promise<ApiResponse<Component>> {
    return apiClient.get<Component>(`/api/components/${id}`);
  },

  // 根据车辆ID获取组件
  async getByVehicleId(vehicleId: number): Promise<ApiResponse<Component[]>> {
    return apiClient.get<Component[]>(`/api/components/vehicle/${vehicleId}`);
  },

  // 创建组件
  async create(componentData: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Component>> {
    return apiClient.post<Component>('/api/components', componentData);
  },

  // 更新组件
  async update(id: number, componentData: Partial<Component>): Promise<ApiResponse<Component>> {
    return apiClient.put<Component>(`/api/components/${id}`, componentData);
  },

  // 删除组件
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/components/${id}`);
  },
};

// 零件API服务
export const partApi = {
  // 获取所有零件
  async getAll(): Promise<ApiResponse<Part[]>> {
    return apiClient.get<Part[]>('/api/parts');
  },

  // 根据ID获取零件
  async getById(id: number): Promise<ApiResponse<Part>> {
    return apiClient.get<Part>(`/api/parts/${id}`);
  },

  // 根据组件ID获取零件
  async getByComponentId(componentId: number): Promise<ApiResponse<Part[]>> {
    return apiClient.get<Part[]>(`/api/parts/component/${componentId}`);
  },

  // 创建零件
  async create(partData: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Part>> {
    return apiClient.post<Part>('/api/parts', partData);
  },

  // 更新零件
  async update(id: number, partData: Partial<Part>): Promise<ApiResponse<Part>> {
    return apiClient.put<Part>(`/api/parts/${id}`, partData);
  },

  // 删除零件
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/parts/${id}`);
  },
};

// 系统API服务
export const systemApi = {
  // 健康检查
  async healthCheck(): Promise<ApiResponse<{ ok: boolean; mode: string }>> {
    return apiClient.get<{ ok: boolean; mode: string }>('/health');
  },

  // 数据库健康检查
  async dbHealthCheck(): Promise<ApiResponse<{ ok: boolean; rows: any[] }>> {
    return apiClient.get<{ ok: boolean; rows: any[] }>('/db/health');
  },

  // 初始化测试数据
  async seedData(): Promise<ApiResponse<{ ok: boolean; vehicle: Vehicle }>> {
    return apiClient.post<{ ok: boolean; vehicle: Vehicle }>('/api/seed');
  },
};

// 导出API服务集合
export const api = {
  vehicle: vehicleApi,
  component: componentApi,
  part: partApi,
  system: systemApi,
};

// 默认导出
export default api;