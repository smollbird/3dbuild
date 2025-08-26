import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
import * as THREE from 'three';

// 场景对象接口
export interface SceneObject {
  id: string;
  name: string;
  object: THREE.Object3D;
  type: 'model' | 'component' | 'part';
  visible: boolean;
  selected: boolean;
  highlighted: boolean;
  material?: string;
  animations?: THREE.AnimationClip[];
  userData?: Record<string, any>;
}

// 相机状态接口
export interface CameraState {
  position: THREE.Vector3;
  target: THREE.Vector3;
  preset: string;
  fov: number;
  near: number;
  far: number;
}

// 渲染设置接口
export interface RenderSettings {
  quality: string;
  enableShadows: boolean;
  enablePostProcessing: boolean;
  enableAntialiasing: boolean;
  enableAO: boolean;
  enableBloom: boolean;
  pixelRatio: number;
  shadowMapSize: number;
}

/**
 * 3D场景状态管理 Store
 */
export const useSceneStore = defineStore('scene', () => {
  // === 场景基础状态 ===
  const scene = ref<THREE.Scene | null>(null);
  const camera = ref<THREE.PerspectiveCamera | null>(null);
  const renderer = ref<THREE.WebGLRenderer | null>(null);
  const isInitialized = ref(false);

  // === 场景对象管理 ===
  const sceneObjects = reactive<Map<string, SceneObject>>(new Map());
  const selectedObjects = ref<Set<string>>(new Set());
  const highlightedObjects = ref<Set<string>>(new Set());
  const hiddenObjects = ref<Set<string>>(new Set());

  // === 相机状态 ===
  const cameraState = reactive<CameraState>({
    position: new THREE.Vector3(5, 3, 8),
    target: new THREE.Vector3(0, 0, 0),
    preset: 'default',
    fov: 60,
    near: 0.1,
    far: 1000
  });

  // === 渲染设置 ===
  const renderSettings = reactive<RenderSettings>({
    quality: 'medium',
    enableShadows: true,
    enablePostProcessing: true,
    enableAntialiasing: true,
    enableAO: false,
    enableBloom: false,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    shadowMapSize: 1024
  });

  // === 动画状态 ===
  const animationMixers = reactive<Map<string, THREE.AnimationMixer>>(new Map());
  const activeAnimations = ref<Set<string>>(new Set());
  const animationSpeed = ref(1.0);

  // === 光照状态 ===
  const lights = reactive<Map<string, THREE.Light>>(new Map());
  const ambientLightIntensity = ref(0.6);
  const directionalLightIntensity = ref(0.8);

  // === 计算属性 ===
  const visibleObjects = computed(() => {
    return Array.from(sceneObjects.values()).filter(obj => 
      obj.visible && !hiddenObjects.value.has(obj.id)
    );
  });

  const selectedObjectsArray = computed(() => {
    return Array.from(selectedObjects.value).map(id => sceneObjects.get(id)).filter(Boolean);
  });

  const totalVertices = computed(() => {
    return visibleObjects.value.reduce((total, obj) => {
      let vertices = 0;
      obj.object.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          vertices += child.geometry.attributes.position?.count || 0;
        }
      });
      return total + vertices;
    }, 0);
  });

  const totalTriangles = computed(() => {
    return visibleObjects.value.reduce((total, obj) => {
      let triangles = 0;
      obj.object.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          if (child.geometry.index) {
            triangles += child.geometry.index.count / 3;
          } else {
            triangles += (child.geometry.attributes.position?.count || 0) / 3;
          }
        }
      });
      return total + triangles;
    }, 0);
  });

  // === Actions ===

  /**
   * 初始化场景
   */
  const initializeScene = (sceneInstance: THREE.Scene, cameraInstance: THREE.PerspectiveCamera, rendererInstance: THREE.WebGLRenderer) => {
    scene.value = sceneInstance;
    camera.value = cameraInstance;
    renderer.value = rendererInstance;
    isInitialized.value = true;

    // 同步相机状态
    if (camera.value) {
      cameraState.position.copy(camera.value.position);
      cameraState.fov = camera.value.fov;
      cameraState.near = camera.value.near;
      cameraState.far = camera.value.far;
    }
  };

  /**
   * 添加场景对象
   */
  const addSceneObject = (object: SceneObject) => {
    sceneObjects.set(object.id, object);
    
    if (scene.value) {
      scene.value.add(object.object);
    }

    // 如果对象有动画，创建动画混合器
    if (object.animations && object.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(object.object);
      animationMixers.set(object.id, mixer);
    }
  };

  /**
   * 移除场景对象
   */
  const removeSceneObject = (objectId: string) => {
    const sceneObject = sceneObjects.get(objectId);
    if (sceneObject && scene.value) {
      scene.value.remove(sceneObject.object);
      
      // 清理动画混合器
      const mixer = animationMixers.get(objectId);
      if (mixer) {
        mixer.uncacheRoot(sceneObject.object);
        animationMixers.delete(objectId);
      }
      
      sceneObjects.delete(objectId);
      selectedObjects.value.delete(objectId);
      highlightedObjects.value.delete(objectId);
      hiddenObjects.value.delete(objectId);
      activeAnimations.value.delete(objectId);
    }
  };

  /**
   * 获取场景对象
   */
  const getSceneObject = (objectId: string) => {
    return sceneObjects.get(objectId);
  };

  /**
   * 选择对象
   */
  const selectObject = (objectId: string, multiSelect = false) => {
    if (!multiSelect) {
      selectedObjects.value.clear();
    }
    
    selectedObjects.value.add(objectId);
    
    const sceneObject = sceneObjects.get(objectId);
    if (sceneObject) {
      sceneObject.selected = true;
    }
  };

  /**
   * 取消选择对象
   */
  const deselectObject = (objectId: string) => {
    selectedObjects.value.delete(objectId);
    
    const sceneObject = sceneObjects.get(objectId);
    if (sceneObject) {
      sceneObject.selected = false;
    }
  };

  /**
   * 清除所有选择
   */
  const clearSelection = () => {
    selectedObjects.value.forEach(objectId => {
      const sceneObject = sceneObjects.get(objectId);
      if (sceneObject) {
        sceneObject.selected = false;
      }
    });
    selectedObjects.value.clear();
  };

  /**
   * 高亮对象
   */
  const highlightObject = (objectId: string) => {
    highlightedObjects.value.add(objectId);
    
    const sceneObject = sceneObjects.get(objectId);
    if (sceneObject) {
      sceneObject.highlighted = true;
    }
  };

  /**
   * 取消高亮对象
   */
  const unhighlightObject = (objectId: string) => {
    highlightedObjects.value.delete(objectId);
    
    const sceneObject = sceneObjects.get(objectId);
    if (sceneObject) {
      sceneObject.highlighted = false;
    }
  };

  /**
   * 清除所有高亮
   */
  const clearHighlights = () => {
    highlightedObjects.value.forEach(objectId => {
      const sceneObject = sceneObjects.get(objectId);
      if (sceneObject) {
        sceneObject.highlighted = false;
      }
    });
    highlightedObjects.value.clear();
  };

  /**
   * 显示/隐藏对象
   */
  const setObjectVisibility = (objectId: string, visible: boolean) => {
    const sceneObject = sceneObjects.get(objectId);
    if (sceneObject) {
      sceneObject.visible = visible;
      sceneObject.object.visible = visible;
      
      if (visible) {
        hiddenObjects.value.delete(objectId);
      } else {
        hiddenObjects.value.add(objectId);
      }
    }
  };

  /**
   * 播放动画
   */
  const playAnimation = (objectId: string, animationName?: string) => {
    const mixer = animationMixers.get(objectId);
    const sceneObject = sceneObjects.get(objectId);
    
    if (mixer && sceneObject && sceneObject.animations) {
      let animation: THREE.AnimationClip | undefined;
      
      if (animationName) {
        animation = sceneObject.animations.find(anim => anim.name === animationName);
      } else {
        animation = sceneObject.animations[0];
      }
      
      if (animation) {
        const action = mixer.clipAction(animation);
        action.play();
        activeAnimations.value.add(objectId);
      }
    }
  };

  /**
   * 停止动画
   */
  const stopAnimation = (objectId: string) => {
    const mixer = animationMixers.get(objectId);
    if (mixer) {
      mixer.stopAllAction();
      activeAnimations.value.delete(objectId);
    }
  };

  /**
   * 更新动画
   */
  const updateAnimations = (deltaTime: number) => {
    animationMixers.forEach(mixer => {
      mixer.update(deltaTime * animationSpeed.value);
    });
  };

  /**
   * 更新相机状态
   */
  const updateCameraState = (position: THREE.Vector3, target: THREE.Vector3, preset?: string) => {
    cameraState.position.copy(position);
    cameraState.target.copy(target);
    
    if (preset) {
      cameraState.preset = preset;
    }
  };

  /**
   * 更新渲染设置
   */
  const updateRenderSettings = (settings: Partial<RenderSettings>) => {
    Object.assign(renderSettings, settings);
    
    // 应用到渲染器
    if (renderer.value) {
      if (settings.pixelRatio !== undefined) {
        renderer.value.setPixelRatio(settings.pixelRatio);
      }
      if (settings.enableShadows !== undefined) {
        renderer.value.shadowMap.enabled = settings.enableShadows;
      }
    }
  };

  /**
   * 添加光源
   */
  const addLight = (lightId: string, light: THREE.Light) => {
    lights.set(lightId, light);
    
    if (scene.value) {
      scene.value.add(light);
    }
  };

  /**
   * 移除光源
   */
  const removeLight = (lightId: string) => {
    const light = lights.get(lightId);
    if (light && scene.value) {
      scene.value.remove(light);
      lights.delete(lightId);
    }
  };

  /**
   * 更新环境光强度
   */
  const updateAmbientLight = (intensity: number) => {
    ambientLightIntensity.value = intensity;
    
    lights.forEach(light => {
      if (light instanceof THREE.AmbientLight) {
        light.intensity = intensity;
      }
    });
  };

  /**
   * 更新平行光强度
   */
  const updateDirectionalLight = (intensity: number) => {
    directionalLightIntensity.value = intensity;
    
    lights.forEach(light => {
      if (light instanceof THREE.DirectionalLight) {
        light.intensity = intensity;
      }
    });
  };

  /**
   * 聚焦到对象
   */
  const focusOnObject = (objectId: string) => {
    const sceneObject = sceneObjects.get(objectId);
    if (sceneObject && camera.value) {
      const box = new THREE.Box3().setFromObject(sceneObject.object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      const maxDimension = Math.max(size.x, size.y, size.z);
      const distance = maxDimension * 2;
      
      const newPosition = center.clone().add(new THREE.Vector3(distance, distance * 0.5, distance));
      
      updateCameraState(newPosition, center);
    }
  };

  /**
   * 清理场景
   */
  const clearScene = () => {
    // 清理所有对象
    sceneObjects.forEach(sceneObject => {
      if (scene.value) {
        scene.value.remove(sceneObject.object);
      }
    });
    
    // 清理动画混合器
    animationMixers.forEach(mixer => {
      mixer.uncacheRoot(mixer.getRoot());
    });
    
    // 清理所有状态
    sceneObjects.clear();
    animationMixers.clear();
    selectedObjects.value.clear();
    highlightedObjects.value.clear();
    hiddenObjects.value.clear();
    activeAnimations.value.clear();
    lights.clear();
  };

  /**
   * 重置相机
   */
  const resetCamera = () => {
    cameraState.position.set(5, 3, 8);
    cameraState.target.set(0, 0, 0);
    cameraState.preset = 'default';
    
    if (camera.value) {
      camera.value.position.copy(cameraState.position);
      camera.value.lookAt(cameraState.target);
    }
  };

  return {
    // === 状态 ===
    scene,
    camera,
    renderer,
    isInitialized,
    sceneObjects,
    selectedObjects,
    highlightedObjects,
    hiddenObjects,
    cameraState,
    renderSettings,
    animationMixers,
    activeAnimations,
    animationSpeed,
    lights,
    ambientLightIntensity,
    directionalLightIntensity,

    // === 计算属性 ===
    visibleObjects,
    selectedObjectsArray,
    totalVertices,
    totalTriangles,

    // === Actions ===
    initializeScene,
    addSceneObject,
    removeSceneObject,
    getSceneObject,
    selectObject,
    deselectObject,
    clearSelection,
    highlightObject,
    unhighlightObject,
    clearHighlights,
    setObjectVisibility,
    playAnimation,
    stopAnimation,
    updateAnimations,
    updateCameraState,
    updateRenderSettings,
    addLight,
    removeLight,
    updateAmbientLight,
    updateDirectionalLight,
    focusOnObject,
    clearScene,
    resetCamera
  };
});