// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin, createUserSupabaseClient } from '@/lib/supabase'

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    if (pathname.startsWith('/api/v1/auth')) {
        return NextResponse.next()
    }

    const token = req.cookies.get('access_token')?.value

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseUserClient = createUserSupabaseClient(token)

    const { data: { user }, error } = await supabaseUserClient.auth.getUser()
    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // get user profile with admin client
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return NextResponse.json({ error: 'Forbidden: profile missing' }, { status: 403 })
    }

    // protect admin-only routes
    if (pathname.startsWith('/api/v1/admin')) {
        if (profile.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: admin only' }, { status: 403 })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/api/v1/:path*',
    ],
}
