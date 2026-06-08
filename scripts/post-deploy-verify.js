#!/usr/bin/env node
/**
 * 部署后自动校验脚本 — 验证生产环境是否正确
 *
 * 校验项:
 * 1. 生产环境 HTTP 可达性
 * 2. 页面标题是否匹配 .site-identity
 * 3. /api/health 健康检查
 * 4. /api/health/blob Blob 检查
 * 5. 标题不匹配时自动告警
 *
 * 用法: node scripts/post-deploy-verify.js [--rollback]
 * 退出码: 0=正常, 1=异常
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

// 读取身份
const identity = JSON.parse(fs.readFileSync(path.join(__dirname, "..", ".site-identity"), "utf-8"));
const SITE_URL = `https://${identity.site}`;

async function verify() {
  console.log(`正在验证 ${SITE_URL} ...\n`);

  // 1. HTTP 可达性
  try {
    const res = await fetch(SITE_URL, { signal: AbortSignal.timeout(15000) });
    if (res.ok) {
      pass(`HTTP ${res.status} — 站点可达`);
    } else {
      fail(`HTTP ${res.status} — 站点异常`);
    }
  } catch (e) {
    fail(`站点不可达: ${e.message}`);
    process.exit(1);
  }

  // 2. 标题校验
  try {
    const res = await fetch(SITE_URL, { signal: AbortSignal.timeout(15000) });
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    const actualTitle = titleMatch ? titleMatch[1] : "未找到标题";

    // HTML 实体解码
    const decodedTitle = actualTitle.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');

    if (decodedTitle === identity.title) {
      pass(`标题匹配: "${decodedTitle}"`);
    } else {
      fail(`标题不匹配!`);
      console.error(`  期望: "${identity.title}"`);
      console.error(`  实际: "${decodedTitle}"`);
      console.error(`  代码可能被部署到了错误站点!`);
    }
  } catch (e) {
    fail(`标题校验失败: ${e.message}`);
  }

  // 3. 健康检查
  try {
    const res = await fetch(`${SITE_URL}/api/health`, { signal: AbortSignal.timeout(15000) });
    const health = await res.json();
    if (health.status === "healthy") {
      pass(`健康检查: healthy`);
      for (const [k, v] of Object.entries(health.checks)) {
        const icon = v.ok ? "✓" : "✗";
        console.log(`    ${icon} ${k}: ${v.detail}`);
      }
    } else {
      fail(`健康检查: ${health.status}`);
      for (const [k, v] of Object.entries(health.checks)) {
        if (!v.ok) console.error(`    ✗ ${k}: ${v.detail}`);
      }
    }
  } catch (e) {
    fail(`健康检查失败: ${e.message}`);
  }

  // 4. Blob 检查
  try {
    const res = await fetch(`${SITE_URL}/api/health/blob`, { signal: AbortSignal.timeout(15000) });
    const blob = await res.json();
    if (blob.status === "healthy") {
      pass(`Blob 存储: healthy`);
    } else {
      fail(`Blob 存储: ${blob.status}`);
    }
  } catch (e) {
    fail(`Blob 检查失败: ${e.message}`);
  }

  // 结果
  console.log("");
  if (hasError) {
    console.error(RED + "══════════════════════════════════════" + RESET);
    console.error(RED + "  部署后校验失败!" + RESET);
    console.error(RED + `  站点 ${identity.site} 可能被错误代码覆盖!` + RESET);
    console.error(RED + "" + RESET);
    console.error(RED + "  紧急恢复步骤:" + RESET);
    console.error(RED + "  1. git log --oneline -5 查看最近提交" + RESET);
    console.error(RED + "  2. 确认 .vercel/project.json 指向正确项目" + RESET);
    console.error(RED + "  3. 重新部署正确代码: vercel deploy --prod --yes --force" + RESET);
    console.error(RED + "══════════════════════════════════════" + RESET);
    process.exit(1);
  } else {
    console.log(GREEN + "══════════════════════════════════════" + RESET);
    console.log(GREEN + `  ${identity.site} 部署验证通过 ✓` + RESET);
    console.log(GREEN + "══════════════════════════════════════" + RESET);
    process.exit(0);
  }
}

verify();
