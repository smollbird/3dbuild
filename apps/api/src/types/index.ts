// 数据模型类型
export interface Vehicle {
  id: number;
  name: string;
  components?: Component[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Component {
  id: number;
  name: string;
  vehicleId: number;
  vehicle?: Vehicle;
  parts?: Part[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Part {
  id: number;
  name: string;
  material?: string;
  mass?: number;
  componentId: number;
  component?: Component;
  createdAt: Date;
  updatedAt: Date;
}

// API 请求/响应类型
export interface CreateVehicleRequest {
  name: string;
}

export interface CreateComponentRequest {
  name: string;
  vehicleId: number;
}

export interface CreatePartRequest {
  name: string;
  material?: string;
  mass?: number;
  componentId: number;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

// 服务层接口
export interface IVehicleService {
  findAll(): Promise<Vehicle[]>;
  create(data: CreateVehicleRequest): Promise<Vehicle>;
  findById(id: number): Promise<Vehicle | null>;
  update(id: number, data: Partial<CreateVehicleRequest>): Promise<Vehicle>;
  delete(id: number): Promise<void>;
}

export interface IComponentService {
  findAll(): Promise<Component[]>;
  create(data: CreateComponentRequest): Promise<Component>;
  findByVehicleId(vehicleId: number): Promise<Component[]>;
  findById(id: number): Promise<Component | null>;
  update(id: number, data: Partial<CreateComponentRequest>): Promise<Component>;
  delete(id: number): Promise<void>;
}

export interface IPartService {
  findAll(): Promise<Part[]>;
  create(data: CreatePartRequest): Promise<Part>;
  findByComponentId(componentId: number): Promise<Part[]>;
  findById(id: number): Promise<Part | null>;
  update(id: number, data: Partial<CreatePartRequest>): Promise<Part>;
  delete(id: number): Promise<void>;
}
