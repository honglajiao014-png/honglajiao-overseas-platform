// @ts-nocheck
/**
 * Vercel Cron Job: 每日线索汇总邮件
 * GET /api/cron/daily-lead-summary
 * Authorization: Bearer <CRON_SECRET>
 * 每天 22:00 触发，汇总当天所有新建 CustomerLead 发送到 511972546@qq.com
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")?.replace("Bearer ", "");
  const expected = process.env.CRON_SECRET;

  if (!expected || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 查询今天 00:00:00 至今创建的 CustomerLead
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const leads = await prisma.customerLead.findMany({
      where: { createdAt: { gte: todayStart } },
      orderBy: { intentLevel: "desc" },
    });

    const total = leads.length;
    const l3l4 = leads.filter(l => l.intentLevel >= 3);
    const l1l2 = leads.filter(l => l.intentLevel >= 1 && l.intentLevel <= 2);
    const l0 = leads.filter(l => l.intentLevel === 0);

    // 构建邮件内容
    const dateStr = todayStart.toISOString().split("T")[0];
    const lines: string[] = [];
    lines.push(`📊 每日线索汇总 — ${dateStr}`);
    lines.push("");
    lines.push(`━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`总线索数: ${total}`);
    lines.push(`  L3/L4 高意向: ${l3l4.length}`);
    lines.push(`  L1/L2 意向: ${l1l2.length}`);
    lines.push(`  L0 未分级: ${l0.length}`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━`);

    if (l3l4.length > 0) {
      lines.push("");
      lines.push("🔥 高意向线索 (L3/L4):");
      for (const l of l3l4) {
        const parts: string[] = [];
        if (l.email) parts.push(`📧 ${l.email}`);
        if (l.name) parts.push(`👤 ${l.name}`);
        if (l.phone) parts.push(`📱 ${l.phone}`);
        if (l.country) parts.push(`🌍 ${l.country}`);
        if (l.vehicleReq) parts.push(`🚗 ${l.vehicleReq}`);
        if (l.budget) parts.push(`💰 ${l.budget}`);
        if (l.quantity) parts.push(`📦 ${l.quantity} units`);
        parts.push(`🏷 L${l.intentLevel}`);
        parts.push(`📌 ${l.source}`);
        lines.push(`  • ${parts.join(" | ")}`);
        if (l.notes) {
          lines.push(`    📝 ${l.notes.substring(0, 200)}`);
        }
      }
    }

    if (l1l2.length > 0) {
      lines.push("");
      lines.push("📋 意向线索 (L1/L2):");
      for (const l of l1l2) {
        const parts: string[] = [];
        if (l.email) parts.push(`📧 ${l.email}`);
        if (l.country) parts.push(`🌍 ${l.country}`);
        if (l.vehicleReq) parts.push(`🚗 ${l.vehicleReq}`);
        parts.push(`🏷 L${l.intentLevel}`);
        lines.push(`  • ${parts.join(" | ")}`);
      }
    }

    lines.push("");
    lines.push("---");
    lines.push("ChinaCarExport 自动汇总");
    lines.push("https://honglajiao1688.com/admin");

    // 发送邮件
    const smtpConfigured = process.env.SMTP_PASS && process.env.SMTP_USER;
    if (smtpConfigured) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.qq.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER || "",
          pass: process.env.SMTP_PASS || "",
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: "511972546@qq.com",
        subject: `📊 每日线索汇总 — ${dateStr} (共${total}条)`,
        text: lines.join("\n"),
      });
      console.log(`[daily-lead-summary] Email sent: ${total} leads`);
    } else {
      console.log("[daily-lead-summary] SMTP not configured, logging only:");
      console.log(lines.join("\n"));
    }

    return NextResponse.json({
      date: dateStr,
      total,
      l3l4: l3l4.length,
      l1l2: l1l2.length,
      l0: l0.length,
      emailSent: smtpConfigured,
    });
  } catch (e: any) {
    console.error("[daily-lead-summary] Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
