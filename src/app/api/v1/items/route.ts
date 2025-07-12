// app/api/v1/items/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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
    const body = await req.json()

    // TODO: validate auth, get userId from token
    // example: const { data: { user } } = await supabase.auth.getUser(access_token)

    const { title, description, category, type, size, condition, tags, images } = body

    const { data, error } = await supabaseAdmin
        .from('items')
        .insert([{
            title, description, category, type, size, condition, tags, images,
            status: 'available', user_id: 'some-user-id' // replace with real user id!
        }])
        .select('*')
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
}
