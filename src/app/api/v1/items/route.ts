import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth'

// Helper to upload base64 image to Supabase and get public URL
async function uploadImage(base64: string, userId: string, index: number) {
  const matches = base64.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 image");

  const contentType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  const filePath = `items/${userId}/${Date.now()}_${index}.jpg`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("item-images")
    .upload(filePath, buffer, {
      contentType,
      upsert: true,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabaseAdmin.storage
    .from("item-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// GET /api/v1/items
// Public browse - return available items excluding user's own items if logged in
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')

    const user = await getUserFromRequest(req)

    let query = supabaseAdmin
        .from('items')
        .select('*')
        .eq('status', 'available')

    if (user) {
        query = query.neq('user_id', user.id)
    }

    if (category) query = query.eq('category', category)
    if (tag) query = query.contains('tags', [tag])

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

// POST /api/v1/items
// Add new item - requires logged in user

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  console.log("User:", user);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, category, type, size, condition, tags, images } = body;

  if (!title || !description || !category || !type || !size || !condition) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
   // Normalize tags: allow string (comma-separated) or array
  let normalizedTags: string[] = [];
  if (typeof tags === 'string') {
    normalizedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  } else if (Array.isArray(tags)) {
    normalizedTags = tags;
  }

  try {
    const uploadedImageUrls: string[] = [];

    if (Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        const publicUrl = await uploadImage(images[i], user.id, i);
        uploadedImageUrls.push(publicUrl);
      }
    }

    const { data, error } = await supabaseAdmin
      .from("items")
      .insert([{
        title,
        description,
        category,
        type,
        size,
        condition,
        tags:normalizedTags,
        images: uploadedImageUrls,
        status: "available",
        user_id: user.id,
      }])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("Image upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
