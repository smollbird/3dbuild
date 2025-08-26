<template>
  <div class="threejs-viewer">
    <div ref="threeContainer" class="three-container" />
    
    <!-- 加载状态 -->
    <div v-if="loadingState.isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载3D模型...</div>
        <div class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: loadingState.progress + '%' }"></div>
          </div>
          <div class="progress-text">{{ Math.round(loadingState.progress) }}%</div>
        </div>
      </div>
    </div>
    
    <!-- 错误状态 -->
    <div v-if="loadingState.error" class="error-overlay">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <div class="error-text">{{ loadingState.error }}</div>
        <button class="retry-btn" @click="handleRetry">重试</button>
      </div>
    </div>
    
    <!-- 组件标签覆盖层 -->
    <div class="component-labels">
      <div
        v-for="(label, key) in componentLabels"
        :key="key"
        class="component-label"
        :style="label.position"
        @click="handleComponentClick(key)"
      >
        <div class="label-content">{{ label.name }}</div>
      </div>
    </div>

    <!-- 选中组件信息 -->
    <div v-if="selectedComponent" class="component-info">
      <h3>{{ selectedComponent.name }}</h3>
      <div class="info-details">
        <div class="info-item">
          <span class="label">状态:</span>
          <span class="value">{{ selectedComponent.status }}</span>
        </div>
        <div class="info-item">
          <span class="label">扭矩:</span>
          <span class="value">{{ selectedComponent.torque }}</span>
        </div>
        <div class="info-item">
          <span class="label">拆解顺序:</span>
          <span class="value">{{ selectedComponent.order }}</span>
        </div>
      </div>
    </div>

    <!-- 视图控制 -->
    <div class="view-controls">
      <div class="view-title">3D 模型视图</div>
      <div class="model-name">{{ modelName }}</div>
      <div class="view-buttons">
        <button
          v-for="view in viewTypes"
          :key="view"
          class="view-btn"
          :class="{ active: currentView === view }"
          @click="handleViewChange(view)"
        >
          {{ view }}
        </button>
      </div>
    </div>

    <!-- 渲染统计 -->
    <div class="render-stats">
      <div class="stats-title">渲染统计</div>
      <div class="stats-content">
        <div class="stat-item">
          <span class="stat-label">FPS:</span>
          <span class="stat-value">{{ renderStats.fps }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">质量:</span>
          <span class="stat-value">{{ currentQuality }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">面数:</span>
          <span class="stat-value">{{ renderStats.triangles }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">绘制调用:</span>
          <span class="stat-value">{{ renderStats.drawCalls }}</span>
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-buttons">
        <button
          v-for="control in controls"
          :key="control.name"
          class="control-btn"
          :title="getControlTitle(control.action)"
          @click="handleControlClick(control.action)"
        >
          <svg v-if="control.action === 'zoom-in'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M15 15l-3-3M6.5 4v5M4 6.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-else-if="control.action === 'zoom-out'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M15 15l-3-3M4 6.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-else-if="control.action === 'auto-rotate'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2a6 6 0 0 1 5.3 3.1M14 8a6 6 0 0 1-2.7 5M8 14a6 6 0 0 1-5.3-3.1M2 8a6 6 0 0 1 2.7-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="m10 5 1-3 3 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="control.action === 'focus'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <svg v-else-if="control.action === 'reset'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2.5 8a5.5 5.5 0 0 1 11 0M14 8a5.5 5.5 0 0 1-11 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M13.5 5.5V8h-2.5M2.5 10.5V8h2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="control.action === 'toggle-quality'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M6 7l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="control.action === 'optimize-model'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L2 6l6 4 6-4-6-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M2 6l6 4v4l-6-4V6zM14 6l-6 4v4l6-4V6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <!-- 播放控制 -->
      <div class="playback-control">
        <div class="playback-button" @click="handlePlayback">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive, watch, type Ref } from 'vue';
import * as THREE from 'three';
import { useModelLoader, ModelFormat, type ModelConfig } from '@/composables/useModelLoader';
import { useCameraControls, type CameraPreset } from '@/composables/useCameraControls';
import { useAdvancedRenderer, RenderQuality } from '@/composables/useAdvancedRenderer';
import { useMaterialManager } from '@/composables/useMaterialManager';
import { useModelOptimizer } from '@/composables/useModelOptimizer';

// Props
interface Props {
  modelName?: string;
  currentView?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelName: '汽车发动机总成',
  currentView: '主视图'
});

// Emits
const emit = defineEmits<{
  componentSelect: [componentKey: string];
  viewChange: [view: string];
  controlClick: [control: string];
  playback: [];
}>();

// Types
interface ComponentData {
  name: string;
  status: string;
  torque: string;
  order: string;
}

interface ComponentLabel {
  name: string;
  position: {
    top: string;
    left: string;
  };
}

// Refs
const threeContainer = ref<HTMLDivElement | null>(null);
const cameraRef = ref<THREE.PerspectiveCamera | null>(null);
const rendererRef = ref<THREE.WebGLRenderer | null>(null);

// Three.js variables
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let raf = 0;
let currentModel: THREE.Object3D | null = null;

// 模型加载器
const { loadModel, loadingState, getModelBounds } = useModelLoader();

// 相机控制器
const {
  initControls,
  updateControls,
  setCameraPreset,
  focusOnObject,
  resetCamera,
  setAutoRotate,
  presets
} = useCameraControls(cameraRef, rendererRef);

// 高级渲染器
const {
  initRenderer: initAdvancedRenderer,
  render: renderAdvanced,
  setRenderQuality,
  renderStats,
  currentQuality,
  getRenderer
} = useAdvancedRenderer();

// 材质管理器
const {
  getMaterialPresets,
  applyMaterialPreset,
  highlightObject,
  removeHighlight
} = useMaterialManager();

// 模型优化器
const {
  optimizeModel,
  analyzeModelComplexity,
  generateOptimizationSuggestions,
  optimizationStats
} = useModelOptimizer();

// Data
const currentView = ref(props.currentView);
const selectedComponent = ref<ComponentData | null>(null);

const viewTypes = ['主视图', '侧视图', '顶视图', '正视图', '等轴视图'];

const controls = [
  { name: 'zoom-in', icon: 'ZoomInIcon', action: 'zoom-in' },
  { name: 'zoom-out', icon: 'ZoomOutIcon', action: 'zoom-out' },
  { name: 'rotate', icon: 'RotateIcon', action: 'auto-rotate' },
  { name: 'focus', icon: 'FocusIcon', action: 'focus' },
  { name: 'reset', icon: 'ResetIcon', action: 'reset' },
  { name: 'quality', icon: 'QualityIcon', action: 'toggle-quality' },
  { name: 'optimize', icon: 'OptimizeIcon', action: 'optimize-model' }
];

const componentLabels = reactive<Record<string, ComponentLabel>>({
  engine: {
    name: '发动机',
    position: { top: '20%', left: '30%' }
  },
  transmission: {
    name: '变速箱',
    position: { top: '40%', left: '60%' }
  },
  radiator: {
    name: '散热器',
    position: { top: '60%', left: '20%' }
  },
  battery: {
    name: '电池',
    position: { top: '30%', left: '70%' }
  },
  generator: {
    name: '发电机',
    position: { top: '50%', left: '40%' }
  }
});

const components = reactive({
  engine: {
    name: '发动机',
    status: '已安装',
    torque: '45 N·m',
    order: '第3步'
  },
  transmission: {
    name: '变速箱',
    status: '已安装',
    torque: '35 N·m',
    order: '第4步'
  },
  radiator: {
    name: '散热器',
    status: '已安装',
    torque: '25 N·m',
    order: '第2步'
  },
  battery: {
    name: '电池',
    status: '已安装',
    torque: '8 N·m',
    order: '第1步'
  },
  generator: {
    name: '发电机',
    status: '已安装',
    torque: '55 N·m',
    order: '第5步'
  }
});

// Three.js composable
const useThreeJS = (container: Ref<HTMLDivElement | null>) => {
  const resize = () => {
    if (!container.value || !renderer || !camera) return;
    const { clientWidth, clientHeight } = container.value;
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  };

  const initScene = () => {
    if (!container.value) return;
    
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    // 创建相机
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(5, 3, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.value = camera;

    // 初始化高级渲染器
    initAdvancedRenderer(container.value, scene, camera, RenderQuality.MEDIUM);
    renderer = getRenderer();
    rendererRef.value = renderer;

    // 初始化相机控制器
    initControls();

    // 添加光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.setScalar(2048);
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // 加载3D模型或创建简单的汽车模型
    loadCarModel();

    // 渲染循环
    const animate = () => {
      raf = requestAnimationFrame(animate);
      
      // 更新相机控制器
      updateControls();
      
      // 使用高级渲染器渲染
      renderAdvanced();
    };
    animate();
  };

  const loadCarModel = async () => {
    if (!scene) return;
    
    try {
      // 尝试加载高质量的3D模型
      const modelConfigs: ModelConfig[] = [
        {
          url: '/models/car-engine.glb',
          format: ModelFormat.GLB,
          scale: new THREE.Vector3(1, 1, 1),
          position: new THREE.Vector3(0, 0, 0),
          enableShadows: true
        }
      ];

      // 如果模型文件存在，加载真实模型
      try {
        const modelData = await loadModel(modelConfigs[0]);
        currentModel = modelData.object;
        scene.add(currentModel);
        
        // 自动调整相机位置
        const bounds = getModelBounds(currentModel);
        adjustCameraToModel(bounds);
        
      } catch (modelError) {
        console.warn('未找到3D模型文件，使用默认几何体模型:', modelError);
        // 如果没有模型文件，创建简单的几何体模型
        createDefaultCarModel();
      }
    } catch (error) {
      console.error('模型加载失败:', error);
      // 备用方案：创建简单模型
      createDefaultCarModel();
    }
  };

  const createDefaultCarModel = () => {
    if (!scene) return;
    
    const carGroup = new THREE.Group();
    
    // 车身 (主体)
    const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4dabf7 });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.set(0, 0.75, 0);
    bodyMesh.castShadow = true;
    carGroup.add(bodyMesh);
    
    // 发动机
    const engineGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
    const engineMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    const engineMesh = new THREE.Mesh(engineGeometry, engineMaterial);
    engineMesh.position.set(-1.8, 0.5, 0);
    engineMesh.castShadow = true;
    carGroup.add(engineMesh);
    
    // 变速箱
    const transmissionGeometry = new THREE.BoxGeometry(1, 0.8, 1);
    const transmissionMaterial = new THREE.MeshStandardMaterial({ color: 0x51cf66 });
    const transmissionMesh = new THREE.Mesh(transmissionGeometry, transmissionMaterial);
    transmissionMesh.position.set(0.5, 0.4, 0);
    transmissionMesh.castShadow = true;
    carGroup.add(transmissionMesh);
    
    // 电池
    const batteryGeometry = new THREE.BoxGeometry(0.6, 0.4, 1);
    const batteryMaterial = new THREE.MeshStandardMaterial({ color: 0x9775fa });
    const batteryMesh = new THREE.Mesh(batteryGeometry, batteryMaterial);
    batteryMesh.position.set(1.5, 0.2, -0.8);
    batteryMesh.castShadow = true;
    carGroup.add(batteryMesh);
    
    // 散热器
    const radiatorGeometry = new THREE.BoxGeometry(0.2, 1.5, 1.8);
    const radiatorMaterial = new THREE.MeshStandardMaterial({ color: 0xffd43b });
    const radiatorMesh = new THREE.Mesh(radiatorGeometry, radiatorMaterial);
    radiatorMesh.position.set(-2.8, 0.75, 0);
    radiatorMesh.castShadow = true;
    carGroup.add(radiatorMesh);
    
    // 添加地面
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.5;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
    
    scene.add(carGroup);
  };

  const adjustCameraToModel = (bounds: { box: THREE.Box3; center: THREE.Vector3; size: THREE.Vector3 }) => {
    if (!camera) return;
    
    const maxDimension = Math.max(bounds.size.x, bounds.size.y, bounds.size.z);
    const distance = maxDimension * 2;
    
    camera.position.set(
      bounds.center.x + distance * 0.7,
      bounds.center.y + distance * 0.5,
      bounds.center.z + distance * 0.7
    );
    camera.lookAt(bounds.center);
    camera.updateProjectionMatrix();
  };

  const cleanup = () => {
    if (raf) {
      cancelAnimationFrame(raf);
    }
    if (renderer) {
      renderer.dispose();
    }
    if (currentModel && scene) {
      scene.remove(currentModel);
      currentModel = null;
    }
  };

  return {
    initScene,
    resize,
    cleanup,
    loadCarModel
  };
};

// Methods
const { initScene, resize, cleanup, loadCarModel } = useThreeJS(threeContainer);

const handleComponentClick = (componentKey: string) => {
  selectedComponent.value = components[componentKey as keyof typeof components];
  emit('componentSelect', componentKey);
};

const handleViewChange = (view: string) => {
  currentView.value = view;
  
  // 根据视图名称设置相机预设
  const presetMap: Record<string, string> = {
    '主视图': 'default',
    '侧视图': 'left',
    '顶视图': 'top',
    '正视图': 'front',
    '后视图': 'back',
    '底视图': 'bottom',
    '等轴视图': 'isometric'
  };
  
  const presetName = presetMap[view] || 'default';
  setCameraPreset(presetName, 1000);
  
  emit('viewChange', view);
};

const handleControlClick = (control: string) => {
  switch (control) {
    case 'zoom-in':
      if (cameraRef.value) {
        const direction = cameraRef.value.position.clone().normalize();
        cameraRef.value.position.sub(direction.multiplyScalar(0.5));
      }
      break;
    case 'zoom-out':
      if (cameraRef.value) {
        const direction = cameraRef.value.position.clone().normalize();
        cameraRef.value.position.add(direction.multiplyScalar(0.5));
      }
      break;
    case 'auto-rotate':
      setAutoRotate(true, 2.0);
      setTimeout(() => setAutoRotate(false), 3000); // 3秒后停止
      break;
    case 'focus':
      if (currentModel) {
        focusOnObject(currentModel, 1000);
      }
      break;
    case 'reset':
      resetCamera(1000);
      break;
    case 'toggle-quality':
      toggleRenderQuality();
      break;
    case 'optimize-model':
      optimizeCurrentModel();
      break;
  }
  
  emit('controlClick', control);
};

const toggleRenderQuality = () => {
  const qualities = [RenderQuality.LOW, RenderQuality.MEDIUM, RenderQuality.HIGH, RenderQuality.ULTRA];
  const currentIndex = qualities.indexOf(currentQuality.value);
  const nextIndex = (currentIndex + 1) % qualities.length;
  setRenderQuality(qualities[nextIndex]);
};

const optimizeCurrentModel = () => {
  if (currentModel) {
    const optimized = optimizeModel(currentModel);
    if (scene) {
      scene.remove(currentModel);
      currentModel = optimized;
      scene.add(currentModel);
      
      // 应用默认材质
      applyMaterialPreset(currentModel, 'steel');
    }
  }
};

const getControlTitle = (action: string): string => {
  const titles: Record<string, string> = {
    'zoom-in': '放大',
    'zoom-out': '缩小',
    'auto-rotate': '自动旋转',
    'focus': '聚焦到模型',
    'reset': '重置视图',
    'toggle-quality': `切换画质 (当前: ${currentQuality.value})`,
    'optimize-model': '优化模型'
  };
  return titles[action] || action;
};

const handleRetry = async () => {
  loadingState.value.error = null;
  if (scene && currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }
  loadCarModel();
};

const handlePlayback = () => {
  emit('playback');
};

// 监听模型名称变化
watch(() => props.modelName, async () => {
  if (scene && currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }
  loadCarModel();
});

// Lifecycle
onMounted(() => {
  initScene();
  window.addEventListener('resize', resize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  cleanup();
});
</script>

<style scoped>
.threejs-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8fafb 0%, #e9f1f7 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.three-container {
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.component-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.component-label {
  position: absolute;
  pointer-events: auto;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.component-label::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #007bff, #0056b3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 
    0 0 10px rgba(0, 123, 255, 0.5),
    0 0 20px rgba(0, 123, 255, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}

.label-content {
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%);
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  color: #212529;
  border: 1px solid rgba(0, 123, 255, 0.2);
  backdrop-filter: blur(12px);
  box-shadow: 
    0 8px 16px rgba(0, 123, 255, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin-top: 24px;
  white-space: nowrap;
}

.label-content::after {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 16px;
  background: linear-gradient(to bottom, #007bff, transparent);
}

.component-label:hover .label-content {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 
    0 12px 24px rgba(0, 123, 255, 0.25),
    0 8px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.component-info {
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%);
  border-radius: 16px;
  padding: 20px;
  min-width: 240px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  z-index: 20;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.component-info:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 12px 20px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.component-info h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(45deg, #007bff, #6f42c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(233, 236, 239, 0.6);
  transition: all 0.3s;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item:hover {
  background: rgba(0, 123, 255, 0.05);
  margin: 0 -8px;
  padding: 8px;
  border-radius: 8px;
}

.info-item .label {
  color: #6c757d;
  font-weight: 500;
}

.info-item .value {
  color: #212529;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(108, 117, 125, 0.05));
  padding: 4px 8px;
  border-radius: 6px;
  backdrop-filter: blur(5px);
}

.view-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  z-index: 20;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.view-controls:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 12px 20px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.view-title {
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(45deg, #007bff, #6f42c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
}

.model-name {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 16px;
  font-style: italic;
}

.view-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.view-btn {
  padding: 8px 12px;
  border: 2px solid rgba(233, 236, 239, 0.8);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.8));
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn.active {
  background: linear-gradient(135deg, #007bff, #0056b3);
  border-color: rgba(0, 123, 255, 0.3);
  color: white;
  transform: scale(1.05);
  box-shadow: 
    0 8px 16px rgba(0, 123, 255, 0.25),
    0 4px 8px rgba(0, 123, 255, 0.15);
}

.view-btn:hover:not(.active) {
  border-color: #007bff;
  color: #007bff;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.05));
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 123, 255, 0.15);
}

.control-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 20;
}

.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(233, 236, 239, 0.8);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.8));
  border-radius: 12px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.control-btn:hover {
  border-color: #007bff;
  color: #007bff;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.05));
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 123, 255, 0.2);
}

.playback-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #28a745, #1e7e34);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 8px 16px rgba(40, 167, 69, 0.3),
    0 4px 8px rgba(40, 167, 69, 0.2);
  color: white;
}

.playback-button:hover {
  background: linear-gradient(135deg, #1e7e34, #155724);
  transform: scale(1.1);
  box-shadow: 
    0 12px 24px rgba(40, 167, 69, 0.4),
    0 8px 16px rgba(40, 167, 69, 0.3);
}

/* 加载状态样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(248, 249, 250, 0.98) 0%, rgba(233, 236, 239, 0.95) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(12px);
  border-radius: inherit;
}

.loading-content {
  text-align: center;
  max-width: 320px;
  padding: 32px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.8));
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.loading-spinner {
  width: 56px;
  height: 56px;
  border: 4px solid rgba(233, 236, 239, 0.8);
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-text {
  font-size: 18px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #007bff, #6f42c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(233, 236, 239, 0.8);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #28a745, #007bff);
  background-size: 200% 100%;
  animation: progressShimmer 2s ease-in-out infinite;
  transition: width 0.3s ease;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}

@keyframes progressShimmer {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.progress-text {
  font-size: 14px;
  color: #6c757d;
}

/* 错误状态样式 */
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(248, 249, 250, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.error-content {
  text-align: center;
  max-width: 300px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-text {
  font-size: 16px;
  color: #dc3545;
  margin-bottom: 20px;
  line-height: 1.4;
}

.retry-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #0056b3;
}

/* 渲染统计样式 */
.render-stats {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 8px;
  padding: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  min-width: 150px;
  backdrop-filter: blur(4px);
}

.stats-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #4fc3f7;
  text-align: center;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  color: #bbb;
}

.stat-value {
  color: #fff;
  font-weight: 500;
}
</style>