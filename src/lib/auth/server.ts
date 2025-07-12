// src/lib/auth/server.ts
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";

export const getAdminUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  // Validate the token to get the user
  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user) {
    console.warn("Admin Check Failed: Invalid Token", userError?.message);
    redirect("/login");
  }

  // Now, fetch the profile to check the role
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    console.warn("Admin Check Failed: User is not an admin.");
    redirect("/"); // Redirect non-admins to the homepage
  }

  // If all checks pass, return the admin user object
  return user;
};
