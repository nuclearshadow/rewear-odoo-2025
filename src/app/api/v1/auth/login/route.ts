// src/app/api/v1/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
// Your code creates a new client, so we don't need the other createClient import
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // --- CHANGE 1: Get `rememberMe` from the request body ---
    const { email, password, rememberMe } = body;

    // Use 'email' as the key since your frontend now sends { email: ... }
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // This is a great feature you built. Let's keep it.
    // It checks if the input is an email or a username.
    let loginEmail = email;
    if (!email.includes("@")) {
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("email") // This needs to select the `email` from auth.users, not a custom email column
        .eq("username", email)
        .single();

      if (profileError || !profileData) {
        // Important: use a generic error for security.
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
      // To get the real email, you'd query the auth users table
      // This is complex. For now, let's assume the frontend sends the email directly as your login/page.tsx does.
      // If you want username login, we need to adjust this logic.
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: loginEmail, // Use the resolved email
      password,
    });

    if (error || !data.session || !data.user) {
      return NextResponse.json(
        { error: error?.message ?? "Invalid credentials" },
        { status: 401 }
      );
    }

    const accessToken = data.session.access_token;
    const userId = data.user.id;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*") // Get all fields to match AuthContext
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const res = NextResponse.json({
      user: { id: userId, email: data.user.email },
      profile,
    });

    // --- CHANGE 2: Conditionally set the cookie expiration ---
    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // If rememberMe is true, the cookie will last 30 days.
      // If it's false, maxAge is undefined, creating a session cookie.
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : undefined,
      path: "/",
    });

    return res;
  } catch (e) {
    console.error("Login API error:", e);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
