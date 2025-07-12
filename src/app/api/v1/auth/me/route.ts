// src/app/api/v1/auth/me/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase"; // Use the same admin client

export async function GET(req: NextRequest) {
  try {
    // 1. Read the token from the secure cookie your login route set
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Ask Supabase who this token belongs to
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 3. If token is valid, fetch the latest profile data (just like your login route)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*") // You can specify columns like 'id, username, points' etc.
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found for valid token" },
        { status: 404 }
      );
    }

    // 4. Return the full user profile object
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        ...profile,
      },
    });
  } catch (e) {
    console.error("Me API Error:", e);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
