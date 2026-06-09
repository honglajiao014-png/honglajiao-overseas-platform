import { NextResponse, type NextRequest } from "next/server";

const LANGS = ["en", "fr", "ar", "zh"];
const COOKIE_NAME = "hlj-lang";
const DEFAULT_LANG = "en";

// middleware 在每个请求前执行
// 确保每个请求都带 hlj-lang cookie，避免 layout 中 cookies() 读取失败
export function middleware(request: NextRequest) {
  const langCookie = request.cookies.get(COOKIE_NAME)?.value;
  if (langCookie && LANGS.includes(langCookie)) {
    // Cookie 有效，直接放行
    return NextResponse.next();
  }

  // Cookie 不存在或无效 → 设置默认值
  const response = NextResponse.next();
  response.cookies.set(COOKIE_NAME, DEFAULT_LANG, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|logo|brands|apple-touch-icon|icon-.*\\..*|robots\\.txt).*)",
  ],
};
