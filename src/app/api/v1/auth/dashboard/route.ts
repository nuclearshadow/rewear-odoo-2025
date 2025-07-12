// src/app/api/v1/dashboard/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    // --- Authentication (reusing the same secure pattern) ---
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // --- Data Fetching ---

    // Query 1: Fetch the user's own listings (4 most recent)
    const { data: myListings, error: listingsError } = await supabaseAdmin
      .from("items")
      .select("id, title, points_cost, item_images(image_url)") // Get only what's needed for the card
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(4);

    if (listingsError) throw listingsError;

    // Query 2: Fetch items the user has acquired via swaps (4 most recent)
    // This query is more complex, getting items via the swaps table
    const { data: swapData, error: swapsError } = await supabaseAdmin
      .from("swaps")
      // This nested select is powerful: from 'swaps', go to the related 'items' table...
      .select("items(*, item_images(image_url))")
      // ...and get the related images for that item.
      .eq("requester_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(4);

    if (swapsError) throw swapsError;

    // The data is nested, so we extract the 'items' from each swap record
    const myPurchases = swapData.map((swap) => swap.items);

    // --- Response ---
    return NextResponse.json({
      myListings,
      myPurchases,
    });
  } catch (e: any) {
    console.error("Dashboard API Error:", e.message);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
