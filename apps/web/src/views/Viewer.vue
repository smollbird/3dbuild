<template>
  <div ref="container" class="viewer"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';

const container = ref<HTMLDivElement | null>(null);
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let raf = 0;

function resize() {
  if (!container.value || !renderer || !camera) return;
  const { clientWidth, clientHeight } = container.value;
  renderer.setSize(clientWidth, clientHeight);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
}

onMounted(() => {
  if (!container.value) return;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.set(3, 2, 6);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  container.value.appendChild(renderer.domElement);
  resize();

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2, 5, 3);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  // 占位模型：一组立方体，用于后续替换为导入的 CAD 转换 glTF
  const group = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(`hsl(${i * 55}, 60%, 60%)`) });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(i * 1.2 - 2.4, 0.5, 0);
    group.add(mesh);
  }
  scene.add(group);

  const clock = new THREE.Clock();
  const animate = () => {
    raf = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    group.rotation.y = t * 0.4;
    if (renderer && scene && camera) renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', resize);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener('resize', resize);
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
  scene = null;
  camera = null;
});
</script>

<style scoped>
.viewer {
  position: relative;
  width: 100%;
  height: calc(100vh - 56px);
}
</style>


