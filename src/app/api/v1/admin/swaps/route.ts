import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// middleware already ensures only admins reach here
export async function GET(req: NextRequest) {
  const { data, error } = await supabaseAdmin
    .from('swaps')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
