import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import type { PrismaClient as PrismaClientType } from "@prisma/client";
import mysql from "mysql2/promise";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import componentRoutes from "./routes/componentRoutes.js";
import partRoutes from "./routes/partRoutes.js";

dotenv.config({ path: "../../.env" });

const app = express();
let prisma: PrismaClientType | null = null;
try {
  const { PrismaClient } = await import("@prisma/client");
  prisma = new PrismaClient();
} catch (e) {
  console.warn("[api] Prisma 未就绪，降级到 mysql2 直连，仅提供 /db/health");
}

app.use(cors());
app.use(express.json());

// 健康检查
app.get("/health", async (_req, res) => {
  if (!prisma) {
    return res.json({ ok: true, mode: "mysql2" });
  }
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    res.json({ ok: true, mode: "prisma" });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.get("/db/health", async (_req, res) => {
  try {
    const url = process.env.DATABASE_URL;
    if (!url)
      return res.status(400).json({ ok: false, error: "Missing DATABASE_URL" });
    const match = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
    if (!match)
      return res
        .status(400)
        .json({ ok: false, error: "Invalid DATABASE_URL format" });
    const [, user, password, host, port, database] = match;
    const conn = await mysql.createConnection({
      host,
      port: Number(port),
      user,
      password,
      database,
    });
    const [rows] = await conn.query("SELECT 1 AS ok");
    await conn.end();
    res.json({ ok: true, rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// 静态引入路由模块
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/components", componentRoutes);
app.use("/api/parts", partRoutes);

console.log("[api] 所有路由模块加载成功");

// 初始化测试数据
app.post("/api/seed", async (_req, res) => {
  if (!prisma)
    return res.status(503).json({ ok: false, error: "Prisma not ready" });
  try {
    // 创建测试车辆
    const vehicle = await prisma.vehicle.create({
      data: {
        name: "汽车发动机总成 v2.3",
        components: {
          create: [
            {
              name: "发动机",
              parts: {
                create: [
                  { name: "缸体", material: "铝合金", mass: 45.2 },
                  { name: "缸盖", material: "铝合金", mass: 12.8 },
                  { name: "曲轴", material: "锻钢", mass: 28.5 },
                ],
              },
            },
            {
              name: "变速箱",
              parts: {
                create: [
                  { name: "齿轮组", material: "合金钢", mass: 15.3 },
                  { name: "离合器", material: "复合材料", mass: 8.7 },
                ],
              },
            },
            {
              name: "散热器",
              parts: {
                create: [
                  { name: "散热片", material: "铜", mass: 3.2 },
                  { name: "水箱", material: "塑料", mass: 1.8 },
                ],
              },
            },
          ],
        },
      },
      include: {
        components: {
          include: { parts: true },
        },
      },
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

  // 车辆 API
  console.log(`  GET  /api/vehicles - 获取所有车辆`);
  console.log(`  GET  /api/vehicles/:id - 获取指定车辆`);
  console.log(`  POST /api/vehicles - 创建车辆`);
  console.log(`  PUT  /api/vehicles/:id - 更新车辆`);
  console.log(`  DELETE /api/vehicles/:id - 删除车辆`);

  // 组件 API
  console.log(`  GET  /api/components - 获取所有组件`);
  console.log(`  GET  /api/components/:id - 获取指定组件`);
  console.log(`  POST /api/components - 创建组件`);
  console.log(`  PUT  /api/components/:id - 更新组件`);
  console.log(`  DELETE /api/components/:id - 删除组件`);
  console.log(`  GET  /api/components/vehicle/:vehicleId - 获取指定车辆的组件`);

  // 零件 API
  console.log(`  GET  /api/parts - 获取所有零件`);
  console.log(`  GET  /api/parts/:id - 获取指定零件`);
  console.log(`  POST /api/parts - 创建零件`);
  console.log(`  PUT  /api/parts/:id - 更新零件`);
  console.log(`  DELETE /api/parts/:id - 删除零件`);
  console.log(`  GET  /api/parts/component/:componentId - 获取指定组件的零件`);

  console.log(`  POST /api/seed - 初始化测试数据`);
});
