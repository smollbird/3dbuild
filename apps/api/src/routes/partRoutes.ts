import { Router } from 'express';
import { PartController } from '../controllers/PartController';
import { PartService } from '../services/PartService';
import { PartRepository } from '../repositories/PartRepository';
import { PrismaClient } from '@prisma/client';

const router = Router();

// 依赖注入
const prisma = new PrismaClient();
const partRepository = new PartRepository(prisma);
const partService = new PartService(partRepository);
const partController = new PartController(partService);

// 零件路由
router.get('/', (req, res) => partController.getAllParts(req, res));
router.get('/:id', (req, res) => partController.getPartById(req, res));
router.post('/', (req, res) => partController.createPart(req, res));
router.put('/:id', (req, res) => partController.updatePart(req, res));
router.delete('/:id', (req, res) => partController.deletePart(req, res));

// 根据组件ID获取零件
router.get('/component/:componentId', (req, res) => partController.getPartsByComponent(req, res));

export default router;