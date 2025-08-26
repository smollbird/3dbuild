<template>
  <div class="right-panel">
    <!-- 组件信息面板 -->
    <div v-if="currentComponentData" class="panel-section component-info-panel">
      <div class="panel-header">
        <h3>组件信息</h3>
      </div>
      <div class="component-details">
        <div class="detail-item">
          <span class="label">名称:</span>
          <span class="value">{{ currentComponentData.name }}</span>
        </div>
        <div class="detail-item">
          <span class="label">ID:</span>
          <span class="value">{{ currentComponentData.id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">零件数量:</span>
          <span class="value">{{ parts.length }}</span>
        </div>
        <div class="detail-item">
          <span class="label">创建时间:</span>
          <span class="value">{{ new Date(currentComponentData.createdAt).toLocaleDateString() }}</span>
        </div>
      </div>
    </div>

    <!-- 组件列表 -->
    <div class="panel-section component-list-panel">
      <div class="panel-header">
        <h3>组件列表</h3>
      </div>
      <div class="component-list">
        <div 
          v-for="component in components" 
          :key="component.id"
          class="component-item"
          :class="{ active: selectedComponent === component.id.toString() }"
          @click="handleComponentSelect(component.id.toString())"
        >
          <div class="component-name">{{ component.name }}</div>
          <div class="component-meta">ID: {{ component.id }}</div>
        </div>
        <div v-if="components.length === 0" class="empty-state">
          暂无组件数据
        </div>
      </div>
    </div>

    <!-- 拆解流程 -->
    <div class="panel-section">
      <DisassemblyProcess
        :current-step="currentStep"
        :total-steps="totalSteps"
        :is-playing="isPlaying"
        @step-click="handleStepClick"
        @play="handlePlay"
        @pause="handlePause"
        @help="handleProcessHelp"
      />
    </div>

    <!-- 工具选择 -->
    <div class="panel-section">
      <ToolSelection
        :current-step="currentStep"
        @tool-select="handleToolSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DisassemblyProcess from '../viewer/DisassemblyProcess.vue';
import ToolSelection from '../viewer/ToolSelection.vue';
import { useAppStore } from '@/stores/useAppStore';

// Props
interface Props {
  currentStep?: number;
  totalSteps?: number;
  isPlaying?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currentStep: 2,
  totalSteps: 5,
  isPlaying: false
});

// Emits
const emit = defineEmits<{
  stepClick: [stepIndex: number];
  play: [];
  pause: [];
  processHelp: [];
  toolSelect: [tool: any];
}>();

// Store
const appStore = useAppStore();

// Data
const currentStep = computed(() => appStore.currentStep);
const totalSteps = computed(() => appStore.totalSteps);
const isPlaying = computed(() => appStore.isPlaying);
const selectedComponent = computed(() => appStore.selectedComponent);
const components = computed(() => appStore.components);
const parts = computed(() => appStore.parts);

// 当前组件数据
const currentComponentData = computed(() => {
  if (!selectedComponent.value) return null;
  return components.value.find(comp => comp.id.toString() === selectedComponent.value);
});

// Methods
const handleStepClick = (stepIndex: number) => {
  appStore.setCurrentStep(stepIndex + 1);
  emit('stepClick', stepIndex);
};

const handlePlay = () => {
  appStore.setPlaying(true);
  emit('play');
};

const handlePause = () => {
  appStore.setPlaying(false);
  emit('pause');
};

const handleProcessHelp = () => {
  emit('processHelp');
};

const handleToolSelect = (tool: any) => {
  appStore.selectTool(tool);
  emit('toolSelect', tool);
};

const handleComponentSelect = (componentId: string) => {
  appStore.selectComponent(componentId);
};
</script>

<style scoped>
.right-panel {
  width: 350px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.right-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(0, 123, 255, 0.02) 0%, 
    rgba(108, 117, 125, 0.01) 50%, 
    transparent 100%);
  pointer-events: none;
  z-index: 0;
}

.panel-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.06),
    0 2px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  overflow: hidden;
  position: relative;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-section:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 24px rgba(0, 0, 0, 0.08),
    0 4px 8px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

.panel-section:first-child {
  flex: 1.3;
}

.panel-section:last-child {
  flex: 1.2;
}

.panel-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.08) 0%, rgba(0, 123, 255, 0.04) 100%);
  border-bottom: 1px solid rgba(233, 236, 239, 0.8);
  position: relative;
}

.panel-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(0, 123, 255, 0.3) 20%, 
    rgba(0, 123, 255, 0.5) 50%, 
    rgba(0, 123, 255, 0.3) 80%, 
    transparent 100%);
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  background: linear-gradient(45deg, #007bff, #6f42c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 组件信息面板 */
.component-info-panel {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
  border: 1px solid rgba(219, 234, 254, 0.8);
  overflow: hidden;
}

.component-details {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(248, 249, 250, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.detail-item::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(135deg, #007bff, #6f42c1);
  transform: scaleY(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-item:hover::before {
  transform: scaleY(1);
}

.detail-item:hover {
  background: rgba(0, 123, 255, 0.02);
  transform: translateX(4px);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  font-size: 14px;
  font-weight: 500;
  color: #6c757d;
  min-width: 60px;
}

.detail-item .value {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(108, 117, 125, 0.05));
  padding: 4px 8px;
  border-radius: 6px;
  backdrop-filter: blur(5px);
}

/* 组件列表面板 */
.component-list-panel {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(252, 248, 255, 0.9) 100%);
  border: 1px solid rgba(237, 233, 254, 0.8);
}

.component-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.component-item {
  padding: 16px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.8) 100%);
  border: 1px solid rgba(233, 236, 239, 0.6);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.component-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(0, 123, 255, 0.1), 
    transparent);
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.component-item:hover::before {
  left: 100%;
}

.component-item:hover {
  transform: translateY(-2px) scale(1.02);
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border-color: rgba(0, 123, 255, 0.3);
  box-shadow: 
    0 8px 16px rgba(0, 123, 255, 0.25),
    0 4px 8px rgba(0, 123, 255, 0.15);
}

.component-item.active {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
  border-color: rgba(40, 167, 69, 0.3);
  box-shadow: 
    0 8px 16px rgba(40, 167, 69, 0.25),
    0 4px 8px rgba(40, 167, 69, 0.15);
  transform: scale(1.02);
}

.component-item.active::after {
  content: '✓';
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.component-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  transition: color 0.3s;
}

.component-meta {
  font-size: 12px;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.component-item:hover .component-name,
.component-item:hover .component-meta {
  color: white;
}

.component-item.active .component-name,
.component-item.active .component-meta {
  color: white;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  font-style: italic;
  background: rgba(248, 249, 250, 0.5);
  border-radius: 8px;
  margin: 20px;
}

.empty-state::before {
  content: '📦';
  display: block;
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.6;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .right-panel {
    width: 100%;
    max-width: none;
    flex-direction: row;
    gap: 16px;
    padding: 16px;
    height: auto;
    min-height: 200px;
  }
  
  .panel-section {
    flex: 1;
    min-height: 180px;
  }
  
  .component-list {
    max-height: 150px;
  }
}

@media (max-width: 768px) {
  .right-panel {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    width: 100%;
  }
  
  .panel-section {
    min-height: 120px;
  }
  
  .panel-header {
    padding: 12px 16px;
  }
  
  .panel-header h3 {
    font-size: 14px;
  }
  
  .component-details {
    padding: 16px;
  }
  
  .detail-item {
    padding: 8px 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .component-item {
    padding: 12px;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .right-panel {
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(17, 24, 39, 0.9) 100%);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .right-panel::before {
    background: linear-gradient(135deg, 
      rgba(96, 165, 250, 0.05) 0%, 
      rgba(139, 92, 246, 0.02) 50%, 
      transparent 100%);
  }
  
  .panel-section {
    background: rgba(55, 65, 81, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 8px 16px rgba(0, 0, 0, 0.2),
      0 2px 4px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .panel-header {
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(96, 165, 250, 0.08) 100%);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .panel-header h3 {
    color: #f3f4f6;
  }
  
  .detail-item .label {
    color: #9ca3af;
  }
  
  .detail-item .value {
    color: #f3f4f6;
    background: rgba(96, 165, 250, 0.2);
  }
  
  .component-item {
    background: linear-gradient(135deg, rgba(75, 85, 99, 0.9) 0%, rgba(55, 65, 81, 0.8) 100%);
    border-color: rgba(255, 255, 255, 0.1);
    color: #d1d5db;
  }
  
  .component-item:hover {
    background: linear-gradient(135deg, #60a5fa, #3b82f6);
    color: white;
  }
  
  .component-item.active {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
  }
  
  .empty-state {
    color: #9ca3af;
    background: rgba(55, 65, 81, 0.5);
  }
}

/* 动画效果 */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.right-panel {
  animation: slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-section {
  animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-section:nth-child(2) {
  animation-delay: 0.1s;
}

.panel-section:nth-child(3) {
  animation-delay: 0.2s;
}

.component-item {
  animation: slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.component-item:nth-child(2) {
  animation-delay: 0.1s;
}

.component-item:nth-child(3) {
  animation-delay: 0.2s;
}

.component-item:nth-child(4) {
  animation-delay: 0.3s;
}

/* 可访问性优化 */
@media (prefers-reduced-motion: reduce) {
  .right-panel,
  .panel-section,
  .component-item {
    animation: none;
    transition: none;
  }
  
  .panel-section:hover,
  .component-item:hover {
    transform: none;
  }
}

/* 滚动条样式 */
.component-list::-webkit-scrollbar,
.component-details::-webkit-scrollbar {
  width: 6px;
}

.component-list::-webkit-scrollbar-track,
.component-details::-webkit-scrollbar-track {
  background: rgba(248, 249, 250, 0.5);
  border-radius: 3px;
}

.component-list::-webkit-scrollbar-thumb,
.component-details::-webkit-scrollbar-thumb {
  background: rgba(0, 123, 255, 0.3);
  border-radius: 3px;
  transition: background 0.3s;
}

.component-list::-webkit-scrollbar-thumb:hover,
.component-details::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 123, 255, 0.5);
}

@media (prefers-color-scheme: dark) {
  .component-list::-webkit-scrollbar-track,
  .component-details::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }
  
  .component-list::-webkit-scrollbar-thumb,
  .component-details::-webkit-scrollbar-thumb {
    background: rgba(96, 165, 250, 0.4);
  }
  
  .component-list::-webkit-scrollbar-thumb:hover,
  .component-details::-webkit-scrollbar-thumb:hover {
    background: rgba(96, 165, 250, 0.6);
  }
}
</style>