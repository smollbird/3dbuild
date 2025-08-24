import { PrismaClient } from '@prisma/client';
import { Component, CreateComponentRequest } from '../types';

export class ComponentRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Component[]> {
    return this.prisma.component.findMany({
      include: {
        vehicle: true,
        parts: true
      }
    });
  }

  async findById(id: number): Promise<Component | null> {
    return this.prisma.component.findUnique({
      where: { id },
      include: {
        vehicle: true,
        parts: true
      }
    });
  }

  async findByVehicleId(vehicleId: number): Promise<Component[]> {
    return this.prisma.component.findMany({
      where: { vehicleId },
      include: {
        vehicle: true,
        parts: true
      }
    });
  }

  async create(data: CreateComponentRequest): Promise<Component> {
    return this.prisma.component.create({
      data,
      include: {
        vehicle: true,
        parts: true
      }
    });
  }

  async update(id: number, data: Partial<CreateComponentRequest>): Promise<Component> {
    return this.prisma.component.update({
      where: { id },
      data,
      include: {
        vehicle: true,
        parts: true
      }
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.component.delete({
      where: { id }
    });
  }
}
