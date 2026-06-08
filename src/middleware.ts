import { NextResponse, type NextRequest } from "next/server";

const LANGS = ["en", "fr", "zh"];
const COOKIE_NAME = "hlj-lang";
const DEFAULT_LANG = "en";

// middleware 在每个请求前执行，比 layout 的 cookies() 更可靠
export function middleware(request: NextRequest) {
  const langCookie = request.cookies.get(COOKIE_NAME)?.value;
  const lang = langCookie && LANGS.includes(langCookie) ? langCookie : DEFAULT_LANG;

  // 克隆请求头，传入 x-hlj-lang 供 layout 读取
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-hlj-lang", lang);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // 如果 cookie 无效或不存在，设置一个默认的
  if (!langCookie || !LANGS.includes(langCookie)) {
    response.cookies.set(COOKIE_NAME, DEFAULT_LANG, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    // 所有页面路由，排除静态资源和 API
    "/((?!_next/static|_next/image|favicon|logo|brands|apple-touch-icon|icon-\\.*\\..*|robots\\.txt).*)",
  ],
};
