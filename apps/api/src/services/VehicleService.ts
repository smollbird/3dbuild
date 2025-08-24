import { VehicleRepository } from '../repositories/VehicleRepository';
import { IVehicleService, Vehicle, CreateVehicleRequest } from '../types';

export class VehicleService implements IVehicleService {
  constructor(private vehicleRepository: VehicleRepository) {}

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAll();
  }

  async findById(id: number): Promise<Vehicle | null> {
    if (!id || id <= 0) {
      throw new Error('Invalid vehicle ID');
    }
    return this.vehicleRepository.findById(id);
  }

  async create(data: CreateVehicleRequest): Promise<Vehicle> {
    // 业务验证
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Vehicle name is required');
    }

    if (data.name.length > 100) {
      throw new Error('Vehicle name too long (max 100 characters)');
    }

    // 检查是否已存在同名车辆
    const existingVehicles = await this.vehicleRepository.findAll();
    const duplicate = existingVehicles.find(v => 
      v.name.toLowerCase() === data.name.toLowerCase()
    );
    
    if (duplicate) {
      throw new Error('Vehicle with this name already exists');
    }

    return this.vehicleRepository.create({
      name: data.name.trim()
    });
  }

  async update(id: number, data: Partial<CreateVehicleRequest>): Promise<Vehicle> {
    if (!id || id <= 0) {
      throw new Error('Invalid vehicle ID');
    }

    // 检查车辆是否存在
    const existing = await this.vehicleRepository.findById(id);
    if (!existing) {
      throw new Error('Vehicle not found');
    }

    // 业务验证
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('Vehicle name is required');
      }

      if (data.name.length > 100) {
        throw new Error('Vehicle name too long (max 100 characters)');
      }

      // 检查是否与其他车辆重名
      const existingVehicles = await this.vehicleRepository.findAll();
      const duplicate = existingVehicles.find(v => 
        v.id !== id && v.name.toLowerCase() === data.name!.toLowerCase()
      );
      
      if (duplicate) {
        throw new Error('Vehicle with this name already exists');
      }
    }

    return this.vehicleRepository.update(id, {
      ...data,
      name: data.name?.trim()
    });
  }

  async delete(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid vehicle ID');
    }

    // 检查车辆是否存在
    const existing = await this.vehicleRepository.findById(id);
    if (!existing) {
      throw new Error('Vehicle not found');
    }

    // 检查是否有组件依赖
    if (existing.components && existing.components.length > 0) {
      throw new Error('Cannot delete vehicle with existing components');
    }

    await this.vehicleRepository.delete(id);
  }
}
