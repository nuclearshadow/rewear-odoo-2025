import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth'

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
    const user = await getUserFromRequest(req)
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, category, type, size, condition, tags, images } = body

    if (!title || !description || !category || !type || !size || !condition) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
        .from('items')
        .insert([{
            title,
            description,
            category,
            type,
            size,
            condition,
            tags,
            images,
            status: 'available',
            user_id: user.id
        }])
        .select('*')
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
}
