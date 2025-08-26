import { Router } from 'express';
import { ComponentController } from '../controllers/ComponentController';
import { ComponentService } from '../services/ComponentService';
import { ComponentRepository } from '../repositories/ComponentRepository';
import { PrismaClient } from '@prisma/client';

const router = Router();

// 依赖注入
const prisma = new PrismaClient();
const componentRepository = new ComponentRepository(prisma);
const componentService = new ComponentService(componentRepository);
const componentController = new ComponentController(componentService);

// 组件路由
router.get('/', (req, res) => componentController.getAllComponents(req, res));
router.get('/:id', (req, res) => componentController.getComponentById(req, res));
router.post('/', (req, res) => componentController.createComponent(req, res));
router.put('/:id', (req, res) => componentController.updateComponent(req, res));
router.delete('/:id', (req, res) => componentController.deleteComponent(req, res));

// 根据车辆ID获取组件
router.get('/vehicle/:vehicleId', (req, res) => componentController.getComponentsByVehicle(req, res));

export default router;