import { ref, reactive } from 'vue';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';

// 渲染质量设置
export enum RenderQuality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  ULTRA = 'ultra'
}

// 渲染配置
export interface RenderConfig {
  quality: RenderQuality;
  enablePostProcessing: boolean;
  enableShadows: boolean;
  enableAntialiasing: boolean;
  enableAmbientOcclusion: boolean;
  enableBloom: boolean;
  pixelRatio: number;
  shadowMapSize: number;
}

// 渲染统计
export interface RenderStats {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number;
  memory: {
    geometries: number;
    textures: number;
  };
}

// 材质配置
export interface MaterialConfig {
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  normalScale: number;
  emissiveIntensity: number;
}

/**
 * 高级3D渲染管理器
 */
export function useAdvancedRenderer() {
  // 渲染器状态
  const isInitialized = ref(false);
  const currentQuality = ref<RenderQuality>(RenderQuality.MEDIUM);
  const renderStats = reactive<RenderStats>({
    fps: 0,
    frameTime: 0,
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    programs: 0,
    memory: {
      geometries: 0,
      textures: 0
    }
  });

  // 渲染器实例
  let renderer: THREE.WebGLRenderer | null = null;
  let composer: EffectComposer | null = null;
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;

  // 后处理通道
  let renderPass: RenderPass | null = null;
  let saoPass: SAOPass | null = null;
  let bloomPass: UnrealBloomPass | null = null;
  let smaaPass: SMAAPass | null = null;
  let outputPass: OutputPass | null = null;

  // 环境贴图
  let envMap: THREE.CubeTexture | null = null;
  let pmremGenerator: THREE.PMREMGenerator | null = null;

  // 性能监控
  let lastTime = 0;
  let frameCount = 0;

  /**
   * 获取质量配置
   */
  const getQualityConfig = (quality: RenderQuality): RenderConfig => {
    const configs: Record<RenderQuality, RenderConfig> = {
      [RenderQuality.LOW]: {
        quality: RenderQuality.LOW,
        enablePostProcessing: false,
        enableShadows: false,
        enableAntialiasing: false,
        enableAmbientOcclusion: false,
        enableBloom: false,
        pixelRatio: Math.min(window.devicePixelRatio, 1),
        shadowMapSize: 512
      },
      [RenderQuality.MEDIUM]: {
        quality: RenderQuality.MEDIUM,
        enablePostProcessing: true,
        enableShadows: true,
        enableAntialiasing: true,
        enableAmbientOcclusion: false,
        enableBloom: false,
        pixelRatio: Math.min(window.devicePixelRatio, 1.5),
        shadowMapSize: 1024
      },
      [RenderQuality.HIGH]: {
        quality: RenderQuality.HIGH,
        enablePostProcessing: true,
        enableShadows: true,
        enableAntialiasing: true,
        enableAmbientOcclusion: true,
        enableBloom: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        shadowMapSize: 2048
      },
      [RenderQuality.ULTRA]: {
        quality: RenderQuality.ULTRA,
        enablePostProcessing: true,
        enableShadows: true,
        enableAntialiasing: true,
        enableAmbientOcclusion: true,
        enableBloom: true,
        pixelRatio: window.devicePixelRatio,
        shadowMapSize: 4096
      }
    };
    return configs[quality];
  };

  /**
   * 初始化渲染器
   */
  const initRenderer = (
    container: HTMLDivElement,
    sceneRef: THREE.Scene,
    cameraRef: THREE.PerspectiveCamera,
    quality: RenderQuality = RenderQuality.MEDIUM
  ) => {
    scene = sceneRef;
    camera = cameraRef;
    currentQuality.value = quality;

    const config = getQualityConfig(quality);

    // 创建WebGL渲染器
    renderer = new THREE.WebGLRenderer({
      antialias: config.enableAntialiasing,
      alpha: true,
      powerPreference: 'high-performance'
    });

    renderer.setPixelRatio(config.pixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 阴影配置
    if (config.enableShadows) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.shadowMap.autoUpdate = true;
    }

    container.appendChild(renderer.domElement);

    // 初始化后处理
    if (config.enablePostProcessing) {
      initPostProcessing(config);
    }

    // 创建环境贴图
    initEnvironmentMap();

    isInitialized.value = true;
  };

  /**
   * 初始化后处理
   */
  const initPostProcessing = (config: RenderConfig) => {
    if (!renderer || !scene || !camera) return;

    composer = new EffectComposer(renderer);

    // 基础渲染通道
    renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // 环境光遮蔽
    if (config.enableAmbientOcclusion) {
      saoPass = new SAOPass(scene, camera);
      saoPass.params.output = SAOPass.OUTPUT.Default;
      saoPass.params.saoBias = 0.5;
      saoPass.params.saoIntensity = 0.18;
      saoPass.params.saoScale = 1;
      saoPass.params.saoKernelRadius = 100;
      saoPass.params.saoMinResolution = 0;
      composer.addPass(saoPass);
    }

    // 辉光效果
    if (config.enableBloom) {
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.5,  // strength
        0.4,  // radius
        0.85  // threshold
      );
      composer.addPass(bloomPass);
    }

    // 抗锯齿
    if (config.enableAntialiasing) {
      smaaPass = new SMAAPass(
        window.innerWidth * renderer.getPixelRatio(),
        window.innerHeight * renderer.getPixelRatio()
      );
      composer.addPass(smaaPass);
    }

    // 输出通道
    outputPass = new OutputPass();
    composer.addPass(outputPass);
  };

  /**
   * 初始化环境贴图
   */
  const initEnvironmentMap = () => {
    if (!renderer) return;

    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    // 创建简单的环境贴图
    const envMapTexture = new THREE.WebGLCubeRenderTarget(256);
    envMap = envMapTexture.texture;

    // 或者加载HDR环境贴图
    // const loader = new RGBELoader();
    // loader.load('/textures/environment.hdr', (texture) => {
    //   envMap = pmremGenerator.fromEquirectangular(texture).texture;
    //   texture.dispose();
    //   pmremGenerator.dispose();
    // });
  };

  /**
   * 渲染帧
   */
  const render = () => {
    if (!renderer || !scene || !camera) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // 更新性能统计
    updateRenderStats(deltaTime);

    // 渲染
    if (composer) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  };

  /**
   * 更新渲染统计
   */
  const updateRenderStats = (deltaTime: number) => {
    frameCount++;
    
    if (frameCount % 60 === 0) { // 每60帧更新一次
      renderStats.fps = Math.round(1000 / deltaTime);
      renderStats.frameTime = Math.round(deltaTime * 100) / 100;
      
      if (renderer) {
        const info = renderer.info;
        renderStats.drawCalls = info.render.calls;
        renderStats.triangles = info.render.triangles;
        renderStats.geometries = info.memory.geometries;
        renderStats.textures = info.memory.textures;
        renderStats.programs = info.programs?.length || 0;
        renderStats.memory.geometries = info.memory.geometries;
        renderStats.memory.textures = info.memory.textures;
      }
    }
  };

  /**
   * 设置渲染质量
   */
  const setRenderQuality = (quality: RenderQuality) => {
    if (!renderer || currentQuality.value === quality) return;

    currentQuality.value = quality;
    const config = getQualityConfig(quality);

    // 更新渲染器设置
    renderer.setPixelRatio(config.pixelRatio);
    renderer.shadowMap.enabled = config.enableShadows;

    // 重新初始化后处理
    if (config.enablePostProcessing && !composer) {
      initPostProcessing(config);
    } else if (!config.enablePostProcessing && composer) {
      composer.dispose();
      composer = null;
    }
  };

  /**
   * 应用材质配置
   */
  const applyMaterialConfig = (object: THREE.Object3D, config: MaterialConfig) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.metalness = config.metalness;
        child.material.roughness = config.roughness;
        child.material.envMapIntensity = config.envMapIntensity;
        
        if (child.material.normalMap) {
          child.material.normalScale.setScalar(config.normalScale);
        }
        
        if (child.material.emissiveMap) {
          child.material.emissiveIntensity = config.emissiveIntensity;
        }
        
        // 应用环境贴图
        if (envMap) {
          child.material.envMap = envMap;
        }
        
        child.material.needsUpdate = true;
      }
    });
  };

  /**
   * 优化模型
   */
  const optimizeModel = (object: THREE.Object3D) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // 启用视锥体剔除
        child.frustumCulled = true;
        
        // 合并几何体（如果适用）
        if (child.geometry) {
          child.geometry.computeBoundingBox();
          child.geometry.computeBoundingSphere();
        }
        
        // 优化材质
        if (child.material instanceof THREE.Material) {
          child.material.precision = 'mediump';
        }
      }
    });
  };

  /**
   * 调整渲染器大小
   */
  const resize = (width: number, height: number) => {
    if (!renderer) return;

    renderer.setSize(width, height);
    
    if (composer) {
      composer.setSize(width, height);
    }
    
    if (camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  };

  /**
   * 清理资源
   */
  const dispose = () => {
    if (composer) {
      composer.dispose();
      composer = null;
    }
    
    if (renderer) {
      renderer.dispose();
      renderer = null;
    }
    
    if (pmremGenerator) {
      pmremGenerator.dispose();
      pmremGenerator = null;
    }
    
    if (envMap) {
      envMap.dispose();
      envMap = null;
    }
    
    isInitialized.value = false;
  };

  /**
   * 获取渲染器实例
   */
  const getRenderer = () => renderer;

  /**
   * 获取后处理器实例
   */
  const getComposer = () => composer;

  return {
    // 状态
    isInitialized,
    currentQuality,
    renderStats,

    // 方法
    initRenderer,
    render,
    setRenderQuality,
    applyMaterialConfig,
    optimizeModel,
    resize,
    dispose,

    // 访问器
    getRenderer,
    getComposer,

    // 工具方法
    getQualityConfig
  };
}