import { Router } from 'express';
import { VehicleController } from '../controllers/VehicleController';
import { VehicleService } from '../services/VehicleService';
import { VehicleRepository } from '../repositories/VehicleRepository';
import { PrismaClient } from '@prisma/client';

const router = Router();

// 依赖注入
const prisma = new PrismaClient();
const vehicleRepository = new VehicleRepository(prisma);
const vehicleService = new VehicleService(vehicleRepository);
const vehicleController = new VehicleController(vehicleService);

// 车辆路由
router.get('/', (req, res) => vehicleController.getAllVehicles(req, res));
router.get('/:id', (req, res) => vehicleController.getVehicleById(req, res));
router.post('/', (req, res) => vehicleController.createVehicle(req, res));
router.put('/:id', (req, res) => vehicleController.updateVehicle(req, res));
router.delete('/:id', (req, res) => vehicleController.deleteVehicle(req, res));

export default router;
