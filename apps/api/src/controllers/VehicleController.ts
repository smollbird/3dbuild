import { Request, Response } from 'express';
import { VehicleService } from '../services/VehicleService';
import { ApiResponse } from '../types';

export class VehicleController {
  constructor(private vehicleService: VehicleService) {}

  async getAllVehicles(req: Request, res: Response): Promise<void> {
    try {
      const vehicles = await this.vehicleService.findAll();
      const response: ApiResponse = {
        ok: true,
        data: vehicles
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

  async getVehicleById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const vehicle = await this.vehicleService.findById(id);
      
      if (!vehicle) {
        const response: ApiResponse = {
          ok: false,
          error: 'Vehicle not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        ok: true,
        data: vehicle
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

  async createVehicle(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      
      if (!name) {
        const response: ApiResponse = {
          ok: false,
          error: 'Vehicle name is required'
        };
        res.status(400).json(response);
        return;
      }

      const vehicle = await this.vehicleService.create({ name });
      const response: ApiResponse = {
        ok: true,
        data: vehicle
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

  async updateVehicle(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { name } = req.body;

      const vehicle = await this.vehicleService.update(id, { name });
      const response: ApiResponse = {
        ok: true,
        data: vehicle
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

  async deleteVehicle(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.vehicleService.delete(id);
      
      const response: ApiResponse = {
        ok: true,
        data: { message: 'Vehicle deleted successfully' }
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
