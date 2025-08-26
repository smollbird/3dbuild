import { ref, reactive } from 'vue';
import * as THREE from 'three';

// 材质类型
export enum MaterialType {
  STANDARD = 'standard',
  PHYSICAL = 'physical',
  BASIC = 'basic',
  LAMBERT = 'lambert',
  PHONG = 'phong',
  TOON = 'toon'
}

// 材质配置
export interface MaterialPreset {
  name: string;
  type: MaterialType;
  color: string;
  metalness: number;
  roughness: number;
  emissive: string;
  emissiveIntensity: number;
  transparent: boolean;
  opacity: number;
  envMapIntensity: number;
  normalScale: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  ior?: number;
}

// 纹理配置
export interface TextureConfig {
  map?: string;
  normalMap?: string;
  roughnessMap?: string;
  metalnessMap?: string;
  emissiveMap?: string;
  envMap?: THREE.CubeTexture;
  repeat?: [number, number];
  offset?: [number, number];
}

/**
 * 材质管理器 Composable
 */
export function useMaterialManager() {
  // 材质预设
  const materialPresets = ref<Record<string, MaterialPreset>>({
    // 金属材质
    steel: {
      name: '钢铁',
      type: MaterialType.STANDARD,
      color: '#8c9eff',
      metalness: 0.9,
      roughness: 0.1,
      emissive: '#000000',
      emissiveIntensity: 0,
      transparent: false,
      opacity: 1,
      envMapIntensity: 1,
      normalScale: 1
    },
    aluminum: {
      name: '铝合金',
      type: MaterialType.STANDARD,
      color: '#e8eaf6',
      metalness: 0.8,
      roughness: 0.2,
      emissive: '#000000',
      emissiveIntensity: 0,
      transparent: false,
      opacity: 1,
      envMapIntensity: 0.8,
      normalScale: 1
    },
    copper: {
      name: '铜',
      type: MaterialType.STANDARD,
      color: '#ff8a65',
      metalness: 1.0,
      roughness: 0.1,
      emissive: '#000000',
      emissiveIntensity: 0,
      transparent: false,
      opacity: 1,
      envMapIntensity: 1,
      normalScale: 1
    },
    
    // 塑料材质
    plastic_smooth: {
      name: '光滑塑料',
      type: MaterialType.STANDARD,
      color: '#4fc3f7',
      metalness: 0,
      roughness: 0.1,
      emissive: '#000000',
      emissiveIntensity: 0,
      transparent: false,
      opacity: 1,
      envMapIntensity: 0.3,
      normalScale: 1
    },
    plastic_rough: {
      name: '粗糙塑料',
      type: MaterialType.STANDARD,
      color: '#66bb6a',
      metalness: 0,
      roughness: 0.8,
      emissive: '#000000',
      emissiveIntensity: 0,
      transparent: false,
      opacity: 1,
      envMapIntensity: 0.1,
      normalScale: 1
    },
    
    // 橡胶材质
    rubber: {
      name: '橡胶',
      type: MaterialType.STANDARD,
      color: '#424242',
      metalness: 0,
      roughness: 0.9,
      emissive: '#000000',
      emissiveIntensity: 0,
      transparent: false,
      opacity: 1,
      envMapIntensity: 0.1,
      normalScale: 1
    },
    
    // 玻璃材质
    glass: {
      name: '玻璃',
      type: MaterialType.PHYSICAL,
      color: '#e3f2fd',
      metalness: 0,
      roughness: 0,
      emissive: '#000000',
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0.1,
      envMapIntensity: 1,
      normalScale: 1,
      transmission: 1,
      ior: 1.5
    },
    
    // 发光材质
    emissive_red: {
      name: '红色发光',
      type: MaterialType.STANDARD,
      color: '#ff1744',
      metalness: 0,
      roughness: 0.5,
      emissive: '#ff1744',
      emissiveIntensity: 0.5,
      transparent: false,
      opacity: 1,
      envMapIntensity: 0,
      normalScale: 1
    },
    emissive_blue: {
      name: '蓝色发光',
      type: MaterialType.STANDARD,
      color: '#2196f3',
      metalness: 0,
      roughness: 0.5,
      emissive: '#2196f3',
      emissiveIntensity: 0.5,
      transparent: false,
      opacity: 1,
      envMapIntensity: 0,
      normalScale: 1
    }
  });

  // 当前材质库
  const materialLibrary = reactive<Map<string, THREE.Material>>(new Map());
  
  // 纹理缓存
  const textureCache = reactive<Map<string, THREE.Texture>>(new Map());

  /**
   * 创建材质
   */
  const createMaterial = (preset: MaterialPreset, textureConfig?: TextureConfig): THREE.Material => {
    let material: THREE.Material;

    const baseParams = {
      color: new THREE.Color(preset.color),
      transparent: preset.transparent,
      opacity: preset.opacity
    };

    switch (preset.type) {
      case MaterialType.STANDARD:
        material = new THREE.MeshStandardMaterial({
          ...baseParams,
          metalness: preset.metalness,
          roughness: preset.roughness,
          emissive: new THREE.Color(preset.emissive),
          emissiveIntensity: preset.emissiveIntensity,
          envMapIntensity: preset.envMapIntensity
        });
        break;

      case MaterialType.PHYSICAL:
        material = new THREE.MeshPhysicalMaterial({
          ...baseParams,
          metalness: preset.metalness,
          roughness: preset.roughness,
          emissive: new THREE.Color(preset.emissive),
          emissiveIntensity: preset.emissiveIntensity,
          envMapIntensity: preset.envMapIntensity,
          clearcoat: preset.clearcoat || 0,
          clearcoatRoughness: preset.clearcoatRoughness || 0,
          transmission: preset.transmission || 0,
          ior: preset.ior || 1.5
        });
        break;

      case MaterialType.BASIC:
        material = new THREE.MeshBasicMaterial(baseParams);
        break;

      case MaterialType.LAMBERT:
        material = new THREE.MeshLambertMaterial({
          ...baseParams,
          emissive: new THREE.Color(preset.emissive),
          emissiveIntensity: preset.emissiveIntensity
        });
        break;

      case MaterialType.PHONG:
        material = new THREE.MeshPhongMaterial({
          ...baseParams,
          emissive: new THREE.Color(preset.emissive),
          emissiveIntensity: preset.emissiveIntensity,
          shininess: 100 - preset.roughness * 100
        });
        break;

      case MaterialType.TOON:
        material = new THREE.MeshToonMaterial(baseParams);
        break;

      default:
        material = new THREE.MeshStandardMaterial(baseParams);
    }

    // 应用纹理
    if (textureConfig) {
      applyTextures(material, textureConfig);
    }

    return material;
  };

  /**
   * 应用纹理
   */
  const applyTextures = (material: THREE.Material, config: TextureConfig) => {
    const loader = new THREE.TextureLoader();

    if (config.map && material instanceof THREE.MeshStandardMaterial) {
      const texture = loadTexture(config.map, loader);
      if (texture) {
        material.map = texture;
        if (config.repeat) {
          texture.repeat.set(config.repeat[0], config.repeat[1]);
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
        if (config.offset) {
          texture.offset.set(config.offset[0], config.offset[1]);
        }
      }
    }

    if (config.normalMap && material instanceof THREE.MeshStandardMaterial) {
      const texture = loadTexture(config.normalMap, loader);
      if (texture) {
        material.normalMap = texture;
        material.normalScale.setScalar(1);
      }
    }

    if (config.roughnessMap && material instanceof THREE.MeshStandardMaterial) {
      const texture = loadTexture(config.roughnessMap, loader);
      if (texture) {
        material.roughnessMap = texture;
      }
    }

    if (config.metalnessMap && material instanceof THREE.MeshStandardMaterial) {
      const texture = loadTexture(config.metalnessMap, loader);
      if (texture) {
        material.metalnessMap = texture;
      }
    }

    if (config.emissiveMap && material instanceof THREE.MeshStandardMaterial) {
      const texture = loadTexture(config.emissiveMap, loader);
      if (texture) {
        material.emissiveMap = texture;
      }
    }

    if (config.envMap && material instanceof THREE.MeshStandardMaterial) {
      material.envMap = config.envMap;
    }

    material.needsUpdate = true;
  };

  /**
   * 加载纹理（带缓存）
   */
  const loadTexture = (url: string, loader: THREE.TextureLoader): THREE.Texture | null => {
    if (textureCache.has(url)) {
      return textureCache.get(url)!;
    }

    try {
      const texture = loader.load(url);
      texture.colorSpace = THREE.SRGBColorSpace;
      textureCache.set(url, texture);
      return texture;
    } catch (error) {
      console.warn(`Failed to load texture: ${url}`, error);
      return null;
    }
  };

  /**
   * 根据预设名称获取材质
   */
  const getMaterialByPreset = (presetName: string, textureConfig?: TextureConfig): THREE.Material => {
    const cacheKey = `${presetName}_${JSON.stringify(textureConfig || {})}`;
    
    if (materialLibrary.has(cacheKey)) {
      return materialLibrary.get(cacheKey)!.clone();
    }

    const preset = materialPresets.value[presetName];
    if (!preset) {
      console.warn(`Material preset not found: ${presetName}`);
      return new THREE.MeshStandardMaterial({ color: 0x888888 });
    }

    const material = createMaterial(preset, textureConfig);
    materialLibrary.set(cacheKey, material);
    
    return material.clone();
  };

  /**
   * 应用材质预设到对象
   */
  const applyMaterialPreset = (object: THREE.Object3D, presetName: string, textureConfig?: TextureConfig) => {
    const material = getMaterialByPreset(presetName, textureConfig);
    
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // 保存原始材质（用于恢复）
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }
        child.material = material.clone();
      }
    });
  };

  /**
   * 恢复原始材质
   */
  const restoreOriginalMaterial = (object: THREE.Object3D) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.originalMaterial) {
        child.material = child.userData.originalMaterial;
        delete child.userData.originalMaterial;
      }
    });
  };

  /**
   * 添加自定义材质预设
   */
  const addMaterialPreset = (name: string, preset: MaterialPreset) => {
    materialPresets.value[name] = preset;
  };

  /**
   * 获取材质预设列表
   */
  const getMaterialPresets = () => {
    return Object.keys(materialPresets.value).map(key => ({
      key,
      ...materialPresets.value[key]
    }));
  };

  /**
   * 更新材质属性
   */
  const updateMaterialProperty = (
    material: THREE.Material,
    property: string,
    value: any
  ) => {
    if (property in material) {
      (material as any)[property] = value;
      material.needsUpdate = true;
    }
  };

  /**
   * 创建高亮材质
   */
  const createHighlightMaterial = (color: string = '#ffeb3b', intensity: number = 0.5): THREE.Material => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: intensity,
      transparent: true,
      opacity: 0.8
    });
  };

  /**
   * 高亮对象
   */
  const highlightObject = (object: THREE.Object3D, color?: string, intensity?: number) => {
    const highlightMaterial = createHighlightMaterial(color, intensity);
    
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }
        child.material = highlightMaterial;
      }
    });
  };

  /**
   * 移除高亮
   */
  const removeHighlight = (object: THREE.Object3D) => {
    restoreOriginalMaterial(object);
  };

  /**
   * 清理材质缓存
   */
  const clearCache = () => {
    // 清理材质库
    materialLibrary.forEach(material => {
      material.dispose();
    });
    materialLibrary.clear();

    // 清理纹理缓存
    textureCache.forEach(texture => {
      texture.dispose();
    });
    textureCache.clear();
  };

  return {
    // 状态
    materialPresets,
    materialLibrary,
    textureCache,

    // 方法
    createMaterial,
    getMaterialByPreset,
    applyMaterialPreset,
    restoreOriginalMaterial,
    addMaterialPreset,
    getMaterialPresets,
    updateMaterialProperty,
    highlightObject,
    removeHighlight,
    clearCache,

    // 工具方法
    loadTexture,
    applyTextures
  };
}