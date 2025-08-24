import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetchPkg from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIGMA_FILE_URL = process.env.FIGMA_FILE_URL;
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_NODE_ID = process.env.FIGMA_NODE_ID || undefined;

if (!FIGMA_FILE_URL || !FIGMA_TOKEN) {
  console.error('[figma] 请在环境变量中配置 FIGMA_FILE_URL 与 FIGMA_TOKEN');
  process.exit(1);
}

function extractFileKey(figmaUrl) {
  // Accepts both /file/ and /design/ URLs
  const match = figmaUrl.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)\//);
  if (!match) return null;
  return match[1];
}

const fileKey = extractFileKey(FIGMA_FILE_URL);
if (!fileKey) {
  console.error('[figma] 无法从 FIGMA_FILE_URL 解析 file key');
  process.exit(1);
}

const outDir = path.resolve(__dirname, '../apps/web/public/figma');
fs.mkdirSync(outDir, { recursive: true });

const fetchFn = (globalThis.fetch ? globalThis.fetch : fetchPkg);

async function fetchJson(url) {
  const res = await fetchFn(url, {
    headers: {
      'X-Figma-Token': FIGMA_TOKEN
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

async function fetchBuffer(url) {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.arrayBuffer) {
    return Buffer.from(await res.arrayBuffer());
  }
  const buf = await res.buffer();
  return buf;
}

async function main() {
  console.log(`[figma] 拉取文件 ${fileKey} ...`);
  const fileJson = await fetchJson(`https://api.figma.com/v1/files/${fileKey}`);
  fs.writeFileSync(path.join(outDir, 'file.json'), JSON.stringify(fileJson, null, 2));

  // Collect frame/node ids (optionally filter by FIGMA_NODE_ID)
  function collectNodes(node, acc = []) {
    if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
      acc.push(node.id);
    }
    if (node.children) node.children.forEach(child => collectNodes(child, acc));
    return acc;
  }
  const allNodeIds = collectNodes(fileJson.document);
  const targetNodeIds = FIGMA_NODE_ID ? [FIGMA_NODE_ID] : allNodeIds.slice(0, 30); // limit for demo

  if (targetNodeIds.length === 0) {
    console.log('[figma] 未发现可导出的 FRAME/COMPONENT');
    return;
  }

  console.log(`[figma] 导出节点数量: ${targetNodeIds.length}`);
  const imagesJson = await fetchJson(
    `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(targetNodeIds.join(','))}&format=png&scale=2`
  );

  const idToUrl = imagesJson.images || {};
  for (const [id, url] of Object.entries(idToUrl)) {
    if (!url) continue;
    const buf = await fetchBuffer(url);
    const outPath = path.join(outDir, `${id}.png`);
    fs.writeFileSync(outPath, buf);
    console.log(`[figma] 保存: ${outPath}`);
  }

  console.log('[figma] 完成');
}

main().catch(err => {
  console.error('[figma] 失败:', err);
  process.exit(1);
});


