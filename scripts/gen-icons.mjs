/**
 * VOIDMIND Icon Generator
 * SVG → PNG (多尺寸) → ICO (Windows) → ICNS (macOS, 需要系统 iconutil)
 */

import sharp from 'sharp';
import toIco from 'to-ico';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(__dirname, '../assets');
fs.mkdirSync(ASSETS, { recursive: true });

/* ── SVG 图标设计 ──
   圆角矩形，深紫渐变背景，中央 "VM" 字母组合
   + 顶部细光晕 + 底部淡紫描边，简洁有质感
*/
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <!-- 背景渐变：深黑 → 深紫 -->
    <radialGradient id="bg" cx="50%" cy="38%" r="65%">
      <stop offset="0%"   stop-color="#1a0f40"/>
      <stop offset="100%" stop-color="#07070e"/>
    </radialGradient>

    <!-- 中心光晕 -->
    <radialGradient id="glow" cx="50%" cy="46%" r="42%">
      <stop offset="0%"   stop-color="#6d3fd4" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#6d3fd4" stop-opacity="0"/>
    </radialGradient>

    <!-- VM 文字渐变 -->
    <linearGradient id="text-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#c4b5fd"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>

    <!-- 圆角裁剪 -->
    <clipPath id="rounded">
      <rect width="1024" height="1024" rx="230" ry="230"/>
    </clipPath>
  </defs>

  <!-- 背景 -->
  <rect width="1024" height="1024" rx="230" ry="230" fill="url(#bg)"/>

  <!-- 光晕层 -->
  <rect width="1024" height="1024" rx="230" ry="230" fill="url(#glow)"/>

  <!-- 外描边 -->
  <rect x="2" y="2" width="1020" height="1020" rx="229" ry="229"
        fill="none" stroke="#4c2d9e" stroke-width="3" opacity="0.7"/>

  <!-- 内发光描边 -->
  <rect x="18" y="18" width="988" height="988" rx="216" ry="216"
        fill="none" stroke="#8b5cf6" stroke-width="1.5" opacity="0.2"/>

  <!-- 顶部高光弧 -->
  <ellipse cx="512" cy="200" rx="280" ry="60"
           fill="none" stroke="#a78bfa" stroke-width="1" opacity="0.25"/>

  <!-- 中心紫色光晕圆 -->
  <circle cx="512" cy="470" r="260" fill="#6d3fd4" opacity="0.08"/>

  <!-- VM 大字（填充渐变，居中） -->
  <text x="512" y="610"
        font-family="'Arial Black', 'Arial', sans-serif"
        font-size="420"
        font-weight="900"
        letter-spacing="-18"
        text-anchor="middle"
        fill="url(#text-grad)">VM</text>

  <!-- VM 文字微光描边 -->
  <text x="512" y="610"
        font-family="'Arial Black', 'Arial', sans-serif"
        font-size="420"
        font-weight="900"
        letter-spacing="-18"
        text-anchor="middle"
        fill="none"
        stroke="#c4b5fd"
        stroke-width="1.5"
        opacity="0.3">VM</text>

  <!-- M 字形（叠在 V 右侧，构成 VM 整体感） -->
  <!-- 用底部小字 "VOID·MIND" 替代，保持 logo 简洁 -->

  <!-- 底部品牌小字 -->
  <text x="512" y="820"
        font-family="'Arial', sans-serif"
        font-size="72"
        font-weight="700"
        letter-spacing="22"
        text-anchor="middle"
        fill="#c4b5fd"
        opacity="0.55">VOIDMIND</text>

  <!-- 底部装饰点 -->
  <circle cx="512" cy="880" r="5" fill="#8b5cf6" opacity="0.6"/>
  <circle cx="484" cy="880" r="3" fill="#6d3fd4" opacity="0.4"/>
  <circle cx="540" cy="880" r="3" fill="#6d3fd4" opacity="0.4"/>
</svg>`;

const SVG_PATH = path.join(ASSETS, 'icon.svg');
fs.writeFileSync(SVG_PATH, SVG);
console.log('✓ icon.svg 生成完毕');

// ── 生成 PNG 各尺寸 ──
const PNG_SIZES = [16, 24, 32, 48, 64, 128, 256, 512, 1024];
const pngFiles = {};

console.log('正在生成 PNG...');
for (const size of PNG_SIZES) {
  const outPath = path.join(ASSETS, `icon-${size}.png`);
  await sharp(Buffer.from(SVG))
    .resize(size, size)
    .png()
    .toFile(outPath);
  pngFiles[size] = outPath;
  process.stdout.write(` ${size}px`);
}
console.log('\n✓ PNG 全部生成');

// 主 icon.png (1024)
fs.copyFileSync(pngFiles[1024], path.join(ASSETS, 'icon.png'));
console.log('✓ icon.png (1024×1024)');

// ── Windows ICO ──
console.log('正在生成 icon.ico...');
const icoSizes = [16, 24, 32, 48, 64, 128, 256];
const icoBuffers = icoSizes.map(s => fs.readFileSync(pngFiles[s]));
const ico = await toIco(icoBuffers);
fs.writeFileSync(path.join(ASSETS, 'icon.ico'), ico);
console.log('✓ icon.ico (Windows)');

// ── macOS ICNS ──
// 用 macOS 内置的 sips + iconutil 生成 .icns
console.log('正在生成 icon.icns...');
const icnsDir = path.join(ASSETS, 'icon.iconset');
fs.mkdirSync(icnsDir, { recursive: true });

const icnsMap = [
  { file: 'icon_16x16.png',      size: 16 },
  { file: 'icon_16x16@2x.png',   size: 32 },
  { file: 'icon_32x32.png',      size: 32 },
  { file: 'icon_32x32@2x.png',   size: 64 },
  { file: 'icon_64x64.png',      size: 64 },
  { file: 'icon_64x64@2x.png',   size: 128 },
  { file: 'icon_128x128.png',    size: 128 },
  { file: 'icon_128x128@2x.png', size: 256 },
  { file: 'icon_256x256.png',    size: 256 },
  { file: 'icon_256x256@2x.png', size: 512 },
  { file: 'icon_512x512.png',    size: 512 },
  { file: 'icon_512x512@2x.png', size: 1024 },
];

for (const { file, size } of icnsMap) {
  fs.copyFileSync(pngFiles[size], path.join(icnsDir, file));
}

try {
  execSync(`iconutil -c icns "${icnsDir}" -o "${path.join(ASSETS, 'icon.icns')}"`, { stdio: 'pipe' });
  console.log('✓ icon.icns (macOS)');
} catch {
  console.log('⚠ iconutil 不可用（非 macOS），跳过 .icns 生成');
  console.log('  → electron-builder 会用 icon.png 代替，打包 macOS 时在 Mac 上运行一次 npm run gen-icons 即可');
}

// 清理临时 iconset 目录
fs.rmSync(icnsDir, { recursive: true, force: true });

// 清理单尺寸 PNG（只保留 icon.png / icon.ico / icon.icns）
for (const size of PNG_SIZES) {
  fs.rmSync(pngFiles[size], { force: true });
}

console.log('\n✅ 图标生成完毕！assets/ 目录下：');
fs.readdirSync(ASSETS).forEach(f => console.log('  ', f));
