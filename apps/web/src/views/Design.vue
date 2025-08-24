<template>
  <div class="design-root">
    <header class="topbar">
      <div class="brand">
        <div class="logo"></div>
        <div class="title">3D拆解系统</div>
      </div>
      <nav class="menu">
        <button class="btn">文件</button>
        <button class="btn">编辑</button>
        <button class="btn">视图</button>
        <button class="btn">模型</button>
        <button class="btn">拆解</button>
        <button class="btn">工具</button>
        <button class="btn">培训</button>
        <button class="btn">帮助</button>
      </nav>
      <div class="actions">
        <div class="search">
          <input placeholder="搜索模型、工具或教程..." />
        </div>
        <button class="btn user">用户</button>
      </div>
    </header>

    <div class="canvas">
      <aside class="left-col">
        <section class="panel small">
          <div class="icon-circle red"></div>
          <div class="kpi">
            <div class="kpi-title">发动机</div>
          </div>
        </section>
        <section class="panel small">
          <div class="icon-circle orange"></div>
          <div class="kpi">
            <div class="kpi-title">变速箱</div>
          </div>
        </section>
        <section class="panel small">
          <div class="icon-circle blue"></div>
          <div class="kpi">
            <div class="kpi-title">散热器</div>
          </div>
        </section>
        <section class="panel small">
          <div class="icon-circle green"></div>
          <div class="kpi">
            <div class="kpi-title">电池</div>
          </div>
        </section>

        <section class="panel block">
          <div class="panel-header">
            <span class="dot"></span>
            <span class="panel-title">自动拆解模式</span>
            <div class="spacer"></div>
            <button class="chip">帮助</button>
          </div>
          <div class="panel-actions">
            <button class="icon-btn"></button>
            <button class="icon-btn"></button>
          </div>
        </section>
      </aside>

      <main class="stage">
        <div class="stage-header">
          <div class="badge">3D 模型视图</div>
          <div class="meta">汽车发动机总成</div>
        </div>
        <div class="stage-body">
          <div class="view-switch">
            <button class="primary">主视图</button>
            <button>侧视图</button>
            <button>顶视图</button>
          </div>
          <div class="stage-placeholder">3D 视口占位（与 Three.js 查看器对接）</div>
        </div>
      </main>

      <aside class="right-col">
        <section class="card">
          <header>
            <div class="icon ok"></div>
            <div class="title">1. 断开电池连接</div>
            <div class="tag low">低风险</div>
          </header>
          <div class="desc">先断开负极，再断开正极</div>
          <div class="stats">
            <div class="stat"><label>扭矩</label><strong>8 N·m</strong></div>
            <div class="stat"><label>工具</label><strong>扳手</strong></div>
            <div class="stat"><label>耗时</label><strong>2分钟</strong></div>
          </div>
        </section>

        <section class="card warn">
          <header>
            <div class="icon mid"></div>
            <div class="title">2. 拆卸进气管</div>
            <div class="tag mid">中风险</div>
          </header>
          <div class="desc">松开夹具，小心拆下进气管</div>
          <div class="stats">
            <div class="stat"><label>扭矩</label><strong>12 N·m</strong></div>
            <div class="stat"><label>工具</label><strong>十字螺丝刀</strong></div>
            <div class="stat"><label>耗时</label><strong>5分钟</strong></div>
          </div>
        </section>

        <section class="card danger">
          <header>
            <div class="icon high"></div>
            <div class="title">3. 拆除冷却液管路</div>
            <div class="tag high">高风险</div>
          </header>
          <div class="desc">排空冷却液后拆除管路</div>
          <div class="stats">
            <div class="stat"><label>扭矩</label><strong>15 N·m</strong></div>
            <div class="stat"><label>工具</label><strong>管路钳</strong></div>
            <div class="stat"><label>耗时</label><strong>8分钟</strong></div>
          </div>
        </section>
      </aside>
    </div>

    <footer class="statusbar">
      <div class="status-left">
        <div class="pill green"></div>
        <div class="status-text">模型已加载</div>
        <div class="muted">当前模型: 汽车发动机总成 v2.3</div>
        <div class="muted">面数: 145,826 | 顶点: 72,913</div>
      </div>
      <div class="status-middle">
        <div class="muted">拆解进度:</div>
        <div class="progress"><span style="width:40%"></span></div>
        <div class="badge">步骤 2/5</div>
      </div>
      <div class="status-right">
        <div class="kpi">CPU: 45%</div>
        <div class="kpi">内存: 2.1GB</div>
        <div class="kpi">在线</div>
        <div class="kpi">已用时: 15:32</div>
        <div class="kpi">协作: 3人在线</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
:root {
  --dark-1: #2C3E50;
  --dark-2: #34495E;
  --light: #FFFFFF;
  --muted: rgba(255,255,255,0.7);
  --muted-2: rgba(255,255,255,0.5);
  --green: #2ECC71;
  --orange: #F39C12;
  --red: #E74C3C;
  --blue: #3498DB;
}

.design-root { display: flex; flex-direction: column; height: 100%; background: var(--dark-1); color: var(--light); }
.topbar { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 8px 14px; border-bottom: 1px solid rgba(127,140,141,0.3); }
.brand { display: flex; align-items: center; gap: 7px; }
.logo { width: 28px; height: 28px; background: rgba(255,255,255,0.2); border-radius: 4.75px; }
.title { font-weight: 500; font-size: 14px; }
.menu { display: flex; gap: 7px; justify-content: center; }
.btn { background: transparent; color: var(--muted); border: 1px solid rgba(127,140,141,0.2); border-radius: 3.5px; padding: 3.5px 7px; cursor: pointer; }
.btn:hover { border-color: rgba(255,255,255,0.35); color: var(--light); }
.actions { display: flex; gap: 10.5px; justify-content: flex-end; align-items: center; }
.search input { width: 280px; height: 31.5px; background: var(--dark-2); border: 1px solid rgba(127,140,141,0.3); border-radius: 6.75px; color: var(--muted-2); padding: 0 12px; }
.user { color: var(--light); border-color: rgba(255,255,255,0.35); }

.canvas { display: grid; grid-template-columns: 474px 1fr 474px; gap: 14px; padding: 14px; flex: 1; box-sizing: border-box; }

.left-col { display: flex; flex-direction: column; gap: 14px; }
.panel.small { display: grid; grid-template-columns: 56px 1fr; gap: 10px; padding: 2px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.3); background: transparent; }
.icon-circle { width: 56px; height: 56px; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.25) inset; }
.icon-circle.red { background: var(--red); }
.icon-circle.orange { background: var(--orange); }
.icon-circle.blue { background: var(--blue); }
.icon-circle.green { background: var(--green); }
.kpi { display: grid; place-items: center start; }
.kpi-title { font-size: 11.5px; font-weight: 500; }

.panel.block { border: 1px solid rgba(255,255,255,0.2); border-radius: 8.75px; padding: 15px; display: grid; gap: 10px; background: rgba(0,0,0,0.35); }
.panel-header { display: flex; align-items: center; gap: 8px; }
.panel-header .dot { width: 28px; height: 28px; border-radius: 50%; background: var(--blue); }
.panel-title { font-weight: 500; }
.panel-actions { display: flex; gap: 7px; }
.chip { background: rgba(52,152,219,0.2); border: 1px solid rgba(52,152,219,0.3); color: var(--orange); border-radius: 6.75px; padding: 2.75px 8px; }
.icon-btn { width: 28px; height: 28px; background: rgba(255,255,255,0.1); border: 1px solid rgba(127,140,141,0.3); border-radius: 6.75px; }

.stage { background: rgba(0,0,0,0.2); border: 1px solid rgba(127,140,141,0.3); border-radius: 8.75px; display: grid; grid-template-rows: auto 1fr; }
.stage-header { display: flex; gap: 7px; padding: 10px; }
.badge { background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); border-radius: 8.75px; padding: 8px 10px; font-weight: 500; }
.meta { background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); border-radius: 8.75px; padding: 8px 10px; color: var(--muted); }
.stage-body { position: relative; padding: 14px; }
.stage-placeholder { height: 400px; border-radius: 8px; background: repeating-conic-gradient(from 0deg, rgba(255,255,255,.06) 0 10deg, rgba(255,255,255,.1) 10deg 20deg); display: grid; place-items: center; color: var(--muted); }
.view-switch { position: absolute; top: 14px; right: 14px; display: flex; gap: 7px; background: rgba(0,0,0,0.5); padding: 3.5px; border-radius: 8.75px; backdrop-filter: blur(8px); }
.view-switch button { border-radius: 6.75px; padding: 0 10.5px; height: 28px; border: 1px solid rgba(127,140,141,0.3); background: transparent; color: var(--muted); }
.view-switch .primary { background: var(--blue); color: var(--light); border-color: transparent; }

.right-col { display: flex; flex-direction: column; gap: 14px; }
.card { background: rgba(52, 73, 94, 0.5); border: 1px solid rgba(127,140,141,0.3); border-radius: 8.75px; padding: 15px; display: grid; gap: 10.5px; }
.card header { display: grid; grid-template-columns: 17.5px 1fr auto; align-items: center; gap: 10px; }
.card .icon { width: 17.5px; height: 17.5px; border-radius: 3px; }
.card .icon.ok { background: var(--green); }
.card .icon.mid { background: var(--orange); }
.card .icon.high { background: var(--red); }
.card .title { font-weight: 600; font-size: 14px; }
.card .tag { font-size: 10.5px; padding: 2.75px 8px; border-radius: 6.75px; border: 1px solid rgba(127,140,141,0.3); }
.card .tag.low { background: rgba(46,204,113,0.2); color: var(--green); border-color: rgba(46,204,113,0.3); }
.card .tag.mid { background: rgba(243,156,18,0.2); color: var(--orange); border-color: rgba(243,156,18,0.3); }
.card .tag.high { background: rgba(231,76,60,0.2); color: var(--red); border-color: rgba(231,76,60,0.3); }
.card .desc { color: var(--muted); }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.stat { display: grid; gap: 3px; }
.stat label { color: var(--muted-2); font-size: 12px; }

.statusbar { display: grid; grid-template-columns: 1.2fr 1fr 1fr; align-items: center; gap: 14px; padding: 8px 14px; border-top: 1px solid rgba(127,140,141,0.3); background: rgba(44, 62, 80, 0.95); }
.pill { width: 7px; height: 7px; border-radius: 50%; }
.pill.green { background: var(--green); }
.status-left { display: flex; align-items: center; gap: 10px; }
.status-text { font-weight: 600; }
.muted { color: var(--muted-2); }
.status-middle { display: flex; align-items: center; gap: 10px; }
.progress { width: 112px; height: 7px; background: rgba(127,140,141,0.3); border-radius: 999px; overflow: hidden; }
.progress span { display: block; height: 100%; background: #030213; }
.kpi { white-space: nowrap; }
.status-right { display: flex; justify-content: flex-end; gap: 14px; }
</style>


