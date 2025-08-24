import { PrismaClient } from '@prisma/client';
import { Part, CreatePartRequest } from '../types';

export class PartRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Part[]> {
    return this.prisma.part.findMany({
      include: {
        component: {
          include: {
            vehicle: true
          }
        }
      }
    });
  }

  async findById(id: number): Promise<Part | null> {
    return this.prisma.part.findUnique({
      where: { id },
      include: {
        component: {
          include: {
            vehicle: true
          }
        }
      }
    });
  }

  async findByComponentId(componentId: number): Promise<Part[]> {
    return this.prisma.part.findMany({
      where: { componentId },
      include: {
        component: {
          include: {
            vehicle: true
          }
        }
      }
    });
  }

  async create(data: CreatePartRequest): Promise<Part> {
    return this.prisma.part.create({
      data: {
        ...data,
        mass: data.mass ? Number(data.mass) : null
      },
      include: {
        component: {
          include: {
            vehicle: true
          }
        }
      }
    });
  }

  async update(id: number, data: Partial<CreatePartRequest>): Promise<Part> {
    return this.prisma.part.update({
      where: { id },
      data: {
        ...data,
        mass: data.mass ? Number(data.mass) : undefined
      },
      include: {
        component: {
          include: {
            vehicle: true
          }
        }
      }
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.part.delete({
      where: { id }
    });
  }
}
