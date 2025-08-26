import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as THREE from 'three';
import { api, type Vehicle, type Component, type Part } from '@/services/api';

// 应用状态接口
export interface AppState {
  // 用户界面状态
  isLoading: boolean;
  selectedComponent: string | null;
  currentView: string;
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  searchQuery: string;
  
  // 3D场景状态
  currentModel: THREE.Object3D | null;
  renderQuality: string;
  showStats: boolean;
  enableShadows: boolean;
  
  // 数据状态
  vehicles: any[];
  components: any[];
  parts: any[];
  currentVehicle: any | null;
  
  // 错误状态
  error: string | null;
}

/**
 * 应用主状态管理 Store
 */
export const useAppStore = defineStore('app', () => {
  // === 基础状态 ===
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref('');

  // === UI 状态 ===
  const selectedComponent = ref<string | null>(null);
  const currentView = ref('主视图');
  const currentStep = ref(2);
  const totalSteps = ref(5);
  const isPlaying = ref(false);
  const showSidebar = ref(true);
  const sidebarWidth = ref(320);

  // === 3D 场景状态 ===
  const currentModel = ref<THREE.Object3D | null>(null);
  const renderQuality = ref('medium');
  const showStats = ref(true);
  const enableShadows = ref(true);
  const autoRotate = ref(false);
  const cameraPreset = ref('default');

  // === 数据状态 ===
  const vehicles = ref<Vehicle[]>([]);
  const components = ref<Component[]>([]);
  const parts = ref<Part[]>([]);
  const currentVehicle = ref<Vehicle | null>(null);

  // === 工具和材质状态 ===
  const selectedTool = ref<any | null>(null);
  const appliedMaterial = ref('steel');
  const highlightedObjects = ref<Set<string>>(new Set());

  // === 计算属性 ===
  const progress = computed(() => {
    return Math.round((currentStep.value / totalSteps.value) * 100);
  });

  const hasData = computed(() => {
    return vehicles.value.length > 0;
  });

  const isReady = computed(() => {
    return !isLoading.value && !error.value && hasData.value;
  });

  const currentComponentData = computed(() => {
    if (!selectedComponent.value) return null;
    return components.value.find(comp => comp.id === selectedComponent.value);
  });

  // === Actions ===

  /**
   * 设置加载状态
   */
  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
    if (loading) {
      error.value = null;
    }
  };

  /**
   * 设置错误状态
   */
  const setError = (errorMessage: string | null) => {
    error.value = errorMessage;
    isLoading.value = false;
  };

  /**
   * 清除错误
   */
  const clearError = () => {
    error.value = null;
  };

  /**
   * 设置搜索查询
   */
  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  /**
   * 选择组件
   */
  const selectComponent = (componentId: string | null) => {
    selectedComponent.value = componentId;
    
    // 如果选择了组件，加载对应的零件
    if (componentId) {
      loadComponentParts(componentId);
    }
  };

  /**
   * 设置当前视图
   */
  const setCurrentView = (view: string) => {
    currentView.value = view;
  };

  /**
   * 设置当前步骤
   */
  const setCurrentStep = (step: number) => {
    if (step >= 1 && step <= totalSteps.value) {
      currentStep.value = step;
    }
  };

  /**
   * 下一步
   */
  const nextStep = () => {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++;
    }
  };

  /**
   * 上一步
   */
  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  };

  /**
   * 设置播放状态
   */
  const setPlaying = (playing: boolean) => {
    isPlaying.value = playing;
  };

  /**
   * 切换播放状态
   */
  const togglePlaying = () => {
    isPlaying.value = !isPlaying.value;
  };

  /**
   * 设置当前模型
   */
  const setCurrentModel = (model: THREE.Object3D | null) => {
    currentModel.value = model;
  };

  /**
   * 设置渲染质量
   */
  const setRenderQuality = (quality: string) => {
    renderQuality.value = quality;
  };

  /**
   * 切换统计显示
   */
  const toggleStats = () => {
    showStats.value = !showStats.value;
  };

  /**
   * 切换阴影
   */
  const toggleShadows = () => {
    enableShadows.value = !enableShadows.value;
  };

  /**
   * 设置相机预设
   */
  const setCameraPreset = (preset: string) => {
    cameraPreset.value = preset;
  };

  /**
   * 加载车辆数据
   */
  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.vehicle.getAll();
      if (response.success) {
        vehicles.value = response.data;
        
        // 如果有车辆数据，设置第一个为当前车辆
        if (vehicles.value.length > 0) {
          await setCurrentVehicle(vehicles.value[0]);
        }
      } else {
        throw new Error(response.error || '获取车辆数据失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取车辆数据失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 加载车辆组件
   */
  const loadVehicleComponents = async (vehicleId: number) => {
    try {
      const response = await api.component.getByVehicleId(vehicleId);
      if (response.success) {
        components.value = response.data;
      } else {
        throw new Error(response.error || '获取组件数据失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取组件数据失败');
    }
  };

  /**
   * 加载组件零件
   */
  const loadComponentParts = async (componentId: number) => {
    try {
      const response = await api.part.getByComponentId(componentId);
      if (response.success) {
        parts.value = response.data;
      } else {
        console.warn('获取零件数据失败:', response.error);
      }
    } catch (err) {
      console.warn('加载零件数据失败:', err);
      // 不设置错误状态，因为这不是关键操作
    }
  };

  /**
   * 设置当前车辆
   */
  const setCurrentVehicle = async (vehicle: Vehicle) => {
    currentVehicle.value = vehicle;
    await loadVehicleComponents(vehicle.id);
  };

  /**
   * 选择工具
   */
  const selectTool = (tool: any) => {
    selectedTool.value = tool;
  };

  /**
   * 应用材质
   */
  const applyMaterial = (materialName: string) => {
    appliedMaterial.value = materialName;
  };

  /**
   * 高亮对象
   */
  const highlightObject = (objectId: string) => {
    highlightedObjects.value.add(objectId);
  };

  /**
   * 取消高亮对象
   */
  const unhighlightObject = (objectId: string) => {
    highlightedObjects.value.delete(objectId);
  };

  /**
   * 清除所有高亮
   */
  const clearHighlights = () => {
    highlightedObjects.value.clear();
  };

  /**
   * 切换侧边栏
   */
  const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value;
  };

  /**
   * 设置侧边栏宽度
   */
  const setSidebarWidth = (width: number) => {
    sidebarWidth.value = Math.max(200, Math.min(500, width));
  };

  /**
   * 重置应用状态
   */
  const resetState = () => {
    selectedComponent.value = null;
    currentView.value = '主视图';
    currentStep.value = 1;
    isPlaying.value = false;
    selectedTool.value = null;
    appliedMaterial.value = 'steel';
    highlightedObjects.value.clear();
    searchQuery.value = '';
    error.value = null;
  };

  /**
   * 初始化应用
   */
  const initializeApp = async () => {
    await loadVehicles();
  };

  return {
    // === 状态 ===
    isLoading,
    error,
    searchQuery,
    selectedComponent,
    currentView,
    currentStep,
    totalSteps,
    isPlaying,
    showSidebar,
    sidebarWidth,
    currentModel,
    renderQuality,
    showStats,
    enableShadows,
    autoRotate,
    cameraPreset,
    vehicles,
    components,
    parts,
    currentVehicle,
    selectedTool,
    appliedMaterial,
    highlightedObjects,

    // === 计算属性 ===
    progress,
    hasData,
    isReady,
    currentComponentData,

    // === Actions ===
    setLoading,
    setError,
    clearError,
    setSearchQuery,
    selectComponent,
    setCurrentView,
    setCurrentStep,
    nextStep,
    previousStep,
    setPlaying,
    togglePlaying,
    setCurrentModel,
    setRenderQuality,
    toggleStats,
    toggleShadows,
    setCameraPreset,
    loadVehicles,
    loadVehicleComponents,
    loadComponentParts,
    setCurrentVehicle,
    selectTool,
    applyMaterial,
    highlightObject,
    unhighlightObject,
    clearHighlights,
    toggleSidebar,
    setSidebarWidth,
    resetState,
    initializeApp
  };
});