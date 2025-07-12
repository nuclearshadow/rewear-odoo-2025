// src/app/api/v1/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, username } = body;

    // Basic validation
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // --- This is a critical two-step process ---

    // Step 1: Create the user in the 'auth.users' table.
    // By default, Supabase will send a confirmation email.
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signUp({
        email,
        password,
      });

    if (authError) {
      // This error will trigger if the email is already in use
      console.error("Sign-up Auth Error:", authError.message);
      return NextResponse.json({ error: authError.message }, { status: 409 }); // 409 Conflict
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Could not create user." },
        { status: 500 }
      );
    }

    // Step 2: Create the corresponding public profile in the 'profiles' table.
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id, // Link to the auth user
        username: username,
        // You can add default points here if you want
        // points_balance: 50
      });

    if (profileError) {
      // This is a bigger issue. The auth user was created, but not the profile.
      // In a real production app, you might want to add logic to delete the auth user.
      // For now, we'll just log it.
      console.error("Sign-up Profile Error:", profileError.message);
      return NextResponse.json(
        { error: "Could not create user profile." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Signup successful! Please check your email to confirm your account.",
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("Signup API Error:", e);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
