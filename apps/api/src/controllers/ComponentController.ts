import { Request, Response } from 'express';
import { ComponentService } from '../services/ComponentService';
import { ApiResponse } from '../types';

export class ComponentController {
  constructor(private componentService: ComponentService) {}

  async getAllComponents(req: Request, res: Response): Promise<void> {
    try {
      const components = await this.componentService.findAll();
      const response: ApiResponse = {
        ok: true,
        data: components
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

  async getComponentById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const component = await this.componentService.findById(id);
      
      if (!component) {
        const response: ApiResponse = {
          ok: false,
          error: 'Component not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        ok: true,
        data: component
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

  async createComponent(req: Request, res: Response): Promise<void> {
    try {
      const { name, vehicleId } = req.body;
      
      if (!name || !vehicleId) {
        const response: ApiResponse = {
          ok: false,
          error: 'Component name and vehicleId are required'
        };
        res.status(400).json(response);
        return;
      }

      const component = await this.componentService.create({ name, vehicleId });
      const response: ApiResponse = {
        ok: true,
        data: component
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

  async updateComponent(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { name } = req.body;

      const component = await this.componentService.update(id, { name });
      const response: ApiResponse = {
        ok: true,
        data: component
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

  async deleteComponent(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.componentService.delete(id);
      
      const response: ApiResponse = {
        ok: true,
        data: { message: 'Component deleted successfully' }
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

  async getComponentsByVehicle(req: Request, res: Response): Promise<void> {
    try {
      const vehicleId = Number(req.params.vehicleId);
      const components = await this.componentService.findByVehicleId(vehicleId);
      
      const response: ApiResponse = {
        ok: true,
        data: components
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
