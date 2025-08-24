## 3D 商品拆解展示系统

Monorepo 包含：
- apps/web: Vue 3 + Vite + Three.js 前端
- apps/api: Node.js + Express + Prisma + MySQL 后端
- apps/rust-engine: Rust 微服务占位（后续用于高性能计算/仿真）

### 准备
1. 复制 `.env.example` 为 `.env` 并调整变量
2. 启动数据库：
```bash
docker compose up -d db
```
3. 安装依赖：
```bash
npm install
```
4. 生成 Prisma 客户端（首次）：
```bash
npm run prisma:generate
```

### 开发
```bash
npm run dev
```

### 拉取 Figma 设计稿（需 FIGMA_TOKEN）
1. 在 `.env` 中填入 `FIGMA_TOKEN` 与 `FIGMA_FILE_URL`
2. 执行：
```bash
npm run figma:pull
```
资源会被下载到 `apps/web/public/figma/` 下。

引用设计来源：[Figma 设计稿](https://www.figma.com/design/zfoNgAYfjfteHUrVnem7hd/Untitled?node-id=3-245&t=MQHnn0FzsrirmbxY-4)


