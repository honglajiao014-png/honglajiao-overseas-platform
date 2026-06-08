import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")?.split(" ")[1];
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { verifyToken } = await import("@/lib/auth");
  const payload = verifyToken(auth);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const leads = await prisma.customerLead.findMany({
    orderBy: { createdAt: "desc" },
  });

  // ExcelJS for .xlsx generation
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("客户数据");

  sheet.columns = [
    { header: "ID", key: "id", width: 25 },
    { header: "姓名", key: "name", width: 15 },
    { header: "邮箱", key: "email", width: 30 },
    { header: "电话", key: "phone", width: 20 },
    { header: "国家", key: "country", width: 15 },
    { header: "需求车型", key: "vehicleReq", width: 20 },
    { header: "预算", key: "budget", width: 15 },
    { header: "数量", key: "quantity", width: 10 },
    { header: "来源", key: "source", width: 15 },
    { header: "意向等级", key: "intentLevel", width: 12 },
    { header: "开发信已发", key: "emailSent", width: 12 },
    { header: "发送时间", key: "emailSentAt", width: 20 },
    { header: "备注", key: "notes", width: 30 },
    { header: "创建时间", key: "createdAt", width: 20 },
  ];

  for (const lead of leads) {
    sheet.addRow({
      id: lead.id,
      name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      country: lead.country || "",
      vehicleReq: lead.vehicleReq || "",
      budget: lead.budget || "",
      quantity: lead.quantity || "",
      source: lead.source || "",
      intentLevel: `L${lead.intentLevel}`,
      emailSent: lead.emailSent ? "✅ 已发" : "⬜ 未发",
      emailSentAt: lead.emailSentAt?.toISOString() || "",
      notes: lead.notes || "",
      createdAt: lead.createdAt.toISOString(),
    });
  }

  // Style header
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A1A1A" } };
  sheet.getRow(1).alignment = { horizontal: "center" };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="customer_data_${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
