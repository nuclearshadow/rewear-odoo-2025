import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/v1/admin/swaps/:id
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { data, error } = await supabaseAdmin
        .from('swaps')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: error?.message || 'Swap not found' }, { status: 404 });
    }

    return NextResponse.json(data);
}

// PATCH /api/v1/admin/swaps/:id
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = await req.json();
    const { status } = body;

    if (!['accepted', 'rejected', 'cancelled', 'completed'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    let updateData: Record<string, any> = { status, updated_at: new Date().toISOString() };

    if (status === 'accepted') updateData.accepted_at = new Date().toISOString();
    if (status === 'completed') updateData.completed_at = new Date().toISOString();
    if (status === 'cancelled') updateData.cancelled_by = null; // admin cancels

    const { data, error } = await supabaseAdmin
        .from('swaps')
        .update(updateData)
        .eq('id', params.id)
        .select('*')
        .single();

    if (error || !data) {
        return NextResponse.json({ error: error?.message || 'Failed to update swap' }, { status: 500 });
    }

    return NextResponse.json(data);
}
