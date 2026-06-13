// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state") || "/";
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(new URL(`/login?error=${error}`, req.url));
    }
    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", req.url));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL("/login?error=google_not_configured", req.url));
    }

    const origin = new URL(req.url).origin;
    const redirectUri = `${origin}/api/auth/oauth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", req.url));
    }

    const tokens = await tokenRes.json();
    const accessToken = tokens.access_token;

    // Get user info from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/login?error=userinfo_failed", req.url));
    }

    const googleUser = await userRes.json();
    const email = googleUser.email;
    const name = googleUser.name || googleUser.email?.split("@")[0] || "User";
    const googleId = googleUser.id;

    if (!email) {
      return NextResponse.redirect(new URL("/login?error=no_email", req.url));
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Create new user via Google OAuth
      const randomPassword = hashPassword(crypto.randomBytes(32).toString("hex"));
      user = await prisma.user.create({
        data: {
          email,
          password: randomPassword,
          name,
          role: "dealer",
          avatar: googleUser.picture || null,
        },
      });
    }

    // Sign JWT and redirect
    const token = signToken({ userId: user.id, role: user.role });

    // Set cookie and redirect
    const response = NextResponse.redirect(new URL(state, req.url));
    response.cookies.set("hlj_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Also set in redirect URL hash for frontend to pick up
    const redirectUrl = new URL(state, req.url);
    redirectUrl.searchParams.set("token", token);
    return NextResponse.redirect(redirectUrl);
  } catch (e: any) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(e.message)}`, req.url));
  }
}
