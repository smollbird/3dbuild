<template>
  <div class="viewer-container">
    <!-- 顶部导航栏 -->
    <header class="top-nav">
      <div class="nav-left">
        <div class="logo">
          <div class="logo-icon"></div>
          <span class="logo-text">3D拆解系统</span>
        </div>
        <nav class="nav-menu">
          <button class="nav-btn">文件</button>
          <button class="nav-btn">编辑</button>
          <button class="nav-btn">视图</button>
          <button class="nav-btn">模型</button>
          <button class="nav-btn">拆解</button>
          <button class="nav-btn">工具</button>
          <button class="nav-btn">培训</button>
          <button class="nav-btn">帮助</button>
        </nav>
      </div>
      <div class="nav-center">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="搜索模型、工具或教程..." 
            class="search-input"
          />
          <button class="search-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667zM14 14l-2.9-2.9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="nav-right">
        <button class="user-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.333 14v-1.333A2.667 2.667 0 0 0 10.667 10H5.333a2.667 2.667 0 0 0-2.667 2.667V14M8 7.333A2.667 2.667 0 1 0 8 2a2.667 2.667 0 0 0 0 5.333z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>用户</span>
        </button>
      </div>
    </header>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="tool-group">
          <button class="tool-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 2H2v12h12V2z" stroke="currentColor" stroke-width="2"/>
              <path d="M8 6v4m-4-2h8" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>导入</span>
          </button>
          <button class="tool-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 2H6v12h4V2z" stroke="currentColor" stroke-width="2"/>
              <path d="M4 5h8M4 8h8M4 11h8" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>保存</span>
          </button>
          <button class="tool-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12m4-8l-4 4-4-4" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>导出</span>
          </button>
        </div>
        <div class="tool-group">
          <button class="tool-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2v12h12V2H2z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <button class="tool-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12m-6-6h12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <button class="tool-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M2 14L14 2" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div class="tool-group">
          <button class="tool-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h12v12H2V2z" stroke="currentColor" stroke-width="2"/>
              <path d="M6 6h4v4H6V6z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>全屏</span>
          </button>
          <button class="tool-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8h2M2 8h2M8 2v2M8 12v2" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>设置</span>
          </button>
        </div>
      </div>
      <div class="toolbar-right">
        <div class="auto-mode">
          <div class="mode-controls">
            <button class="mode-btn active">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button class="mode-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12m-6-6h12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          <span class="mode-text">自动拆解模式</span>
          <button class="help-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
              <path d="M6 6a2 2 0 0 1 4 0c0 1-2 1.5-2 2.5M8 11h.01" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>帮助</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 3D视图区域 -->
      <div class="viewer-area">
        <div class="model-container">
          <!-- 3D模型将在这里渲染 -->
          <div ref="threeContainer" class="three-container"></div>
          
          <!-- 模型组件标签 -->
          <div class="component-labels">
            <div class="component-label" style="top: 20%; left: 30%;" @click="selectComponent('engine')">
              <div class="label-content">发动机</div>
            </div>
            <div class="component-label" style="top: 40%; left: 60%;" @click="selectComponent('transmission')">
              <div class="label-content">变速箱</div>
            </div>
            <div class="component-label" style="top: 60%; left: 20%;" @click="selectComponent('radiator')">
              <div class="label-content">散热器</div>
            </div>
            <div class="component-label" style="top: 30%; left: 70%;" @click="selectComponent('battery')">
              <div class="label-content">电池</div>
            </div>
            <div class="component-label" style="top: 50%; left: 40%;" @click="selectComponent('generator')">
              <div class="label-content">发电机</div>
            </div>
          </div>

          <!-- 选中组件信息 -->
          <div class="component-info" v-if="selectedComponent">
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
        </div>

        <!-- 视图控制 -->
        <div class="view-controls">
          <div class="view-title">3D 模型视图</div>
          <div class="model-name">汽车发动机总成</div>
          <div class="view-buttons">
            <button class="view-btn active">主视图</button>
            <button class="view-btn">侧视图</button>
            <button class="view-btn">顶视图</button>
          </div>
        </div>

        <!-- 控制面板 -->
        <div class="control-panel">
          <div class="control-buttons">
            <button class="control-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12m-6-6h12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button class="control-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h12M6 4l4 4-4 4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button class="control-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2h12v12H2V2z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button class="control-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button class="control-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M2 14L14 2" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 播放控制 -->
        <div class="playback-control">
          <div class="playback-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <!-- 拆解流程 -->
        <div class="process-panel">
          <div class="panel-header">
            <h3>拆解流程</h3>
            <div class="step-indicator">步骤 {{ currentStep }} / {{ totalSteps }}</div>
          </div>
          
          <div class="progress-section">
            <div class="progress-info">
              <span class="progress-label">完成进度</span>
              <span class="progress-value">{{ progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
          </div>

          <div class="steps-list">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              class="step-item"
              :class="{ active: index === currentStep - 1, completed: index < currentStep - 1 }"
            >
              <div class="step-header">
                <div class="step-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
                    <path d="M6 8l2 2 4-4" stroke="currentColor" stroke-width="2" v-if="index < currentStep - 1"/>
                  </svg>
                </div>
                <div class="step-content">
                  <div class="step-title-row">
                    <h4>{{ step.title }}</h4>
                    <div class="risk-badge" :class="step.risk">{{ getRiskText(step.risk) }}</div>
                  </div>
                  <p class="step-description">{{ step.description }}</p>
                </div>
              </div>
              
              <div class="step-details">
                <div class="detail-row">
                  <span class="detail-label">扭矩</span>
                  <span class="detail-value">{{ step.torque }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">工具</span>
                  <div class="tool-info">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M8 2L2 8l2 2 6-6-2-2z" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    <span>{{ step.tool }}</span>
                  </div>
                </div>
                <div class="detail-row">
                  <span class="detail-label">耗时</span>
                  <span class="detail-value">{{ step.duration }}</span>
                </div>
              </div>
              
              <div class="step-highlight" v-if="index === currentStep - 1"></div>
            </div>
          </div>

          <div class="process-controls">
            <button class="process-btn pause"></button>
            <button class="process-btn play"></button>
            <button class="process-btn-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
                <path d="M6 6a2 2 0 0 1 4 0c0 1-2 1.5-2 2.5M8 11h.01" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 工具选择 -->
        <div class="tool-panel">
          <div class="panel-header">
            <div class="header-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L2 8l2 2 6-6-2-2z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3>工具选择</h3>
            <div class="recommendation-badge">当前步骤推荐</div>
          </div>

          <!-- 推荐工具 -->
          <div class="recommended-tool">
            <div class="tool-header">
              <div class="recommendation-indicator">推荐工具</div>
            </div>
            <div class="tool-card recommended">
              <div class="tool-info-row">
                <div class="tool-icon">🔧</div>
                <div class="tool-details">
                  <h4>十字螺丝刀</h4>
                  <p>PH2 × 150mm</p>
                </div>
                <div class="best-match-badge">最佳匹配</div>
              </div>
              <div class="tool-specs">
                扭矩范围: 8-15 N·m | 当前设置: 12 N·m
              </div>
              <button class="select-tool-btn">选择使用</button>
            </div>
          </div>

          <!-- 所有工具 -->
          <div class="all-tools">
            <div class="tools-header">所有工具</div>
            <div class="tools-list">
              <div class="tool-card" v-for="tool in availableTools" :key="tool.id">
                <div class="tool-info-row">
                  <div class="tool-icon">{{ tool.icon }}</div>
                  <div class="tool-details">
                    <h4>{{ tool.name }}</h4>
                    <p>{{ tool.spec }}</p>
                  </div>
                  <div class="tool-badges">
                    <div class="badge recommended" v-if="tool.recommended">推荐</div>
                    <div class="badge" :class="tool.status">{{ tool.statusText }}</div>
                  </div>
                </div>
                <div class="tool-specifications">
                  <div class="spec-row" v-for="spec in tool.specifications" :key="spec.label">
                    <span class="spec-label">{{ spec.label }}:</span>
                    <span class="spec-value">{{ spec.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue';
import * as THREE from 'three';

// 类型定义
interface ComponentData {
  name: string;
  status: string;
  torque: string;
  order: string;
}

interface StepData {
  title: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  torque: string;
  tool: string;
  duration: string;
}

interface ToolData {
  id: number;
  name: string;
  spec: string;
  icon: string;
  recommended: boolean;
  status: string;
  statusText: string;
  specifications: Array<{
    label: string;
    value: string;
  }>;
}

// refs
const threeContainer = ref<HTMLDivElement | null>(null);

// Three.js variables
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let raf = 0;

// 响应式数据
const selectedComponent = ref<ComponentData | null>(null);
const currentStep = ref(2);
const totalSteps = ref(5);
const progress = ref(40);

// 拆解步骤数据
const steps = ref<StepData[]>([
  {
    title: '1. 断开电池连接',
    description: '先断开负极，再断开正极',
    risk: 'low',
    torque: '8 N·m',
    tool: '扳手',
    duration: '2分钟'
  },
  {
    title: '2. 拆卸进气管',
    description: '松开夹具，小心拆下进气管',
    risk: 'medium',
    torque: '12 N·m',
    tool: '十字螺丝刀',
    duration: '5分钟'
  },
  {
    title: '3. 拆除冷却液管路',
    description: '排空冷却液后拆除管路',
    risk: 'high',
    torque: '15 N·m',
    tool: '管路钳',
    duration: '8分钟'
  },
  {
    title: '4. 拆卸发动机支架',
    description: '按指定顺序拆卸支架螺栓',
    risk: 'high',
    torque: '85 N·m',
    tool: '扭力扳手',
    duration: '15分钟'
  },
  {
    title: '5. 起吊发动机',
    description: '使用起重设备安全起吊',
    risk: 'high',
    torque: '--',
    tool: '起重机',
    duration: '10分钟'
  }
]);

// 可用工具数据
const availableTools = ref<ToolData[]>([
  {
    id: 1,
    name: '十字螺丝刀',
    spec: 'PH2 × 150mm',
    icon: '🔧',
    recommended: true,
    status: 'available',
    statusText: '可用',
    specifications: [
      { label: '规格', value: 'PH2' },
      { label: '长度', value: '150mm' },
      { label: '扭矩', value: '8-15 N·m' }
    ]
  },
  {
    id: 2,
    name: '组合扳手',
    spec: '13mm',
    icon: '🔨',
    recommended: false,
    status: 'available',
    statusText: '可用',
    specifications: [
      { label: '规格', value: '13mm' },
      { label: '类型', value: '开口+梅花' },
      { label: '扭矩', value: '20-50 N·m' }
    ]
  },
  {
    id: 3,
    name: '扭力扳手',
    spec: '10-100 N·m',
    icon: '⚙️',
    recommended: false,
    status: 'unavailable',
    statusText: '不可用',
    specifications: [
      { label: '范围', value: '10-100 N·m' },
      { label: '精度', value: '±4%' },
      { label: '类型', value: '数字显示' }
    ]
  }
]);

// 组件数据
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

// 方法
function resize() {
  if (!threeContainer.value || !renderer || !camera) return;
  const { clientWidth, clientHeight } = threeContainer.value;
  renderer.setSize(clientWidth, clientHeight);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
}

function selectComponent(componentKey: keyof typeof components) {
  selectedComponent.value = components[componentKey];
}

function getRiskText(risk: 'low' | 'medium' | 'high') {
  const riskMap: Record<'low' | 'medium' | 'high', string> = {
    'low': '低风险',
    'medium': '中风险',
    'high': '高风险'
  };
  return riskMap[risk];
}

// 初始化Three.js场景
function initThreeJS() {
  if (!threeContainer.value) return;
  
  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);

  // 创建相机
  camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.set(5, 3, 8);
  camera.lookAt(0, 0, 0);

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  threeContainer.value.appendChild(renderer.domElement);
  resize();

  // 添加光照
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // 创建简单的汽车模型
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

  // 渲染循环
  function animate() {
    raf = requestAnimationFrame(animate);
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
  animate();
}

// 生命周期
onMounted(() => {
  initThreeJS();
  window.addEventListener('resize', resize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  if (raf) {
    cancelAnimationFrame(raf);
  }
  if (renderer) {
    renderer.dispose();
  }
});
</script>

<style scoped>
.viewer-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  height: 56px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 24px;
  height: 24px;
  background: #007bff;
  border-radius: 4px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
}

.nav-menu {
  display: flex;
  gap: 4px;
}

.nav-btn {
  padding: 6px 12px;
  border: none;
  background: none;
  border-radius: 4px;
  font-size: 14px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #f8f9fa;
  color: #212529;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 400px;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 8px 40px 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
}

.nav-right {
  display: flex;
  align-items: center;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 14px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
}

.user-btn:hover {
  background: #f8f9fa;
  color: #212529;
}

/* 工具栏 */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tool-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #dee2e6;
}

.tool-btn:hover {
  background: #f8f9fa;
  color: #212529;
}

.tool-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 6px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #dee2e6;
}

.tool-icon-btn:hover {
  background: #f8f9fa;
  color: #212529;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.auto-mode {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.mode-controls {
  display: flex;
  gap: 4px;
}

.mode-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 6px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn.active {
  background: #007bff;
  color: white;
}

.mode-text {
  font-size: 14px;
  font-weight: 500;
  color: #212529;
}

.help-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 14px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
}

.help-btn:hover {
  background: white;
  color: #212529;
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 3D视图区域 */
.viewer-area {
  flex: 1;
  position: relative;
  background: #f8f9fa;
  margin: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.model-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.three-container {
  width: 100%;
  height: 100%;
}

.component-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.component-label {
  position: absolute;
  pointer-events: auto;
  cursor: pointer;
}

.label-content {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #212529;
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  transition: all 0.2s;
}

.component-label:hover .label-content {
  background: rgba(255, 255, 255, 0.95);
  transform: scale(1.05);
}

.component-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 16px;
  min-width: 200px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.component-info h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.info-item .label {
  color: #6c757d;
}

.info-item .value {
  color: #212529;
  font-weight: 500;
}

.view-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.view-title {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 8px;
}

.model-name {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 12px;
}

.view-buttons {
  display: flex;
  gap: 4px;
}

.view-btn {
  padding: 6px 12px;
  border: none;
  background: white;
  border-radius: 6px;
  font-size: 12px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #dee2e6;
}

.view-btn.active {
  background: #51cf66;
  color: white;
  border-color: #51cf66;
}

.view-btn:hover:not(.active) {
  background: #f8f9fa;
  color: #212529;
}

.control-panel {
  position: absolute;
  bottom: 80px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 12px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 6px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #dee2e6;
}

.control-btn:hover {
  background: #f8f9fa;
  color: #212529;
}

.playback-control {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.playback-control:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

/* 右侧面板 */
.right-panel {
  width: 360px;
  background: white;
  border-left: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.process-panel {
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f8f9fa;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
}

.step-indicator {
  padding: 4px 8px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #856404;
}

.progress-section {
  padding: 16px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 14px;
  color: #6c757d;
}

.progress-value {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
}

.progress-bar {
  height: 6px;
  background: #f8f9fa;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #51cf66);
  transition: width 0.3s ease;
}

.steps-list {
  padding: 0 16px 16px;
}

.step-item {
  position: relative;
  margin-bottom: 16px;
  border: 1px solid #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s;
}

.step-item.active {
  border-color: #007bff;
  background: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);
}

.step-item.completed {
  background: #f8f9fa;
  border-color: #51cf66;
}

.step-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.step-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.step-content {
  flex: 1;
}

.step-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.step-title-row h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #212529;
}

.risk-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
}

.risk-badge.low {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.risk-badge.medium {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.risk-badge.high {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f1aeb5;
}

.step-description {
  margin: 0;
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
}

.step-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f8f9fa;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.detail-label {
  color: #6c757d;
}

.detail-value {
  color: #212529;
  font-weight: 500;
}

.tool-info {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #212529;
  font-weight: 500;
}

.step-highlight {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #007bff;
  border-radius: 0 3px 3px 0;
}

.process-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #f8f9fa;
}

.process-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.process-btn.pause {
  background: #007bff;
}

.process-btn.play {
  background: #51cf66;
}

.process-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #007bff;
  background: white;
  border-radius: 6px;
  color: #007bff;
  cursor: pointer;
  transition: all 0.2s;
}

.process-btn-primary:hover {
  background: #007bff;
  color: white;
}

/* 工具面板 */
.tool-panel {
  flex: 1;
  overflow: auto;
}

.tool-panel .panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  color: #6c757d;
}

.recommendation-badge {
  padding: 2px 6px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  color: #856404;
}

.recommended-tool {
  padding: 16px;
  border-bottom: 1px solid #f8f9fa;
}

.tool-header {
  margin-bottom: 12px;
}

.recommendation-indicator {
  display: inline-block;
  padding: 4px 8px;
  background: #007bff;
  color: white;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
}

.tool-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  transition: all 0.2s;
}

.tool-card.recommended {
  border-color: #007bff;
  background: #f8f9fa;
}

.tool-card:hover {
  border-color: #007bff;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);
}

.tool-info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.tool-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.tool-details {
  flex: 1;
}

.tool-details h4 {
  margin: 0 0 2px 0;
  font-size: 14px;
  font-weight: 600;
  color: #212529;
}

.tool-details p {
  margin: 0;
  font-size: 12px;
  color: #6c757d;
}

.best-match-badge {
  padding: 2px 6px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  color: #155724;
}

.tool-badges {
  display: flex;
  gap: 4px;
}

.badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.badge.recommended {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.badge.available {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.badge.unavailable {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f1aeb5;
}

.tool-specs {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 8px;
}

.select-tool-btn {
  width: 100%;
  padding: 6px 12px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.select-tool-btn:hover {
  background: #0056b3;
}

.all-tools {
  padding: 16px;
}

.tools-header {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 12px;
}

.tools-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-specifications {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f8f9fa;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.spec-label {
  color: #6c757d;
}

.spec-value {
  color: #212529;
  font-weight: 500;
}
</style>
