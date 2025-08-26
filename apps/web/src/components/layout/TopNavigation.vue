<template>
  <header class="top-nav">
    <div class="nav-left">
      <div class="logo">
        <div class="logo-icon"></div>
        <span class="logo-text">3D拆解系统</span>
      </div>
      <nav class="nav-menu">
        <button
          v-for="item in menuItems"
          :key="item"
          class="nav-btn"
          @click="handleMenuClick(item)"
        >
          {{ item }}
        </button>
      </nav>
    </div>
    
    <div class="nav-center">
      <div class="search-container">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="搜索模型、工具或教程..." 
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667zM14 14l-2.9-2.9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="nav-right">
      <button class="user-btn" @click="handleUserClick">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.333 14v-1.333A2.667 2.667 0 0 0 10.667 10H5.333a2.667 2.667 0 0 0-2.667 2.667V14M8 7.333A2.667 2.667 0 1 0 8 2a2.667 2.667 0 0 0 0 5.333z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>用户</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props
interface Props {
  searchQuery?: string;
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: ''
});

// Emits
const emit = defineEmits<{
  search: [query: string];
  menuClick: [item: string];
  userClick: [];
}>();

// Data
const searchQuery = ref(props.searchQuery);
const menuItems = ['文件', '编辑', '视图', '模型', '拆解', '工具', '培训', '帮助'];

// Methods
const handleSearch = () => {
  emit('search', searchQuery.value);
};

const handleMenuClick = (item: string) => {
  emit('menuClick', item);
};

const handleUserClick = () => {
  emit('userClick');
};
</script>

<style scoped>
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(233, 236, 239, 0.8);
  height: 56px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(45deg, #007bff, #0056b3);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: rotate(45deg) translateX(-100%);
  transition: transform 0.6s;
}

.logo:hover .logo-icon::before {
  transform: rotate(45deg) translateX(100%);
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  background: linear-gradient(45deg, #007bff, #6f42c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
}

.nav-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  border-radius: 8px;
  font-size: 14px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 123, 255, 0.1), transparent);
  transition: left 0.5s;
}

.nav-btn:hover::before {
  left: 100%;
}

.nav-btn:hover {
  background: rgba(0, 123, 255, 0.08);
  color: #007bff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.nav-btn:active {
  transform: translateY(0);
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 500px;
  margin: 0 20px;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.search-input {
  width: 100%;
  padding: 12px 44px 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15), 0 0 0 3px rgba(0, 123, 255, 0.1);
  transform: translateY(-1px);
}

.search-input::placeholder {
  color: #9ca3af;
  transition: color 0.3s;
}

.search-input:focus::placeholder {
  color: #6b7280;
}

.search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
}

.search-btn:hover {
  background: linear-gradient(45deg, #0056b3, #004085);
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.search-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.nav-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: rgba(0, 123, 255, 0.1);
  border-radius: 12px;
  font-size: 14px;
  color: #007bff;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);
}

.user-btn:hover {
  background: rgba(0, 123, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 123, 255, 0.2);
}

.user-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-nav {
    padding: 8px 12px;
    height: 48px;
  }
  
  .nav-left {
    gap: 12px;
  }
  
  .logo-text {
    font-size: 16px;
  }
  
  .nav-center {
    margin: 0 12px;
  }
  
  .search-input {
    padding: 10px 40px 10px 12px;
    font-size: 13px;
  }
  
  .user-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .user-btn span {
    display: none;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .top-nav {
    background: rgba(26, 26, 46, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .logo-text {
    color: #ffffff;
  }
  
  .nav-btn {
    color: #d1d5db;
  }
  
  .nav-btn:hover {
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.1);
  }
  
  .search-input {
    background: rgba(55, 65, 81, 0.8);
    border-color: rgba(75, 85, 99, 0.8);
    color: #ffffff;
  }
  
  .search-input:focus {
    border-color: #60a5fa;
    background: rgba(55, 65, 81, 1);
  }
  
  .user-btn {
    background: rgba(96, 165, 250, 0.2);
    color: #60a5fa;
  }
  
  .user-btn:hover {
    background: rgba(96, 165, 250, 0.3);
  }
}

/* 动画键帧 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.nav-btn:focus {
  animation: pulse 1.5s infinite;
}
</style>