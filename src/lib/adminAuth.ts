import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function requireAdmin(req: NextRequest): { userId: string; role: string } | null {
  const auth = req.headers.get("authorization")?.split(" ")[1];
  if (!auth) return null;
  const payload = verifyToken(auth);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}
