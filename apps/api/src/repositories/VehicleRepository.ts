import { PrismaClient } from '@prisma/client';
import { Vehicle, CreateVehicleRequest } from '../types';

export class VehicleRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      include: {
        components: {
          include: {
            parts: true
          }
        }
      }
    });
  }

  async findById(id: number): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        components: {
          include: {
            parts: true
          }
        }
      }
    });
  }

  async create(data: CreateVehicleRequest): Promise<Vehicle> {
    return this.prisma.vehicle.create({
      data,
      include: {
        components: {
          include: {
            parts: true
          }
        }
      }
    });
  }

  async update(id: number, data: Partial<CreateVehicleRequest>): Promise<Vehicle> {
    return this.prisma.vehicle.update({
      where: { id },
      data,
      include: {
        components: {
          include: {
            parts: true
          }
        }
      }
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.vehicle.delete({
      where: { id }
    });
  }
}
