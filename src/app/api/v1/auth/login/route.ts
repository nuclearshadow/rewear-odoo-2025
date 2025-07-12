import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { emailOrUsername, password } = body

    if (!emailOrUsername || !password) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    )

    let email = emailOrUsername

    // If input doesn't look like an email, treat it as username
    if (!emailOrUsername.includes('@')) {
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('email')
            .eq('username', emailOrUsername)
            .single()

        if (profileError || !profile?.email) {
            return NextResponse.json({ error: 'Invalid username' }, { status: 401 })
        }
        email = profile.email
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session || !data.user) {
        return NextResponse.json({ error: error?.message ?? 'Invalid login' }, { status: 401 })
    }

    const accessToken = data.session.access_token
    const userId = data.user.id

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
