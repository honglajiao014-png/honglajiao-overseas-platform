#!/usr/bin/env node
/**
 * 部署前校验脚本 — 防止代码部署到错误站点
 *
 * 校验项:
 * 1. .vercel/project.json 中的 projectId 是否匹配 .site-identity
 * 2. .site-identity 中的站点标识是否正确
 * 3. package.json 中的项目名是否正确
 * 4. 禁止从错误的目录部署
 *
 * 用法: node scripts/pre-deploy-check.js
 * 退出码: 0=通过, 1=失败(阻止部署)
 */

const fs = require("fs");
const path = require("path");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

let hasError = false;

function fail(msg) {
  console.error(RED + "✗ " + msg + RESET);
  hasError = true;
}

function pass(msg) {
  console.log(GREEN + "✓ " + msg + RESET);
}

function warn(msg) {
  console.log(YELLOW + "⚠ " + msg + RESET);
}

// 1. 读取 .site-identity
const identityPath = path.join(__dirname, "..", ".site-identity");
let identity;
try {
  identity = JSON.parse(fs.readFileSync(identityPath, "utf-8"));
  pass(`.site-identity 已加载: ${identity.site} (${identity.type})`);
} catch (e) {
  fail(`.site-identity 缺失或损坏: ${e.message}`);
  console.error("请运行: node scripts/init-identity.js");
  process.exit(1);
}

// 2. 校验 package.json
const pkgPath = path.join(__dirname, "..", "package.json");
let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const expectedName = identity.type === "overseas" ? "honglajiao-overseas-platform" : "honglingjing-auto-platform";
  if (pkg.name === expectedName) {
    pass(`package.json name 正确: ${pkg.name}`);
  } else {
    fail(`package.json name 不匹配! 期望: ${expectedName}, 实际: ${pkg.name}`);
  }
} catch (e) {
  fail(`package.json 读取失败: ${e.message}`);
}

// 3. 校验 .vercel/project.json
const vercelPath = path.join(__dirname, "..", ".vercel", "project.json");
let vercel;
try {
  vercel = JSON.parse(fs.readFileSync(vercelPath, "utf-8"));
  if (vercel.projectId === identity.projectId) {
    pass(`.vercel/project.json 匹配: ${vercel.projectName} (${vercel.projectId})`);
  } else {
    fail(`.vercel/project.json 不匹配! 期望 projectId: ${identity.projectId}, 实际: ${vercel.projectId}`);
    console.error(`  当前链接到: ${vercel.projectName}`);
    console.error(`  应该链接到: ${identity.projectName}`);
    console.error(`  修复: npx vercel link --project ${identity.projectName} --yes`);
  }
} catch (e) {
  fail(`.vercel/project.json 缺失或损坏: ${e.message}`);
  console.error(`  修复: npx vercel link --project ${identity.projectName} --yes`);
}

// 4. 校验关键文件存在（防止代码被覆盖）
const keyFiles = identity.type === "overseas"
  ? ["src/i18n/useT.ts", "src/i18n/LangContext.tsx", "src/i18n/translations.ts"]
  : ["src/app/dealer/vehicles/new/VehicleForm.tsx", "src/app/api/vehicles/create/route.ts"];

for (const f of keyFiles) {
  const fullPath = path.join(__dirname, "..", f);
  if (fs.existsSync(fullPath)) {
    pass(`关键文件存在: ${f}`);
  } else {
    fail(`关键文件缺失: ${f} — 代码可能被错误覆盖!`);
  }
}

// 5. 校验 layout.tsx 标题
const layoutPath = path.join(__dirname, "..", "src", "app", "layout.tsx");
try {
  const layoutContent = fs.readFileSync(layoutPath, "utf-8");
  if (layoutContent.includes(identity.title)) {
    pass(`layout.tsx 标题匹配: ${identity.title.substring(0, 50)}...`);
  } else {
    fail(`layout.tsx 标题不匹配! 期望包含: "${identity.title}"`);
    console.error("  代码可能被错误覆盖!");
  }
} catch (e) {
  fail(`layout.tsx 读取失败: ${e.message}`);
}

// 6. 校验 .gitignore 不忽略 .vercel
const gitignorePath = path.join(__dirname, "..", ".gitignore");
try {
  const gitignore = fs.readFileSync(gitignorePath, "utf-8");
  if (gitignore.split("\n").some(line => line.trim() === ".vercel")) {
    fail(".gitignore 仍在忽略 .vercel/ — 项目链接可能丢失!");
    console.error("  修复: 从 .gitignore 中移除 .vercel 行");
  } else {
    pass(".gitignore 未忽略 .vercel");
  }
} catch (e) {
  warn(`.gitignore 检查失败: ${e.message}`);
}

// 7. 校验 git remote
const { execSync } = require("child_process");
try {
  const remote = execSync("git remote get-url origin 2>/dev/null || echo ''", { encoding: "utf-8" }).trim();
  if (!remote) {
    fail("git remote 未配置! 代码无法推送/回滚!");
    console.error("  修复: git remote add origin <仓库URL>");
  } else {
    pass(`git remote 已配置: ${remote}`);
  }
} catch (e) {
  fail(`git remote 检查失败: ${e.message}`);
}

// 结果
console.log("");
if (hasError) {
  console.error(RED + "══════════════════════════════════════" + RESET);
  console.error(RED + "  部署前校验失败! 部署已阻止." + RESET);
  console.error(RED + "  请修复以上问题后重试." + RESET);
  console.error(RED + "══════════════════════════════════════" + RESET);
  process.exit(1);
} else {
  console.log(GREEN + "══════════════════════════════════════" + RESET);
  console.log(GREEN + "  部署前校验通过 ✓" + RESET);
  console.log(GREEN + "══════════════════════════════════════" + RESET);
  process.exit(0);
}
