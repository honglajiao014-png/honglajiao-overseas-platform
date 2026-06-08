#!/usr/bin/env node
/**
 * 部署前防混淆检查 — 海外站 (honglajiao1688.com)
 * 在 vercel build 前自动运行，确保不会把海外站代码部署到国内站
 */

const fs = require('fs');
const path = require('path');

const EXPECTED = {
  site: 'honglajiao1688.com',
  projectId: 'prj_VRrwzHwYXyCwcDUFe17lCkrwatY3',
  type: 'overseas',
};

let errors = [];

// 1. 检查 .site-identity
try {
  const identity = JSON.parse(fs.readFileSync(path.join(__dirname, '.site-identity'), 'utf-8'));
  for (const [key, expected] of Object.entries(EXPECTED)) {
    if (identity[key] !== expected) {
      errors.push(`.site-identity 不匹配: ${key} 期望 "${expected}", 实际 "${identity[key]}"`);
    }
  }
  console.log('✅ .site-identity 检查通过');
} catch (e) {
  errors.push(`.site-identity 读取失败: ${e.message}`);
}

// 2. 检查 .vercel/project.json（最关键！这是上次混淆的根因）
try {
  const vc = JSON.parse(fs.readFileSync(path.join(__dirname, '.vercel', 'project.json'), 'utf-8'));
  if (vc.projectId !== EXPECTED.projectId) {
    errors.push(`🚨 严重错误: .vercel/project.json projectId 指向了错误项目！期望 "${EXPECTED.projectId}", 实际 "${vc.projectId}" — 这会部署到错误的站点！`);
  }
  console.log('✅ .vercel/project.json 检查通过 (projectId: ' + vc.projectId + ')');
} catch (e) {
  errors.push(`.vercel/project.json 读取失败: ${e.message}`);
}

// 3. 检查关键文件（防止代码被覆盖）
const KEY_FILES = [
  'src/app/layout.tsx',
  'src/middleware.ts',
  '.site-identity',
];
for (const f of KEY_FILES) {
  if (!fs.existsSync(path.join(__dirname, f))) {
    errors.push(`关键文件缺失: ${f}`);
  }
}
console.log('✅ 关键文件检查通过');

// 4. 检查 layout.tsx 标题（防止代码被国内站覆盖）
try {
  const layout = fs.readFileSync(path.join(__dirname, 'src/app/layout.tsx'), 'utf-8');
  if (!layout.includes('ChinaCarExport') && !layout.includes('honglajiao')) {
    errors.push('layout.tsx 中未找到"ChinaCarExport"或"honglajiao"标识，代码可能被国内站覆盖！');
  }
  console.log('✅ layout.tsx 身份标识检查通过');
} catch (e) {
  errors.push(`layout.tsx 读取失败: ${e.message}`);
}

if (errors.length > 0) {
  console.error('\n❌ 部署前检查失败！这可能是海外站代码被错误部署到国内站！');
  errors.forEach(e => console.error(`  - ${e}`));
  console.error('\n部署已中止。请检查 .vercel/project.json 和 .site-identity。');
  process.exit(1);
}

console.log('\n🎉 所有检查通过 — 海外站 (honglajiao1688.com) 身份确认，可以安全部署。');
