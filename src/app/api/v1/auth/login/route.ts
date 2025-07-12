import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { email, password } = body

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session || !data.user) {
        return NextResponse.json({ error: error?.message ?? 'Invalid login' }, { status: 401 })
    }

    const accessToken = data.session.access_token
    const userId = data.user.id

    // Fetch profile from profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id, username, avatar_url, points, role')
        .eq('id', userId)
        .single()

    if (profileError || !profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const res = NextResponse.json({
        user: { id: userId, email: data.user.email },
        profile
    })

    res.cookies.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    })

    return res
}
