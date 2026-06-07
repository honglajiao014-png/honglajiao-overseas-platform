import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 登录校验（海外站用 Authorization header）
    const auth = req.headers.get("authorization")?.split(" ")[1];
    if (!auth) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const payload = verifyToken(auth);
    if (!payload) return NextResponse.json({ error: "登录已过期" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const angle = formData.get("angle") as string;

    if (!file || !angle) {
      return NextResponse.json({ error: "缺少文件或角度参数" }, { status: 400 });
    }

    // 服务端校验：MIME 类型白名单 + 文件大小限制
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "仅支持 JPEG/PNG/WebP/GIF/AVIF 格式" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "图片不能超过 10MB" }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._一-鿿-]/g, "_");
    const pathname = `uploads/${angle}_${timestamp}_${safeName}`;

    const { put } = await import("@vercel/blob");
    const blob = await put(pathname, file, {
      access: "public",
      ...(process.env.BLOB_STORE_ID ? { storeId: process.env.BLOB_STORE_ID } : {}),
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error("[upload] 失败:", error?.message || error, error?.stack);
    return NextResponse.json({ error: "上传失败: " + (error?.message || "未知错误") }, { status: 500 });
  }
}
