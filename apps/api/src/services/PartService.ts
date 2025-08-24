import { PartRepository } from '../repositories/PartRepository';
import { IPartService, Part, CreatePartRequest } from '../types';

export class PartService implements IPartService {
  constructor(private partRepository: PartRepository) {}

  async findAll(): Promise<Part[]> {
    return this.partRepository.findAll();
  }

  async findById(id: number): Promise<Part | null> {
    if (!id || id <= 0) {
      throw new Error('Invalid part ID');
    }
    return this.partRepository.findById(id);
  }

  async findByComponentId(componentId: number): Promise<Part[]> {
    if (!componentId || componentId <= 0) {
      throw new Error('Invalid component ID');
    }
    return this.partRepository.findByComponentId(componentId);
  }

  async create(data: CreatePartRequest): Promise<Part> {
    // 业务验证
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Part name is required');
    }

    if (data.name.length > 100) {
      throw new Error('Part name too long (max 100 characters)');
    }

    if (!data.componentId || data.componentId <= 0) {
      throw new Error('Valid component ID is required');
    }

    // 质量验证
    if (data.mass !== undefined && data.mass < 0) {
      throw new Error('Part mass cannot be negative');
    }

    if (data.mass !== undefined && data.mass > 10000) {
      throw new Error('Part mass too large (max 10000 kg)');
    }

    // 检查是否已存在同名零件（在同一组件下）
    const existingParts = await this.partRepository.findByComponentId(data.componentId);
    const duplicate = existingParts.find(p => 
      p.name.toLowerCase() === data.name.toLowerCase()
    );
    
    if (duplicate) {
      throw new Error('Part with this name already exists in this component');
    }

    return this.partRepository.create({
      name: data.name.trim(),
      material: data.material?.trim(),
      mass: data.mass,
      componentId: data.componentId
    });
  }

  async update(id: number, data: Partial<CreatePartRequest>): Promise<Part> {
    if (!id || id <= 0) {
      throw new Error('Invalid part ID');
    }

    // 检查零件是否存在
    const existing = await this.partRepository.findById(id);
    if (!existing) {
      throw new Error('Part not found');
    }

    // 业务验证
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('Part name is required');
      }

      if (data.name.length > 100) {
        throw new Error('Part name too long (max 100 characters)');
      }

      // 检查是否与其他零件重名（在同一组件下）
      const componentId = data.componentId || existing.componentId;
      const existingParts = await this.partRepository.findByComponentId(componentId);
      const duplicate = existingParts.find(p => 
        p.id !== id && p.name.toLowerCase() === data.name!.toLowerCase()
      );
      
      if (duplicate) {
        throw new Error('Part with this name already exists in this component');
      }
    }

    // 质量验证
    if (data.mass !== undefined) {
      if (data.mass < 0) {
        throw new Error('Part mass cannot be negative');
      }

      if (data.mass > 10000) {
        throw new Error('Part mass too large (max 10000 kg)');
      }
    }

    return this.partRepository.update(id, {
      ...data,
      name: data.name?.trim(),
      material: data.material?.trim()
    });
  }

  async delete(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid part ID');
    }

    // 检查零件是否存在
    const existing = await this.partRepository.findById(id);
    if (!existing) {
      throw new Error('Part not found');
    }

    await this.partRepository.delete(id);
  }
}
