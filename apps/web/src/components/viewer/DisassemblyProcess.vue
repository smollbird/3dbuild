<template>
  <div class="disassembly-process">
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
        :class="{ 
          active: index === currentStep - 1, 
          completed: index < currentStep - 1 
        }"
        @click="handleStepClick(index)"
      >
        <div class="step-header">
          <div class="step-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
              <path 
                v-if="index < currentStep - 1"
                d="M6 8l2 2 4-4" 
                stroke="currentColor" 
                stroke-width="2"
              />
            </svg>
          </div>
          <div class="step-content">
            <div class="step-title-row">
              <h4>{{ step.title }}</h4>
              <div class="risk-badge" :class="step.risk">
                {{ getRiskText(step.risk) }}
              </div>
            </div>
            <p class="step-description">{{ step.description }}</p>
          </div>
        </div>
        
        <div v-if="index === currentStep - 1" class="step-details">
          <div class="detail-row">
            <span class="detail-label">扭矩</span>
            <span class="detail-value">{{ step.torque }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">工具</span>
            <span class="detail-value tool-info">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L1 6l1 1 4-4-1-1z" stroke="currentColor" stroke-width="1"/>
              </svg>
              {{ step.tool }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">预计时间</span>
            <span class="detail-value">{{ step.duration }}</span>
          </div>
        </div>

        <div 
          v-if="index === currentStep - 1" 
          class="step-highlight"
        ></div>
      </div>
    </div>

    <div class="process-controls">
      <button 
        class="process-btn pause"
        :disabled="!isPlaying"
        @click="handlePause"
      ></button>
      <button 
        class="process-btn play"
        :disabled="isPlaying"
        @click="handlePlay"
      ></button>
      <button class="process-btn-primary" @click="handleHelp">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
          <path d="M6 6a2 2 0 0 1 4 0c0 1-2 1.5-2 2.5M8 11h.01" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

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
  help: [];
}>();

// Types
interface StepData {
  title: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  torque: string;
  tool: string;
  duration: string;
}

// Data
const currentStep = ref(props.currentStep);
const totalSteps = ref(props.totalSteps);
const isPlaying = ref(props.isPlaying);

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

// Computed
const progress = computed(() => {
  return Math.round(((currentStep.value - 1) / totalSteps.value) * 100);
});

// Methods
const getRiskText = (risk: 'low' | 'medium' | 'high') => {
  const riskMap: Record<'low' | 'medium' | 'high', string> = {
    'low': '低风险',
    'medium': '中风险',
    'high': '高风险'
  };
  return riskMap[risk];
};

const handleStepClick = (stepIndex: number) => {
  currentStep.value = stepIndex + 1;
  emit('stepClick', stepIndex);
};

const handlePlay = () => {
  isPlaying.value = true;
  emit('play');
};

const handlePause = () => {
  isPlaying.value = false;
  emit('pause');
};

const handleHelp = () => {
  emit('help');
};
</script>

<style scoped>
.disassembly-process {
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
  background: #e9ecef;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #6c757d;
}

.progress-section {
  padding: 16px;
  border-bottom: 1px solid #f8f9fa;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 14px;
  color: #6c757d;
}

.progress-value {
  font-size: 14px;
  font-weight: 600;
  color: #007bff;
}

.progress-bar {
  height: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s ease;
}

.steps-list {
  flex: 1;
  overflow-y: auto;
}

.step-item {
  position: relative;
  padding: 16px;
  border-bottom: 1px solid #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
}

.step-item:hover {
  background: #f8f9fa;
}

.step-item.active {
  background: #fff3cd;
}

.step-item.completed {
  opacity: 0.7;
}

.step-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.step-item.active .step-icon {
  color: #007bff;
}

.step-item.completed .step-icon {
  color: #28a745;
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

.step-content h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #212529;
}

.step-description {
  margin: 0;
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
}

.risk-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.risk-badge.low {
  background: #d4edda;
  color: #155724;
}

.risk-badge.medium {
  background: #fff3cd;
  color: #856404;
}

.risk-badge.high {
  background: #f8d7da;
  color: #721c24;
}

.step-details {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
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

.process-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
</style>