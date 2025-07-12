import { NextRequest } from 'next/server'
import { createUserSupabaseClient } from './supabase'

export async function getUserFromRequest(req: NextRequest) {
    const token = req.cookies.get('access_token')?.value
    if (!token) return null

    const supabase = createUserSupabaseClient(token)
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
}
