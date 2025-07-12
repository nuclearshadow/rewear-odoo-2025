import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabaseAdmin
        .from('swaps')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });

    // Optionally, check if user is part of the swap
    if (data.requester_user_id !== user.id && data.responder_user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(data);
}

// PATCH /api/v1/swaps/:id → update status
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { status } = body;

    if (!['accepted', 'rejected', 'cancelled', 'completed'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    let updateData: Record<string, any> = { status, updated_at: new Date().toISOString() };

    // set accepted_at / completed_at / cancelled_by depending on new status
    if (status === 'accepted') updateData.accepted_at = new Date().toISOString();
    if (status === 'completed') updateData.completed_at = new Date().toISOString();
    if (status === 'cancelled') updateData.cancelled_by = user.id;

    const { data, error } = await supabaseAdmin
        .from('swaps')
        .update(updateData)
        .eq('id', params.id)
        .select('*')
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
