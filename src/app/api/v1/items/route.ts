// app/api/v1/items/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')

    let query = supabaseAdmin.from('items').select('*').eq('status', 'available')

    if (category) query = query.eq('category', category)
    if (tag) query = query.contains('tags', [tag])

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const user = await getUserFromRequest(req)!
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, category, type, size, condition, tags, images } = body

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
