import { Request, Response } from 'express';
import { PartService } from '../services/PartService';
import { ApiResponse } from '../types';

export class PartController {
  constructor(private partService: PartService) {}

  async getAllParts(req: Request, res: Response): Promise<void> {
    try {
      const parts = await this.partService.findAll();
      const response: ApiResponse = {
        ok: true,
        data: parts
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  }

  async getPartById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const part = await this.partService.findById(id);
      
      if (!part) {
        const response: ApiResponse = {
          ok: false,
          error: 'Part not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        ok: true,
        data: part
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(400).json(response);
    }
  }

  async createPart(req: Request, res: Response): Promise<void> {
    try {
      const { name, material, mass, componentId } = req.body;
      
      if (!name || !componentId) {
        const response: ApiResponse = {
          ok: false,
          error: 'Part name and componentId are required'
        };
        res.status(400).json(response);
        return;
      }

      const part = await this.partService.create({ 
        name, 
        material, 
        mass: mass ? Number(mass) : undefined, 
        componentId: Number(componentId) 
      });
      const response: ApiResponse = {
        ok: true,
        data: part
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(400).json(response);
    }
  }

  async updatePart(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { name, material, mass } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (material !== undefined) updateData.material = material;
      if (mass !== undefined) updateData.mass = Number(mass);

      const part = await this.partService.update(id, updateData);
      const response: ApiResponse = {
        ok: true,
        data: part
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(400).json(response);
    }
  }

  async deletePart(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.partService.delete(id);
      
      const response: ApiResponse = {
        ok: true,
        data: { message: 'Part deleted successfully' }
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(400).json(response);
    }
  }

  async getPartsByComponent(req: Request, res: Response): Promise<void> {
    try {
      const componentId = Number(req.params.componentId);
      const parts = await this.partService.findByComponentId(componentId);
      
      const response: ApiResponse = {
        ok: true,
        data: parts
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(400).json(response);
    }
  }
}