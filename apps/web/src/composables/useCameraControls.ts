import { ref, type Ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 相机控制配置
export interface CameraControlConfig {
  enableZoom?: boolean;
  enableRotate?: boolean;
  enablePan?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  dampingFactor?: number;
  enableDamping?: boolean;
}

// 预设相机位置
export interface CameraPreset {
  name: string;
  position: THREE.Vector3;
  target: THREE.Vector3;
  zoom?: number;
}

// 相机动画状态
export interface CameraAnimation {
  isAnimating: boolean;
  duration: number;
  startTime: number;
  startPosition: THREE.Vector3;
  startTarget: THREE.Vector3;
  endPosition: THREE.Vector3;
  endTarget: THREE.Vector3;
}

/**
 * 相机控制 Composable
 */
export function useCameraControls(
  camera: Ref<THREE.PerspectiveCamera | null>,
  renderer: Ref<THREE.WebGLRenderer | null>,
  config: CameraControlConfig = {}
) {
  // 默认配置
  const defaultConfig: Required<CameraControlConfig> = {
    enableZoom: true,
    enableRotate: true,
    enablePan: true,
    autoRotate: false,
    autoRotateSpeed: 2.0,
    minDistance: 1,
    maxDistance: 100,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    dampingFactor: 0.05,
    enableDamping: true,
    ...config
  };

  // 状态管理
  const isControlsEnabled = ref(true);
  const currentPreset = ref<string>('default');
  const animation = ref<CameraAnimation | null>(null);

  // 控制器实例
  let controls: OrbitControls | null = null;

  // 预设相机位置
  const presets = ref<Record<string, CameraPreset>>({
    default: {
      name: '默认视图',
      position: new THREE.Vector3(5, 3, 8),
      target: new THREE.Vector3(0, 0, 0)
    },
    front: {
      name: '正视图',
      position: new THREE.Vector3(0, 0, 10),
      target: new THREE.Vector3(0, 0, 0)
    },
    back: {
      name: '后视图',
      position: new THREE.Vector3(0, 0, -10),
      target: new THREE.Vector3(0, 0, 0)
    },
    left: {
      name: '左视图',
      position: new THREE.Vector3(-10, 0, 0),
      target: new THREE.Vector3(0, 0, 0)
    },
    right: {
      name: '右视图',
      position: new THREE.Vector3(10, 0, 0),
      target: new THREE.Vector3(0, 0, 0)
    },
    top: {
      name: '顶视图',
      position: new THREE.Vector3(0, 10, 0),
      target: new THREE.Vector3(0, 0, 0)
    },
    bottom: {
      name: '底视图',
      position: new THREE.Vector3(0, -10, 0),
      target: new THREE.Vector3(0, 0, 0)
    },
    isometric: {
      name: '等轴视图',
      position: new THREE.Vector3(5, 5, 5),
      target: new THREE.Vector3(0, 0, 0)
    }
  });

  /**
   * 初始化相机控制器
   */
  const initControls = () => {
    if (!camera.value || !renderer.value) {
      console.warn('相机或渲染器未初始化');
      return;
    }

    // 创建轨道控制器
    controls = new OrbitControls(camera.value, renderer.value.domElement);

    // 应用配置
    controls.enableZoom = defaultConfig.enableZoom;
    controls.enableRotate = defaultConfig.enableRotate;
    controls.enablePan = defaultConfig.enablePan;
    controls.autoRotate = defaultConfig.autoRotate;
    controls.autoRotateSpeed = defaultConfig.autoRotateSpeed;
    controls.minDistance = defaultConfig.minDistance;
    controls.maxDistance = defaultConfig.maxDistance;
    controls.minPolarAngle = defaultConfig.minPolarAngle;
    controls.maxPolarAngle = defaultConfig.maxPolarAngle;
    controls.enableDamping = defaultConfig.enableDamping;
    controls.dampingFactor = defaultConfig.dampingFactor;

    // 设置默认目标
    controls.target.set(0, 0, 0);
    controls.update();

    // 监听控制器事件
    controls.addEventListener('change', () => {
      // 可以在这里添加回调
    });

    controls.addEventListener('start', () => {
      // 开始交互时停止动画
      if (animation.value) {
        animation.value = null;
      }
    });
  };

  /**
   * 更新控制器
   */
  const updateControls = () => {
    if (controls && isControlsEnabled.value) {
      controls.update();
    }

    // 更新相机动画
    if (animation.value) {
      updateCameraAnimation();
    }
  };

  /**
   * 设置相机预设位置
   */
  const setCameraPreset = (presetName: string, duration: number = 1000) => {
    const preset = presets.value[presetName];
    if (!preset || !camera.value || !controls) {
      console.warn(`未找到预设: ${presetName}`);
      return;
    }

    currentPreset.value = presetName;
    
    if (duration === 0) {
      // 立即设置
      camera.value.position.copy(preset.position);
      controls.target.copy(preset.target);
      controls.update();
    } else {
      // 动画过渡
      startCameraAnimation(preset.position, preset.target, duration);
    }
  };

  /**
   * 开始相机动画
   */
  const startCameraAnimation = (
    targetPosition: THREE.Vector3,
    targetTarget: THREE.Vector3,
    duration: number
  ) => {
    if (!camera.value || !controls) return;

    animation.value = {
      isAnimating: true,
      duration,
      startTime: performance.now(),
      startPosition: camera.value.position.clone(),
      startTarget: controls.target.clone(),
      endPosition: targetPosition.clone(),
      endTarget: targetTarget.clone()
    };
  };

  /**
   * 更新相机动画
   */
  const updateCameraAnimation = () => {
    if (!animation.value || !camera.value || !controls) return;

    const elapsed = performance.now() - animation.value.startTime;
    const progress = Math.min(elapsed / animation.value.duration, 1);

    // 使用缓动函数
    const easeProgress = easeInOutCubic(progress);

    // 插值相机位置
    camera.value.position.lerpVectors(
      animation.value.startPosition,
      animation.value.endPosition,
      easeProgress
    );

    // 插值目标位置
    controls.target.lerpVectors(
      animation.value.startTarget,
      animation.value.endTarget,
      easeProgress
    );

    controls.update();

    // 动画完成
    if (progress >= 1) {
      animation.value = null;
    }
  };

  /**
   * 缓动函数
   */
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  /**
   * 聚焦到对象
   */
  const focusOnObject = (object: THREE.Object3D, duration: number = 1000) => {
    if (!camera.value || !controls) return;

    // 计算对象边界
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // 计算相机距离
    const maxDimension = Math.max(size.x, size.y, size.z);
    const distance = maxDimension * 2;

    // 计算相机位置（保持当前角度）
    const direction = camera.value.position.clone().sub(controls.target).normalize();
    const newPosition = center.clone().add(direction.multiplyScalar(distance));

    if (duration === 0) {
      camera.value.position.copy(newPosition);
      controls.target.copy(center);
      controls.update();
    } else {
      startCameraAnimation(newPosition, center, duration);
    }
  };

  /**
   * 缩放到适合
   */
  const fitToView = (objects: THREE.Object3D[], duration: number = 1000) => {
    if (!camera.value || !controls || objects.length === 0) return;

    // 计算所有对象的边界
    const box = new THREE.Box3();
    objects.forEach(obj => {
      box.expandByObject(obj);
    });

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // 计算相机距离
    const maxDimension = Math.max(size.x, size.y, size.z);
    const fov = camera.value.fov * (Math.PI / 180);
    const distance = maxDimension / (2 * Math.tan(fov / 2));

    // 设置相机位置
    const newPosition = center.clone().add(new THREE.Vector3(distance, distance * 0.5, distance));

    if (duration === 0) {
      camera.value.position.copy(newPosition);
      controls.target.copy(center);
      controls.update();
    } else {
      startCameraAnimation(newPosition, center, duration);
    }
  };

  /**
   * 重置相机到默认位置
   */
  const resetCamera = (duration: number = 1000) => {
    setCameraPreset('default', duration);
  };

  /**
   * 启用/禁用控制器
   */
  const setControlsEnabled = (enabled: boolean) => {
    isControlsEnabled.value = enabled;
    if (controls) {
      controls.enabled = enabled;
    }
  };

  /**
   * 设置自动旋转
   */
  const setAutoRotate = (enabled: boolean, speed?: number) => {
    if (controls) {
      controls.autoRotate = enabled;
      if (speed !== undefined) {
        controls.autoRotateSpeed = speed;
      }
    }
  };

  /**
   * 添加自定义预设
   */
  const addPreset = (name: string, preset: CameraPreset) => {
    presets.value[name] = preset;
  };

  /**
   * 获取当前相机状态
   */
  const getCurrentCameraState = () => {
    if (!camera.value || !controls) return null;

    return {
      position: camera.value.position.clone(),
      target: controls.target.clone(),
      zoom: camera.value.zoom
    };
  };

  /**
   * 销毁控制器
   */
  const dispose = () => {
    if (controls) {
      controls.dispose();
      controls = null;
    }
    animation.value = null;
  };

  return {
    // 状态
    isControlsEnabled,
    currentPreset,
    animation,
    presets,

    // 方法
    initControls,
    updateControls,
    setCameraPreset,
    focusOnObject,
    fitToView,
    resetCamera,
    setControlsEnabled,
    setAutoRotate,
    addPreset,
    getCurrentCameraState,
    dispose,

    // 内部访问
    controls: () => controls
  };
}