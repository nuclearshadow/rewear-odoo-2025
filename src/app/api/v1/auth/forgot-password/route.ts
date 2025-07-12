// src/app/api/v1/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // resetPasswordForEmail handles sending the email automatically.
  // It requires email templates to be set up in your Supabase project settings.
  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`, // This is the page where the user will be sent from the email link
  });

  if (error) {
    console.error("Forgot Password Error:", error.message);
    // IMPORTANT: For security, don't reveal if an email exists or not.
    // Always return a generic success message.
  }

  return NextResponse.json({
    message:
      "If an account exists for this email, a password reset link has been sent.",
  });
}
