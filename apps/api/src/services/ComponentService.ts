import { ComponentRepository } from '../repositories/ComponentRepository';
import { IComponentService, Component, CreateComponentRequest } from '../types';

export class ComponentService implements IComponentService {
  constructor(private componentRepository: ComponentRepository) {}

  async findAll(): Promise<Component[]> {
    return this.componentRepository.findAll();
  }

  async findById(id: number): Promise<Component | null> {
    if (!id || id <= 0) {
      throw new Error('Invalid component ID');
    }
    return this.componentRepository.findById(id);
  }

  async findByVehicleId(vehicleId: number): Promise<Component[]> {
    if (!vehicleId || vehicleId <= 0) {
      throw new Error('Invalid vehicle ID');
    }
    return this.componentRepository.findByVehicleId(vehicleId);
  }

  async create(data: CreateComponentRequest): Promise<Component> {
    // 业务验证
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Component name is required');
    }

    if (data.name.length > 100) {
      throw new Error('Component name too long (max 100 characters)');
    }

    if (!data.vehicleId || data.vehicleId <= 0) {
      throw new Error('Valid vehicle ID is required');
    }

    // 检查是否已存在同名组件（在同一车辆下）
    const existingComponents = await this.componentRepository.findByVehicleId(data.vehicleId);
    const duplicate = existingComponents.find(c => 
      c.name.toLowerCase() === data.name.toLowerCase()
    );
    
    if (duplicate) {
      throw new Error('Component with this name already exists in this vehicle');
    }

    return this.componentRepository.create({
      name: data.name.trim(),
      vehicleId: data.vehicleId
    });
  }

  async update(id: number, data: Partial<CreateComponentRequest>): Promise<Component> {
    if (!id || id <= 0) {
      throw new Error('Invalid component ID');
    }

    // 检查组件是否存在
    const existing = await this.componentRepository.findById(id);
    if (!existing) {
      throw new Error('Component not found');
    }

    // 业务验证
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('Component name is required');
      }

      if (data.name.length > 100) {
        throw new Error('Component name too long (max 100 characters)');
      }

      // 检查是否与其他组件重名（在同一车辆下）
      const vehicleId = data.vehicleId || existing.vehicleId;
      const existingComponents = await this.componentRepository.findByVehicleId(vehicleId);
      const duplicate = existingComponents.find(c => 
        c.id !== id && c.name.toLowerCase() === data.name!.toLowerCase()
      );
      
      if (duplicate) {
        throw new Error('Component with this name already exists in this vehicle');
      }
    }

    return this.componentRepository.update(id, {
      ...data,
      name: data.name?.trim()
    });
  }

  async delete(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid component ID');
    }

    // 检查组件是否存在
    const existing = await this.componentRepository.findById(id);
    if (!existing) {
      throw new Error('Component not found');
    }

    // 检查是否有零件依赖
    if (existing.parts && existing.parts.length > 0) {
      throw new Error('Cannot delete component with existing parts');
    }

    await this.componentRepository.delete(id);
  }
}
