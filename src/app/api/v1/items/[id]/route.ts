// src/app/api/v1/items/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// The second argument `context` contains our dynamic route parameters
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // Extract the item ID from the URL

    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required." },
        { status: 400 }
      );
    }

    // This is the most detailed query we've written so far.
    // It gets the item, ALL of its images, AND the public profile of the uploader.
    const { data: item, error } = await supabaseAdmin
      .from("items")
      .select(
        `
        *,
        item_images(id, image_url),
        profiles(id, username)
      `
      )
      .eq("id", id)
      .eq("status", "available") // Only show publicly available items
      .single(); // Use .single() because we expect only one result

    if (error) {
      // This will trigger if the item is not found or not available
      console.error("Item fetch error:", error.message);
      return NextResponse.json(
        { error: "Item not found or not available." },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (e: any) {
    console.error("API Error:", e.message);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
