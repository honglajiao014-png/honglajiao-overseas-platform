import nodemailer from "nodemailer";

interface LeadInfo {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  vehicleReq?: string;
  intentLevel: number;
  chatSummary?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.qq.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "511972546@qq.com";

export async function sendLeadNotification(lead: LeadInfo) {
  // 检查是否配置了 SMTP
  if (!process.env.SMTP_PASS || !process.env.SMTP_USER) {
    console.log("[LeadNotify] SMTP not configured, skipping email");
    return;
  }

  const subject = `📩 新客户线索 - ChinaCarExport (L${lead.intentLevel})`;

  const parts: string[] = [];
  if (lead.name) parts.push(`👤 姓名: ${lead.name}`);
  if (lead.email) parts.push(`📧 邮箱: ${lead.email}`);
  if (lead.phone) parts.push(`📱 电话: ${lead.phone}`);
  if (lead.country) parts.push(`🌍 国家: ${lead.country}`);
  if (lead.vehicleReq) parts.push(`🚗 需求: ${lead.vehicleReq}`);
  parts.push(`🏷 意向等级: L${lead.intentLevel}`);
  if (lead.chatSummary) parts.push(`\n💬 对话摘要:\n${lead.chatSummary}`);

  const text = `新客户线索来自网页客服对话\n\n${parts.join("\n")}\n\n---\nChinaCarExport 自动通知\nhttps://honglajiao1688.com/admin`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: NOTIFY_EMAIL,
      subject,
      text,
    });
    console.log(`[LeadNotify] Email sent to ${NOTIFY_EMAIL}`);
  } catch (e) {
    console.error("[LeadNotify] Failed to send email:", e);
  }
}

const recentNotified = new Set<string>();

export function shouldNotifyLead(key: string): boolean {
  if (recentNotified.has(key)) return false;
  recentNotified.add(key);
  // 清理旧记录，防止内存泄漏
  setTimeout(() => recentNotified.delete(key), 600_000); // 10分钟内不重复通知同一个人
  return true;
}
