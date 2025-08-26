import { ref, type Ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// 支持的模型格式
export enum ModelFormat {
  GLTF = 'gltf',
  GLB = 'glb',
  FBX = 'fbx',
  OBJ = 'obj'
}

// 模型配置接口
export interface ModelConfig {
  url: string;
  format: ModelFormat;
  scale?: THREE.Vector3;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  enableShadows?: boolean;
  enableDraco?: boolean;
}

// 加载状态
export interface LoadingState {
  isLoading: boolean;
  progress: number;
  error: string | null;
  total: number;
  loaded: number;
}

// 模型数据
export interface ModelData {
  object: THREE.Object3D;
  animations?: THREE.AnimationClip[];
  mixer?: THREE.AnimationMixer;
  materials?: THREE.Material[];
  geometry?: THREE.BufferGeometry[];
}

/**
 * 3D模型加载器 Composable
 */
export function useModelLoader() {
  // 状态管理
  const loadingState = ref<LoadingState>({
    isLoading: false,
    progress: 0,
    error: null,
    total: 0,
    loaded: 0
  });

  const loadedModels = ref<Map<string, ModelData>>(new Map());

  // 加载器实例
  let gltfLoader: GLTFLoader | null = null;
  let fbxLoader: FBXLoader | null = null;
  let objLoader: OBJLoader | null = null;
  let dracoLoader: DRACOLoader | null = null;

  /**
   * 初始化加载器
   */
  const initLoaders = () => {
    // GLTF/GLB 加载器
    gltfLoader = new GLTFLoader();
    
    // Draco 压缩支持
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    // FBX 加载器
    fbxLoader = new FBXLoader();

    // OBJ 加载器
    objLoader = new OBJLoader();
  };

  /**
   * 获取文件格式
   */
  const getFormatFromUrl = (url: string): ModelFormat => {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'gltf':
        return ModelFormat.GLTF;
      case 'glb':
        return ModelFormat.GLB;
      case 'fbx':
        return ModelFormat.FBX;
      case 'obj':
        return ModelFormat.OBJ;
      default:
        return ModelFormat.GLTF;
    }
  };

  /**
   * 加载模型
   */
  const loadModel = async (config: ModelConfig): Promise<ModelData> => {
    if (!gltfLoader || !fbxLoader || !objLoader) {
      initLoaders();
    }

    const { url, format, scale, position, rotation, enableShadows = true } = config;
    
    // 检查缓存
    if (loadedModels.value.has(url)) {
      const cached = loadedModels.value.get(url)!;
      return cloneModel(cached);
    }

    // 重置加载状态
    loadingState.value = {
      isLoading: true,
      progress: 0,
      error: null,
      total: 1,
      loaded: 0
    };

    try {
      let modelData: ModelData;

      switch (format) {
        case ModelFormat.GLTF:
        case ModelFormat.GLB:
          modelData = await loadGLTF(url);
          break;
        case ModelFormat.FBX:
          modelData = await loadFBX(url);
          break;
        case ModelFormat.OBJ:
          modelData = await loadOBJ(url);
          break;
        default:
          throw new Error(`不支持的模型格式: ${format}`);
      }

      // 应用变换
      if (scale) modelData.object.scale.copy(scale);
      if (position) modelData.object.position.copy(position);
      if (rotation) modelData.object.rotation.copy(rotation);

      // 配置阴影
      if (enableShadows) {
        enableModelShadows(modelData.object);
      }

      // 缓存模型
      loadedModels.value.set(url, modelData);

      loadingState.value.isLoading = false;
      loadingState.value.progress = 100;

      return cloneModel(modelData);
    } catch (error) {
      loadingState.value.isLoading = false;
      loadingState.value.error = error instanceof Error ? error.message : '加载模型失败';
      throw error;
    }
  };

  /**
   * 加载 GLTF/GLB 模型
   */
  const loadGLTF = (url: string): Promise<ModelData> => {
    return new Promise((resolve, reject) => {
      gltfLoader!.load(
        url,
        (gltf) => {
          const modelData: ModelData = {
            object: gltf.scene,
            animations: gltf.animations.length > 0 ? gltf.animations : undefined
          };

          // 创建动画混合器
          if (modelData.animations && modelData.animations.length > 0) {
            modelData.mixer = new THREE.AnimationMixer(modelData.object);
          }

          resolve(modelData);
        },
        (progress) => {
          loadingState.value.progress = (progress.loaded / progress.total) * 100;
          loadingState.value.loaded = progress.loaded;
          loadingState.value.total = progress.total;
        },
        (error) => {
          reject(new Error(`GLTF加载失败: ${error.message}`));
        }
      );
    });
  };

  /**
   * 加载 FBX 模型
   */
  const loadFBX = (url: string): Promise<ModelData> => {
    return new Promise((resolve, reject) => {
      fbxLoader!.load(
        url,
        (fbx) => {
          const modelData: ModelData = {
            object: fbx,
            animations: fbx.animations.length > 0 ? fbx.animations : undefined
          };

          // 创建动画混合器
          if (modelData.animations && modelData.animations.length > 0) {
            modelData.mixer = new THREE.AnimationMixer(modelData.object);
          }

          resolve(modelData);
        },
        (progress) => {
          loadingState.value.progress = (progress.loaded / progress.total) * 100;
          loadingState.value.loaded = progress.loaded;
          loadingState.value.total = progress.total;
        },
        (error) => {
          reject(new Error(`FBX加载失败: ${error.message}`));
        }
      );
    });
  };

  /**
   * 加载 OBJ 模型
   */
  const loadOBJ = (url: string): Promise<ModelData> => {
    return new Promise((resolve, reject) => {
      objLoader!.load(
        url,
        (obj) => {
          const modelData: ModelData = {
            object: obj
          };
          resolve(modelData);
        },
        (progress) => {
          loadingState.value.progress = (progress.loaded / progress.total) * 100;
          loadingState.value.loaded = progress.loaded;
          loadingState.value.total = progress.total;
        },
        (error) => {
          reject(new Error(`OBJ加载失败: ${error.message}`));
        }
      );
    });
  };

  /**
   * 批量加载模型
   */
  const loadModels = async (configs: ModelConfig[]): Promise<ModelData[]> => {
    loadingState.value = {
      isLoading: true,
      progress: 0,
      error: null,
      total: configs.length,
      loaded: 0
    };

    try {
      const results: ModelData[] = [];
      
      for (let i = 0; i < configs.length; i++) {
        const modelData = await loadModel(configs[i]);
        results.push(modelData);
        
        loadingState.value.loaded = i + 1;
        loadingState.value.progress = ((i + 1) / configs.length) * 100;
      }

      loadingState.value.isLoading = false;
      return results;
    } catch (error) {
      loadingState.value.isLoading = false;
      loadingState.value.error = error instanceof Error ? error.message : '批量加载失败';
      throw error;
    }
  };

  /**
   * 启用模型阴影
   */
  const enableModelShadows = (object: THREE.Object3D) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  };

  /**
   * 克隆模型数据
   */
  const cloneModel = (modelData: ModelData): ModelData => {
    const cloned: ModelData = {
      object: modelData.object.clone(),
      animations: modelData.animations,
    };

    // 如果有动画，创建新的混合器
    if (cloned.animations && cloned.animations.length > 0) {
      cloned.mixer = new THREE.AnimationMixer(cloned.object);
    }

    return cloned;
  };

  /**
   * 优化模型
   */
  const optimizeModel = (modelData: ModelData) => {
    modelData.object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // 合并几何体
        if (child.geometry) {
          child.geometry.computeBoundingBox();
          child.geometry.computeBoundingSphere();
        }

        // 优化材质
        if (child.material instanceof THREE.Material) {
          child.material.needsUpdate = false;
        }
      }
    });
  };

  /**
   * 计算模型边界
   */
  const getModelBounds = (object: THREE.Object3D) => {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    return { box, center, size };
  };

  /**
   * 清理资源
   */
  const dispose = () => {
    // 清理加载器
    if (dracoLoader) {
      dracoLoader.dispose();
    }

    // 清理已加载的模型
    loadedModels.value.forEach((modelData) => {
      if (modelData.mixer) {
        modelData.mixer.uncacheRoot(modelData.object);
      }
      
      modelData.object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    });

    loadedModels.value.clear();
  };

  return {
    // 状态
    loadingState,
    loadedModels,

    // 方法
    loadModel,
    loadModels,
    getFormatFromUrl,
    optimizeModel,
    getModelBounds,
    enableModelShadows,
    dispose,

    // 工具方法
    cloneModel
  };
}