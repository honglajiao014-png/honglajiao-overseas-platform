// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "inquiries");
const DATA_FILE = path.join(DATA_DIR, "inquiries.json");

interface Inquiry {
  id: string;
  name: string;
  contact: string;
  message: string;
  type: "chat" | "inquiry";
  lang: string;
  timestamp: string;
  ip: string;
}

async function readInquiries(): Promise<Inquiry[]> {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeInquiries(inquiries: Inquiry[]): Promise<void> {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, contact, message, type = "chat", lang = "en" } = body;

    if (!name || !contact || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const inquiry: Inquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: String(name).trim(),
      contact: String(contact).trim(),
      message: String(message).trim(),
      type,
      lang,
      timestamp: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    };

    const inquiries = await readInquiries();
    inquiries.push(inquiry);
    await writeInquiries(inquiries);

    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error("Inquiry API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const inquiries = await readInquiries();
    return NextResponse.json({ count: inquiries.length, inquiries: inquiries.slice(-50).reverse() });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
