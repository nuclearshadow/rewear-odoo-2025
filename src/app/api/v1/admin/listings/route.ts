// src/app/api/v1/admin/listings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Helper function to check for admin role
const isAdmin = async (req: NextRequest): Promise<boolean> => {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return false;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return false;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  return !profileError && profile.role === "admin";
};

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data: listings, error } = await supabaseAdmin
      .from("items")
      .select("id, title, created_at, status, profiles(id, username)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(listings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
