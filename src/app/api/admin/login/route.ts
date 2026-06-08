import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

const ADMIN_USER = "honglajiao1688";
const ADMIN_PASS = "070909@";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = signToken({ userId: "admin", role: "admin" });
      return NextResponse.json({ success: true, token });
    }
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
