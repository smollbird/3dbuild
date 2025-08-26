# 3D 商品拆解展示系统 API 文档

## 概述

本系统提供了完整的RESTful API，支持车辆、组件和零件的CRUD操作。系统基于Express + Prisma + MySQL构建，支持分层架构设计。

## 基础信息

- **Base URL**: `http://localhost:3001`
- **Content-Type**: `application/json`
- **响应格式**: 所有API都返回统一的JSON格式

### 响应格式

```json
{
  "ok": true,           // 请求是否成功
  "data": {},          // 返回的数据（成功时）
  "error": "错误信息"   // 错误信息（失败时）
}
```

## 健康检查 API

### 检查服务状态
- **URL**: `GET /health`
- **描述**: 检查API服务和数据库连接状态
- **响应示例**:
```json
{
  "ok": true,
  "mode": "prisma"
}
```

### 检查数据库连接
- **URL**: `GET /db/health`
- **描述**: 直接检查MySQL数据库连接状态
- **响应示例**:
```json
{
  "ok": true,
  "rows": [{"ok": 1}]
}
```

## 车辆管理 API

### 获取所有车辆
- **URL**: `GET /api/vehicles`
- **描述**: 获取所有车辆列表，包含组件和零件信息
- **响应示例**:
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "name": "汽车发动机总成 v2.3",
      "createdAt": "2025-08-22T02:44:45.594Z",
      "updatedAt": "2025-08-22T02:44:45.594Z",
      "components": [...]
    }
  ]
}
```

### 获取指定车辆
- **URL**: `GET /api/vehicles/:id`
- **描述**: 根据ID获取指定车辆详情

### 创建车辆
- **URL**: `POST /api/vehicles`
- **请求体**:
```json
{
  "name": "车辆名称"
}
```

### 更新车辆
- **URL**: `PUT /api/vehicles/:id`
- **请求体**:
```json
{
  "name": "新的车辆名称"
}
```

### 删除车辆
- **URL**: `DELETE /api/vehicles/:id`
- **描述**: 删除指定车辆

## 组件管理 API

### 获取所有组件
- **URL**: `GET /api/components`
- **描述**: 获取所有组件列表，包含关联的车辆和零件信息

### 获取指定组件
- **URL**: `GET /api/components/:id`
- **描述**: 根据ID获取指定组件详情

### 创建组件
- **URL**: `POST /api/components`
- **请求体**:
```json
{
  "name": "组件名称",
  "vehicleId": 1
}
```

### 更新组件
- **URL**: `PUT /api/components/:id`
- **请求体**:
```json
{
  "name": "新的组件名称"
}
```

### 删除组件
- **URL**: `DELETE /api/components/:id`
- **描述**: 删除指定组件

### 获取指定车辆的组件
- **URL**: `GET /api/components/vehicle/:vehicleId`
- **描述**: 获取指定车辆下的所有组件

## 零件管理 API

### 获取所有零件
- **URL**: `GET /api/parts`
- **描述**: 获取所有零件列表，包含关联的组件和车辆信息

### 获取指定零件
- **URL**: `GET /api/parts/:id`
- **描述**: 根据ID获取指定零件详情

### 创建零件
- **URL**: `POST /api/parts`
- **请求体**:
```json
{
  "name": "零件名称",
  "material": "材料名称（可选）",
  "mass": 10.5,
  "componentId": 1
}
```

### 更新零件
- **URL**: `PUT /api/parts/:id`
- **请求体**:
```json
{
  "name": "新的零件名称",
  "material": "新的材料",
  "mass": 15.2
}
```

### 删除零件
- **URL**: `DELETE /api/parts/:id`
- **描述**: 删除指定零件

### 获取指定组件的零件
- **URL**: `GET /api/parts/component/:componentId`
- **描述**: 获取指定组件下的所有零件

## 数据初始化

### 初始化测试数据
- **URL**: `POST /api/seed`
- **描述**: 创建测试用的车辆、组件和零件数据
- **响应**: 返回创建的车辆数据及其所有组件和零件

## 错误处理

### 常见错误码
- `400 Bad Request`: 请求参数错误
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器内部错误
- `503 Service Unavailable`: 数据库连接失败

### 错误响应示例
```json
{
  "ok": false,
  "error": "Vehicle not found"
}
```

## 数据模型

### Vehicle（车辆）
```typescript
{
  id: number;
  name: string;
  components?: Component[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Component（组件）
```typescript
{
  id: number;
  name: string;
  vehicleId: number;
  vehicle?: Vehicle;
  parts?: Part[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Part（零件）
```typescript
{
  id: number;
  name: string;
  material?: string | null;
  mass?: number | null;
  componentId: number;
  component?: Component;
  createdAt: Date;
  updatedAt: Date;
}
```

## 使用示例

### 创建完整的车辆结构

1. 创建车辆:
```bash
curl -X POST http://localhost:3001/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"name": "新车辆"}'
```

2. 创建组件:
```bash
curl -X POST http://localhost:3001/api/components \
  -H "Content-Type: application/json" \
  -d '{"name": "发动机", "vehicleId": 1}'
```

3. 创建零件:
```bash
curl -X POST http://localhost:3001/api/parts \
  -H "Content-Type: application/json" \
  -d '{"name": "活塞", "material": "铝合金", "mass": 2.5, "componentId": 1}'
```

## 开发环境

### 启动服务
```bash
# 安装依赖
npm install

# 生成Prisma客户端
npm run prisma:generate

# 启动开发服务器
npm run dev:api
```

### 技术栈
- **后端框架**: Express.js
- **ORM**: Prisma
- **数据库**: MySQL
- **开发语言**: TypeScript
- **架构模式**: 分层架构 (Controller-Service-Repository)

## 版本信息

- **API版本**: v1.0.0
- **最后更新**: 2025-08-26
- **维护状态**: 开发中

---

如有问题或建议，请联系开发团队。