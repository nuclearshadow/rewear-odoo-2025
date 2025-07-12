import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/v1/items/[id]
// Fetch single item by ID
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const itemId = params.id

    const { data, error } = await supabaseAdmin
        .from('items')
        .select(`
            id,
            title,
            price,
            status,
            created_at,
            profiles (
            id,
            username,
            avatar_url
            )
        `)
        .eq('id', itemId)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(data)
}
