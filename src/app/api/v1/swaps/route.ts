import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { responder_user_id, requester_item_id, responder_item_id, message } = body;

    if (!responder_user_id || !requester_item_id || !responder_item_id) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from('swaps')
        .insert([{
            requester_user_id: user.id,
            responder_user_id,
            requester_item_id,
            responder_item_id,
            message
        }])
        .select('*')
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}

// GET /api/v1/swaps → get swaps for current user
export async function GET(req: NextRequest) {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabaseAdmin
        .from('swaps')
        .select('*')
        .or(`requester_user_id.eq.${user.id},responder_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
