<template>
  <div class="base-layout">
    <slot name="header" />
    <slot name="toolbar" />
    <main class="main-content">
      <slot name="content" />
    </main>
  </div>
</template>

<script setup lang="ts">
// 基础布局组件，提供应用的主要布局结构

// 定义slots
defineSlots<{
  header(): any
  toolbar(): any
  content(): any
}>()
</script>

<style scoped>
.base-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  position: relative;
  overflow: hidden;
}

.base-layout::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(120, 190, 240, 0.15) 0%, transparent 50%), 
              radial-gradient(circle at 80% 20%, rgba(255, 190, 120, 0.15) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .base-layout {
    height: 100dvh; /* 使用动态视口高度 */
  }
  
  .main-content {
    padding: 8px;
    gap: 8px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .base-layout {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #ffffff;
  }
  
  .base-layout::before {
    background: radial-gradient(circle at 20% 80%, rgba(70, 130, 180, 0.2) 0%, transparent 50%), 
                radial-gradient(circle at 80% 20%, rgba(255, 140, 70, 0.2) 0%, transparent 50%);
  }
}
</style>