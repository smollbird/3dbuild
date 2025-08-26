<template>
  <BaseLayout>
    <template v-slot:header>
      <TopNavigation
        :search-query="searchQuery"
        @search="handleSearch"
        @menu-click="handleMenuClick"
        @user-click="handleUserClick"
      />
    </template>

    <template v-slot:toolbar>
      <Toolbar
        :current-mode="currentMode"
        @tool-click="handleToolClick"
        @icon-click="handleIconClick"
        @action-click="handleActionClick"
        @mode-change="handleModeChange"
        @help-click="handleToolbarHelp"
      />
    </template>

    <template v-slot:content>
      <div class="viewer-content">
        <!-- 3D视图区域 -->
        <div class="viewer-area">
          <ThreeJSViewer
            :model-name="currentVehicle?.name || '汽车发动机总成'"
            :current-view="currentView"
            @component-select="handleComponentSelect"
            @view-change="handleViewChange"
            @control-click="handleControlClick"
            @playback="handlePlayback"
          />
        </div>

        <!-- 右侧面板 -->
        <RightPanel
          :current-step="currentStep"
          :total-steps="totalSteps"
          :is-playing="isPlaying"
          @step-click="handleStepClick"
          @play="handlePlay"
          @pause="handlePause"
          @process-help="handleProcessHelp"
          @tool-select="handleToolSelect"
        />
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import BaseLayout from "@/components/layout/BaseLayout.vue";
import TopNavigation from "@/components/layout/TopNavigation.vue";
import Toolbar from "@/components/layout/Toolbar.vue";
import ThreeJSViewer from "@/components/viewer/ThreeJSViewer.vue";
import RightPanel from "@/components/layout/RightPanel.vue";
import { useAppStore } from "@/stores/useAppStore";
import { useSceneStore } from "@/stores/useSceneStore";

// 状态管理
const appStore = useAppStore();
const sceneStore = useSceneStore();

// 从 store 中获取状态
const {
  isLoading,
  error,
  searchQuery,
  selectedComponent,
  currentView,
  currentStep,
  totalSteps,
  isPlaying,
  currentVehicle,
  vehicles,
  components,
  renderQuality,
  showStats,
} = appStore;

// 本地状态（不需要全局共享）
const currentMode = ref("auto");

// Event Handlers
const handleSearch = (query: string) => {
  appStore.setSearchQuery(query);
};

const handleMenuClick = (item: string) => {
  console.log("Menu click:", item);
};

const handleUserClick = () => {
  console.log("User click");
};

const handleToolClick = (toolName: string) => {
  console.log("Tool click:", toolName);
};

const handleIconClick = (iconName: string) => {
  console.log("Icon click:", iconName);
};

const handleActionClick = (actionName: string) => {
  console.log("Action click:", actionName);
  if (actionName === "全屏") {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }
};

const handleModeChange = (mode: string) => {
  console.log("Mode change:", mode);
};

const handleToolbarHelp = () => {
  console.log("Toolbar help");
};

const handleComponentSelect = (componentKey: string) => {
  appStore.selectComponent(componentKey);
};

const handleViewChange = (view: string) => {
  appStore.setCurrentView(view);
};

const handleControlClick = (control: string) => {
  console.log("Control click:", control);
};

const handlePlayback = () => {
  appStore.togglePlaying();
};

const handleStepClick = (stepIndex: number) => {
  appStore.setCurrentStep(stepIndex + 1);
};

const handlePlay = () => {
  appStore.setPlaying(true);
};

const handlePause = () => {
  appStore.setPlaying(false);
};

const handleProcessHelp = () => {
  console.log("Process help");
};

const handleToolSelect = (tool: any) => {
  appStore.selectTool(tool);
};

// 监听状态变化
watch(
  () => currentVehicle,
  (newVehicle) => {
    if (newVehicle) {
      appStore.loadVehicleComponents(newVehicle.id);
    }
  }
);

// Lifecycle
onMounted(async () => {
  await appStore.initializeApp();
});
</script>

<style scoped>
.viewer-content {
  display: flex;
  flex: 1;
  height: 100%;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(5px);
  border-radius: 16px 16px 0 0;
  position: relative;
}

.viewer-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
}

.viewer-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  position: relative;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.viewer-area:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 12px 20px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .viewer-content {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .viewer-area {
    min-height: 60vh;
  }
}

@media (max-width: 768px) {
  .viewer-content {
    gap: 12px;
    padding: 12px;
    border-radius: 12px 12px 0 0;
  }

  .viewer-area {
    border-radius: 12px;
    min-height: 50vh;
  }
}

@media (max-width: 480px) {
  .viewer-content {
    gap: 8px;
    padding: 8px;
  }

  .viewer-area {
    border-radius: 8px;
    min-height: 45vh;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .viewer-content {
    background: rgba(0, 0, 0, 0.1);
  }

  .viewer-content::before {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.02) 50%,
      rgba(255, 255, 255, 0.01) 100%
    );
  }

  .viewer-area {
    background: rgba(26, 26, 46, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .viewer-area:hover {
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 12px 20px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.viewer-content {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.viewer-area {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

/* 加载状态 */
.viewer-area.loading {
  opacity: 0.7;
  pointer-events: none;
}

.viewer-area.loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border: 3px solid rgba(0, 123, 255, 0.2);
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 1000;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 推拉效果 */
.viewer-content {
  perspective: 1000px;
}

.viewer-area {
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.viewer-area:active {
  transform: translateY(1px) scale(0.998);
}

/* 焦点状态 */
.viewer-area:focus-within {
  outline: none;
  box-shadow: 0 20px 40px rgba(0, 123, 255, 0.15),
    0 8px 16px rgba(0, 123, 255, 0.08), 0 0 0 3px rgba(0, 123, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

/* 可访问性优化 */
@media (prefers-reduced-motion: reduce) {
  .viewer-content,
  .viewer-area {
    animation: none;
    transition: none;
  }

  .viewer-area:hover {
    transform: none;
  }
}
</style>
