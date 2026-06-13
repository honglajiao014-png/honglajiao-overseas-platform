import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_SECRET_STR: string = JWT_SECRET;

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET_STR, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_STR) as unknown as { userId: string; role: string };
    if (decoded.userId && decoded.role) return decoded;
    return null;
  } catch {
    return null;
  }
}
