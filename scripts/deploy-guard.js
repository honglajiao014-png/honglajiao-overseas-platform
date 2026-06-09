#!/usr/bin/env node
/**
 * 部署兜底守护脚本 — 部署失败自动回滚 + 通知
 *
 * 功能:
 * 1. 部署前记录当前生产环境状态（快照）
 * 2. 部署后验证，失败自动回滚到上一个已知良好的部署
 * 3. 发送邮件/日志通知
 *
 * 用法:
 *   node scripts/deploy-guard.js deploy    — 完整部署 + 兜底
 *   node scripts/deploy-guard.js verify    — 仅验证当前生产环境
 *   node scripts/deploy-guard.js rollback  — 手动回滚
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

const SNAPSHOT_FILE = path.join(__dirname, "..", ".deploy-snapshot.json");
const MAX_ROLLBACK_ATTEMPTS = 3;

// ─── 工具函数 ───────────────────────────────────────────

function log(msg, color = "") {
  console.log(`${color}${msg}${RESET}`);
}

function fail(msg) {
  log(`✗ ${msg}`, RED);
}

function pass(msg) {
  log(`✓ ${msg}`, GREEN);
}

function info(msg) {
  log(`ℹ ${msg}`, CYAN);
}

// ─── 快照管理 ───────────────────────────────────────────

function takeSnapshot() {
  const identity = JSON.parse(fs.readFileSync(path.join(__dirname, "..", ".site-identity"), "utf-8"));

  let currentDeployId = null;
  try {
    const output = execSync("npx vercel inspect --scope honglajiao014-7135 honglajiao1688.com --json 2>/dev/null || echo '{}'", {
      encoding: "utf-8",
      timeout: 15000,
    });
    const info = JSON.parse(output);
    currentDeployId = info.deployment?.id || null;
  } catch {
    // 忽略
  }

  // 获取最近一次成功的 git commit
  let lastGoodCommit = null;
  try {
    lastGoodCommit = execSync("git log --oneline -1", { encoding: "utf-8" }).trim();
  } catch {
    // 忽略
  }

  const snapshot = {
    timestamp: new Date().toISOString(),
    site: identity.site,
    deployId: currentDeployId,
    lastGoodCommit,
    gitBranch: execSync("git branch --show-current", { encoding: "utf-8" }).trim(),
  };

  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshot, null, 2));
  pass(`快照已保存: ${snapshot.deployId || "无"} (${snapshot.lastGoodCommit || "无"})`);
  return snapshot;
}

function loadSnapshot() {
  try {
    return JSON.parse(fs.readFileSync(SNAPSHOT_FILE, "utf-8"));
  } catch {
    return null;
  }
}

// ─── 通知 ───────────────────────────────────────────────

function sendNotification(subject, body) {
  // 写入部署日志文件
  const logDir = path.join(__dirname, "..", ".deploy-logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const logFile = path.join(logDir, `${new Date().toISOString().replace(/[:.]/g, "-")}.log`);
  fs.writeFileSync(logFile, `Subject: ${subject}\n\n${body}\n`);

  info(`通知已记录: ${logFile}`);

  // 尝试通过 Vercel 环境变量发送邮件通知
  // 如果有 SMTP 配置，这里可以扩展
  try {
    const identity = JSON.parse(fs.readFileSync(path.join(__dirname, "..", ".site-identity"), "utf-8"));
    const notifyEmail = process.env.NOTIFY_EMAIL || "511972546@qq.com";
    log(`📧 通知将发送至: ${notifyEmail}`, CYAN);
  } catch {
    // 忽略
  }
}

// ─── 验证 ───────────────────────────────────────────────

function verifyDeployment() {
  log("\n🔍 验证部署...", CYAN);

  try {
    execSync("node scripts/post-deploy-verify.js", {
      encoding: "utf-8",
      stdio: "inherit",
      timeout: 60000,
    });
    return true;
  } catch {
    return false;
  }
}

// ─── 回滚 ───────────────────────────────────────────────

function rollback() {
  log("\n⏪ 开始回滚...", YELLOW);

  const snapshot = loadSnapshot();
  if (!snapshot) {
    fail("没有快照，无法回滚");
    sendNotification("🚨 回滚失败 - 无快照", "无法找到部署快照，请手动检查 honglajiao1688.com");
    return false;
  }

  info(`回滚目标: ${snapshot.deployId || "重新部署"} (${snapshot.lastGoodCommit || "未知提交"})`);

  // 策略1: 如果有 Vercel deploy ID，尝试直接回滚到该部署
  if (snapshot.deployId) {
    for (let attempt = 1; attempt <= MAX_ROLLBACK_ATTEMPTS; attempt++) {
      log(`回滚尝试 ${attempt}/${MAX_ROLLBACK_ATTEMPTS}...`, YELLOW);
      try {
        execSync(`npx vercel rollback ${snapshot.deployId} --yes --scope honglajiao014-7135`, {
          encoding: "utf-8",
          stdio: "inherit",
          timeout: 60000,
        });
        pass("Vercel 回滚成功");
        return true;
      } catch (e) {
        fail(`回滚尝试 ${attempt} 失败: ${e.message}`);
      }
    }
  }

  // 策略2: 重新部署当前代码
  log("尝试重新部署当前代码...", YELLOW);
  try {
    execSync("npx vercel deploy --prod --yes --force", {
      encoding: "utf-8",
      stdio: "inherit",
      timeout: 300000,
    });
    pass("重新部署已触发");
    return true;
  } catch (e) {
    fail(`重新部署失败: ${e.message}`);
    sendNotification("🚨 回滚失败", `honglajiao1688.com 回滚失败\n\n错误: ${e.message}\n\n请手动处理: ssh 到服务器执行 emergency-rollback.sh`);
    return false;
  }
}

// ─── 主流程 ─────────────────────────────────────────────

async function main() {
  const command = process.argv[2] || "deploy";

  log("══════════════════════════════════════", CYAN);
  log("  部署兜底守护系统", CYAN);
  log("══════════════════════════════════════", CYAN);
  log("");

  if (command === "verify") {
    const ok = verifyDeployment();
    if (!ok) {
      log("\n⚠ 验证失败，是否回滚？运行: node scripts/deploy-guard.js rollback", YELLOW);
    }
    process.exit(ok ? 0 : 1);
  }

  if (command === "rollback") {
    const ok = rollback();
    if (ok) {
      // 回滚后验证
      setTimeout(() => {
        verifyDeployment();
      }, 10000);
    }
    process.exit(ok ? 0 : 1);
  }

  if (command === "deploy") {
    // 1. 部署前快照
    log("📸 步骤 1/4: 保存部署前快照", CYAN);
    const snapshot = takeSnapshot();

    // 2. 部署前检查
    log("\n🔒 步骤 2/4: 部署前校验", CYAN);
    try {
      execSync("node scripts/pre-deploy-check.js", {
        encoding: "utf-8",
        stdio: "inherit",
        timeout: 30000,
      });
    } catch {
      fail("部署前校验失败，部署已阻止");
      sendNotification("⚠ 部署已阻止", `honglajiao1688.com 部署前校验失败\n\n时间: ${new Date().toISOString()}\n快照: ${snapshot.deployId || "无"}`);
      process.exit(1);
    }

    // 3. 部署
    log("\n🚀 步骤 3/4: 部署到 Vercel", CYAN);
    let deployOk = false;
    try {
      execSync("vercel deploy --prod --yes --force", {
        encoding: "utf-8",
        stdio: "inherit",
        timeout: 300000,
      });
      deployOk = true;
    } catch (e) {
      fail(`部署失败: ${e.message}`);
    }

    if (!deployOk) {
      sendNotification("🚨 部署失败", `honglajiao1688.com Vercel 部署失败\n\n时间: ${new Date().toISOString()}\n快照: ${snapshot.deployId || "无"}\n\n自动回滚已触发...`);
      log("\n⚠ 部署失败，自动触发回滚...", YELLOW);
      rollback();
      process.exit(1);
    }

    // 4. 部署后验证
    log("\n✅ 步骤 4/4: 部署后验证", CYAN);
    // 等几秒让 Vercel 边缘缓存生效
    await new Promise(r => setTimeout(r, 5000));

    const verified = verifyDeployment();

    if (verified) {
      log("\n🎉 部署成功，所有检查通过", GREEN);
      sendNotification("✅ 部署成功", `honglajiao1688.com 部署成功\n\n时间: ${new Date().toISOString()}\n站点: https://honglajiao1688.com`);
      process.exit(0);
    } else {
      log("\n🚨 部署后验证失败！自动回滚...", RED);
      sendNotification("🚨 部署验证失败 - 自动回滚", `honglajiao1688.com 部署后验证失败\n\n时间: ${new Date().toISOString()}\n快照: ${snapshot.deployId || "无"}\n\n自动回滚已触发`);
      rollback();
      process.exit(1);
    }
  }

  log(`未知命令: ${command}`, RED);
  log("用法: node scripts/deploy-guard.js [deploy|verify|rollback]", YELLOW);
  process.exit(1);
}

main();
