<template>
  <div class="tool-selection">
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
        <button class="select-tool-btn" @click="handleToolSelect(recommendedTool)">
          选择使用
        </button>
      </div>
    </div>

    <!-- 所有工具 -->
    <div class="all-tools">
      <div class="tools-header">所有工具</div>
      <div class="tools-list">
        <div 
          v-for="tool in availableTools" 
          :key="tool.id"
          class="tool-card"
        >
          <div class="tool-info-row">
            <div class="tool-icon">{{ tool.icon }}</div>
            <div class="tool-details">
              <h4>{{ tool.name }}</h4>
              <p>{{ tool.spec }}</p>
            </div>
            <div class="tool-badges">
              <div v-if="tool.recommended" class="badge recommended">推荐</div>
              <div class="badge" :class="tool.status">{{ tool.statusText }}</div>
            </div>
          </div>
          <div class="tool-specifications">
            <div 
              v-for="spec in tool.specifications" 
              :key="spec.label"
              class="spec-row"
            >
              <span class="spec-label">{{ spec.label }}:</span>
              <span class="spec-value">{{ spec.value }}</span>
            </div>
          </div>
          <button 
            class="select-tool-btn" 
            @click="handleToolSelect(tool)" 
            :disabled="tool.status === 'unavailable'"
          >
            {{ tool.status === 'unavailable' ? '不可用' : '选择使用' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// Props
interface Props {
  currentStep?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentStep: 2
});

// Emits
const emit = defineEmits<{
  toolSelect: [tool: ToolData];
}>();

// Types
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

// Data
const recommendedTool = reactive<ToolData>({
  id: 0,
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
});

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
  },
  {
    id: 4,
    name: '内六角扳手',
    spec: '6mm',
    icon: '🔩',
    recommended: false,
    status: 'available',
    statusText: '可用',
    specifications: [
      { label: '规格', value: '6mm' },
      { label: '材质', value: '铬钒钢' },
      { label: '扭矩', value: '5-25 N·m' }
    ]
  },
  {
    id: 5,
    name: '电动螺丝刀',
    spec: '12V',
    icon: '🔌',
    recommended: false,
    status: 'available',
    statusText: '可用',
    specifications: [
      { label: '电压', value: '12V' },
      { label: '扭矩', value: '1-10 N·m' },
      { label: '电池', value: '锂电池' }
    ]
  }
]);

// Methods
const handleToolSelect = (tool: ToolData) => {
  emit('toolSelect', tool);
};
</script>

<style scoped>
.tool-selection {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid #f8f9fa;
}

.header-icon {
  color: #6c757d;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  flex: 1;
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

.select-tool-btn:hover:not(:disabled) {
  background: #0056b3;
}

.select-tool-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.all-tools {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
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
</style>