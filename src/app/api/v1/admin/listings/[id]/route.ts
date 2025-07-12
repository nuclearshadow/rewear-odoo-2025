// src/app/api/v1/admin/listings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// --- THIS IS THE COMPLETE HELPER FUNCTION ---
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

  // Check for no errors AND if the role is 'admin'
  return !profileError && profile.role === "admin";
};
// --- END OF HELPER FUNCTION ---

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Now we can use the isAdmin function correctly
    if (!(await isAdmin(req))) {
      return NextResponse.json(
        { error: "Forbidden: You do not have admin privileges." },
        { status: 403 }
      );
    }

    const { id } = params;
    const { status } = await req.json(); // status will be 'available' or 'rejected'

    if (!status || !["available", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status provided." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("items")
      .update({ status: status })
      .eq("id", id)
      .select() // Return the updated row
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    // Return a more specific error for the client if possible
    const errorMessage = err.message || "An internal server error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
