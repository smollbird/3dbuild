<template>
  <section style="padding:16px">
    <h2>Figma 设计稿资源</h2>
    <p>执行根目录命令 <code>npm run figma:pull</code> 后，将在下方显示已拉取的 PNG 预览。</p>
    <div class="grid">
      <img
        v-for="img in images"
        :key="img"
        :src="img"
        style="width: 320px; height: auto; border: 1px solid #eee; margin: 8px;"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const images = ref<string[]>([]);

onMounted(async () => {
  try {
    const res = await fetch('/figma/file.json');
    if (!res.ok) return;
    const file = await res.json();
    // 仅展示静态导出的 PNG（如果存在）
    const indexRes = await fetch('/figma/');
    if (indexRes.ok) {
      // Vite 不提供目录索引。这里保守地尝试固定命名集合。
      // 实际生产中应由后端提供文件列表 API。
      const candidates: string[] = [];
      const ids: string[] = [];
      function collect(node: any) {
        if (!node) return;
        if (node.id) ids.push(node.id);
        if (node.children) node.children.forEach(collect);
      }
      collect(file.document);
      ids.slice(0, 30).forEach(id => candidates.push(`/figma/${id}.png`));
      // 并发检测哪些 png 存在
      const checks = await Promise.all(
        candidates.map(async u => {
          const r = await fetch(u, { method: 'HEAD' });
          return r.ok ? u : null;
        })
      );
      images.value = checks.filter(Boolean) as string[];
    }
  } catch (e) {
    // 忽略
  }
});
</script>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
}
</style>


