import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { prisma } from '@/lib/db';
import { PaymentService, PaymentGateway } from '@/lib/payment';

export async function POST(req: NextRequest) {
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
