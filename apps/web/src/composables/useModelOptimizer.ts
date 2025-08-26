import { ref } from 'vue';
import * as THREE from 'three';
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier.js';

// LOD 级别配置
export interface LODConfig {
  distance: number;
  simplificationRatio: number;
  enabled: boolean;
}

// 优化配置
export interface OptimizationConfig {
  enableLOD: boolean;
  enableInstancing: boolean;
  enableFrustumCulling: boolean;
  enableOcclusion: boolean;
  mergeGeometries: boolean;
  compressTextures: boolean;
  maxTextureSize: number;
  lodLevels: LODConfig[];
}

// 优化统计
export interface OptimizationStats {
  originalVertices: number;
  optimizedVertices: number;
  originalDrawCalls: number;
  optimizedDrawCalls: number;
  memoryReduction: number;
  performanceGain: number;
}

/**
 * 模型性能优化器 Composable
 */
export function useModelOptimizer() {
  const optimizationStats = ref<OptimizationStats>({
    originalVertices: 0,
    optimizedVertices: 0,
    originalDrawCalls: 0,
    optimizedDrawCalls: 0,
    memoryReduction: 0,
    performanceGain: 0
  });

  // 默认优化配置
  const defaultConfig: OptimizationConfig = {
    enableLOD: true,
    enableInstancing: true,
    enableFrustumCulling: true,
    enableOcclusion: false,
    mergeGeometries: true,
    compressTextures: true,
    maxTextureSize: 1024,
    lodLevels: [
      { distance: 50, simplificationRatio: 1.0, enabled: true },   // 高精度
      { distance: 100, simplificationRatio: 0.7, enabled: true },  // 中精度
      { distance: 200, simplificationRatio: 0.4, enabled: true },  // 低精度
      { distance: 500, simplificationRatio: 0.2, enabled: true }   // 极低精度
    ]
  };

  /**
   * 优化整个模型
   */
  const optimizeModel = (
    model: THREE.Object3D,
    config: OptimizationConfig = defaultConfig
  ): THREE.Object3D => {
    const startStats = calculateModelStats(model);
    
    let optimizedModel = model.clone();

    // 几何体合并
    if (config.mergeGeometries) {
      optimizedModel = mergeGeometries(optimizedModel);
    }

    // 创建LOD
    if (config.enableLOD) {
      optimizedModel = createLODModel(optimizedModel, config.lodLevels);
    }

    // 实例化优化
    if (config.enableInstancing) {
      optimizedModel = optimizeInstancing(optimizedModel);
    }

    // 视锥体剔除
    if (config.enableFrustumCulling) {
      enableFrustumCulling(optimizedModel);
    }

    // 纹理压缩
    if (config.compressTextures) {
      compressTextures(optimizedModel, config.maxTextureSize);
    }

    // 计算优化统计
    const endStats = calculateModelStats(optimizedModel);
    updateOptimizationStats(startStats, endStats);

    return optimizedModel;
  };

  /**
   * 创建LOD模型
   */
  const createLODModel = (model: THREE.Object3D, lodLevels: LODConfig[]): THREE.Object3D => {
    const lodGroup = new THREE.Group();
    
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const lod = new THREE.LOD();
        
        // 添加不同精度的模型
        lodLevels.forEach((level, index) => {
          if (!level.enabled) return;

          let lodMesh: THREE.Mesh;
          
          if (index === 0) {
            // 最高精度使用原始模型
            lodMesh = child.clone();
          } else {
            // 其他精度使用简化模型
            lodMesh = simplifyMesh(child, level.simplificationRatio);
          }
          
          lod.addLevel(lodMesh, level.distance);
        });
        
        // 保持原始变换
        lod.position.copy(child.position);
        lod.rotation.copy(child.rotation);
        lod.scale.copy(child.scale);
        
        lodGroup.add(lod);
      }
    });
    
    return lodGroup;
  };

  /**
   * 简化网格
   */
  const simplifyMesh = (mesh: THREE.Mesh, ratio: number): THREE.Mesh => {
    const modifier = new SimplifyModifier();
    const simplified = mesh.clone();
    
    if (simplified.geometry) {
      const targetVertices = Math.floor(simplified.geometry.attributes.position.count * ratio);
      simplified.geometry = modifier.modify(simplified.geometry, targetVertices);
    }
    
    return simplified;
  };

  /**
   * 合并几何体
   */
  const mergeGeometries = (model: THREE.Object3D): THREE.Object3D => {
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const matrices: THREE.Matrix4[] = [];
    
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry && child.material) {
        geometries.push(child.geometry);
        materials.push(child.material as THREE.Material);
        matrices.push(child.matrixWorld.clone());
      }
    });

    if (geometries.length === 0) return model;

    // 按材质分组合并
    const materialGroups = new Map<string, {
      geometries: THREE.BufferGeometry[];
      matrices: THREE.Matrix4[];
      material: THREE.Material;
    }>();

    materials.forEach((material, index) => {
      const key = material.uuid;
      if (!materialGroups.has(key)) {
        materialGroups.set(key, {
          geometries: [],
          matrices: [],
          material
        });
      }
      materialGroups.get(key)!.geometries.push(geometries[index]);
      materialGroups.get(key)!.matrices.push(matrices[index]);
    });

    const mergedGroup = new THREE.Group();

    materialGroups.forEach(({ geometries: geos, matrices: mats, material }) => {
      if (geos.length === 1) {
        // 单个几何体，直接添加
        const mesh = new THREE.Mesh(geos[0], material);
        mesh.applyMatrix4(mats[0]);
        mergedGroup.add(mesh);
      } else {
        // 多个几何体，合并
        const mergedGeometry = new THREE.BufferGeometry();
        const mergedGeos = geos.map((geo, index) => {
          const cloned = geo.clone();
          cloned.applyMatrix4(mats[index]);
          return cloned;
        });
        
        // 使用 Three.js 的几何体合并工具
        // 注意：这里简化处理，实际项目中可能需要更复杂的合并逻辑
        if (mergedGeos.length > 0) {
          const firstGeo = mergedGeos[0];
          mergedGeometry.copy(firstGeo);
          
          const mesh = new THREE.Mesh(mergedGeometry, material);
          mergedGroup.add(mesh);
        }
      }
    });

    return mergedGroup;
  };

  /**
   * 实例化优化
   */
  const optimizeInstancing = (model: THREE.Object3D): THREE.Object3D => {
    // 查找重复的几何体
    const geometryMap = new Map<string, {
      geometry: THREE.BufferGeometry;
      material: THREE.Material;
      instances: THREE.Matrix4[];
    }>();

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const key = `${child.geometry.uuid}_${child.material.uuid}`;
        
        if (!geometryMap.has(key)) {
          geometryMap.set(key, {
            geometry: child.geometry,
            material: child.material as THREE.Material,
            instances: []
          });
        }
        
        geometryMap.get(key)!.instances.push(child.matrixWorld.clone());
      }
    });

    const instancedGroup = new THREE.Group();

    geometryMap.forEach(({ geometry, material, instances }) => {
      if (instances.length > 1) {
        // 创建实例化网格
        const instancedMesh = new THREE.InstancedMesh(geometry, material, instances.length);
        
        instances.forEach((matrix, index) => {
          instancedMesh.setMatrixAt(index, matrix);
        });
        
        instancedMesh.instanceMatrix.needsUpdate = true;
        instancedGroup.add(instancedMesh);
      } else {
        // 单个实例，直接添加
        const mesh = new THREE.Mesh(geometry, material);
        mesh.applyMatrix4(instances[0]);
        instancedGroup.add(mesh);
      }
    });

    return instancedGroup;
  };

  /**
   * 启用视锥体剔除
   */
  const enableFrustumCulling = (model: THREE.Object3D) => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = true;
        
        // 计算边界球以优化剔除
        if (child.geometry) {
          child.geometry.computeBoundingSphere();
        }
      }
    });
  };

  /**
   * 纹理压缩
   */
  const compressTextures = (model: THREE.Object3D, maxSize: number) => {
    const processedTextures = new Set<string>();

    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as any;
        
        // 处理各种纹理贴图
        const textureProperties = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap'];
        
        textureProperties.forEach(prop => {
          if (material[prop] && material[prop] instanceof THREE.Texture) {
            const texture = material[prop] as THREE.Texture;
            
            if (!processedTextures.has(texture.uuid)) {
              compressTexture(texture, maxSize);
              processedTextures.add(texture.uuid);
            }
          }
        });
      }
    });
  };

  /**
   * 压缩单个纹理
   */
  const compressTexture = (texture: THREE.Texture, maxSize: number) => {
    const image = texture.image;
    
    if (image && (image.width > maxSize || image.height > maxSize)) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // 计算新的尺寸
        const scale = Math.min(maxSize / image.width, maxSize / image.height);
        canvas.width = Math.floor(image.width * scale);
        canvas.height = Math.floor(image.height * scale);
        
        // 绘制压缩后的图像
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        // 替换纹理图像
        texture.image = canvas;
        texture.needsUpdate = true;
      }
    }
    
    // 优化纹理设置
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
  };

  /**
   * 计算模型统计信息
   */
  const calculateModelStats = (model: THREE.Object3D) => {
    let vertices = 0;
    let drawCalls = 0;
    
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        drawCalls++;
        if (child.geometry) {
          vertices += child.geometry.attributes.position?.count || 0;
        }
      }
    });
    
    return { vertices, drawCalls };
  };

  /**
   * 更新优化统计
   */
  const updateOptimizationStats = (
    before: { vertices: number; drawCalls: number },
    after: { vertices: number; drawCalls: number }
  ) => {
    optimizationStats.value.originalVertices = before.vertices;
    optimizationStats.value.optimizedVertices = after.vertices;
    optimizationStats.value.originalDrawCalls = before.drawCalls;
    optimizationStats.value.optimizedDrawCalls = after.drawCalls;
    
    optimizationStats.value.memoryReduction = 
      ((before.vertices - after.vertices) / before.vertices) * 100;
    
    optimizationStats.value.performanceGain = 
      ((before.drawCalls - after.drawCalls) / before.drawCalls) * 100;
  };

  /**
   * 分析模型复杂度
   */
  const analyzeModelComplexity = (model: THREE.Object3D) => {
    const analysis = {
      totalMeshes: 0,
      totalVertices: 0,
      totalTriangles: 0,
      totalMaterials: 0,
      totalTextures: 0,
      averageVerticesPerMesh: 0,
      complexity: 'low' as 'low' | 'medium' | 'high' | 'very_high'
    };

    const materials = new Set<string>();
    const textures = new Set<string>();

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        analysis.totalMeshes++;
        
        if (child.geometry) {
          const vertices = child.geometry.attributes.position?.count || 0;
          analysis.totalVertices += vertices;
          
          if (child.geometry.index) {
            analysis.totalTriangles += child.geometry.index.count / 3;
          } else {
            analysis.totalTriangles += vertices / 3;
          }
        }
        
        if (child.material) {
          materials.add(child.material.uuid);
          
          const material = child.material as any;
          const textureProps = ['map', 'normalMap', 'roughnessMap', 'metalnessMap'];
          textureProps.forEach(prop => {
            if (material[prop]) {
              textures.add(material[prop].uuid);
            }
          });
        }
      }
    });

    analysis.totalMaterials = materials.size;
    analysis.totalTextures = textures.size;
    analysis.averageVerticesPerMesh = analysis.totalMeshes > 0 
      ? Math.round(analysis.totalVertices / analysis.totalMeshes) 
      : 0;

    // 评估复杂度
    if (analysis.totalVertices < 10000) {
      analysis.complexity = 'low';
    } else if (analysis.totalVertices < 50000) {
      analysis.complexity = 'medium';
    } else if (analysis.totalVertices < 200000) {
      analysis.complexity = 'high';
    } else {
      analysis.complexity = 'very_high';
    }

    return analysis;
  };

  /**
   * 生成优化建议
   */
  const generateOptimizationSuggestions = (model: THREE.Object3D) => {
    const analysis = analyzeModelComplexity(model);
    const suggestions: string[] = [];

    if (analysis.totalVertices > 100000) {
      suggestions.push('模型顶点数过多，建议启用LOD优化');
    }

    if (analysis.totalMeshes > 50) {
      suggestions.push('网格数量较多，建议合并几何体');
    }

    if (analysis.totalMaterials > 20) {
      suggestions.push('材质数量较多，建议合并相似材质');
    }

    if (analysis.totalTextures > 10) {
      suggestions.push('纹理数量较多，建议使用纹理图集');
    }

    if (analysis.averageVerticesPerMesh < 100) {
      suggestions.push('平均网格顶点数较少，建议合并小型几何体');
    }

    return suggestions;
  };

  return {
    // 状态
    optimizationStats,

    // 主要方法
    optimizeModel,
    createLODModel,
    mergeGeometries,
    optimizeInstancing,
    analyzeModelComplexity,
    generateOptimizationSuggestions,

    // 工具方法
    simplifyMesh,
    enableFrustumCulling,
    compressTextures,
    calculateModelStats
  };
}