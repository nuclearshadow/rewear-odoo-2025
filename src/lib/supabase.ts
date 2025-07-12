// lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const anonKey = process.env.SUPABASE_ANON_KEY!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client → use carefully (bypasses RLS)
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, serviceRoleKey)

// Factory → creates a client with user's access token (for auth checks)
export function createUserSupabaseClient(token: string): SupabaseClient {
    return createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
    })
}
