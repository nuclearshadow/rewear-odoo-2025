import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { email, password, username, display_name } = body

    if (!email || !password || !username) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    )

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error || !data.user) {
        return NextResponse.json({ error: error?.message ?? 'Registration failed' }, { status: 400 })
    }

    const userId = data.user.id

    // Insert into profiles table
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
            id: userId,
            email,
            username,
            display_name: display_name ?? '',
            avatar_url: null,
            points: 0,
            role: 'user'
        })

    if (profileError) {
        // Roll back: delete the auth user if profile insert fails
        await supabaseAdmin.auth.admin.deleteUser(userId)
        return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    // confirm email doesn't send access token
    // const accessToken = data.session?.access_token

    // if (!accessToken) {
    //     return NextResponse.json({ error: 'No session returned' }, { status: 400 })
    // }

    const res = NextResponse.json({
        user: { id: userId, email, username }
    })

    // res.cookies.set('access_token', accessToken, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'lax',
    //     maxAge: 60 * 60 * 24 * 7,
    //     path: '/',
    // })

    return res
}
