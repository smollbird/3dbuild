<template>
  <div class="layout">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style>
body,
html,
#app {
  height: 100%;
  margin: 0;
}
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
}
nav a {
  margin-right: 12px;
  text-decoration: none;
  color: #333;
}
main {
  flex: 1;
  overflow: auto;
}
</style>
