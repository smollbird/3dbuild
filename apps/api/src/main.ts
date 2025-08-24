import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import type { PrismaClient as PrismaClientType } from '@prisma/client';
import mysql from 'mysql2/promise';

dotenv.config({ path: '../../.env' });

const app = express();
let prisma: PrismaClientType | null = null;
try {
  const { PrismaClient } = await import('@prisma/client');
  prisma = new PrismaClient();
} catch (e) {
  console.warn('[api] Prisma 未就绪，降级到 mysql2 直连，仅提供 /db/health');
}

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', async (_req, res) => {
  if (!prisma) {
    return res.json({ ok: true, mode: 'mysql2' });
  }
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    res.json({ ok: true, mode: 'prisma' });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.get('/db/health', async (_req, res) => {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) return res.status(400).json({ ok: false, error: 'Missing DATABASE_URL' });
    const match = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
    if (!match) return res.status(400).json({ ok: false, error: 'Invalid DATABASE_URL format' });
    const [, user, password, host, port, database] = match;
    const conn = await mysql.createConnection({ host, port: Number(port), user, password, database });
    const [rows] = await conn.query('SELECT 1 AS ok');
    await conn.end();
    res.json({ ok: true, rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// 动态导入车辆路由
let vehicleRoutes: any = null;
try {
  const isTsRuntime = !!(process.env.TS_NODE || process.env.TS_NODE_DEV || import.meta.url.endsWith('.ts'));
  const routesModule = await import(isTsRuntime ? './routes/vehicleRoutes.ts' : './routes/vehicleRoutes.js');
  vehicleRoutes = routesModule.default;
  app.use('/api/vehicles', vehicleRoutes);
  console.log('[api] 车辆路由加载成功');
} catch (e) {
  console.warn('[api] 车辆路由加载失败，使用简化版本:', e);
  // 简化的车辆 API 端点
  app.get('/api/vehicles', async (_req, res) => {
    if (!prisma) return res.status(503).json({ ok: false, error: 'Prisma not ready' });
    try {
      const vehicles = await prisma.vehicle.findMany({ 
        include: { 
          components: {
            include: { parts: true }
          }
        } 
      });
      res.json({ ok: true, data: vehicles });
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e) });
    }
  });
}

// 初始化测试数据
app.post('/api/seed', async (_req, res) => {
  if (!prisma) return res.status(503).json({ ok: false, error: 'Prisma not ready' });
  try {
    // 创建测试车辆
    const vehicle = await prisma.vehicle.create({
      data: {
        name: '汽车发动机总成 v2.3',
        components: {
          create: [
            {
              name: '发动机',
              parts: {
                create: [
                  { name: '缸体', material: '铝合金', mass: 45.2 },
                  { name: '缸盖', material: '铝合金', mass: 12.8 },
                  { name: '曲轴', material: '锻钢', mass: 28.5 }
                ]
              }
            },
            {
              name: '变速箱',
              parts: {
                create: [
                  { name: '齿轮组', material: '合金钢', mass: 15.3 },
                  { name: '离合器', material: '复合材料', mass: 8.7 }
                ]
              }
            },
            {
              name: '散热器',
              parts: {
                create: [
                  { name: '散热片', material: '铜', mass: 3.2 },
                  { name: '水箱', material: '塑料', mass: 1.8 }
                ]
              }
            }
          ]
        }
      },
      include: {
        components: {
          include: { parts: true }
        }
      }
    });
    res.json({ ok: true, vehicle });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3001;
app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
  console.log(`[api] API Documentation:`);
  console.log(`  GET  /health - 健康检查`);
  console.log(`  GET  /db/health - 数据库连接检查`);
  console.log(`  GET  /api/vehicles - 获取所有车辆`);
  if (vehicleRoutes) {
    console.log(`  GET  /api/vehicles/:id - 获取指定车辆`);
    console.log(`  POST /api/vehicles - 创建车辆`);
    console.log(`  PUT  /api/vehicles/:id - 更新车辆`);
    console.log(`  DELETE /api/vehicles/:id - 删除车辆`);
  }
  console.log(`  POST /api/seed - 初始化测试数据`);
});


