<template>
  <div class="layout">
    <header class="topbar">
      <h1>3D 商品拆解展示系统</h1>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/figma">Figma 预览</router-link>
        <router-link to="/viewer">3D 查看器</router-link>
        <router-link to="/design">原型</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style>
body, html, #app { height: 100%; margin: 0; }
.layout { display: flex; flex-direction: column; height: 100%; }
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; border-bottom: 1px solid #eee; }
nav a { margin-right: 12px; text-decoration: none; color: #333; }
main { flex: 1; overflow: auto; }
</style>


