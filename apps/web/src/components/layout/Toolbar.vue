<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <div class="tool-group">
        <button class="tool-btn" @click="handleToolClick('导入')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 2H2v12h12V2z" stroke="currentColor" stroke-width="2"/>
            <path d="M8 6v4m-4-2h8" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>导入</span>
        </button>
        <button class="tool-btn" @click="handleToolClick('保存')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 2H6v12h4V2z" stroke="currentColor" stroke-width="2"/>
            <path d="M4 5h8M4 8h8M4 11h8" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>保存</span>
        </button>
        <button class="tool-btn" @click="handleToolClick('导出')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12m4-8l-4 4-4-4" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>导出</span>
        </button>
      </div>
      
      <div class="tool-group">
        <button class="tool-icon-btn" @click="handleIconClick('select')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2v12h12V2H2z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <button class="tool-icon-btn" @click="handleIconClick('add')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12m-6-6h12" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <button class="tool-icon-btn" @click="handleIconClick('remove')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2l12 12M2 14L14 2" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
      
      <div class="tool-group">
        <button class="tool-btn" @click="handleActionClick('全屏')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2h12v12H2V2z" stroke="currentColor" stroke-width="2"/>
            <path d="M6 6h4v4H6V6z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>全屏</span>
        </button>
        <button class="tool-btn" @click="handleActionClick('设置')">
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
          <button
            class="mode-btn"
            :class="{ active: currentMode === 'auto' }"
            @click="handleModeChange('auto')"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <button
            class="mode-btn"
            :class="{ active: currentMode === 'manual' }"
            @click="handleModeChange('manual')"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12m-6-6h12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <span class="mode-text">{{ currentModeText }}</span>
        <button class="help-btn" @click="handleHelpClick">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
            <path d="M6 6a2 2 0 0 1 4 0c0 1-2 1.5-2 2.5M8 11h.01" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>帮助</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Props
interface Props {
  currentMode?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentMode: 'auto'
});

// Emits
const emit = defineEmits<{
  toolClick: [toolName: string];
  iconClick: [iconName: string];
  actionClick: [actionName: string];
  modeChange: [mode: string];
  helpClick: [];
}>();

// Data
const currentMode = ref(props.currentMode);

// Computed
const currentModeText = computed(() => {
  return currentMode.value === 'auto' ? '自动拆解模式' : '手动拆解模式';
});

// Methods
const handleToolClick = (toolName: string) => {
  emit('toolClick', toolName);
};

const handleIconClick = (iconName: string) => {
  emit('iconClick', iconName);
};

const handleActionClick = (actionName: string) => {
  emit('actionClick', actionName);
};

const handleModeChange = (mode: string) => {
  currentMode.value = mode;
  emit('modeChange', mode);
};

const handleHelpClick = () => {
  emit('helpClick');
};
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(233, 236, 239, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 90;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.tool-group {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 20px;
  border-right: 1px solid rgba(233, 236, 239, 0.8);
  position: relative;
}

.tool-group:last-child {
  border-right: none;
}

.tool-group::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 20%;
  height: 60%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, #e9ecef, transparent);
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.tool-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 123, 255, 0.1), transparent);
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.tool-btn:hover::before {
  left: 100%;
}

.tool-btn:hover {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 123, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.tool-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tool-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border-radius: 12px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.tool-icon-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%) rotate(45deg);
  transition: transform 0.6s;
}

.tool-icon-btn:hover::after {
  transform: translateX(100%) rotate(45deg);
}

.tool-icon-btn:hover {
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 16px rgba(23, 162, 184, 0.25);
}

.tool-icon-btn:active {
  transform: translateY(0) scale(0.98);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.auto-mode {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.9));
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.mode-controls {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: rgba(233, 236, 239, 0.5);
  border-radius: 8px;
}

.mode-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.mode-btn.active {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
  transform: scale(1.05);
}

.mode-btn:not(.active):hover {
  background: rgba(108, 117, 125, 0.1);
  color: #495057;
  transform: scale(1.02);
}

.mode-text {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  min-width: 100px;
  text-align: center;
}

.help-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: linear-gradient(135deg, #ffc107, #e0a800);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #212529;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
}

.help-btn:hover {
  background: linear-gradient(135deg, #e0a800, #d39e00);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(255, 193, 7, 0.4);
}

.help-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .toolbar-left {
    gap: 12px;
  }
  
  .tool-group {
    gap: 6px;
    padding-right: 12px;
  }
  
  .tool-btn span {
    display: none;
  }
  
  .help-btn span {
    display: none;
  }
}

@media (max-width: 768px) {
  .toolbar {
    padding: 8px 12px;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .toolbar-left {
    gap: 8px;
    min-width: 0;
    flex: 1;
  }
  
  .tool-group {
    gap: 4px;
    padding-right: 8px;
  }
  
  .tool-btn {
    padding: 8px 12px;
    min-width: 44px;
  }
  
  .tool-icon-btn {
    width: 36px;
    height: 36px;
  }
  
  .auto-mode {
    padding: 6px 12px;
  }
  
  .mode-text {
    font-size: 12px;
    min-width: 80px;
  }
  
  .mode-btn {
    width: 32px;
    height: 32px;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .toolbar {
    background: rgba(26, 26, 46, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .tool-group::after {
    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
  
  .tool-btn {
    background: linear-gradient(135deg, #374151, #4b5563);
    color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .tool-btn:hover {
    background: linear-gradient(135deg, #60a5fa, #3b82f6);
    color: white;
  }
  
  .tool-icon-btn {
    background: linear-gradient(135deg, #374151, #4b5563);
    color: #d1d5db;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .tool-icon-btn:hover {
    background: linear-gradient(135deg, #06b6d4, #0891b2);
    color: white;
  }
  
  .auto-mode {
    background: linear-gradient(135deg, rgba(55, 65, 81, 0.9), rgba(75, 85, 99, 0.9));
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .mode-controls {
    background: rgba(0, 0, 0, 0.3);
  }
  
  .mode-btn {
    color: #9ca3af;
  }
  
  .mode-btn.active {
    background: linear-gradient(135deg, #10b981, #059669);
  }
  
  .mode-text {
    color: #d1d5db;
  }
  
  .help-btn {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #1f2937;
  }
  
  .help-btn:hover {
    background: linear-gradient(135deg, #d97706, #b45309);
  }
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.mode-btn.active {
  animation: pulse 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
}

.help-btn:focus {
  animation: bounce 1s;
}
</style>